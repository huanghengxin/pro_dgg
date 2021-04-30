import SvgIcon from 'components/svg-icon';
import './index.scss';
export default {
  components: {
    SvgIcon,
  },
  props: {
    defaultConut: {
      type: [Number, String],
      default: '10',
    },
    maxHeight: {
      type: String,
    },
    loadCallBack: {
      type: [Object, Function],
    },
    minHeight: {
      type: String,
    },
    scrollClass: {
      type: String,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      status: false,
      noDataFlag: false,
      noMore: false,
      load: false,
    };
  },
  watch: {
    loading: {
      handler(val) {
        this.load = val ? true : false;
      },
      immediate: true,
    },
  },
  mounted() {
    const options = {
      root: this.$refs.content,
    };
    this.observer = new IntersectionObserver(this.initIntersectionObserver, options);
  },

  methods: {
    genLoading() {
      return (
        <transition name="loading-fade">
          <div class="loading-model">
            <div class="loading-spinner">
              <svg class="circular" viewBox="25 25 50 50">
                <circle class="path" cx="50" cy="50" r="20" fill="none" />
              </svg>
            </div>
          </div>
        </transition>
      );
    },
    initIntersectionObserver(entries) {
      if (this.status) return;
      if (this.noMore) {
        this.observer.unobserve(this.lastItem);
        this.$on('hook:destoryed', () => {
          this.observer.disconnect();
          this.observer = null;
        });
        return;
      }
      entries.forEach((element) => {
        if (element.isIntersecting && element.intersectionRatio > 0) {
          const loadCallBack = this.loadCallBack;
          if (loadCallBack) {
            console.log('执行了');
            try {
              this.status = true;
              loadCallBack();
            } catch (error) {
              console.log(error, '停止');
              this.observer.unobserve(this.lastItem);
            }
          } else {
            console.error(new Error('请传入加载函数'));
          }
        }
      });
    },
    genLoad() {
      return (
        <div class="load">
          <i class="el-icon-loading"></i>
          加载中...
        </div>
      );
    },
    genNoMore() {
      return <div class="no-more">没有更多了</div>;
    },
    /**
     * @description 监听
     */
    runObserve() {
      const defaultSlot = this.$slots.default;
      this.$nextTick(() => {
        if (defaultSlot?.length >= this.defaultConut) {
          this.lastItem = Object.freeze(defaultSlot[defaultSlot.length - 1].elm);
          if (this.lastItem) {
            this.observer.disconnect();
            this.observer.observe(this.lastItem);
          }
        }
      });
    },
    /**
     * @description 数据加载失败方法回调
     */
    loadFail() {
      this.load = false;
      this.$emit('update:loading', false);
      this.status = false;
    },
    changeNoDataFlag() {
      this.noDataFlag = false;
    },
    /**
     * @description 数据加载成功方法回调
     * @param {Array} 列表数据
     * @param {Number} 返回的数据长度
     */
    loadSuccess(list, num) {
      this.load = false;
      this.$emit('update:loading', false);
      if (!Array.isArray(list)) {
        console.error(new Error('传入列表数据不是一个数组'));
        return;
      }
      if (list.length === 0) {
        this.noDataFlag = true;
      } else {
        this.noDataFlag = false;
        if (num < this.defaultConut) {
          this.noMore = true;
        }
      }
      this.status = false;
    },
    /**
     * @description 滚动容器
     */
    genScrollContainer() {
      this.runObserve();
      const { maxHeight, minHeight, status, noMore, noDataFlag, scrollClass, load } = this;
      const slots = this.$slots;
      return (
        <div
          ref="content"
          style={{ 'max-height': maxHeight, 'min-height': minHeight }}
          class={['scroll-container', scrollClass]}>
          {slots.default}
          {status ? slots.load || this.genLoad() : ''}
          {noMore ? slots.noMore || this.genNoMore() : ''}
          {load ? this.genLoading() : ''}
          {noDataFlag ? (
            <div class="empty">
              <svg-icon type="nodata" icon="icon-icon_nodata" />
            </div>
          ) : (
            ''
          )}
        </div>
      );
    },
  },
  render() {
    return this.genScrollContainer();
  },
};
