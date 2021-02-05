const chef = require('cyberchef');
const fp = require('lodash/fp');
const { UNSUPPORTED_ARG_TYPES, SUPPORTED_INPUT_OUTPUT_TYPES } = require('./constants');

const searchOperations = ({ term }, options, callback, Logger) => {
  try {
    const foundOperations = fp.flow(
      chef.help,
      fp.filter(operationsWeCantCurrentlyRun),
      fp.map((operation) => ({
        ...operation,
        description: fp.flow(
          fp.get('description'),
          fp.split(/<br>|<br\/>/gi),
          fp.join(' '),
          fp.split(/<[^>]*>/gi),
          fp.join('')
        )(operation)
      })),
      fp.slice(0, 150)
    )(term);

    callback(null, { foundOperations });
  } catch (error) {
    Logger.error(
      error,
      { detail: 'Failed to Get Operations from CyberChef' },
      'Get Operations Failed'
    );
    return callback({
      errors: [
        {
          err: error,
          detail: error.message
        }
      ]
    });
  }
};

const operationsWeCantCurrentlyRun = (operation) => {
  const operationIncludesUnsupportedArgTypes = fp.flow(
    fp.get('args'),
    fp.some(fp.flow(fp.get('type'), fp.includes(fp.__, UNSUPPORTED_ARG_TYPES)))
  )(operation);

  const operationIncludesUnsupportedInputOrOutputTypes =
    !SUPPORTED_INPUT_OUTPUT_TYPES.includes(fp.get('inputType', operation)) ||
    !SUPPORTED_INPUT_OUTPUT_TYPES.includes(fp.get('outputType', operation));
  

  return (
    !operation.flowControl &&
    !operationIncludesUnsupportedArgTypes &&
    !operationIncludesUnsupportedInputOrOutputTypes
  );
};


module.exports = { searchOperations, operationsWeCantCurrentlyRun };