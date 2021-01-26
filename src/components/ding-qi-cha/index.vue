<template>
  <el-dialog
    custom-class="dingqicha"
    :visible.sync="dialogVisible"
    width="620px"
    @close="diologHandleClose"
  >
    <!-- 头部 -->
    <div class="dingqicha-title">
      <div class="icon">
        <img src="~@/assets/image/icon_logo_dingqicha.png" alt="" />
      </div>
      <search-button search-class="title-search" @search="handleSearch"></search-button>
    </div>
    <!-- 内容 -->
    <div ref="scrollContentRef" v-loading="loading" class="content">
      <template v-if="companyList.length > 0">
        <div v-for="item in companyList" :key="item.companyId" class="content-item">
          <div class="item-top">
            <el-radio v-model="curCompany" :label="item.companyId">
              <show-tooltip :text="item.companyName" :width="300" tooltip-class="item-top_name" />
            </el-radio>
            <div v-if="item.isSave" class="item-top_tag">存续</div>
          </div>
          <div class="item-content">
            <div class="item-content_one">
              <div class="item-content-warp">
                <div class="one-item">
                  <span class="one-item_name">法人：</span>
                  <show-tooltip :text="item.field_2" :width="72" class="one-item_content" />
                </div>
                <div class="one-item">
                  <span class="one-item_name">信用代码：</span>
                  <span class="one-item_content">{{ item.companyCode }}</span>
                </div>
              </div>
              <div class="one-item">
                <span class="one-item_name">成立时间：</span>
                <span class="one-item_content">{{ item.createCompanyTime }}</span>
              </div>
            </div>
            <div class="item-content_two">
              <span class="two-item_name">地址：</span>
              <show-tooltip :text="item.companyArea" :width="500" class="two-item_content" />
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <svg-icon
          v-if="noSearch"
          key="item-warp"
          type="noSearch"
          icon="/src/assets/image/no-search.png"
        />
        <svg-icon v-else key="item-warp" type="nodata" icon="icon-icon_nodata" />
      </template>
    </div>

    <span slot="footer" class="footer">
      <el-button size="medium" data-tid="recordsCancelButton" @click="dialogVisible = false"
        >取消</el-button
      >
      <el-button
        type="primary"
        :loading="buttonLoading"
        size="medium"
        data-tid="recordsCancelButton"
        @click="dialogVisible = false"
        >确定关联</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
