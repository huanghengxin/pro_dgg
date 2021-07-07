'use strict';
module.exports = app => {
  return {
    schedule: {
      interval: '10s', // 20秒间隔
      type: 'worker', // 每台机器上只有一个 worker 会执行这个定时任务，每次执行定时任务的 worker 的选择是随机的。
      immediate: true, // 启动时立即执行一次
    },
    async task(ctx) {
      const APPIDALL = app.config.apiClient.APPID;
      // 查询所有eureka的节点信息
      const getInstancesList = [];
      // 创建多个获取APPID的任务
      APPIDALL.map(APPID => getInstancesList.push(app.eureka.getInstancesByAppId(APPID)));
      // 使用promise.all执行多个返回的promise任务对象
      const instancesList = await Promise.all(getInstancesList);
      const instancesObject = {};
      // 将获取到的节点放入对应的APPID中
      instancesList.map((instances, index) => {
        instancesObject[APPIDALL[index]] = instances;
        return true;
      });
      // 将得到的各实例的节点信息发送给其他worker进程
      ctx.app.messenger.sendToApp('appInstances', instancesObject);
    },
  };
};
