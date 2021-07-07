'use strict';
const Crypto = require('crypto');
const { getOneInstanceFromAll, getServerPath } = require('../utils');
// 网络请求状态码
const errorCode = {
  200: '请求成功。客户端向服务器请求数据，服务器返回相关数据',
  201: '资源创建成功。客户端向服务器提供数据，服务器创建资源',
  202: '请求被接收。但处理尚未完成',
  204: '客户端告知服务器删除一个资源，服务器移除它',
  206: '请求成功。但是只有部分回应',
  400: '请求无效。数据不正确，请重试',
  401: '请求没有权限。缺少API token，无效或者超时',
  403: '用户得到授权，但是访问是被禁止的',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作',
  406: '请求失败。请求头部不一致，请重试',
  410: '请求的资源被永久删除，且不会再得到的',
  422: '请求失败。请验证参数',
  500: '服务器发生错误，请检查服务器',
  502: '网关错误',
  503: '服务不可用，服务器暂时过载或维护',
  504: '网关超时',
};
module.exports = {
  // redis缓存加密的key
  cacheKey(method, path, query) {
    const keyString = method + path + JSON.stringify(query);
    const md5CacheKey = Crypto.createHash('md5')
      .update(keyString)
      .digest('base64');
    return md5CacheKey;
  },
  eurekaErr(ctx) {
    const err = '未获取到eureka服务实例下的后端节点';
    ctx.logger.error(new Error(err));
    ctx.status = 503;
    ctx.body = {
      code: 503,
      message: errorCode[503],
      data: err,
    };
  },
  error(ctx, result) {
    ctx.status = 200;
    ctx.body = {
      code: result.code,
      message: result.message,
      data: result.data,
    };
  },
  // 请求成功时的响应格式
  success({ ctx, code = 200, res = null }) {
    ctx.status = 200;
    ctx.body = {
      code,
      message: errorCode[code],
      data: res,
    };
  },

  // 请求失败时的响应格式
  fail({ ctx, code = 500, res = null, detailMessage = '' }) {
    ctx.status = 200;
    ctx.body = {
      code,
      message: detailMessage || errorCode[code],
      data: res,
    };
  },
  getUrl(instancesName) {
    const { ctx, app } = this;
    // 检测有是否传入实例Name
    if (
      instancesName &&
      app.config.apiClient.APPID.indexOf(instancesName) === -1
    ) {
      const err = new Error('请使用正确的appName获取节点');
      ctx.logger.error(err);
      throw err;
    }
    // 根据实例Name获取实例下的节点信息
    const appInstances = app.eurekaInstances[instancesName];
    // 从实例列表中获取一个节点
    const ins = getOneInstanceFromAll(appInstances);
    // 获取节点的网络地址
    const serverUrl = getServerPath(ins);
    return serverUrl;
  },
};
