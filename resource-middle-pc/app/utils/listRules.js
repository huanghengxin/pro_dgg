'use strict';

const rules = {
  start: {
    type: 'number',
    default: 1,
    required: false,
  },
  limit: {
    type: 'number',
    default: 10,
    required: false,
  },
};

module.exports = rules;
