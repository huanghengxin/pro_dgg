import FilterTime from 'utils/filter-time'; // 使用日期过滤
import { filterTime as filterTimeDate } from 'utils/helper'; // 使用日期过滤
import ShowTooltip from 'components/show-tooltip';
import dayjs from 'dayjs';
import store from 'storejs';
import { get_business_management } from 'api/team-manage';
import { get_dictionary_data_by_parent_code, get_mch_user_info_list } from 'api/common';
import SvgIcon from 'components/svg-icon';
import CuleMoveDialog from './components/cule-move-dialog';
import MultipMoveDialog from './components/multip-move-dialog';
import MoreRequire from 'views/dynamic-business/components/more-require';
import ShowMoreRequire from 'views/dynamic-business/components/show-more-require';
export default {
  name: 'TeamManage',
  components: {
    ShowTooltip,
    CuleMoveDialog,
    MultipMoveDialog,
    SvgIcon,
    MoreRequire,
    ShowMoreRequire,
  },
  provide() {
    return {
      parentLoadMore: this.loadMore,
    };
  },
  filters: {
    filterTime(val) {
      return val ? filterTimeDate(val) : '';
    },
    fromFormat(val) {
      const map = {
        CRM_GET_WAY_MOVE: '移交',
        CRM_GET_WAY_REFERRAL: '转介绍',
        CRM_GET_WAY_PICK: '拾回',
        CRM_GET_WAY_SELF_DEV: '自开发',
        CRM_GET_WAY_CLUE_CONVERT: '线索转商机',
        CRM_GET_WAY_ALLOCATION: 'IBOSS系统人工分配',
        INVALID: '标记商机无效进入到公共库/无效库',
      };
      return map[val];
    },
  },
  data() {
    return {
      dialogVisible: false,
      moreNeed: [],
      phone: '',
      searchKey: '',
      peopleList: [],
      times: [],
      multipleSelectionList: [],
      loading: false,
      enterTimeList: [], //进库时间
      enterTimeIndex: 0,
      businessStatue: [], //商机状态
      teamBusyList: [], //列表数据
      total: 0,
      plannerId: '',
      staffName: '',
      ruleForm: {
        bizStatus: '', // 商机状态
        startTime: '', //获取时间
        endTime: '',
        isAsc: 0,
        keyword: '',
        limit: 10,
        orderBy: '1',
        plannerId: '',
        start: 1,
      },
      // searchPage: 1,
      userName: '',
      selectLoading: false,
      len: 3,
      mchDetailId: '',
      timeType: '',
    };
  },
  created() {
    this.getDictionary('CRM_BIZ_STATUS');
    this.getDictionary('QDS_PAGE_TIME_SEARCH_THREE');
    this.getTeamBusyList();
    this.mchDetailId = store.get('mchInfo')?.mchDetailId || '';
    this.getPeopleList({
      mchDetailId: this.mchDetailId,
      start: 1,
      limit: 1000,
    });
  },
  mounted() {},
  methods: {
    /**
     * @description 条件搜索按钮
     */
    searchHanle() {
      this.ruleForm.start = 1;
      this.getTeamBusyList();
    },
    /**
     * @description 更多需求弹窗 3个以上
     */
    loadMore(val) {
      this.$refs.showMoreRequireRefs.openModal(val);
    },
    /**
     * @description 清空输关键字入框
     */
    clearInput() {
      this.getTeamBusyList();
    },
    /**
     * @description 弹窗时间重新刷新列表
     */
    resetList() {
      this.getTeamBusyList();
    },
    /**
     * @description 远程搜规划师谈人
     */
    remoteMethod(keyword) {
      if (!keyword.trim()) return;
      this.selectLoading = true;
      const params = {
        mchDetailId: this.mchDetailId,
        start: 1,
        limit: 999999,
      };

      const regPhone = /^1[3-9]\d{9}$/;
      if (regPhone.test(keyword)) {
        params.phone = keyword;
      } else {
        params.searchKey = keyword;
      }
      this.getPeopleList(params);
    },
    getPeopleList(params) {
      get_mch_user_info_list(params)
        .then((res) => {
          if (res.code === 200) {
            res = res.data;
            this.peopleList = res.records || [];
            this.selectLoading = false;
          } else {
            this.$message.warning(res.message);
          }
        })
        .catch(() => (this.selectLoading = false));
    },
    /**
     * @description 陪谈人搜索选中方法
     * @param {Object} 选中得对象
     */
    selectChangeHandle(val) {
      this.ruleForm.plannerId = val;
      this.sortClear();
    },
    /**
     * @description 确定自定义时间
     * @param {String}
     */
    sureTimes() {
      if ((this.times && this.times[0]) === null || (this.times && this.times[1]) === null) {
        this.ruleForm.startTime = '';
        this.ruleForm.endTime = '';
        this.ruleForm.start = 1;
      } else {
        this.ruleForm.startTime =
          dayjs(this.times && this.times[0]).format('YYYY-MM-DD HH:mm:ss') || '';
        this.ruleForm.endTime =
          dayjs(this.times && this.times[1]).format('YYYY-MM-DD HH:mm:ss') || '';
        this.ruleForm.start = 1;
        this.sortClear();
        this.getTeamBusyList();
      }
    },
    /**
     * @description 进库时间筛选
     * @param {String} 点击的选项
     */
    changeEnterTime(item, index) {
      this.timeType = item?.ext2;
      this.enterTimeIndex = index;
      if (item?.ext2 && item?.ext2 !== 'custom') {
        const result = new FilterTime(item.ext2).time;
        this.ruleForm.startTime = result[0];
        this.ruleForm.endTime = result[1];
        this.ruleForm.start = 1;
        if (this.times?.length > 0) {
          this.times = [];
          this.ruleForm.start = 1;
        }
        this.sortClear();
        this.getTeamBusyList();
      }
      if (item?.ext2 && item?.ext2 === 'custom') {
        this.times = [];
        this.ruleForm.startTime = '';
        this.ruleForm.endTime = '';
        this.ruleForm.start = 1;
      }
      if (!item.ext2) {
        if (this.times?.length > 0) {
          this.times = [];
          this.ruleForm.start = 1;
        }
        this.ruleForm.startTime = '';
        this.ruleForm.endTime = '';
        this.ruleForm.start = 1;
        this.sortClear();
        this.getTeamBusyList();
      }
    },
    /**
     * @description 排序查询
     */
    sortList(val) {
      const map = {
        getTime: '1',
        followTime: '2',
        loseTime: '3',
      };
      if (map[val.prop]) {
        if (val.order) {
          this.ruleForm.orderBy = map[val.prop];
          this.ruleForm.isAsc = val.order === 'descending' ? 1 : 0;
        } else {
          this.ruleForm.orderBy = '1';
          this.ruleForm.isAsc = 0;
        }
      }
      this.getTeamBusyList();
    },
    /**
     * @description 清楚排序
     */
    sortClear() {
      this.$refs.multipleTable.clearSort();
      this.ruleForm.isAsc = 0;
      this.ruleForm.orderBy = '1';
    },
    /**
     * @description 移交操作弹窗
     * @param {String} 当前行点击
     */
    handleMove(row) {
      this.$refs['culeMoveDialog'].openModal(row);
    },
    /**
     * @description 数据字典
     */
    async getDictionary(code) {
      const param = {
        parentCode: code,
      };
      const result = await get_dictionary_data_by_parent_code(param);
      if (result.code === 200) {
        if (code === 'CRM_BIZ_STATUS') {
          this.businessStatue = result.data;
        }
        if (code === 'QDS_PAGE_TIME_SEARCH_THREE') {
          this.enterTimeList = result.data;
        }
      } else {
        this.$message.warning(result.message);
      }
    },
    /**
     * @description 商机列表
     * @returns {Object} 返回数据
     */
    getTeamBusyList() {
      this.loading = true;
      const ruleForm = this.ruleForm;
      let params = Object.keys(ruleForm)?.reduce((acc, cur) => {
        if (ruleForm[cur] !== '') {
          acc[cur] = ruleForm[cur];
        }
        return acc;
      }, {});
      const regName = /^[\u4e00-\u9fa5]+$/;
      const regNumber = /^BSJ[0-9]|bsj[0-9]*$/;
      if (this.ruleForm.keyword && regNumber.test(this.ruleForm.keyword)) {
        params.keywordType = 'SEARCH_BUS_NO';
      } else if (this.ruleForm.keyword && regName.test(this.ruleForm.keyword)) {
        params.keywordType = 'SEARCH_CLIENT_NAME';
      } else if (this.ruleForm.keyword) {
        params.keywordType = 'SEARCH_CLIENT_PHONE';
      } else {
        params.keywordType = '';
      }
      get_business_management(params)
        .then((result) => {
          if (result.code === 200) {
            this.total = result.data.totalCount * 1;
            this.teamBusyList = result.data.records;
            this.loading = false;
          } else {
            this.$message.warning(result.message);
            this.loading = false;
          }
        })
        .catch((result) => {
          this.loading = false;
        });
    },
    /**
     * @description 分页
     */
    handleSizeChange(val) {
      this.ruleForm.limit = val;
      this.ruleForm.start = 1;
      this.getTeamBusyList();
    },
    handleCurrentChange(val) {
      this.ruleForm.start = val;
      this.getTeamBusyList();
    },
    /**
     * @description 点击重置按钮
     */
    resetForm() {
      this.$refs.ruleForm.resetFields();
      this.enterTimeIndex = 0;
      this.userName = '';
      this.getTeamBusyList();
    },
    /**
     * @description 全选
     */
    selectAllClick(row) {
      if (this.limit <= 50) {
        this.multipleSelectionList = row?.map(function (val) {
          return { bizId: val.id, plannerId: val.plannerId };
        });
      } else {
        const arr = row.slice(50);
        arr?.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      }
    },
    /**
     * @description 选择框
     */
    handleSelectionChange(val) {
      this.multipleSelectionList = val?.map(function (val) {
        return { bizId: val.id, plannerId: val.plannerId };
      });
    },
    /**
     * @description 点击批量移交
     */
    multiplHandleMove() {
      if (this.multipleSelectionList.length === 0) {
        this.$message({
          message: '批量移交最少选择1条线索！',
          type: 'warning',
        });
        return;
      }
      this.$refs['multipMoveDialog'].openModal(this.multipleSelectionList);
    },
  },
};
