<template>
  <div id="app">
    <template v-if="isRouterAlive">
      <router-view />
    </template>
  </div>
</template>
<script>
import mainApplicationStyle from 'assets/main-application';
export default {
  name: 'App',
  provide() {
    //父组件中通过provide来提供变量，:include="" 在子组件中通过inject来注入变量。
    return {
      reload: this.reload,
    };
  },
  data() {
    return {
      isRouterAlive: true, //控制视图是否显示的变量
    };
  },
  created() {
    this.$mainService?.addStyle(mainApplicationStyle);
    if (!window.SP_MICRO_FE) {
      const style = document.createElement('style');
      style.textContent = mainApplicationStyle;
      document.head.appendChild(style);
    }
  },
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
