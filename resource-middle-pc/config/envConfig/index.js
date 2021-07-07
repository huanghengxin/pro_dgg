'use strict';
const release = require('./config.release');
const development = require('./config.development');
const production = require('./config.production');
const DGG_SERVER_ENV = process.env.DGG_SERVER_ENV;
const BASE = {
  // 开发、测试环境
  development,
  // 预发布环境
  release,
  // 生产环境
  production,
};
module.exports = BASE[DGG_SERVER_ENV];
