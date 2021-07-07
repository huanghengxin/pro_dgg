'use strict';
const Service = require('egg').Service;

class RedisService extends Service {
  // 写入内容到redis
  async set(key, value, seconds) {
    const { ctx } = this;
    try {
      const { redis } = this.app;
      value = JSON.stringify(value);
      if (seconds) {
        // 设置失效时间ex:秒,px:毫秒
        await redis.set(`shupian-wap-${key}`, value, 'ex', seconds);
      } else {
        await redis.set(`shupian-wap-${key}`, value);
      }
    } catch (error) {
      ctx.logger.error(error);
    }
  }
  // 获取redis数据
  async get(key) {
    const { ctx } = this;
    let data = null;
    try {
      const { redis } = this.app;
      data = await redis.get(`shupian-wap-${key}`);
      return JSON.parse(data);
    } catch (error) {
      ctx.logger.error(error);
      return data;
    }
  }
  // 清空redis内容
  async flushall() {
    const { ctx } = this;
    try {
      const { redis } = this.app;
      const res = await redis.flushall();
      return res;
    } catch (error) {
      ctx.logger.error(error);
    }
  }
}
module.exports = RedisService;
