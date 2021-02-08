import Vue from 'vue';

export const store = Vue.observable({ fieldParams: {} });
export const mutations = {
  setFieldParams(tabActive, fieldCode, fieldChildCode) {
    if (!store.fieldParams[tabActive]) {
      Vue.set(store.fieldParams, tabActive, {});
    }
    Vue.set(store.fieldParams[tabActive], fieldCode, fieldChildCode);
  },
  clearFieldParams(tabActive) {
    store.fieldParams[tabActive] = {};
    // Vue.set(store.fieldParams, tabActive, {});
    mutations.setFieldParams(this.tabActiveProp, 'acceptStatus', 'waitAccept');
  },
};
