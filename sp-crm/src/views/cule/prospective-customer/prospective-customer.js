import MoreRequire from 'views/dynamic-business/components/more-require';
import ShowMoreRequire from 'views/dynamic-business/components/show-more-require';
import ShowTooltip from 'components/show-tooltip';
import LibraryRecords from '../components/library-records';
import MoreFollowRecord from './components/more-follow-record';
import SvgIcon from 'components/svg-icon';
import NoAttention from 'views/my-business/components/no-attention';
import { filterTime as filterTimeDate } from 'utils/helper'; // 使用日期过滤
import { get_my_potential_customer_lists, check_customer_is_exist } from 'api/cule';
import SearchButton from 'components/search-button';

import callMixins from 'utils/mixins/callMixins';
import imChatMinixs from 'utils/mixins/imChatMinixs';
import {
  CLUE_SOURCE_LIST,
  QDS_CLUE_SOURCE_STAS_LIST,
  QDS_CLUE_SOURCE_IM_LIST,
} from './constants.js';
export default {
  components: {
    LibraryRecords,
    ShowTooltip,
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
        QDS_CLUE_STATUS_NOT: '未联系',
        QDS_CLUE_STATUS_ALREADY: '已联系',
      };
      return map[val];
    },
    filterTime(val) {
      return val ? filterTimeDate(val) : '';
    },
  },
  mixins: [callMixins, imChatMinixs],
  provide() {
    return {
      parentLoadMore: this.loadMore,
    };
  },

  data() {
    return {
      loading: false,
      clueSourceList: [], //线索来源数据字典
      potentialCustomerList: [], //列表数据
      total: 0,
      clueSourceTypeActive: 'QDS_CLUE_SOURCE_SEAS',
      param: {
        start: 1,
        limit: 10,
        clueSourceType: 'QDS_CLUE_SOURCE_SEAS',
        clueStatus: 'QDS_CLUE_STATUS_NOT',
        accredit: '',
        orderBy: '1', //排序字段 orderBy
        isAsc: 0,
      },
    };
  },
  computed: {
    curTabFilter() {
      const map = {
        QDS_CLUE_SOURCE_SEAS: QDS_CLUE_SOURCE_STAS_LIST,
        QDS_CLUE_SOURCE_IM: QDS_CLUE_SOURCE_IM_LIST,
      };
      return map[this.param.clueSourceType];
    },
  },
  created() {
    this.clueSourceList = Object.freeze(CLUE_SOURCE_LIST);
    this.getClueList(this.param);
  },
  mounted() {},
  methods: {
    onActiveHandle(val) {
      this.param[val[1]] = val[0];
      this.sortClear();
      this.getClueList(this.param);
    },
    /**
     * @description  筛选项统一方法
     */
    filterTag(item, field) {
      if (this.loading) {
        this.$message.info('切换太频繁，请稍后再试');
        return;
      }
      if (item.code === 'QDS_CLUE_SOURCE_IM') {
        this.param.accredit = 'NO';
        this.param.clueStatus = 'QDS_CLUE_STATUS_NOT';
        this.clueSourceTypeActive = 'QDS_CLUE_SOURCE_IM';
      } else if (item.code === 'QDS_CLUE_SOURCE_SEAS') {
        this.param.accredit = '';
        this.param.clueStatus = 'QDS_CLUE_STATUS_NOT';
        this.clueSourceTypeActive = 'QDS_CLUE_SOURCE_SEAS';
      }
      this.param[field] = item.code;
      this.sortClear();
      this.getClueList(this.param);
    },
    /**
     * @description 搜索按钮
     */
    searchUser(params) {
      if (this.clueSourceTypeActive === 'QDS_CLUE_SOURCE_IM') {
        this.param.accredit = 'NO';
        this.param.clueStatus = 'QDS_CLUE_STATUS_NOT';
      } else if (this.clueSourceTypeActive === 'QDS_CLUE_SOURCE_SEAS') {
        this.param.accredit = '';
        this.param.clueStatus = 'QDS_CLUE_STATUS_NOT';
      }

      this.sortClear();
      this.param.keyword = params.keyword;
      this.param.keywordType = params.keywordType;
      this.getClueList(this.param);
    },
    /**
     * @description 监听输入框清空
     */
    handleInputValue(content) {
      if (content == '') {
        this.sortClear();
        this.param.keyword = '';
        this.param.keywordType = '';
        this.getClueList(this.param);
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
     * @description 排序查询
     */
    sortList(val) {
      // 排序获取时间和最新公斤信息
      const map = {
        updateTime: '1',
        lastRemarkTime: '2',
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
      this.getClueList(this.param);
    },
    /**
     * @description 清楚排序
     */
    sortClear() {
      this.$refs.tableRef.clearSort();
      this.param.start = 1;
      this.param.isAsc = 0;
      this.param.orderBy = '1';
    },
    /**
     * @description 打电话需要刷新页面方法
     */
    flowRefresh() {
      this.submitHandle();
    },
    /**
     * @description 监听子组件的事件跟进响应成功后刷新列表 留资线索无效和写跟进后未联系
     */
    submitHandle(val) {
      if (
        (this.param.clueSourceType === 'QDS_CLUE_SOURCE_SEAS' ||
          this.param.clueStatus === 'QDS_CLUE_STATUS_NOT') &&
        this.potentialCustomerList?.length == 1 &&
        this.param.start != 1
      ) {
        this.param.start--;
      }
      this.getClueList(this.param);
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
      this.$refs['libraryRecordsRef'].openModal(row, this.param.clueSourceType);
    },
    /**
     * @description 在线聊
     */
    onlineChatClick(row) {
      this.IMChatOpen(row.item);
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
        case 'IMchat':
          // 在线聊
          this.IMChatOpen(command.item.item);
          break;
        case 'noAttentionRef':
          this.$refs.noAttentionRef.openModal(command.item);
          break;
        default:
          // 转商机判断是否授权
          if (command.item && command.item.customerPhone) {
            const param = {
              customerId: command.item.customerId,
            };
            check_customer_is_exist(param).then((res) => {
              if (res.code !== 200) {
                this.loading = false;
                this.$message.warning(res.message);
                return;
              }
              if (res.code === 200) {
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
              }
            });
          } else {
            this.$message({
              type: 'warning',
              message: '该线索用户未授权，不能跳转商机!',
            });
            return;
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
     * @description 潜在客户列表
     * @returns {Object} 返回数据
     */
    getClueList(param) {
      this.loading = true;
      get_my_potential_customer_lists(param)
        .then((result) => {
          if (result.code === 200) {
            this.total = result.data.totalCount * 1;
            this.potentialCustomerList = result.data.records;
          } else {
            this.$message.warning(result.message);
          }
          this.loading = false;
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
      this.getClueList(this.param);
    },
    handleCurrentChange(val) {
      this.param.start = val;
      this.getClueList(this.param);
    },
  },
};
