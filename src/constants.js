const ARG_TYPES_WHERE_VALUE_IS_DEFAULT = [
  'boolean',
  'number',
  'string',
  'shortString',
  'binaryString',
  'binaryShortString',
  'text'
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
const UNSUPPORTED_ARG_TYPES = ['argSelector', 'populateOption', 'populateMultiOption'];
// const OPERATIONS = [
//   {
//     module: 'Regex',
//     description:
//       'Extracts Uniform Resource Locators (URLs) from the input. The protocol (http, ftp etc.) is required otherwise there will be far too many false positives.',
//     infoURL: null,
//     inputType: 'string',
//     outputType: 'string',
//     flowControl: false,
//     manualBake: false,
//     args: [{ name: 'Display total', type: 'boolean', value: false }],
//     name: 'Extract URLs'
//   },
//   {
//     module: 'Regex',
//     description:
//       'Extracts fully qualified domain names.<br>Note that this will not include paths. Use <strong>Extract URLs</strong> to find entire URLs.',
//     infoURL: null,
//     inputType: 'string',
//     outputType: 'string',
//     flowControl: false,
//     manualBake: false,
//     args: [{ name: 'Display total', type: 'boolean', value: 'Extract.DISPLAY_TOTAL' }],
//     name: 'Extract domains'
//   },
//   {
//     module: 'Default',
//     description:
//       "Takes a Universal Resource Locator (URL) and 'Defangs' it; meaning the URL becomes invalid, neutralising the risk of accidentally clicking on a malicious link.<br><br>This is often used when dealing with malicious links or IOCs.<br><br>Works well when combined with the 'Extract URLs' operation.",
//     infoURL: 'https://isc.sans.edu/forums/diary/Defang+all+the+things/22744/',
//     inputType: 'string',
//     outputType: 'string',
//     flowControl: false,
//     manualBake: false,
//     args: [
//       { name: 'Escape dots', type: 'boolean', value: true },
//       { name: 'Escape http', type: 'boolean', value: true },
//       { name: 'Escape ://', type: 'boolean', value: true },
//       {
//         name: 'Process',
//         type: 'option',
//         value: ['Valid domains and full URLs', 'Only full URLs', 'Everything']
//       }
//     ],
//     name: 'Defang URL'
//   },
//   {
//     module: 'Default',
//     description: 'Adds line numbers to the output.',
//     infoURL: null,
//     inputType: 'string',
//     outputType: 'string',
//     flowControl: false,
//     manualBake: false,
//     args: [],
//     name: 'Add line numbers'
//   },
//   {
//     module: 'Ciphers',
//     description:
//       'The Affine cipher is a type of monoalphabetic substitution cipher, wherein each letter in an alphabet is mapped to its numeric equivalent, encrypted using simple mathematical function, <code>(ax + b) % 26</code>, and converted back to a letter.',
//     infoURL: 'https://wikipedia.org/wiki/Affine_cipher',
//     inputType: 'string',
//     outputType: 'string',
//     flowControl: false,
//     manualBake: false,
//     args: [
//       { name: 'a', type: 'number', value: 1 },
//       { name: 'b', type: 'number', value: 0 }
//     ],
//     name: 'Affine Cipher Encode'
//   }
//   // {
//   //   module: 'Default',
//   //   description: 'ADD the input with the given key (e.g. <code>fe023da5</code>), MOD 255',
//   //   infoURL: 'https://wikipedia.org/wiki/Bitwise_operation#Bitwise_operators',
//   //   inputType: 'byteArray',
//   //   outputType: 'byteArray',
//   //   flowControl: false,
//   //   manualBake: false,
//   //   args: [
//   //     {
//   //       name: 'Key',
//   //       type: 'toggleString',
//   //       value: '',
//   //       toggleValues: ['Hex', 'Decimal', 'Binary', 'Base64', 'UTF8', 'Latin1']
//   //     }
//   //   ],
//   //   name: 'ADD'
//   // }
//   // {
//   //   module: 'Ciphers',
//   //   description:
//   //     'Advanced Encryption Standard (AES) is a U.S. Federal Information Processing Standard (FIPS). It was selected after a 5-year process where 15 competing designs were evaluated.<br><br><b>Key:</b> The following algorithms will be used based on the size of the key:<ul><li>16 bytes = AES-128</li><li>24 bytes = AES-192</li><li>32 bytes = AES-256</li></ul>You can generate a password-based key using one of the KDF operations.<br><br><b>IV:</b> The Initialization Vector should be 16 bytes long. If not entered, it will default to 16 null bytes.<br><br><b>Padding:</b> In CBC and ECB mode, PKCS#7 padding will be used.',
//   //   infoURL: 'https://wikipedia.org/wiki/Advanced_Encryption_Standard',
//   //   inputType: 'string',
//   //   outputType: 'string',
//   //   flowControl: false,
//   //   manualBake: false,
//   //   args: [
//   //     {
//   //       name: 'Key',
//   //       type: 'toggleString',
//   //       value: '',
//   //       toggleValues: ['Hex', 'UTF8', 'Latin1', 'Base64']
//   //     },
//   //     {
//   //       name: 'IV',
//   //       type: 'toggleString',
//   //       value: '',
//   //       toggleValues: ['Hex', 'UTF8', 'Latin1', 'Base64']
//   //     },
//   //     { name: 'Mode', type: 'option', value: ['CBC', 'CFB', 'OFB', 'CTR', 'GCM', 'ECB'] },
//   //     { name: 'Input', type: 'option', value: ['Raw', 'Hex'] },
//   //     { name: 'Output', type: 'option', value: ['Hex', 'Raw'] }
//   //   ],
//   //   name: 'AES Encrypt'
//   // }
// ];

const OPERATIONS = [];

const OPERATIONS_ALL_ARG_TYPES = [
  {
    module: 'Regex',
    description:
      'Extracts Uniform Resource Locators (URLs) from the input. The protocol (http, ftp etc.) is required otherwise there will be far too many false positives.',
    infoURL: null,
    inputType: 'string',
    outputType: 'string',
    flowControl: false,
    manualBake: false,
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
      // {
      //   name: 'Model',
      //   type: 'argSelector', //(Bombe)[Model]
      //   value: [
      //     { name: 'Dont Show Indent String', off: [3] },
      //     { name: 'Show Indent String', on: [3] }
      //   ]
      // },
      {
        name: 'Delimiter',
        type: 'option', //(A1Z26 Cipher Decode)[Delimiter]
        value: ['Space', 'Comma', 'Semi-colon', 'Colon', 'Line feed', 'CRLF']
      },
      {
        name: 'Split delimiter',
        type: 'editableOptionShort', // (Split)[Split delimiter]
        value: [
          { name: 'Comma', value: ',' },
          { name: 'Space', value: ' ' },
          { name: 'Line feed', value: '\\n' },
          { name: 'CRLF', value: '\\r\\n' },
          { name: 'Semi-colon', value: ';' },
          { name: 'Colon', value: ':' },
          { name: 'Nothing (separate chars)', value: '' }
        ]
      },

      { name: 'Full width Inputs', type: 'label' },
      { name: 'String', type: 'string', value: '' }, //(Add Text To Image)[Text]
      { name: 'Sample delimiter', type: 'binaryString', value: '\\n\\n' }, //(CSS Beautify)[Indent string]
      { name: 'Headers', type: 'text', value: '' }, //(HTTP request)[Headers]
      {
        name: 'Resolver',
        type: 'editableOption', //(DNS over HTTPS)[Resolver]
        value: [
          { name: 'Google', value: 'https://dns.google.com/resolve' },
          { name: 'Documents', value: 'https://asdf.asdf/resolve' },
          { name: 'Cloudflare', value: 'https://cloudflare-dns.com/dns-query' }
        ]
      },
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
      //     }
      //   ],
      //   target: [12, 13, 14]
      // },
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
    displayResult:
      'https://gchq.github.io/CyberChef/#recipe=Extract_URLs(false)&input=MTE</br>https://balinterdi.com/blog/how-to-do-a-select-dropdown-in-ember-20/',
    result: [
      'https://gchq.github.io/CyberChef/#recipe=Extract_URLs(false)&input=MTE',
      'https://balinterdi.com/blog/how-to-do-a-select-dropdown-in-ember-20/'
    ],
    outputLength: 140,
    outputLines: 2,
    __expanded: true,
    args: [
      {
        name: 'Delimiter',
        type: 'option', //(A1Z26 Cipher Decode)[Delimiter]
        value: ['Space', 'Comma', 'Semi-colon', 'Colon', 'Line feed', 'CRLF']
      }
    ],
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

module.exports = {
  ARG_TYPES_WHERE_VALUE_IS_DEFAULT,
  FULL_WIDTH_ARG_TYPES,
  UNSUPPORTED_ARG_TYPES,
  OPERATIONS,
  OPERATIONS_ALL_ARG_TYPES
};
