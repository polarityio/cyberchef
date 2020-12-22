module.exports = {
  name: 'CyberChef',
  acronym: 'CHEF',
  description: 'Attempts to decode highlighted strings with the CyberChef Magic operation.',
  onDemandOnly: true,
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
  summary: {
    component: {
      file: './components/summary.js'
    },
    template: {
      file: './templates/summary.hbs'
    }
  },
  options: [
    {
      key: 'asciiOnly',
      name: 'Only Display ASCII Printable Characters',
      description:
        'If checked, only text which decodes to printable ASCII characters will be displayed (ASCII codes between 32 and 127.',
      default: false,
      type: 'boolean',
      userCanEdit: true,
      adminOnly: false
    },
    {
      key: 'minLength',
      name: 'Minimum Input Length',
      description:
        'The minimum text input length for a string to be decoded and displayed.',
      default: 15,
      type: 'number',
      userCanEdit: true,
      adminOnly: false
    }
  ]
};
