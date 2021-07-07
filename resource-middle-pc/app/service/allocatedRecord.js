'use strict';
const Service = require('egg').Service;

const { bizService, resourceDistribution } = require('../../config/serveApi');

class AllocatedRecordService extends Service {
  /**
   * @description 录入记录列表
   * @param {Object} param 传入参数
   */
  async getList(param) {
    const { ctx } = this;
    try {
      const api = ctx.helper.getUrl('resource-distribution-center');
      if (!api) return ctx.helper.eurekaErr(ctx);
      const serverUrl = api + resourceDistribution.get_distribution_record_list;
      // 请求列表数据
      const res = await ctx.http.post(serverUrl, param, {
        headers: ctx.headers,
      });
      const { code, data = {} } = res || {};
      if (code !== 200) {
        return ctx.helper.error(ctx, res);
      }
      // 找出id查状态
      const mainBizIds = [];
      const records = data.records;
      if (!(Array.isArray(records) && records.length > 0)) return [res];
      for (let i = 0; i < records.length; i++) {
        const resourceId = records[i].resourceId;
        if (!resourceId) continue;
        mainBizIds.push(resourceId);
      }
      const api1 = ctx.helper.getUrl('crm-biz');
      if (!api1) return ctx.helper.eurekaErr(ctx);
      const serverUrl1 = api1 + bizService.list_biz_status;
      // 商机状态查询
      const result = await ctx.http.post(
        serverUrl1,
        { ids: mainBizIds },
        { headers: ctx.headers }
      );
      let statusData;
      if (result && result.code === 200) {
        statusData = (result.data || []).reduce((acc, cur) => {
          acc[cur.id] = cur;
          return acc;
        }, {});
      }
      return [res, statusData];
    } catch (error) {
      ctx.logger.error(error);
    }
  }
  /**
   * @description 导出录入记录列表
   * @param {Object} param 传入参数
   */
  async bizStatus(param) {
    const { ctx } = this;
    const api = ctx.helper.getUrl('crm-biz');
    if (!api) return ctx.helper.eurekaErr(ctx);
    const serverUrl = api + bizService.list_biz_status;
    const result = await ctx.http.post(serverUrl, param, {
      headers: ctx.headers,
    });
    return result;
  }
  /**
   * @description 导出录入记录列表
   * @param {Object} param 传入参数
   */
  async exportList(param) {
    const { ctx } = this;
    const api = ctx.helper.getUrl('resource-distribution-center');
    if (!api) return ctx.helper.eurekaErr(ctx);
    const serverUrl = api + resourceDistribution.export_distribution_record;
    const result = await ctx.http.post(serverUrl, param, {
      headers: ctx.headers,
    });
    return result;
  }
  /**
   * @description 查询商机最新信息
   * @param {Object} param 传入参数
   */
  async getBizInfo(param) {
    const { ctx } = this;
    const api = ctx.helper.getUrl('resource-distribution-center');
    if (api) {
      const serverUrl = api + resourceDistribution.pick_up_edit_biz;
      const result = await ctx.http.post(serverUrl, param, {
        headers: ctx.headers,
      });
      return result;
    }
    return ctx.helper.eurekaErr(ctx);
  }
}

module.exports = AllocatedRecordService;
