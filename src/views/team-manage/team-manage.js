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

      source: {},
      userName: '',
      selectLoading: false,
      mchDetailId: '',
      timeType: '',
      defaultPeopleList: [],
    };
  },
  async created() {
    this.getDictionary('CRM_BIZ_STATUS') || {};
    this.getDictionary('QDS_PAGE_TIME_SEARCH_THREE') || {};
    this.source = (await this.getDictionary('CRM_GET_WAY')) || {};
    this.getTeamBusyList();
    this.mchDetailId = store.get('mchInfo')?.mchDetailId || '';
    this.getPeopleList(
      {
        mchDetailId: this.mchDetailId,
        start: 1,
        limit: 1000,
        userCenterAuthStatus: '',
      },
      'default',
    );
  },
  mounted() {},
  methods: {
    /**
     * @description 团队商机跳转详情
     */
    handleDetails(row) {
      this.$router.push(`/team-manage/business-details?businessId=${row.id}&from=team-manage`);
    },
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
    handleBlue(e) {
      if (this.peopleList.length === 0) {
        this.peopleList = this.defaultPeopleList;
      }
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
        userCenterAuthStatus: '',
      };

      const regPhone = /^1[3-9]\d{9}$/;
      if (regPhone.test(keyword)) {
        params.phone = keyword;
      } else {
        params.searchKey = keyword;
      }
      this.getPeopleList(params);
    },
    getPeopleList(params, type) {
      get_mch_user_info_list(params)
        .then((res) => {
          if (res.code === 200) {
            res = res.data;
            this.peopleList = res.records || [];
            if (type) {
              this.defaultPeopleList = res.records;
            }
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
      if (val === '') {
        this.peopleList = this.defaultPeopleList;
      }
      this.ruleForm.plannerId = val;
      this.sortClear();
    },
    /**
     * @description 进库时间筛选
     * @param {String} 点击的选项
     */
    changeEnterTime(item, index) {
      this.enterTimeIndex = index;
      this.sortClear();
      if (index == 4) return;
      const ruleForm = this.ruleForm;
      this.times = []; //切换其他时间后清空自定义时间
      // 今天 本周 本月
      if (this.enterTimeIndex == 0) {
        ruleForm.startTime = '';
        ruleForm.endTime = '';
      } else if (index < 4) {
        const result = new FilterTime(item.ext2).time;
        ruleForm.startTime = result[0];
        ruleForm.endTime = result[1];
      }

      this.getTeamBusyList();
    },
    /**
     * @description 确定自定义时间
     * @param {String}
     */
    sureTimes(time) {
      // 自定义时间清空点击搜索
      this.sortClear();
      if (!time) {
        this.ruleForm.startTime = '';
        this.ruleForm.endTime = '';
      } else {
        this.ruleForm.startTime = dayjs(time[0]).format('YYYY-MM-DD HH:mm:ss') || '';
        this.ruleForm.endTime = dayjs(time[1]).format('YYYY-MM-DD HH:mm:ss') || '';
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
      this.ruleForm.start = 1;
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
      if (result.code !== 200) {
        this.$message.warning(result.message);
        return;
      }
      if (result.code === 200) {
        switch (code) {
          case 'CRM_BIZ_STATUS':
            this.businessStatue = result.data;
            break;
          case 'QDS_PAGE_TIME_SEARCH_THREE':
            this.enterTimeList = result.data;
            break;
          default:
            return result.data.reduce((acc, cur) => {
              acc[cur.code] = cur.name;
              return acc;
            }, {});
        }
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
            this.teamBusyList = result.data.records.map((item) => {
              return {
                ...item,
                sourceName: this.source[item.bizSource],
              };
            });
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
        this.multipleSelectionList = row?.map(function(val) {
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
      this.multipleSelectionList = val?.map(function(val) {
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
