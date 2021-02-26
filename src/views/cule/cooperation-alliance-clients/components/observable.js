import Vue from 'vue';
import dayjs from 'dayjs';
import { get_page } from 'api/cooperation-in-page';
export const store = Vue.observable({
  fieldParams: {},
  tableData: {
    total: 0,
    list: [],
  },
});
export const mutations = {
  setFieldParams(tabActive, fieldCode, fieldChildCode) {
    if (!store.fieldParams[tabActive]) {
      Vue.set(store.fieldParams, tabActive, {});
    }
    Vue.set(store.fieldParams[tabActive], fieldCode, fieldChildCode);
  },
  setFieldTimeParams(active, type, time) {
    store.fieldParams[active][type + 'StartTime'] = time
      ? dayjs(time[0]).format('YYYY-MM-DD ') + '00:00:00'
      : undefined;
    store.fieldParams[active][type + 'EndTime'] = time
      ? dayjs(time[1]).format('YYYY-MM-DD ') + '23:59:59'
      : undefined;
  },
  clearFieldParams(tabActive) {
    store.fieldParams[tabActive] = {};
    mutations.setFieldParams(this.tabActiveProp, 'acceptStatus', 'waitAccept');
  },
};
export const actions = {
  async getDataList(active) {
    const { data, code, message } = await get_page(store.fieldParams[active]);
    if (code !== 200) return Vue.prototype.$message.warning(message);
    const { records, totalCount } = data;
    console.log(records, totalCount, 'list,totalCount');
    store.tableData.list = records;
    store.tableData.total = Number(totalCount);
    console.log(store.tableData, '========-==');
  },
};
