'use strict';
const Controller = require('egg').Controller;
const { Get, Post, Prefix } = require('egg-shell-decorators');
const { allocationStatus } = require('../constants/biz');
const { rules, bizRules } = require('../constants/listRules.js');

@Prefix('/yk/add_source')
class AddSourceController extends Controller {
  /**
   * @description 查询商机列表
   */
  @Post('/v1/get_source_list.do')
  async list() {
    const { ctx, app } = this;
    const { addSource, common } = ctx.service;
    // 默认值
    const params = ctx.request.body;
    const rule = Object.assign(
      {
        customerPhone: {
          type: 'string',
          required: true,
          format: /^1[3-9]\d{9}$/,
        }, // 号码
      },
      rules
    );
    const valiErrors = app.validator.validate(rule, params);
    if (valiErrors) {
      ctx.helper.fail({ ctx, code: 422, res: valiErrors });
      return;
    }
    try {
      const promiseList = [];
      promiseList.push(
        addSource.getMainBizList(params, 'add'),
        common.commonDictionary({
          code: 'rule_biz_db_code',
        })
      );
      const [values0, values1] = await Promise.all(promiseList);
      const [valuesBiz = {}, valuesMer = {}] = values0 || [];
      const { totalCount = 0, records = [] } = valuesBiz;
      // 过滤返回数据及重新设置数据key
      const res = records.map(item => {
        const data = {
          bizId: item.id, // 商机id
          bizNo: item.bizNo, // 商机编号
          customerContact: item.customerContact, // 加密手机号用于拾回编辑商机
          customerName: item.customerName, // 客户姓名
          customerPhone: item.customerPhone, // 客户姓名
          requireName: item.requireName, // 需求
          bizCityName: item.bizCityName, // 地区
          plannerId: item.plannerId,
          comment: item.comment || '',
          customerSex: item.customerSex || '', // 性别回显
          sourceSyscode: item.sourceSyscode, // 来源平台
          requireParentName: item.requireParentName, // 二级客户需求
        };
        // 进行库编码判断，如果是平台库则判断当前状态，
        if (item.bizLibrary === 'PLATFORM') {
          data.curSearName = allocationStatus[item.allocationStatus];
          // buttonName 前端按钮文字 type 用于按钮判断
          data.buttonName = '去分配';
          data.type =
            item.allocationStatus === 0 ? 'no_allocationing' : 'allocationing'; // no_allocationing 待分配 allocationing 分配中
        } else if (item.bizLibrary === 'PERSONAL') {
          data.curSearName = `<p>${item.plannerName}（${
            item.jobNumber || '-'
          }）</p><p>${values1 ? values1[item.bizLibrary] : '暂无数据'}-${
            valuesMer[item.plannerId]
              ? valuesMer[item.plannerId].mchName || '暂无'
              : '暂无'
          }</p>`;
          data.customerId = item.customerId; // 客户id用于提醒规划师按钮
          data.buttonName = '提醒规划师';
          data.type = 'im';
        } else {
          if (item.isHidden === 1) {
            data.curSearName = '企大顺隐藏库';
          } else {
            data.curSearName = values1
              ? `企大顺${values1[item.bizLibrary]}`
              : '暂无数据'; // 当前位子
          }
          data.buttonName = '拾回';
          data.type = 'handle_back';
        }
        return data;
      });
      return ctx.helper.success({
        ctx,
        code: 200,
        res: {
          total: totalCount,
          records: res,
        },
      });
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
   * @description 录入客源号码失焦查询
   */
  @Get('/v1/check_biz_by_phone.do')
  async checkPhone() {
    const { ctx, app } = this;
    // 定义参数校验规则
    const rules = {
      phone: { type: 'string', required: true, format: /^1[3-9]\d{9}$/ },
    };
    // 参数校验
    const valiErrors = app.validator.validate(rules, ctx.query);

    if (valiErrors) {
      ctx.helper.fail({ ctx, code: 422, res: valiErrors });
      return;
    }
    try {
      const service = ctx.service;
      const phone = ctx.query.phone;
      const result = await service.addSource.checkPhoneIsTrue(phone);
      const { code: code0, data: data0 } = result || {};
      if (code0 !== 200) {
        return ctx.helper.error(ctx, result);
      }
      // 用户中心查询是否是虚拟号码，是虚拟号码不许查询商机和线索
      if (data0 && data0.records.length > 0) {
        ctx.status = 200;
        ctx.body = {
          code: 10008, // 用于判断当前虚拟号码
          res: data0,
        };
        return;
      }
      const result1 = await service.addSource.getCuleList({
        customerPhone: phone,
        start: 1,
        limit: 1,
        orderBy: 'create_time',
        isAsc: false,
      });
      const { code, data = {} } = result1 || {};
      if (code !== 200) {
        return ctx.helper.error(ctx, result1);
      }
      return ctx.helper.success({
        ctx,
        code: 200,
        res: data,
      });
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
   * @description 新增资源商机
   */
  @Post('/v1/add_source.do')
  async addSource() {
    const { ctx, app } = this;
    // 定义参数校验规则
    // customerSex 客户性别 keyword 关键词 secondSourceChannel 二级来源渠道
    const rule = Object.assign(
      {
        customerPhone: {
          type: 'string',
          required: true,
          format: /^1[3-9]\d{9}$/,
        }, // 号码
      },
      bizRules
    );
    // 参数校验
    const param = ctx.request.body;
    const valiErrors = app.validator.validate(rule, param);
    // 参数校验未通过
    if (valiErrors) {
      ctx.helper.fail({ ctx, code: 422, res: valiErrors });
      return;
    }
    try {
      const result = await ctx.service.addSource[
        param.type === 'test' ? 'addSourceTest' : 'addSource'
      ](param);
      const { code } = result || {};
      if (code === 200) {
        ctx.status = 200;
        ctx.body = result;
        return;
      }
      ctx.helper.error(ctx, result);
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
   * @description 编辑商机并拾回平台库
   */
  @Post('/v1/handle_back.do')
  async handleBack() {
    const { ctx, app } = this;
    const rule = Object.assign(
      {
        customerContact: {
          type: 'string',
          required: true,
        }, // 加密号码
        id: { type: 'id', required: true }, // 编辑商机id
      },
      bizRules
    );
    const query = ctx.request.body;
    const valiErrors = app.validator.validate(rule, query);
    // 参数校验未通过
    if (valiErrors) {
      ctx.helper.fail({ ctx, code: 422, res: valiErrors });
      return;
    }
    try {
      const result = await ctx.service.addSource.pickBack(query);
      const { code } = result || {};
      if (code === 200) {
        ctx.status = 200;
        ctx.body = result;
        return;
      }
      ctx.helper.error(ctx, result);
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
   * @description 拾回商机查询字表数据
   */
  @Get('/v1/find_resource_details_by_id.do')
  async resourceDetails() {
    const { ctx, app } = this;
    const rules = {
      bizId: {
        type: 'string',
        required: true,
      },
    };
    const query = ctx.query;
    const valiErrors = app.validator.validate(rules, query);
    // 参数校验未通过
    if (valiErrors) {
      ctx.helper.fail({ ctx, code: 422, res: valiErrors });
      return;
    }
    try {
      const result = await ctx.service.addSource.getBiz(query);
      const { code, data, message } = result || {};
      if (code === 200) {
        let info;
        if (data) {
          info = {
            firstSourceChannelCode: data.firstSourceChannel || '',
            secondSourceChannelCode: data.secondSourceChannel || '',
            keyword: data.keyword || '',
            sourceUrl: data.sourceUrl || '',
            customerAttribute: data.customerAttribute || '',
          };
        }
        ctx.status = 200;
        ctx.body = {
          code,
          data: info || {},
          message,
        };
        return;
      }
      ctx.helper.error(ctx, result);
    } catch (error) {
      ctx.helper.fail({
        ctx,
        code: 500,
        res: '后端接口异常！',
      });
      ctx.logger.error(error);
    }
  }
}
module.exports = AddSourceController;
