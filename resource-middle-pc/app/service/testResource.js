'use strict';
const Service = require('egg').Service;

const { resource } = require('../../config/serveApi');

class TestResourceService extends Service {
  /**
   * @description 测试客源线索列表
   * @param {Object} param 传入参数
   */
  async getList(param) {
    const { ctx } = this;
    const api = ctx.helper.getUrl('crisps-resource-house');
    const params = Object.assign(
      {
        orderBy: 'create_time',
        isAsc: false,
      },
      param
    );
    if (api) {
      const serverUrl = api + resource.find_test_list;
      return await ctx.http.post(serverUrl, params, {
        headers: ctx.headers,
      });
    }
    return ctx.helper.eurekaErr(ctx);
  }
  /**
   * @description 删除客源
   * @param {Object} param 传入参数
   */
  async deleteClue(param) {
    const { ctx } = this;
    const api = ctx.helper.getUrl('crisps-resource-house');
    if (api) {
      const serverUrl = api + resource.delete_by_id;
      return await ctx.http.post(serverUrl, param, {
        headers: ctx.headers,
      });
    }
    return ctx.helper.eurekaErr(ctx);
  }
}

module.exports = TestResourceService;
