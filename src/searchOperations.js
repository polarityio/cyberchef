const chef = require('cyberchef');
const fp = require('lodash/fp');
const { UNSUPPORTED_ARG_TYPES } = require('./constants');

const searchOperations = ({ term }, options, callback, Logger) => {
  try {
    const foundOperations = fp.flow(
      chef.help,
      fp.filter(operationsWeCantCurrentlyRun),
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

  return !operation.flowControl && !operationIncludesUnsupportedArgTypes;
};


module.exports = { searchOperations, operationsWeCantCurrentlyRun };