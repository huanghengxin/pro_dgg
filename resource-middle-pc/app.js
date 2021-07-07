'use strict';
require('babel-register')({
  plugins: [
    'transform-decorators-legacy',
  ],
});
module.exports = app => {
  // 将nuxt作为一个中间件,放入Egg内置中间件最前面（防止bodyParser之前篡改POST请求参数）
  // app.config.coreMiddleware.unshift('nuxt');

  // 监听其他子worker发送过来的数据信息
  app.messenger.on('appInstances', data => {
    // 将节点信息放入每个节点的egg缓存
    app.eurekaInstances = data;
  });
};
