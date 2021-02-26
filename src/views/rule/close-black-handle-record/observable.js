import Vue from 'vue';
import dayjs from 'dayjs';
import { limit_log_list } from 'api/close-black-limit';
export const store = Vue.observable({
  fieldParams: {
    start: 1,
    limit: 10,
  },
  handleRecordTable: {
    data: [],
    total: 0,
  },
  loading: false,
});
export const mutations = {
  setFieldParams(value) {
    const { handlePeople, handleObject, merchantName, ...values } = value;
    store.fieldParams = { ...store.fieldParams, ...values };
    store.fieldParams.createrId = handlePeople?.mchUserId;
    store.fieldParams.plannerId = handleObject?.mchUserId;
    store.fieldParams.mchId = merchantName?.id;
    action.getDataList();
  },
  setPageChangeParams(type, value) {
    store.fieldParams[type] = value;
  },
  setFieldTimeParams(type, time) {
    store.fieldParams[type + 'StartTime'] = time
      ? dayjs(time[0]).format('YYYY-MM-DD ') + '00:00:00'
      : undefined;
    store.fieldParams[type + 'EndTime'] = time
      ? dayjs(time[1]).format('YYYY-MM-DD ') + '23:59:59'
      : undefined;
  },
  clearFieldParams() {
    const { limit } = store.fieldParams;
    store.fieldParams = {
      start: 1,
      limit,
    };
    action.getDataList();
  },
  clearField() {
    store.fieldParams = {
      start: 1,
      limit: 10,
    };
  },
};

export const action = {
  getDataList() {
    store.loading = true;
    limit_log_list(store.fieldParams)
      .then((res) => {
        if (res.code === 200) {
          const { records = [], totalCount = 0 } = res.data;
          store.handleRecordTable.data = records;
          store.handleRecordTable.total = totalCount;
        } else {
          Vue.prototype.$message.warning(res.message);
        }
        store.loading = false;
      })
      .catch(() => {
        store.loading = false;
      });
  },
};
