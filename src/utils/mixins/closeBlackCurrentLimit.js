/**
 * 验证类
 */
const validateCloseBlackCurrentLimit = {
  methods: {
    //关黑限流校验限制方式相同与否
    checkLimitTypeName(rule, value, callback) {
      const ruleForm = this.ruleForm;
      const field = rule.field;
      const index = field.split('.');
      const limitTypeNameIndex = index[1];
      if (limitTypeNameIndex == this.delIndex) {
        callback();
        return;
      }
      if (!value) {
        callback('请选择限制方式');
      } else if (ruleForm.limitWayList.filter((item) => item.limitTypeName === value).length > 1) {
        callback('不能选择相同限制方式');
      } else {
        callback();
      }
    },
    //关黑限流校验百分数
    checkLimitProportion(rule, value, callback) {
      const field = rule.field;
      const index = field.split('.');
      const limitProportionIndex = index[1];
      if (limitProportionIndex == this.delIndex) {
        callback();
        return;
      }
      let regLimitProportion = /^([1-9]|[1-9]\d|100)$/;
      if (!value) {
        callback('请输入');
      } else if (!regLimitProportion.test(value)) {
        callback('请输入1-100整数');
      } else {
        callback();
      }
    },
    //关黑限流校验周期选择
    checkLimitTime(rule, value, callback) {
      const field = rule.field;
      const index = field.split('.');
      const limitTimeIndex = index[1];
      if (limitTimeIndex == this.delIndex) {
        callback();
        return;
      }
      if (!value) {
        callback('请选择时间');
      } else {
        callback();
      }
    },
  },
};

export default validateCloseBlackCurrentLimit;
