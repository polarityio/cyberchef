const FAVOURITE_OPERATION_DEFAULTS = [
  'To Base64',
  'From Base64',
  'To Hex',
  'From Hex',
  'To Hexdump',
  'From Hexdump',
  'URL Decode',
  'Entropy'
].map((operationName) => ({ value: operationName, display: operationName }));

const FAVOURITE_OPERATION_OPTIONS = [
  'To Base64', 'From Base64', 'To Hex', 'From Hex', 'To Hexdump', 'From Hexdump',  'URL Decode', 'Entropy', 'MD2', 'A1Z26 Cipher Decode', 'ADD', 'AND', 'Add line numbers', 'Add Text To Image', 'Adler-32 Checksum', 'Affine Cipher Decode', 'Affine Cipher Encode', 'Analyse hash', 'Atbash Cipher', 'Avro to JSON', 'BLAKE2b', 'BLAKE2s', 'BSON deserialise',
  'BSON serialise', 'Bacon Cipher Decode', 'Bacon Cipher Encode', 'Bcrypt', 'Bcrypt compare', 'Bcrypt parse', 'Bifid Cipher Decode', 'Bifid Cipher Encode', 'Bit shift left', 'Bit shift right', 'Blowfish Decrypt', 'Blowfish Encrypt', 'Blur Image', 'Bzip2 Compress', 'Bzip2 Decompress', 'CRC-16 Checksum', 'CRC-32 Checksum', 'CRC-8 Checksum', 'CSS Beautify', 'CSS Minify', 'CSS selector',
  'CSV to JSON', 'CTPH', 'Cartesian Product', 'Change IP format', 'Chi Square', 'CipherSaber2 Decrypt', 'CipherSaber2 Encrypt', 'Citrix CTX1 Decode', 'Citrix CTX1 Encode', 'Compare CTPH hashes', 'Compare SSDEEP hashes', 'Contain Image', 'Convert area', 'Convert co-ordinate format', 'Convert data units', 'Convert distance', 'Convert Image Format', 'Convert mass',
  'Convert speed', 'Convert to NATO alphabet', 'Count occurrences', 'Cover Image', 'Crop Image', 'DES Decrypt', 'DES Encrypt', 'DNS over HTTPS', 'Dechunk HTTP response', 'Decode NetBIOS Name', 'Decode text', 'Defang IP Addresses', 'Defang URL', 'Derive EVP key', 'Derive PBKDF2 key', 'Detect File Type', 'Diff', 'Disassemble x86', 'Dither Image', 'Divide',
  'Drop bytes', 'Encode NetBIOS Name', 'Encode text', 'Escape string', 'Escape Unicode Characters', 'Expand alphabet range', 'Extract dates', 'Extract domains', 'Extract EXIF', 'Extract email addresses', 'Extract file paths', 'Extract Files', 'Extract IP addresses', 'Extract LSB', 'Extract MAC addresses', 'Extract RGBA', 'Extract URLs', 'Filter', 'Find / Replace', 'Fletcher-16 Checksum',
  'Fletcher-32 Checksum', 'Fletcher-64 Checksum', 'Fletcher-8 Checksum', 'Flip Image', 'Format MAC addresses', 'Frequency distribution', 'From BCD', 'From Base', 'From Base32', 'From Base58', 'From Base62', 'From Base85', 'From Binary', 'From Braille', 'From Case Insensitive Regex', 'From Charcode', 'From Decimal', 'From HTML Entity',
  'From Hex Content', 'From MessagePack', 'From Morse Code', 'From Octal', 'From Punycode', 'From Quoted Printable', 'From UNIX Timestamp', 'GOST hash', 'Generate all hashes', 'Generate HOTP', 'Generate Image', 'Generate Lorem Ipsum', 'Generate PGP Key Pair', 'Generate QR Code', 'Generate RSA Key Pair', 'Generate TOTP', 'Generate UUID', 'Generic Code Beautify',
  'Group IP addresses', 'Gunzip', 'Gzip', 'HAS-160', 'HMAC', 'HTML To Text', 'HTTP request', 'Hamming Distance', 'Haversine distance', 'Head', 'Heatmap chart', 'Hex Density chart', 'Hex to Object Identifier', 'Hex to PEM', 'Image Brightness / Contrast', 'Image Filter', 'Image Hue/Saturation/Lightness', 'Image Opacity', 'Index of Coincidence', 'Invert Image',
  'JPath expression', 'JSON Beautify', 'JSON Minify', 'JSON to CSV', 'JWT Decode', 'JWT Sign', 'JWT Verify', 'JavaScript Beautify', 'JavaScript Minify', 'JavaScript Parser', 'Keccak', 'Luhn Checksum', 'A1Z26 Cipher Encode', 'MD4', 'MD5', 'MD6', 'Mean', 'Median', 'Microsoft Script Decoder', 'Multiply', 'NOT', 'Normalise Image', 'Normalise Unicode',
  'Numberwang', 'OR', 'Object Identifier to Hex', 'Offset checker', 'Optical Character Recognition', 'PEM to Hex', 'PGP Decrypt', 'PGP Decrypt and Verify', 'PGP Encrypt', 'PGP Encrypt and Sign', 'PGP Verify', 'PHP Deserialize', 'Pad lines', 'Parse ASN.1 hex string', 'Parse colour code', 'Parse IP range', 'Parse IPv4 header', 'Parse IPv6 address', 'Parse ObjectID timestamp', 'Parse QR Code', 'Parse SSH Host Key', 'Parse TLV', 'Parse UDP', 'Parse UNIX file permissions',
  'Parse URI', 'Parse User Agent', 'Parse X.509 certificate', 'Play Media', 'Power Set', 'Protobuf Decode', 'Pseudo-Random Number Generator', 'RC2 Decrypt', 'RC2 Encrypt', 'RC4', 'RC4 Drop', 'RIPEMD', 'ROT13', 'ROT47', 'RSA Sign', 'RSA Verify', 'Rail Fence Cipher Decode', 'Rail Fence Cipher Encode', 'Randomize Colour Palette', 'Raw Deflate', 'Raw Inflate', 'Remove Diacritics', 'Remove EXIF',
  'Remove line numbers', 'Remove null bytes', 'Remove whitespace', 'Render Image', 'Render Markdown', 'Resize Image', 'Reverse', 'Rotate Image', 'Rotate left', 'Rotate right', 'SHA0', 'SHA1', 'SHA3', 'SM3', 'SQL Beautify', 'SQL Minify', 'SSDEEP', 'SUB', 'Scan for Embedded Files', 'Scatter chart', 'Scrypt', 'Series chart', 'Set Difference', 'Set Intersection', 'Set Union', 'Shake', 'Sharpen Image',
  'Show Base64 offsets', 'Show on map', 'Sleep', 'Snefru', 'Sort', 'Split', 'Split Colour Channels', 'Standard Deviation', 'Streebog', 'Strings', 'Strip HTML tags', 'Strip HTTP headers', 'Substitute', 'Subtract', 'Sum', 'Swap endianness', 'Symmetric Difference', 'Syntax highlighter', 'TCP/IP Checksum', 'Tail', 'Take bytes', 'Text Encoding Brute Force', 'To BCD', 'To Base', 'To Base32', 'To Base58',
  'To Base62', 'To Base85', 'To Binary', 'To Braille', 'To Camel case', 'To Case Insensitive Regex', 'To Charcode', 'To Decimal', 'To HTML Entity', 'To Hex Content', 'To Kebab case', 'To Lower case', 'To MessagePack', 'To Morse Code', 'To Octal', 'To Punycode', 'To Quoted Printable', 'To Snake case', 'To Table', 'To UNIX Timestamp', 'To Upper case', 'Triple DES Decrypt', 'Triple DES Encrypt', 'Typex',
  'UNIX Timestamp to Windows Filetime', 'URL Encode', 'Unescape string', 'Unescape Unicode Characters', 'Unicode Text Format', 'Unique', 'Untar', 'Unzip', 'VarInt Decode', 'VarInt Encode', 'View Bit Plane', 'Vigenère Decode', 'Vigenère Encode', 'Whirlpool', 'Windows Filetime to UNIX Timestamp', 'XKCD Random Number', 'XML Beautify', 'XML Minify', 'XOR', 'XOR Brute Force', 'XPath expression', 'YARA Rules', 'Zlib Deflate', 'Zlib Inflate'
].map((operationName) => ({ value: operationName, display: operationName }));

