import './index.scss';
import ShowTooltip from 'components/show-tooltip';
import store from 'storejs';
import SvgIcon from 'components/svg-icon';
import WriteFollowRecord from '../../my-business/components/write-follow-record';
import LibraryRecords from '../components/library-records';
import { biz_business_list, get_common_lib_menu, pickUp } from 'api/cule';
import MoreRequire from 'views/dynamic-business/components/more-require';
import callMixins from 'utils/mixins/callMixins';
import NeedsDetailsDialog from '../../cule/components/needs-details-dialog';
import ShowMoreRequire from 'views/dynamic-business/components/show-more-require';
export default {
  components: {
    ShowTooltip,
    WriteFollowRecord,
    LibraryRecords,
    SvgIcon,
    MoreRequire,
    ShowMoreRequire,
    NeedsDetailsDialog,
  },
  filters: {
    statusFormat(val) {
      const map = {
        LZ_PRI_CON: '未连跟',
        LZ_PRI_SAC: '未签单',
        LZ_PUB_INV: '手动无效',
        LZ_PUB_GRO: '部门库未拾回',
        LZ_PUB_MER: '商户库未拾回',
        LZ_PUB_BRA: '品牌库未拾回',
        RULE_LZ_PUBLIC_TRANSFER_MOVE: '移交商机跟进',
      };
      return map[val];
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
      fromType: 'public-library',
      loading: false,
      belongTo: [
        { name: '不限', code: 'UNLIMITED', ext1: '' },
        { name: '我自己', code: 'MYSELF', ext1: '' },
      ], //原始维护人
      screeningItems: {},
      active: {
        belongIndex: 0,
        gradeIndex: 0,
        caseIndex: 0,
        enterTimeIndex: 0,
        needIndex: 0,
      },
      publicLibraryList: [], //列表数据
      total: 0,
      param: {
        pageNum: 1,
        pageSize: 10,
        orderType: 'inTimeAsc', //排序
        productClass: 'PRO_CLASS_TYPE_TRANSACTION',
      },
      userId: '',
      timeId: '',
    };
  },
  created() {
    // 库层级
    this.getDictionary();
    this.getPublicLibraryList(this.param);
    this.userId = store.get('mchInfo')?.mchUserId || '';
  },
  mounted() {},
  methods: {
    /**
     * @description 打电话需要刷新页面方法
     */
    flowRefresh() {
      this.resetList(true);
    },
    /**
     * @description 点击需求弹出详情弹窗
     */
    handleNeedDetails(id) {
      this.$refs.needsDetailsDialog.openModal(id);
    },
    /**
     * @description 刷新列表
     */
    resetList(val) {
      this.timeId = setTimeout(() => {
        if (this.publicLibraryList?.length == 1 && this.param.pageNum != 1 && val) {
          this.param.pageNum--;
        }
        this.getPublicLibraryList(this.param);
        this.timeId = null;
      }, 2000);
    },
    /**
     * @description 点击更多-加载更多
     */
    loadMore(val) {
      this.$refs.showMoreRequireRefs.openModal(val);
    },
    /**
     * @description 数据字典线索来源
     */
    async getDictionary(code) {
      const param = {
        treeCode: code,
      };
      const result = await get_common_lib_menu(param);
      if (result.code !== 200) {
        this.$message.warning(result.message);
        return;
      }
      if (result.code === 200) {
        this.screeningItems = result.data || {};
      }
    },
    /**
     * @description 排序查询
     */
    sortList(val) {
      const map = {
        enterTime: {
          descending: 'inTimeDesc',
          ascending: 'inTimeAsc',
        },
        getTime: {
          descending: 'inTimeDesc',
          ascending: 'getTimeAsc',
        },
      };
      this.param.orderType = map[val.prop][val.order] || '';
      this.getPublicLibraryList(this.param);
    },
    /**
     * @description 筛选所属人
     */
    changeBelong(item, index) {
      if (item.code === 'UNLIMITED') {
        this.param.plannerId = '';
      }
      if (item.code === 'MYSELF') {
        this.param.plannerId = this.userId;
      }
      this.param.pageNum = 1;
      this.active.belongIndex = index;
      this.sortClear();
      this.getPublicLibraryList(this.param);
    },
    /**
     * @description  筛选项统一方法
     */
    filterTag(item, index, field) {
      const map = {
        bizLibrary: 'gradeIndex',
        inLabraryType: 'caseIndex',
        inLabraryTime: 'enterTimeIndex',
        productClass: 'needIndex',
      };

      this.param[field] = item.ext1;
      this.active[map[field]] = index;
      this.param.pageNum = 1;
      this.sortClear();
      this.getPublicLibraryList(this.param);
    },

    /**
     * @description 筛选清空排序
     */
    sortClear() {
      this.$refs.tableRef.clearSort();
      this.param.orderType = 'inTimeAsc';
    },
    /**
     * @description 点击操作栏下拉选
     */
    handleCommand(command) {
      switch (command.component) {
        case 'callPhoneRef':
          this.callMixins('bus', command.item, 'one');
          break;
        default:
          this.$refs.libraryRecordsRef.openModal(command.item, this.fromType);
          break;
      }
    },
    listHandleClick(row) {
      this.handOver(row.id);
    },
    /**
     * @description 单个拾回请求接口
     */
    handOver(id) {
      const param = {
        bizId: id,
      };
      this.$messageBox
        .confirm('请确定拾回此商机, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          customClass: 'message-box-min-height',
          closeOnClickModal: false,
        })
        .then(() => {
          pickUp(param)
            .then((res) => {
              if (res.code === 200) {
                this.$message.success('操作成功');
                this.resetList(true);
              } else {
                this.$message.warning(res.message);
              }
            })
            .catch(() => {
              this.loading = false;
            });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消拾回!',
          });
        });
    },
    /**
     * @description 潜在客户列表数据
     */
    getPublicLibraryList(param) {
      this.loading = true;
      biz_business_list(param)
        .then((result) => {
          if (result.code === 200) {
            this.total = result.data.totalCount * 1;
            this.publicLibraryList = result.data.records;
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
      this.param.pageSize = val;
      this.param.pageNum = 1;
      this.getPublicLibraryList(this.param);
    },
    handleCurrentChange(val) {
      this.param.pageNum = val;
      this.getPublicLibraryList(this.param);
    },
  },
  beforeDestroy() {
    clearTimeout(this.timeId);
  },
};
