'use strict';
/**
 * 错误处理中间件,将项目中所有的错误信息进行包装拦截
 */
module.exports = (option, app) => {
  return async function errFilter(ctx, next) {
    try {
      await next();
      if (ctx.status === 404 && !ctx.body) {
        ctx.helper.fail({ ctx, code: 404, res: ctx.helper.errorCode[404] });
      }
    } catch (err) {
      ctx.logger.error(err);
      const error =
        app.config.env === 'prod' ? '服务器错误,请联系管理员' : String(err);
      return await ctx.helper.fail({ ctx, code: 500, res: error });
    }
  };
};