module.exports = {
  name: 'CyberChef',
  acronym: 'CHEF',
  description:
    'Attempts to decode highlighted strings with the CyberChef Magic operation.',
  onDemandOnly: true,
  defaultColor: 'light-green',
  logging: {
    level: 'info' //trace, debug, info, warn, error, fatal
  },
  entityTypes: ['*'],
  customTypes: [
    {
      key: 'encodedString',
      regex: /\S[\s\S]*\S/
    }
  ],
  styles: ['./styles/style.less'],
  block: {
    component: {
      file: './components/block.js'
    },
    template: {
      file: './templates/block.hbs'
    }
  },
  request: {
    cert: '',
    key: '',
    passphrase: '',
    ca: '',
    proxy: '',
    rejectUnauthorized: true
  },
  options: [
    {
      key: 'url',
      name: 'CyberChef Url',
      description:
        'Add your CyberChef Url to open up the CyberChef dashboard for full functionality. (e.g. https://gchq.github.io/CyberChef)',
      default: 'https://gchq.github.io/CyberChef',
      type: 'text',
      userCanEdit: true,
      adminOnly: false
    },
    {
      key: 'onlyShowMagic',
      name: 'Only Show Magic Results',
      description:
        'When checked, strings searched that do not immediately have a Magic suggestion will not be displayed in the overlay.',
      default: true,
      type: 'boolean',
      userCanEdit: true,
      adminOnly: false
    },
    {
      key: 'ignoreEntityTypes',
      name: 'Ignore Entity Types',
      description:
        'When checked, strings searched that are one of our predefined entity types ' +
        '(IPv4, IPv6, IPv4CIDR, MD5, SHA1, SHA256, MAC, string, email, domain, url, and cve) will not be displayed in the overlay.',
      default: true,
      type: 'boolean',
      userCanEdit: true,
      adminOnly: false
    },
    {
      key: 'runMagicFunctionByDefault',
      name: 'Run Magic Function By Default',
      description:
        "If checked, when you search a string by default the Magic Function's first recommended Operation will be applied to your input. " +
        'No Operation wil be applied if the Magic Function has no suggestions.',
      default: false,
      type: 'boolean',
      userCanEdit: true,
      adminOnly: false
    },
    {
      key: 'dontShowStepResults',
      name: "Don't Show Step Results",
      description:
        "By default, you can find the results for each step of your recipe when expanding on the Operation's title." +
        'If the step results are getting too long you can check this to make only the final output visible in the overlay.',
      default: false,
      type: 'boolean',
      userCanEdit: true,
      adminOnly: false
    },
    {
      key: 'minLength',
      name: 'Minimum Input Length',
      description: 'The minimum text input length for a string to be considered Input.',
      default: 5,
      type: 'number',
      userCanEdit: true,
      adminOnly: false
    },
    {
      key: 'favourites',
      name: 'Favourite Operations',
      description:
        'This is a list of the Favourites that will show up when you initially search for operations.',
      default: FAVOURITE_OPERATION_DEFAULTS,
      type: 'select',
      options: FAVOURITE_OPERATION_OPTIONS,
      multiple: true,
      userCanEdit: true,
      adminOnly: false
    }
  ]
};
