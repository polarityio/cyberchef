const {
  FAVOURITE_OPERATION_DEFAULTS,
  FAVOURITE_OPERATION_OPTIONS
} = require('../src/constants');

module.exports = {
  name: 'CyberChef',
  acronym: 'CHEF',
  description:
    'Attempts to decode highlighted strings with the CyberChef Magic operation.',
  onDemandOnly: true,
  defaultColor: 'light-green',
  logging: {
    level: 'info' //trace, debug, info, warn, error, fatal
  },
  customTypes: [
    {
      key: 'encodedString',
      regex: /[\s\S]*/
    }
  ],
  styles: ['./styles/style.less'],
  block: {
    component: {
      file: './components/block.js'
    },
    template: {
      file: './templates/block.hbs'
    }
  },
  options: [
    {
      key: 'url',
      name: 'CyberChef Url',
      description:
        'Add your CyberChef Url to open up the CyberChef dashboard for full functionality. (e.g. https://gchq.github.io/CyberChef)',
      default: 'https://gchq.github.io/CyberChef',
      type: 'text',
      userCanEdit: true,
      adminOnly: false
    },
    {
      key: 'onlyShowMagic',
      name: 'Only Show Magic Results',
      description:
        'When checked, strings searched that do not immediately have a Magic suggestion will not be displayed in the overlay.',
      default: false,
      type: 'boolean',
      userCanEdit: true,
      adminOnly: false
    },
    {
      key: 'dontShowStepResults',
      name: "Don't Show Step Results",
      description:
        "By default, you can find the results for each step of your recipe when expanding on the Operation's title." +
        'If the step results are getting too long you can check this to make only the final output visible in the overlay.',
      default: false,
      type: 'boolean',
      userCanEdit: true,
      adminOnly: false
    },
    {
      key: 'minLength',
      name: 'Minimum Input Length',
      description: 'The minimum text input length for a string to be considered Input.',
      default: 5,
      type: 'number',
      userCanEdit: true,
      adminOnly: false
    },
    {
      key: 'favourites',
      name: 'Favourite Operations',
      description:
        'This is a list of the Favourites that will show up when you initially search for operations.',
      default: FAVOURITE_OPERATION_DEFAULTS,
      type: 'select',
      options: FAVOURITE_OPERATION_OPTIONS,
      multiple: true,
      userCanEdit: true,
      adminOnly: false
    }
  ]
};
