import { store, mutations, actions } from './observable';

import './index.scss';

export default {
  props: {
    //展示已选择项
    isShowSelection: {
      type: Boolean,
      default: false,
    },
    //tab图标
    isShowIcon: {
      type: Boolean,
      default: false,
    },
    //展开收起
    isShowMore: {
      type: Boolean,
      default: false,
    },
    //传入list
    tabList: {
      type: Array,
      default: [],
    },
    tabActiveProp: {
      type: String,
      default: '0',
    },
    changeFiled: {
      type: Array,
      default: () => ['buildStatus', 'receiveStatus'],
    },
  },
  data() {
    return {
      //请求参数
      listSearchLoading: false,
      tabActive: this.tabActiveProp, //当前选中tab页
      curPageActive: {},
      dateFlag: {}, //控制自定义时间显示隐藏
      datetime: {
        [this.tabActiveProp]: {},
      },
      fieldCode: undefined,
      fieldChildCode: undefined,
    };
  },
  computed: {
    tabActiveItem() {
      return this.tabList.find((item) => item.code === this.tabActive);
    },
    fieldParams() {
      return store.fieldParams[this.tabActive] || {};
    },
  },
  activated() {
    mutations.setActiveTab(this.tabActive);
    actions.getDataList();
    //服务主应用抢单，抢单成功后查看商机如果在当前页面路由没有变化参数变化后不刷新
    if (this.$route.path === '/cooperation-alliance-clients') {
      this.unwatch = this.$watch('$route.query', (newValue) => {
        if (Object.keys(newValue).length) {
          this.initGetData();
          const tabActive = this.tabActive;
          this.curPageActive[tabActive] = this.tabActiveItem.curPageActive;
          this.$set(this.dateFlag, tabActive, undefined);
          this.datetime = {};
          this.$set(this.datetime, this.tabActiveProp, {});
        }
      });
    }
  },
  deactivated() {
    this.unwatch();
  },
  created() {
    const tabActive = this.tabActive;
    this.curPageActive[tabActive] = this.tabActiveItem.curPageActive;
  },
  methods: {
    initGetData() {
      this.tabActive = this.tabActiveProp;
      mutations.clearFull();
      mutations.setActiveTab(this.tabActive);
      actions.getDataList();
    },
    /**
     * @description 定义一个方法清空时间选中
     */
    clearDefaultCheck() {},
    /**
     * @description 渲染tab页方法
     */
    genTab() {
      const { isShowMore } = this;
      return (
        <div class="tab-container">
          {this.genTabItem()}
          {isShowMore ? this.genShowMore() : ''}
        </div>
      );
    },

    /**
     * @description 渲染筛选项
     */
    genFilter() {
      const { isShowSelection } = this;
      return (
        <div on-click={this.filterHandleClick}>
          {isShowSelection ? this.genSelection() : ''}
          {this.genFilterItem()}
        </div>
      );
    },
    /**
     * @description 渲染自定义时间
     */
    genDateTime(type) {
      return (
        <div class="date-picker">
          <el-date-picker
            value={this.datetime[this.tabActive][type]}
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            data-tid="dynamicSureDate"
            onInput={(e) => {
              this.sureDate(e, type);
            }}
          />
        </div>
      );
    },
    /**
     * @description 渲染筛选项
     */
    genFilterItem() {
      const tabActiveItem = this.tabActiveItem;
      const curPageActive = this.curPageActive[this.tabActive];
      let filter, filterItem;
      if (Array.isArray(tabActiveItem.filter)) {
        filter = tabActiveItem.filter;
        filterItem = tabActiveItem.filterItem;
      } else {
        filter = tabActiveItem.filter[curPageActive];
        filterItem = tabActiveItem.filterItem[curPageActive];
      }
      return filter?.map((item) => {
        return (
          <div class="filter-container">
            <div class="filter-container_title">{item.name}</div>
            {filterItem[item.code]?.map((child, index) => {
              return (
                <div
                  class={{
                    'filter-item': true,
                    'filter-item_active': ['receive', 'create'].includes(item.code)
                      ? this.dateFlag[this.tabActive] == child.code
                      : this.fieldParams[item.code] == child.code,
                  }}
                  data-field-code={item.code}
                  data-field-child-code={child.code}
                  data-cur-page-code={child.curPage}>
                  {child.name}
                </div>
              );
            })}
            {['receive', 'create'].includes(item.code) &&
            this.dateFlag[this.tabActive] === 'datetime'
              ? this.genDateTime(item.code)
              : ''}
          </div>
        );
      });
    },

    /**
     * @description tab页切换
     */
    tabHandleClick(e) {
      const code = e.target.dataset.code;
      if (!code) return;
      this.tabActive = code;
      mutations.setActiveTab(code);
      if (!Object.hasOwnProperty.call(this.datetime, this.tabActive)) {
        this.$set(this.datetime, code, {});
      }
      mutations.clearSortParams();
      mutations.setDefaultPage();
      this.$emit('clear-sort');
      const curPageActive = this.curPageActive;
      if (!curPageActive[code]) {
        curPageActive[code] = this.tabActiveItem.curPageActive;
      }
      actions.getDataList();
    },
    /**
     * @description 自定义事件点击
     */
    sureDate(e, type) {
      this.$set(this.datetime[this.tabActive], type, e);
      mutations.setFieldTimeParams(this.tabActive, type, e);
    },
    /**
     * @description 筛选项点击事件
     */
    filterHandleClick(e) {
      const dataset = e.target.dataset;
      this.fieldCode = dataset.fieldCode;
      this.fieldChildCode = dataset.fieldChildCode;
      const curPageCode = dataset.curPageCode;
      console.log(tabActive, this.fieldCode, this.fieldChildCode, '状态11111');
      if (!this.fieldCode) return;
      const tabActive = this.tabActive;
      //清空排序参数
      console.log(this.fieldChildCode, '789789789');
      this.$emit('clear-sort');

      if (this.changeFiled.includes(this.fieldCode)) {
        this.curPageActive[tabActive] = curPageCode;
        mutations.clearCurTab(tabActive);
        this.$set(this.dateFlag, tabActive, undefined);
        this.$set(this.datetime, tabActive, {});
      }
      if (['receive', 'create'].includes(this.fieldCode)) {
        if (this.fieldChildCode == 'datetime') {
          this.$set(this.dateFlag, tabActive, 'datetime');
          return;
        } else {
          this.$set(this.dateFlag, tabActive, this.fieldChildCode);
          mutations.setTimeParams(tabActive, this.fieldCode, this.fieldChildCode);
          this.$set(this.datetime, tabActive, {});
          return;
        }
      }
      mutations.setFieldParams(tabActive, this.fieldCode, this.fieldChildCode);
      mutations.clearSortParams(this.fieldChildCode);
      actions.getDataList();
    },

    /**
     * @description tab栏
     */
    genTabItem() {
      const { tabActive } = this;
      return this.tabList.map((item, index) => {
        return (
          <div class="tab-container_item" on-click={this.tabHandleClick}>
            <div
              class={{
                'tab-container_item-box': true,
                'tab-container_item-box_active': tabActive === item.code,
              }}>
              <div class="tab-container_item-box_name" data-code={item.code}>
                {item.name}
              </div>
              {this.genIcon(item)}
            </div>
          </div>
        );
      });
    },

    /**
     * @description 图标dom
     * @param {Object} 循环的当前项
     * @returns {Dom} dom元素
     */
    genIcon(item) {
      if (!this.isShowIcon) return;
      return (
        <el-tooltip
          data-tid="searchTooltip"
          open-delay={400}
          effect="dark"
          content={item.tooltip}
          placement="top-start"
          popper-class="show-tooltip">
          <i class="iconfont-qds-crm icon-question"></i>
        </el-tooltip>
      );
    },
  },
  render(h) {
    return (
      <div>
        {this.genTab()}
        {this.genFilter()}
      </div>
    );
  },
};
