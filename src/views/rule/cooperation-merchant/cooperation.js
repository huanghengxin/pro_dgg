import './index.scss';
import ShowTooltip from 'components/show-tooltip';

import { queryTreeBook } from 'api/rule';
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
    };
  },
  computed: {},
  async created() {
    this.loading = true;
    // 后台
    const dictionaryTree = (await this.getDictionary()) || {};
    this.unitCode = dictionaryTree.rule_date_code || [];
    // 库流转规则
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
     * @description 数据字典接口
     */
    async getDictionary() {
      try {
        const param = {
          code: 'rule_code',
        };
        const result = await queryTreeBook(param);
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
  },
};
