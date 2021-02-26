import { store, mutations } from './observable';
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
      default: 'DJS',
    },
  },
  data() {
    return {
      //请求参数
      listSearchLoading: false,
      tabActive: this.tabActiveProp, //当前选中tab页
      curPageActive: '',
      dateFlag: false, //控制自定义时间显示隐藏
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
    this.curPageActive = this.tabActiveItem.curPageActive;
    mutations.setFieldParams(this.tabActiveProp, 'acceptStatus', 'waitAccept');
    console.log(this.tabActiveProp, 'this.tabActiveProp');
  },
  methods: {
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
    genDateTime() {
      return (
        <div class="date-picker">
          <el-date-picker
            value={this.datetime}
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            data-tid="dynamicSureDate"
            onInput={this.sureDate}
          />
        </div>
      );
    },
    /**
     * @description 渲染筛选项
     */
    genFilterItem() {
      const tabActiveItem = this.tabActiveItem;
      const curPageActive = this.curPageActive;
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
                    'filter-item_active': this.fieldParams[item.code] == child.code,
                  }}
                  data-field-code={item.code}
                  data-field-child-code={child.code}>
                  {child.name}
                </div>
              );
            })}
            {this.dateFlag && item.code == 'acceptTime' ? this.genDateTime() : ''}
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
      console.log(this.tabActive, 'this.tabActive');
      this.curPageActive = this.tabActiveItem.curPageActive;
    },
    /**
     * @description 自定义事件点击
     */
    sureDate(e) {
      mutations.setFieldTimeParams(this.tabActive, '', e);
    },
    /**
     * @description 筛选项点击事件
     */
    filterHandleClick(e) {
      const dataset = e.target.dataset;
      const fieldCode = dataset.fieldCode;
      const fieldChildCode = dataset.fieldChildCode;
      console.log(dataset.fieldCode, dataset.fieldChildCode);
      if (!fieldCode) return;
      if (
        fieldCode === 'acceptStatus' ||
        (fieldCode === 'buildStatus' && fieldChildCode === 'builded')
      ) {
        this.curPageActive = fieldChildCode;
        mutations.clearFieldParams(this.tabActive);
      }
      //如果父類code是acceptStatus 并且 未自定義時間
      if (fieldCode == 'acceptTime' && fieldChildCode == 'datetime') {
        this.dateFlag = true;
      } else {
        this.dateFlag = false;
      }
      mutations.setFieldParams(this.tabActive, fieldCode, fieldChildCode);
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
