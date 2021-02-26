import MoreRequire from 'views/dynamic-business/components/more-require';
import ShowMoreRequire from 'views/dynamic-business/components/show-more-require';
import ShowTooltip from 'components/show-tooltip';
import WriteFollowDailog from './components/write-follow-dailog';
import MoreFollowRecord from './components/more-follow-record';
import SvgIcon from 'components/svg-icon';
import NoAttention from 'views/my-business/components/no-attention';
import callMixins from 'utils/mixins/callMixins';
import { filterTime as filterTimeDate } from 'utils/helper'; // 使用日期过滤
import { get_my_potential_customer_lists } from 'api/cule';
import SearchButton from 'components/search-button';
import {
  CULE_SOURCE_LIST,
  QDS_ClUE_SOURCE_STAY_LIST,
  QDS_ClUE_SOURCE_IM_LIST,
} from './constants.js';
export default {
  components: {
    ShowTooltip,
    WriteFollowDailog,
    MoreFollowRecord,
    SvgIcon,
    ShowMoreRequire,
    MoreRequire,
    NoAttention,
    SearchButton,
  },
  filters: {
    statusFormat(val) {
      const map = {
        QDS_ClUE_STATUS_NOT: '未联系',
        QDS_ClUE_STATUS_ALREADY: '已联系',
      };
      return map[val];
    },
    filterTime(val) {
      return val ? filterTimeDate(val) : '';
    },
  },
  mixins: [callMixins],
  provide() {
    return {
      parentLoadMore: this.loadMore,
    };
  },

  data() {
    return {
      dialogVisible: false,
      loading: false,
      clueSourceList: [], //线索来源数据字典
      clueSearchList: [],
      potentialCustomerList: [
        {
          customerName: '张超',
          keep2: '薯片app电话',
          keep: '公海库拾回',
          customerPhone: '15008209695',
        },
      ], //列表数据
      total: 0,
      param: {
        start: 1,
        limit: 10,
        clueSourceType: 'QDS_ClUE_SOURCE_STAY',
        clueStatus: 'QDS_ClUE_STATUS_NOT',
        clueImpower: '',
        orderBy: '1', //排序字段 orderBy
        isAsc: 0,
      },
    };
  },
  computed: {
    curTabFilter() {
      const map = {
        QDS_ClUE_SOURCE_STAY: QDS_ClUE_SOURCE_STAY_LIST,
        QDS_ClUE_SOURCE_IM: QDS_ClUE_SOURCE_IM_LIST,
      };
      return map[this.param.clueSourceType];
    },
  },
  watch: {
    'param.clueSourceType': {
      handler: function (val, oldval) {
        if (val === 'QDS_ClUE_SOURCE_IM') {
          this.param.clueImpower = 'QDS_ClUE_IMPOWER_NOT';
          this.param.clueStatus = 'QDS_ClUE_STATUS_NOT';
        } else {
          this.param.clueImpower = '';
          this.param.clueStatus = 'QDS_ClUE_STATUS_NOT';
        }
        this.getTeamBusyList(this.param);
      },
    },
  },
  created() {
    this.clueSourceList = Object.freeze(CULE_SOURCE_LIST);
    this.getTeamBusyList(this.param);
  },
  mounted() {},
  methods: {
    onActiveHandle(val) {
      this.param[val[1]] = val[0];
      this.param.pageNum = 1;
      this.sortClear();
      this.getTeamBusyList(this.param);
    },
    /**
     * @description  筛选项统一方法
     */
    filterTag(item, field) {
      this.param[field] = item.code;
      this.param.pageNum = 1;
      this.sortClear();
      if (field === 'clueSourceType') return;
      this.getTeamBusyList(this.param);
    },
    /**
     * @description 搜索按钮
     */
    searchUser(params) {
      this.param.start = 1;
      this.sortClear();
      this.param.bizNo = params.bizNo;
      this.param.customerName = params.customerName;
      this.param.phoneNo = params.phoneNo;
      this.getTeamBusyList(this.param);
    },
    /**
     * @description 监听输入框清空
     */
    handleInputValue(content) {
      if (content == '') {
        this.sortClear();
        this.param.customerName = undefined;
        this.param.phoneNo = undefined;
        this.param.bizNo = undefined;
        this.getTeamBusyList(this.param);
      }
    },
    /**
     * @description 点击更多-加载更多
     * @param {Object}
     */
    loadMore(val) {
      this.$refs.showMoreRequireRefs.openModal(val);
    },
    /**
     * @description 监听子组件的事件跟进响应成功后刷新列表
     */
    submitHandle() {
      if (
        this.param.clueStatus === 'QDS_ClUE_STATUS_NOT' &&
        this.potentialCustomerList?.length == 1 &&
        this.param.start != 1
      ) {
        this.param.start--;
      }
      this.getTeamBusyList(this.param);
    },
    /**
     * @description 排序查询
     */
    sortList(val) {
      // 排序获取时间和最新公斤信息
      const map = {
        lastRemarkTime: '1',
      };
      if (map[val.prop]) {
        if (val.order) {
          this.param.orderBy = map[val.prop];
          this.param.isAsc = val.order === 'descending' ? 1 : 0;
        } else {
          this.param.orderBy = '1';
          this.param.isAsc = 0;
        }
      }
      this.getTeamBusyList(this.param);
    },
    /**
     * @description 清楚排序
     */
    sortClear() {
      this.$refs.tableRef.clearSort();
      this.param.isAsc = 0;
      this.param.orderBy = '1';
    },
    /**
     * @description 线索来源
     * @param {String} 点击的选项
     */
    changeCuleFrom(item) {
      this.param.clueSourceType = item.code;
      this.activeTabField = item.code;
      this.param.start = 1;
      this.getTeamBusyList(this.param);
    },

    /**
     * @description 打电话需要刷新页面方法
     */
    flowRefresh() {
      this.submitHandle();
    },
    /**
     * @description 刷新
     */
    onSubmitHandle(val) {
      if (val === 'CULE_WXSJ' && this.potentialCustomerList?.length == 1 && this.param.start != 1) {
        this.param.start--;
      } else {
        this.getTeamBusyList(this.param);
      }
    },
    /**
     * @description 框架上打电话方法
     * @param {String} 商机id
     */
    callPhone(item) {
      if (item && item.customerPhone) {
        this.callMixins('clue', item, 'one');
      } else {
        this.$message.warning('该线索未授权电话号码');
      }
    },
    /**
     * @description 写跟进点击事件，打开弹层
     * @param {Object} 当前点击行
     */
    listHandleClick(row) {
      this.$refs['writeFollowDailogRef'].openModal(row, this.param.clueSourceType);
    },
    /**
     * @description 在线聊
     */
    listChatClick(row) {
      console.log(row);
    },
    /**
     * @description 无效线索
     */
    invalidCule(row) {
      console.log(row);
    },
    /**
     * @description 点击操作栏下拉选项
     * @param {String} 点击的选项
     */
    handleCommand(command) {
      switch (command.component) {
        case 'handleFollowRef':
          this.listHandleClick(command.item);
          break;
        case 'callPhoneRef':
          this.callPhone(command.item);
          break;
        case 'noAttentionRef':
          this.$refs.noAttentionRef.openModal(command.item);
          break;
        default:
          if (command.item && command.item.customerPhone) {
            this.$messageBox
              .confirm('您是否继续转商机?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                customClass: 'message-box-min-height',
              })
              .then(() => {
                this.$router.push(
                  `/add-business?clueId=${command.item.id}&type=${this.param.clueSourceType}`,
                );
              })
              .catch(() => {
                this.$message({
                  type: 'info',
                  message: '已取消转商机!',
                });
              });
          } else {
            this.$message({
              type: 'warning',
              message: '该线索用户未授权，不能跳转商机!',
            });
          }
          break;
      }
    },
    /**
     * @description 更多更近
     *
     * @param {Object} 当前点击行
     */
    hanleMoreRemark(row) {
      this.$refs['moreFollowRecordRef'].openModal(row);
    },

    /**
     * @description 潜在客户列表数据
     * @returns {Object} 返回数据
     */
    getTeamBusyList(param) {
      this.loading = true;
      get_my_potential_customer_lists(param)
        .then((result) => {
          if (result.code === 200) {
            this.total = result.data.totalCount * 1;
            // this.potentialCustomerList = result.data.records;
            this.loading = false;
          } else {
            this.loading = false;
            this.$message.warning(result.message);
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
    /**
     * @description 分页
     */
    handleSizeChange(val) {
      this.param.limit = val;
      this.param.start = 1;
      this.getTeamBusyList(this.param);
    },
    handleCurrentChange(val) {
      this.param.start = val;
      this.getTeamBusyList(this.param);
    },
  },
};
