'use strict';

const IGNORE_OPERATION_COMPARISON_KEYS = [
  '__expanded',
  'displayResult',
  'result',
  'outputLength',
  'outputLines',
  'recipeLinkWithoutInput',
  'recipeLink',
  'outputError'
];

const objectsDeepEquals = (a, b) => {
  if (a === b) return true;

  if (typeof a != 'object' || typeof b != 'object' || a == null || b == null)
    return false;

  let keysA = Object.keys(a).filter(
      (key) => !IGNORE_OPERATION_COMPARISON_KEYS.includes(key)
    ),
    keysB = Object.keys(b).filter(
      (key) => !IGNORE_OPERATION_COMPARISON_KEYS.includes(key)
    );

  if (keysA.length != keysB.length) return false;

  for (let key of keysA) {
    if (!keysB.includes(key)) return false;

    if (typeof a[key] === 'function' || typeof b[key] === 'function') {
      if (a[key].toString() != b[key].toString()) return false;
    } else {
      if (!objectsDeepEquals(a[key], b[key])) return false;
    }
  }

  return true;
};

const cloneDeep = (entity, cache = new WeakMap()) => {
  const referenceTypes = ['Array', 'Object'];
  const entityType = Object.prototype.toString.call(entity);
  if (!new RegExp(referenceTypes.join('|')).test(entityType)) return entity;
  if (cache.has(entity)) {
    return cache.get(entity);
  }
  const c = new entity.constructor();
  cache.set(entity, c);
  return Object.assign(
    c,
    ...Object.keys(entity).map((prop) => ({ [prop]: cloneDeep(entity[prop], cache) }))
  );
};

