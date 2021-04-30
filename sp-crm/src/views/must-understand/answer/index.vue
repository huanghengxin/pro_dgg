<template>
  <div class="must-understand-answer">
    <div class="answer__search">
      <div v-if="!isSearch" class="answer__search-tabs">
        <span
          v-for="item in curTabFilter"
          :key="item.code"
          :class="{
            'tabs-item': true,
            'tabs-item_active': item.code === answerType,
          }"
          data-tid="customerChangeCuleFrom"
          @click="filterTag(item)"
        >
          {{ item.name }}
        </span>
      </div>
      <div v-else class="answer__search-head">
        <span>搜索结果</span>
      </div>
      <div class="panswer__search-keyword">
        <el-popover
          ref="popover"
          v-model="visible"
          placement="bottom-start"
          trigger="click"
          popper-class="search-popover"
          :disabled="answerList && searchList.length === 0"
        >
          <div class="search-input">
            <div class="search-history-title">
              <span>搜索历史</span>
              <span class="search-history-title-icon" @click="clearHistory">
                <i class="el-icon-delete"></i>
                <em>清空</em>
              </span>
            </div>
            <div
              v-for="(item, index) in searchList"
              :key="index + 'searchList'"
              class="search-history"
            >
              <span class="search-history-content" @click="changeHistory(item)">{{ item }}</span>
              <i class="el-icon-close" @click="delHistory(index)"></i>
            </div>
          </div>
          <el-input
            slot="reference"
            v-model="params.keyword"
            placeholder="请输入关键词搜索"
            :maxlength="20"
            clearable
            @keyup.enter.native="searchUser"
            @clear="handleInputValue(params.keyword.trim())"
          ></el-input>
        </el-popover>
        <el-button type="primary" class="search-button" @click="searchUser">搜索</el-button>
        <el-button plain data-tid="recordPageClearInputValue" @click="clearInputValue"
          >重置</el-button
        >
      </div>
    </div>
    <div v-loading="loading" class="answer__content">
      <template v-if="!isNoData">
        <div v-for="item in answerList" :key="item.id" class="answer__content-item">
          <div v-if="answerType === 'INVITATION' && !isSearch" class="png">
            <img v-if="item.headPortraitUrl" :src="item.headPortraitUrl" alt="" />
            <img v-else src="~@/assets/image/default-head.png" alt="" />
          </div>
          <div class="right">
            <div v-if="answerType === 'RECOMMEND'" class="recommend">
              最近 {{ item.totalBrowseCount }} 人看过
            </div>
            <div v-if="answerType === 'INVITATION' && !isSearch" class="item-name">
              <div>{{ item.handleUserName }}</div>
              <div class="time">{{ item.inviteeTime | filterTimes }}</div>
            </div>
            <router-link :to="`/must-understand/answer-details?id=${item.id}`">
              <div class="item-title" v-html="item.title"></div>
            </router-link>
            <div class="item-data">
              <span>
                <i class="iconfont-qds-crm icon-zixun_mian"></i>回答&nbsp;{{
                  item.answerCount
                }}</span
              ><span
                ><i class="iconfont-qds-crm icon-fullstar"></i>收藏&nbsp;{{
                  item.collectCount
                }}</span
              >
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <svg-icon key="item-warp" ava-class="empty" type="nodata" icon="icon-icon_nodata" />
      </template>
    </div>
    <div class="answer-footer">
      <el-pagination
        background
        :current-page="params.page"
        :page-size="params.limit"
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
import { ANSWER } from '../constants.js';
import { filterTime } from 'utils/helper';
import { getInviteAnswersLimitQueryApi, getFindPageApi, getSearchListApi } from 'api/answer';
import SvgIcon from 'components/svg-icon';

export default {
  name: 'Answer',
  components: {
    SvgIcon,
  },
  filters: {
    filterTimes(val) {
      return val ? filterTime(val, 'mustUnderstand') : '';
    },
  },
  data() {
    return {
      loading: false,
      isSearch: false,
      visible: false,
      total: 0,
      textHtml: '',
      answerType: 'RECOMMEND',
      params: { limit: 10, page: 1, keyword: undefined },
      answerList: [],
      searchVal: '',
      isNoData: false,
    };
  },
  computed: {
    curTabFilter() {
      return ANSWER;
    },
    searchList() {
      return this.$store.state['must-understand'].historyList;
    },
  },
  activated() {
    this.init();
  },
  methods: {
    addValueStyle() {
      this.answerList.forEach((element) => {
        element.title = element.title.replaceAll(
          this.params.keyword.trim(),
          `<span style="color:#4974F5">${this.params.keyword.trim()}</span>`,
        );
      });
    },
    /**
     * @description 发请求
     */
    init() {
      const type = this.isSearch ? '' : this.answerType;
      let path;
      let obj = {
        RECOMMEND: getFindPageApi,
        INVITATION: getInviteAnswersLimitQueryApi,
      };
      path = obj[type] || getSearchListApi;
      this.loading = true;
      path(this.params)
        .then((res) => {
          const { code, data = {}, message } = res || {};
          if (code === 200) {
            //清空上一个列表数组
            this.answerList = [];
            //当前列表数据重新赋值
            this.answerList = data.rows || [];
            this.total = data.total || 0;
            if (type === '') {
              this.addValueStyle();
            }
            this.isNoData = data.rows?.length > 0 ? false : true;
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
     * @description  分页
     */
    handleSizeChange(val) {
      this.params.limit = val;
      this.params.page = 1;
      this.init();
    },
    handleCurrentChange(val) {
      this.params.page = val;
      this.init();
    },
    /**
     * @description  筛选项统一方法
     */
    filterTag(item, field) {
      this.params.page = 1;
      this.params.limit = 10;
      this.params.keyword = undefined;
      this.answerType = item.code;
      this.init();
    },
    /**
     * @description 监听输入框清空
     */
    handleInputValue(content) {
      if (content.trim() == '') {
        this.params.keyword = undefined;
      }
    },
    /**
     * @description 搜索按钮
     */
    searchUser() {
      const keyword = (this.params.keyword = this.params.keyword?.trim());
      this.params.page = 1;
      this.$store.commit('saveHistory', keyword);

      if (keyword) {
        this.isSearch = true;
        this.init();
      } else {
        this.$messageBox.alert('搜索内容不能为空！', '提示', {
          confirmButtonText: '确定',
          type: 'warning',
        });
      }
    },
    /**
     * @description 重置按钮
     */
    clearInputValue() {
      this.params.keyword = undefined;
      this.isSearch = false;
      this.params.page = 1;
      this.params.limit = 10;
      this.init();
    },
    /**
     * @description 选择搜索历史
     */
    changeHistory(item) {
      this.params.keyword = item.trim();
      this.$refs.popover.doClose();
      this.isSearch = true;
      this.init();
    },
    /**
     * @description 删除搜索历史
     */
    delHistory(index) {
      this.$store.commit('delHistory', index);
    },
    /**
     * @description 清空搜索历史
     */
    clearHistory() {
      this.$store.commit('clearHistory');
    },
  },
};
</script>
