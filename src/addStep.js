const fp = require('lodash/fp');
const groupOperationArgs = require('./groupOperationArgs');

const addStep = ({ operations, selectedOperation }, options, callback, Logger) => {
  try {
    const operationsWithNewStep = fp.concat(
      operations,
      groupOperationArgs([{ ...selectedOperation, __expanded: true }])
    );
    
    callback(null, { operationsWithNewStep });
  } catch (error) {
    Logger.error(
      error,
      { detail: 'Failed to Add Step to CyberChef Recipe' },
      'Add Step Failed'
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

module.exports = addStep;
