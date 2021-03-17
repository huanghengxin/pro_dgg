import Vue from 'vue';

export const storeError = Vue.observable({
  errorList: [],
  rowIndex: '',
});
export const mutations = {
  saveErrorList(value) {
    storeError.errorList = value;
  },
  deleteErrorList(rowIndex) {
    storeError.errorList.splice(rowIndex, 1);
  },
};
