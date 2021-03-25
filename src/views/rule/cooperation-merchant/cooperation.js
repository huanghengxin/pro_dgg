import './index.scss';
import ShowTooltip from 'components/show-tooltip';
import { query_cooperate, get_tree_book_by_codes } from 'api/rule';
import { get_dictionary_data_by_parent_code } from 'api/common';
import SvgIcon from 'components/svg-icon';
export default {
  name: 'cooperation',
  /**
   * @description 过滤单位
   */
  filters: {
    getTimeName: function(val) {
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
      cooperationHeight: null,
      loading: false,
      unitCode: [],
      libraryRule: [],
      ruleList: [],
      upperLimit: [],
    };
  },
  computed: {},
  async created() {
    this.loading = true;
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
    async init() {
      // 请求数据字段
      this.ruleList = (await this.getRulesMerchantLists()) || [];
      this.upperLimit =
        (await this.getDictionaryBycodes('BUSINESS_REFERRAL_MAN,ASSOCIATION_SINGLE')) || [];

      this.libraryRule =
        (await this.getDictionary('RULE_COOPERATE'))?.map((item) => {
          this.regDescription(item, 'RULE_COOPERATE_PCN');
          return {
            name: item.name,
            code: item.code,
            description: item.description,
          };
        }) || [];

      this.loading = false;
      this.unitCode = (await this.getDictionary('rule_date_code')) || [];
      // 时间单位匹配
      let unitCodeMap = {};
      for (const item of this.ruleList) {
        unitCodeMap[item.ruleCode] = item;
      }
      this.handleDataList(unitCodeMap, this.libraryRule);
    },
    /**
     * @description 多个code查询数据字典
     */
    async getDictionaryBycodes(codes) {
      try {
        const param = {
          codes: codes,
        };
        const result = await get_tree_book_by_codes(param);
        this.loading = false;
        if (result.code !== 200) {
          this.$message.warning(result.message);
          return;
        }
        if (result.code === 200) {
          return result.data;
        }
      } catch (error) {
        this.loading = false;
      }
    },
    /**
     * @description 匹配RULE_COOPERATE_PCN 最大值
     */
    regDescription(item, code) {
      let arr = [this.upperLimit[0].ext5, this.upperLimit[0].ext5];
      if (item.code === code) {
        let reg1 = /35/g;
        for (const item1 of arr) {
          let execItme = reg1.exec(item.description);
          if (execItme && execItme[0]) {
            item.description = item.description?.replace(execItme[0], item1);
          }
        }
      }
    },
    /**
     * @description 正则匹配规则描述
     */
    handleDataList(unitCodeMap, _codeList) {
      const map = {
        U_MINUTE: '分钟',
        U_HOUR: '小时',
        U_N_DAYS: '自然日',
      };
      for (const item1 of _codeList) {
        const unit = unitCodeMap[item1.code.trim()];
        if (typeof unit === undefined) {
          continue;
        }
        // 通过code判断规则正则替换
        // 合作联盟比例  抢单人数 合作保护取
        if (
          unit?.ruleCode.trim() === 'RULE_COOPERATE_PROTECTION_PERIOD' ||
          unit?.ruleCode.trim() === 'RULE_COOPERATE_ORDER_NUMBER_PEOPLE' ||
          unit?.ruleCode.trim() === 'RULE_COOPERATE_PCN'
        ) {
          let arr = [unit.val1, unit.val2];
          let reg1 = /【X】/g;
          for (const item2 of arr) {
            let execItme = reg1.exec(item1.description);
            if (execItme && execItme[0] && unit.val1 !== '' && unit.val2 !== '') {
              item1.description = item1.description?.replace(execItme[0], item2);
            }
          }
          continue;
        }
        // 未接收 解除申请超时 抢单轮次
        if (
          unit?.ruleCode.trim() === 'RULE_COOPERATE_NOT_RECEIVED' ||
          unit?.ruleCode.trim() === 'RULE_COOPERATE_RELIEVE_TIMEOUT' ||
          unit?.ruleCode.trim() === 'RULE_COOPERATE_ORDER_TURN'
        ) {
          let reg1 = /【X】【时间单位】/g;
          let execItme = reg1.exec(item1.description);
          if (execItme && execItme[0] && unit.val1 !== '' && unit.val2 !== '') {
            item1.description = item1.description?.replace(
              execItme[0],
              `${unit.val1}${map[unit.val2]}`,
            );
          }
          let execItme1 = reg1.exec(item1.description);
          if (execItme1 && execItme1[0] && unit.val3 !== '' && unit.val4 !== '') {
            item1.description = item1.description?.replace(
              execItme1[0],
              `${unit.val3}${map[unit.val4]}`,
            );
          }
          continue;
        }
        // 发起人解除合作
        if (unit?.ruleCode.trim() === 'RULE_COOPERATE_SPONSOR_TERMINATION') {
          let reg1 = /【X】/g;
          let execItme = reg1.exec(item1.description);
          if (execItme && execItme[0]) {
            item1.description = item1.description?.replace(execItme[0], unit?.val1);
          }
          continue;
        }
      }
    },
    /**
     * @description 获取高度
     */
    getHeight() {
      const top = this.$refs.cooperation.getBoundingClientRect().top;
      this.cooperationHeight =
        window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight - top;
    },

    /**
     * @description 数据字典接口
     */
    async getDictionary(code) {
      try {
        const param = {
          parentCode: code,
        };
        const result = await get_dictionary_data_by_parent_code(param);
        if (result.code !== 200) {
          this.loading = false;
          this.$message.warning(result.message);
          return;
        }
        this.loading = false;
        return result.data;
      } catch (error) {
        this.loading = false;
      }
    },
    /**
     * @description 规则数据接口
     */
    async getRulesMerchantLists() {
      try {
        const result = await query_cooperate();
        if (result.code !== 200) {
          this.$message.warning(result.message);
          return;
        }
        if (result.code === 200) {
          return result.data;
        }
        this.loading = false;
      } catch (error) {
        this.loading = false;
      }
    },
  },
};
