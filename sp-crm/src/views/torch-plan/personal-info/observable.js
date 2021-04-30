import Vue from 'vue';

export const storePeopleList = Vue.observable({
  dataList: {},
  rowIndex: '',
});
export const mutations = {
  saveDataList(value) {
    storePeopleList.dataList = value;
  },
  deleteErrorList(rowIndex) {
    storePeopleList.dataList.splice(rowIndex, 1);
  },
};
