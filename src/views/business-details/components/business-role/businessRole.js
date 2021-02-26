import RelieveCooperation from './components/relieveCooperation/index.vue';
import RelieveReason from './components/RelieveReason/index.vue';
import dayjs from 'dayjs';
import './index.scss';
import { get_business_accendant, get_list_by_role } from 'api/cooperation-in-page';
export default {
  components: {
    RelieveCooperation,
    RelieveReason,
  },
  data() {
    return {
      activeName: 'accendant',
      role: {}, //维护人信息
      cooperationList: {}, //合作联盟数据
      tooltip: '合作关系建立X天后，发起人解除合作无需合作接收方同意，请知晓。',
    };
  },
  created() {
    this.get_business_accendant();
    this.$eventBus.$on('reload-list', (flag, type) => {
      if (flag) {
        this.loadList();
        this.activeName = type;
      }
    });
  },
  filters: {
    filterTime(val) {
      return val ? dayjs(val).format('MM-DD') : '';
    },
  },
  methods: {
    handleClick(tab) {
      console.log(tab.name);
      if (tab.name == 'accendant') {
        this.get_business_accendant();
      } else {
        this.get_list_by_role();
      }
    },
    /**
     * @description 获取维护人
     */
    get_business_accendant() {
      let params = {};
      get_business_accendant(params)
        .then((res) => {
          console.log(res, 'res');
          this.role = res.data;
        })
        .catch(() => {});
    },
    /**
     * @description 获取合作联盟数据
     */
    get_list_by_role() {
      let params = {};
      get_list_by_role(params)
        .then((res) => {
          const { data } = res;
          this.cooperationList = data;
          console.log(this.cooperationList, 'this.cooperationList');
        })
        .catch(() => {});
    },
    /**
     * @description 解除合作 根据合作状态打开拒绝合作联盟弹窗或拒绝原因弹窗
     */
    relieveCooperation(id) {
      console.log(id, 'id,');
      // if (coopState == 1) {
      //   //拒绝合作联盟弹窗
      this.$refs.relieveCooperationRef.openModal(id);
      // } else {
      //拒绝原因弹窗
      // this.$refs.relieveReasonRef.openModal(id);
      // }
    },
    /**
     * @description 供拒绝原因子组件刷新列表
     */
    loadList() {
      console.log('刷新');
      this.get_list_by_role();
    },
    /**
     * @description 在线聊
     */
    onlineTalk(id) {
      console.log('在线聊', id);
    },
    /**
     * @description 在线聊
     */
    ringSomeOne(id) {
      console.log('提醒他', id);
    },
  },
};
