import './index.scss';
import dayjs from 'dayjs';
import ShowTooltip from 'components/show-tooltip';
import SvgIcon from 'components/svg-icon';
import WriteFollowRcord from 'views/my-business/components/write-follow-record';
import PlayRecording from '../play-recording';
import {
  FOLLOW_RECORDS,
  RECORD_FIELD_BASE,
  RECORD_FIELD_INVITE,
  RECORD_FIELD_INTERVIEW,
} from 'constants/constants';
import {
  follow_record_list,
  interview_list,
  cancel_interview,
  count_interview,
} from 'api/business-details';
import stores from 'storejs';
const ThreeMonthAgo = dayjs()
  .subtract(3, 'month')
  .format('YYYY-MM');
export default {
  name: 'FollowRecords',
  components: {
    ShowTooltip,
    WriteFollowRcord,
    SvgIcon,
    PlayRecording,
  },
  filters: {
    statusFormat(val) {
      const map = {
        1: '已面谈',
        3: '已取消',
        2: '已评价',
        0: '待面谈',
      };
      return map[val];
    },
  },
  props: {
    businessId: {
      type: String,
      default: '',
    },
    from: {
      type: String,
      default: '',
    },
  },
  inject: ['permissionType'],
  data() {
    return {
      noAttentionStatus: '',
      isShowNoData: true,
      isShow: false,
      subTabActive: 1,
      total: {
        invite: '',
        interview: '',
      },
      tabList: [],
      tabActive: '',
      checked: false,
      customerName: '',
      nextFollowTime: '',
      time: '',
      groupId: '',
      disabledButton: true,
      pageNum: 1,
      scrollHeight: 0, //滚动高度
      offsetHeigth: 0, //容器自身高度
      isReachBottom: false,
      reachBottomDistance: 100,
      recordsList: [],
      fieldList: [],
      loading: false,
      pickerOptions: {
        disabledDate(time) {
          return dayjs(time) > dayjs(ThreeMonthAgo);
        },
      },
      textContent: '90天内无数据，请勾选 “查看90天以前” 哦。',
      businessInfoUserId: undefined,
    };
  },
  computed: {
    isCurUser() {
      return stores.get('mchInfo')?.mchUserId == this.businessInfoUserId;
    },
  },
  created() {
    this.tabList = Object.freeze(FOLLOW_RECORDS);
    this.fieldList = Object.freeze(RECORD_FIELD_BASE);
    this.getFollowRecordsList();
    this.disabledButton = true;
    //监听基础信息获取数据后，打开基础信息的按钮限制
    this.$eventBus.$on('get-business-info', (value) => {
      this.disabledButton = false;
      this.groupId = value.groupId;
      this.businessInfoUserId = value?.plannerId;
      this.nextFollowTime = value.nextFollowTime;
      this.customerName = value.customerName;
      this.noAttentionStatus = value.noAttention;
    });
  },
  mounted() {
    this.$eventBus.$on('invite-update-business-details', () => {
      if (this.subTabActive == 1 && this.tabActive == 1) {
        this.reset();
        this.getCountInterview();
        this.getInviteInterviewList();
      }
    });
  },
  beforeDestroy() {
    this.$eventBus.$off('invite-update-business-details');
    this.$eventBus.$off('get-business-info');
  },
  methods: {
    reset() {
      this.isReachBottom = false;
      this.isShow = false;
      this.pageNum = 1;
      this.recordsList = [];
    },
    /**
     * @description 写跟进回调
     */
    writeFollowRecord() {
      this.$eventBus.$emit('update-demand-list'); //更新需求进度
      if (this.tabActive === '' || this.tabActive == 'CRM_OPER_FOLLOW') {
        this.isReachBottom = false;
        this.isShow = false;
        this.pageNum = 1;
        this.recordsList = [];
        this.$eventBus.$emit('edit-on-submit_update-business-info');
        this.loading = true;
        this.timer = setTimeout(() => {
          this.getFollowRecordsList(this.time);
        }, 2000);
      }
    },
    /**
     * @description 打开播放录音
     */
    openAudioDialog(item) {
      this.$refs.playRecordingRef.openModal(item);
    },
    /**
     * @description 获取邀约条数、面谈条数
     */
    getCountInterview() {
      let params = {
        queryTime: this.time ? this.time : undefined,
        bizId: this.businessId,
      };
      count_interview(params).then((res) => {
        if (res.code === 200) {
          this.total.invite = res.data.noInterviewCount;
          this.total.interview = res.data.interviewedCount;
        } else {
          this.$message.warning(res.message);
        }
      });
    },
    /**
     * @description 邀约面谈切换类型
     */
    switchTypeClick(e) {
      const data_code = e.target.dataset.code;
      if (!data_code) return;
      this.reset();
      this.subTabActive = data_code;
      this.getCountInterview();
      this.getInviteInterviewList();
    },
    /**
     * @description 点击取消面谈
     */
    cancelInviteClick(id) {
      this.$messageBox
        .confirm('是否取消面谈?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          closeOnClickModal: false,
        })
        .then(() => {
          this.loading = true;
          let params = {
            id,
          };
          cancel_interview(params).then((res) => {
            if (res.code === 200) {
              this.$message.success(res.message);
              this.reset();
            } else {
              this.$message.warning(res.message);
            }
            this.getCountInterview();
            this.getInviteInterviewList();
            this.loading = false;
          });
        });
    },
    /**
     * @description 写跟进
     */
    writeFollowRcordHandle() {
      this.$refs.writeFollowRcordRef.openModal({
        id: this.businessId,
        groupId: this.groupId,
        nextFollowTime: this.nextFollowTime,
      });
    },
    /**
     * @description 监听滚动事件
     */
    scrollEvent() {
      //在数据回来之前和dom渲染完成
      this.$nextTick(() => {
        const scrollContent = this.$refs.scrollContentRef;
        this.scrollHeight = scrollContent.scrollHeight;
        this.offsetHeigth = Math.ceil(scrollContent.getBoundingClientRect().height);
        scrollContent.addEventListener('scroll', this.onScroll);
      });
    },
    /**
     * @description 滚动事件
     */
    onScroll(e) {
      let scrollTop = e.target.scrollTop;
      let currentHeight = scrollTop + this.offsetHeigth + this.reachBottomDistance;
      if (currentHeight < this.scrollHeight && this.isReachBottom) {
        this.isReachBottom = false;
      }
      if (this.isReachBottom) {
        return;
      }
      if (currentHeight >= this.scrollHeight) {
        this.isReachBottom = true;
        this.pageNum++;
        if (this.tabActive == 1) {
          this.getCountInterview();
          this.getInviteInterviewList();
        } else {
          this.getFollowRecordsList();
        }
      }
    },
    /**
     * @description 获取跟进备注列表数据
     * @param {Object} 请求参数
     */
    getFollowRecordsList() {
      const params = {
        bizId: this.businessId || undefined,
        followType: this.tabActive,
        pageNum: this.pageNum,
        pageSize: 5,
        time: this.time ? this.time.replace('-', '') : undefined,
      };
      this.loading = true;
      follow_record_list(params)
        .then((res) => {
          const { code, data, message } = res;
          if (code === 200) {
            if (!Array.isArray(data.records)) return;
            this.recordsList = this.recordsList.concat(Object.freeze(data.records));
            const len = data.records.length;
            if (len >= 5) {
              this.scrollEvent(len);
            }
            if (this.isReachBottom && len < 5) {
              const scrollContent = this.$refs.scrollContentRef;
              scrollContent.removeEventListener('scroll', this.onScroll);
              this.isShow = true;
            }
            this.fieldList = Object.freeze(RECORD_FIELD_BASE);
          } else {
            this.$message.warning(message);
          }
          this.isShowNoData = this.recordsList?.length === 0 ? false : true;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    /**
     * @description 获取跟进备注列表数据
     * @param {Object} 请求参数
     */
    getInviteInterviewList() {
      const params = {
        queryTime: this.time ? this.time : undefined,
        limit: 5,
        start: this.pageNum,
        panelType: this.subTabActive,
        bizId: this.businessId || undefined,
      };
      this.loading = true;
      interview_list(params)
        .then((res) => {
          const { code, data, message } = res;
          if (code === 200) {
            if (!Array.isArray(data.records)) return;
            this.recordsList = this.recordsList.concat(Object.freeze(data.records));
            const len = data.records.length;
            if (len >= 5) {
              this.scrollEvent(len);
            }
            if (this.isReachBottom && len < 5) {
              this.isShow = true;
            }
            const constants = this.subTabActive == 1 ? RECORD_FIELD_INVITE : RECORD_FIELD_INTERVIEW;
            this.fieldList = Object.freeze(constants);
          } else {
            this.$message.warning(message);
          }
          this.isShowNoData = this.recordsList?.length === 0 ? false : true;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    changeTimeHandle() {
      this.reset();
      if (this.tabActive == 1) {
        this.getCountInterview();
        this.getInviteInterviewList();
      } else {
        this.getFollowRecordsList();
      }
    },
    /**
     * @description 点击90天前恢复默认数据
     */
    clearTimeHandleClick(val) {
      this.textContent = this.checked ? '' : '90天内无数据，请勾选 “查看90天以前” 哦。';
      this.reset();
      this.time = val ? ThreeMonthAgo : '';
      if (this.tabActive == 1) {
        this.getCountInterview();
        this.getInviteInterviewList();
      } else {
        this.getFollowRecordsList();
      }
    },
    /**
     * @description tab切换方法
     * @param {Event} 事件对象
     */
    tabChangeHandleClidk(e) {
      const code = e.target.dataset.code;
      if (code === undefined || this.loading) return;
      this.reset();
      this.tabActive = code;
      if (code == 1) {
        this.getCountInterview();
        this.getInviteInterviewList();
      } else {
        this.getFollowRecordsList();
      }
    },
  },
};
