import { get_shujuzidian } from 'api/cooperation-in-page';
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
      curPageActive: 'waitAccept',
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
    mutations.setFieldParams(this.tabActiveProp, 'acceptStatus', 'waitAccept');
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
     * @description 渲染筛选项
     */
    genFilterItem() {
      const tabActiveItem = this.tabActiveItem;
      const curPageActive = this.curPageActive;
      const filter = tabActiveItem.filter[curPageActive];
      const filterItem = tabActiveItem.filterItem[curPageActive];
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
    },
    /**
     * @description
     * @param {}
     * @returns {}
     */
    filterHandleClick(e) {
      const dataset = e.target.dataset;
      const fieldCode = dataset.fieldCode;
      const fieldChildCode = dataset.fieldChildCode;
      if (!fieldCode) return;
      if (fieldCode === 'acceptStatus') {
        this.curPageActive = dataset.fieldChildCode;
        mutations.clearFieldParams(this.tabActive);
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
