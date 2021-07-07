'use strict';
/**
 * 判断ereuka的API节点是否获取到
 */
module.exports = (option, app) => {
  return async function eureka(ctx, next) {
    const appInstances = app.eurekaInstances ? app.eurekaInstances : [];
    if (appInstances.length === 0) {
      const err = '未获取到eureka服务实例下的后端节点';
      ctx.logger.error(new Error(err));
      return await ctx.helper.fail({ ctx, code: 503, res: err });
    }
    await next();
  };
};
