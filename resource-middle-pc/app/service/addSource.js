'use strict';
const Service = require('egg').Service;

const {
  customerCenter,
  userCenter,
  bizService,
  culeService,
  resource,
} = require('../../config/serveApi');

class AddSourceService extends Service {
  /**
   * @description 通过手机号码获取客户id
   * @param {param} param 传入的参数
   */
  async getCustomerId(param) {
    param.sourceType = 'INSERT_BUSINESS';
    const { ctx } = this;
    const api = ctx.helper.getUrl('crisps-customer-center-api');
    // 存在ip地址则进去操作，否则返回undefined
    if (api) {
      const serverUrl = api + customerCenter.getCustomerId;
      const result = await ctx.http.get(serverUrl, param);
      return result;
    }
    return ctx.helper.eurekaErr(ctx);
  }
  /**
   * @description 获取线索列表
   * @param {param} param 传入的参数
   */
  async getCuleList(param) {
    param.conversion = 0; // 查询未转化线索
    const { ctx } = this;
    const api = ctx.helper.getUrl('crm-clue');
    if (api) {
      const serverUrl = api + culeService.find_list;
      const result = await ctx.http.post(serverUrl, param, {
        headers: ctx.headers,
      });
      return result;
    }
    return ctx.helper.eurekaErr(ctx);
  }
  /**
   * @description 判断当前号码是否是虚拟号码
   * @param {String} phone 明文手机号码
   */
  async checkPhoneIsTrue(phone) {
    const { ctx } = this;
    const api = ctx.helper.getUrl('CRISPS-USER-CENTER-API');
    const param = {
      userClass: 1,
      userType: 'ORDINARY_USER',
      phone,
      status: 1,
    };
    // 存在ip地址则进去操作，否则返回undefined
    if (api) {
      const serverUrl = api + userCenter.user;
      return await ctx.http.post(serverUrl, param, { headers: ctx.headers });
    }
    return ctx.helper.eurekaErr(ctx);
  }
  /**
   * @description 获取商机列表（查询商机主表）
   * @param {param} param 传入的参数
   * @param {param} reqSource 判断是否需求联查客源子表
   */
  async getMainBizList(param, reqSource) {
    const { ctx } = this;
    try {
      const api = ctx.helper.getUrl('crm-biz');
      if (!api) return ctx.helper.eurekaErr(ctx);
      const serverUrl = api + bizService.search_by_condition;
      const result0 = await ctx.http.post(serverUrl, param);
      const { code, data = {} } = result0 || {};
      if (code !== 200) {
        return ctx.helper.error(ctx, result0);
      }
      const ids = [];
      let minDataMap;
      const records = data.records;
      if (!(Array.isArray(records) && records.length > 0)) return [data];
      for (let i = 0; i < records.length; i++) {
        const resItem = records[i];
        if (reqSource === 'add') {
          const plannerId = resItem.plannerId;
          if (!(plannerId && resItem.bizLibrary === 'PERSONAL')) continue;
          ids.push(plannerId);
        } else {
          const resourceId = resItem.id;
          if (!resourceId) continue;
          ids.push(resourceId);
        }
      }
      if (reqSource === 'add') {
        if (ids.length === 0) return [data];
        // 录入客源页面需要
        const result = await ctx.service.common.commonGetMerchantInfo(ids);
        const { code: minCode, data: minData } = result || {};
        if (minCode !== 200) {
          return [data]; // 直接返回列表数据
        }
        // 转换成map对象
        minDataMap = (Array.isArray(minData) ? minData : []).reduce(
          (cur, acc) => {
            cur[acc.mchUserId] = acc;
            return cur;
          },
          {}
        );
      } else {
        const result = await this.getBizList(ids);
        const { code: minCode, data: minData } = result || {};
        if (minCode !== 200) {
          return ctx.helper.error(ctx, result);
        }
        // 转换成map对象
        minDataMap = (Array.isArray(minData) ? minData : []).reduce(
          (cur, acc) => {
            cur[acc.bizId] = acc;
            return cur;
          },
          {}
        );
      }
      return [data, minDataMap]; // 返回主表商机和字表商机mpa对象
    } catch (error) {
      ctx.helper.fail({
        ctx,
        code: 500,
        res: '后端接口异常！',
      });
      ctx.logger.error(error);
    }
  }
  /**
   * @description 查询客源商机子表
   * @param {param} param 传入的参数
   */
  async getBizList(param) {
    const { ctx } = this;
    const api = ctx.helper.getUrl('crisps-resource-house');
    if (api) {
      const serverUrl = api + resource.find_by_biz_ids;
      const result = await ctx.http.post(
        serverUrl,
        { bizIds: param },
        { headers: ctx.headers }
      );
      return result;
    }
    return ctx.helper.eurekaErr(ctx);
  }
  /**
   * @description 查询单个客源商机
   * @param {param} param 传入的参数
   */
  async getBiz(param) {
    const { ctx } = this;
    const api = ctx.helper.getUrl('crisps-resource-house');
    if (api) {
      const serverUrl = api + resource.find_by_biz_id;
      const result = await ctx.http.get(serverUrl, param, {
        headers: ctx.headers,
      });
      return result;
    }
    return ctx.helper.eurekaErr(ctx);
  }
  /**
   * @description 新增客源
   * @param {param} param 传入的参数
   */
  async addSource(param) {
    const { ctx } = this;
    const api = ctx.helper.getUrl('crisps-resource-house');
    if (api) {
      const serverUrl = api + resource.add_allot_business;
      const result = await ctx.http.post(serverUrl, param, {
        headers: ctx.headers,
      });
      return result;
    }
    return ctx.helper.eurekaErr(ctx);
  }
  /**
   * @description 测试号码新增客源
   * @param {param} param 传入的参数
   */
  async addSourceTest(param) {
    const { ctx } = this;
    const api = ctx.helper.getUrl('crisps-resource-house');
    if (api) {
      const serverUrl = api + resource.add;
      const result = await ctx.http.post(serverUrl, param, {
        headers: ctx.headers,
      });
      return result;
    }
    return ctx.helper.eurekaErr(ctx);
  }
  /**
   * @description 拾回商机
   * @param {param} param 传入的参数
   */
  async pickBack(param) {
    const { ctx } = this;
    const api = ctx.helper.getUrl('crisps-resource-house');
    if (api) {
      const serverUrl = api + resource.pick_up;
      const result = await ctx.http.post(serverUrl, param, {
        headers: ctx.headers,
      });
      return result;
    }
    return ctx.helper.eurekaErr(ctx);
  }
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
}

module.exports = AddSourceService;
