import { checkBizByPhone } from 'api/add-business';
import ShowTooltip from '../../../components/show-tooltip/index.js';
import {
  get_user_website,
  listContact,
  get_dictionary_data_by_parent_code,
  get_mch_user_info_list,
  get_user_business_category,
} from 'api/common';
import { save_by_absent_customer } from 'api/cooperation-in-page';
import InitiateCooperation from '../../business-details/components/initiate-cooperation/index.vue';
import './index.scss';
import validatePhone from 'utils/validate';
export default {
  mixins: [validatePhone],
  components: {
    ShowTooltip,
    InitiateCooperation,
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
      desensitization: '',
      loading: false,
      isDisabledStand: false, //合作接收方远程人员搜索
      defaultPeopleList: [],
      peopleList: [],
      selectLoading: false,
      blurPhoneNumber: '', //判断输入号码是否与当前号码一致
      accompanyInfo: {},
      ruleForm: {
        customerName: '',
        customerSex: '',
        customerPhone: '',
        intentionLevel: 3, //客户意向等级
        bizAreaCode: '', //业务区域Code
        requirementCode: '', //客户需求
        requirementParentCode: '', //客户需求父级Code
        requirementParentName: '', //客户需求父级名字
        type: '', //合作类型 1.自留维护权,2.转出维护权
        allocation_mode: 1, //分配方式 1.定向分配,2.抢单
        ratio: '', //合作比例
        receiveUserId: '', //合作接收方ID
        reason: '', //合作原因
        grabOrderScope: 1, //抢单人员范围 (1.本商户,2.薯片平台)
        phoneArray: [],
      },
      //合作类型
      typeList: [
        { id: 1, key: 'ZILIU', value: '自留维护权' },
        { id: 2, key: 'ZHUANCHU', value: '转出维护权' },
      ],
      tooltip:
        '自留维护权：合作双方共享客户，均有客户维护权限，但客户实际归属于合作发起方。转出维护权：合作建立后客户归属于接收方，发起方仅有查看功能。',
      isActive: 1,
      order: [
        { id: 1, name: '定向分单' },
        { id: 2, name: '抢单' },
      ],
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
        bizAreaCode: [{ required: true, message: '请选择业务区域', trigger: 'change' }],
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
        allocation_mode: [{ required: true, message: '请选择', trigger: 'blur' }],
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
      isRelevance: false, //是否显示关联行
      isNewRequire: false, //是否显示新增需求弹框
      texts: [], //评分辅助文字
      areaList: [],
      query: {},
    };
  },
  computed: {},
  created() {
    this.getAreaList(); //地区
    this.getIntentionList(); //等级
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
    /**
     * @description 查询数据字典意向等级
     */
    typeChange(value) {
      console.log(value, 'value');
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
     * @description 号码输入框失焦后，查询号码
     */
    phoneBlurValidate(event) {
      this.$refs.ruleForm.validateField('customerPhone', (valid) => {
        if (!valid) {
          //判断是否是一样得号码
          if (this.blurPhoneNumber !== event.target.value) {
            this.getPhone();
          }
          this.blurPhoneNumber = event.target.value;
          console.log(this.blurPhoneNumber, 'this.blurPhoneNumber');
        }
      });
    },
    /**
     * @description 获取用户授权的区域范围
     */
    getAreaList() {
      get_user_website()
        .then((res) => {
          if (res.code === 200) {
            res = res.data;
            this.areaList = res?.list || [];
          } else {
            this.$message.warning(res.message);
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },

    /**
     * @description 失去焦点获取关联手机号
     */
    getPhone() {
      const value = this.ruleForm.customerPhone;
      let params = { customerNo: value };
      listContact(params)
        .then((res) => {
          const { data, code } = res;
          if (code === 200) {
            res = res.data;
            if (!Array.isArray(data)) return;
            data.shift();
            this.ruleForm.phoneArray = [];
            if (data.length === 0) {
              this.resetPhone();
              return;
            }
            this.isRelevance = true;
            this.isNewRequire = true;
            this.separatePhoneList(data);
            this.$message.warning('已有客户商机，无需填写基础信息可直接发起');
            this.$refs.initiateCooperationRef.openModal({}, true);
          } else {
            this.resetPhone();
            this.isNewRequire = false;
            this.ruleForm.phoneArray = [];
          }
          console.log(this.isNewRequire, 'this.isNewRequire');
        })
        .catch(() => {
          this.ruleForm.phoneArray = [];
          this.resetPhone();
        });
    },
    separatePhoneList(res) {
      for (const item of res) {
        if (item.contactWay !== 'CONTACT_WAY_MB' || item.contactRlat === 'CONTACT_RLAT_SPARE')
          continue;
        // if (item.contactRlat === 'CONTACT_RLAT_SPARE') {
        //   this.ruleForm.contactPerson.standbyName = item.contactName;
        //   this.ruleForm.contactPerson.standbySex = item.sex == '1' ? 1 : item.sex == '0' ? 0 : 2;
        //   this.ruleForm.contactPerson.standbyPhone = item.contactNo;
        //   this.ruleForm.contactPerson.id = item.id;
        //   this.isDisabledStand = true; //备用联系人手机号码输入框禁用
        // } else {
        this.ruleForm.phoneArray.push(item);
        console.log(this.ruleForm.phoneArray, 'this.ruleForm.phoneArray');
        // }
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
      console.log('ssdfsklflsdlf', this.rules);
      this.isActive = id;
      this.ruleForm.allocation_mode = id;
      console.log(this.isActive, this.ruleForm.allocation_mode, 'this.isActive');
      this.$refs.ruleForm.validateField('allocation_mode', (error) => {
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
        this.ruleForm.mchUserId = val.mchUserId;
        this.ruleForm.receiveUserId = val.userName;
      }
      this.accompanyInfo = val;
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
      };
      const regPhone = /^1[3-9]\d{9}$/;
      if (regPhone.test(keyword)) {
        params.phone = keyword;
      } else {
        params.searchKey = keyword;
      }
      this.getPeopleList(params);
    },
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

          // 需要看接口需要的合作接收人的字段名
          params.accompanyId = accompanyInfo.mchUserId || undefined;
          params.accompanyNo = accompanyInfo.userCenterNo || undefined;
          params.receiveUserId = accompanyInfo.userCenterNo || undefined;

          params.customerPhone = customerPhone;
          params.phoneArray = phoneArray.reduce((acc, cur) => {
            if (!cur.id) {
              acc.push(cur.contactNo);
            }
            return acc;
          }, []);
          params.areaName =
            this.areaList.find((item) => item.key === params.bizAreaCode)?.value || '';
          const quire = this.$refs.requirementRef.getCheckedNodes();
          console.log(quire, 'quire');
          params.productTypeCode = quire[0]?.data.productTypeCode || ''; //一级产品类型
          params.requirementParentCode = quire[0]?.parent.value || ''; //二级需求编码
          params.requirementParentName = quire[0]?.parent.label || ''; //二级需求名称
          params.requirementCode = quire[0]?.value || ''; //三级需求编码
          params.requirementCodeName = quire[0]?.label || ''; //三级需求名称
          console.log(this.ruleForm, 'this.ruleForm');
          save_by_absent_customer(params)
            .then((res) => {
              if (res.code === 200) {
                res = res.data;
                this.$message({
                  type: 'success',
                  message: '操作成功',
                });
                let path = 'cooperation-alliance-clients';
                res && this.$router.replace(`/${path}?active=YJS`);
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