polarity.export = PolarityComponent.extend({
  details: Ember.computed.alias('block.data.details'),
  entityValue: Ember.computed.alias('block.entity.value'),
  operations: Ember.computed.alias('details.operations'),
  url: Ember.computed.alias('block.userOptions.url'),
  inputHash: Ember.computed.alias('details.inputHash'),
  fullRecipeLink: '',
  inputLength: 0,
  inputLines: 0,
  operationLengthMinusOne: 0,
  searchErrorMessage: '',
  selectedOperation: undefined,
  init() {
    // Setting Up Input Section Length and Lines
    this.set('inputLength', this.get('entityValue').length);
    const newEntityValue = this.get('entityValue')
      .trim()
      .split(/\r\n|\r|\n/gi)
      .join('<br/>');

    this.set('entityValue', newEntityValue);
    this.set('inputLines', newEntityValue.split('<br/>').length);

    // Setting operationLengthMinusOne as the 'sub' ember helper doesn't currently work
    this.set('operationLengthMinusOne', this.get('operations').length - 1);

    const operations = this.updateLinks(this.get('operations'));
    this.set('operations', operations);
    this.set('previousOperations', cloneDeep(operations));

    this._super(...arguments);
  },
  observer: Ember.on(
    'willUpdate',
    Ember.observer('operations', function () {
      const newOperations = this.get('operations');
      if (
        !objectsDeepEquals(newOperations, this.get('previousOperations')) &&
        newOperations.length
      ) {
        this.sendIntegrationMessage({
          action: 'runBake',
          data: { entityValue: this.block.entity.value, newOperations }
        })
          .then(({ operations }) => {
            console.log("This ran")
            const operationsWithLinks = this.updateLinks(operations);
            this.set('operations', operationsWithLinks);
            this.set('previousOperations', cloneDeep(operationsWithLinks));
          })
          // Error handling will be displayed in operation output values
          .finally(() => {
            this.get('block').notifyPropertyChange('data');
          });
      }
    })
  ),
  updateLinks: function (operations) {
    const inputHash = this.get('inputHash');
    const url = this.get('url');
    const operationsWithUpdatedLinks = operations.reduce((agg, operation, index) => {
      const operationString = `${operation.name
        .split(' ')
        .join('_')}(${operation.args
        .map((operationArgGroup) =>
          operationArgGroup.map((operationArg) =>
            encodeURIComponent(
              JSON.stringify(operationArg.selectedValue).split('"').join("'")
            )
          )
        )
        .flat()})`;

      const recipeLinkWithoutInput =
        index === 0
          ? `${url}/#recipe=${operationString}`
          : `${agg[index - 1].recipeLinkWithoutInput}${operationString}`;

      return [
        ...agg,
        Object.assign(operation, {
          recipeLinkWithoutInput: recipeLinkWithoutInput,
          recipeLink: `${recipeLinkWithoutInput}&input=${inputHash}`
        })
      ];
    }, []);

    this.set(
      'fullRecipeLink',
      operationsWithUpdatedLinks[operationsWithUpdatedLinks.length - 1].recipeLink
    );

    return operationsWithUpdatedLinks;
  },
  searchOperations: function (term, resolve, reject) {
    this.set('searchErrorMessage', '');
    this.get('block').notifyPropertyChange('data');

    this.sendIntegrationMessage({
      action: 'searchOperations',
      data: {
        term: term || ' '
      }
    })
      .then(({ foundOperations }) => {
        this.set('foundOperations', foundOperations);
      })
      .catch((err) => {
        this.set(
          'searchErrorMessage',
          'Search Operations Failed: ' +
            (err &&
              (err.detail || err.err || err.message || err.title || err.description)) ||
            'Unknown Reason'
        );
      })
      .finally(() => {
        this.get('block').notifyPropertyChange('data');
        setTimeout(() => {
          this.set('searchErrorMessage', '');
          this.get('block').notifyPropertyChange('data');
        }, 5000);
        resolve();
      });
  },
  actions: {
    // UI Logic Actions
    toggleOperationView: function (operationIndex) {
      const operations = this.get('operations');
      const operationToToggle = operations[operationIndex];

      this.set('operations', [
        ...operations.slice(0, operationIndex),
        Object.assign({}, operationToToggle, {
          __expanded: !operationToToggle.__expanded
        }),
        ...operations.slice(operationIndex + 1, operations.length)
      ]);
      this.get('block').notifyPropertyChange('data');
    },
    moveOperationUp: function (operationIndex) {
      const operations = this.get('operations');
      const operationToMove = operations[operationIndex];

      this.set('operations', [
        ...operations.slice(0, operationIndex - 1),
        operationToMove,
        ...operations.slice(operationIndex - 1, operationIndex),
        ...operations.slice(operationIndex + 1, operations.length)
      ]);

      //TODO: will eventually need to transfer logic to server to recalculate
      this.get('block').notifyPropertyChange('data');
    },
    moveOperationDown: function (operationIndex) {
      const operations = this.get('operations');
      const operationToMove = operations[operationIndex];

      this.set('operations', [
        ...operations.slice(0, operationIndex),
        ...operations.slice(operationIndex + 1, operationIndex + 2),
        operationToMove,
        ...operations.slice(operationIndex + 2, operations.length)
      ]);

      //TODO: will eventually need to transfer logic to server to recalculate
      this.get('block').notifyPropertyChange('data');
    },

    // Argument Changing Actions
    changeArgSelector: function (operationIndex, groupIndex, argumentIndex, e) {
      //TODO: Will need to finish this function and get the argSelector argument working in a V2 of the Integration
      const selectedOptionIndex = e.target.value;

      const operations = this.get('operations');
      const selectedOperation = operations[operationIndex];
      const operationArgs = selectedOperation.args;
      const argsWithoutGrouping = operationArgs.flat();

      const selectOptionValue =
        operationArgs[groupIndex][argumentIndex].value[selectedOptionIndex];

      const argNamesToTurnOff = (selectOptionValue.off || []).map(
        (argumentIndexToHide) => argsWithoutGrouping[argumentIndexToHide].name
      );

      const operationArgsWithCorrectArgsHidden = operationArgs.map(
        (operationArgGroup, _groupIndex) =>
          operationArgGroup.map((operationArg, _argumentIndex) =>
            Object.assign(
              {},
              operationArg,
              {
                hide: argNamesToTurnOff.includes(operationArg.name)
              },
              _groupIndex === groupIndex && _argumentIndex === argumentIndex
                ? {
                    value: operationArg.value.map((option, optionIndex) =>
                      Object.assign({}, option, {
                        selected: optionIndex === selectedOptionIndex
                      })
                    )
                  }
                : {}
            )
          )
      );

      this.set('operations', [
        ...operations.slice(0, operationIndex),
        Object.assign({}, selectedOperation, {
          args: operationArgsWithCorrectArgsHidden
        }),
        ...operations.slice(operationIndex + 1, operations.length)
      ]);
    },
    editOptionInputValue: function (operationIndex, groupIndex, argumentIndex, e) {
      const selectedOptionIndex = e.target.value;

      const operations = this.get('operations');
      let selectedOperation = operations[operationIndex];
      const operationArgs = selectedOperation.args;

      const selectOptionValue =
        operationArgs[groupIndex][argumentIndex].value[selectedOptionIndex].value;

      operationArgs[groupIndex][argumentIndex].selectedValue = selectOptionValue;

      this.set('operations', [
        ...operations.slice(0, operationIndex),
        Object.assign({}, selectedOperation, {
          args: operationArgs
        }),
        ...operations.slice(operationIndex + 1, operations.length)
      ]);

      this.get('block').notifyPropertyChange('data');
    },

    // Right Hand Button Actions
    saveRecipe: function () {
      console.log('saveRecipe');
    },
    loadRecipe: function () {
      console.log('loadRecipe');
    },
    clearRecipe: function () {
      this.set('operations', []);
      this.get('block').notifyPropertyChange('data');
    },
    disableOperation: function (operationIndex) {
      const operations = this.get('operations');
      const operationToDisable = operations[operationIndex];

      this.set('operations', [
        ...operations.slice(0, operationIndex),
        Object.assign({}, operationToDisable, {
          __disabled: !operationToDisable.__disabled
        }),
        ...operations.slice(operationIndex + 1, operations.length)
      ]);
    },
    deleteOperation: function (operationIndex) {
      const operations = this.get('operations');
      this.set('operationLengthMinusOne', operations.length - 2);

      this.set('operations', [
        ...operations.slice(0, operationIndex),
        ...operations.slice(operationIndex + 1, operations.length)
      ]);
    },

    // Operation Adding Actions
    searchOperations: function (term) {
      return new Ember.RSVP.Promise((resolve, reject) => {
        Ember.run.debounce(this, this.searchOperations, term, resolve, reject, 600);
      });
    },

    addStep: function () {
      if (!this.get('selectedOperation')) {
        this.set('searchErrorMessage', 'Must Select an Operation');
        this.get('block').notifyPropertyChange('data');
        return setTimeout(() => {
          this.set('searchErrorMessage', '');
          this.get('block').notifyPropertyChange('data');
        }, 5000);
      }

      this.sendIntegrationMessage({
        action: 'addStep',
        data: {
          operations: this.get('operations'),
          selectedOperation: this.get('selectedOperation')
        }
      })
        .then(({ operationsWithNewStep }) => {
          console.log({ operationsWithNewStep });
          this.set('operations', this.updateLinks(operationsWithNewStep));
          this.set('operationLengthMinusOne', operationsWithNewStep.length - 1);
        })
        .catch((err) => {
          this.set(
            'searchErrorMessage',
            'Add Operations Failed: ' +
              (err &&
                (err.detail || err.err || err.message || err.title || err.description)) ||
              'Unknown Reason'
          );
        })
        .finally(() => {
          this.get('block').notifyPropertyChange('data');
          setTimeout(() => {
            this.set('searchErrorMessage', '');
            this.get('block').notifyPropertyChange('data');
          }, 5000);
        });
    }
  }
});
