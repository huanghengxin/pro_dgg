<template>
  <div class="my-business">
    <list-search></list-search>
    <business-list></business-list>
  </div>
</template>

<script>
import ListSearch from './components/list-search/index.vue';
import BusinessList from './components/business-list/index.vue';
export default {
  name: 'MyBusiness',
  components: {
    ListSearch,
    BusinessList,
  },
};
</script>
