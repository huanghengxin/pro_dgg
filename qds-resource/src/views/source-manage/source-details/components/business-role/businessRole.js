import dayjs from 'dayjs';
import './index.scss';
import { get_list_by_role, get_relieve_timeout } from 'api/source-details';
import SvgIcon from 'components/svg-icon';
import { getQueryString } from 'utils/helper';
export default {
  components: {
    SvgIcon,
  },
  inject: ['permissionType'],
  data() {
    return {
      activeName: 'accendant',
      role: {}, //维护人信息
      accendantLoading: false, //维护人
      loading: false, //合作联盟
      cooperationList: [], //合作联盟数据
      tooltip: 0,
      businessId: '',
    };
  },
  created() {
    let query = new getQueryString();
    this.businessId = query.businessId;
    //进入页面获取维护人信息
    this.$eventBus.$on('get-business-info', (res) => {
      this.accendantLoading = true;
      if (!res) {
        this.role = res || {};
      } else {
        this.role = res;
        this.accendantLoading = false;
      }
    });
  },
  beforeDestroy() {
    this.$eventBus.$off('get-business-info');
  },
  filters: {
    filterTime(val) {
      return val ? dayjs(val).format('MM-DD') : '--';
    },
  },
  methods: {
    getTimeOutNum() {
      get_relieve_timeout().then((res) => {
        if (!res) return;
        const { code, data } = res;
        if (code === 200) {
          this.tooltip = data;
        }
      });
    },
    handleClick(tab) {
      if (tab.name == 'Partners') {
        this.getTimeOutNum();
        if (!this.businessId) return;
        this.get_list_by_role(this.businessId);
      }
    },
    /**
     * @description 获取合作联盟数据
     */
    get_list_by_role(id) {
      let params = { id };
      this.loading = true;
      get_list_by_role(params)
        .then((res) => {
          const { code, data, message } = res;
          if (code == 200) {
            this.cooperationList = Array.isArray(data) ? data : [];
            console.log(this.cooperationList, 'this.cooperationList12366');
          } else {
            this.$message.warning(message);
          }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },

    /**
     * @description 供拒绝原因子组件刷新列表
     */
    loadList(id, type) {
      if (!id) return;
      this.get_list_by_role(id);
      //切换tab页
      this.activeName = type;
    },
  },
};