import { getCompanyList } from 'api/common';
import ShowTooltip from '../show-tooltip';
import SvgIcon from 'components/svg-icon';
import SearchButton from '../search-button/index.vue';
export default {
  name: '',
  components: {
    ShowTooltip,
    SearchButton,
    SvgIcon,
  },
  mixins: [],
  props: {},
  data() {
    return {
      dialogVisible: false,
      searchContent: '',
      companyList: [],
      loading: false,
      buttonLoading: false,
      curCompany: '',
      showTooltip: true,
      scrollHeight: 0, //滚动高度
      offsetHeigth: 0, //容器自身高度
      isReachBottom: false,
      reachBottomDistance: 100,
      page: 1,
    };
  },
  computed: {
    noSearch() {
      const { searchContent, companyList } = this;
      return searchContent && companyList.length === 0 ? true : false;
    },
  },
  methods: {
    handleSearch(content) {
      this.searchContent = content;
      this.getCompanyData();
    },
    /**
     * @description 监听滚动事件
     */
    scrollEvent(length) {
      //在数据回来之前和dom渲染完成
      this.$nextTick(() => {
        const scrollContent = this.$refs.scrollContentRef;
        this.scrollHeight = scrollContent.scrollHeight;
        this.offsetHeigth = Math.ceil(scrollContent.getBoundingClientRect().height);
        if (this.page > 1 && length < 10) {
          scrollContent.addEventListener('scroll', this.onScroll);
        }
      });
    },
    /**
     * @description 滚动事件
     */
    onScroll(e) {
      let scrollTop = e.target.scrollTop;
      let currentHeight = scrollTop + this.offsetHeigth + this.reachBottomDistance;
      if (currentHeight < this.scrollTop && this.isReachBottom) {
        this.isReachBottom = false;
      }
      if (this.isReachBottom) {
        return;
      }
      if (currentHeight >= this.scrollHeight) {
        this.isReachBottom = true;
        this.page++;
        this.getCompanyData();
      }
    },
    /**
     * @description 弹层关闭抛出事件,重置表单数据
     */
    diologHandleClose() {
      this.searchContent = '';
    },
    /**
     * @description 提供方法供父组件，打开弹框请求数据
     */
    openModal() {
      this.dialogVisible = true;
      this.getCompanyData();
    },
    /**
     * @description 获取顶企查搜索数据
     */
    getCompanyData() {
      this.loading = true;
      let params = { keyword: this.searchContent, limit: 10 };
      params.page = this.page;
      getCompanyList(params)
        .then((res) => {
          // this.companyList = [];
          if (res.code === 200) {
            this.companyList.concat(res || []);
            if (res) {
              this.scrollEvent(res.length);
            }
            this.loading = false;
          } else {
            this.$message.warning(res.message);
          }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>

<style lang="scss">
.dingqicha {
  height: $dingqicha-height;
  .el-dialog__body {
    padding: $dialog-body-padding;
  }

  &-title {
    padding-top: $dingqicha-title-padding-top;
    padding-bottom: $dingqicha-title-padding-bottom;
    border-bottom: $dingqicha-title-border-bottom;
    .icon {
      text-align: center;
    }
  }
  .title-search {
    margin: 0 auto;
    margin-top: $dingqicha-title-input-margin-top;
  }
  .content {
    overflow: hidden;
    overflow-y: auto;
    &::-webkit-scrollbar {
      display: none;
    }
    height: $dingqicha-content-width;

    border-bottom: $dingqicha-content-border-bottom;
    .content-item {
      padding-bottom: $dingqicha-content-item-padding-bottom;
      border-bottom: $dingqicha-content-border-bottom;
      &:nth-last-child(2) {
        border-bottom: 0;
      }
      .item-top {
        display: flex;
        justify-content: space-between;
        line-height: $dingqicha-content-top-line-height;
        margin-top: $dingqicha-content-top-margin-top;
        .el-radio {
          display: flex;
          align-items: center;
        }
        &_tag {
          width: $dingqicha-content-top-tag-width;
          line-height: $dingqicha-content-top-tag-line-height;
          border: $dingqicha-content-top-tag-border;
          border-radius: $dingqicha-content-top-tag-border-radius;
          text-align: center;
          color: $dingqicha-content-top-tag-color;
        }
        &_name {
          color: $dingqicha-content-top-name-color;
          font-weight: $font-weight-crm;
        }
      }
      .item-content {
        .one-item_name,
        .two-item_name {
          color: $dingqicha-content-one-frist-child-color;
        }
        .one-item_content,
        .two-item_content {
          color: $dingqicha-content-one-last-child-color;
        }
        &_one {
          display: flex;
          justify-content: space-between;
          margin-top: $dingqicha-content-one-margin-top;
          padding-left: $dingqicha-content-padding-left;
        }
        &_two {
          display: flex;
          margin-top: $dingqicha-content-two-margin-top;
          padding-left: $dingqicha-content-padding-left;
        }
      }
      .one-item {
        display: flex;
      }
      .item-content-warp {
        display: flex;
        .one-item:last-child {
          margin-left: $dingqicha-content-one-margin-left;
        }
      }
    }
  }
  .el-dialog__footer {
    padding: 0;
  }
  .footer {
    height: $dialog-footer-height;
    display: flex;
    justify-content: center;
    align-items: center;
    .el-button--primary {
      font-size: $font-size-sm;
    }
  }
}
</style>
