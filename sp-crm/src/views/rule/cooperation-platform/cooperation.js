import './index.scss';
import ShowTooltip from 'components/show-tooltip';
// import dayjs from 'dayjs';
import { query_cooperate, save_cooperate, get_tree_book_by_codes } from 'api/rule';
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
      ruleList: [],
      cooperationHeight: null,
      switchboardStatus: null,
      loading: false,
      unitCode: [],
      library: [],
      libraryRule: [],
      changeForm: [],
      parma: [],
      // rulesMerchantLists: [],
      upperLimit: [],
      edit: true,
    };
  },
  computed: {
    getLibraryRule() {
      return (
        this.ruleList?.reduce((cur, acc) => {
          cur[acc.ruleCode] = acc;
          return cur;
        }, {}) || {}
      );
    },
    /**
     * @description 规则列表数据
     */
    getRuleList() {
      const arr =
        this.libraryRule?.map((item) => {
          const { status, val1 = '', val2 = '', val3 = '', val4 = '', id = '' } =
            this.getLibraryRule[item.code] || {};
          return {
            status,
            val1,
            val2,
            val3,
            val4,
            id,
            ...item,
          };
        }) || [];
      return { data1: arr };
    },
  },
  async created() {
    this.loading = true;
    // 请求数据字段
    this.ruleList = (await this.getRulesMerchantLists()) || [];
    // 后台
    this.unitCode = (await this.getDictionary('rule_date_code')) || [];
    this.upperLimit =
      (await this.getDictionaryBycodes('BUSINESS_REFERRAL_MAN,ASSOCIATION_SINGLE_MAN')) || [];
    // 字典和code码一一对应
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
     * @description 匹配RULE_COOPERATE_PCN 最大值
     */
    regDescription(item, code) {
      let arr = [this.upperLimit[0].ext5, this.upperLimit[1].ext5];
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
     * @description val1校验
     */
    handleRuleVal1(item) {
      const rule = [
        {
          validator: (rule, value, callback) => {
            value = value?.trim();
            if (value === '') {
              callback(new Error('必填项'));
            } else if (
              item.code === 'RULE_COOPERATE_PCN' &&
              value * 1 > this.upperLimit[0].ext5 * 1
            ) {
              callback(new Error('请输入小于维护权合作最大值'));
            }
            {
              var reg = /^[1-9][0-9]{0,3}$/;
              if (!reg.test(value)) {
                callback(new Error('≤9999正整数'));
              }
              callback();
            }
          },
          trigger: ['blur'],
        },
      ];
      return rule;
    },

    /**
     * @description val2输入框校验
     */
    handleRuleVal2(item) {
      const rule = [
        {
          validator: (rule, value, callback) => {
            value = value?.trim();
            if (item.code === 'RULE_COOPERATE_SPONSOR_TERMINATION') {
              callback();
            }
            if (value !== '') {
              if (
                item.code === 'RULE_COOPERATE_RELIEVE_TIMEOUT' ||
                item.code === 'RULE_COOPERATE_ORDER_TURN' ||
                item.code === 'RULE_COOPERATE_NOT_RECEIVED'
              ) {
                var regex = /^[A-Z_]+$/gi;
                if (!regex.test(value)) {
                  callback(new Error('请输入大写字母或下划线'));
                }
                callback();
              } else if (
                item.code === 'RULE_COOPERATE_PCN' &&
                value * 1 > this.upperLimit[1].ext5 * 1
              ) {
                callback(new Error('请输入小于维护权合作最大值'));
              } else {
                var reg = /^[1-9][0-9]{0,3}$/;
                if (!reg.test(value)) {
                  callback(new Error('≤9999正整数'));
                }
                callback();
              }
            } else {
              callback(new Error('必填项'));
            }
            callback();
          },
          trigger: ['blur'],
        },
      ];
      return rule;
    },
    /**
     * @description val3输入框校验
     */
    handleRuleVal3(item) {
      const rule = [
        {
          validator: (rule, value, callback) => {
            value = value?.trim();
            if (item.code === 'RULE_COOPERATE_ORDER_TURN') {
              if (value === '') {
                callback(new Error('必填项'));
              } else {
                var reg = /^[1-9][0-9]{0,3}$/;
                if (!reg.test(value)) {
                  callback(new Error('≤9999正整数'));
                }
                callback();
              }
            }
            callback();
          },
          trigger: ['blur'],
        },
      ];
      return rule;
    },
    /**
     * @description val4输入框校验
     */
    handleRuleVal4(item) {
      const rule = [
        {
          validator: (rule, value, callback) => {
            value = value?.trim();
            if (item.code === 'RULE_COOPERATE_ORDER_TURN') {
              if (value === '') {
                callback(new Error('必填项'));
              } else {
                var regex = /^[A-Z_]+$/gi;
                if (!regex.test(value)) {
                  callback(new Error('请输入大写字母或下划线'));
                }
                callback();
              }
            }
            callback();
          },
          trigger: ['blur'],
        },
      ];
      return rule;
    },
    /**
     * @description 多个code查询数据字典
     */
    async getDictionaryBycodes(codes) {
      try {
        const param = {
          codes: codes,
          status: 1,
        };
        const result = await get_tree_book_by_codes(param);
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
    /**
     * @description 规则数据接口
     */
    async getRulesMerchantLists() {
      try {
        const result = await query_cooperate();
        if (result.code !== 200) {
          this.$message.warning(result.data.message);
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
    /**
     * @description 保存规则变动数据
     */
    saveMerchantRule() {
      let check1 = null;
      this.$refs.getRuleListRef.validate((valid) => {
        check1 = valid;
      });
      if (check1) {
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
      this.loading = true;
      const getRule = this.getRuleList?.data1 || [];
      const rulesMerchant =
        getRule?.map((item) => {
          return {
            id: item.id,
            ruleCode: item.code,
            status: item.status,
            val1: item?.val1.trim(),
            val2: item?.val2.trim(),
            val3: item?.val3.trim(),
            val4: item?.val4.trim(),
          };
        }) || [];
      save_cooperate(rulesMerchant)
        .then((res) => {
          if (res.code === 200) {
            this.$message({
              type: 'success',
              message: '保存成功!',
            });
          } else {
            this.$message.warning(res.message);
          }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
