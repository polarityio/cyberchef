const calulateOutputs = require('./calulateOutputs');

const runBake = async ({ entityValue, newOperations }, options, callback, Logger) => {
  let timeoutTimer;
  try {
    timeoutTimer = setTimeout(() => {
      callback(null, {
        operations: [
          ...newOperations.slice(0, newOperations.length - 1),
          {
            ...newOperations[newOperations.length - 1],
            displayResult: "Your Recipe took too long to run and has timed out.",
            outputLength: 51,
            outputLines: 1,
            outputError: true
          }
        ]
      });
    }, 14000);

    const operations = await calulateOutputs(entityValue, newOperations, options, Logger);

    clearTimeout(timeoutTimer);

    return callback(null, { operations });
  } catch (error) {
    Logger.error(error, { detail: 'Failed to Running Bake in CyberChef' }, 'Bake Failed');
    clearTimeout(timeoutTimer);
    
    return callback(null, {
      operations: [
        ...newOperations.slice(0, newOperations.length - 1),
        { ...newOperations[newOperations.length - 1],
          displayResult: error.messageoutputError,
          outputError: true
        }
      ]
    });
  }
};

module.exports = runBake;