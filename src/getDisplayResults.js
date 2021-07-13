const fp = require('lodash/fp');

const getByteArrayDisplayResults = (resultValue) => {
  const stringifiedByteArray = String.fromCharCode.apply(
    null,
    resultValue.filter((x) => x > 32)
  );

  return {
    displayResult: stringifiedByteArray,
    outputLength: fp.flow(fp.toString, fp.size)(stringifiedByteArray),
    outputLines: fp.toString(1)
  };
};

const getStringDisplayResults = (currentStepResult) =>
  fp.flow(fp.trim, fp.split(/\r\n|\r|\n/gi), (stringOutputLines) => ({
    result: fp.join('\n', stringOutputLines),
    displayResult: fp.join('\n', stringOutputLines),
    outputLength: fp.flow(fp.join(' '), fp.size, fp.toString)(stringOutputLines),
    outputLines: fp.toString(
      fp.flow(fp.compact, fp.size)(stringOutputLines) === 0
        ? 0
        : fp.size(stringOutputLines)
    )
  }))(currentStepResult);

const getNumberDisplayResults = (resultValue) => ({
  displayResult: fp.toString(resultValue),
  outputLength: fp.flow(fp.toString, fp.size, fp.toString)(resultValue),
  outputLines: '1'
});

const getHtmlDisplayResults = (resultValue) => ({
  displayResult: fp.toString(resultValue),
  outputLength: fp.flow(fp.toString, fp.size)(resultValue),
  outputLines: fp.flow(
    fp.toString,
    fp.trim,
    fp.split(/\r\n|\r|\n/gi),
    fp.size,
    fp.toString
  )(resultValue)
});

const getArrayBufferDisplayResults = (resultValue) => ({
  displayResult: String.fromCharCode.apply(
    null,
    fp.slice(1, resultValue.byteLength, [...new Uint8Array(resultValue)])
  ),
  outputLength: fp.toString(resultValue.byteLength),
  outputLines: '1'
});

const getBigNumberDisplayResults = (resultValue) => ({
  displayResult: fp.toString(resultValue),
  outputLength: fp.flow(fp.toString, fp.size, fp.toString)(resultValue),
  outputLines: '1'
});

const getJsonDisplayResults = (resultValue) => ({
  displayResult: JSON.stringify(resultValue, null, 4),
  outputLength: fp.flow(
    (result) => JSON.stringify(result, null, 4),
    fp.split(/\r\n|\r|\n/gi),
    fp.join(' '),
    fp.size,
    fp.toString
  )(resultValue),
  outputLines: fp.flow(
    (result) => JSON.stringify(result, null, 4),
    fp.trim,
    fp.split(/\r\n|\r|\n/gi),
    fp.size,
    fp.toString
  )(resultValue)
});

const getDisplayTypeFunctions = {
  0: getByteArrayDisplayResults,
  1: getStringDisplayResults,
  2: getNumberDisplayResults,
  3: getHtmlDisplayResults,
  4: getArrayBufferDisplayResults,
  5: getBigNumberDisplayResults,
  6: getJsonDisplayResults
};

const getDisplayResults = ({ type: resultType, value: resultValue }) =>
  (getDisplayTypeFunctions[resultType] || (() => {}))(resultValue) || {
    displayResult: resultValue,
    outputLength: fp.flow(fp.toString, fp.size)(resultValue),
    outputLines: fp.flow(
      fp.toString,
      fp.trim,
      fp.split(/\r\n|\r|\n/gi),
      fp.size,
      fp.toString
    )(resultValue)
  };

module.exports = getDisplayResults;
