const { EXTENSIVE_LANG_FREQS, COMMON_LANG_FREQS } = require('../constants');
const chiSquared = require('chi-squared');
/**
 * Attempts to detect the language of the input by comparing its byte frequency
 * to that of several known languages.
 */
const detectLanguage = (inputBuffer, inputFreq, extLang = false) => {
  if (!inputBuffer.length) {
    return [
      {
        lang: 'Unknown',
        score: Number.MAX_VALUE,
        probability: Number.MIN_VALUE
      }
    ];
  }
  
  const langFreqs = extLang ? EXTENSIVE_LANG_FREQS : COMMON_LANG_FREQS;
  const chiSqrs = [];

  for (const lang in langFreqs) {
    const [score, prob] = _chiSqr(inputFreq, langFreqs[lang]);
    chiSqrs.push({
      lang: lang,
      score: score,
      probability: prob
    });
  }

  // Sort results so that the most likely match is at the top
  chiSqrs.sort((a, b) => a.score - b.score);

  return chiSqrs;
};

const _chiSqr = (observed, expected, ddof = 0) => {
  let tmp,
    score = 0;

  for (let i = 0; i < observed.length; i++) {
    tmp = observed[i] - expected[i];
    score += (tmp * tmp) / expected[i];
  }

  return [score, 1 - chiSquared.cdf(score, observed.length - 1 - ddof)];
};

module.exports = detectLanguage;
