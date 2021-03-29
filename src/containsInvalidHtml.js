const fp = require('lodash/fp');

const containsInvalidHtml = fp.flow(
  fp.replace(/\<\s*br\s*\/\s*\>/gi, ''),
  (entityValue) => /<[^>]*>/gi.test(entityValue)
);

module.exports = containsInvalidHtml;
