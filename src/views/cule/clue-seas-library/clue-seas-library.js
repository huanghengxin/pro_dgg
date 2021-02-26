import MoreRequire from 'views/dynamic-business/components/more-require';
import ShowMoreRequire from 'views/dynamic-business/components/show-more-require';
import FilterTime from 'utils/filter-time'; // 使用日期过滤
import ShowTooltip from 'components/show-tooltip';
import LibraryRecords from '../components/library-records';
import SvgIcon from 'components/svg-icon';
import { get_high_seas_library_lists, pick_up_clue } from 'api/cule';
import { get_dictionary_data_by_parent_code } from 'api/common';
import MultipCuleRetrieveDialog from '../components/multip-cule-retrieve-dialog';
import callMixins from 'utils/mixins/callMixins';

export default {
  name: 'ClueSeasLibrary',
  components: {
    ShowTooltip,
    MultipCuleRetrieveDialog,
    LibraryRecords,
    SvgIcon,
    ShowMoreRequire,
    MoreRequire,
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
      len: 3,
      moreNeed: [],
      fromType: 'clue-seas-library',
      loading: false,
      multipleSelectionId: [],
      selectedIds: [],
      enterTimeList: [], //进库时间筛选
      enterTimeIndex: 0,
      publicLibraryList: [], //列表数据
      total: 0,
      count: 0,
      param: {
        start: 1,
        limit: 10,
        startTime: '', //判断开始时间
        endTime: '', //判断结束时间
      },
      timeId: '',
    };
  },
  watch: {
    multipleSelectionId: {
      handler(val, oldval) {
        if (val.length > 0) {
          this.$eventBus.$emit('aside-call-up', val, this.selectedIds);
        } else {
          this.$eventBus.$emit('aside-call-up', val);
        }
      },
      immediate: true,
      deep: true,
    },
  },
  created() {
    this.getSeasLibraryList(this.param);
    // 数据字典
    this.getDictionary('QDS_PAGE_TIME_SEARCH_ONE');
  },
  mounted() {},
  methods: {
    /**
     * @description 打电话需要刷新页面方法
     */
    flowRefresh() {
      this.recordsResetList(true);
    },
    /**
     * @description 更多需求
     */
    loadMore(val) {
      this.$refs.showMoreRequireRefs.openModal(val);
    },
    /**
     * @description
     */
    // recordsResetList(val) {
    //   if (this.publicLibraryList?.length == 1 && this.param.start != 1 && val) {
    //     this.param.start--;
    //   }
    //   setTimeout(() => {
    //     this.getSeasLibraryList(this.param);
    //   }, 2000);
    // },
    resetList(val) {
      this.timeId = setTimeout(() => {
        if (
          this.publicLibraryList?.length == 1 &&
          this.param.start != 1 &&
          val?.success == this.param.pageNum
        ) {
          this.param.start--;
        }
        this.getSeasLibraryList(this.param);
        this.timeId = null;
      }, 2000);
    },
    /**
     * @description 数据字典线索来源
     */
    async getDictionary(code) {
      const param = {
        parentCode: code,
      };
      const result = await get_dictionary_data_by_parent_code(param).catch(() => {
        this.loading = false;
      });

      if (result.code === 200) {
        this.enterTimeList = result.data || [];
      } else {
        this.$message.warning(result.message);
      }
    },
    /**
     * @description 排序查询
     */
    sortList(val) {
      const map = {
        lastRemarkTime: '2',
      };
      if (map[val.prop]) {
        console.log(val, 'val');
        if (val.order) {
          this.param.orderBy = map[val.prop];
          this.param.isAsc = val.order === 'descending' ? 1 : 0;
        } else {
          this.param.orderBy = '2';
          this.param.isAsc = 0;
        }
      }
      this.getSeasLibraryList(this.param);
    },
    /**
     * @description 清楚排序
     */
    sortClear() {
      this.$refs.tableRef.clearSort();
      this.param.isAsc = 0;
      this.param.orderBy = '2';
    },
    /**
     * @description 进库时间筛选
     * @param {String} 点击的选项
     */
    changeEnterTime(item, index) {
      this.enterTimeIndex = index;
      if (item.ext2) {
        const result = new FilterTime(item.ext2).time;
        this.param.startTime = result[0];
        this.param.endTime = result[1];
        this.param.start = 1;
      } else {
        this.param.startTime = '';
        this.param.endTime = '';
        this.param.start = 1;
      }
      this.sortClear();
      this.getSeasLibraryList(this.param);
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
     * @description 点击操作栏下拉选项项
     */
    handleCommand(command) {
      switch (command.component) {
        case 'callPhoneRef':
          this.callPhone(command.item);
          break;
        case 'remarkRef':
          this.$refs['libraryRecordsRef'].openModal(command.item, this.fromType);
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
                  `/add-business?clueId=${command.item.id}&type=QDS_ClUE_SOURCE_HIGH_SEAS`,
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
     * @description 点击事件，打开弹层
     * @param {Object} 当前点击行
     */
    listHandleClick(row) {
      this.handOver(row.id);
    },
    /**
     * @description 单个拾回请求接口
     */
    handOver(id) {
      const param = {
        clueId: id,
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
          pick_up_clue(param)
            .then((res) => {
              if (res.code === 200) {
                if (this.publicLibraryList?.length == 1 && this.param.start != 1) {
                  this.param.start--;
                }
                this.resetList();
                this.$message({
                  type: 'success',
                  message: '拾回成功!',
                });
              } else {
                this.$message.warning(res.message);
              }
            })
            .catch(() => {
              this.loading = false;
            });
        })
        .catch(() => {
          this.loading = false;
          this.$message({
            type: 'info',
            message: '取消拾回!',
          });
        });
    },
    /**
     * @description 潜在客户列表数据
     */
    getSeasLibraryList(param) {
      this.loading = true;
      get_high_seas_library_lists(param)
        .then((result) => {
          if (result.code === 200) {
            this.total = result.data.totalCount * 1;
            this.publicLibraryList = result.data.records;
            this.loading = false;
          } else {
            this.$message.warning(result.message);
            this.loading = false;
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
      this.getSeasLibraryList(this.param);
    },
    handleCurrentChange(val) {
      this.param.start = val;
      this.getSeasLibraryList(this.param);
    },
    /**
     * @description 全选
     */
    selectAllClick(row) {
      if (this.limit <= 50) {
        this.multipleSelectionId = row?.map(function(val) {
          return val.id;
        });
      } else {
        const arr = row.slice(50);
        arr?.forEach((row) => {
          this.$refs.tableRef.toggleRowSelection(row);
        });
      }
    },
    /**
     * @description 多选
     */
    handleSelectionChange(val) {
      this.multipleSelectionId = val.map(function(val) {
        return val.id;
      });
    },
    /**
     * @description 点击批量拾回
     */
    multiplCuleHandleRetrieve() {
      if (this.multipleSelectionId.length === 0) {
        this.$message({
          message: '批量拾回最少选择1条线索！',
          type: 'warning',
        });
        return;
      }
      this.$refs['multipCuleRetrieveDialog'].openModal(this.multipleSelectionId);
    },
  },
  beforeDestroy() {
    clearTimeout(this.timeId);
  },
};
