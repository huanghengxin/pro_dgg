<template>
  <div>
    <el-dialog
      title="跟进记录"
      :visible.sync="dialogVisible"
      width="620px"
      :close-on-click-modal="false"
      custom-class="more-follow-record"
      @closed="diologHandleClose"
    >
      <template v-if="flag">
        <div ref="scrollContentRef" v-loading="loading" class="item-warp">
          <div v-for="(item, index) in list" :key="item.id">
            <div class="warp-content_item">
              <div class="inprogress">
                <svg-icon
                  v-if="index === 0"
                  key="iconfont-qds-crm-inprogress"
                  ava-class="first-icon"
                  icon="icon-inprogress"
                />
                <svg-icon v-else key="iconfont-qds-crm-inprogress" icon="icon-notinprogress" />
              </div>
              <div class="content">
                <div class="content-time">{{ item.create_time }}</div>
                <div class="content-man">
                  <p>跟进人：</p>
                  <span> {{ item.opp_obj2 }}</span>
                </div>
                <p v-if="item.opp_type === 'CRM_OPER_CALL'">
                  <span> 打电话：</span>
                  <i
                    class="iconfont-qds-crm icon-start content-icon"
                    data-tid="recordOpenAudioDialog"
                    @click="openAudioDialog(item)"
                    ><em>播放录音</em></i
                  >
                </p>
                <p v-else>
                  <show-tooltip
                    v-if="item.text"
                    :text="item.text"
                    title="跟进内容："
                    title-class="content-title"
                    :tooltip-line-clamp="2"
                    :width="548"
                    tooltip-class="content-record"
                  ></show-tooltip>
                </p>
              </div>
            </div>
          </div>
          <p v-show="isShow" class="no-more">没有更多数据</p>
        </div>
      </template>
      <template v-else>
        <svg-icon key="item-warp" type="nodata" icon="icon-icon_nodata" />
      </template>
    </el-dialog>
    <play-recording ref="playRecordingRef" :customer-name="customerName" />
  </div>
</template>

<script>
import './index.scss';
import ShowTooltip from 'components/show-tooltip';
import SvgIcon from 'components/svg-icon';
import { get_follow_up_content } from 'api/cule';
import PlayRecording from 'views/business-details/components/play-recording';
export default {
  name: 'MoreFollowRecord',
  components: {
    ShowTooltip,
    SvgIcon,
    PlayRecording,
  },
  props: {
    businessId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      customerName: '',
      dialogVisible: false,
      loading: false,
      flag: true,
      clueId: '',
      isReachBottom: false,
      reachBottomDistance: 100,
      list: [],
      pageNum: 1,
      isShow: false,
      scrollHeight: 0, //滚动高度
      offsetHeigth: 0, //容器自身高度
    };
  },
  computed: {},
  created() {
    //监听基础信息获取数据后，打开基础信息的按钮限制
  },
  methods: {
    /**
     * @description 打开播放录音
     */
    openAudioDialog(item) {
      this.$refs.playRecordingRef.openModal(item);
    },
    /**
     * @description 弹框关闭清空数据
     */
    diologHandleClose() {
      this.flag = true;
      this.pageNum = 1;
      this.list = [];
      this.isShow = false;
    },
    /**
     * @description 供父组件调用打开弹层方法
     * @param {Object} 点击当前列表项
     */
    openModal(item) {
      this.customerName = item.customerName;
      this.isReachBottom = false;
      this.clueId = item.id;
      this.dialogVisible = true;
      this.getFollowUp();
    },
    /**
     * @description 监听滚动事件
     */
    scrollEvent() {
      //在数据回来之前和dom渲染完成
      this.$nextTick(() => {
        const scrollContent = this.$refs.scrollContentRef;
        this.scrollHeight = scrollContent.scrollHeight; //元素内容的高度包含溢出的高度
        this.offsetHeigth = Math.ceil(scrollContent.getBoundingClientRect().height); //容器的高度
        scrollContent.addEventListener('scroll', this.onScroll);
      });
    },
    /**
     * @description 滚动事件
     */
    onScroll(e) {
      let scrollTop = e.target.scrollTop; //获得滚动的像素数
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
        this.getFollowUp();
      }
    },
    /**
     * @description 获取跟进备注列表数据
     */
    getFollowUp() {
      this.loading = true;
      const params = {
        clueId: this.clueId,
        limit: 5,
        start: this.pageNum,
      };

      get_follow_up_content(params)
        .then((res) => {
          if (res.code === 200) {
            this.list = this.list.concat(res.data.records || []);
            if (res.data.records.length === 0) {
              this.flag = false;
            }
            if (res.data.records.length >= 5) {
              this.flag = true;
              this.scrollEvent(res.data.records.length);
            }
            if (this.isReachBottom && res.data.records.length < 5) {
              const scrollContent = this.$refs.scrollContentRef;
              scrollContent.removeEventListener('scroll', this.onScroll);
              this.flag = true;
              this.isShow = true;
            }
            this.loading = false;
          } else {
            this.loading = false;
            this.$message.warning(res.message);
          }
        })
        .catch(() => {
          this.flag = false;
          this.loading = false;
        });
    },
  },
};
</script>
