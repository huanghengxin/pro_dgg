import ShowTooltip from 'components/show-tooltip';
import ListSearch from './components/list-search';
import SvgIcon from 'components/svg-icon';
import RefusalReleaseReason from '../components/../../business-details/components/business-role/components/refusal-release-reason/index.vue';
import InitiateCooperation from '../../business-details/components/initiate-cooperation/index.vue';
import { receiveCooperation } from 'api/cooperation-in-page';
import SearchButton from 'components/search-button';
import tabList from './constants';
import { store, actions, mutations } from './components/observable';
import { filterWithSecTime } from 'utils/helper'; // 使用日期过滤
import { getQueryString } from 'utils/helper';
import imChatMinixs from 'utils/mixins/imChatMinixs';
import commonMixins from './commonMixin';
import './index.scss';

export default {
  components: {
    ShowTooltip,
    SvgIcon,
    RefusalReleaseReason,
    SearchButton,
    ListSearch,
    InitiateCooperation,
  },
  mixins: [commonMixins, imChatMinixs], //控制列表元素显示
  provide() {
    return {
      parentLoadMore: this.loadMore,
    };
  },
  data() {
    return {
      activeName: '0',
      loading: false,
      confirmLoading: false, //确定接收合作 loading
      cooperationList: [], //合作联盟数据
      tabList: Object.freeze(tabList),
      date: '', //发起时间
    };
  },
  //路由跳转清空条件
  beforeRouteLeave(to, from, next) {
    mutations.clearFull();
    next();
    // ...
  },
  created() {
    let query = new getQueryString();
    if (query.active) {
      this.activeName = query.active;
    }
  },
  mounted() {},
  computed: {
    tableData() {
      return store.tableData;
    },
    statusType() {
      return store.activeTab == 0 ? 'receiveStatus' : 'buildStatus';
    },
    statusValue() {
      const value = store.fieldParams[store.activeTab];
      return value ? value[this.statusType] : undefined;
    },
    storeParam() {
      return store.params;
    },
    switchType() {
      return store.activeTab;
    },
  },
  filters: {
    filterTime(val) {
      return val ? filterWithSecTime(val) : '暂无';
    },
  },
  methods: {
    //跳转发起合作
    tocooperation() {
      this.$router.push('/initiate-cooperation-in-page');
    },

    //在线聊
    onlineTalk(item) {
      this.$set(item, 'customerId', item.id);
      console.log('在线聊', item);
      this.IMChatOpen(item);
    },
    //提醒他（她）
    remindSomeBody(id) {
      console.log('提醒他（她）', id);
    },

    //查看商机
    checkBusiness(id) {
      this.$router.push(`/my-business/business-details?businessId=${id}`);
    },

    /**
     * @description 排序查询
     */
    sortList(val) {
      mutations.setParams('sortList', val);
    },
    /**
     * @description 清除排序选中
     */
    clearSort() {
      this.$refs.tableRef.clearSort();
    },
    /**
     * @description 接受合作
     */
    listHandleClick(id) {
      const param = {
        id,
      };
      this.$messageBox
        .confirm('请确认是否接收合作联盟？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          customClass: 'message-box-min-height',
          closeOnClickModal: false,
        })
        .then(() => {
          receiveCooperation(param).then((res) => {
            const { code, message } = res;
            if (code === 200) {
              this.$message({
                type: 'success',
                message: '接收成功!',
              });
              if (this.cooperationList?.length == 1 && this.storeParam.page != 1) {
                mutations.setParams('Current');
                return;
              }
              actions.getDataList();
            } else {
              this.$message.warning(message);
            }
          });
        });
    },
    /**
     * @description 拒绝合作
     */
    refuseCooperation(id) {
      console.log(id, 'id');
      this.$refs.refusalReleaseReasonRef.openModal(id);
    },
    //拒绝组件提交后刷新列表
    listRefresh() {
      actions.getDataList();
    },
    /**
     * @description 再次发起合作
     */
    againInitiate(row) {
      if (row.bizId) {
        this.$refs.initiateCooperationRef.openModal({ id: row.bizId });
      } else {
        this.$router.push({ path: `/initiate-cooperation-in-page`, params: row });
        // this.$eventBus.$emit('again-initaite-row', row);
        mutations.setBackInfo(row);
      }
    },

    /**
     * @description 分页
     */
    handleSizeChange(val) {
      mutations.setParams('Size', val);
    },
    handleCurrentChange(val) {
      mutations.setParams('Current', val);
    },
  },
};
