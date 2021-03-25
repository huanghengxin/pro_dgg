import RelieveReleaseReason from './components/refusal-release-reason/index.vue';
import RelieveReason from './components/relieve-cooperation/index.vue';
import dayjs from 'dayjs';
import './index.scss';
import { get_list_by_role } from 'api/cooperation-in-page';
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
      tooltip: '合作关系建立X天后，发起人解除合作无需合作接收方同意，请知晓。',
      businessId: '',
    };
  },
  computed: {
    isCurUser() {
      return stores.get('mchInfo')?.mchUserId == this.role.plannerId;
    },
  },
  created() {
    let query = new getQueryString();
    console.log(query, 'query');
    this.businessId = query.businessId;
    //进入页面获取维护人信息
    this.$eventBus.$emit('edit-on-submit_update-business-info');
    this.$eventBus.$on('get-business-info', (res) => {
      console.log(res, 'busiinessInfo');
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
        console.log('如果flag为ture加载');
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
    handleClick(tab) {
      if (tab.name == 'accendant') {
        //触发bussinessInfo组件调用接口获取商机详情
        this.$eventBus.$emit('edit-on-submit_update-business-info');
      } else {
        this.get_list_by_role(this.businessId);
      }
      console.log(this.businessId);
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
      console.log('刷新', this.businessId);
      this.get_list_by_role(id);
      //切换tab页
      this.activeName = type;
    },
    /**
     * @description 在线聊
     */
    onlineTalk(item) {
      console.log('在线聊', item);
      this.IMChatOpen({ userId: item.id }, 'userId');
    },
    /**
     * @description 在线聊
     */
    ringSomeOne(item) {
      console.log('提醒他', item);
      this.IMChatOpen({ userId: item.id }, 'userId');
    },
  },
};
