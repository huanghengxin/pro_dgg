import './index.scss';
import dayjs from 'dayjs';
import FilterTime from 'utils/filter-time';
import { countUnRead, pc_menu } from 'api/my-business';
import SearchButton from 'components/search-button';

import {
  TAB_LIST,
  MY_BUSINESS_FIELD,
  FILTER_LIST,
  defaultMapObj,
  defaultMapFilterList,
} from 'constants/constants.js';
export default {
  name: 'ListSearch',
  components: {
    SearchButton,
  },
  filters: {
    filterName(val) {
      return FILTER_LIST[val].name;
    },
  },
  props: {},
  data() {
    return {
      searchInputValue: {},
      activeTabField: 'TODAY_FOLLOW', //当前选中tab标签页code
      tabActive: 0, //当前tab页选中0
      tabList: null, //tabl标签页列表
      stateNumber: 0, //商机动态数量
      filterType: {}, //列表筛选字段类型
      fieldActive: {}, //列表筛选字段选中索引
      showMoreFilterField: {},
      checkedFieldList: {}, //列表筛选字段选中的数据
      paramsDate: {},
      searchInputParams: {},
      showNode: false,
      loading: false,
      userDefinedTime: {},
    };
  },
  computed: {
    isShowFilterBar() {
      const checkedFieldList = this.checkedFieldList[this.activeTabField];
      if (!checkedFieldList) return {};
      let obj = {};
      for (const [key, value] of Object.entries(checkedFieldList)) {
        if (!value.code || value.code === 'UPCOMING_DROP') continue;
        obj[key] = value;
      }
      return obj;
    },
    /**
     * @description 点击展开展示全部字段数据，点击收起只展示两个
     */
    getFilterType() {
      const activeTabField = this.activeTabField;
      if (this.showMoreFilterField[activeTabField]) {
        return this.filterType[activeTabField];
      } else {
        const filterType = this.filterType[activeTabField] || {};
        let obj = {};
        let i = 0;
        for (const key in filterType) {
          const value = filterType[key];
          if (i > 1) break;
          if (Array.isArray(value)) {
            obj[key] = value;
            i++;
          }
        }
        return obj;
      }
    },
  },
  activated() {
    this.getBusStateNumber();
    this.getFilterList();
    this.initDefaultField(); //今日待跟进筛选字段
  },
  created() {
    //获取商机动态
    this.init();
    // this.getBusStateNumber();
    // this.getFilterList();
  },
  mounted() {
    this.$eventBus.$on('edit-on-submit_update-list-search', (isDelete) => {
      this.getFilterList(isDelete);
    });
  },
  beforeDestroy() {
    this.$eventBus.$off('edit-on-submit_update-list-search');
  },
  methods: {
    /**
     * @description 跳转动态
     */
    dynamicBusiness() {
      this.$router.push('/dynamic-business');
    },
    /**
     * @description 点击自定义时间
     * @param {Array} 时间组件选择后得值
     */
    changeHandle(code) {
      const activeTabField = this.activeTabField;
      const time = this.userDefinedTime[this.activeTabField][code];
      if (!time) return;
      const timeStart = dayjs(time[0]).format('YYYY-MM-DD HH:mm:ss');
      const timeEnd = dayjs(time[1]).format('YYYY-MM-DD HH:mm:ss');
      this.paramsDate[activeTabField][code + 'Start'] = timeStart;
      this.paramsDate[activeTabField][code + 'End'] = timeEnd;
      this.$eventBus.$emit('my-business_transfer-params', [
        this.paramsDate[activeTabField],
        activeTabField,
        this.searchInputParams[activeTabField],
      ]);
    },
    /**
     * @description 点击标签关闭按钮
     * @param {String} 标签得父级code
     */
    handleClose(parent) {
      const activeTabField = this.activeTabField;
      const paramsDate = this.paramsDate;
      const curPageField = this.checkedFieldList[activeTabField];
      if (['getTime', 'signTime'].includes(parent)) {
        this.userDefinedTime[activeTabField][parent] = '';
        paramsDate[activeTabField][parent + 'Start'] = undefined;
        paramsDate[activeTabField][parent + 'End'] = undefined;
      } else {
        paramsDate[activeTabField][parent] = undefined;
      }
      this.fieldActive[activeTabField][parent] = 0;
      curPageField[parent].code = undefined;
      this.$eventBus.$emit('my-business_transfer-params', [
        paramsDate[activeTabField],
        activeTabField,
        this.searchInputParams[activeTabField],
      ]);
    },
    /**
     * @description 初始化tab各个标签页的筛选字段
     */
    ininFilterField() {
      //初始化tab搜索输入字段默认为空字符串和展开和收起
      const filterType = this.filterType;
      const fieldActive = this.fieldActive;
      for (const key in MY_BUSINESS_FIELD) {
        this.$set(fieldActive, key, {});
        this.$set(filterType, key, {});
        this.$set(this.searchInputValue, key, '');
        this.$set(this.searchInputParams, key, '');
        this.$set(this.userDefinedTime, key, {});
        this.$set(this.paramsDate, key, {});
        this.$set(this.showMoreFilterField, key, false);
        //初始化固定tab标签页中各个的筛选项
        for (const iterator of MY_BUSINESS_FIELD[key]) {
          if (['getTime', 'signTime'].includes(iterator)) {
            this.$set(this.userDefinedTime[key], iterator, []);
          }
          this.$set(filterType[key], iterator, undefined);
          this.$set(fieldActive[key], iterator, 0);
        }
      }
    },
    /**
     * @description 今日待跟进筛选字段
     */
    initDefaultField() {
      const activeTabField = this.activeTabField;
      const filterType = this.filterType[activeTabField];
      //初始化固定跟进类型筛选字段
      const item = defaultMapObj[activeTabField];
      for (const key in item) {
        filterType[key] = item[key];
      }
      //请求数据字典
    },
    /**
     * @description 初始化数据
     */
    init() {
      //初始化固定tab标签页
      this.tabList = Object.freeze(TAB_LIST);
      //初始化tab搜索输入字段默认为空字符串和展开和收起
      this.ininFilterField(); //初始化第一个tab页的筛选项
    },
    /**
     * @description 综合搜索输入内容切换tab后返回保存之前输入得内容
     * @param {String} 输入框输入内容
     */
    handleInput(val) {
      this.$set(this.searchInputValue, this.activeTabField, val);
    },
    /**
     * @description 点击清空条件方法
     * @param {Event} 事件对象
     */
    clearConditionHandleClick(e) {
      e && e.stopPropagation();
      const activeTabField = this.activeTabField;
      this.checkedFieldList[activeTabField] = {};
      this.paramsDate[activeTabField] = {};
      this.userDefinedTime[activeTabField] = {};
      let fieldActive = this.fieldActive[activeTabField];
      for (const item of Object.keys(fieldActive)) {
        let value = fieldActive[item];
        if (value === 0) {
          continue;
        }
        this.$set(fieldActive, item, 0);
      }
      ///
      this.$eventBus.$emit('my-business_transfer-params', [
        this.paramsDate[activeTabField],
        activeTabField,
        this.searchInputParams[activeTabField],
      ]);
    },
    /**
     * @description 点击展开更多筛选字段
     * @param {Event} 事件对象
     */
    showMoreHandleClick(e) {
      e.stopPropagation();
      this.showMoreFilterField[this.activeTabField] = !this.showMoreFilterField[
        this.activeTabField
      ];
    },
    /**
     * @description 代理点击事件，修改当前选中active效果
     * @param {Event} 事件对象
     */
    filterListHandleClick(e) {
      const dataset = e.target.dataset;
      if (!dataset.code) return;
      const targetNodeIndex = dataset.index;
      const parentNodeCode = dataset.code;
      const active = this.activeTabField;
      const fieldActive = this.fieldActive[active];
      let fieldCode = dataset.item_code;
      fieldActive[parentNodeCode] = Number(targetNodeIndex);
      let checked = this.checkedFieldList;
      if (!checked[active]) {
        this.$set(checked, active, {});
      }
      this.$set(checked[active], parentNodeCode, {
        name: dataset.item_name,
        code: fieldCode,
        parent: parentNodeCode,
      });
      //是否转化数字
      const activeTabField = this.activeTabField;
      if (['getTime', 'signTime'].includes(parentNodeCode)) {
        if (fieldCode === 'datetime') return;
        const start = fieldCode === '' ? undefined : new FilterTime(fieldCode).time[0];
        const end = fieldCode === '' ? undefined : new FilterTime(fieldCode).time[1];
        this.paramsDate[activeTabField][parentNodeCode + 'Start'] = start;
        this.paramsDate[activeTabField][parentNodeCode + 'End'] = end;
      } else if (['isMoreDemand', 'isNoAttention'].includes(parentNodeCode)) {
        fieldCode = fieldCode === '' ? undefined : Number(fieldCode);
        this.paramsDate[activeTabField][parentNodeCode] = fieldCode;
      } else {
        this.paramsDate[activeTabField][parentNodeCode] = fieldCode;
      }
      this.$eventBus.$emit('my-business_transfer-params', [
        this.paramsDate[activeTabField],
        activeTabField,
        this.searchInputParams[activeTabField],
      ]);
    },
    /**
     * @description 获取筛选数据
     */
    getFilterList(isDelete) {
      this.loading = true;
      pc_menu()
        .then((res) => {
          if (res.code === 200) {
            res = res.data;
            this.showNode = true;
            const activeTabField = this.activeTabField;
            const item = defaultMapFilterList[activeTabField];
            for (const key in item) {
              this.$set(this.filterType[activeTabField], item[key], undefined);
              let items = res[key]?.items || [];
              if (items.length > 0) {
                if (key === 'BIZ_GROUP_CODE') {
                  items.reverse();
                  const groupIndex = items.findIndex((it) => {
                    return it.code == this.paramsDate[activeTabField].groupId;
                  });
                  this.$set(
                    this.fieldActive[activeTabField],
                    'groupId',
                    groupIndex > 0 ? groupIndex + 1 : groupIndex === 0 ? 1 : 0,
                  );
                }
                items.unshift({ text: '不限', code: undefined });
                this.$set(this.filterType[activeTabField], item[key], items);
              }
            }
            if (isDelete < 0) {
              this.handleClose('groupId');
            }
          } else {
            this.$message.warning(res.message);
          }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
          this.showNode = true;
        });
    },
    /**
     * @description 获取商机动态数量
     */
    getBusStateNumber() {
      countUnRead().then((res) => {
        if (res.code === 200) {
          res = res.data;
          this.stateNumber = res || 0;
        } else {
          this.$message.warning(res.message);
        }
      });
    },
    /**
     * @description 点击综合搜索清空其他筛选项
     */
    clearSearchAll() {
      //初始化固定tab标签页中各个的筛选项
      const activeTabField = this.activeTabField;
      for (const iterator of MY_BUSINESS_FIELD[activeTabField]) {
        this.$set(this.filterType[activeTabField], iterator, undefined);
        this.$set(this.fieldActive[activeTabField], iterator, 0);
      }
    },
    /**
     * @description 点击输入框清楚按钮
     * @param {Event} 事件对象
     */
    clearInputHandle(content) {
      this.handleSearch(content);
    },
    /**
     * @description 点击综合搜索
     * @param {Event} 事件对象
     */
    handleSearch(content) {
      const activeTabField = this.activeTabField;
      this.paramsDate[activeTabField] = {};
      this.clearConditionHandleClick();
      this.$set(this.searchInputParams, activeTabField, content);
      const paramArr = [
        this.paramsDate[activeTabField], //除了综合搜索的筛选字段
        activeTabField, //当前选择的tab页
        content, //综合搜索数据
      ];
      this.$eventBus.$emit('my-business_transfer-params', paramArr);
    },
    /**
     * @description tab切换方法
     * @param {String} 用于选中效果
     * @param {String} tab页得code
     */
    tabHandleClick(index, code) {
      this.showNode = false;
      this.tabActive = index;
      this.activeTabField = code;
      this.showMoreFilterField[code] = false;
      this.initDefaultField();
      this.getFilterList();
      this.$eventBus.$emit('my-business_transfer-params', [
        this.paramsDate[code],
        code,
        this.searchInputParams[code],
        'clearSort',
      ]);
    },
  },
};
