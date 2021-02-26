import Vue from 'vue';

export const storeError = Vue.observable({
  errorList: [],
  rowIndex: '',
  failTotal: 0,
  succeedTotal: 0,
});
export const mutations = {
  saveErrorList(value) {
    storeError.errorList = value;
  },
  deleteErrorList(rowIndex) {
    storeError.errorList.splice(rowIndex, 1);
  },
};
