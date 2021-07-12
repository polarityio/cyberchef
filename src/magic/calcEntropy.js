/**
 * Calculates the Shannon entropy of the input data.
 */
const calcEntropy = (inputFreq) => {
  let entropy = 0,
    p;

  for (let i = 0; i < inputFreq.length; i++) {
    p = inputFreq[i] / 100;
    if (p === 0) continue;
    entropy += (p * Math.log(p)) / Math.log(2);
  }

  return -entropy;
};

module.exports = calcEntropy;
