'use strict';
const Service = require('egg').Service;

const { resourceDistribution } = require('../../config/serveApi');

class DistributionSetService extends Service {
  /**
   * @description 通过code码获取规则信息
   * @param {Object} param 传入参数
   */
  async getInfo(param) {
    const { ctx } = this;
    const api = ctx.helper.getUrl('resource-distribution-center');
    if (api) {
      const serverUrl =
        api + resourceDistribution.query_resource_rules_by_codes;
      const result = await ctx.http.post(serverUrl, param, {
        headers: ctx.headers,
      });
      return result;
    }
    return ctx.helper.eurekaErr(ctx);
  }
  /**
   * @description 通过code码获取规则信息
   * @param {Object} param 传入参数
   */
  async save(param) {
    const { ctx } = this;
    const api = ctx.helper.getUrl('resource-distribution-center');
    if (api) {
      const serverUrl =
        api + resourceDistribution.save_resource_distribution_rules;
      const result = await ctx.http.post(serverUrl, param, {
        headers: ctx.headers,
      });
      return result;
    }
    return ctx.helper.eurekaErr(ctx);
  }
  /**
   * @description 智能分配日志
   * @param {Object} param 传入参数
   */
  async getList(param) {
    const { ctx } = this;
    const api = ctx.helper.getUrl('resource-distribution-center');
    if (api) {
      const serverUrl = api + resourceDistribution.get_operation_log_list;
      const result = await ctx.http.post(serverUrl, param, {
        headers: ctx.headers,
      });
      return result;
    }
    return ctx.helper.eurekaErr(ctx);
  }
}

module.exports = DistributionSetService;
