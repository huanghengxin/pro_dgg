'use strict';
const Service = require('egg').Service;

const { resource, culeService } = require('../../config/serveApi');

class RecordEntryService extends Service {
  /**
   * @description 待确认列表
   * @param {Object} param 传入参数
   */
  async deleteClue(param) {
    const { ctx } = this;
    const api = ctx.helper.getUrl('crm-clue');
    if (api) {
      const serverUrl = api + resource.delete_resource;
      return await ctx.http.post(serverUrl, param, {
        headers: ctx.headers,
      });
    }
    return ctx.helper.eurekaErr(ctx);
  }
  /**
   * @description 完善客源
   * @param {Object} param 传入参数
   */
  async completeClue(param) {
    const { ctx } = this;
    const api = ctx.helper.getUrl('crisps-resource-house');
    if (api) {
      const serverUrl = api + resource.complete_clue;
      return await ctx.http.post(serverUrl, param, {
        headers: ctx.headers,
      });
    }
    return ctx.helper.eurekaErr(ctx);
  }
  /**
   * @description 查询线索详情
   * @param {Object} param 传入参数
   */
  async findClueInfo(param) {
    const { ctx } = this;
    const api = ctx.helper.getUrl('crm-clue');
    if (api) {
      const serverUrl = api + culeService.find_by_id;
      return await ctx.http.get(serverUrl, param, {
        headers: ctx.headers,
      });
    }
    return ctx.helper.eurekaErr(ctx);
  }
}

module.exports = RecordEntryService;
