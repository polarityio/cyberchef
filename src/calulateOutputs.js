
const chef = require('cyberchef');

const fp = require('lodash/fp');
const reduce = require('lodash/fp/reduce').convert({ cap: false });

const calulateOutputs = (entityValue, operations, Logger, initialRun = false, index = 0) => {
  if (index === operations.length) {
    return operations;
  }

  const operation = operations[index];

  const thisStepsInput = index === 0 ? entityValue : operations[index - 1].result;

  if (index !== 0 && operations[index - 1].outputError) {
    operations[index] = Object.assign(operation, {
      outputError: true,
      displayResult: 'Previous Step Contained an Error',
      outputLength: '0',
      outputLines: '0'
    });

    return calulateOutputs(entityValue, operations, Logger, initialRun, index + 1);
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
    return calulateOutputs(entityValue, operations, Logger, initialRun, index + 1);
  }

  const step = {
    op: operation.name,
    args: fp.flatMap(fp.map(fp.get('selectedValue')), operation.args)
  };

  let currentStepResult;
  try {
    currentStepResult = chef.bake(thisStepsInput, step);
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
    return calulateOutputs(entityValue, operations, Logger, initialRun, index + 1);
  }

  const displayResults = getDisplayResults(currentStepResult);

  operations[index] = Object.assign(operation, {
    result: currentStepResult,
    outputError: false,
    ...displayResults,
    ...(initialRun && { __expanded: index === operations.length - 1 })
  });
  return calulateOutputs(entityValue, operations, Logger, initialRun, index + 1);
};

// const calulateOutputs = (entityValue, operations, Logger, initialRun = false) =>
//   reduce(
//     (agg, operation, index) => {
//       const thisStepsInput = index === 0 ? entityValue : agg[index - 1].result;

//       if (index !== 0 && agg[index - 1].outputError) {
//         return [
//           ...agg,
//           {
//             ...operation,
//             outputError: true,
//             displayResult: 'Previous Step Contained Error',
//             outputLength: '0',
//             outputLines: '0'
//           }
//         ];
//       }
//       if (operation.__disabled) {
//         return [
//           ...agg,
//           {
//             ...operation,
//             result: thisStepsInput,
//             displayResult: '',
//             outputLength: '0',
//             outputLines: '0',
//             ...(initialRun && { __expanded: index === operations.length - 1 })
//           }
//         ];
//       }

//       const step = {
//         op: operation.name,
//         args: fp.flatMap(fp.map(fp.get('selectedValue')), operation.args)
//       };
//
//       let currentStepResult;
//       try {
//         currentStepResult = chef.bake(thisStepsInput, step);
//       } catch (e) {
//         Logger.error(e, { currentStepResult, step,  });
//         return [
//           ...agg,
//           {
//             ...operation,
//             outputError: true,
//             displayResult: fp.flow(
//               fp.trim,
//               fp.split(/\r\n|\r|\n|<br\/>/gi),
//               fp.join('<br/>')
//             )(e.message),
//             outputLength: '0',
//             outputLines: '0',
//             ...(initialRun && { __expanded: index === operations.length - 1 })
//           }
//         ];
//       }

//       const displayResults = getDisplayResults(currentStepResult);

//       return [
//         ...agg,
//         {
//           ...operation,
//           result: currentStepResult,
//           ...displayResults,
//           ...(initialRun && { __expanded: index === operations.length - 1 })
//         }
//       ];
//     },
//     [],
//     operations
//   );

const getStringDisplayResults = (currentStepResult) =>
  fp.flow(fp.trim, fp.split(/\r\n|\r|\n|<br\/>/gi), (stringOutputLines) => ({
    result: fp.join('\n')(stringOutputLines),
    displayResult: fp.join('<br/>')(stringOutputLines),
    outputLength: fp.flow(fp.join(' '), fp.size)(stringOutputLines),
    outputLines:
      fp.flow(fp.compact, fp.size)(stringOutputLines) === 0
        ? 0
        : fp.size(stringOutputLines)
  }))(currentStepResult);

const getDisplayResults = ({ type: resultType, value: resultValue }) =>
  (getDisplayTypeFunctions[resultType] || (() => {}))(resultValue) || {
    displayResult: resultValue,
    outputLength: resultValue.length,
    outputLines: fp.flow(
      (value) => value.toString(),
      fp.trim,
      fp.split(/\r\n|\r|\n|<br\/>/gi),
      fp.size
    )(resultValue)
  };

const getDisplayTypeFunctions = { 1: getStringDisplayResults };


module.exports = calulateOutputs;