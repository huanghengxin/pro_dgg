<template>
  <div>
    <!--  v-loadmore 触底滚动加载事件 -->
    <el-select
      ref="select"
      v-model="content"
      v-loadmore
      :value-key="valueKey"
      filterable
      remote
      :placeholder="placeholder"
      :remote-method="remoteMethod"
      :loading="selectLoading"
      clearable
      popper-class="limit-select"
      :popper-append-to-body="false"
      data-tid="limitPageSearchPlanner"
      @change="selectChangeHandle"
      @focus="resetStart"
      @blur="handleBlue"
    >
      <el-option
        v-for="(people, index) in peopleList"
        :key="index + type"
        :label="labelType(people)"
        :value="people"
      >
        <show-tooltip
          :text="labelType(people)"
          title-class="content-title"
          :width="242"
          tooltip-class="content-record"
        ></show-tooltip>
      </el-option>
    </el-select>
  </div>
</template>
<script>
const peopleMap = {
  plannerList: {
    name: 'userName',
    no: 'userCenterNo',
  },
  handleObjList: {
    name: 'userName',
    no: 'userCenterNo',
  },
  merchantList: {
    name: 'name',
    no: 'mchNo',
  },
  inviteList: {
    name: 'userName',
    no: 'userCenterNo',
  },
};
import { get_plat_form_user_info_list, page_list } from 'api/close-black-limit';
import { get_mch_user_info_list } from 'api/common';
import store from 'storejs';
import ShowTooltip from 'components/show-tooltip';
export default {
  name: 'DropSelect',
  components: {
    ShowTooltip,
  },
  directives: {
    // 自定义指令 设置滚动到底部加载下一页的数据
    loadmore: {
      inserted(el, binding, vnode) {
        // 获取element-ui定义好的scroll盒子
        const SELECTWRAP_DOM = el.querySelector('.el-select-dropdown .el-select-dropdown__wrap');
        el.SELECTWRAP_DOM = SELECTWRAP_DOM;
        el.SELECTWRAP_DOM.loadMoreFun = () => {
          if (vnode.context.optionFlag) {
            // 滚到底部
            const CONDITION =
              SELECTWRAP_DOM.scrollHeight - SELECTWRAP_DOM.scrollTop <= SELECTWRAP_DOM.clientHeight;
            if (CONDITION) {
              vnode.context.optionPage += 1;
              vnode.context.getPeopleList(
                vnode.context.optionKey,
                vnode.context.type,
                vnode.context.optionPage,
              );
            }
          }
        };
        SELECTWRAP_DOM.addEventListener('scroll', el.SELECTWRAP_DOM.loadMoreFun);
      },
      unbind(el) {
        el.SELECTWRAP_DOM.removeEventListener('scroll', el.SELECTWRAP_DOM.loadMoreFun);
        el.SELECTWRAP_DOM = null;
      },
    },
  },
  props: {
    placeholder: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: '',
    },
    valueKey: {
      type: String,
      default: '',
    },
    autoFocus: {
      type: Boolean,
      default: false,
    },
    isDimission: {
      type: Boolean,
      default: false,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      optionPage: 1, //下拉框页数
      optionKey: '', //下拉框关键字
      optionFlag: false, //滚动加载
      mchDetailId: '',
      defaultPeopleList: [],
      peopleList: [],
      content: '',
      selectLoading: false, //搜索输入框的加载
      params: {
        limit: 10,
      },
    };
  },
  computed: {
    labelType() {
      return (people) => {
        return people[peopleMap[this.type]['name']] + '/' + people[peopleMap[this.type]['no']];
      };
    },
  },
  created() {
    this.mchDetailId = store.get('mchInfo')?.mchDetailId || '';
    if (this.isDefault) {
      this.params.limit = 20;
      this.getPeopleList();
    }
  },
  methods: {
    resetInput() {
      if (this.autoFocus) {
        this.$refs.select.focus();
      }
      if (this.isDefault) {
        this.peopleList = this.defaultPeopleList;
      } else {
        this.peopleList = [];
      }
      this.content = '';
    },
    selectChangeHandle(val) {
      if (val === '') {
        this.peopleList = [];
        if (this.isDefault) {
          this.peopleList = this.defaultPeopleList;
        }
      }
      this.$emit('change', this.content, this.type);
    },
    handleBlue() {
      if (this.peopleList.length === 0) {
        this.peopleList = this.defaultPeopleList;
      }
    },
    getPeopleList(keyword, type, page = 1) {
      // 判断是否为滚动加载
      this.selectLoading = page > 1 ? false : true;
      let params = this.params,
        path;
      const regPhone = /^1[3-9]\d{9}$/;
      if (regPhone.test(keyword)) {
        params.phone = keyword;
      } else {
        params.searchKey = keyword;
      }
      switch (this.type) {
        case 'handleObjList':
        case 'plannerList':
          params.userCenterStatus = -1;
          params.userCenterAuthStatus = '';
          params.status = this.isDimission ? -1 : 1;
          params.start = page;
          path = get_plat_form_user_info_list;
          break;
        case 'merchantList':
          params.page = page;
          path = page_list;
          break;
        default:
          params.start = page;
          params.mchDetailId = this.mchDetailId;
          path = get_mch_user_info_list;
          break;
      }
      path(params)
        .then((res) => {
          if (res.code === 200) {
            res = res.data;
            if (res.records) {
              this.peopleList = this.peopleList.concat(res.records);
              if (this.isDefault && !keyword) {
                this.defaultPeopleList = res.records;
              }
            }
            // 如果结果数据小于限制数量 不启用滚动加载
            this.optionFlag =
              !res.records ||
              res.records?.length < params.limit ||
              (this.defaultPeopleList && !keyword)
                ? false
                : true;
          } else {
            this.$message.warning(res.message);
          }
          this.selectLoading = false;
        })
        .catch(() => (this.selectLoading = false));
    },
    /**
     * @description 重置start
     */
    resetStart() {
      this.optionPage = 1;
    },
    /**
     * @description 限制人员远程搜索方法
     */
    remoteMethod(keyword) {
      if (!keyword.trim()) return;
      this.optionKey = keyword.trim();
      if (keyword) {
        this.peopleList = [];
        this.params.limit = 10;
      }
      this.getPeopleList(keyword.trim());
    },
  },
};
</script>
<style lang="scss">
.limit-select {
  max-width: 284px;
  .ellipsis {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
</style>
