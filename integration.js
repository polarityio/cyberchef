const chef = require('cyberchef');
const _ = require('lodash');
const fp = require('lodash/fp');
const runBake = require('./src/runBake');
const { searchOperations } = require('./src/searchOperations');
const addStep = require('./src/addStep');
const runMagic = require('./src/runMagic');

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

        const magicResult = fp.get('value', await chef.magic(entity.value));

        const magicSuggestionsFound =
          fp.flow(fp.flatMap(fp.get('recipe')), fp.size)(magicResult) ||
          fp.flow(fp.flatMap(fp.get('matchingOps')), fp.size)(magicResult);

        return {
          entity,
          isVolatile: true,
          displayValue: `${entity.value.slice(0, 120)}${
            entity.value.length > 120 ? '...' : ''
          }`,
          data: {
            summary: magicSuggestionsFound
              ? ['Magic Suggestions Found']
              : ['No Magic Suggestions'],
            details: {
              inputHash: _.trim(Buffer.from(entity.value).toString('base64'), '='),
              operations: []
            }
          }
        };
      }, entities)
    )
  );

  cb(null, lookupResults);
};


const getOnMessage = { runBake, searchOperations, addStep, runMagic };

const onMessage = ({ action, data: actionParams }, options, callback) =>
  getOnMessage[action](actionParams, options, callback, Logger);

module.exports = {
  doLookup,
  startup,
  onMessage
};
