import { checkBizByPhone } from 'api/add-business';
import {
  get_receiver,
  get_search,
  get_all_businessArea,
  cooperation_proportion,
} from 'api/cooperation-in-page';
import ShowTooltip from '../../../components/show-tooltip/index.js';
import { listContact, get_dictionary_data_by_parent_code } from 'api/common';
import { save_by_absent_customer } from 'api/cooperation-in-page';
import InitiateCooperation from '../../business-details/components/initiate-cooperation/index.vue';
import './index.scss';
import validatePhone from 'utils/validate';
import commonMixins from './commonMixin.js';
import { store } from '../../cule/cooperation-alliance-clients/components/observable';
export default {
  mixins: [validatePhone, commonMixins],
  components: {
    ShowTooltip,
    InitiateCooperation,
  },
  directives: {
    // 自定义指令 设置滚动到底部加载下一页的数据
    loadmore: {
      inserted(el, binding, vnode) {
        // 获取element-ui定义好的scroll盒子
        const SELECTWRAP_DOM = el.querySelector('.el-select-dropdown .el-select-dropdown__wrap');
        SELECTWRAP_DOM.addEventListener('scroll', function() {
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
    return {
      loading: false,
      isDisabledStand: false, //合作接收方远程人员搜索
      defaultPeopleList: [], //搜索人员默认列表
      peopleList: [], //合作接收人请求列表
      selectLoading: false,
      blurPhoneNumber: '', //判断输入号码是否与当前号码一致
      accompanyInfo: {},
      // initiateRowInfo: {}, //合作列表转出拒绝传递参数
      ruleForm: {
        customerName: '', //客户姓名
        customerSex: '', //客户性别(0女 1男 2保密)
        customerPhone: '', //客户手机号码
        phoneArray: [], //新增手机号
        areaCode: '', //业务区域Code
        areaName: '', //业务区域名称
        requirementArray: [],
        productTypeCode: '', //产品类型
        requirementCode: '', //客户需求
        requirementName: '', //客户名称
        requirementParentCode: '', //客户需求父级Code
        requirementParentName: '', //客户需求父级名字
        intentionLevel: 3, //客户意向等级
        type: '', //合作类型 1.自留维护权,2.转出维护权
        allocationMode: '1', //分配方式 1.定向分配,2.抢单
        ratio: '', //合作比例
        receiveUserId: '', //合作接收方ID
        grabOrderScope: 1, //抢单人员范围 (1.本商户,2.薯片平台)
        reason: '', //合作原因
      },
      optionPage: 1, //下拉框页数
      optionKey: '', //下拉框关键字
      optionFlag: false, //滚动加载
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
      //合作类型
      typeList: [
        { id: 1, key: 'ZILIU', value: '自留维护权' },
        { id: 2, key: 'ZHUANCHU', value: '转出维护权' },
      ],
      tooltip:
        '自留维护权：合作双方共享客户，均有客户维护权限，但客户实际归属于合作发起方。转出维护权：合作建立后客户归属于接收方，发起方仅有查看功能。',
      isActive: '1',
      order: [
        { id: '1', name: '定向分单' },
        { id: 2, name: '抢单' },
      ],
      props: {
        lazy: true,
        lazyLoad: (node, resolve) => {
          console.log('SSKDSDFJSK', this.ruleForm.requirementArray);
          const { level, data, value } = node;
          console.log(data, value, '=====');
          const params = {
            productTypeCode: data?.productTypeCode || value,
            code: value,
          };
          get_search(params).then((res) => {
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
      isRelevance: false, //是否显示关联行
      texts: [], //评分辅助文字
      areaList: [],
      query: {},
    };
  },
  computed: {
    ratio() {
      let ratio = undefined;
      if (this.ruleForm.type == 2 && this.cooperationRatioInfo) {
        ratio = this.cooperationRatioInfo.transferOut;
      } else {
        ratio = this.cooperationRatioInfo.retention;
      }
      return ratio;
    },
  },

  created() {
    this.getAreaList(); //地区
    this.getIntentionList(); //等级
    this.getCooperationProportion(); //比例范围
    this.getPeopleList();
    //关掉有客户信息弹窗后，清空表单字段
    this.$eventBus.$on('close-parent-dialog', (flag) => {
      if (!flag) return;
      this.$refs.ruleForm.resetFields();
    });
    if (!store.rowInfo) return;
    let rowInfo = store.rowInfo;
    const { customerPhone, receiveUserId, ...ruleRowInfo } = rowInfo;
    Object.assign(this.ruleForm, ruleRowInfo);
    console.log(ruleRowInfo, 'ruleRowInfo');
    let ruleForm = this.ruleForm;
    ruleForm.customerPhone = '';
    ruleForm.receiveUserId = receiveUserId;
    ruleForm.customerSex = Number(ruleRowInfo.customerSex);
    ruleForm.areaCode = ruleRowInfo.bizAreaCode;
    ruleForm.areaName = ruleRowInfo.bizAreaName;
    ruleForm.requirementArray[0] = ruleRowInfo.productType;
    ruleForm.requirementArray[1] = ruleRowInfo.requirementParentCode;
    ruleForm.requirementArray[2] = ruleRowInfo.requirementCode;
    ruleForm.requirementArray[2] = ruleRowInfo.requirementCode;
    ruleForm.receiveUserId = '';
    this.isActive = ruleRowInfo.allocationMode;
  },
  beforeRouteLeave(to, from, next) {
    store.rowInfo = null;
    next();
  },
  beforeDestroy() {
    this.$eventBus.$off('close-parent-dialog');
  },
  methods: {
    /**
     * @description 通过抢单范围获取合作比例
     */
    getCooperationProportion() {
      cooperation_proportion().then((res) => {
        const { code, data } = res;
        if (code === 200) {
          console.log(data, 'data');
          this.cooperationRatioInfo = data || {};
        }
      });
    },
    /**
     * @description 合作类型切换
     */
    typeChange() {
      this.ruleForm.ratio = undefined;
      this.$refs.ruleForm.clearValidate('ratio');
      this.getCooperationProportion(); //比例范围
    },
    ratechange(val) {
      console.log(val, 'val');
    },
    getIntentionList() {
      const params = {
        parentCode: 'INTENTION_LEVEL',
      };
      get_dictionary_data_by_parent_code(params)
        .then((res) => {
          if (res.code === 200) {
            this.loading = false;
            this.texts = res.data
              ?.sort((a, b) => a.sort - b.sort)
              .map((item) => {
                return '（' + item.name + '）' || '';
              });
          } else {
            this.$message.warning(res.message);
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },

    /**
     * @description 获取用户授权的区域范围
     */
    getAreaList() {
      const params = {};
      get_all_businessArea(params)
        .then((res) => {
          if (res.code === 200) {
            res = res.data;
            this.areaList = res?.cityList || [];
          } else {
            this.$message.warning(res.message);
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
    /**
     * @description 号码输入框失焦后，查询号码
     */
    phoneBlurValidate(event) {
      this.$refs.ruleForm.validateField('customerPhone', (valid) => {
        if (!valid) {
          //判断是否是一样得号码
          if (this.blurPhoneNumber !== event.target.value) {
            this.getPhone();
          } else {
            this.blurPhoneNumber = event.target.value;
          }
        }
      });
    },
    /**
     * @description 失去焦点获取关联手机号
     */
    async getPhone() {
      const checkBiz = await checkBizByPhone({
        phone: this.ruleForm.customerPhone,
      }).catch();
      if (!checkBiz.data.canCreate) {
        this.$refs.initiateCooperationRef.openModal({ id: checkBiz.data.bizId }, true);
        // this.$message.warning('已有客户商机，无需填写基础信息可直接发起');
      } else {
        const value = this.ruleForm.customerPhone;
        let params = { customerNo: value };
        listContact(params)
          .then((res) => {
            const { data, code } = res;
            if (code === 200) {
              if (!Array.isArray(data)) return;
              data.shift();
              this.ruleForm.phoneArray = [];
              if (data.length === 0) {
                this.resetPhone();
                return;
              }
              this.isRelevance = true;
              // this.isNewRequire = true;
              this.separatePhoneList(data);
            } else {
              this.resetPhone();
              // this.isNewRequire = false;
              this.ruleForm.phoneArray = [];
            }
          })
          .catch(() => {
            this.ruleForm.phoneArray = [];
            this.resetPhone();
          });
      }
    },
    separatePhoneList(res) {
      for (const item of res) {
        console.log(item, 'item');
        if (item.contactWay !== 'CONTACT_WAY_MB' || item.contactRlat === 'CONTACT_RLAT_SPARE')
          continue;
        this.ruleForm.phoneArray.push(item);
        console.log(this.ruleForm.phoneArray, 'this.ruleForm.phoneArray');
      }
    },
    /**
     * @description 不存在清空此联系手机号
     */
    resetPhone() {
      this.isRelevance = true;
      this.isDisabledStand = false;
    },
    /**
     * @description 新增手机号
     */
    addNew() {
      if (this.ruleForm.phoneArray.length > 1 || !this.isRelevance) return;
      this.ruleForm.phoneArray.push({ contactNo: '' });
    },
    /**
     * @description 新增需求
     */
    addNewRequire() {
      console.log('新增需求');
    },
    /**
     * @description 删除手机号
     */
    delPhone(index) {
      this.ruleForm.phoneArray?.splice(index, 1);
    },
    /**
     * @description 分配方式切换
     * @param {Number}
     */
    changeFullFree(id) {
      this.$refs.ruleForm.clearValidate('ratio');
      this.$refs.ruleForm.clearValidate('receiveUserId');
      this.isActive = id;
      this.ruleForm.allocationMode = id;
      this.$refs.ruleForm.validateField('allocationMode', (error) => {
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
        // this.peopleList = this.defaultPeopleList;

        this.ruleForm.receiveUserId = val.mchUserId;
      }
      this.accompanyInfo = val;
    },
    /**
     * @description 远程搜索陪谈人
     */
    remoteMethod(keyword) {
      if (!keyword.trim()) return;
      this.optionPage = 1;
      this.optionKey = keyword.trim();
      if (keyword) {
        this.peopleList = []; //如果输入框清空 数组清空
      }
      this.selectLoading = true;
      this.getPeopleList(keyword.trim());
    },
    /**
     * @description //获取合作接收方人员list
     */
    getPeopleList(keyword, type, start = 1) {
      start >= 1 ? (this.selectLoading = false) : (this.selectLoading = true);
      let params = {
        start: start,
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
            if (this.optionFlag && this.optionPage > 1) {
              // 滚动加载  且不是第一页
              if (res.records) {
                this.peopleList = [...this.peopleList, ...res.records];
              }
            } else {
              this.peopleList = res.records || [];
            }
            // 如果结果数据小于限制数量 不启用滚动加载
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
        this.peopleList = [];
      }
    },

    /**
     * @description 提交事件
     */
    submitV(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const ruleForm = this.ruleForm;
          this.loading = true;
          const checkBiz = await checkBizByPhone({
            phone: ruleForm.customerPhone,
          }).catch(() => (this.loading = false));
          if (!checkBiz) return;
          let { phoneArray, customerPhone, ...elseFrom } = ruleForm;
          console.log(phoneArray, '1212121');
          const accompanyInfo = this.accompanyInfo;
          let params = elseFrom;
          params.receiveUserId = accompanyInfo.mchUserId || undefined;
          params.customerPhone = customerPhone;
          params.phoneArray = phoneArray.reduce((acc, cur) => {
            if (!cur.id) {
              acc.push(cur.contactNo);
            }
            return acc;
          }, []);
          params.areaName = this.areaList.find((item) => item.code === params.areaCode)?.name || '';
          const quire = this.$refs.requirementRef.getCheckedNodes();
          console.log(quire, 'quire');
          params.productTypeCode = quire[0]?.data.productTypeCode || ''; //一级产品类型
          params.requirementParentCode = quire[0]?.parent.value || ''; //二级需求编码
          params.requirementParentName = quire[0]?.parent.label || ''; //二级需求名称
          params.requirementCode = quire[0]?.value || ''; //三级需求编码
          params.requirementName = quire[0]?.label || ''; //三级需求名称
          console.log(this.ruleForm, 'this.ruleForm');
          save_by_absent_customer(params)
            .then((res) => {
              if (res.code === 200) {
                this.$message({
                  type: 'success',
                  message: '操作成功',
                });
                let path = 'cooperation-alliance-clients';
                this.$router.replace(`/${path}?active=1`);
              } else {
                this.$message.warning(res.message);
              }
              this.loading = false;
            })
            .catch((res) => {
              this.loading = false;
            });
        }
      });
    },
  },
};
