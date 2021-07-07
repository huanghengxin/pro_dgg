'use strict';
/**
 * @description 默认Controller
 * @param {Object} rules 校验规则
 * @param {Object} serviceFile 需要请求的服务文件名
 * @param {Object} fn 需要请求的服务方法名
 */
module.exports = async function baseController(rules, serviceFile, fn) {
  const { ctx, app } = this;
  const param = ctx.method === 'POST' ? ctx.request.body : ctx.query;
  const valiErrors = app.validator.validate(rules, param);
  if (valiErrors) {
    ctx.helper.fail({ ctx, code: 422, res: valiErrors });
    return;
  }
  try {
    const result = await ctx.service[serviceFile][fn](param);
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
};
