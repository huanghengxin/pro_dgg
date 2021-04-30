<!--问题邀请回答-->
<template>
  <div>
    <el-dialog
      :title="falg ? `${title}` : '你可以邀请下面用户，快速获得回答'"
      custom-class="invited-answer-dialog"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="560px"
      destroy-on-close
      @close="diologHandleClose"
    >
      <search-button
        :width="512"
        show-word-limit
        placeholder="请输入关键词搜索"
        :disable="disableFlag"
        data-tid="prospectiveHandleInputValue"
        :from="'cule'"
        @search="search"
        @clear="handleInputValue"
      ></search-button>
      <scroll
        ref="scrollRef"
        max-height="542px"
        min-height="160px"
        scroll-class="main"
        :loading.sync="loading"
        :load-call-back="loadGetFindPag"
        default-conut="20"
      >
        <div v-for="(item, index) in invitList" :key="index" class="main-user-item">
          <div class="left-div">
            <div>
              <img v-if="item.headUrl" :src="item.headUrl" alt="" />
              <img v-else src="~@/assets/image/default-head.png" alt="" />
            </div>
            <div class="middle-div">
              <p class="name">{{ item.userName }}</p>
            </div>
          </div>
          <el-button v-if="item.flag === true" disabled type="info" class="invita" plain
            >已邀请</el-button
          >
          <el-button
            v-else
            type="primary"
            class="invita"
            :loading="item.invitaLoading"
            plain
            data-tid="recordsCancelButton"
            @click="invita(item)"
            >邀请回答</el-button
          >
        </div>
      </scroll>
    </el-dialog>
  </div>
</template>

<script>
import './index.scss';
import { getInviteUserListApi, getInviteAnswerApi, getListMchUserApi } from 'api/answer';
import SearchButton from 'components/search-button';
import Scroll from 'components/scroll';
export default {
  name: 'InvitedAnswerDialog',
  components: { SearchButton, Scroll },
  props: {},
  data() {
    return {
      optionFlag: false,
      total: 0,
      invitedList: [], //已经邀请的的人员
      invitList: [], //推荐待邀请
      changeInvitList: [],
      invitedNameList: [],
      title: '',
      noDataFlag: false,
      dialogVisible: false,
      falg: false,
      params: { page: 1, limit: 20 },
      searchParams: { start: 1, limit: 20, type: 'MERCHANT_B', userCenterStatus: 1, status: 1 },
      isScrollFlag: false,
      isSearch: false,
      isInit: true,
      id: '',
      loading: false,
      invitaLoading: false,
      disableFlag: false,
    };
  },
  computed: {},
  mounted() {},
  methods: {
    /**
     * @description 邀请
     */
    invita(item) {
      this.falg = true;
      this.$set(item, 'invitaLoading', true);
      if (this.isSearch) {
        const params = {
          businessUserId: item.userCenterId,
          businessUserName: item.userName,
          questionId: this.id,
        };
        this.getInviteAnswer(params, item);
      } else {
        const params = {
          businessUserId: item.userId,
          businessUserName: item.userName,
          questionId: this.id,
        };
        this.getInviteAnswer(params, item);
      }
    },
    /**
     * @description  邀请别的用户api
     */
    getInviteAnswer(param, item) {
      getInviteAnswerApi(param)
        .then((res) => {
          if (res.code === 200) {
            this.$message.success(res.message);
            for (let i = this.invitList.length - 1; i >= 0; i--) {
              if (this.isSearch) {
                if (this.invitList[i].userCenterId == item.userCenterId) {
                  this.invitList.splice(i, 1);
                  this.invitList.unshift(item);
                }
              } else {
                if (this.invitList[i].userId == item.userId) {
                  this.invitList.splice(i, 1);
                  this.invitList.unshift(item);
                }
              }
            }
            this.$set(item, 'flag', true);
            this.titleChange();
          } else {
            this.$message.warning(res.message);
            this.titleChange();
          }
          this.$set(item, 'invitaLoading', false);
        })
        .catch(() => {
          this.$set(item, 'invitaLoading', false);
        });
    },
    loadGetFindPag() {
      if (this.isSearch) {
        this.searchParams.start++;
        this.searchPersonnel(this.searchParams);
      } else {
        this.params.page++;
        this.getInvitePeople(this.params.page);
      }
    },
    /**
     * @description 回答问题
     */
    getInvitePeople(page) {
      this.loading = true;
      getInviteUserListApi({
        page,
        limit: 20,
      })
        .then(({ code, message, data }) => {
          if (code === 200) {
            const { rows = [] } = data;
            this.invitList = this.invitList.concat(rows);
            this.$refs.scrollRef.loadSuccess(this.invitList, rows.length);
          } else {
            this.$message.warning(message);
            this.$refs.scrollRef.loadFail();
          }
        })
        .catch(() => {});
    },
    /**
     *  @description 搜索框内容清楚
     */
    handleInputValue(content) {
      if (content == '') {
        this.searchParams.start = 1;
        this.searchParams.searchKey = '';
      }
    },
    /**
     * @description 搜索按钮
     */
    search(param) {
      this.disableFlag = true;
      this.loading = true;
      this.isSearch = true;
      this.isInit = false;
      this.invitList = [];
      this.searchParams.start = 1;
      this.searchParams.searchKey = param.keyword;
      this.searchPersonnel(this.searchParams);
    },
    /**
     * @description 搜索接口
     */
    searchPersonnel(params) {
      getListMchUserApi(params)
        .then((res) => {
          if (res.code === 200) {
            res = res.data;
            this.invitList = this.invitList.concat(res.records);
            this.$refs.scrollRef.loadSuccess(this.invitList, res.records.length);
          } else {
            this.$message.warning(res.message);
            this.$refs.scrollRef.loadFail();
          }
          this.disableFlag = false;
        })
        .catch(() => {
          this.disableFlag = false;
        });
    },
    diologHandleClose() {
      this.params.page = 1;
      this.falg = false;
      this.invitList = [];
      this.isSearch = false;
      this.isInit = true;
    },
    // 标题变化
    titleChange() {
      const invitedList = this.invitList.filter((item) => 'flag' in item);
      if (invitedList.length === 0) {
        this.title = '你可以邀请下面用户，快速获得回答';
      } else if (invitedList.length <= 1) {
        let str = '你已邀请x';
        this.title = str.replace('x', this.invitList[0].userName);
      } else if (invitedList.length == 2) {
        let str = '你已邀请x、y';
        this.title = str
          .replace('x', this.invitList[0].userName)
          .replace('y', this.invitList[1].userName);
      } else {
        let str = `你已邀请x、y 等${invitedList.length}人`;
        this.title = str
          .replace('x', this.invitList[0].userName)
          .replace('y', this.invitList[1].userName);
      }
    },
    /**
     * @description 供父组件调用打开弹层方法
     * @param {Object} 点击当前列表项
     */
    openModal(id) {
      this.id = id;
      this.getInvitePeople(this.params.page);
      this.dialogVisible = true;
    },
  },
};
</script>
