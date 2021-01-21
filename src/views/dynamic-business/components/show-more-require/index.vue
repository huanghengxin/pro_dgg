<template>
  <!-- 展示更多弹出框 -->
  <el-dialog
    :close-on-click-modal="false"
    title="更多需求"
    :visible.sync="dialogVisible"
    width="480px"
    @closed="dialogColsed"
  >
    <div class="more-dialog">
      <template v-for="(item, index) in requireList">
        <div :key="index + 'dialog'" class="more-dialog_item">
          <show-tooltip
            v-if="dialogVisible"
            :text="handleIntentionName(item)"
            :width="230"
          ></show-tooltip>
        </div>
      </template>
    </div>
  </el-dialog>
</template>

<script>
import ShowTooltip from 'components/show-tooltip';
export default {
  name: 'ShowMoreRequire',
  components: {
    ShowTooltip,
  },
  props: {
    isSignOrder: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      dialogVisible: false,
      requireList: [],
    };
  },
  methods: {
    handleIntentionName(item) {
      if (this.isSignOrder === 'SIGN_ORDER') {
        return item.intentionName + '（' + item.signTime + '）';
      } else {
        return item.signTime ? item.intentionName + '（已签）' : item.intentionName;
      }
    },
    openModal(item) {
      this.requireList = item;
      this.dialogVisible = true;
    },
    dialogColsed() {
      this.$eventBus.$emit('closed-more');
    },
  },
};
</script>

<style lang="scss" scoped>
.el-dialog__body {
  .more-dialog {
    display: flex;
    flex-wrap: wrap;
    padding-bottom: 16px;
    max-height: 430px;
    overflow-y: scroll;
    &::-webkit-scrollbar {
      display: none;
    }
    &_item {
      width: max-content;
      flex-shrink: 0;
      background: #f2f2f2;
      border-radius: 2px;
      margin: 8px 8px;
      color: #555555;
      padding: 3px 8px;
      line-height: 19px;
    }
  }
}
</style>
