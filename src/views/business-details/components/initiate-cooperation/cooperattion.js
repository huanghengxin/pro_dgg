import { get_mch_user_info_list, get_user_business_category } from 'api/common';
import { get_no_cooperation_list, save_by_present_customer } from 'api/cooperation-in-page';
import NewRequire from './components/newRequire/index.vue';
import './index.scss';
export default {
  components: {
    NewRequire,
  },
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
        customerName: '', //客户姓名
        requirementCode: '', //客户需求code
        requirementName: '', //客户需求
        requirementParentCode: '', //客户需求父级Code
        bizRequirementId: '', //客户需求No
        type: '', //合作类型
        allocationMode: 1, //分配方式
        ratio: '', //合作比例
        grabOrderScope: '', //抢单人员范围(1.本商户,2.薯片平台)
        receiveUserId: undefined, //合作接收方ID
        receiveUserName: undefined, //合作接收方姓名
        mchUserId: '', //商户id
        reason: '', //合作原因
      },
      dialogVisible: false, //控制弹窗显示隐藏
      loading: false, //加载效果
      tooltip:
        '自留维护权：合作双方共享客户，均有客户维护权限，但客户实际归属于合作发起方。转出维护权：合作建立后客户归属于接收方，发起方仅有查看功能。',
      isDisabledStand: false, //合作接收方远程人员搜索
      defaultPeopleList: [], //搜索人员默认列表
      peopleList: [], //合作接收人请求列表
      selectLoading: false,
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
        requirementCode: [
          {
            required: true,
            message: '请选择您的需求',
            trigger: 'change',
          },
        ],
        customerName: [
          {
            required: true,
            message: '请输入客户姓名',
            trigger: 'change',
          },
        ],
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
        ratio: [
          {
            required: true,
            validator: checkProportion,
            trigger: 'blur',
          },
        ],
        allocationMode: [{ required: true, message: '请选择', trigger: 'blur' }],
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
      console.log(info, 'info');
      this.ruleForms.customerName = info.customerName;

      this.getRequireNameList(info.id); //客户需求
      // let requireList = eval(this.requireStr);
      // if (requireList.length > 1) {
      //   this.requireNameList = requireList;
      // }
      // if (requireList.length == 1) {
      //   this.ruleForms.requirementCode = requireList[0].intentionName;
      //   this.ruleForms.bizRequirementId = requireList[0].requirementNo;
      // }
      // console.log(this.requireNameList, 'this.requireNameList');
    },
    /**
     * @description 弹层关闭的回调
     */
    diologHandleClose() {
      this.$refs.ruleForms.resetFields();
      this.ruleForms.allocationMode = 1;
      this.ruleForms.reason = '';
      this.isActive = 1;
      this.dialogVisible = false;
    },
    /**
     * @description 获取客户需求
     */
    getRequireNameList(id) {
      let params = {
        id,
      };
      get_no_cooperation_list(params)
        .then((res) => {
          if (res.code === 200) {
            const { data } = res;
            //判断数据数量是否为1，为1则直接显示
            if (data.length === 1) {
              this.ruleForms.requirementName = data[0].name;
              this.ruleForms.requirementId = data[0].id;
            }
            this.requireNameList = data || [];
          } else {
            this.$message.warning(res.message);
          }
        })
        .catch(() => {});
    },
    /**
     * @description 分配方式切换
     * @param {Number}
     */
    changeFullFree(id) {
      this.$refs.ruleForms.clearValidate('ratio');
      this.$refs.ruleForms.clearValidate('receiveUserId');
      this.isActive = id;
      this.ruleForms.allocationMode = id;
      console.log(this.ruleForms.allocationMode, 'this.ruleForms.allocationMode1');
      if (this.ruleForms.allocationMode == 2) {
        this.ruleForms.grabOrderScope = '1';
      }
      // console.log(this.isActive, 'this.isActive');
      this.$refs.ruleForms.validateField('allocationMode', (error) => {
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
      /*此处receiveUserId需要修改*/
      this.ruleForms.receiveUserName = val.userName;
      this.ruleForms.receiveUserId = val.mchUserId;
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
     * @description 新增需求
     */
    addNewRequire() {
      console.log('新增需求');
      this.$refs.newRequireRef.openModal();
    },
    /**
     * @description 提交事件
     */
    submitV(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          this.loading = true;
          console.log(this.ruleForms, 'this.ruleForms');
          const params = { ...this.ruleForms };
          save_by_present_customer(params)
            .then((res) => {
              const { data, code, message } = res;
              if (code === 200) {
                console.log(data, 'data');
                this.$eventBus.$emit('reload-list', true, 'Partners');
              } else {
                this.$message.warning(message);
              }
              this.loading = false;
              this.dialogVisible = false;
            })
            .catch(() => ((this.loading = false), (this.dialogVisible = false)));
        }
      });
    },
  },
};
