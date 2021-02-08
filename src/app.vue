<template>
  <div id="app">
    <template v-if="isRouterAlive">
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive" />
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive" />
    </template>
  </div>
</template>
<script>
export default {
  name: 'App',
  provide() {
    //父组件中通过provide来提供变量，在子组件中通过inject来注入变量。
    return {
      reload: this.reload,
    };
  },

  data() {
    return {
      isRouterAlive: true, //控制视图是否显示的变量
    };
  },
  created() {},
  methods: {
    reload() {
      this.isRouterAlive = false; //先关闭，
      this.$nextTick(function() {
        this.isRouterAlive = true; //再打开
      });
    },
  },
};
</script>
