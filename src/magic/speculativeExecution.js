const findMatchingInputOps = require('./findMatchingInputOps');
const detectLanguage = require('./detectLanguage');
const calcEntropy = require('./calcEntropy');
const runRecipe = require('./runRecipe');
const bruteForce = require('./bruteForce');
const {
  arrayBufferToStr,
  isUTF8,
  freqDist,
  buffersEqual,
  runSafeRegex
} = require('./utils');

const speculativeExecution = async (
  inputBuffer,
  inputStr,
  depth = 0,
  extLang = false,
  intensive = false,
  recipeConfig = [],
  useful = false,
  crib = null,
  Logger
) => {
  // If we have reached the recursion depth, return
  if (depth < 0) return [];

  const inputFreq = freqDist(inputBuffer, Logger);
  const inputEntropy = calcEntropy(inputFreq);

  // Find any operations that can be run on this data
  const matchingOps = findMatchingInputOps(inputEntropy, inputStr);

  let results = [];

  // Record the properties of the current data
  results.push({
    recipe: recipeConfig,
    data: inputStr.slice(0, 100),
    languageScores: detectLanguage(inputBuffer, inputFreq, extLang),
    isUTF8: isUTF8(inputBuffer),
    entropy: inputEntropy,
    matchingOps: matchingOps,
    useful: useful,
    matchesCrib: crib && runSafeRegex(inputStr, crib)
  });
  const prevOp = recipeConfig[recipeConfig.length - 1];

  // Execute each of the matching operations, then recursively call the speculativeExecution()
  // method on the resulting data, recording the properties of each option.
  await Promise.all(
    matchingOps.map(async (op) => {
      const opConfig = {
        op: op.op,
        args: op.args
      };
      const output = await runRecipe([opConfig], inputBuffer);
      // If the recipe returned an empty buffer, do not continue
      if (buffersEqual(output, new ArrayBuffer())) return;

      // If the recipe is repeating and returning the same data, do not continue
      if (prevOp && op.op === prevOp.op && buffersEqual(output, inputBuffer)) return;

      // If the output criteria for this op doesn't match the output, do not continue
      if (op.output && !outputCheckPasses(output, op.output)) return;

      const speculativeResults = await speculativeExecution(
        new Uint8Array(output),
        arrayBufferToStr(output),
        depth - 1,
        extLang,
        intensive,
        [...recipeConfig, opConfig],
        op.useful,
        crib,
        Logger
      );

      results = results.concat(speculativeResults);
    })
  );

  // NOTE: Though intensive mode technically works, the performance of the implementation here is too slow for the integration message timeout, so we are disabling this section of the code.
  // if (intensive) {
  //   // Run brute forcing of various types on the data and create a new branch for each option
  //   const bfEncodings = await bruteForce(inputBuffer);
  //   await Promise.all(
  //     bfEncodings.map(async (enc) => {
  //       const bfResults = await speculativeExecution(
  //         new Uint8Array(enc.data),
  //         arrayBufferToStr(enc.data),
  //         depth - 1,
  //         extLang,
  //         false,
  //         [...recipeConfig, enc.conf],
  //         false,
  //         crib,
  //         Logger
  //       );

  //       results = results.concat(bfResults);
  //     })
  //   );
  // }

  // Prune branches that result in unhelpful outputs
  const prunedResults = results.filter(
    (r) =>
      (r.useful || r.data.length > 0) && // The operation resulted in "" // One of the following must be true
      (r.languageScores[0].probability > 0 || // Some kind of language was found
        r.isUTF8 || // UTF-8 was found
        r.matchingOps.length || // A matching op was found
        r.matchesCrib) // The crib matches
  );

  // Return a sorted list of possible recipes along with their properties
  return prunedResults.sort((a, b) => {
    // Each option is sorted based on its most likely language (lower is better)
    let aScore = a.languageScores[0].score,
      bScore = b.languageScores[0].score;

    // If the result is valid UTF8, its score gets boosted (lower being better)
    if (a.isUTF8) aScore -= 100;
    if (b.isUTF8) bScore -= 100;

    // If the option is marked useful, give it a good score
    if (a.useful && aScore > 100) aScore = 100;
    if (b.useful && bScore > 100) bScore = 100;

    // Shorter recipes are better, so we add the length of the recipe to the score
    aScore += a.recipe.length;
    bScore += b.recipe.length;

    // Lower entropy is "better", so we add the entropy to the score
    aScore += a.entropy;
    bScore += b.entropy;

    // A result with no recipe but matching ops suggests there are better options
    if (!a.recipe.length && a.matchingOps.length && b.recipe.length) return 1;
    if (!b.recipe.length && b.matchingOps.length && a.recipe.length) return -1;

    return aScore - bScore;
  });
};

const outputCheckPasses = (data, criteria) => {
  if (criteria.pattern) {
    const dataStr = arrayBufferToStr(data);
    if (!runSafeRegex(dataStr, criteria.pattern, criteria.flags)) return false;
  }
  if (criteria.entropyRange) {
    const dataEntropy = calcEntropy(freqDist(data));
    if (dataEntropy < criteria.entropyRange[0] || dataEntropy > criteria.entropyRange[1])
      return false;
  }

  return true;
};

module.exports = speculativeExecution;
