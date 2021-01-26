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
  beforeRouteLeave(to, from, next) {
    if (to.path == '/business-details') {
      //缓存
      from.meta.keepAlive = true;
    } else {
      //不缓存
      from.meta.keepAlive = false;
    }
    next();
  },
  data() {
    return {};
  },

  methods: {},
};
</script>
