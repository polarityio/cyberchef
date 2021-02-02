const calulateOutputs = require('./calulateOutputs');

const runBake = ({ entityValue, newOperations }, options, callback, Logger) => {
  try {
    const operations = calulateOutputs(entityValue, newOperations, Logger);

    return callback(null, { operations });
  } catch (error) {
    Logger.error(error, { detail: 'Failed to Running Bake in CyberChef' }, 'Bake Failed');
    // Errors are dealt with on the operation level.
    return callback(null, { operations: newOperations });
  }
};

module.exports = runBake;