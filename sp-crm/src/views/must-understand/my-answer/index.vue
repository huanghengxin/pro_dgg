<template>
  <div class="must-understand-my-answer">
    <div class="answer__tab">
      <span> 我的回答 </span>
    </div>
    <div class="answer_title">
      <div>共有{{ total }}条内容</div>
      <div>
        <el-date-picker
          v-model="value"
          type="daterange"
          start-placeholder="开始时间"
          end-placeholder="结束日期"
          range-separator="-"
          clearable
          value-format="yyyy-MM-dd"
          data-tid="expectFinishTimePick"
          @change="sureTimes"
        >
        </el-date-picker>
      </div>
    </div>

    <div v-loading="loading" class="answer__content" :class="isScrollFlag ? 'is-scroll' : ''">
      <template v-if="!isNoData">
        <div v-for="item in answerList" :key="item.answerId" class="answer__content-item">
          <div class="item-answerText">
            <div ref="mainRef" class="item-answerText-text" v-html="item.answerText"></div>
          </div>

          <div v-if="item.questionTitle" class="item-comment">
            <div class="item-comment-more">
              <router-link :to="`/must-understand/answer-details?id=${item.questionId}`">
                <div class="item-comment-text" v-html="item.questionTitle"></div>
              </router-link>
            </div>
          </div>
          <div class="item-data">
            <span>{{ item.updateTime | filterTimes }}</span>
            <span
              ><i class="iconfont-qds-crm icon-zantong_mian font-icon"></i>
              <i>赞同&nbsp;{{ item.applaudCount }}</i>
            </span>
            <span>
              <i class="iconfont-qds-crm icon-zixun_mian font-icon"></i
              ><i> 评论&nbsp;{{ item.remarkCount }}</i></span
            ><span
              ><i class="iconfont-qds-crm icon-fullstar"></i>收藏&nbsp;{{ item.collectCount }}</span
            >
          </div>
          <div class="item-btn">
            <el-button type="text" @click="edit(item)"
              ><i class="iconfont-qds-crm icon-surface_edit"></i><i>编辑</i>
            </el-button>
            <el-button size="mini" type="text" class="default-font" @click="answerDelete(item)">
              <i class="iconfont-qds-crm icon-surface_delete"></i>
              <i>删除</i>
            </el-button>
          </div>
        </div>
      </template>
      <template v-else>
        <svg-icon key="item-warp" ava-class="empty" type="nodata" icon="icon-icon_nodata" />
      </template>
    </div>
    <div ref="footer" class="answer-footer">
      <el-pagination
        background
        :current-page="param.page"
        :page-size="param.limit"
        :page-sizes="[10, 20, 30, 40, 50]"
        layout="total, prev, pager, next, sizes, jumper"
        :total="total - 0"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import './index.scss';
import { MYANSWER } from '../constants.js';
import { filterTime } from 'utils/helper';
import { getAnswerLimitQuerApi, getDeleteApi } from 'api/answer';
import SvgIcon from 'components/svg-icon';

export default {
  name: 'MyAnswer',
  components: {
    SvgIcon,
  },
  filters: {
    filterTimes(val) {
      return val ? '发布于' + filterTime(val, 'mustUnderstand') : '';
    },
  },
  data() {
    return {
      param: { page: 1, limit: 10 },
      total: 0,
      value: null,
      loading: false,
      clientHeight: '',
      answerList: [],
      isScrollFlag: false,
      isNoData: false,
    };
  },
  computed: {
    curTabFilter() {
      return MYANSWER;
    },
  },
  created() {
    this.getMyAnswer(this.param);
  },
  mounted() {},
  methods: {
    /**
     * @description 暂无数据占位
     */
    isData(answerList) {
      if (answerList.length <= 0) {
        this.isNoData = true;
      } else {
        this.isNoData = false;
      }
    },
    /**
     * @description 获取我的回答列表
     */
    getMyAnswer(param) {
      this.loading = true;
      getAnswerLimitQuerApi(param)
        .then((res) => {
          const { code, data = {}, message } = res;
          if (code === 200) {
            this.answerList = data?.rows || [];
            this.total = res.data.total;
            this.changeString(this.answerList);
            this.isData(data?.rows);
          } else {
            this.isNoData = true;
            this.$message.warning(message);
          }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
          this.isNoData = true;
        });
    },
    /**
     * @description 时间选择器
     */
    sureTimes() {
      if ((this.value && this.value[0]) === null || (this.value && this.value[1]) === null) {
        this.param.createTimeStart = undefined;
        this.param.createTimeEnd = undefined;
        this.param.page = 1;
      } else {
        this.param.createTimeStart = `${this.value[0]} 00:00:00`;
        this.param.createTimeEnd = `${this.value[1]} 23:59:59`;
      }
      this.getMyAnswer(this.param);
    },
    // 返回富文本处理
    changeString(list) {
      list.map((item) => {
        item.text = item.text?.replace(/<img.*?\/>|<hr.*?\/>/g, '');
      });
    },
    /**
     * @description 分页
     */
    handleSizeChange(val) {
      this.param.limit = val;
      this.param.page = 1;
      this.getMyAnswer(this.param);
    },
    handleCurrentChange(val) {
      this.param.page = val;
      this.getMyAnswer(this.param);
    },
    //删除
    answerDelete(item) {
      this.$messageBox
        .confirm('您确定要删除该回答吗?', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          closeOnClickModal: false,
        })
        .then(() => {
          getDeleteApi(item.answerId)
            .then((res) => {
              if (res.code === 200) {
                this.getMyAnswer(this.param);
                this.$message.success('删除成功！');
              } else {
                this.$message.warning(res.message);
              }
            })
            .catch(() => {});
        });
    },
    // 编辑
    edit(item) {
      this.$router.push(`/must-understand/answer-details?from=editor&id=${item.questionId}`);
    },
  },
};
</script>
