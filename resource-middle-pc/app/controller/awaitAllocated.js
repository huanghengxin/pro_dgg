'use strict';
const Controller = require('egg').Controller;
const { Get, Post, Prefix } = require('egg-shell-decorators');
const baseController = require('../utils/baseConstroll');
const { rules, bizRules } = require('../constants/listRules.js');
const { handleStall } = require('../utils/utils');
@Prefix('/yk/await_allocated')
class AwaitAllocatedController extends Controller {
  /**
   * @description 待分配列表
   */
  @Post('/v1/get_await_allocated_list.do')
  async list() {
    const { ctx, app } = this;
    const { addSource, common } = ctx.service;
    const param = ctx.request.body;
    const valiErrors = app.validator.validate(rules, param);
    if (valiErrors) {
      ctx.helper.fail({ ctx, code: 422, res: valiErrors });
      return;
    }
    try {
      param.allocationStatus = 0; // 查询待分配列表默认传入参数
      const params = Object.assign(
        {
          orderBy: 'create_time',
          isAsc: false,
        },
        param
      );
      const promiseList = [];
      promiseList.push(
        addSource.getMainBizList(params, true),
        common.commonDictionary({
          code: 'RESOURCE_PLATFORM_CODE',
        })
      );
      const [values0 = [], values1 = {}] = await Promise.all(promiseList);
      const [val0 = {}, val1 = {}] = values0;
      // 返回前端数据
      const result = (Array.isArray(val0.records) ? val0.records : []).map(
        item => {
          const minItem = val1[item.id] || {};
          return {
            bizId: item.id,
            bizNo: item.bizNo, // 商机编号
            customerName: item.customerName, // 客户姓名
            customerPhone: item.customerPhone, // 手机号码6
            customerContact: item.customerContact,
            requireName: item.requireName, // 需求
            requireCode: item.requireCode, // 需求code
            awaitAllocatedType: item.allocationType, // 待分配类型
            comment: item.comment, // 备注
            sourceSyscode: values1[item.sourceSyscode] || '', // 来源平台
            firstSourceChannelCode: minItem.firstSourceChannel, // 一级来源渠道
            secondSourceChannelCode: minItem.secondSourceChannel, // 一级来源渠道
            sourcePlatformCode: item.sourceSyscode, // 来源平台
            sourceUrl: minItem.sourceUrl || '', // 来源URL
            keyword: minItem.keyword || '', // 关键词
            inputPeople: handleStall(item.createrName, item.createrNo), // 录入人
            inputTime: item.createTime, // 录入时间
            sex: item.customerSex, // 性别回显
            bizCityName: item.bizCityName, // 地区回显
            bizCityCode: item.bizCity, // 地区code回显
          };
        }
      );
      ctx.helper.success({
        ctx,
        code: 200,
        res: {
          type: 'biz',
          total: val0.totalCount || 0,
          records: result,
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
   * @description 单个和多个智能分配
   */
  @Post('/v1/add_to_smart_allot.do')
  async distribution() {
    const { ctx, app } = this;
    try {
      const param = ctx.request.body;
      const rules = {
        list: {
          type: 'array',
          required: true,
          itemType: 'string',
        },
      };
      const valiErrors = app.validator.validate(rules, param);
      // 参数校验未通过
      if (valiErrors) {
        ctx.helper.fail({ ctx, code: 422, res: valiErrors });
        return;
      }
      const awaitAllocated = ctx.service.awaitAllocated;
      const result = await awaitAllocated.distributionMore(param);
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
   * @description 获取分配人员列表
   */
  @Post('/v1/get_people_list.do')
  async peopleList() {
    const peopleRule = {
      intentionCity: 'string',
      intentionType: 'string',
    };
    await baseController.call(
      this,
      Object.assign({}, rules, peopleRule),
      'awaitAllocated',
      'getPeopleList'
    );
  }
  /**
   * @description 是否关黑限流
   */
  @Post('/v1/query_limit.do')
  async queryLimit() {
    const { ctx, app, service } = this;
    const rules = {
      mchUserIds: {
        type: 'array',
        required: true,
        itemType: 'string',
      },
    };
    const param = ctx.request.body;
    const params = {
      limitType: 'RULE_FLOW_LIMIT_RESOURCE',
    };
    Object.assign(param, params);
    const valiErrors = app.validator.validate(rules, param);
    if (valiErrors) {
      ctx.helper.fail({ ctx, code: 422, res: valiErrors });
      return;
    }
    try {
      const result = await service.awaitAllocated.queryLimit(param);
      const { code } = result || {};
      if (code === 200) {
        ctx.code = 200;
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
   * @description 手动分配商机
   */
  @Post('/v1/handle_allocated_biz.do')
  async handleAllocatedBiz() {
    const rules = {
      bizId: {
        type: 'id',
        required: true,
      },
      plannerId: 'string',
    };
    await baseController.call(
      this,
      rules,
      'awaitAllocated',
      'handleAllocatedBiz'
    );
  }
  /**
   * @description 编辑客源
   */
  @Post('/v1/update_business.do')
  async editBiz() {
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
    await baseController.call(this, rule, 'awaitAllocated', 'editBiz');
  }
  /**
   * @description 删除客源
   */
  @Post('/v1/delete_biz.do')
  async deleteBiz() {
    const rules = {
      id: {
        type: 'id',
        required: true,
      },
    };
    await baseController.call(this, rules, 'awaitAllocated', 'deleteBiz');
  }
  /**
   * @description 单个智能分配
   */
  @Post('/v1/add_one_to_smart_allot.do')
  async allocationOne() {
    const rules = {
      resourceId: {
        type: 'id',
        required: true,
      },
    };
    await baseController.call(this, rules, 'awaitAllocated', 'allocationOne');
  }
  /**
   * @description 查询需求信息
   */
  @Get('/v1/get_requirement_info.do')
  async getRequirement() {
    const rules = {
      bizId: {
        type: 'id',
        required: true,
      },
    };
    await baseController.call(this, rules, 'awaitAllocated', 'getRequirement');
  }
}

module.exports = AwaitAllocatedController;
