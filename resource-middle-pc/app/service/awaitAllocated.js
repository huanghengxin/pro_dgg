'use strict';
const Service = require('egg').Service;

const {
  resourceDistribution,
  resource,
  bizService,
} = require('../../config/serveApi');

class AwaitAllocatedService extends Service {
  /**
   * @description 关黑限流人员查询
   * @param {Object} param 传入参数
   */
  async queryLimit(param) {
    const { ctx } = this;
    const api = ctx.helper.getUrl('crm-biz-drop');
    if (api) {
      const serverUrl = api + bizService.query_limit;
      const result = await ctx.http.post(serverUrl, param, {
        headers: ctx.headers,
      });
      return result;
    }
    return ctx.helper.eurekaErr(ctx);
  }
  /**
   * @description 分配多个商机接口
   * @param {Object} param 传入参数
   */
  async distributionMore(param) {
    const { ctx } = this;
    const api = ctx.helper.getUrl('resource-distribution-center');
    if (api) {
      const serverUrl = api + resourceDistribution.add_to_smart_allot;
      const result = await ctx.http.post(serverUrl, param, {
        headers: ctx.headers,
      });
      return result;
    }
    return ctx.helper.eurekaErr(ctx);
  }
  /**
   * @description 获取手动分配人员列表接口
   * @param {Object} param 传入参数
   */
  async getPeopleList(param) {
    const { ctx } = this;
    const api = ctx.helper.getUrl('resource-distribution-center');
    if (api) {
      const serverUrl = api + resourceDistribution.get_planner_list;
      const result = await ctx.http.post(serverUrl, param, {
        headers: ctx.headers,
      });
      return result;
    }
    return ctx.helper.eurekaErr(ctx);
  }
  /**
   * @description 手动分配商机
   * @param {Object} param 传入参数
   */
  async handleAllocatedBiz(param) {
    const { ctx } = this;
    const api = ctx.helper.getUrl('resource-distribution-center');
    if (api) {
      const serverUrl = api + resourceDistribution.manual_allot;
      const result = await ctx.http.post(serverUrl, param, {
        headers: ctx.headers,
      });
      return result;
    }
    return ctx.helper.eurekaErr(ctx);
  }
  /**
   * @description 编辑客源
   * @param {Object} param 传入参数
   */
  async editBiz(param) {
    const { ctx } = this;
    const api = ctx.helper.getUrl('crisps-resource-house');
    if (api) {
      const serverUrl = api + resource.update_business;
      const result = await ctx.http.post(serverUrl, param, {
        headers: ctx.headers,
      });
      return result;
    }
    return ctx.helper.eurekaErr(ctx);
  }
  /**
   * @description 删除待分配商机
   * @param {Object} param 传入参数
   */
  async deleteBiz(param) {
    const { ctx } = this;
    const api = ctx.helper.getUrl('crisps-resource-house');
    if (api) {
      const serverUrl = api + resource.delete_business;
      const result = await ctx.http.post(serverUrl, param, {
        headers: ctx.headers,
      });
      return result;
    }
    return ctx.helper.eurekaErr(ctx);
  }
  /**
   * @description 单个智能分配
   * @param {Object} param 传入参数
   */
  async allocationOne(param) {
    const { ctx } = this;
    const api = ctx.helper.getUrl('resource-distribution-center');
    if (api) {
      const serverUrl = api + resourceDistribution.add_one_to_smart_allot;
      const result = await ctx.http.post(serverUrl, param, {
        headers: ctx.headers,
      });
      return result;
    }
    return ctx.helper.eurekaErr(ctx);
  }
  /**
   * @description 查询需求详情
   * @param {Object} param 传入参数
   */
  async getRequirement(param) {
    const { ctx } = this;
    const api = ctx.helper.getUrl('crm-biz');
    if (api) {
      const serverUrl = api + bizService.get_requirement_info;
      const result = await ctx.http.get(serverUrl, param, {
        headers: ctx.headers,
      });
      return result;
    }
    return ctx.helper.eurekaErr(ctx);
  }
}

module.exports = AwaitAllocatedService;
