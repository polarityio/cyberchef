const fp = require('lodash/fp');
const chef = require('cyberchef');

const { operationsWeCantCurrentlyRun } = require('./searchOperations');

const runMagic = async (
  { entityValue, operations, depth, intensiveMode, extensiveLanguageSupport, crib },
  options,
  callback,
  Logger
) => {
  try {
    const lastOperationOutput = operations.length
      ? fp.flow(fp.last, fp.get('result'))(operations)
      : entityValue;

    
    if (lastOperationOutput.type === 4)
      return callback(null, { magicSuggestions: [], summary: ['No Magic Suggestions'] });

    const magicResult = fp.get(
      'value',
      await chef.magic(lastOperationOutput, [
        depth,
        intensiveMode,
        extensiveLanguageSupport,
        crib
      ])
    );

    
    const suggestedOperationsNames = fp.flow(fp.flatten, fp.compact, fp.uniq)([
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
              fp.split(/<br>|<br\/>/gi),
              fp.join(' '),
              fp.split(/<[^>]*>/gi),
              fp.join('')
            )(operation)
          }))
        )
      ),
      fp.uniqBy('name')
    )(suggestedOperationsNames);

    const summary = magicSuggestions.length
      ? ['Magic Suggestions Found']
      : ['No Magic Suggestions'];

    callback(null, { magicSuggestions, summary });
  } catch (error) {
    Logger.error(
      error,
      { detail: 'Failed to Run Magic from CyberChef' },
      'Run Magic Failed'
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

module.exports = runMagic;
