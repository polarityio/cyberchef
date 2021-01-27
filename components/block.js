'use strict';

polarity.export = PolarityComponent.extend({
  details: Ember.computed.alias('block.data.details'),
  entityValue: Ember.computed.alias('block.entity.value'),
  operations: Ember.computed.alias('details.operations'),
  inputLength: 0,
  inputLines: 0,
  operationLengthMinusOne: 0,

  init() {
    // Setting Up Input Section Length and Lines
    this.set('inputLength', this.get('entityValue').length);
    const newEntityValue = this.get('entityValue')
      .trim()
      .split(/\r\n|\r|\n/gi)
      .join('<br/>');

    this.set('entityValue', newEntityValue);
    this.set('inputLines', newEntityValue.split('<br/>').length);

    console.log(this.operations);
    // Setting operationLengthMinusOne as the 'sub' ember helper doesn't currently work
    this.set('operationLengthMinusOne', this.get('operations').length - 1);

    this._super(...arguments);
  },
  actions: {
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
      const selectedOperation = operations[operationIndex];
      const operationArgs = selectedOperation.args;

      const selectOptionValue =
        operationArgs[groupIndex][argumentIndex].value[selectedOptionIndex].value;

      const operationArgsWithUpdatedValue = operationArgs.map(
        (operationArgGroup, _groupIndex) =>
          operationArgGroup.map((operationArg, _argumentIndex) =>
            Object.assign(
              {},
              operationArg,
              _groupIndex === groupIndex && _argumentIndex === argumentIndex
                ? {
                    selectedValue: selectOptionValue
                  }
                : {}
            )
          )
      );
      //TODO: Solve issue where it resets other dropdowns on screen

      this.set('operations', [
        ...operations.slice(0, operationIndex),
        Object.assign({}, selectedOperation, {
          args: operationArgsWithUpdatedValue
        }),
        ...operations.slice(operationIndex + 1, operations.length)
      ]);
    }
  }
});
