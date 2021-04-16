import ShowTooltip from 'components/show-tooltip';
import ListSearch from './components/list-search';
import { get_business_info } from 'api/business-details';
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
import stores from 'storejs';
import './index.scss';

export default {
  name: 'CooperationAllianceClients',
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
      confirmLoading: false, //确定接收合作 loading
      cooperationList: [], //合作联盟数据
      tabList: Object.freeze(tabList),
      date: '', //发起时间
      actived: -1, //激活颜色
    };
  },

  destroyed() {
    //路由跳转清空条件
    mutations.clearFull();
  },
  created() {
    // let query = new getQueryString();
    // if (query.active) {
    //   this.activeName = query.active;
    // }
  },

  mounted() {},
  computed: {
    cooperationStatus() {
      let cooperationStr = '';
      return (item) => {
        if (item.dissolutionStatus == 3) {
          if (item.status == 2) {
            cooperationStr = '合作成功';
          } else {
            cooperationStr = '已解散';
          }
        } else {
          cooperationStr = '合作中';
        }
        return cooperationStr;
      };
    },
    tableData() {
      return store.tableData;
    },
    loading() {
      return store.loading;
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
      this.openImDialog(item);
    },
    //提醒他（她）
    remindSomeBody(item) {
      console.log(item);
      this.openImDialog(item);
    },
    //打开Im弹框
    openImDialog(item) {
      if (!item.id) return;
      const { sponsorUserId, receiveUserId } = item;
      const curUserId = stores.get('mchInfo')?.mchUserId;
      let id = '';
      if (sponsorUserId == curUserId) {
        id = receiveUserId;
      } else {
        id = sponsorUserId;
      }
      this.IMChatOpen({ userId: id }, 'userId');
    },
    //查看商机
    checkBusiness(row) {
      if (row.dissolutionStatus == 3) {
        this.$message.warning('合作关系已解散，无法查看商机详情');
      } else {
        this.$router.push(`/my-business/business-details?businessId=${row.bizId}`);
      }
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
            } else {
              this.$message.warning(message);
            }
            actions.getDataList();
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
    jumpPage(row) {
      this.$router.push({ path: `/initiate-cooperation-in-page`, params: row });
      mutations.setBackInfo(row);
    },
    //拒绝组件提交后刷新列表
    listRefresh() {
      actions.getDataList();
    },
    /**
     * @description 再次发起合作
     */
    async againInitiate(row, index) {
      console.log(row, 'row');
      if (this.actived > -1) return;
      if (row.bizId) {
        const data = await this.getBusinessInfo(row.bizId, index); //商机详情
        if (data) {
          if (data.plannerId === stores.get('mchInfo')?.mchUserId) {
            this.$refs.initiateCooperationRef.openModal(row, data, 'list');
            this.actived = -1;
          } else {
            this.jumpPage(row);
          }
        } else {
          // this.$router.push({ path: `/initiate-cooperation-in-page` });
          this.jumpPage(row);
        }
      } else {
        this.jumpPage(row);
      }
    },
    /**
     * @description 获取商机基本信息
     */
    async getBusinessInfo(bizId, index) {
      try {
        const params = { bizId: bizId };
        this.actived = index;
        const res = await get_business_info(params);
        const { code, data } = res;
        if (code === 200) {
          return data ? data : undefined;
        } else {
          // this.$message.warning(message);
        }
        this.actived = -1;
      } catch (error) {
        this.actived = -1;
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
