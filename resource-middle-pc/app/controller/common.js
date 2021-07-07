'use strict';
const Controller = require('egg').Controller;
const { Get, Prefix } = require('egg-shell-decorators');
const { bookRules, bookRulesMulti } = require('../constants/listRules.js');
@Prefix('/yk/resource_common')
class CommonController extends Controller {
  /**
   * @description 单个code查询数据字典
   */
  @Get('/v1/find_tree_book_list.do')
  async treeBook() {
    const { ctx, app } = this;
    const valiErrors = app.validator.validate(bookRules, ctx.query);
    if (valiErrors) {
      ctx.helper.fail({ ctx, code: 422, res: valiErrors });
      return;
    }
    try {
      const result = await ctx.service.common.commonDictionary(ctx.query, true);
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
   * @description 多个code查询数据字典
   */
  @Get('/v1/find_tree_book_list_multi.do')
  async list() {
    const { ctx, app } = this;
    const valiErrors = app.validator.validate(bookRulesMulti, ctx.query);
    if (valiErrors) {
      ctx.helper.fail({ ctx, code: 422, res: valiErrors });
      return;
    }
    try {
      const result = await ctx.service.common.commonDictionarys(
        ctx.query,
        true
      );
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
   * @description 请求用户角色
   */
  @Get('/v1/get_mch_base_info.do')
  async authlist() {
    const { ctx } = this;
    console.log('ctx.headers', ctx.headers['x-req-merchantuserid']);
    try {
      const result = await ctx.service.common.commonGetBaseInfo();
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

module.exports = CommonController;
