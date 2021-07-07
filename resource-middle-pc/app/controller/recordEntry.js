'use strict';
const Controller = require('egg').Controller;
const { Post, Prefix } = require('egg-shell-decorators');
const { rules } = require('../constants/listRules.js');
const { handleStall } = require('../utils/utils');
@Prefix('/yk/record_entry')
class RecordEntryController extends Controller {
  /**
   * @description 录入记录列表
   */
  @Post('/v1/get_record_entry_list.do')
  async list() {
    const { ctx, app } = this;
    const param = ctx.request.body;
    const valiErrors = app.validator.validate(rules, param);
    if (valiErrors) {
      ctx.helper.fail({ ctx, code: 422, res: valiErrors });
      return;
    }
    const service = ctx.service;
    try {
      const promiseList = [],
        parameter = {
          orderBy: 'create_time',
          isAsc: false,
        };
      promiseList.push(
        service.recordEntry.getList(Object.assign({}, parameter, param)),
        service.common.commonDictionary({
          code: 'RESOURCE_PLATFORM_CODE',
          type: 2,
        })
      );
      const [result0, result1] = await Promise.all(promiseList);
      const { code, data = {}, message } = result0 || {};
      if (code !== 200) {
        return ctx.helper.error(ctx, result0);
      }
      const { total = 0, records = [] } = data;
      const res = records.map(item => {
        return {
          bizNo: item.bizNo,
          customerName: item.customerName, // 客户姓名
          customerPhone: item.customerPhone, // 客户姓名
          requireName: item.requireName, // 需求
          bizCityName: item.bizAreaName, // 地区
          inputPeople: handleStall(item.createrName, item.createrNo),
          inputTime: item.createTime || '',
          sourcePlatform: result1[item.sourceSyscode] || '',
          inputId: item.createrId,
          firstSource: result1[item.firstSourceChannel] || '',
          secondSource: result1[item.secondSourceChannel] || '',
          sourceUrl: item.sourceUrl || '',
          keyword: item.keyword || '',
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
