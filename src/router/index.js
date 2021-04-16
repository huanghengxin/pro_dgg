/**
 * 路由模块
 * @author chenmb
 * @since 2020/11/12
 */
import Vue from 'vue';
import VueRouter from 'vue-router';
import routers from '@/router/routers';
import store from '@/store';
import { keepAliveList } from 'constants/index';
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
const cacheList = keepAliveList;
router.beforeEach((to, from, next) => {
  console.log('前', store.state['keep-alive'].cacheList);
  if (cacheList.includes(to.name)) {
    if (cacheList.includes(from.name)) {
      store.dispatch(
        'keep-alive/clearKeepAlive',
        cacheList.find((_) => _ === from.name),
      );
    }
    store.dispatch('keep-alive/setKeepAlive', to.name);
  } else if (to.path == '/my-business/business-details') {
    store.dispatch('keep-alive/setKeepAlive', from.name);
  } else {
    store.dispatch(
      'keep-alive/clearKeepAlive',
      cacheList.find((_) => _ === from.name),
    );
  }
  console.log('后', store.state['keep-alive'].cacheList);
  next();
});

export default router;
