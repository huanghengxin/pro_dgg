import { keepAliveList } from 'constants/index';
export default {
  namespaced: true,
  state: {
    cacheList: keepAliveList.concat(),
  },

  mutations: {
    // 设置父应用信息
    PUSH_COMPONENTS_CACHELIST({ cacheList }, data) {
      if (cacheList.find((_) => _ === data)) return;
      if (Array.isArray(data)) {
        cacheList.concat(data);
      } else {
        cacheList.push(data);
      }
    },
    CLEAR_COMPONENTS_CACHELIST({ cacheList }, data) {
      const index = cacheList.findIndex((_) => _ === data);
      if (index >= 0) {
        cacheList.splice(index, 1);
      }
    },
  },
  actions: {
    // 设置父应用信息
    setKeepAlive({ commit }, data) {
      commit('PUSH_COMPONENTS_CACHELIST', data);
    },
    clearKeepAlive({ commit }, data) {
      commit('CLEAR_COMPONENTS_CACHELIST', data);
    },
  },
};
