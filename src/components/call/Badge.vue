<template>
  <span class="sp-badge">
    <span class="sp-badge-status-dot" :class="`sp-badge-status-${status}`"></span>
    <span class="sp-badge-status-text">
      <slot></slot>
    </span>
  </span>
</template>

<script>
export default {
  name: 'Badge',
  props: {
    status: {
      type: String,
      default: 'success',
    },
  },
};
</script>

<style lang="scss" scoped>
.sp-badge {
  position: relative;
  display: inline-block;
  line-height: inherit;
  vertical-align: baseline;
  &-status-dot {
    position: relative;
    top: -1px;
    display: inline-block;
    width: 6px;
    height: 6px;
    vertical-align: middle;
    border-radius: 50%;
  }
  &-status-success {
    background-color: #52c41a;
  }
  &-status-warning {
    background-color: #faad14;
  }
  &-status-error {
    background-color: #ff4d4f;
  }
  &-status-text {
    margin-left: 8px;
    font-size: 12px;
  }
}
</style>
