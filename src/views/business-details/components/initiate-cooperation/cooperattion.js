import { get_user_business_category } from 'api/common';
import {
  getMeetAllianceListByBizId,
  save_by_present_customer,
  get_receiver,
  cooperation_proportion,
} from 'api/cooperation-in-page';
import { get_business_info } from 'api/business-details';
import NewRequire from './components/new-require/index.vue';
import { getQueryString } from 'utils/helper';
import store from 'storejs';
import './index.scss';
export default {
  components: {
    NewRequire,
  },
  directives: {
    // 自定义指令 设置滚动到底部加载下一页的数据
    loadmore: {
      inserted(el, binding, vnode) {
        // 获取element-ui定义好的scroll盒子
        const SELECTWRAP_DOM = el.querySelector('.el-select-dropdown .el-select-dropdown__wrap');
        SELECTWRAP_DOM.addEventListener('scroll', function () {
          if (vnode.context.optionFlag) {
            // 滚到底部
            const CONDITION = this.scrollHeight - this.scrollTop <= this.clientHeight;
            if (CONDITION) {
              vnode.context.optionPage += 1;
              vnode.context.getPeopleList(
                vnode.context.optionKey,
                'peopleList',
                vnode.context.optionPage,
              );
            }
          }
        });
      },
    },
  },
  data() {
    let reg = /^[1-9]{1,}[\d]*$/;
    const checkProportion = (rule, value, callback) => {
      value = (value + '')?.trim();
      if (!value) {
        callback(new Error(`比例不能为空`));
        this.ruleForms.ratio = '';
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
      ruleForms: {
        customerName: '', //客户姓名
        requirementCode: undefined, //客户需求code
        requirementName: undefined, //客户需求
        requirementParentCode: undefined, //客户需求父级Code
        requirementId: '', //客户需求No
        areaCode: undefined, //业务区域
        areaName: undefined,

        type: '', //合作类型
        allocationMode: 1, //分配方式
        ratio: '', //合作比例
        grabOrderScope: undefined, //抢单人员范围(1.本商户,2.薯片平台)
        receiveUserId: undefined, //合作接收方ID
        receiveUserName: undefined, //合作接收方姓名
        mchUserId: '', //商户id
        reason: undefined, //合作原因
        bizId: '', //商机id
      },
      //合作比例
      cooperationRatioInfo: {
        retention: {
          minCooperationRatio: '',
          maxCooperationRatio: '',
        },
        transferOut: {
          minCooperationRatio: '',
          maxCooperationRatio: '',
        },
      },
      bizInfo: {}, //商机详情数据
      stateNum: 1, //计数
      dialogVisible: false, //控制弹窗显示隐藏
      loading: false, //加载效果
      tooltip:
        '自留维护权：合作双方共享客户，均有客户维护权限，但客户实际归属于合作发起方。转出维护权：合作建立后客户归属于接收方，发起方仅有查看功能。',
      defaultPeopleList: [], //搜索人员默认列表
      peopleList: [], //合作接收人请求列表
      selectLoading: false,
      requireFlag: '', //控制*号 显示
      mchDetailId: '',
      isActive: 1,
      requireNameList: [], //需求列表
      openedFlag: false,
      optionPage: 1, //下拉框页数
      optionKey: '', //下拉框关键字
      optionFlag: false, //滚动加载
      order: [
        //分配方式
        { id: 1, name: '定向分单' },
        { id: 2, name: '抢单' },
      ],
      //合作类型
      typeList: [
        { id: '1', key: 'ZILIU', value: '自留维护权' },
        { id: '2', key: 'ZHUANCHU', value: '转出维护权' },
      ],
      rules: {
        requirementCode: [
          {
            required: true,
            message: '请选择您的需求',
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
  watch: {
    requireNameList: {
      handler: function (val, oldval) {
        if (val.length == 1) {
          this.rules.requirementCode[0].required = false;
          this.ruleForms.requirementName = this.requireNameList[0].intentionName;
          this.$refs.ruleForms.clearValidate('requirementCode');
        } else {
          this.rules.requirementCode[0].required = true;
        }
      },
    },
  },
  computed: {
    ratio() {
      let ratio = undefined;
      if (this.cooperationRatioInfo) {
        if (this.ruleForms.type == 2) {
          ratio = this.cooperationRatioInfo.transferOut;
        } else {
          ratio = this.cooperationRatioInfo.retention;
        }
      }
      return ratio;
    },
  },
  created() {
    this.mchDetailId = store.get('mchInfo')?.mchDetailId || '';
    let query = new getQueryString();
    this.ruleForms.bizId = query?.businessId;
  },
  methods: {
    //合作类型切换
    typeChange() {
      this.ruleForms.ratio = '';
      this.$refs.ruleForms.clearValidate('ratio');
      this.getCooperationProportion(); //比例范围
    },
    handleOpened() {
      if (!this.openedFlag) return;
      this.$message.warning('已有客户商机，无需填写基础信息可直接发起');
    },
    /**
     * @description 弹窗打开时的事件
     */
    openModal(info, data, type) {
      console.log(info, data, type, 'info, data, type');
      this.dialogVisible = true;
      this.getCooperationProportion(); //比例范围
      this.ruleForms.customerName = info.customerName;
      this.getPeopleList();
      if (type == 'list') {
        const bizInfo = data || {};
        console.log(bizInfo, 'this.bizInfo1');
        this.ruleForms.bizId = info?.bizId;
        this.ruleForms.customerName = bizInfo.customerName;
        this.ruleForms.type = typeof info.type == String ? info.type : info.type.toString();
        this.ruleForms.reason = info.reason;
        this.ruleForms.ratio = info.ratio;
        this.ruleForms.receiveName = info.receiveName;
        // TODO 23点18分 CQJ此处有修改 this.ruleForms.receiveUserId = info.receiveUserId;
        this.ruleForms.receiveUserId = '';
        this.ruleForms.allocationMode = info.allocationMode;
        this.isActive = Number(info.allocationMode);
        this.ruleForms.grabOrderScope = 1;
        this.getRequireNameList(info.bizId, info.requirementCode); //客户需求
      } else {
        this.ruleForms.bizId = info?.id;
        this.getRequireNameList(info.id); //客户需求
        this.getBusinessInfo(info.id); //商机详情
        this.openedFlag = type;
      }
    },
    /**
     * @description 获取商机基本信息
     */
    getBusinessInfo(bizId) {
      const params = { bizId: bizId };
      get_business_info(params).then((res) => {
        const { code, data, message } = res;
        if (code === 200) {
          this.bizInfo = Object.freeze(data) || {};
          this.ruleForms.customerName = this.bizInfo.customerName;
        } else {
          this.dialogVisible = false;
          this.$message.warning(message);
        }
        this.loading = false;
      });
    },
    /**
     * @description 弹层关闭的回调
     */
    diologHandleClose() {
      this.ruleForms.allocationMode = 1;
      this.ruleForms.reason = '';
      this.isActive = 1;
      this.$refs.ruleForms.resetFields();
      this.ruleForms.receiveUserName = '';
      this.dialogVisible = false;
      this.stateNum = 1;
      this.$emit('reset-form');
    },
    /**
     * @description 获取未合作客户需求
     */
    getRequireNameList(id, requirementCode) {
      let params = {
        bizId: id,
      };
      getMeetAllianceListByBizId(params)
        .then((res) => {
          const { code, data } = res;
          if (code === 200) {
            if (!data) return;
            // TODO 23点18分 cqj 此处有修改
            this.ruleForms.requirementCode = data.find((_) => {
              return _.intentionCode == requirementCode;
            })?.id;
            this.ruleForms.requirementId = data.find((_) => {
              return _.intentionCode == requirementCode;
            })?.id;
            //判断数据数量是否为1，为1则直接显示
            if (data.length === 1) {
              this.ruleForms.requirementName = data[0].intentionName;
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
      console.log(id);
      this.$refs.ruleForms.clearValidate('ratio');
      this.$refs.ruleForms.clearValidate('receiveUserId');
      this.isActive = id;
      this.ruleForms.allocationMode = id;
      console.log(this.ruleForms.allocationMode, 'this.ruleForms.allocationMode1');
      if (this.ruleForms.allocationMode == 2) {
        this.ruleForms.grabOrderScope = 1; //抢单员范围默认值
      }
      this.$refs.ruleForms.validateField('allocationMode', (error) => {
        if (!error) {
          return;
        }
      });
    },
    /**
     * @description 通过抢单范围获取合作比例
     */
    getCooperationProportion() {
      cooperation_proportion().then((res) => {
        const { code, data } = res;
        if (code === 200) {
          this.cooperationRatioInfo = data || {};
        }
      });
    },
    /**
     * @description 合作接收方搜索选中方法
     */
    selectChangeHandle(val) {
      console.log(val, 'val');
      // if (val === '') {
      // this.peopleList = this.defaultPeopleList;
      // }
      this.ruleForms.mchUserId = val.mchUserId;
      /*此处receiveUserId需要修改*/
      this.ruleForms.receiveUserId = val.mchUserId;
    },
    /**
     * @description 远程搜索合作接收方
     */
    remoteMethod(keyword) {
      if (!keyword.trim()) return;
      this.selectLoading = true;
      if (keyword) {
        this.peopleList = []; //清空合作接收方数组
      }
      this.getPeopleList(keyword.trim());
    },
    //获取合作接收方人员list
    getPeopleList(keyword, type, start = 1) {
      start >= 1 ? (this.selectLoading = false) : (this.selectLoading = true);
      let params = {
        start: 1,
        limit: 10,
      };
      const regPhone = /^1[3-9]\d{9}$/;
      if (regPhone.test(keyword)) {
        params.phone = keyword; //输入的是手机号
      } else {
        params.searchKey = keyword; //输入的是姓名
      }
      get_receiver(params)
        .then((res) => {
          if (res.code === 200) {
            res = res.data;
            // this.peopleList = res.records || [];
            // if (type) {
            //   this.defaultPeopleList = res.records;
            // }
            // this.selectLoading = false;

            if (this.optionFlag && this.optionPage > 1) {
              // 滚动加载  且不是第一页
              if (res.records) {
                this.peopleList = [...this.peopleList, ...res.records];
              }
            } else {
              this.peopleList = res.records || [];
            }
            res.records.length < params.limit
              ? (this.optionFlag = false)
              : (this.optionFlag = true);
          } else {
            this.$message.warning(res.message);
          }
        })
        .catch(() => (this.selectLoading = false));
    },

    handleBlue() {
      if (this.peopleList.length === 0) {
        // this.peopleList = this.defaultPeopleList;
        this.peopleList = [];
      }
    },
    /**
     * @description 需求变化
     */
    requireChange(val) {
      console.log(val, this.flagId, 'val', 'this.flagId');
      //如果新增的id
      if (this.flagId == val) {
        this.ruleForms.requirementCode = val;
        this.ruleForms.requirementId = '';
      } else {
        this.ruleForms.requirementId = val;
      }
    },
    /**
     * @description 新增需求
     */
    addNewRequire() {
      console.log(this.requireNameList, 'this.requireNameList');
      this.$refs.newRequireRef.openModal(this.requireNameList);
    },
    /**
     * @description 新增需求回调
     */
    initCoopration(val, obj) {
      console.log(val, obj);
      this.flagId = obj.id;
      if (val && obj) {
        this.ruleForms.requirementId = '';
        this.requireNameList.unshift(obj);
        this.stateNum += 1;
        if (this.stateNum === 3) {
          this.requireNameList.splice(1, 1); //替换删除 前一个新增需求
          this.stateNum = 2;
        }
      }
      //将新增的数据合并到ruleForms
      Object.assign(this.ruleForms, val);
    },
    /**
     * @description 提交事件
     */
    submitV(formName) {
      //判断数据数量是否为1，为1则直接显示
      if (this.requireNameList.length === 1) {
        this.ruleForms.requirementName = this.requireNameList[0].intentionName;
        this.ruleForms.requirementId = this.requireNameList[0].id;
        this.$refs.ruleForms.clearValidate('requirementCode');
      }
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          this.loading = true;
          if (this.flagId == this.ruleForms.requirementId) {
            this.ruleForms.requirementId = '';
          }
          const params = { ...this.ruleForms };
          console.log(params, '请求参数');
          save_by_present_customer(params)
            .then((res) => {
              const { code, message } = res;
              if (code === 200) {
                this.$message.success('合作申请已发出');
                this.$eventBus.$emit('reload-list', true, 'Partners');
                this.$eventBus.$emit('reload-require-list', true);
                this.$eventBus.$emit('router-push-list');
                this.dialogVisible = false;
              } else {
                this.$message.warning(message);
              }
              this.loading = false;
            })
            .catch(() => {
              this.loading = false;
              this.dialogVisible = false;
            });
        }
      });
    },
  },
};
