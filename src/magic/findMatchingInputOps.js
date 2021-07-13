const reduce = require('lodash/fp/reduce').convert({ cap: false });

const OperationConfig = require('./OperationConfig.json');
const { runSafeRegex } = require('./utils');

let opCriteria;

const findMatchingInputOps = (inputEntropy, inputStr) => {
  opCriteria = opCriteria || generateOpCriteria();

  const matches = reduce(
    (agg, check) => {
      const inputOutOfRequiredEntropyRange =
        check.entropyRange &&
        (inputEntropy < check.entropyRange[0] || inputEntropy > check.entropyRange[1]);

      const patternDoesntMatchInput =
        check.pattern && !runSafeRegex(inputStr, check.pattern);

      return inputOutOfRequiredEntropyRange || patternDoesntMatchInput
        ? agg
        : agg.concat(check);
    },
    [],
    opCriteria
  );

  return matches;
};

const generateOpCriteria = () =>
  reduce(
    (agg, operationDetails, operationName) =>
      !operationDetails.checks
        ? agg
        : agg.concat(
            operationDetails.checks.map((check) => ({
              op: operationName,
              pattern: check.pattern ? new RegExp(check.pattern, check.flags) : null,
              args: check.args,
              useful: check.useful,
              entropyRange: check.entropyRange,
              output: check.output
            }))
          ),
    []
  )(OperationConfig);

module.exports = findMatchingInputOps;
