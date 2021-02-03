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

const SUPPORTED_INPUT_OUTPUT_TYPES = [
  'string',
  'byteArray',
  'number',
  'html',
  'ArrayBuffer',
  'BigNumber',
  'JSON'
];

module.exports = {
  ARG_TYPES_WHERE_VALUE_IS_DEFAULT,
  FULL_WIDTH_ARG_TYPES,
  UNSUPPORTED_ARG_TYPES,
  SUPPORTED_INPUT_OUTPUT_TYPES
};
