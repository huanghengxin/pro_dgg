<template>
  <div class="search-list">
    <div v-if="searchData.length > 0" class="search-list__item">
      <span class="lable">{{ lable }}</span>
      <span
        v-for="item in searchData"
        :key="item.code"
        :class="{
          'filter-item': true,
          'filter-item_active': item.code === active,
        }"
        data-tid="customerChangeCuleStatus"
        @click="filterTag(item, activeType)"
      >
        {{ item.name }}
      </span>
    </div>
  </div>
</template>

<script>
import './index.scss';

export default {
  components: {},
  props: {
    searchData: {
      type: Array,
      default: null,
    },
    active: {
      type: String,
      default: '',
    },
    lable: {
      type: String,
      default: '',
    },
    activeType: {
      type: String,
      default: '',
    },
  },
  data() {
    return {};
  },
  created() {},
  methods: {
    /**
     * @description  筛选项点击事件
     */
    filterTag(item, activeType) {
      this.$emit('active-handle', [item.code, activeType]);
    },
  },
};
</script>
