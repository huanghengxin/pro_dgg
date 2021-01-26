/**
 * 验证类
 */
import store from 'storejs';
const phone = store.get('userInfo')?.mainAccount || '';
//手机号验证新规则
const regPhone = /^1[3-9]\d{9}$/;
// const nameReg = /^[\u4e00-\u9fa5a-zA-Z0-9\s-]{2,20}$/;
const validatePhone = {
  methods: {
    checkPhone(rule, value, callback) {
      value = value.trim();
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
      value = value.trim();
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
      value = value.trim();
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

    checkContactNo(rule, value, callback) {
      value = value.trim();
      const field = rule.field;
      const index = field.indexOf('.');
      const i = field.slice(index + 1, index + 2);
      const ruleForm = this.ruleForm;
      const phoneList = [ruleForm.customerPhone, ruleForm.contactPerson.standbyPhone];
      ruleForm.phoneArray.forEach((item) => {
        phoneList.push(item.contactNo);
      });
      if (ruleForm.phoneArray[i]?.id || this.isDisabledStand) {
        callback();
      } else {
        const flag = regPhone.test(value);
        if (value === '') {
          if (field === 'contactPerson.standbyPhone') {
            if (
              ruleForm.contactPerson.standbyName ||
              [1, 0].includes(ruleForm.contactPerson.standbySex)
            ) {
              callback('备用联系人姓名性别存在，号码不能为空');
            }
            callback();
          }
          callback();
        } else if (!flag) {
          callback('请输入正确手机号');
        } else if (phone === value) {
          callback('不能输入自己的号码');
        } else if (phoneList.filter((item) => item === value).length > 1) {
          callback('不能输入相同号码');
        } else {
          callback();
        }
      }
    },
  },
};

export default validatePhone;
