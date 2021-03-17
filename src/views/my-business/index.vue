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
  inject: ['reload'],
  beforeRouteLeave(to, from, next) {
    //缓存
    if (to.path == '/my-business/business-details') {
      if (!from.meta.keepAlive) from.meta.keepAlive = true;
    } else {
      this.reload();
      //不缓存
      // from.meta.keepAlive = false;
    }
    next();
  },
  data() {
    return {};
  },

  methods: {},
};
</script>
