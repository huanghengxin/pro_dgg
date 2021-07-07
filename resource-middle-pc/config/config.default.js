'use strict';
/**
 * @param {Egg.EggAppInfo} appInfo app info
 */

module.exports = appInfo => {
  const envConfig = require('./envConfig')(appInfo);
  const { config, userConfig } = envConfig;
  // 关闭跨域校验(注意:默认开启的话,跨域调用API必须进行token校验)
  // 配置指定的前端地址
  config.cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
    // 下共享跨域session，前端ajax请求也要加上响应的参数
    credentials: true,
  };
  config.security = {
    csrf: false,
    // 跨域白名单
    domainWhiteList: ['*'],
  };
  // eureka中后端API节点集群的实例名称
  config.apiClient = {
    APPID: [
      // cms实例名称
      'crisps-customer-center-api', // 客户中心
      'CRISPS-USER-CENTER-API', // 用户中心
      'crisps-common-api', // 公共服务
      'crm-biz', // 商机
      'resource-distribution-center', // 分配中心
      'crisps-resource-house', // 客源中心
      'crm-clue', // 线索
      'crm-common', // crm公共服务
      'crm-biz-drop', // crm调库服务
      'merchant-center-manager', // 商户中心
    ],
  };
  // add http_proxy to httpclient
  if (process.env.http_proxy) {
    config.httpclient = {
      request: {
        enableProxy: true,
        rejectUnauthorized: false,
        proxy: process.env.http_proxy,
      },
    };
  }
  const http = {
    headers: {
      common: {
        'Content-Type': 'application/json; charset=UTF-8',
        'X-User-Agent': '4b43c3f3-d817-4576-95b1-ad8519a2f14e',
      },
    },
    timeout: 10000,
  };
  return {
    ...config,
    ...userConfig,
    http,
  };
};
