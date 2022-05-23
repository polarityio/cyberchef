const fp = require('lodash/fp');
const chef = require('cyberchef');
const magic = require('./magic/index');
const { operationsWeCantCurrentlyRun } = require('./searchOperations');

const runMagic = async (
  { entityValue, operations, depth, intensiveMode, extensiveLanguageSupport, crib },
  options,
  callback = () => {},
  Logger = () => {
    error: () => {};
  }
) => {
  try {
    const lastOperationOutput = operations.length
      ? fp.flow(fp.last, fp.get('result'))(operations)
      : entityValue;

    // Excluding BufferArray and BigNumber output types as those cannot be used by the chef.magic Function.
    if ([4, 5].includes(fp.get('type', lastOperationOutput))) {
      callback(null, { magicSuggestions: [], summary: ['No Magic'] });
      return { magicSuggestions: [], summary: ['No Magic'] };
    }

    const magicResult = fp.get(
      'value',
      await magic(
        lastOperationOutput,
        depth,
        intensiveMode,
        extensiveLanguageSupport,
        crib,
        Logger
      )
    );

    const suggestedOperationsNames = fp.flow(
      fp.flatten,
      fp.compact,
      fp.uniq
    )([
      fp.map(fp.flow(fp.get('recipe'), fp.first, fp.get('op')), magicResult),
      fp.flatMap(fp.flow(fp.get('matchingOps'), fp.map(fp.get('op'))), magicResult)
    ]);

    const magicSuggestions = fp.flow(
      fp.flatMap(
        fp.flow(
          chef.help,
          fp.filter(operationsWeCantCurrentlyRun),
          fp.map((operation) => ({
            ...operation,
            description: fp.flow(
              fp.get('description'),
              fp.split(/\<\s*br\s*\/\s*\>/gi),
              fp.join(' '),
              fp.split(/<[^>]*>/gi),
              fp.join('')
            )(operation)
          }))
        )
      ),
      fp.uniqBy('name')
    )(suggestedOperationsNames);

    const summary = fp.get('length', magicSuggestions) ? ['Magic'] : ['No Magic'];

    callback(null, { magicSuggestions, summary });
    return { magicSuggestions, summary };
  } catch (error) {
    Logger.error(
      error,
      { detail: 'Failed to Run Magic from CyberChef' },
      'Run Magic Failed'
    );
    callback({
      errors: [
        {
          err: error,
          detail: error.message
        }
      ]
    });
    throw error;
  }
};

module.exports = runMagic;
