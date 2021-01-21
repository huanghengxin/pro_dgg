import './index.scss';
import ShowTooltip from 'components/show-tooltip';
import {
  queryTreeBook,
  rules_switch_boarded,
  merchants_query_rules,
  update_merchants,
} from 'api/rule';
import SvgIcon from 'components/svg-icon';
import { MerchantflowRule } from 'constants/rule-type';
export default {
  name: 'Merchant',
  /**
   * @description 过滤单位
   */
  filters: {
    getTimeName: function(val) {
      // if (value == 'TIAO') return '条';
      // if (value == 'GE') return '个';
      const map = {
        U_N_DAYS: '天',
        U_MINUTE: '分钟',
        U_HOUR: '小时',
      };
      return map[val];
    },
  },
  components: {
    ShowTooltip,
    SvgIcon,
  },
  data() {
    return {
      merchantHeight: null,
      switchboardStatus: null,
      loading: false,
      unitCode: [],
      library: [],
      libraryRule: [],
      staffRule: [],
      changeForm: [],
      parma: [],
      rulesMerchantLists: [],
      getRuleList: { data1: [] },
      getStaffList: { data2: [] },
    };
  },
  computed: {},
  created() {
    this.getSwitchboard();
    this.init();
  },
  mounted() {
    this.getHeight();
    window.addEventListener('resize', this.getHeight);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.getHeight);
  },
  methods: {
    /**
     * @description 获取高度
     */
    getHeight() {
      const top = this.$refs.merchant.getBoundingClientRect().top;
      this.merchantHeight = window.innerHeight - top;
    },
    async init() {
      // 商户规则后台数据
      this.loading = true;
      this.rulesMerchantLists = (await this.getRulesMerchantLists()) || [];
      if (this.rulesMerchantLists.length === 0) {
        this.loading = false;
        return;
      }
      // 数据字典
      const dictionaryTree = (await this.getDictionary().catch()) || {};
      this.loading = false;
      this.unitCode = dictionaryTree.rule_date_code || [];
      let libraryMap = dictionaryTree.rule_biz_db_code.reduce((acc, cur) => {
        acc[cur.code] = cur.name;
        return acc;
      }, {});
      // libraryCode
      let dateMap = dictionaryTree.rule_date_code.reduce((acc, cur) => {
        acc[cur.code] = cur.name;
        return acc;
      }, {});
      let unitCodeMap = {};
      for (const item of this.rulesMerchantLists) {
        const isLibraryCode = Object.prototype.hasOwnProperty.call(item, 'libraryCode');
        const isTimeCode = Object.prototype.hasOwnProperty.call(item, 'timeCode');
        const isNoAttentionMaxDay = Object.prototype.hasOwnProperty.call(item, 'noAttentionMaxDay');

        if (isLibraryCode) item['【X】库'] = libraryMap[item.libraryCode];
        if (isTimeCode) item['【单位】'] = dateMap[item.timeCode];
        if (isNoAttentionMaxDay) item['【X】自然日'] = item.noAttentionMaxDay;

        unitCodeMap[item.ruleCode] = item;
      }

      this.handleDataList(unitCodeMap, dictionaryTree.lz_code, 'getRuleList');
      this.handleDataList(unitCodeMap, dictionaryTree.sx_code, 'getStaffList');
    },
    /**
     * @description 获取总开关数据
     */
    async getSwitchboard() {
      const param = {
        ruleCode: 'RULE_SWITCH_ALL',
      };
      const boarded = await rules_switch_boarded(param);
      if (boarded.code === 200) {
        this.switchboardStatus = boarded.data.status;
      } else {
        this.$message.warning(boarded.message);
      }
    },
    /**
     * @description 正则匹配描述
     */
    handleDataList(unitCodeMap, _codeList, data) {
      const reg = /【单位】|【X】库|【X】自然日|上限/g;
      for (const item1 of _codeList) {
        if (item1.ext1 !== 'Y') continue;
        const unit = unitCodeMap[item1.code];
        if (typeof unit == 'undefined') {
          return;
        }
        let arr = Object.keys(unit);
        if (arr.length == 0) {
          return;
        }
        let obj = {};
        obj.ruleCode = item1.code || '';
        obj.id = item1.id || '';
        obj.name = item1.name || '';
        obj.max = unit.max || '';
        obj.val1 = unit.val1 || '';
        obj.val2 = unit.val2 || '';
        obj.status = unit.status || '';
        obj.timeCode = unit.timeCode || '';
        let str = item1.description;
        let str1 = str;
        let flag = true;

        while (flag) {
          let execItme = reg.exec(str1);
          if (!execItme) {
            flag = false;
          } else {
            if (unit[execItme[0]]) {
              str1 = str1.replace(execItme[0], unit[execItme[0]]);
            }
          }
        }
        obj.description = str1.replace('上限', '默认');
        if (data === 'getRuleList') {
          this[data]?.data1.push(obj);
        } else {
          this[data]?.data2.push(obj);
        }
      }
    },
    /**
     * @description val1输入框校验
     */
    handleRule(item) {
      const rule = [
        {
          validator: (rule, value, callback) => {
            const field = rule.field;
            const indexArr = field.split('.');
            const d = indexArr[0];
            if (value.trim() === '') {
              callback();
            } else {
              if (d === 'data1') {
                let reg = /^[1-9]\d*$/;
                if (!reg.test(value) || value * 1 > item.max * 1) {
                  callback(new Error('请输入平台最大值范围内正整数'));
                }
                callback();
              } else {
                let reg = /^[0-9]\d*$/;
                if (!reg.test(value) || value * 1 > item.max * 1) {
                  callback(new Error('请输入平台最大值范围内正整数'));
                }
                callback();
              }
            }
          },
          trigger: ['blur'],
        },
      ];
      return rule;
    },
    /**
     * @description 输入框值变化
     */
    handleChange(row) {
      let obj = {};
      var result = this.parma.some((item) => {
        if (item.code === row.code) {
          return true;
        }
      });
      if (result) {
        this.parma.forEach((item) => {
          if (item.code === row.code) {
            item.val1 = row.val1;
          }
        });
      } else {
        obj.code = row.code;
        obj.val1 = row.val1;
        this.parma.push(obj);
      }
    },

    /**
     * @description 数据字典接口
     */
    async getDictionary() {
      const param = {
        code: 'rule_code',
      };
      const result = await queryTreeBook(param).catch(() => {
        this.loading = false;
      });
      if (result.code === 200) {
        this.loading = false;
        return result.data;
      } else {
        this.loading = false;
        this.$message.warning(result.message);
      }
    },
    /**
     * @description 柜子数据接口
     */
    async getRulesMerchantLists() {
      const result = await merchants_query_rules().catch(() => {
        this.loading = false;
      });
      if (result.code === 200) {
        return result.data;
      } else {
        this.$message.warning(result.message);
      }
    },
    /**
     * @description 保存规则变动数据
     */
    saveMerchantRule() {
      let check1 = null;
      let check2 = null;
      this.$refs.getStaffListRef.validate((valid) => {
        check2 = valid;
      });
      this.$refs.getRuleListRef.validate((valid) => {
        check1 = valid;
      });
      if (check1 && check2) {
        this.$messageBox
          .confirm('请确定保存规则, 是否继续?', '保存提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            customClass: 'message-box-min-height',
            closeOnClickModal: false,
          })
          .then(() => {
            this.updateMerchants();
          })
          .catch(() => {});
      } else {
        return;
      }
    },
    /**
     * @description 更新规则接口
     */
    updateMerchants() {
      const getRule = this.getRuleList?.data1 || [];
      const getStaff = this.getStaffList?.data2 || [];
      const rulesMerchant =
        [...getRule, ...getStaff].map((item) => {
          return {
            id: item.id,
            ruleCode: item.ruleCode,
            timeCode: item.timeCode,
            status: item.status,
            val1: item?.val1.trim(),
            val2: item?.val2.trim(),
          };
        }) || [];

      update_merchants(rulesMerchant)
        .then((res) => {
          if (res.code === 200) {
            this.$message({
              type: 'success',
              message: '保存成功!',
            });
          } else {
            this.$message.warning(res.message);
          }
        })
        .catch(() => {});
    },
  },
};
