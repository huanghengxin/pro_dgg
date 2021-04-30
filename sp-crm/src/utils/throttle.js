/**
 * @description 节流，防止重复点击
 * @param {Function} 需要执行的函数
 * @param {String} 定时器执行时间
 */
import Vue from 'vue';

class Throttle {
  constructor(delay) {
    this.delay = delay;
    this.canExecute = true;
    this.timer = null;
    this.isMsg = '你点的太快了';
  }
  handle(fn, item) {
    const { timer, canExecute, isMsg, delay } = this;
    //清空上次触发的定时器
    if (timer) {
      //提示消息
      if (isMsg) Vue.prototype.$message.info(isMsg);
      clearTimeout(timer);
    }
    //判断是否可以执行
    if (canExecute) {
      this.canExecute = false;
      if (!fn) {
        console.error('节流函数', new Error('请传入需要执行的函数'));
      }
      //执行传入函数
      fn(item);
    } else {
      this.timer = setTimeout(() => {
        this.canExecute = true;
        this.timer = null;
        if (item) {
          delete item.id;
        }
      }, delay);
    }
  }
}

/**
 * @description 工厂函数，生成实例
 * @returns {Function} 实例
 */

const createThrottle = (delay) => {
  return new Throttle(delay);
};
export default createThrottle;
