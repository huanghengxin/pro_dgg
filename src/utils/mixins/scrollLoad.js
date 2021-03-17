/**
 * @description 搜索下拉框滚动加载
 */
import { get_plat_form_user_info_list, page_list } from 'api/close-black-limit';
import { get_mch_user_info_list } from 'api/common';
import store from 'storejs';
const scrollLoad = {
  directives: {
    // 自定义指令 设置滚动到底部加载下一页的数据
    loadmore: {
      inserted(el, binding, vnode) {
        // 获取element-ui定义好的scroll盒子
        const SELECTWRAP_DOM = el.querySelector('.el-select-dropdown .el-select-dropdown__wrap');
        SELECTWRAP_DOM.addEventListener('scroll', function() {
          if (vnode.context.optionFlag) {
            // 滚到底部
            const CONDITION = this.scrollHeight - this.scrollTop <= this.clientHeight;
            if (CONDITION) {
              vnode.context.optionPage += 1;
              vnode.context.getPeopleList(
                vnode.context.optionKey,
                binding.value,
                vnode.context.optionPage,
              );
            }
          }
        });
      },
    },
  },
  data() {
    return {
      optionPage: 1, //下拉框页数
      optionKey: '', //下拉框关键字
      optionFlag: false, //滚动加载
      url: '',
      mchDetailId: '',
      defaultPeopleList: [],
    };
  },
  created() {
    this.mchDetailId = store.get('mchInfo')?.mchDetailId || '';
  },
  mounted() {
    this.url = this.$route.path;
  },
  methods: {
    getPeopleList(keyword, type, page = 1) {
      // 判断是否为滚动加载
      page > 1 ? (this.selectLoading = false) : (this.selectLoading = true);
      let params = {};
      if (
        (type === 'plannerList' || type === 'handleObjList') &&
        this.url == '/close-black-handle-record'
      ) {
        params.userCenterStatus = -1;
        params.userCenterAuthStatus = '';
        params.status = -1;
        params.limit = 50;
        // 获取操作人/操作对象名单 页码
        params.start = page;
      } else if (type == 'plannerList') {
        params.userCenterStatus = -1;
        params.userCenterAuthStatus = '';
        params.status = 1;
        params.limit = 50;
        // 获取限制人员名单 页码
        params.start = page;
      } else if (type == 'merchantList') {
        // 获取商户名单  页码
        params.page = page;
        params.limit = 50;
      } else {
        params.start = page;
        params.limit = 1000;
        params.mchDetailId = this.mchDetailId;
      }
      const regPhone = /^1[3-9]\d{9}$/;
      if (regPhone.test(keyword)) {
        params.phone = keyword;
      } else {
        params.searchKey = keyword;
      }
      const path =
        type === 'plannerList' || type === 'handleObjList'
          ? get_plat_form_user_info_list
          : type === 'merchantList'
          ? page_list
          : get_mch_user_info_list;
      path(params)
        .then((res) => {
          if (res.code === 200) {
            res = res.data;
            if (this.optionFlag && this.optionPage > 1) {
              // 滚动加载  且不是第一页
              if (res.records) {
                this[type] = [...this[type], ...res.records];
              }
            } else {
              this[type] = res.records || [];
            }
            if (type === 'default') {
              this.peopleList = res.records;
              this.defaultPeopleList = res.records;
            }
            // 如果结果数据小于限制数量 不启用滚动加载
            res.records?.length < params.limit || !res.records
              ? (this.optionFlag = false)
              : (this.optionFlag = true);
          } else {
            this.$message.warning(res.message);
          }
          this.selectLoading = false;
        })
        .catch(() => (this.selectLoading = false));
    },
  },
};
export default scrollLoad;
