'use strict';
const Service = require('egg').Service;

const { common, merchantCenter } = require('../../config/serveApi');

class commonService extends Service {
  /**
   * @description 查询单个数据字典，
   * @param {Object} param 掺入的参数
   * @param {Boolean} isAll 是否需要转成map对象，默认转
   */
  async commonDictionary(param, isAll) {
    const defaultParam = {
      status: 1, // 1 启用 0 禁用 无 所有
      type: 1, // 1 下级第一级分类 2 所有下级分类 3 所有下级包含自己
    };
    const params = Object.assign(defaultParam, param);
    const { ctx } = this;
    try {
      const api = await ctx.helper.getUrl('crisps-common-api');
      if (!api) return ctx.helper.eurekaErr(ctx);
      const serverUrl = api + common.treeBook;
      const result = await ctx.http.get(serverUrl, params);
      if (isAll) {
        return result;
      }
      // 返回
      if (result.code === 200) {
        return (
          Array.isArray(result.data) &&
          result.data.length > 0 &&
          result.data.reduce((cur, acc) => {
            cur[acc.code] = acc.name;
            return cur;
          }, {})
        );
      }
      ctx.helper.error(ctx, result);
    } catch (error) {
      ctx.logger.error(error);
    }
  }
  /**
   * @description 查询多个个数据字典，
   * @param {Object} param 掺入的参数
   * @param {Boolean} isAll 是否需要转成map对象，默认转
   */
  async commonDictionarys(param, isAll) {
    param.type = 1; // 1 下级第一级分类 2 所有下级分类 3 所有下级包含自己
    param.status = 1; // 1 启用 0 禁用 无 所有
    const { ctx } = this;
    try {
      const api = ctx.helper.getUrl('crisps-common-api');
      if (!api) return ctx.helper.eurekaErr(ctx);
      const serverUrl = api + common.mutiTreeBook;
      const result = await ctx.http.get(serverUrl, param);
      if (isAll) {
        return result;
      }
      const { code, data = {} } = result || {};
      // 返回
      if (code === 200) {
        for (const key in data) {
          const item = data[key];
          if (!item) continue;
          data[key] = item.reduce((cur, acc) => {
            cur[acc.code] = acc.name;
            return cur;
          }, {});
        }
        return data;
      }
      ctx.helper.error(ctx, result);
    } catch (error) {
      ctx.logger.error(error);
    }
  }
  /**
   * @description 请求用户角色
   */
  async commonGetBaseInfo() {
    const { ctx } = this;
    try {
      const api = ctx.helper.getUrl('crm-common');
      if (!api) return ctx.helper.eurekaErr(ctx);
      const serverUrl = api + common.get_mch_base_info;
      const result = await ctx.http.get(
        serverUrl,
        {
          mchUserId: ctx.headers['x-req-merchantuserid'],
        },
        {
          headers: ctx.headers,
        }
      );
      return result;
    } catch (error) {
      ctx.logger.error(error);
    }
  }
  /**
   * @description 请求用户的商户信息
   * @param {Object} param 掺入的参数
   */
  async commonGetMerchantInfo(param) {
    const { ctx } = this;
    try {
      const api = ctx.helper.getUrl('merchant-center-manager');
      if (!api) return ctx.helper.eurekaErr(ctx);
      const serverUrl = api + merchantCenter.get_user_by_ids;
      return await ctx.http.post(serverUrl, JSON.stringify(param), {
        headers: ctx.headers,
      });
    } catch (error) {
      ctx.logger.error(error);
    }
  }
}
module.exports = commonService;
