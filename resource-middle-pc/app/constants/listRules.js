'use strict';
// 列表默认规则
const rules = {
  start: {
    type: 'number',
    default: 1,
    required: true,
  },
  limit: {
    type: 'number',
    default: 10,
    required: true,
  },
};
// 数据字典默认规则
const bookRules = {
  type: {
    type: 'number',
    default: 1,
    required: false,
  },
  status: {
    type: 'number',
    required: true,
  },
  code: {
    type: 'string',
    required: true,
  },
};
// 数据字典默认规则
const bookRulesMulti = {
  type: {
    type: 'number',
    default: 1,
    required: false,
  },
  status: {
    type: 'number',
    required: true,
  },
  codes: {
    type: 'string',
    required: true,
  },
};

const bizRules = {
  customerName: { type: 'string', required: true }, // 姓名
  requireParentCode: { type: 'string', required: true },
  requireParentName: { type: 'string', required: true }, // 二级
  requireCode: { type: 'string', required: true },
  requireName: { type: 'string', required: true }, // 三级
  productTypeCode: { type: 'string', required: true }, // 一级
  bizAreaCode: { type: 'string', required: true }, // 地区
  bizAreaName: { type: 'string', required: true },
  sourceUrl: { type: 'string', required: false, max: 200 }, // 来源url
  sourceSyscode: { type: 'string', required: true }, // 来源平台
  firstSourceChannel: { type: 'string', required: true }, // 一级来源
  comment: { type: 'string', required: false, max: 200, trim: true }, // 备注
};

module.exports = {
  rules,
  bookRules,
  bookRulesMulti,
  bizRules,
};
