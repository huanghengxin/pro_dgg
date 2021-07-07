import { find_tree_book_list, get_search, list_biz_status, get_biz_by_id } from 'api/common';
import { get_allocated_record_list, export_allocated_record_list } from 'api/source-manage';
import { ALLOCATION_WAY } from 'constants/constants';
import DropSelect from 'components/drop-select';
import SvgIcon from 'components/svg-icon';
import ShowTooltip from 'components/show-tooltip';
import EditSource from '../components/edit-source/index.vue';
import dayjs from 'dayjs'; // 使用日期过滤
import { validateNo, validatePhone } from 'utils/index';
import FilterTime from 'utils/filter-time'; // 使用日期过滤
import imChatMinixs from 'utils/mixins/imChatMinixs';
export default {
  name: 'AllocationRecord',
  components: {
    DropSelect,
    SvgIcon,
    ShowTooltip,
    EditSource,
  },
  data() {
    return {
      params: {
        start: 1, //页数
        keyword: undefined, //客户
        customerRequire: '', //客户需求
        sourceChannel: undefined, //来源平台
        allotWay: undefined, //分配方式
      },
      allocationWayType: {
        SMART_ALLOT: '智能分配',
        ARTIFICIAL_ALLOT: '人工分配',
      },
      loading: false,
      dialogVisible: false,
      limit: 10, //每页显示多少条
      tableDataPage: 0, //总页数
      addTime: '',
      allocationTime: '',
      sourcesList: [], //来源平台
      tableData: [],
      props: {
        lazy: true,
        lazyLoad: (node, resolve) => {
          const { level, data, value } = node;
          const params = {
            productTypeCode: data?.productTypeCode || '',
            code: value || '',
          };
          get_search(params).then((res) => {
            if (res.code === 200) {
              let { data } = res;
              data = Array.isArray(data) ? data : [];
              const _arrMap = data.map((item) => {
                return {
                  value: item.code,
                  label: item.name,
                  leaf: level >= 2,
                  productTypeCode: item.productTypeCode,
                };
              });
              resolve(_arrMap);
            } else {
              this.$message.warning(res.message);
              resolve([]);
            }
          });
        },
      },
    };
  },

  computed: {
    allocationWayList() {
      return ALLOCATION_WAY;
    },
  },
  activated() {
    this.getSources();
    this.getAllotTime();
  },
  mixins: [imChatMinixs],
  methods: {
    update() {
      this.getTable();
      this.dialogVisible = false;
    },
    /**
     * @description 拾回
     */
    async handleBack(item) {
      const res = await get_biz_by_id({ resourceId: item.resourceId });
      if (res.code === 200) {
        const data = res.data;
        data.remark = data.comment;
        data.bizId = data.resourceId;
        Object.assign(item, data);
      } else if (res.code === 5055) {
        this.$message.warning('商机不存在,可能被拾回');
        this.getTable();
        return;
      } else {
        this.$message.warning(res.message);
        return;
      }
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.editSourceRef.openModal(item);
      });
    },
    /**
     * @description 联系跟进人
     */
    imChat(item) {
      list_biz_status({ ids: [item.bizId] }).then((res) => {
        const { code, data, message } = res || {};
        if (code !== 200) return this.$message.warning(message);
        if (data[0]?.bizLibrary === 'PERSONAL') {
          this.IMChatOpen(item, 'userId');
        } else {
          this.$message.warning('商机已不在个人库');
          this.getTable();
        }
      });
    },
    /**
     * @description 获取来源平台
     */
    getSources() {
      const param = {
        code: 'RESOURCE_PLATFORM_CODE',
        type: 1,
        status: 1,
      };
      find_tree_book_list(param).then((res) => {
        if (res.code === 200) {
          this.sourcesList = res?.data || [];
          const unlimited = { code: undefined, name: '不限' };
          this.sourcesList.unshift(unlimited);
        } else {
          this.$message.warning(res.message);
        }
      });
    },
    /**
     * @description 获取分配时间
     */
    getAllotTime() {
      this.params.allotStartTime = new FilterTime('thirty', 'YYYY-MM-DD').time[0] + ' 00:00:00';
      this.params.allotEndTime = new FilterTime('thirty', 'YYYY-MM-DD').time[1] + ' 23:59:59';
      this.allocationTime = [this.params.allotStartTime, this.params.allotEndTime];
      this.getTable();
    },
    /**
     * @description 获取列表数据
     */
    getTable() {
      this.loading = true;
      let params = this.params;
      params.limit = this.limit;
      get_allocated_record_list(params)
        .then((res) => {
          if (res.code === 200) {
            this.tableData = res.data.records;
            this.tableDataPage = res.data.total;
          } else {
            this.$message.warning(res.message);
          }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    /**
     * @description 导出
     */
    exportRecord() {
      let params = this.params;
      this.handleParams(params);
      this.$messageBox({
        title: '导出',
        message: '是否确定导出',
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
      })
        .then(() => {
          export_allocated_record_list(params)
            .then((res) => {
              if (res.code === 200) {
                this.$message.success(res.message);
              } else {
                this.$message.warning(res.message);
              }
            })
            .catch((res) => {
              this.$message.warning(res.message);
            });
        })
        .catch(() => {});
    },
    /**
     * @description 搜索
     */
    searchParams() {
      this.params.start = 1;
      let params = this.params;
      this.handleParams(params);
      this.getTable();
    },
    handleParams(params) {
      if (params.keyword && validateNo(params.keyword)) {
        params.keywordType = 'SEARCH_BUS_NO';
      } else if (params.keyword && validatePhone(params.keyword)) {
        params.keywordType = 'SEARCH_CLIENT_PHONE';
      } else if (params.keyword) {
        params.keywordType = 'SEARCH_CLIENT_NAME';
      } else {
        params.keywordType = '';
      }
      params.intentionType = params.customerRequire[2];
    },
    /**
     * @description 重置
     */
    resetParams() {
      this.params = {
        start: 1, //页数
        keyword: undefined, //客户
        customerRequire: '', //客户需求
        sourceChannel: undefined, //来源平台
        allotWay: undefined, //分配方式
      };
      this.addTime = '';
      this.allocationTime = '';
      const refs = this.$refs;
      Array.from({ length: 4 }).forEach((t, i) => {
        refs['plannerRefs' + i].resetInput();
      });
      this.getAllotTime();
    },
    /**
     * @description 确认自定义时间
     */
    sureDate(val, type) {
      if (!val) {
        if (type === 'entry') {
          this.params.entryStartTime = undefined;
          this.params.entryEndTime = undefined;
        } else {
          this.params.allotStartTime = undefined;
          this.params.allotEndTime = undefined;
        }
        return;
      }
      if (type === 'entry') {
        this.params.entryStartTime = dayjs(val[0]).format('YYYY-MM-DD 00:00:00');
        this.params.entryEndTime = dayjs(val[1]).format('YYYY-MM-DD 23:59:59');
      } else {
        this.params.allotStartTime = dayjs(val[0]).format('YYYY-MM-DD 00:00:00');
        this.params.allotEndTime = dayjs(val[1]).format('YYYY-MM-DD 23:59:59');
      }
      // this.getTable();
    },
    /**
     * @description 搜索后选中方法
     */
    selectChangeHandle(val, type) {
      if (type === 'merchantList') {
        this.params.merchantsName = val.name || undefined;
        this.params.merchantsId = val.id || undefined;
      } else if (type === 'acceptList') {
        this.params.plannerName = val.userName || undefined;
        this.params.plannerId = val.mchUserId || undefined;
      } else if (type === 'plannerList') {
        this.params.entryName = val.userName || undefined;
        this.params.entryId = val.mchUserId || undefined;
      } else {
        this.params.assignerName = val.userName || undefined;
        this.params.assignerId = val.mchUserId || undefined;
      }
    },
    /**
     * @description 分页
     * @param {Number}
     */
    //每页多少条
    handleSizeChange(val) {
      this.limit = val;
      this.getTable();
    },
    //第几页
    handleCurrentChange(val) {
      this.params.start = val;
      this.getTable();
    },
    /**
     * @description 查看详情
     */
    lookDetails(id) {
      this.$router.push({ path: '/source-details', query: { businessId: id } });
    },
  },
};
