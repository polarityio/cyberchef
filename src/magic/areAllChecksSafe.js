const fp = require('lodash/fp');
const reduce = require('lodash/fp/reduce').convert({ cap: false });

const OperationConfig = require('./OperationConfig.json');
const { isRegexSafe } = require('./utils');

let opCriteria;

const areAllChecksSafe = (inputStr) => {
  opCriteria = opCriteria || generateOpCriteria();

  return fp.every((check) => isRegexSafe(inputStr, check.pattern), opCriteria);
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

module.exports = areAllChecksSafe;
