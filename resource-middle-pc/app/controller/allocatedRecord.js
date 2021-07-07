'use strict';
const Controller = require('egg').Controller;
const { Get, Post, Prefix } = require('egg-shell-decorators');
const baseController = require('../utils/baseConstroll');
const { rules } = require('../constants/listRules.js');
@Prefix('/yk/allocated_record')
class AllocatedRecordController extends Controller {
  /**
   * @description 分配记录列表
   */
  @Post('/v1/get_allocated_record_list.do')
  async list() {
    const { ctx, app } = this;
    const param = ctx.request.body;
    const valiErrors = app.validator.validate(rules, param);
    if (valiErrors) {
      ctx.helper.fail({ ctx, code: 422, res: valiErrors });
      return;
    }
    const { allocatedRecord, common } = ctx.service;
    try {
      const promiseList = [];
      promiseList.push(
        allocatedRecord.getList(param),
        common.commonDictionary({
          code: 'RESOURCE_PLATFORM_CODE',
        })
      );
      const [values0, values1 = {}] = await Promise.all(promiseList);
      const { code, data = {} } = values0[0] || {};
      if (code === 200) {
        const { totalCount = 0, records = [] } = data;
        const result = records.map(item => {
          return {
            bizLibrary: values0[1]
              ? values0[1][item.resourceId].bizLibrary
              : '',
            resourceId: item.resourceId,
            bizId: item.resourceId,
            id: item.id,
            bizNo: item.resourceNo, // 商机编号
            customerName: item.customerName, // 客户姓名
            customerPhone: item.desensitization, // 手机号码
            requireName: item.intentionType, // 需求
            bizCityName: item.intentionCity, // 地区回显
            allotWay: item.allotWay, // 分配方式
            entryTime: item.entryTime, // 录入时间
            allotTime: item.allotTime, // 录入时间
            assignerName: item.assignerName, // 分配人
            merchantsName: item.merchantsName, // 接收商户
            plannerName: item.plannerName, // 接收人名称
            userId: values0[1]
              ? values0[1][item.resourceId]
                ? values0[1][item.resourceId].plannerId || ''
                : ''
              : '', // 接收人id
            entryName: item.entryName, // 录入人名称
            keyword: item.keyword, // 关键词
            sourceUrl: item.sourceUrl, // 来源URL0
            sourceChannel: values1[item.sourcePlatformCode] || '', // 来源渠道
            sourcePlatformCode: item.sourcePlatformCode || '', // 来源渠道code
          };
        });
        ctx.status = 200;
        ctx.body = {
          code,
          data: {
            total: totalCount,
            records: result,
          },
        };
        return;
      }
      ctx.helper.error(ctx, values0[0]);
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
   * @description 导出分配记录列表
   */
  @Post('/v1/export_allocated_record_list.do')
  async exportList() {
    const { ctx } = this;
    // 合并请求参数
    const param = {
      start: 1,
      limit: 10,
    };
    const params = Object.assign(param, ctx.request.body);
    try {
      const result = await ctx.service.allocatedRecord.exportList(params);
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
   * @description 查询商机最新信息
   */
  @Get('/v1/get_biz_by_id.do')
  async getBizInfo() {
    const rules = {
      resourceId: {
        type: 'id',
        required: true,
      },
    };
    await baseController.call(this, rules, 'allocatedRecord', 'getBizInfo');
  }
  /**
   * @description 查询商机状态
   */
  @Post('/v1/list_biz_status.do')
  async getBizStatus() {
    const rules = {
      ids: {
        type: 'array',
        required: true,
        itemType: 'string',
      },
    };
    await baseController.call(this, rules, 'allocatedRecord', 'bizStatus');
  }
}

module.exports = AllocatedRecordController;
