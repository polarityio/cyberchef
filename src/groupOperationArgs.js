const fp = require('lodash/fp');
const {
  ARG_TYPES_WHERE_VALUE_IS_DEFAULT,
  FULL_WIDTH_ARG_TYPES
} = require('./constants');

const groupOperationArgs = fp.map((operation) => ({
  ...operation,
  description: fp.flow(
    fp.get('description'),
    fp.split(/\<\s*br\s*\/\s*\>/gi),
    fp.join(' '),
    fp.split(/<[^>]*>/gi),
    fp.join('')
  )(operation),
  args: fp.flow(
    fp.get('args'),
    fp.reduce((agg, arg) => {
      const argWithSelectedValue = {
        ...arg,
        fullWidth: fp.includes(fp.get('type', arg), FULL_WIDTH_ARG_TYPES),
        selectedValue: getSelectedValue(arg)
      };

      return shouldAddToPreviousGroup(agg, arg)
        ? [
            ...fp.slice(0, agg.length - 1, agg),
            [...(fp.last(agg) || []), argWithSelectedValue]
          ]
        : [...agg, [argWithSelectedValue]];
    }, [])
  )(operation)
}));

const shouldAddToPreviousGroup = (agg, arg) =>
  !fp.includes(fp.get('type', arg), FULL_WIDTH_ARG_TYPES) &&
  fp.size(fp.last(agg)) &&
  fp.flow(
    fp.last,
    fp.first,
    fp.get('type'),
    fp.negate(fp.includes(fp.__, FULL_WIDTH_ARG_TYPES))
  )(agg);

const getSelectedValue = (arg) =>
  fp.includes(fp.get('type', arg), ARG_TYPES_WHERE_VALUE_IS_DEFAULT) ? 
    fp.get('type', arg) === 'boolean' ? 
      !!arg.value : 
    fp.get('type', arg) === 'number' ? 
      fp.toNumber(arg.value) : 
      arg.value : 
    fp.get('type', arg) === 'option' ?
      fp.get('value.0', arg) :
    fp.get('type', arg) === 'argSelector' ?
      fp.get('value.0.name', arg) :
    fp.get('type', arg) === 'toggleString' ?
      {
        option: fp.getOr('', 'toggleValues.0', arg),
        string: fp.getOr('', 'value', arg)
      } :
    fp.get('type', arg) === 'editableOptionShort' || fp.get('type', arg) === 'editableOption' ?
      fp.get('value.0.value', arg) :
      '';

module.exports = groupOperationArgs;