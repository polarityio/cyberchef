const chef = require('cyberchef-node');
const speculativeExecution = require('./speculativeExecution');
const areAllChecksSafe = require('./areAllChecksSafe');
const { arrayBufferToStr } = require('./utils');

// 'https://github.com/gchq/CyberChef/wiki/Automatic-detection-of-encoded-data-using-CyberChef-Magic';

const magic = async (input, depth, intensive, extLang, crib, Logger) => {
  let dish = new chef.Dish(input);
  const stringInput = arrayBufferToStr(dish);
  const allChecksAreSafe = areAllChecksSafe(stringInput);

  if (allChecksAreSafe && intensive) {
    return await chef.magic(dish, [depth, intensive, extLang, crib]);
  }

  let cribRegex;
  try {
    cribRegex = crib && crib.length ? new RegExp(crib, 'i') : null;
  } catch (e) {}

  let options = await speculativeExecution(
    new Uint8Array(dish.get(4)),
    stringInput,
    depth,
    extLang,
    intensive,
    [],
    false,
    cribRegex,
    Logger
  );

  // Filter down to results which matched the crib
  if (cribRegex) {
    options = options.filter((option) => option.matchesCrib);
  }

  dish.set(options, 6);
  return dish;
};

module.exports = magic;
