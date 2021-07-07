/**
 * 验证类
 */
import store from 'storejs';
const phone = store.get('userInfo')?.mainAccount || '';
//手机号验证新规则
const regPhone = /^1[3-9]\d{9}$/;
const regUrl =
  /^http(s?)\:\/\/[0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*(:(0-9)*)*(\/?)([a-zA-Z0-9\-\.\?\,\'\/\\\+&amp;%$#_]*)?/;
const validatePhone = {
  methods: {
    checkPhone(rule, value, callback) {
      // 编辑时存在id不校验号码
      if (this.customerPhone) {
        callback();
        return;
      }
      value = value?.trim();
      if (this.query?.clueId) callback();
      const flag = regPhone.test(value);
      if (!value) {
        callback('手机号不能为空');
      } else if (!flag) {
        callback('请输入正确手机号');
      } else if (phone === value) {
        callback('不能输入自己的号码');
      } else {
        callback();
      }
    },
    checkCtomerName(rule, value, callback) {
      value = value?.trim();
      const flag = regPhone.test(value);
      if (!value) {
        callback('姓名不能为空');
      } else if (flag) {
        callback('手机号不能作为姓名');
      } else {
        callback();
      }
    },
    checkStandbyName(rule, value, callback) {
      value = value?.trim();
      const flag = regPhone.test(value);
      if (value) {
        if (flag) {
          callback('手机号不能作为姓名');
        } else {
          callback();
        }
      } else {
        callback();
      }
    },
    checkUrl(rule, value, callback) {
      value = value?.trim();
      const flag = regUrl.test(value);
      if (!value) {
        callback();
      } else if (!flag) {
        callback('请输入正确URL！');
      } else {
        callback();
      }
    },
  },
};

export default validatePhone;
