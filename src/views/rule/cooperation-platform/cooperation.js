import './index.scss';
import ShowTooltip from 'components/show-tooltip';
// import dayjs from 'dayjs';
import { queryTreeBook, merchants_query_rules, update_merchants } from 'api/rule';
import SvgIcon from 'components/svg-icon';
export default {
  name: 'cooperation',
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
    const validateVal1 = (rule, value, callback) => {
      value = value?.trim();
      if (value === '') {
        callback(new Error('必填项'));
      } else {
        var reg = /^[1-9][0-9]{0,3}$/;
        if (!reg.test(value)) {
          callback(new Error('数值≤9999正整数'));
        }
        callback();
      }
    };

    return {
      rules: {
        val1: [{ validator: validateVal1, trigger: 'blur' }],
      },
      cooperationHeight: null,
      switchboardStatus: null,
      loading: false,
      unitCode: [],
      library: [],
      libraryRule: [],
      changeForm: [],
      parma: [],
      rulesMerchantLists: [],
      // getRuleList: { data1: [] },
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
    const dictionaryTree = (await this.getDictionary()) || {};
    this.unitCode = dictionaryTree.rule_date_code || [];
    // 字典和code码一一对应
    this.libraryRule =
      dictionaryTree.lz_code?.map((item) => {
        return {
          name: item.name,
          code: item.code,
          description: item.description,
        };
      }) || [];
    console.log(this.libraryRule, 'this.libraryRule');
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
      const top = this.$refs.cooperation.getBoundingClientRect().top;
      this.cooperationHeight =
        window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight - top;
    },
    /**
     * @description val2输入框校验
     */
    handleRuleVal2(item) {
      const rule = [
        {
          validator: (rule, value, callback) => {
            console.log(item.code, '12121');
            if (item.code === 'LZ_FIR' || item.code === 'LZ_PRI_CON') {
              callback();
            } else if (value.trim() === '') {
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
     * @description 规则数据接口
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
