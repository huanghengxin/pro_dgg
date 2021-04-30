import { createBiz, checkBizByPhone } from 'api/add-business';
import {
  get_user_website,
  listContact,
  get_dictionary_data_by_parent_code,
  get_user_business_category,
} from 'api/common';
import { getQueryString } from 'utils/helper';
import { get_conversion_business_resource, clue_conversion_business } from 'api/cule';
import './index.scss';
import validatePhone from 'utils/validate';
export default {
  mixins: [validatePhone],
  data() {
    return {
      desensitization: '',
      clueInfo: {},
      loading: false,
      isDisabledStand: false,
      ruleForm: {
        customerName: '',
        customerSex: '',
        customerPhone: '',
        intentionGrade: 3,
        blurPhoneNumber: '',
        customerRequire: '',
        contactPerson: {
          standbyName: '',
          standbyPhone: '',
          standbySex: 2,
        },
        phoneArray: [],
        areaCode: '',
        remark: '',
      },
      rules: {
        contactPerson: {
          standbyPhone: [
            {
              validator: this.checkContactNo,
              trigger: 'blur',
            },
          ],
          standbyName: [
            { validator: this.checkStandbyName, trigger: 'blur' },
            { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' },
          ],
        },
        contactNo: [{ validator: this.checkContactNo, trigger: 'blur' }], //次联系人号码验证
        customerName: [
          { required: true, validator: this.checkCtomerName, trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' },
        ], //姓名
        customerPhone: [{ required: true, validator: this.checkPhone, trigger: 'blur' }],
        customerRequire: [
          {
            required: true,
            message: '请选择您的需求',
            trigger: 'change',
          },
        ],
        areaCode: [{ required: true, message: '请选择业务区域', trigger: 'change' }],
      },
      props: {
        lazy: true,
        lazyLoad: (node, resolve) => {
          const { level, data, value } = node;
          const params = {
            productTypeCode: data?.productTypeCode || '',
            code: value || '',
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
      texts: [], //评分辅助文字
      areaList: [],
      query: {},
    };
  },
  created() {
    this.query = getQueryString();
    if (this.query.clueId) {
      const param = {
        clueId: this.query.clueId,
        clueSourceType: this.query.type,
      };
      this.getConversionBusinessResource(param); //线索
    }
    this.getAreaList(); //地区
    this.getIntentionList(); //等级
  },
  methods: {
    /**
     * @description 查询数据字典意向等级
     */
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
     * @description 通过线索id查询线索信息
     */
    getConversionBusinessResource(param) {
      this.loading = true;
      get_conversion_business_resource(param)
        .then((res) => {
          if (res.code === 200) {
            res = res.data;
            this.ruleForm.customerName = res.customerName;
            //客户电话
            this.ruleForm.customerPhone = res.customerPhone;
            this.desensitization = res.desensitization;
            this.isRelevance = true;
            this.separatePhoneList(res.list);
          } else {
            this.$message.warning(res.message);
          }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    /**
     * @description 号码输入框失焦后，查询客户中心号码
     */
    phoneBlurValidate(event) {
      this.$refs.ruleForm.validateField('customerPhone', (valid) => {
        if (!valid) {
          //判断是否是一样得号码
          if (this.blurPhoneNumber !== event.target.value) {
            this.getPhone();
          }
          this.blurPhoneNumber = event.target.value;
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
          if (res.code === 200) {
            res = res.data;
            if (!Array.isArray(res)) return;
            res.shift();
            this.ruleForm.phoneArray = [];
            if (res.length === 0) {
              this.resetPhone();
              return;
            }
            this.isRelevance = true;
            this.separatePhoneList(res);
          } else {
            this.resetPhone();
            this.ruleForm.phoneArray = [];
          }
        })
        .catch(() => {
          this.ruleForm.phoneArray = [];
          this.resetPhone();
        });
    },
    separatePhoneList(res) {
      for (const item of res) {
        if (item.contactWay !== 'CONTACT_WAY_MB') continue;
        if (item.contactRlat === 'CONTACT_RLAT_SPARE') {
          this.ruleForm.contactPerson.standbyName = item.contactName;
          this.ruleForm.contactPerson.standbySex = item.sex == '1' ? 1 : item.sex == '0' ? 0 : 2;
          this.ruleForm.contactPerson.standbyPhone = item.contactNo;
          this.ruleForm.contactPerson.id = item.id;
          this.isDisabledStand = true; //备用联系人手机号码输入框禁用
        } else {
          this.ruleForm.phoneArray.push(item);
        }
      }
    },
    /**
     * @description 客户中心不存在客户清空
     */
    resetPhone() {
      this.isRelevance = true;
      this.isDisabledStand = false;
      this.ruleForm.contactPerson.standbyName = '';
      this.ruleForm.contactPerson.standbyPhone = '';
      this.ruleForm.contactPerson.standbySex = '';
      this.ruleForm.contactPerson.id = undefined;
    },
    /**
     * @description 新增手机号
     */
    addNew() {
      if (this.ruleForm.phoneArray.length > 1 || !this.isRelevance) return;
      this.ruleForm.phoneArray.push({ contactNo: '' });
    },
    /**
     * @description 删除手机号
     */
    delPhone(index) {
      this.ruleForm.phoneArray?.splice(index, 1);
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
          ruleForm.customerName = ruleForm.customerName.trim();
          let { phoneArray, customerPhone, ...elseFrom } = ruleForm;
          let params = elseFrom;
          if (this.query.clueId) {
            params.clueSourceType = this.query.type;
            params.clueId = this.query.clueId;
            params.customerPhone = undefined;
          } else {
            params.bizSource = 'SELF_DEV';
            params.customerPhone = customerPhone;
          }
          params.areaName = this.areaList.find((item) => item.key === params.areaCode)?.value || '';
          const quire = this.$refs.customerRequireRef.getCheckedNodes();
          params.requireParentCode = quire[0]?.parent.value || ''; //一级需求编码
          params.requireParentName = quire[0]?.parent.label || ''; //一级需求名称
          params.productTypeCode = quire[0]?.data.productTypeCode || ''; //产品类型
          params.customerRequire = quire[0]?.value || ''; //二级需求编码
          params.customerRequireName = quire[0]?.label || ''; //二级需求名称
          params.remark = this.ruleForm.remark?.trim();
          params.phoneArray = phoneArray.reduce((acc, cur) => {
            if (!cur.id) {
              acc.push(cur.contactNo);
            }
            return acc;
          }, []);
          const mothodsApi = this.query.clueId ? clue_conversion_business : createBiz;

          mothodsApi(params)
            .then((res) => {
              if (res.code === 200) {
                res = res.data;
                this.$message({
                  type: 'success',
                  message: '操作成功',
                });
                //判断是否推单新建商机，
                let path = '';
                if (this.query?.type === 'PUSH_SHEET') {
                  path = 'push-sheet';
                } else {
                  path = 'my-business/business-details';
                }
                res && this.$router.replace(`/${path}?businessId=` + res);
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
