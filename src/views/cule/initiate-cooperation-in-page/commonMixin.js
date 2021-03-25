const commonMixins = {
  data() {
    let reg = /^[1-9]{1,}[\d]*$/;
    // let reg = /^((2[0-9])|(3[0-9])|4[0-5])$/;
    const checkProportion = (rule, value, callback) => {
      console.log(value, 'value');
      value = value.toString().trim();
      if (!value) {
        callback(new Error(`比例不能为空`));
        this.ruleForm.ratio = '';
      } else if (!reg.test(value)) {
        callback(new Error('请输入正整数'));
      } else if (
        value < Number(this.ratio.minCooperationRatio) ||
        value > Number(this.ratio.maxCooperationRatio)
      ) {
        callback(
          new Error(
            `最高比例为${Number(this.ratio.minCooperationRatio)}%-${Number(
              this.ratio.maxCooperationRatio,
            )}%`,
          ),
        );
      } else {
        callback();
      }
    };
    return {
      rules: {
        customerPhone: [{ required: true, validator: this.checkPhone, trigger: 'blur' }],
        customerName: [
          { required: true, validator: this.checkCtomerName, trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' },
        ], //姓名
        requirementCode: [
          {
            required: true,
            message: '请选择您的需求',
            trigger: 'change',
          },
        ],
        areaCode: [{ required: true, message: '请选择业务区域', trigger: 'change' }],
        //合作类型
        type: [
          {
            required: true,
            message: '请选择合作类型',
            trigger: 'change',
          },
        ],
        receiveUserId: [
          {
            required: true,
            message: '请选择合作接收方',
            trigger: 'change',
          },
        ],
        //合作比例
        ratio: [
          {
            required: true,
            validator: checkProportion,
            trigger: 'blur',
          },
        ],
        allocationMode: [{ required: true, message: '请选择', trigger: 'blur' }],
      },
    };
  },
  computed: {},
  mounted() {},
  methods: {},
};

export default commonMixins;
