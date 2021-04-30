<!--问题评论-->
<template>
  <el-dialog
    custom-class="answer-review-dialog"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="720px"
    destroy-on-close
    :before-close="diologHandleClose"
  >
    <div slot="title" class="slot-title">
      <div class="title">
        <div class="title-text">共有{{ total }}条评论</div>
        <div :class="{ 'title-btn': true, 'title-btn_active': isSort }" @click="sort">
          <i class="el-icon-sort"></i> {{ isSort ? '切换为点赞排序' : '切换为时间排序' }}
        </div>
      </div>
    </div>
    <scroll
      ref="scrollRef"
      max-height="542px"
      min-height="160px"
      scroll-class="main"
      :loading.sync="loading"
      :load-call-back="loadGetFindPag"
    >
      <div v-for="item in answerList" :key="item.id" class="main-content">
        <img v-if="item.headUrl" :src="item.headPortraitUrl" alt="" />
        <img v-else src="~@/assets/image/default-head.png" alt="" />
        <div class="right">
          <div class="update">
            <span class="name">{{ item.userName }}</span>
            <span class="update-time">{{ filterTimes(item.updateTime) }}</span>
          </div>
          <p class="describe" v-html="item.content"></p>
          <el-button
            class="get-like"
            :class="item.isApplaudFlag ? 'font-active' : 'default-font'"
            :disabled="item && item.likeFlag"
            type="text"
            @click="getLike(item)"
          >
            <i class="iconfont-qds-crm icon-dianzan_mian"></i>
            <i>{{ item.applaudCount }}</i>
          </el-button>
        </div>
      </div>
    </scroll>
    <div class="rich-text">
      <el-input
        v-model="text"
        type="textarea"
        maxlength="100"
        show-word-limit
        rows="3"
        placeholder="请输入评论内容"
      >
      </el-input>
    </div>
    <span slot="footer" class="footer">
      <el-button
        type="primary"
        size="medium"
        :disabled="isFlag"
        data-tid="recordsCancelButton"
        @click="handleIssue"
        >发布</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
import './index.scss';
import Scroll from 'components/scroll';
import { filterTime } from 'utils/helper';
import { getFindPagApi, getAnswerCommentAddApi, getCommentHandleLogApi } from 'api/answer';
export default {
  name: 'AnswerReview',
  components: {
    Scroll,
  },
  data() {
    return {
      isRequest: false,
      answerList: [],
      total: 0,
      isScrollFlag: false,
      dialogVisible: false,
      noDataFlag: false,
      // 列表参数
      params: {
        limit: 10,
        sourceIds: [],
        page: 1,
      },
      isSort: false,
      issueParams: {},
      text: '',
      type: 0,
      isFlag: false,
      id: '',
      loading: false,
    };
  },
  computed: {},
  methods: {
    filterTimes(val) {
      return val ? '发布于' + filterTime(val, 'mustUnderstand') : '';
    },
    /**
     * @description 点赞
     */
    getLike(item) {
      this.$set(item, 'likeFlag', true);
      getCommentHandleLogApi({
        businessId: item.id,
        handleType: item.isApplaudFlag ? 7 : 1,
      })
        .then((res) => {
          if (res.code === 200) {
            this.operation(item);
            this.$set(item, 'likeFlag', false);
          } else {
            this.$message.warning(res.message);
            this.$set(item, 'likeFlag', false);
          }
        })
        .catch(() => {
          this.$set(item, 'likeFlag', false);
        });
    },
    operation(item) {
      if (item.isApplaudFlag == 1) {
        item.isApplaudFlag = 0;
        console.log(item.applaudCount, '1111111111');
        item.applaudCount = item.applaudCount * 1 - 1;
      } else if (item.isApplaudFlag == 0) {
        item.isApplaudFlag = 1;
        // console.log(item.applaudCount, '1111111111');
        item.applaudCount = item.applaudCount * 1 + 1;
      }
    },
    /**
     * @description 排序
     */
    sort() {
      this.params.orderBy = this.isSort ? undefined : 'updateTime';
      this.loading = true;
      this.getFindPag(this.params, 'sort');
    },
    reset() {
      this.answerList = [];
      this.params.page = 1;
      this.isSort = false;
    },
    diologHandleClose(done) {
      if (this.text) {
        this.$messageBox
          .confirm('退出后已填写的内容将会清空是否继续?', '温馨提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            closeOnClickModal: false,
          })
          .then(() => {
            this.dialogVisible = false;
            this.reset();
            if (this.isRequest) {
              this.$emit('reset-list', this.type);
              this.isRequest = false;
            }
            this.text = '';
          })
          .catch(() => {
            this.dialogVisible = true;
          });
      } else {
        this.dialogVisible = false;
        this.reset();
        if (this.isRequest) {
          this.$emit('reset-list', this.type);
          this.isRequest = false;
        }
      }
    },
    /**
     * @description 发布
     */
    handleIssue() {
      this.isFlag = true;
      this.issueParams.content = this.text;
      if (!this.text) {
        this.isFlag = false;
        this.$message.warning('评论内容不能为空');
        return;
      } else {
        getAnswerCommentAddApi(this.issueParams)
          .then(({ code, data = {}, message }) => {
            if (code === 200) {
              this.text = '';
              this.$message.success('发布成功！');
              this.isFlag = false;
              data.updateTime = new Date();
              data.isApplaudFlag = 0;
              data.applaudCount = 0;
              this.answerList.unshift(data);
              this.$refs.scrollRef.changeNoDataFlag();
              this.isRequest = true;
            } else {
              this.isFlag = false;
              this.$message.warning(message);
            }
          })
          .catch(() => {
            this.isFlag = false;
          });
      }
    },
    loadGetFindPag() {
      this.params.page++;
      this.getFindPag(this.params);
    },
    /**
     * @description 供父组件调用打开弹层方法
     */
    openModal(id, type) {
      console.log(id);
      this.type = type;
      this.dialogVisible = true;
      this.params.sourceIds = [id];
      this.params.sourceType = this.type * 1;
      this.issueParams.sourceId = id;
      this.issueParams.sourceType = this.type * 1;
      this.loading = true;
      this.getFindPag(this.params);
    },
    getFindPag(param, type) {
      getFindPagApi(param)
        .then(({ code, message, data }) => {
          const scrollRef = this.$refs.scrollRef;
          if (code === 200) {
            const { total = 0, rows = [] } = data;
            if (type) {
              this.answerList = [];
              this.isSort = !this.isSort;
            }
            this.answerList = this.answerList.concat(rows);
            scrollRef.loadSuccess(this.answerList, rows.length);
            this.total = total;
          } else {
            scrollRef.loadFail();
            this.$message.warning(message);
          }
        })
        .catch(() => {});
    },
  },
};
</script>
