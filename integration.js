const chef = require('cyberchef');
const _ = require('lodash');
const fp = require('lodash/fp');
const calulateOutputs = require('./src/calulateOutputs');
const groupOperationArgs = require('./src/groupOperationArgs');
const runBake = require('./src/runBake');
const searchOperations = require('./src/searchOperations');
const addStep = require('./src/addStep');
const { OPERATIONS } = require('./src/constants');

let Logger;

function startup(log) {
  Logger = log;
}

const doLookup = async (entities, options, cb) => {
  Logger.debug({ entities }, 'Entities');
  options.url = options.url.endsWith('/') ? options.url.slice(0, -1) : options.url;

  const lookupResults = fp.compact(
    await Promise.all(
      fp.map(async (entity) => {
        if (fp.flow(fp.get('value'), fp.trim, fp.size)(entity) <= options.minLength)
          return;

        let output = await _magicDecode(entity.value);
        let jsonOutput = JSON.parse(output);
        Logger.trace({ jsonOutput }, 'Output from CyberChef');

        return {
          entity,
          isVolatile: true,
          data: {
            summary: [],
            details: {
              inputHash: _.trim(Buffer.from(entity.value).toString('base64'), '='),
              operations: calulateOutputs(
                entity.value,
                groupOperationArgs(OPERATIONS),
                Logger,
                true
              )
            }
          }
        };
      }, entities)
    )
  );


  cb(null, lookupResults);
};


const _magicDecode = async (string) => {
  let ascii = await chef.magic(string);
  return ascii.toString();
};

const getOnMessage = { runBake, searchOperations, addStep };

const onMessage = ({ action, data: actionParams }, options, callback) =>
  getOnMessage[action](actionParams, options, callback, Logger);

module.exports = {
  doLookup,
  startup,
  onMessage
};
