const chef = require('cyberchef');

const fp = require('lodash/fp');
const getDisplayResults = require('./getDisplayResults');

const asyncReduceArray = async (func, input, agg = [], index = 0) =>
  input.length === index
    ? agg
    : await asyncReduceArray(
        func,
        input,
        await func(agg, input[index], index),
        index + 1
      );


const calulateOutputs = async (
  entityValue,
  operations,
  options,
  Logger,
  initialRun = false
) =>
  asyncReduceArray(async (agg, operation, index) => {
    const thisStepsInput = new chef.Dish(
      index === 0 ? entityValue : agg[index - 1].result
    );

    if (index !== 0 && agg[index - 1].outputError) {
      return [
        ...agg,
        {
          ...operation,
          outputError: true,
          displayResult: 'Previous Step Contained Error',
          outputLength: '0',
          outputLines: '0'
        }
      ];
    }
    if (operation.__disabled) {
      return [
        ...agg,
        {
          ...operation,
          result: thisStepsInput,
          outputError: false,
          displayResult: options.dontShowStepResults
            ? index === 0
              ? entityValue
              : operations[index - 1].displayResult
            : '',
          outputLength: '0',
          outputLines: '0',
          ...(initialRun && { __expanded: index === operations.length - 1 })
        }
      ];
    }

    const step = {
      op: operation.name,
      args: fp.flatMap(
        fp.map((operationArg) =>
          fp.flow(
            fp.get('selectedValue'),
            operationArg.type === 'number' ? fp.toNumber : fp.identity
          )(operationArg)
        ),
        operation.args
      )
    };

    let currentStepResult, displayResults;
    try {
      currentStepResult = await chef.bake(thisStepsInput, step);
      displayResults = getDisplayResults(currentStepResult);
    } catch (e) {
      Logger.error(e, { currentStepResult, step });
      return [
        ...agg,
        {
          ...operation,
          outputError: true,
          displayResult: fp.flow(
            fp.trim,
            fp.split(/\r\n|\r|\n|<br\/>/gi),
            fp.join('<br/>')
          )(e.message),
          outputLength: '0',
          outputLines: '0',
          ...(initialRun && { __expanded: index === operations.length - 1 })
        }
      ];
    }

    return [
      ...agg,
      {
        ...operation,
        ...displayResults,
        result: currentStepResult,
        outputError: false,
        ...(initialRun && { __expanded: index === operations.length - 1 })
      }
    ];
  }, fp.map(fp.omit(['result', 'displayResult']), operations));

module.exports = calulateOutputs;
