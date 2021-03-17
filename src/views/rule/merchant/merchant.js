import './index.scss';
import ShowTooltip from 'components/show-tooltip';
import dayjs from 'dayjs';
import {
  queryTreeBook,
  rules_switch_boarded,
  merchants_query_rules,
  update_merchants,
} from 'api/rule';
import SvgIcon from 'components/svg-icon';
export default {
  name: 'Merchant',
  /**
   * @description 过滤单位
   */
  filters: {
    getTimeName: function (val) {
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
      edit: true,
      start: '',
      end: '',
    };
  },
  computed: {},
  created() {
    this.getSwitchboard();
    this.init();
  },
  mounted() {
    this.$nextTick(() => {
      this.getHeight();
      window.addEventListener('resize', this.getHeight);
    });
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
      this.merchantHeight =
        window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight - top;
    },
    async init() {
      this.loading = true;
      // 数据字典
      const dictionaryTree = (await this.getDictionary().catch()) || {};
      this.unitCode = dictionaryTree.rule_date_code || [];
      // 商户规则后台数据
      this.rulesMerchantLists = (await this.getRulesMerchantLists()) || [];
      if (this.rulesMerchantLists.length === 0) {
        this.loading = false;
        return;
      }
      this.loading = false;
      let libraryMap = dictionaryTree.rule_biz_db_code?.reduce((acc, cur) => {
        acc[cur.code] = cur.name;
        return acc;
      }, {});

      // libraryCode
      let dateMap = dictionaryTree.rule_date_code?.reduce((acc, cur) => {
        acc[cur.code] = cur.name;
        return acc;
      }, {});
      let unitCodeMap = {};
      for (const item of this.rulesMerchantLists) {
        const isLibraryCode = Object.prototype.hasOwnProperty.call(item, 'libraryCode');
        const isTimeCode = Object.prototype.hasOwnProperty.call(item, 'timeCode');
        const isNoAttentionMaxDay = Object.prototype.hasOwnProperty.call(item, 'noAttentionMaxDay');
        // 后端沟通具体的不用字段的命名

        if (isLibraryCode) item['【X】库'] = libraryMap[item.libraryCode];
        if (isTimeCode) item['【单位】'] = dateMap[item.timeCode];
        if (isNoAttentionMaxDay) item['【X】自然日'] = item.noAttentionMaxDay;
        unitCodeMap[item.ruleCode] = item;
      }
      this.handleDataList(unitCodeMap, dictionaryTree.lz_code, 'getRuleList');
      this.handleDataList(unitCodeMap, dictionaryTree.sx_code, 'getStaffList');
      this.regDescription(this.getRuleList.data1);
      // console.log(
      //   'libraryRulelibraryRulelibraryRulelibraryRulelibraryRule',
      //   dictionaryTree.lz_code,
      // );
    },
    /**
     * @description 获取总开关数据
     */
    async getSwitchboard() {
      const param = {
        ruleCode: 'RULE_SWITCH_ALL',
      };
      const boarded = await rules_switch_boarded(param);
      if (boarded.code !== 200) {
        this.$message.warning(boarded.message);
        return;
      }
      if (boarded.code === 200) {
        this.switchboardStatus = boarded.data.status;
        this.switchboardEndDate(boarded.data.val2, boarded.data.val1);
      }
    },
    /**
     * @description 总开关结束时间范围内
     */
    switchboardEndDate(endDateStr = null, startDateStr = null) {
      if (!dayjs(endDateStr).isValid() || !dayjs(startDateStr).isValid()) return;
      let curDate = dayjs().valueOf();
      let dateEnd = dayjs(endDateStr).valueOf();
      let dateStart = dayjs(startDateStr).valueOf();
      if (curDate < dateStart || curDate > dateEnd) {
        this.edit = true;
      } else {
        this.edit = false;
      }
    },
    /**
     * @description 正则匹配描述
     */
    handleDataList(unitCodeMap, _codeList, data) {
      const reg = /【单位】|【X】库|【X】自然日|上限/g;
      for (const item1 of _codeList) {
        // 平台规则商户全部展示，需要后台数据调整
        const unit = unitCodeMap[item1.code.trim()];
        // 后端没有数据;
        if (typeof unit == 'undefined') {
          if (data === 'getRuleList') {
            this[data]?.data1.push({
              id: '',
              ruleCode: item1.code || '',
              description: item1.description || '',
              name: item1.name || '',
              val1: '',
              val2: '',
              val3: '',
              val4: '',
              max: '',
            });
          } else {
            this[data]?.data2.push({
              id: '',
              ruleCode: item1.code || '',
              description: item1.description || '',
              name: item1.name || '',
              val1: '',
              val2: '',
              val3: '',
              val4: '',
              max: '',
            });
          }
          continue;
        }
        let arr = Object.keys(unit);
        if (arr.length == 0) {
          return;
        }
        let obj = {};
        obj.ruleCode = item1.code || '';
        obj.id = item1.id || '';
        obj.name = item1.name || '';
        obj.max = unit?.max || '';
        obj.val1 = unit?.val1 || '';
        obj.val2 = unit?.val2 || '';
        obj.val3 = unit?.val3 || '';
        obj.val4 = unit?.val4 || '';
        obj.status = unit?.status || '';
        obj.timeCode = unit?.timeCode || '';
        let str = item1.description;
        let str1 = str;
        let flag = true;
        if (unit?.ruleCode !== 'LZ_PUB_HID' && unit?.ruleCode !== 'LZ_PUB_SE') {
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
        }
        obj.description = str1.replace('上限', '默认');
        if (data === 'getRuleList') {
          this[data]?.data1.push(obj);
        } else {
          this[data]?.data2.push(obj);
        }
      }
    },
    // 正常匹配描述
    regDescription(data) {
      const map = {
        U_MINUTE: '分钟',
        U_HOUR: '小时',
        U_N_DAYS: '自然日',
      };
      for (const unit of data) {
        // 公共库影藏规则和公海库影藏规则;
        if (unit?.ruleCode === 'LZ_PUB_HID' || unit?.ruleCode === 'LZ_PUB_SE') {
          let arr = [map[unit.val3], map[unit.val4]];
          let arr2 = [unit.val1, unit.val2];
          const reg1 = /【X】【单位】/g;
          for (let i = 0; i < arr.length; i++) {
            let execItme = reg1.exec(unit.description);
            if (
              execItme &&
              execItme[0] &&
              unit.val1 !== '' &&
              unit.val2 !== '' &&
              unit.val3 !== '' &&
              unit.val4 !== ''
            ) {
              unit.description = unit.description?.replace(execItme[0], `${arr2[i]}${arr[i]}`);
            }
          }
          continue;
        }
        // 移交商机跟进
        if (unit?.ruleCode === 'RULE_LZ_PUBLIC_TRANSFER_MOVE') {
          const reg1 = /【X】【时间单位】/g;
          let execItme = reg1.exec(unit.description);
          if (execItme && execItme[0] && unit.max !== '' && unit.timeCode !== '') {
            unit.description = unit.description?.replace(
              execItme[0],
              `${unit.max}${map[unit.timeCode]}`,
            );
          }
          continue;
        }
        // 规则延迟执行  // 商机掉库提醒     //超时面谈取消
        if (
          unit?.ruleCode === 'RULE_DELAY' ||
          unit?.ruleCode === 'LZ_PRE_DROP_MSG' ||
          unit?.ruleCode === 'LZ_PUB_BATCH_CLUE_RETRIEVE' ||
          unit?.ruleCode === 'LZ_CA_INT'
        ) {
          let reg2 = /【X】/g;
          let execItme = reg2.exec(unit.description);
          if (execItme && execItme[0] && unit.max !== '') {
            unit.description = unit.description?.replace(execItme[0], `${unit.max}`);
          }
          if (unit?.ruleCode === 'LZ_PRE_DROP_MSG') {
            unit.description = `${unit.description}(包括总规则和单条规则)`;
          }
          continue;
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
            if (
              value.trim() === '' ||
              item.ruleCode === 'LZ_PUB_INV' ||
              item.ruleCode === 'LZ_PUB_HID' ||
              item.ruleCode === 'LZ_PUB_SE' ||
              item.ruleCode === 'RULE_LZ_PUBLIC_TRANSFER_MOVE' ||
              item.ruleCode === 'RULE_DELAY' ||
              item.ruleCode === 'LZ_PRE_DROP_MSG' ||
              item.ruleCode === 'LZ_CA_INT'
            ) {
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
     * @description 数据字典接口
     */
    async getDictionary() {
      try {
        const param = {
          code: 'rule_code',
        };
        const result = await queryTreeBook(param);
        if (result.code !== 200) {
          this.$message.warning(result.message);
        }
        if (result.code === 200) {
          return result.data;
        }
      } catch (error) {
        this.loading = false;
      }
    },
    /**
     * @description 规则数据接口
     */
    async getRulesMerchantLists() {
      try {
        const result = await merchants_query_rules();
        if (result.code !== 200) {
          this.$message.warning(result.message);
        }
        if (result.code === 200) {
          return result.data;
        }
      } catch (error) {
        this.loading = false;
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
        console.log(check2, 'check2check2check2check2check2');
      });
      this.$refs.getRuleListRef.validate((valid) => {
        check1 = valid;
        console.log(check1, 'check2check2check2check2check2');
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
        [...getRule, ...getStaff]?.map((item) => {
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
