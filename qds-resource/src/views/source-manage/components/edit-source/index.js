import './index.scss';
import validate from 'utils/validate';
import { get_search, get_all_businessArea, find_tree_book_list } from 'api/common';
import {
  handle_back,
  update_business,
  check_biz_by_phone,
  add_source,
  complete_clue,
} from 'api/source-manage';
export default {
  name: 'EditSource',
  mixins: [validate],
  props: {
    type: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      optionsData: [], // 级联数据回显
      areaList: [],
      typeEdit: this.type,
      inputLoading: false,
      sourceSysList: [], //数据字典
      firstSourceList: [],
      secondSourceList: [],
      loading: false,
      buttonLoading: false,
      customerPhone: undefined,
      urlMatchRegExpList: [],
      showRequire: false,
      dicMap: {},
      virtualCode: '',
      ruleForm: {
        customerRequire: '',
        customerPhone: '',
        customerName: '',
        customerSex: '',
        bizAreaCode: '',
        sourceUrl: '',
        sourceSyscode: '',
        firstSourceChannel: '',
        secondSourceChannel: '',
        keyword: '',
        comment: '',
      },
      editRuleForm: {
        id: undefined,
        customerContact: undefined,
      },
      rules: {
        customerName: [
          { required: true, validator: this.checkCtomerName, trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' },
        ],
        customerPhone: [{ required: true, validator: this.checkPhone, trigger: 'blur' }],
        customerRequire: [{ required: true, message: '请选择客户需求', trigger: 'change' }],
        bizAreaCode: [{ required: true, message: '请选择业务区域', trigger: 'change' }],
        sourceUrl: [{ required: false, validator: this.checkUrl, trigger: 'blur' }],
        sourceSyscode: [{ required: true, message: '请选择来源平台', trigger: 'change' }],
        firstSourceChannel: [{ required: true, message: '请选择一级来源渠道', trigger: 'change' }],
      },
      props: {
        lazy: true,
        lazyLoad: this.category,
      },
    };
  },
  created() {
    if (this.typeEdit === 'add_source') {
      this.getAreaList(); //地区
      this.getSourcePlatform(); //来源平台
      this.showRequire = true;
    }
  },
  methods: {
    /**
     * @description 号码输入框失焦后，查询客户中心号码
     */
    phoneBlurValidate(event) {
      this.$refs.ruleForm.validateField('customerPhone', (valid) => {
        if (!valid) {
          //判断是否是一样得号码
          const value = event.target.value;
          if (this.blurPhoneNumber !== value) {
            this.$emit('reset');
            this.sourceList = [];
            this.isTabs = false;
            this.findClientBusiness();
          }
          this.blurPhoneNumber = value;
        }
      });
    },
    /**
     * @description 编辑客源商机
     * @param {Object} data
     */
    setEditRulefromValue(data) {
      this.customerPhone = data.customerPhone || '';
      const editRuleForm = this.editRuleForm;
      editRuleForm.id = data.bizId || data.id || '';
      editRuleForm.customerContact = data.customerContact || '';
    },
    /**
     * @description  新增客源商机回显
     * @param {Object} data
     */
    setRulefromValue(data) {
      const ruleForm = this.ruleForm;
      ruleForm.customerName = data.customerName;
      ruleForm.customerSex = data.customerSex || data.sex;
      ruleForm.sourceUrl = data.sourceUrl;
      ruleForm.keyword = data.keyword;
      ruleForm.comment = data.comment;
    },
    /**
     * @description 完善客源
     * @param {Object} data
     */
    cluePerfect(data) {
      this.$messageBox
        .confirm('该客户已存在平台待确认中，是否进行信息完善？', '录入客源', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          closeOnClickModal: false,
          customClass: 'add-source-box',
        })
        .then(() => {
          this.$refs.ruleForm.resetFields();
          this.setRulefromValue(data);
          this.setEditRulefromValue(data);
          this.echoData(data, this.sourceSysList);
          this.typeEdit = 'complete_clue';
        })
        .catch(() => {});
    },
    /**
     * @description 根据号码查询线索或商机
     */
    findClientBusiness() {
      const phone = this.ruleForm.customerPhone;
      let params = {
        phone: phone,
      };
      this.inputLoading = true;
      check_biz_by_phone(params)
        .then((res) => {
          const { code, data = {}, message } = res || {};
          if (code === 200) {
            const { records = [] } = data;
            // 商机数据
            this.$emit('biz', phone);
            // 待确认线索回显
            if (records.length > 0) {
              this.cluePerfect(records[0]);
            }
          } else if (res.code === 10008) {
            // 虚拟号码
            this.virtualCode = res.code;
            this.$message.warning('该手机号为虚拟手机号！');
          } else {
            this.$message.warning(message);
          }
          this.inputLoading = false;
        })
        .catch(() => {
          //
          this.inputLoading = false;
        });
    },

    async category(node, resolve) {
      try {
        const { data, value } = node;
        const params = {
          productTypeCode: data?.productTypeCode || '',
          code: value || '',
        };
        const res = await get_search(params);
        if (res.code === 200) {
          let { data } = res;
          data = Array.isArray(data) ? data : [];
          const _arrMap = data.map((item) => {
            return {
              value: item.code,
              label: item.name,
              leaf: node.level >= 2,
              productTypeCode: item.productTypeCode,
            };
          });
          resolve(_arrMap);
        } else {
          this.$message.warning(res.message);
          resolve([]);
        }
      } catch (error) {
        resolve([]);
      }
    },

    /**
     * @description 获取用户授权的区域范围
     */
    getAreaList(item) {
      const params = { a: 1 };
      get_all_businessArea(params).then((res) => {
        if (res.code === 200) {
          res = res.data;
          this.areaList = res?.cityList || [];
          this.ruleForm.bizAreaCode = item?.bizCityCode || '';
        } else {
          this.$message.warning(res.message);
        }
      });
    },
    /**
     * @description 转化为树形结构
     * @param {Array} data 需要转化的数组
     */
    tranfromTreeData(data, relation = 'pcode') {
      const dataMap = data.reduce((acc, cur) => {
        acc[cur.code] = cur;
        return acc;
      }, {});
      const arr = [],
        ext2List = [];
      for (let i = 0; i < data.length; i++) {
        const value = data[i];
        if (value.ext2) {
          ext2List.push(value.ext2);
        }
        const parent = dataMap[value[relation]];
        if (parent) {
          if (parent.children) {
            parent.children.push(value);
          } else {
            parent.children = [value];
          }
        } else {
          if (value.ext1 == 0) continue;
          arr.push(value);
        }
      }
      this.urlMatchRegExpList = Object.freeze(ext2List);
      console.log('ext2List', ext2List);
      this.dicMap = Object.freeze(dataMap);
      return arr;
    },
    /**
     * @description 多个code查询数据字典
     */
    async getSourcePlatform(item) {
      try {
        const param = {
          code: 'RESOURCE_PLATFORM_CODE',
          status: 1,
          type: 2,
        };
        this.loading = true;
        const result = await find_tree_book_list(param);
        const { code, data = [], message } = result || {};
        if (code !== 200) {
          this.loading = false;
          this.$message.warning(message);
          return;
        }
        const arr = this.tranfromTreeData(data);
        this.sourceSysList = Object.freeze(arr);
        this.echoData(item, arr);
        this.loading = false;
      } catch (error) {
        this.loading = false;
      }
    },
    echoData(item, arr) {
      if (item) {
        const ruleForm = this.ruleForm;
        const value = item?.sourcePlatformCode || item.sourceSyscode;
        const firstCode = item.firstSourceChannelCode || item.firstSourceChannel || '';
        const secondCode = item.secondSourceChannelCode || item.secondSourceChannel || '';
        const findItem = value && arr.find((_) => _.code === value);
        if (findItem) {
          ruleForm.sourceSyscode = value;
          this.firstSourceList = findItem.children || [];
          const firstItem = findItem.children.find((_) => _.code === firstCode);
          const secondList = findItem.children.find((_) => _.code === firstCode)?.children || [];
          this.secondSourceList = secondList;
          const secondItem = secondList.find((_) => _.code === secondCode);
          ruleForm.firstSourceChannel = firstItem ? firstCode || '' : '';
          ruleForm.secondSourceChannel = secondItem ? secondCode || '' : '';
        }
      }
    },
    /**
     * @description 待分配中的编辑，分配记录拾回，录入的拾回
     * @param {Object} 回显参数
     */
    async openModal(item) {
      item = Object.assign({}, item);
      // 待分配编辑需要回显需求
      if (this.typeEdit === 'update_business') {
        this.ruleForm.customerRequire = [];
        this.ruleForm.customerRequire.push(item.productType, item.parentCode, item.intentionCode);
      }
      this.showRequire = true;
      this.setRulefromValue(item);
      this.setEditRulefromValue(item);
      // 是否自动加载数据
      this.getAreaList(item); //地区
      this.getSourcePlatform(item); //来源平台
    },
    /**
     * @description 切换一级来源渠道
     * @param {String} item
     */
    firstCodeChange(item) {
      this.ruleForm.secondSourceChannel = '';
      if (item) {
        this.secondSourceList = this.firstSourceList.find((_) => _.code === item)?.children || [];
      } else {
        this.secondSourceList = [];
      }
    },
    /**
     * @description 切换来源平台
     * @param {String} item
     */
    sysListChange(item) {
      this.ruleForm.firstSourceChannel = '';
      this.ruleForm.secondSourceChannel = '';
      if (item) {
        this.firstSourceList = this.sourceSysList.find((_) => _.code === item)?.children || [];
      } else {
        this.firstSourceList = [];
        this.secondSourceList = [];
        this.$nextTick(() => {
          this.$refs.ruleForm.clearValidate(['firstSourceChannel']);
        });
      }
    },
    changeTypeEdit(val) {
      this.typeEdit = val;
    },
    /**
     * @description 确定编辑客源
     */
    submit(callback) {
      return new Promise((resolve, reject) => {
        // 复制
        const ruleFormRef = this.$refs.ruleForm;
        ruleFormRef.validate((valid) => {
          if (valid) {
            const pathMap = {
              add_source,
              complete_clue,
              update_business,
              handle_back,
            };
            let params = Object.assign({}, this.ruleForm, this.editRuleForm);
            delete params.customerRequire;
            params.customerName = params.customerName?.trim();
            params.keyword = params.keyword?.trim();
            params.comment = params.comment?.trim();
            params.bizAreaName =
              this.areaList.find((item) => item.code === params.bizAreaCode)?.name || ''; //地区名称
            const quire = this.$refs.customerRequireRef.getCheckedNodes();
            params.productTypeCode = quire[0]?.data.productTypeCode || ''; //一级需求编码
            params.requireParentCode = quire[0]?.parent.value || ''; //二级需求编码
            params.requireParentName = quire[0]?.parent.label || ''; //二级需求名称
            params.requireCode = quire[0]?.value || ''; //三级需求编码
            params.requireName = quire[0]?.label || ''; //三级需求名称
            params.type = this.virtualCode ? 'test' : undefined; //虚拟手机号type
            this.buttonLoading = true;
            typeof callback === 'function' && callback();
            pathMap[this.typeEdit](params)
              .then((res) => {
                const { code, message } = res || {};
                if (code === 200) {
                  this.$message.success(message);
                  this.reset();
                  this.$emit('update');
                  this.buttonLoading = false;
                  return resolve(this.typeEdit);
                } else if (code === 5001) {
                  this.buttonLoading = false;
                  if (this.typeEdit === 'complete_clue') {
                    this.reset();
                    this.$message.warning('线索不存在，可能被转化');
                    return reject();
                  }
                  this.$message.warning('商机不存在');
                  this.$emit('no-biz');
                  return reject();
                } else {
                  this.buttonLoading = false;
                  this.$message.warning(message);
                  return reject();
                }
              })
              .catch((error) => {
                this.buttonLoading = false;
                return reject();
              });
          }
        });
      });
    },
    reset() {
      this.blurPhoneNumber = '';
      this.customerPhone = '';
      if (!['complete_clue', 'add_source'].includes(this.typeEdit)) {
        this.showRequire = false;
      }
      this.$refs.ruleForm.resetFields();
      Object.assign(this.$data.ruleForm, this.$options.data().ruleForm);
    },
    /**
     * @description 来源URL查询来源平台和来源渠道
     */
    urlBlurGetSource(e) {
      const value = e.target.value;
      this.$refs.ruleForm.validateField('sourceUrl', (valid) => {
        if (!valid && value && this.urlMatchRegExpList.length > 0) {
          const reg = new RegExp(this.urlMatchRegExpList.join('|'), 'ig');
          const arr = value.match(reg);
          const ruleForm = this.ruleForm;
          if (arr) {
            const matchValue = arr[0];
            const dicMap = this.dicMap;
            for (const key in dicMap) {
              const item = dicMap[key];
              if (item.ext2 === matchValue) {
                const pitem = dicMap[item.pcode];
                if (!pitem) break;
                const ppitem = dicMap[pitem.pcode];
                this.firstSourceList = ppitem?.children || [];
                this.secondSourceList = pitem.children || [];
                ruleForm.sourceSyscode = ppitem?.code || '';
                ruleForm.secondSourceChannel = item.code || '';
                ruleForm.firstSourceChannel = pitem.code || '';
                break;
              }
            }
          } else {
            ruleForm.firstSourceChannel = '';
            ruleForm.sourceSyscode = '';
            ruleForm.secondSourceChannel = '';
            this.firstSourceList = [];
            this.secondSourceList = [];
            this.$nextTick(() => {
              this.$refs.ruleForm.clearValidate(['firstSourceChannel']);
            });
          }
        }
      });
    },
  },
};
