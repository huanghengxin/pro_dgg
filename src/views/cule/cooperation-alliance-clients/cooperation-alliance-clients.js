import ShowTooltip from 'components/show-tooltip';
import ListSearch from './components/list-search';
import SvgIcon from 'components/svg-icon';
import RefusalReleaseReason from '../../business-details/components/business-role/components/refusalReleaseReason/index.vue';
import { get_page } from 'api/cooperation-in-page';
import SearchButton from 'components/search-button';
import tabList from './constants';
import { pick_up_clue } from 'api/cule';
import { store, actions } from './components/observable';
import { filterWithSecTime } from 'utils/helper'; // 使用日期过滤
import { getQueryString } from 'utils/helper';
// import dayjs from 'dayjs'; // 使用日期过滤
export default {
  components: {
    ShowTooltip,
    SvgIcon,
    RefusalReleaseReason,
    SearchButton,
    ListSearch,
  },
  provide() {
    return {
      parentLoadMore: this.loadMore,
    };
  },
  data() {
    return {
      activeName: 'DJS',
      loading: false,
      cooperationList: [], //合作联盟数据
      tabList: Object.freeze(tabList),
      start: 1,
      limit: 10,
      param: {},
      //发起时间
      date: '', //发起时间
    };
  },
  created() {
    // this.getCooperationList(this.param);
    // 数据字典
    // this.receivedInit();
    console.log(actions.getDataList(), 'store.tableData1');
    console.log(store.tableData, 'store.tableData2');
    let query = new getQueryString();
    console.log(query, 'query');
    if (query.active) {
      this.activeName = query.active;
    }
  },
  computed: {
    tableData() {
      return store.tableData;
    },
  },
  filters: {
    filterTime(val) {
      return val ? filterWithSecTime(val) : '';
    },
  },
  mounted() {},
  methods: {
    //跳转发起合作
    tocooperation() {
      this.$router.push('/initiate-cooperation-in-page');
    },

    //在线聊
    onlineTalk() {
      console.log('在线聊');
    },

    //查看商机
    checkBusiness(id) {
      this.$router.push(`/my-business/business-details?businessId=${id}`);
    },

    //tab切换
    handleClick(tab) {
      console.log(tab.name, '111');
      if (tab.name == 1) {
        //我接收的
        this.receivedInit();
      } else {
        //我发起的
        this.startedInit();
      }
    },

    // /**
    //  * @description 我接收的字典请求
    //  */
    // receivedInit() {},

    // /**
    //  * @description 我发起的字典请求
    //  */
    // startedInit() {
    //   this.getDictionary('QDS_ClUE_SOURCE', 'startedList'); //发起时间
    // },

    // /**
    //  * @description 接收状态
    //  * @param {String} 点击的选项
    //  */
    // changeEnterTime(item, index) {
    //   //     this.param.clueSourceType = item.code;
    //   //   this.active.started = item.code;
    //   //   this.param.start = 1;
    //   console.log(item, index, 'item');
    //   this.enterTimeIndex = index; //用于控制当前点击样式
    //   this.sortClear();
    //   this.get_page(this.param);
    // },
    // /**
    //  * @description 合作类型
    //  * @param {Number}
    //  */
    // changeEnterType(item, index) {
    //   this.param.cooperationType = item.code;
    //   this.param.start = 1;
    //   console.log(item, 'item');
    //   this.enterTypeIndex = index; //用于控制当前点击样式
    //   this.sortClear();
    //   this.get_page(this.param);
    // },
    // /**
    //  * @description 发起时间切换
    //  * @param {Number}
    //  */
    // changeTime(index) {
    //   console.log(index, 'index');
    //   this.start = 1;
    //   this.isActive = index;
    //   this.$refs.tableRef.clearSort();
    //   this.isAsc = undefined;
    //   this.orderBy = undefined;
    //   if (this.isActive < 3 && this.isActive > 0) {
    //     this.param.dropTimeStart = new FilterTime(
    //       this.time[index].timing,
    //       'YYYY-MM-DD HH:mm:ss',
    //     ).time[0];
    //     this.param.dropTimeEnd = new FilterTime(
    //       this.time[index].timing,
    //       'YYYY-MM-DD HH:mm:ss',
    //     ).time[1];
    //     this.date = '';
    //     this.get_page(this.param);
    //   }
    //   if (this.isActive == 0) {
    //     this.param.dropTimeStart = undefined;
    //     this.param.dropTimeEnd = undefined;
    //     this.get_page(this.param);
    //   }
    // },
    // /**
    //  * @description datePicker组件时间改变事件 自定义时间
    //  * @param {String}
    //  */
    // sureDate(val) {
    //   if (!val) return;
    //   this.start = 1;
    //   this.param.dropTimeStart = dayjs(val[0]).format('YYYY-MM-DD HH:mm:ss');
    //   this.param.dropTimeEnd = dayjs(val[1]).format('YYYY-MM-DD HH:mm:ss');
    //   this.get_page(this.param);
    // },
    // /**
    //  * @description 线索来源
    //  * @param {String} 点击的选项
    //  */
    // changeFoundingFrom(item) {
    //   this.param.clueSourceType = item.code;
    //   this.active.started = item.code;
    //   this.param.start = 1;
    //   this.getTeamBusyList(this.param);
    // },

    /**
     * @description 排序查询
     */
    sortList(val) {
      // console.log(val, 'val');
      // const map = {
      //   lastRemarkTime: '2',
      // };
      // if (map[val.prop]) {
      //   if (val.order) {
      //     this.param.orderBy = map[val.prop];
      //     this.param.isAsc = val.order === 'descending' ? 1 : 0;
      //   } else {
      //     this.param.orderBy = '2';
      //     this.param.isAsc = 0;
      //   }
      // }
      // this.get_page(this.param);
    },

    /**
     * @description 清除排序
     */
    // sortClear() {
    //   this.$refs.tableRef.clearSort();
    //   this.param.isAsc = 0;
    //   this.param.orderBy = '2';
    // },

    /**
     * @description 接受合作
     */
    listHandleClick(id) {
      const param = {
        clueId: id,
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
          pick_up_clue(param)
            .then((res) => {
              if (res.code === 200) {
                if (this.cooperationList?.length == 1 && this.param.start != 1) {
                  this.param.start--;
                }
                this.get_page(this.param);
                this.$message({
                  type: 'success',
                  message: '已接收合作联盟!',
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
        });
    },
    /**
     * @description 拒绝合作
     */
    refuseCooperation(id) {
      this.$refs.refusalReleaseReasonRef.openModal(id);
      console.log(id, 'id');
    },
    /**
     * @description 合作联盟列表数据 我接收的
     */
    getCooperationList(param) {
      this.loading = true;
      get_page(param)
        .then((result) => {
          if (result.code === 200) {
            this.total = result.data.totalCount * 1;
            this.cooperationList = result.data.records;
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
      this.getCooperationList(this.param);
    },
    handleCurrentChange(val) {
      this.param.start = val;
      this.getCooperationList(this.param);
    },
  },
};
