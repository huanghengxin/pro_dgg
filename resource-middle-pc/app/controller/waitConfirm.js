'use strict';
const Controller = require('egg').Controller;
const { Get, Post, Prefix } = require('egg-shell-decorators');
const { rules, bizRules } = require('../constants/listRules.js');
const baseController = require('../utils/baseConstroll');
@Prefix('/yk/wait_confirm')
class RecordEntryController extends Controller {
  /**
   * @description 待确认列表
   */
  @Post('/v1/get_wait_confirm_list.do')
  async list() {
    const { ctx, app } = this;
    const param = ctx.request.body;
    const valiErrors = app.validator.validate(rules, param);
    if (valiErrors) {
      ctx.helper.fail({ ctx, code: 422, res: valiErrors });
      return;
    }
    const params = {
      orderBy: 'create_time',
      isAsc: false,
    };
    const service = ctx.service;
    try {
      const promiseList = [];
      promiseList.push(
        service.addSource.getCuleList(Object.assign(params, param)),
        service.common.commonDictionary({
          code: 'RESOURCE_PLATFORM_CODE',
          type: 2,
        })
      );
      const [result0, result1] = await Promise.all(promiseList);
      const { code, data = {}, message } = result0 || {};
      if (code === 200) {
        const { total = 0, records = [] } = data;
        const res = records.map(item => {
          return {
            id: item.id,
            customerName: item.customerName, // 客户姓名
            customerSex: item.customerSex, // 性别回显
            customerId: item.customerId, // 客户id
            customerPhone: item.customerPhone, // 客户号码
            customerContact: item.customerContact, // 加密
            requireName: item.requireName || '', // 需求
            bizCityName: item.bizAreaName || '', // 地区
            sourcePlatform: result1[item.sourceSyscode] || '', // 来源平台
            sourcePlatformCode: item.sourceSyscode || '', // 来源平台
            firstSource: result1[item.firstSourceChannel] || '', // 一级来源渠道
            firstSourceChannelCode: item.firstSourceChannel || '', // 一级来源渠道
            secondSourceChannelCode: item.secondSourceChannel || '', // 二级来源渠道
            secondSource: result1[item.secondSourceChannel] || '', // 二级来源渠道
            comment: item.comment || '', // 备注
            sourceUrl: item.sourceUrl || '', // 来源URL
            keyword: item.keyword || '', // 关键词
            customerAttr: item.customerAttribute || '', // 客户属性
            enterTime: item.createTime,
          };
        });
        ctx.code = 200;
        ctx.body = {
          code,
          data: {
            total,
            records: res,
          },
          message,
        };
        return;
      }
      ctx.helper.error(ctx, result0);
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
   * @description 查询线索详情
   */
  @Get('/v1/find_by_id.do')
  async findClueInfo() {
    const rules = {
      id: {
        type: 'id',
        required: true,
      },
    };
    await baseController.call(this, rules, 'waitConfirm', 'findClueInfo');
  }
  /**
   * @description 删除客源
   */
  @Get('/v1/delete_clue.do')
  async deleteClue() {
    const rules = {
      id: {
        type: 'id',
        required: true,
      },
    };
    await baseController.call(this, rules, 'waitConfirm', 'deleteClue');
  }
  /**
   * @description 完善客源
   */
  @Post('/v1/complete_clue.do')
  async completeClue() {
    const { ctx, app } = this;
    // 定义参数校验规则
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
    // 参数校验
    const param = ctx.request.body;
    const valiErrors = app.validator.validate(rule, param);
    // 参数校验未通过
    if (valiErrors) {
      ctx.helper.fail({ ctx, code: 422, res: valiErrors });
      return;
    }
    try {
      const result = await ctx.service.waitConfirm.completeClue(param);
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
}

module.exports = RecordEntryController;
