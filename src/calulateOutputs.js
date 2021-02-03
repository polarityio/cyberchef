const chef = require('cyberchef');

const fp = require('lodash/fp');
const getDisplayResults = require('./getDisplayResults');

const calulateOutputs = async (
  entityValue,
  operations,
  Logger,
  initialRun = false,
  index = 0
) => {
  if (index === operations.length) return operations;

  const operation = operations[index];

  const thisStepsInput = index === 0 ? entityValue : operations[index - 1].result;

  if (index !== 0 && operations[index - 1].outputError) {
    operations[index] = Object.assign(operation, {
      outputError: true,
      displayResult: 'Previous Step Contained an Error',
      outputLength: '0',
      outputLines: '0'
    });

    return await calulateOutputs(entityValue, operations, Logger, initialRun, index + 1);
  }
  if (operation.__disabled) {
    operations[index] = Object.assign(operation, {
      result: thisStepsInput,
      outputError: false,
      displayResult: '',
      outputLength: '0',
      outputLines: '0',
      ...(initialRun && { __expanded: index === operations.length - 1 })
    });
    return await calulateOutputs(entityValue, operations, Logger, initialRun, index + 1);
  }

  const step = {
    op: operation.name,
    args: fp.flatMap(fp.map(fp.get('selectedValue')), operation.args)
  };

  let currentStepResult, displayResults;
  try {
    currentStepResult = await chef.bake(thisStepsInput, step);
    displayResults = getDisplayResults(currentStepResult);
  } catch (e) {
    Logger.error(e, { currentStepResult, step });
    operations[index] = Object.assign(operation, {
      outputError: true,
      displayResult: fp.flow(
        fp.trim,
        fp.split(/\r\n|\r|\n|<br\/>/gi),
        fp.join('<br/>')
      )(e.message),
      outputLength: '0',
      outputLines: '0',
      ...(initialRun && { __expanded: index === operations.length - 1 })
    });
    return await calulateOutputs(entityValue, operations, Logger, initialRun, index + 1);
  }

  operations[index] = Object.assign(operation, {
    result: currentStepResult,
    outputError: false,
    ...displayResults,
    ...(initialRun && { __expanded: index === operations.length - 1 })
  });
  return await calulateOutputs(entityValue, operations, Logger, initialRun, index + 1);
};


module.exports = calulateOutputs;
