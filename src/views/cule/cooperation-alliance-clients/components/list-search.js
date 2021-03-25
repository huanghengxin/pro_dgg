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
      default: '1',
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
      datetime: '',
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
  created() {
    const tabActive = this.tabActive;
    this.curPageActive[tabActive] = this.tabActiveItem.curPageActive;
    mutations.setActiveTab(tabActive);
    actions.getDataList();
  },
  methods: {
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
            value={this.datetime}
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
      return filter.map((item) => {
        return (
          <div class="filter-container">
            <div class="filter-container_title">{item.name}</div>
            {filterItem[item.code].map((child, index) => {
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
      this.datetime = e;
      mutations.setFieldTimeParams(this.tabActive, type, e);
    },
    /**
     * @description 筛选项点击事件
     */
    filterHandleClick(e) {
      const dataset = e.target.dataset;
      const fieldCode = dataset.fieldCode;
      const fieldChildCode = dataset.fieldChildCode;
      const curPageCode = dataset.curPageCode;
      if (!fieldCode) return;
      const tabActive = this.tabActive;
      //清空排序参数
      mutations.clearSortParams();
      this.$emit('clear-sort');

      if (this.changeFiled.includes(fieldCode)) {
        this.curPageActive[tabActive] = curPageCode;
      }
      if (['receiveStatus', 'buildStatus'].includes(fieldCode)) {
        console.log(tabActive, fieldCode, fieldChildCode, '状态');
        mutations.setDefaultSort(tabActive, fieldCode, fieldChildCode);
      }
      if (['receive', 'create'].includes(fieldCode)) {
        if (fieldChildCode == 'datetime') {
          this.$set(this.dateFlag, tabActive, 'datetime');
          return;
        } else {
          this.$set(this.dateFlag, tabActive, fieldChildCode);
          mutations.setTimeParams(tabActive, fieldCode, fieldChildCode);
          return;
        }
      }
      mutations.setFieldParams(tabActive, fieldCode, fieldChildCode);
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
