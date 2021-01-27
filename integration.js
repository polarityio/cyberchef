const chef = require('cyberchef');
const fp = require('lodash/fp');

let Logger;

const ARG_TYPES_WHERE_VALUE_IS_DEFAULT = [
  'boolean',
  'number',
  'string',
  'shortString',
  'binaryString',
  'binaryShortString',
  'text',
  'toggleString'
];

const FULL_WIDTH_ARG_TYPES = [
  'label',
  'string',
  'binaryString',
  'text',
  'toggleString',
  'editableOption',
  'populateOption',
  'populateMultiOption'
];

const OPERATIONS = [
  {
    module: 'Regex',
    description:
      'Extracts Uniform Resource Locators (URLs) from the input. The protocol (http, ftp etc.) is required otherwise there will be far too many false positives.',
    infoURL: null,
    inputType: 'string',
    outputType: 'string',
    flowControl: false,
    manualBake: false,
    __expanded: true,
    args: [
      { name: 'Short Inputs', type: 'label' }, //(Colossus)[Input]
      { name: 'Size', type: 'number', value: 32, min: 8 }, //(Add Text To Image)[Size]
      { name: 'Indent String', type: 'binaryShortString', value: '\\t' }, //(CSS Beautify)[Indent string]
      { name: 'Thing Name', type: 'shortString', value: '' }, //Conditional Jump)[Label name]
      {
        name: 'Force Valid JSON',
        type: 'boolean',
        selectedValue: true,
        value: true
      }, //(Avro to JSON)[Force Valid JSON]
      {
        name: 'Model',
        type: 'argSelector', //(Bombe)[Model]
        value: [
          { name: 'Dont Show Indent String', off: [3] },
          { name: 'Show Indent String', on: [3] }
        ]
      },
      {
        name: 'Delimiter',
        type: 'option', //(A1Z26 Cipher Decode)[Delimiter]
        value: ['Space', 'Comma', 'Semi-colon', 'Colon', 'Line feed', 'CRLF']
      },
      // {
      //   name: 'Split delimiter',
      //   type: 'editableOptionShort', // (Split)[Split delimiter]
      //   value: [
      //     { name: 'Comma', value: ',' },
      //     { name: 'Space', value: ' ' },
      //     { name: 'Line feed', value: '\\n' },
      //     { name: 'CRLF', value: '\\r\\n' },
      //     { name: 'Semi-colon', value: ';' },
      //     { name: 'Colon', value: ':' },
      //     { name: 'Nothing (separate chars)', value: '' }
      //   ]
      // },

      { name: 'Full width Inputs', type: 'label' },
      // {
      //   name: 'Built in formats',
      //   type: 'populateOption', //(Parse DateTime)[Built in formats]
      //   value: [
      //     { name: 'Standard date and time', value: 'DD/MM/YYYY HH:mm:ss' },
      //     { name: 'American-style date and time', value: 'MM/DD/YYYY HH:mm:ss' },
      //     { name: 'International date and time', value: 'YYYY-MM-DD HH:mm:ss' },
      //     { name: 'Verbose date and time', value: 'dddd Do MMMM YYYY HH:mm:ss Z z' },
      //     { name: 'UNIX timestamp (seconds)', value: 'X' },
      //     { name: 'UNIX timestamp offset (milliseconds)', value: 'x' },
      //     { name: 'Automatic', value: '' }
      //   ],
      //   target: 12
      // },

      // {
      //   name: 'Standard Enigmas',
      //   type: 'populateMultiOption', //(Multiple Bombe)[Standard Enigmas]
      //   value: [
      //     {
      //       name: 'German Service Enigma (First - 3 rotor)',
      //       value: [
      //         'EKMFLGDQVZNTOWYHXUSPAIBRCJ<R\nAJDKSIRUXBLHWTMCQGZNPYFVOE<F\nBDFHJLCPRTXVZNYEIWGAKMUSQO<W\nESOVPZJAYQUIRHXLNFTGKDCMWB<K\nVZBRGITYUPSDNHLXAWMJQOFECK<A',
      //         '',
      //         'AY BR CU DH EQ FS GL IP JX KN MO TZ VW'
      //       ]
      //     },
      //     {
      //       name: 'German Service Enigma (Second - 3 rotor)',
      //       value: [
      //         'EKMFLGDQVZNTOWYHXUSPAIBRCJ<R\nAJDKSIRUXBLHWTMCQGZNPYFVOE<F\nBDFHJLCPRTXVZNYEIWGAKMUSQO<W\nESOVPZJAYQUIRHXLNFTGKDCMWB<K\nVZBRGITYUPSDNHLXAWMJQOFECK<A\nJPGVOUMFYQBENHZRDKASXLICTW<AN\nNZJHGRCXMYSWBOUFAIVLPEKQDT<AN\nFKQHTLXOCBJSPDZRAMEWNIUYGV<AN',
      //         '',
      //         'AY BR CU DH EQ FS GL IP JX KN MO TZ VW\nAF BV CP DJ EI GO HY KR LZ MX NW TQ SU'
      //       ]
      //     },
      //     {
      //       name: 'German Service Enigma (Third - 4 rotor)',
      //       value: [
      //         'EKMFLGDQVZNTOWYHXUSPAIBRCJ<R\nAJDKSIRUXBLHWTMCQGZNPYFVOE<F\nBDFHJLCPRTXVZNYEIWGAKMUSQO<W\nESOVPZJAYQUIRHXLNFTGKDCMWB<K\nVZBRGITYUPSDNHLXAWMJQOFECK<A\nJPGVOUMFYQBENHZRDKASXLICTW<AN\nNZJHGRCXMYSWBOUFAIVLPEKQDT<AN\nFKQHTLXOCBJSPDZRAMEWNIUYGV<AN',
      //         'FSOKANUERHMBTIYCWLQPZXVGJD',
      //         'AE BN CK DQ FU GY HW IJ LO MP RX SZ TV'
      //       ]
      //     },
      //     {
      //       name: 'German Service Enigma (Fourth - 4 rotor)',
      //       value: [
      //         'EKMFLGDQVZNTOWYHXUSPAIBRCJ<R\nAJDKSIRUXBLHWTMCQGZNPYFVOE<F\nBDFHJLCPRTXVZNYEIWGAKMUSQO<W\nESOVPZJAYQUIRHXLNFTGKDCMWB<K\nVZBRGITYUPSDNHLXAWMJQOFECK<A\nJPGVOUMFYQBENHZRDKASXLICTW<AN\nNZJHGRCXMYSWBOUFAIVLPEKQDT<AN\nFKQHTLXOCBJSPDZRAMEWNIUYGV<AN',
      //         'FSOKANUERHMBTIYCWLQPZXVGJD',
      //         'AE BN CK DQ FU GY HW IJ LO MP RX SZ TV\nAR BD CO EJ FN GT HK IV LM PW QZ SX UY'
      //       ]
      //     },
      //     { name: 'User defined', value: ['', '', ''] }
      //   ],
      //   target: [12, 13, 14]
      // },
      {
        name: 'Resolver',
        type: 'editableOption', //(DNS over HTTPS)[Resolver]
        value: [
          { name: 'Google', value: 'https://dns.google.com/resolve' },
          { name: 'Documents', value: 'https://asdf.asdf/resolve' },
          { name: 'Cloudflare', value: 'https://cloudflare-dns.com/dns-query' }
        ]
      },
      { name: 'String', type: 'string', value: '' }, //(Add Text To Image)[Text]
      { name: 'Sample delimiter', type: 'binaryString', value: '\\n\\n' }, //(CSS Beautify)[Indent string]
      { name: 'Headers', type: 'text', value: '' }, //(HTTP request)[Headers]
      {
        name: 'Key',
        type: 'toggleString', //(Add)[Key]
        value: '',
        toggleValues: [
          'Decimal',
          'Simple string',
          'Extended (\\n, \\t, \\x...)',
          'UTF16LE',
          'Hex',
          'Binary',
          'Base64',
          'UTF8',
          'Latin1'
        ]
      }
    ],
    name: 'Extract URLs'
  },
  {
    module: 'Regex2',
    description:
      'Extracts Uniform Resource Locators (URLs) from the input. The protocol (http, ftp etc.) is required otherwise there will be far too many false positives.',
    infoURL: null,
    inputType: 'string',
    outputType: 'string',
    flowControl: false,
    manualBake: false,
    args: [],
    name: 'A1Z26 Cipher Decoded with Longer Name'
  },
  {
    module: 'Regex3',
    description:
      'Extracts Uniform Resource Locators (URLs) from the input. The protocol (http, ftp etc.) is required otherwise there will be far too many false positives.',
    infoURL: null,
    inputType: 'string',
    outputType: 'string',
    flowControl: false,
    manualBake: false,
    args: [],
    name: 'Colossus'
  }
];

