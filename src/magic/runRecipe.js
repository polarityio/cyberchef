const chef = require('cyberchef-node');
const { EDGE_CASE_CORRECT_OPERATION_NAMES } = require('../constants');

const runRecipe = async (_recipeConfig, _input) => {
  const input = _input instanceof ArrayBuffer ? _input : _input.buffer;
  const inputDish = new chef.Dish(input);

  const recipeConfig = _recipeConfig.map((step) => ({
    ...step,
    op: EDGE_CASE_CORRECT_OPERATION_NAMES[step.op] || step.op
  }));
  try {
    const result = await chef.bake(inputDish.get(4), recipeConfig);
    const outputDish = new chef.Dish(result);
    return outputDish.get(4);
  } catch (err) {
    // If there are errors, return an empty buffer
    return new ArrayBuffer();
  }
};

module.exports = runRecipe;
