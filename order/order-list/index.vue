<template>
  <div class="order-list">
    <order-list-search></order-list-search>
    <order-list-content></order-list-content>
  </div>
</template>
<script>
import OrderListSearch from './components/order-list-search';
import OrderListContent from './components/order-list-content';
export default {
  components: {
    OrderListSearch,
    OrderListContent,
  },
};
</script>
<style></style>
