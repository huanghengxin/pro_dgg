import RelieveReleaseReason from './components/refusal-release-reason/index.vue';
import RelieveReason from './components/relieve-cooperation/index.vue';
import dayjs from 'dayjs';
import './index.scss';
import { get_list_by_role, get_relieve_timeout } from 'api/cooperation-in-page';
import SvgIcon from 'components/svg-icon';
import imChatMinixs from 'utils/mixins/imChatMinixs';
import { getQueryString } from 'utils/helper';
import stores from 'storejs';
export default {
  components: {
    RelieveReleaseReason,
    RelieveReason,
    SvgIcon,
  },
  mixins: [imChatMinixs],
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
  computed: {
    isManage() {
      return (item) => {
        console.log(1111111);
        const { receive = {}, sponsor = {} } = item;
        const teamManageId = stores.get('mchInfo')?.mchUserId;
        return teamManageId == receive.id || teamManageId == sponsor.id;
      };
    },
    canTalkOnline() {
      return (item) => {
        const { receive = {}, sponsor = {} } = item;
        const teamManageId = stores.get('mchInfo')?.mchUserId;
        console.log(teamManageId, sponsor.id, receive.id, 111111);
        return teamManageId == sponsor.id;
      };
    },
    isCurUser() {
      return stores.get('mchInfo')?.mchUserId == this.role.plannerId;
    },
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
    this.$eventBus.$on('reload-list', (flag, type) => {
      if (flag) {
        this.loadList(this.businessId, type);
        // console.log('如果flag为ture加载');
      }
    });
  },
  beforeDestroy() {
    this.$eventBus.$off('get-business-info');
    this.$eventBus.$off('reload-list');
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
     * @description 解除合作 根据合作状态打开拒绝合作联盟弹窗或拒绝原因弹窗
     */
    relieveCooperation(id) {
      console.log(id, 'id,');
      //解除合作联盟弹窗
      this.$refs.relieveReasonRef.openModal(id);
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
    /**
     * @description 在线聊
     */
    onlineTalk(item) {
      this.openImDialog(item);
    },
    /**
     * @description 在线聊
     */
    ringSomeOne(item) {
      this.openImDialog(item);
    },
    openImDialog(item) {
      const { receive, sponsor } = item;
      const curUserId = stores.get('mchInfo')?.mchUserId;
      let id = '';
      if (receive?.id == curUserId) {
        id = sponsor?.id;
      } else {
        id = receive?.id;
      }
      this.IMChatOpen({ userId: id }, 'userId');
    },
  },
};
