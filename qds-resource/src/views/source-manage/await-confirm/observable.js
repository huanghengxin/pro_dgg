import Vue from 'vue';
export const store = Vue.observable({
  recordsObj: {},
});
export const mutations = {
  setRecordsObj(obj) {
    store.recordsObj = obj;
  },
  clearRecordsObj() {
    store.recordsObj = {};
  },
};
