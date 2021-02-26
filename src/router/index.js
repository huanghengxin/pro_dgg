/**
 * 路由模块
 * @author chenmb
 * @since 2020/11/12
 */
import Vue from 'vue';
import VueRouter from 'vue-router';
import routers from '@/router/routers';
import store from '@/store';
Vue.use(VueRouter);

const routes = routers;

//  修改路由push方法,阻止重复点击报错
const VueRouterPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(to) {
  return VueRouterPush.call(this, to).catch((err) => err);
};

const router = new VueRouter({
  mode: 'hash',
  routes: routes,
});

router.beforeEach((to, from, next) => {
  if (to.path == '/my-business' || to.path == '/my-business/business-details') {
    store.dispatch('keep-alive/setKeepAlive', 'MyBusiness');
  } else {
    store.dispatch('keep-alive/clearKeepAlive', 'MyBusiness');
  }
  // 如果用户未能验证身份，则 `next` 会被调用两次
  next();
});

export default router;
