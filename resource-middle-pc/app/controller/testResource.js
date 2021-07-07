'use strict';
const Controller = require('egg').Controller;
const { Post, Prefix } = require('egg-shell-decorators');
const baseController = require('../utils/baseConstroll');
const { rules } = require('../constants/listRules.js');
const { handleStall } = require('../utils/utils');
@Prefix('/yk/test_resource')
class TestResourceController extends Controller {
  /**
   * @description 查询商机列表
   */
  @Post('/v1/get_test_resource_list.do')
  async list() {
    const { ctx, app } = this;
    const { testResource, common } = ctx.service;
    const param = ctx.request.body;
    const params = Object.assign(
      {
        type: 'CLUE',
      },
      param
    );
    const valiErrors = app.validator.validate(rules, params);
    if (valiErrors) {
      ctx.helper.fail({ ctx, code: 422, res: valiErrors });
      return;
    }
    try {
      const promiseList = [];
      promiseList.push(
        testResource.getList(params),
        common.commonDictionary({
          code: 'RESOURCE_PLATFORM_CODE',
          type: 2,
        })
      );
      const [result0 = {}, result1 = {}] = await Promise.all(promiseList);
      const { code, data = {}, message } = result0;
      if (code === 200) {
        const { records = [], total = 0 } = data;
        const res = records.map(item => {
          const obj = {
            id: item.id,
            customerName: item.customerName, // 客户姓名
            customerPhone: item.customerPhone, // 联系号码
            requireName: item.requireName || '', // 需求
            bizCityName: item.bizAreaName || '', // 地区
            sourcePlatform: result1[item.sourceSyscode] || '', // 来源平台
            firstSource: result1[item.firstSourceChannel] || '', // 一级来源渠道
            secondSource: result1[item.secondSourceChannel] || '', // 二级来源渠道
            sourceUrl: item.sourceUrl || '', // 来源URL
            keyword: item.keyword || '',
            inputTime: item.createTime || '', // 录入时间
            remark: item.comment || '', // 录入时间
          };
          if (params.type === 'CLUE') {
            obj.customerAttribute = item.customerAttribute;
            obj.remark = item.comment;
          } else {
            obj.inputPeople = handleStall(item.createrName, item.createrNo); // 录入人
            obj.bizNo = item.no;
          }
          return obj;
        });
        ctx.status = 200;
        ctx.body = {
          code,
          data: {
            records: res,
            total,
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
   * @description 删除测试待确认
   */
  @Post('/v1/delete_by_id.do')
  async deleteClue() {
    const rules = {
      id: {
        type: 'id',
        required: true,
      },
    };
    await baseController.call(this, rules, 'testResource', 'deleteClue');
  }
}
module.exports = TestResourceController;
