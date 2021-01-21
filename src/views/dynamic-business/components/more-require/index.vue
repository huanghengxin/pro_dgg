<template>
  <div class="more-rquire">
    <div v-for="(item, index) in litterRequireList" :key="index + 'need'">
      <div v-if="requireId" @click="handleNeedDetails(requireId)">
        <show-tooltip
          tooltip-class="text-decoration"
          :text="handleIntentionName(item)"
          :width="240"
        ></show-tooltip>
      </div>
      <show-tooltip v-else :text="handleIntentionName(item)" :width="240"></show-tooltip>
    </div>
    <span
      v-show="requireList.length > 3"
      class="more-rquire_blue"
      data-tid="dynamicLoadMore"
      @click="loadMore"
    >
      更多<i :class="isArrow ? 'el-icon-arrow-down' : 'el-icon-arrow-right'"></i>
    </span>
  </div>
</template>

<script>
import ShowTooltip from 'components/show-tooltip';

export default {
  name: 'MoreRequire',
  components: {
    ShowTooltip,
  },
  inject: ['parentLoadMore'],
  props: {
    requireItem: {
      type: String,
      default: '',
    },
    requireProgress: {
      type: String,
      default: '',
    },
    isSeparate: {
      type: Boolean,
      default: false,
    },
    symbol: {
      type: String,
      default: ',',
    },
    isSignOrder: {
      type: String,
      default: '',
    },
    requireId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      isArrow: false,
    };
  },
  computed: {
    litterRequireList() {
      return this.requireList?.slice(0, 3) || [];
    },
    requireList() {
      if (this.isSeparate) {
        let requireList = this.requireItem?.split(this.symbol);
        if (!Array.isArray(requireList)) return;
        let requireProgress;
        if (this.requireProgress) {
          requireProgress = this.requireProgress?.split(',');
        }
        return requireList.reduce((acc, cur, index) => {
          const obj = {
            intentionName: cur,
          };
          if (requireProgress) {
            obj.signTime = requireProgress[index] === 'CRM_BIZ_PROGRESS_SIGN_ORDER' ? true : null;
          }
          acc.push(obj);
          return acc;
        }, []);
      } else {
        let requireList = JSON.parse(this.requireItem);
        if (this.isSignOrder === 'SIGN_ORDER') {
          return requireList?.filter((item) => {
            return item.signTime;
          });
        } else {
          return Array.isArray(requireList) ? requireList : [];
        }
      }
    },
  },
  mounted() {
    this.$eventBus.$on('closed-more', () => {
      this.closedMore();
    });
  },
  beforeDestroy() {
    this.$eventBus.$off('closed-more');
  },
  methods: {
    handleNeedDetails(id) {
      this.$emit('open-details', id);
    },
    /**
     * @description 公共库需求点击详情
     */
    handleIntentionName(item) {
      if (this.isSignOrder === 'SIGN_ORDER') {
        return item.intentionName + '（' + item.signTime + '）';
      } else {
        return item.signTime ? item.intentionName + '（已签）' : item.intentionName;
      }
    },
    loadMore() {
      this.isArrow = true;
      this.parentLoadMore(this.requireList);
    },
    closedMore() {
      this.isArrow = false;
    },
  },
};
</script>
<style lang="scss" scoped>
.more-rquire {
  &_blue {
    color: #4974f5;
    cursor: pointer;
  }
}
</style>
