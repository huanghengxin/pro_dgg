'use strict';
const Service = require('egg').Service;

const { resource } = require('../../config/serveApi');

class RecordEntryService extends Service {
  /**
   * @description 录入记录列表
   * @param {Object} param 传入参数
   */
  async getList(param) {
    const { ctx } = this;
    const api = ctx.helper.getUrl('crisps-resource-house');
    if (api) {
      const serverUrl = api + resource.find_list;
      const result = await ctx.http.post(serverUrl, param, {
        headers: ctx.headers,
      });
      return result;
    }
    return ctx.helper.eurekaErr(ctx);
  }
}

module.exports = RecordEntryService;
