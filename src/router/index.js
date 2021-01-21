/**
 * 路由模块
 * @author chenmb
 * @since 2020/11/12
 */
import Vue from 'vue';
import VueRouter from 'vue-router';
import routers from '@/router/routers';
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

export default router;
