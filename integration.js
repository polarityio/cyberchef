const { trim } = require('lodash');
const fp = require('lodash/fp');
const runBake = require('./src/runBake');
const { searchOperations } = require('./src/searchOperations');
const addStep = require('./src/addStep');
const runMagic = require('./src/runMagic');
const groupOperationArgs = require('./src/groupOperationArgs');

let Logger;

function startup(log) {
  Logger = log;
}

const doLookup = async (entities, options, cb) => {
  Logger.debug({ entities }, 'Entities');
  options.url = options.url.endsWith('/') ? options.url.slice(0, -1) : options.url;

  const lookupResults = fp.compact(
    await Promise.all(
      fp.flow(
        filterOutInvalidInput(options),
        fp.uniqBy(fp.flow(fp.get('value'), fp.trim)),
        fp.map(getLookupResult(options))
      )(entities)
    )
  );

  cb(null, lookupResults);
};

const filterOutInvalidInput = (options) => (entities) =>
  fp.filter((entity) => {
    const trimmedEntityValue = fp.flow(fp.get('value'), fp.trim)(entity);

    const isNotWhitespace = fp.size(trimmedEntityValue);
    const isCorrectType =
      entity.type === 'custom' &&
      (!options.ignoreEntityTypes ||
        (entity.types.length === 1 &&
          !fp.flow(
            fp.filter(fp.negate(fp.isEqual(entity))),
            fp.some(
              fp.flow(
                fp.get('rawValue'),
                fp.trim,
                fp.toLower,
                fp.eq(fp.flow(fp.get('rawValue'), fp.trim, fp.toLower)(entity))
              )
            )
          )(entities)));

    return (
      isNotWhitespace && isCorrectType && trimmedEntityValue.length >= options.minLength
    );
  }, entities);

const getLookupResult = (options) => async (entity) => {
  const { magicSuggestions = [], summary = ['No Magic'] } = await runMagic(
    {
      entityValue: entity.value,
      operations: [],
      depth: 3,
      intensiveMode: false,
      extensiveLanguageSupport: false,
      crib: ''
    },
    options,
    () => {},
    Logger
  );
  const magicSuggestionsFound = summary[0] === 'Magic';
  if (options.onlyShowMagic && !magicSuggestionsFound) return;

  let operations = [];
  if (options.runMagicFunctionByDefault) {
    operations = fp.flow(fp.first, (magicSuggestion) =>
      magicSuggestion
        ? groupOperationArgs([{ ...magicSuggestion, __expanded: true }])
        : []
    )(magicSuggestions);
  }

  return {
    entity: {
      ...entity,
      value: fp.flow(fp.get('value'), fp.trim)(entity)
    },
    isVolatile: true,
    displayValue: `${entity.value.slice(0, 120)}${
      entity.value.length > 120 ? '...' : ''
    }`,
    data: {
      summary,
      details: {
        inputHash: trim(Buffer.from(entity.value).toString('base64'), '='),
        operations
      }
    }
  };
};

const getOnMessage = { runBake, searchOperations, addStep, runMagic };

const onMessage = ({ action, data: actionParams }, options, callback) =>
  getOnMessage[action](actionParams, options, callback, Logger);

module.exports = {
  doLookup,
  startup,
  onMessage
};
