<template>
  <el-dialog
    title="操作日志"
    custom-class="handle-log"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="820px"
    @close="diologHandleClose"
  >
    <div class="more-month">
      <el-checkbox
        v-model="checked"
        data-tid="recordClearTimeHandleClick"
        @change="clearTimeHandleClick"
        >查看90天以前</el-checkbox
      >
      <el-date-picker
        v-if="checked"
        v-model="time"
        :picker-options="pickerOptions"
        value-format="yyyy-MM"
        size="small"
        type="month"
        placeholder="选择月"
        data-tid="logChangeMonth"
        @blur="changeMonth"
      >
      </el-date-picker>
    </div>
    <div v-loading="loading">
      <div class="table-th">
        <div>操作类型</div>
        <div>操作人</div>
        <div>操作时间</div>
        <div>操作内容</div>
      </div>
      <div ref="scrollContentRef" class="table-ul">
        <ul v-if="list.length > 0" key="handle-log">
          <li v-for="item in list" :key="item.id" class="table-tr">
            <div>
              <show-tooltip :text="item.optType | handleLog" :width="160"></show-tooltip>
            </div>
            <div>
              <show-tooltip :text="item.optPerson || '暂无数据'" :width="160"></show-tooltip>
              <!-- {{ item.optPerson || '-' }} -->
            </div>
            <div>
              {{ item.optTime || '-' }}
            </div>
            <div>
              <show-tooltip :text="item.optContent || ''" :width="240"></show-tooltip>
            </div>
          </li>
          <li v-show="isShow" class="no-more">没有更多数据</li>
        </ul>
        <div v-else key="handle-log">
          <svg-icon
            key="item-warp"
            :text-content="textContent"
            ava-class="no-data"
            type="nodata"
            icon="icon-icon_nodata"
          />
        </div>
      </div>
    </div>
    <!-- 弹层按钮 -->
    <span slot="footer" class="footer">
      <el-button size="small" data-tid="recordsCancelButton" @click="dialogVisible = false"
        >取消</el-button
      >
      <el-button
        type="primary"
        size="small"
        data-tid="recordsCancelButton"
        @click="dialogVisible = false"
        >确定</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
import './index.scss';
import ShowTooltip from 'components/show-tooltip';
import SvgIcon from 'components/svg-icon';
import { oper_log_list } from 'api/common';
import dayjs from 'dayjs';
import { HANDLE_LOG } from 'constants/type';
const ThreeMonthAgo = dayjs()
  .subtract(3, 'month')
  .format('YYYY-MM');
export default {
  name: 'HandleLog',
  components: {
    ShowTooltip,
    SvgIcon,
  },
  filters: {
    handleLog(val) {
      return HANDLE_LOG[val] || '暂无数据';
    },
  },
  data() {
    return {
      timer: '',
      businessId: '',
      dialogVisible: false,
      loading: false,
      list: [],
      isShow: false,
      pageNum: 1,
      scrollHeight: 0, //滚动高度
      offsetHeigth: 0, //容器自身高度
      isReachBottom: false,
      reachBottomDistance: 100,
      pickerOptions: {
        disabledDate(time) {
          return dayjs(time) > dayjs(ThreeMonthAgo);
        },
      },
      checked: false,
      time: '',
      textContent: '90天内无数据，请勾选 “查看90天以前” 哦。',
    };
  },
  beforeDestroy() {
    this.timer = null;
  },
  methods: {
    /**
     * @description 选中日期调用接口
     */
    changeMonth() {
      this.pageNum = 1;
      this.list = [];
      this.isShow = false;
      this.getHandleLogList();
    },
    /**
     * @description 点击90天前恢复默认数据
     */
    clearTimeHandleClick(val) {
      this.textContent = this.checked ? '' : '90天内无数据，请勾选 “查看90天以前” 哦。';
      this.list = [];
      this.pageNum = 1;
      this.isShow = false;
      if (val) {
        this.time = ThreeMonthAgo;
        this.getHandleLogList();
      } else {
        this.time = '';
        this.getHandleLogList();
      }
    },
    /**
     * @description 弹框关闭清空数据
     */
    diologHandleClose() {
      this.pageNum = 1;
      this.time = '';
      this.list = [];
      this.isShow = false;
      this.checked = false;
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
        this.getHandleLogList();
      }
    },
    /**
     * @description 获取操作日志数据
     */
    getHandleLogList() {
      const time = this.time;
      const params = {
        bizId: this.businessId,
        pageNum: this.pageNum,
        pageSize: 10,
        time: time === '' ? undefined : time.replace('-', ''),
      };
      this.loading = true;
      oper_log_list(params)
        .then((res) => {
          const { code, data, message } = res;
          if (code === 200) {
            const records = data.records;
            this.list = this.list.concat(records || []);
            if (records && records.length >= 5) {
              this.scrollEvent();
            }
            if (this.isReachBottom && records.length < 5) {
              const scrollContent = this.$refs.scrollContentRef;
              scrollContent.removeEventListener('scroll', this.onScroll);
              this.isShow = true;
            }
            this.loading = false;
          } else {
            this.$message.warning(message);
          }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    /**
     * @description 供父组件调用打开弹层
     */
    openModal({ id }) {
      this.isReachBottom = false;
      this.businessId = id;
      this.dialogVisible = true;
      this.getHandleLogList();
    },
  },
};
</script>

<style></style>
