'use strict';
const Service = require('egg').Service;

const { bizService, customerCenter } = require('../../config/serveApi');

class ResourceDetailsService extends Service {
  /**
   * @description 根据商机id查询字表商机详情
   * @param {param} param 传入的参数
   */
  async detailed(param) {
    const { ctx } = this;
    const api = ctx.helper.getUrl('crm-biz');
    if (api) {
      const serverUrl = api + bizService.get_business_detail;
      return await ctx.http.get(serverUrl, param, {
        headers: ctx.headers,
      });
    }
    return ctx.helper.eurekaErr(ctx);
  }
  /**
   * @description 新增备用联系人
   * @param {param} param 传入的参数
   */
  async addContact(param) {
    const { ctx } = this;
    const api = ctx.helper.getUrl('crisps-customer-center-api');
    if (api) {
      const serverUrl = api + customerCenter.save_customer_contact;
      return await ctx.http.post(serverUrl, param, {
        headers: ctx.headers,
      });
    }
    return ctx.helper.eurekaErr(ctx);
  }
  /**
   * @description 新增联系人后跟新操作日志
   * @param {param} param 传入的参数
   */
  // async addOperLog(param) {
  //   const { ctx } = this;
  //   const api = ctx.helper.getUrl('crm-biz');
  //   if (api) {
  //     const serverUrl = api + bizService.add_oper_log;
  //     return await ctx.http.post(serverUrl, param, {
  //       headers: ctx.headers,
  //     });
  //   }
  //   return ctx.helper.eurekaErr(ctx);
  // }
  /**
   * @description 修改未分配商机的需求
   * @param {param} param 传入的参数
   */
  async editUnallocated(param) {
    const { ctx } = this;
    const api = ctx.helper.getUrl('crm-biz');
    if (api) {
      const serverUrl = api + bizService.edit_unallocated;
      return await ctx.http.post(serverUrl, param, {
        headers: ctx.headers,
      });
    }
    return ctx.helper.eurekaErr(ctx);
  }
}

module.exports = ResourceDetailsService;
