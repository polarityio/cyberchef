const chef = require('cyberchef');

let Logger;

function startup(log) {
  Logger = log;
}

async function doLookup(entities, options, cb) {
  let lookupResults = [];

  Logger.trace({ entities }, 'doLookup');

  for (const entity of entities) {
    if (entity.value) {
      if (entity.value.trim().length <= options.minLength) {
        return;
      }

      let output = await _magicDecode(entity.value);
      let jsonOutput = JSON.parse(output);
      Logger.trace({ jsonOutput }, 'Output from CyberChef');

      if ((options.asciiOnly && isASCII(output)) || !options.asciiOnly) {
        lookupResults.push({
          entity: entity,
          displayValue: 'CyberChef String Decoder',
          data: {
            summary: [],
            details: jsonOutput
          }
        });
      }
    }
  }

  cb(null, lookupResults);
}

/**
 * Tests to see if the string only contains ASCII characters between code 30 and 127 as well as spaces.
 * @param str
 * @returns {boolean}
 */
function isASCII(str) {
  return /^[\s\x20-\x7F]*$/.test(str);
}

async function _magicDecode(string) {
  let ascii = await chef.magic(string);
  return ascii.toString();
}

module.exports = {
  doLookup: doLookup,
  startup: startup
};
