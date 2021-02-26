import './index.scss';
import store from 'storejs';
import AddContactPhone from '../add-contact-phone';
import AddStandbyContact from '../add-standby-contact';
import nextOneHourLate from 'utils/mixins/dateTimeValidate';
import {
  get_dictionary_data_by_parent_code,
  list_mch_address,
  find_contacts_by_customer_id,
  get_mch_user_info_list,
  initiate_interview,
} from 'api/common';
import dayjs from 'dayjs';
export default {
  name: 'InviteInterview',
  components: {
    AddContactPhone,
    AddStandbyContact,
  },
  mixins: [nextOneHourLate('inviteTime', 30, 'day', true)],
  props: {
    isPlace: {
      type: String,
      default: '',
    },
  },
  data() {
    const validateArea = (rule, value, callback) => {
      value = value.trim();
      if (!value) {
        callback('请输入面谈地点');
      } else {
        callback();
      }
    };
    return {
      accompanyInfo: {},
      businessInfo: {},
      dialogVisible: false,
      loading: false,
      ruleForm: {
        inviteType: 0,
        inviteTime: '',
        phone: '',
        area: '',
        people: '',
        resource: [],
      },
      addPhoneNumber: 3,
      sparePhone: false,
      currentComponent: '',
      phoneList: [],
      peopleList: [],
      defaultPeopleList: [],
      addressList: [],
      resourceList: [],
      switchDialog: true,
      rules: {
        area: [{ required: true, validator: validateArea, trigger: 'blur' }],
        phone: [{ required: true, message: '请选择手机号码' }],
      },
      selectLoading: false,
      mchDetailId: '',
    };
  },
  created() {
    this.mchDetailId = store.get('mchInfo')?.mchDetailId || '';
  },
  methods: {
    /**
     * @description 客户上门和外出拜访修改
     * @param {Number}
     * @returns {}
     */
    inviteTypeChange(val) {
      if (val === 1) {
        this.ruleForm.area = '';
      } else {
        this.$refs.ruleForm.clearValidate('area');
        this.ruleForm.area = this.addressList.find(
          (item) => item.defaultOfficeAddress === 1,
        ).detailAdress;
      }
    },
    /**
     * @description 添加号码回调参数
     * @param {Array} 返回得数据
     */
    onSubmitHandle(res) {
      if (!Array.isArray(res)) return;
      this.addPhoneNumber = 3;
      this.sparePhone = false;
      this.phoneList = [];
      this.phoneListFormat(res);
      this.ruleForm.phone =
        res.find((item) => item.newFlag == 1)?.contactNoFull || this.businessInfo.customerPhone;
    },
    /**
     * @description 陪谈人搜索选中方法
     */
    selectChangeHandle(val) {
      if (val === '') {
        this.peopleList = this.defaultPeopleList;
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
        mchDetailId: this.mchDetailId,
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
     * @description 弹框关闭方法
     */
    onCloseHandle(val) {
      this.switchDialog = val;
    },
    /**
     * @description 通过客户id获取联系人号码
     */
    getPhoneList() {
      const params = {
        customerId: this.businessInfo.customerId,
      };
      find_contacts_by_customer_id(params).then((res = []) => {
        if (res.code === 200) {
          res = res.data;
          if (res.length === 0) return;
          this.ruleForm.phone = res[0].contactNoFull; //回显商机上得主号码
          this.phoneListFormat(res);
        } else {
          this.$message.warning(res.message);
        }
      });
    },
    phoneListFormat(res) {
      for (const iterator of res) {
        if (iterator.contactWay !== 'CONTACT_WAY_MB') continue;
        if (iterator.contactRlat === 'CONTACT_RLAT_SPARE') {
          //存在得次联系人号码数量
          this.phoneList.push(iterator);
          this.sparePhone = true; //存在备用联系人
        } else {
          this.addPhoneNumber--;
          this.phoneList.push(iterator);
        }
      }
    },
    /**
     * @description 添加号码
     */
    addPhoneHandleClick() {
      if (this.addPhoneNumber > 0) {
        this.currentComponent = 'AddContactPhone';
      } else {
        this.currentComponent = 'AddStandbyContact';
      }
      this.switchDialog = false;
      this.$nextTick(() => {
        this.$refs[this.currentComponent].openModal(
          this.businessInfo,
          this.addPhoneNumber,
          this.phoneList,
        );
      });
    },
    /**
     * @description 供父组件调用打开弹层方法
     * @param {Object} 点击当前列表项
     */
    openModal(item) {
      this.nextTime = dayjs()
        .add(5, 'm')
        .valueOf(); //打开弹框记录当前时间下一个小时的时间进行对比
      this.businessInfo = Object.freeze(item || {}); //商机信息
      this.dialogVisible = true;
      this.getResourceList();
      this.getAddressList();
      this.getPhoneList();
      this.getPeopleList(
        {
          start: 1,
          limit: 1000,
          mchDetailId: this.mchDetailId,
        },
        'default',
      );
    },
    /**
     * @description 获取面谈地点
     */
    getAddressList() {
      const param = { mchId: this.mchDetailId };
      list_mch_address(param).then((res = []) => {
        if (res.code === 200) {
          res = res.data;
          this.addressList = res;
          this.ruleForm.area = res.find((item) => item.defaultOfficeAddress === 1).detailAdress;
        } else {
          this.$message.warning(res.message);
        }
      });
    },
    /**
     * @description 获取客户需携带资料
     */
    getResourceList() {
      const params = {
        parentCode: 'QDS_INTERVIEW_BRING_DATA',
      };
      get_dictionary_data_by_parent_code(params).then((res) => {
        if (res.code === 200) {
          res = res.data;
          this.resourceList = Object.freeze(res || []);
        } else {
          this.$message.warning(res.message);
        }
      });
    },
    diologHandleClose() {
      this.ruleForm.inviteType = 0;
      this.$refs.ruleForm.resetFields();
      this.addPhoneNumber = 3;
      this.sparePhone = false;
      this.currentComponent = '';
      this.phoneList = [];
      this.accompanyInfo = {};
    },

    /**
     * @description 提交表单
     */
    submitHandleClick() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          const params = {};
          const accompanyInfo = this.accompanyInfo;
          const businessInfo = this.businessInfo;
          const ruleForm = this.ruleForm;
          params.accompanyId = accompanyInfo.mchUserId || undefined;
          params.accompanyName = accompanyInfo.userName || undefined;
          params.accompanyNo = accompanyInfo.userCenterNo || undefined;
          params.associationId = businessInfo.id || '';
          params.customerContact = ruleForm.phone.includes('******')
            ? businessInfo.customerContact
            : ruleForm.phone;
          params.customerId = businessInfo.customerId || '';
          params.customerName = businessInfo.customerName || '';
          params.customerNo = businessInfo.customerNo || '';
          params.dataTypeJson = ruleForm.resource?.join(',') || undefined;
          params.inviteAddress = ruleForm.area.trim() || '';
          params.inviteTime = dayjs(ruleForm.inviteTime).format('YYYY/MM/DD HH:mm') || '';
          params.inviteType = ruleForm.inviteType || 0;
          initiate_interview(params)
            .then((res) => {
              if (res.code == 200) {
                this.dialogVisible = false;
                this.$message.success(res.message);
                if (this.isPlace) {
                  this.$eventBus.$emit('invite-update-business-details');
                } else {
                  this.$emit('on-submit');
                }
              } else {
                this.$message.warning(res.message);
                if (res.code === 5002) {
                  if (this.isPlace === 'business-details') {
                    this.$router.go(-1);
                  } else {
                    this.$emit('on-submit');
                  }
                }
              }
              this.loading = false;
            })
            .catch(() => {
              this.loading = false;
            });
        }
      });
    },
  },
};
