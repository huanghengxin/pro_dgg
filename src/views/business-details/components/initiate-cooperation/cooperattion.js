import { get_mch_user_info_list, get_user_website, get_user_business_category } from 'api/common';
import './index.scss';
export default {
  data() {
    let reg = /^((2[0-9])|(3[0-9])|4[0-5])$/;
    const checkProportion = (rule, value, callback) => {
      if (!reg.test(value)) {
        callback(new Error('最高比例为20%-45%'));
      } else {
        callback();
      }
    };
    return {
      ruleForms: {
        customerName: '张先生', //客户姓名
        customerRequire: '', //客户需求
        customerRequireNo: '', //客户需求No
        cooperationType: '', //合作类型
        fullFree: 1, //分配方式
        cooperationProportion: '', //合作比例
        singleRange: 1, //抢单人员范围
        cooperationAcceptor: '', //合作接收方
        mchUserId: '', //商户id
        workingReason: '', //合作原因
      },
      dialogVisible: false, //控制弹窗显示隐藏
      loading: false, //加载效果
      tooltip:
        '自留维护权：合作双方共享客户，均有客户维护权限，但客户实际归属于合作发起方。转出维护权：合作建立后客户归属于接收方，发起方仅有查看功能。',
      isDisabledStand: false, //合作接收方远程人员搜索
      defaultPeopleList: [], //搜索人员默认列表
      peopleList: [], //合作接收人请求列表
      selectLoading: false,
      customerDemandList: [], //客户需求
      isActive: 1,
      requireNameList: [], //需求列表
      order: [
        { id: 1, name: '定向分单' },
        { id: 2, name: '抢单' },
      ],
      //合作类型
      typeList: [
        { id: 1, key: 'ZILIU', value: '自留' },
        { id: 2, key: 'WEIHU', value: '维护' },
      ],
      requireStr:
        "[{'intentionName':'广告传媒类','requirementNo':'BXQ202102020163028'},{'intentionName':'工商变更','requirementNo':'BXQ202102030168005'},{'intentionName':'工商变更','requirementNo':'BXQ202102030168007'}]",
      rules: {
        customerRequire: [
          {
            required: true,
            message: '请选择您的需求',
            trigger: 'change',
          },
        ],
        cooperationType: [
          {
            required: true,
            message: '请选择合作类型',
            trigger: 'change',
          },
        ],
        cooperationAcceptor: [
          {
            required: true,
            message: '请选择合作接收方',
            trigger: 'change',
          },
        ],
        cooperationProportion: [
          {
            required: true,
            validator: checkProportion,
            trigger: 'blur',
          },
        ],
        fullFree: [{ required: true, message: '请选择', trigger: 'blur' }],
        areaCode: [{ required: true, message: '请选择业务区域', trigger: 'change' }],
      },
      props: {
        lazy: true,
        lazyLoad: (node, resolve) => {
          const { level, data, value } = node;
          const params = {
            productTypeCode: data?.productTypeCode || undefined,
            code: value,
          };
          get_user_business_category(params).then((res) => {
            if (res.code === 200) {
              let { data } = res;
              data = Array.isArray(data) ? data : [];
              const _arrMap = data.map((item) => {
                return {
                  value: item.code,
                  label: item.name,
                  leaf: level >= 2,
                  productTypeCode: item.productTypeCode,
                };
              });
              resolve(_arrMap);
            } else {
              this.$message.warning(res.message);
              resolve([]);
            }
          });
        },
      },
    };
  },
  created() {
    this.getPeopleList(
      {
        start: 1,
        limit: 1000,
        // mchDetailId: this.mchDetailId,
        mchDetailId: '732138543570502120',
      },
      'default',
    );
  },
  methods: {
    typeChange(value) {
      console.log(value, 'value');
    },
    /**
     * @description 弹窗打开时的事件
     */
    openModal(info) {
      this.dialogVisible = true;
      // console.log(info, 'info');
      this.ruleForms.customerName = info.customerName;
      let requireList = eval(this.requireStr);
      if (requireList.length > 1) {
        this.requireNameList = requireList;
      }
      if (requireList.length == 1) {
        this.ruleForms.customerRequire = requireList[0].intentionName;
        this.ruleForms.customerRequireNo = requireList[0].requirementNo;
      }
      console.log(this.requireNameList, 'this.requireNameList');
      this.getCustomerDemandList(); //客户需求
    },
    diologHandleClose() {
      this.$refs.ruleForms.resetFields();
      this.ruleForms.fullFree = 1;
      this.isActive = 1;
      this.dialogVisible = false;
    },
    /**
     * @description 获取客户需求
     */
    getCustomerDemandList() {
      get_user_website()
        .then((res) => {
          if (res.code === 200) {
            res = res.data;
            this.customerDemandList = res?.list || [];
          } else {
            this.$message.warning(res.message);
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
    /**
     * @description 分配方式切换
     * @param {Number}
     */
    changeFullFree(id) {
      this.$refs.ruleForms.clearValidate('cooperationProportion');
      this.$refs.ruleForms.clearValidate('cooperationAcceptor');
      this.isActive = id;
      this.ruleForms.fullFree = id;
      // console.log(this.isActive, 'this.isActive');
      this.$refs.ruleForms.validateField('fullFree', (error) => {
        if (!error) {
          return;
        }
      });
    },
    /**
     * @description 陪谈人搜索选中方法
     */
    selectChangeHandle(val) {
      console.log(val, 'val');
      if (val === '') {
        this.peopleList = this.defaultPeopleList;
      }
      this.ruleForms.mchUserId = val.mchUserId;
      this.ruleForms.cooperationAcceptor = val.userName;
    },
    /**
     * @description 远程搜索陪谈人
     */
    remoteMethod(keyword) {
      if (!keyword.trim()) return;
      this.selectLoading = true;
      const params = {
        start: 1,
        limit: 1000,
        mchDetailId: '732138543570502120',
      };
      const regPhone = /^1[3-9]\d{9}$/;
      if (regPhone.test(keyword)) {
        params.phone = keyword;
      } else {
        params.searchKey = keyword;
      }
      this.getPeopleList(params);
    },
    //获取合作接收方人员list
    getPeopleList(params, type) {
      get_mch_user_info_list(params)
        .then((res) => {
          if (res.code === 200) {
            res = res.data;
            this.peopleList = res.records || [];
            if (type) {
              this.defaultPeopleList = res.records;
            }
            this.selectLoading = false;
          } else {
            this.$message.warning(res.message);
          }
        })
        .catch(() => (this.selectLoading = false));
    },
    handleBlue() {
      if (this.peopleList.length === 0) {
        this.peopleList = this.defaultPeopleList;
      }
    },
    /**
     * @description 提交事件
     */
    submitV(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          this.loading = true;
          console.log(this.ruleForms, 'this.ruleForms');
          setTimeout(() => {
            // this.dialogVisible = false;
          }, 3000);
        }
      });
    },
  },
};
