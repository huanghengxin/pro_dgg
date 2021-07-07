'use strict';
const Controller = require('egg').Controller;
const { Post, Prefix } = require('egg-shell-decorators');
const { rules } = require('../constants/listRules.js');
const baseController = require('../utils/baseConstroll');
@Prefix('/yk/distribution_set')
class DistributionSetController extends Controller {
  /**
   * @description 设置获取数据
   */
  @Post('/v1/get_biz_distribution_type.do')
  async getData() {
    const { ctx, app } = this;
    const param = ctx.request.body;
    const rules = {
      code: { type: 'string', required: true },
    };
    // 参数校验
    const valiErrors = app.validator.validate(rules, param);
    if (valiErrors) {
      ctx.helper.fail({ ctx, code: 422, res: valiErrors });
      return;
    }
    const service = ctx.service;
    try {
      const result0 = await service.common.commonDictionary(param, true);
      const { code, data } = result0 || {};
      if (code !== 200) {
        return ctx.helper.error(ctx, result0);
      }
      const codes = (data || []).map(item => item.code).join(',');
      const result = await service.distributionSet.getInfo({
        ruleCodes: codes,
      });
      if (result.code === 200) {
        ctx.status = 200;
        ctx.body = {
          code: result.code,
          data: {
            dictionary: data,
            show: result.data,
          },
          message: result.message,
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
  /**
   * @description 保存规则信息
   */
  @Post('/v1/save_resource_distribution_rules.do')
  async saveData() {
    const { ctx, app } = this;
    const param = ctx.request.body;
    const rules = {
      rules: {
        type: 'array',
        required: true,
        itemType: 'object',
        rule: {
          ruleCode: 'string',
          ruleName: 'string',
          ruleStatus: 'string',
          ruleDesc: 'string',
        },
      },
    };
    // 参数校验
    const valiErrors = app.validator.validate(rules, param);
    if (valiErrors) {
      ctx.helper.fail({ ctx, code: 422, res: valiErrors });
      return;
    }
    try {
      const result = await ctx.service.distributionSet.save(param);
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
   * @description 获取操作日志列表
   */
  @Post('/v1/get_operation_log_list.do')
  async getList() {
    await baseController.call(this, rules, 'distributionSet', 'getList');
  }
}
module.exports = DistributionSetController;