function startup(log) {
  Logger = log;
}

async function doLookup(entities, options, cb) {
  let lookupResults = [];

  Logger.trace({ test: 111111111111, entities, OPERATIONS, aaaa: groupOperationArgs(OPERATIONS) }, 'doLookup');

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
            details: {
              operations: groupOperationArgs(OPERATIONS)
              
            },
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

const groupOperationArgs = fp.map((operation) => ({
  ...operation,
  args: fp.flow(
    fp.get('args'),
    fp.reduce((agg, arg) => {
      const argWithSelectedValue = {
        ...arg,
        fullWidth: fp.includes(arg.type, FULL_WIDTH_ARG_TYPES),
        selectedValue: getSelectedValue(arg)
      };

      return shouldAddToPreviousGroup(agg, arg)
        ? [
            ...fp.slice(0, agg.length - 1, agg),
            [...(fp.last(agg) || []), argWithSelectedValue]
          ]
        : [...agg, [argWithSelectedValue]];
    }, [])
  )(operation)
}));

const shouldAddToPreviousGroup = (agg, arg) =>
  !fp.includes(arg.type, FULL_WIDTH_ARG_TYPES) &&
  fp.size(fp.last(agg)) &&
  fp.flow(
    fp.last,
    fp.first,
    fp.get('type'),
    fp.negate(fp.includes(fp.__, FULL_WIDTH_ARG_TYPES))
  )(agg);


const getSelectedValue = (arg) =>
  fp.includes(arg.type, ARG_TYPES_WHERE_VALUE_IS_DEFAULT)
    ? arg.value
    : arg.type === 'argSelector'
    ? fp.get('value.0.name', arg)
    : arg.type === 'toggleString'
    ? { option: fp.get('toggleValues.0', arg), string: arg.value }
    : arg.type === 'editableOptionShort' || arg.type === 'editableOption'
    ? fp.get('value.0.value', arg)
    : '';

module.exports = {
  doLookup: doLookup,
  startup: startup
};
