import ShowTooltip from 'components/show-tooltip';
import SvgIcon from 'components/svg-icon';
import { ALLOCATION_RESULT } from 'constants/constants';
import { find_tree_book_list, get_search, get_all_businessArea } from 'api/common';
import {
  get_biz_distribution_type,
  save_resource_distribution_rules,
  get_operation_log_list,
} from 'api/source-manage';
export default {
  name: 'SetAllocationWay',
  components: {
    ShowTooltip,
    SvgIcon,
  },
  data() {
    const checkChangeTime = (rule, value, callback) => {
      let val = this.showListMap.DISTRIBUTION_CENTER_RULE_SET_UP_TRANSFER_TIME.valueOne;
      val = val?.trim();
      const reg = /^[1-9][0-9]{0,3}$/;
      if (!reg.test(val)) {
        callback('请输入1-9999的正整数');
      } else {
        callback();
      }
    };
    const executeTime = (rule, value, callback) => {
      if (value) {
        if (value[0] === value[1]) {
          callback('开始时间不能和结束时间相同');
        }
        callback();
      } else {
        callback('请选择时间');
      }
    };
    return {
      activeName: 'first',
      loading: false,
      saveButtonLoading: false,
      iconLoading: true,
      areaList: [], //意向区域
      bizSourceList: [], //来源平台
      dictionary: [],
      showListMap: {},
      limit: 10, //每页显示多少条
      tableDataPage: 0, //总页数
      tableData: [],
      params: {
        resourceNo: undefined, //资源编码
        customerName: undefined, //客户名称
        isSuccess: undefined, //分配结果
        start: 1, //页数
      },
      ruleForm2: {
        allocationState: false, //智能分配状态
        executeTime: '', //执行时间段
        changeTime: '', //转人工时间
      },
      rules: {
        executeTime: [{ validator: executeTime, trigger: 'change' }],
        changeTime: [{ validator: checkChangeTime, trigger: 'change' }],
      },
      props: { multiple: true, value: 'code', label: 'name' },
      options: [],
    };
  },
  computed: {
    allotResultList() {
      return ALLOCATION_RESULT;
    },
    isSaveButton() {
      const showListMap = this.showListMap;
      let arr = [];
      for (const key in showListMap) {
        const value = showListMap[key];
        if (value.ruleCode === 'DISTRIBUTION_CENTER_RULE_SET_UP_MODE_DISTRIBUTION_MODE') continue;
        if ((value.valueOne !== '0' && value.valueOne.length) || value.valueTwo === 'true') {
          arr.push(true);
        } else {
          arr.push(false);
        }
      }
      return arr.every((item) => item);
    },
  },
  watch: {},
  created() {
    this.getCustomerRequire();
    this.init('DISTRIBUTION_CENTER_RULE_SET_UP_MODE');
  },
  mounted() {},
  methods: {
    async init(type) {
      const promiseList = [];
      promiseList.push(
        get_all_businessArea({ a: 1 }),
        find_tree_book_list({
          code: 'RESOURCE_PLATFORM_CODE',
          type: 1,
          status: 1,
        }),
      );
      const result = await Promise.all(promiseList);
      const [value1 = {}, value2] = result || [];
      if (value1.code === 200) {
        this.areaList = value1.data?.cityList || [];
      } else {
        this.$message.warning(value1.message);
      }
      if (value2.code === 200) {
        this.bizSourceList = value2.data?.filter((item) => item.ext1 != 0);
      } else {
        this.$message.warning(value2.message);
      }
      this.getDistributionType(type);
    },
    /**
     * @description 获取客源分配方式
     */
    getDistributionType(code) {
      this.iconLoading = true;
      this.loading = true;
      get_biz_distribution_type({
        code,
      })
        .then((res) => {
          if (res.code === 200) {
            const dictionary = res.data.dictionary;
            this.dictionary = dictionary;
            const show = res.data.show || [];
            let showListMap = {};
            const listMap = {
              DISTRIBUTION_CENTER_RULE_SET_UP_MODE_SOURCE_PLATFORM: this.bizSourceList,
              DISTRIBUTION_CENTER_RULE_SET_UP_MODE_INTENTION_CITY: this.areaList,
            };
            for (let i = 0; i < dictionary.length; i++) {
              const dictionaryI = dictionary[i];
              const showI = show[i];
              // 初始化数据
              if (!showI) {
                show[i] = {
                  ruleCode: dictionaryI.code,
                  ruleDesc: dictionaryI.name,
                  ruleName: dictionaryI.name,
                  ruleStatus: 1,
                  valueOne: '',
                  valueTwo: code === 'DISTRIBUTION_CENTER_RULE_SET_UP' ? '' : 'false', //智能分配设置
                };
                showListMap[dictionaryI.code] = show[i];
              } else {
                const one = showI.ruleCode;
                const valueOne = showI.valueOne;
                const valueTwo = showI.valueTwo;
                if (code !== 'DISTRIBUTION_CENTER_RULE_SET_UP') {
                  // 客源分配方式
                  showI.valueOne = valueTwo === 'true' ? '' : JSON.parse(valueOne);
                } else {
                  // 智能分配设置
                  if (one === 'DISTRIBUTION_CENTER_RULE_SET_UP_EXE_TIME_SLOT') {
                    this.ruleForm2.executeTime = [valueOne, valueTwo];
                  }
                }
                // show[i].valueOne =
                //   code === 'DISTRIBUTION_CENTER_RULE_SET_UP' //智能分配设置
                //     ? show[i].valueOne
                //     : show[i].valueTwo === 'true'
                //     ? (show[i].valueOne = '')
                //     : JSON.parse(show[i].valueOne);
                if (listMap[one]) {
                  let arr = [];
                  for (let j = 0; j < listMap[one].length; j++) {
                    const element = listMap[one][j];
                    if (!valueOne?.includes(element.code)) continue;
                    arr.push(element.code);
                  }
                  showI.valueOne = arr;
                }
                showListMap[showI.ruleCode] = showI;
              }
            }
            this.showListMap = showListMap;
            this.iconLoading = false;
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
     * @description 校验是智能分配设置是否成功
     */
    validateSet() {
      return new Promise((resolve) => {
        this.$refs.ruleForm2.validate((valid) => {
          resolve(valid);
        });
      });
    },
    /**
     * @description 保存分配方式
     */
    async saveAllocation(code) {
      try {
        if (code === 'DISTRIBUTION_CENTER_RULE_SET_UP') {
          const valid = await this.validateSet();
          if (!valid) return;
        }
        const flag =
          code === 'DISTRIBUTION_CENTER_RULE_SET_UP' && //智能分配设置
          this.showListMap['DISTRIBUTION_CENTER_RULE_SET_UP_SWITCH'].valueOne === '0';
        if (flag) {
          const confirm = await this.$messageBox.confirm(
            '智能分配为关闭状态，执行时间段不生效！',
            '提示',
            {
              closeOnClickModal: false,
              type: 'warning',
            },
          );
          if (confirm === 'confirm') {
            this.saveButtonLoading = true;
            this.saveApi(code);
          }
        } else {
          this.saveButtonLoading = true;
          this.saveApi(code);
        }
      } catch (error) {
        this.saveButtonLoading = false;
      }
    },
    saveApi(code) {
      const showListMap = this.showListMap;
      const executeTime = this.ruleForm2.executeTime;
      // const arr = [
      //   'DISTRIBUTION_CENTER_RULE_SET_UP_SWITCH',
      //   'DISTRIBUTION_CENTER_RULE_SET_UP_TRANSFER_TIME',
      // ];
      let params = [];
      Object.keys(showListMap).forEach((item) => {
        const obj = {};
        obj.ruleCode = showListMap[item].ruleCode;
        obj.ruleName = showListMap[item].ruleName;
        obj.ruleStatus = showListMap[item].ruleStatus.toString();
        obj.ruleDesc = showListMap[item].ruleName;
        // 判断是否是智能分配设置并且是执行时间段字段
        if (code === 'DISTRIBUTION_CENTER_RULE_SET_UP') {
          if (item === 'DISTRIBUTION_CENTER_RULE_SET_UP_EXE_TIME_SLOT') {
            obj.valueOne = executeTime[0];
            obj.valueTwo = executeTime[1];
          } else {
            obj.valueOne = showListMap[item].valueOne;
            obj.valueTwo = 'false';
          }
        } else {
          obj.valueOne =
            showListMap[item].valueTwo === 'true'
              ? undefined
              : JSON.stringify(showListMap[item].valueOne);
          obj.valueTwo = showListMap[item].valueTwo;
        }
        // obj.valueOne =
        //   code === 'DISTRIBUTION_CENTER_RULE_SET_UP' //智能分配设置
        //     ? showListMap[item].valueOne
        //     : showListMap[item].valueTwo === 'true'
        //     ? undefined
        //     : JSON.stringify(showListMap[item].valueOne);
        // obj.valueTwo = arr.includes(item) ? 'false' : showListMap[item].valueTwo;
        obj.id = showListMap[item].id;
        params.push(obj);
      });
      save_resource_distribution_rules({ rules: params })
        .then((res) => {
          if (res.code === 200) {
            this.$message.success(res.message);
            this.saveButtonLoading = false;
            this.getDistributionType(code);
            return;
          } else {
            this.$message.warning(res.message);
            this.saveButtonLoading = false;
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
    /**
     * @description 获取业务需求
     */
    async getCustomerRequire() {
      const params = {
        productTypeCode: '',
        code: '',
      };
      const value = await this.getCustomerApi(params);
      if (value) {
        const codes = value.map((item) => item.code);
        const promiseList = [];
        const valueMap = value.reduce((acc, cur) => {
          acc[cur.code] = cur;
          return acc;
        }, {});
        for (let i = 0; i < codes.length; i++) {
          const item = codes[i];
          if (item) {
            promiseList.push(
              this.getCustomerApi({
                productTypeCode: item,
                code: item,
                needTwo: 1,
              }),
            );
          }
        }
        const value1 = await Promise.all(promiseList);
        for (let j = 0; j < value1.length; j++) {
          const item1 = value1[j];
          const itemMap = item1.reduce((acc, cur) => {
            acc[cur.code] = cur;
            return acc;
          }, {});
          for (let k = 0; k < item1.length; k++) {
            const child = item1[k];
            const parent = itemMap[child.parentCode];
            if (parent) {
              if (parent.children) {
                parent.children.push(child);
              } else {
                parent.children = [child];
              }
            }
            if (child.level === 1) {
              const product = valueMap[child.productTypeCode];
              if (product.children) {
                product.children.push(child);
              } else {
                product.children = [child];
              }
            }
          }
        }
        const options = [];
        for (const key in valueMap) {
          const p = valueMap[key];
          options.push(p);
        }
        this.options = Object.freeze(options);
        console.log(' this.options', this.options);
      }
    },
    async getCustomerApi(params) {
      const result = await get_search(params);
      if (result.code === 200) {
        return result.data;
      }
      return [];
    },
    /**
     * @description 智能分配日志
     */
    getOperationLog(params) {
      this.loading = true;
      params.limit = this.limit;
      get_operation_log_list(params)
        .then((res) => {
          if (res.code === 200) {
            this.tableData = res.data.records || [];
            this.tableDataPage = res.data.totalCount;
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
     * @description 搜索
     */
    searchParams() {
      this.params.start = 1;
      this.getOperationLog(this.params);
    },
    /**
     * @description 重置
     */
    resetParams() {
      this.params = {
        resourceNo: undefined, //资源编码
        customerName: undefined, //客户名称
        isSuccess: undefined, //分配结果
        start: 1, //页数
      };
      this.getOperationLog(this.params);
    },
    /**
     * @description 分页
     * @param {Number}
     */
    //每页多少条
    handleSizeChange(val) {
      this.limit = val;
      this.getOperationLog(this.params);
    },
    //第几页
    handleCurrentChange(val) {
      this.params.start = val;
      this.getOperationLog(this.params);
    },
    /**
     * @description tab页切换
     */
    handleClick(tab, event) {
      const code = tab.name;
      if (code === undefined || this.loading) return;
      this.showListMap = {};
      if (code === 'first') {
        this.init('DISTRIBUTION_CENTER_RULE_SET_UP_MODE');
      } else if (code === 'second') {
        this.getDistributionType('DISTRIBUTION_CENTER_RULE_SET_UP'); //智能分配设置
      } else {
        this.params = {
          resourceNo: undefined, //资源编码
          customerName: undefined, //客户名称
          isSuccess: undefined, //分配结果
          start: 1, //页数
        };
        this.getOperationLog(this.params);
      }
    },
    handleCheckAllChange(val, code) {
      if (val) {
        this.showListMap[code].valueOne = '';
      }
    },
    handle(item) {
      return this[item + 'List'];
    },
  },
};
