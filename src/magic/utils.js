const chef = require('cyberchef-node');

const vm = require('vm');

function arrayBufferToStr(arrayBuffer) {
  let dish = new chef.Dish(arrayBuffer);
  return dish.toString();
}

function buffersEqual(a, b) {
  if (a === b) {
    return true;
  }

  if (a.byteLength !== b.byteLength) {
    return false;
  }

  const ai = new Uint8Array(a),
    bi = new Uint8Array(b);

  let i = a.byteLength;
  while (i--) {
    if (ai[i] !== bi[i]) {
      return false;
    }
  }

  return true;
}

/**
 * Calculates the number of times each byte appears in the input as a percentage
 */
const freqDist = (inputBuffer, Logger) => {
  const len = inputBuffer.length,
    counts = new Array(256).fill(0);
  let i = len;

  if (!len) return counts;

  while (i--) {
    counts[inputBuffer[i]]++;
  }
  const result = counts.map((c) => (c / len) * 100);

  return result;
};

/**
 * Detects whether the input buffer is valid UTF8.
 */
const isUTF8 = (inputBuffer) => {
  const bytes = new Uint8Array(inputBuffer);
  let i = 0;
  while (i < bytes.length) {
    if (
      // ASCII
      bytes[i] === 0x09 ||
      bytes[i] === 0x0a ||
      bytes[i] === 0x0d ||
      (0x20 <= bytes[i] && bytes[i] <= 0x7e)
    ) {
      i += 1;
      continue;
    }

    if (
      // non-overlong 2-byte
      0xc2 <= bytes[i] &&
      bytes[i] <= 0xdf &&
      0x80 <= bytes[i + 1] &&
      bytes[i + 1] <= 0xbf
    ) {
      i += 2;
      continue;
    }

    if (
      // excluding overlongs
      (bytes[i] === 0xe0 &&
        0xa0 <= bytes[i + 1] &&
        bytes[i + 1] <= 0xbf &&
        0x80 <= bytes[i + 2] &&
        bytes[i + 2] <= 0xbf) || // straight 3-byte
      (((0xe1 <= bytes[i] && bytes[i] <= 0xec) ||
        bytes[i] === 0xee ||
        bytes[i] === 0xef) &&
        0x80 <= bytes[i + 1] &&
        bytes[i + 1] <= 0xbf &&
        0x80 <= bytes[i + 2] &&
        bytes[i + 2] <= 0xbf) || // excluding surrogates
      (bytes[i] === 0xed &&
        0x80 <= bytes[i + 1] &&
        bytes[i + 1] <= 0x9f &&
        0x80 <= bytes[i + 2] &&
        bytes[i + 2] <= 0xbf)
    ) {
      i += 3;
      continue;
    }

    if (
      // planes 1-3
      (bytes[i] === 0xf0 &&
        0x90 <= bytes[i + 1] &&
        bytes[i + 1] <= 0xbf &&
        0x80 <= bytes[i + 2] &&
        bytes[i + 2] <= 0xbf &&
        0x80 <= bytes[i + 3] &&
        bytes[i + 3] <= 0xbf) || // planes 4-15
      (0xf1 <= bytes[i] &&
        bytes[i] <= 0xf3 &&
        0x80 <= bytes[i + 1] &&
        bytes[i + 1] <= 0xbf &&
        0x80 <= bytes[i + 2] &&
        bytes[i + 2] <= 0xbf &&
        0x80 <= bytes[i + 3] &&
        bytes[i + 3] <= 0xbf) || // plane 16
      (bytes[i] === 0xf4 &&
        0x80 <= bytes[i + 1] &&
        bytes[i + 1] <= 0x8f &&
        0x80 <= bytes[i + 2] &&
        bytes[i + 2] <= 0xbf &&
        0x80 <= bytes[i + 3] &&
        bytes[i + 3] <= 0xbf)
    ) {
      i += 4;
      continue;
    }

    return false;
  }

  return true;
};

const runSafeRegex = (string, _regex, flags = '') => {
  const regex = flags ? new RegExp(_regex, flags) : new RegExp(_regex);

  var contextState = { string, regex, result: null };
  var context = vm.createContext(contextState);
  var script = new vm.Script(`result = regex.test(string)`);
  try {
    script.runInContext(context, { timeout: 2000 });
    return contextState.result;
  } catch (e) {
    return false;
  }
};

const isRegexSafe = (string, _regex, flags = '') => {
  const regex = flags ? new RegExp(_regex, flags) : new RegExp(_regex);

  var contextState = { string, regex, result: null };
  var context = vm.createContext(contextState);
  var script = new vm.Script(`result = regex.test(string)`);
  try {
    script.runInContext(context, { timeout: 2000 });
    return true;
  } catch (e) {
    return false;
  }
};

module.exports = {
  arrayBufferToStr,
  buffersEqual,
  freqDist,
  isUTF8,
  runSafeRegex,
  isRegexSafe
};
