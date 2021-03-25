import Vue from 'vue';
import dayjs from 'dayjs';
import { get_page } from 'api/cooperation-in-page';
import stores from 'storejs';
import FilterTime from 'utils/filter-time';

const map = {
  ascending: true, //升序
  descending: false, //降序
};

export const store = Vue.observable({
  //不同tab页筛选选中数据集合
  fieldParams: {},
  params: {
    limit: 10,
    page: 1,
    column: 'expectReturnTime',
    asc: undefined,
    mchUserId: undefined,
  },
  activeTab: undefined,
  //列表数据
  tableData: {
    totalCount: 0,
    list: [],
  },
  rowInfo: null, //重新发起列表一行数据
});
export const mutations = {
  //设置不同tab页筛选项
  setFieldParams(tabActive, fieldCode, fieldChildCode) {
    if (!store.fieldParams[tabActive]) {
      Vue.set(store.fieldParams, tabActive, {});
    }
    Vue.set(store.fieldParams[tabActive], fieldCode, fieldChildCode);
  },
  clearSortParams() {
    store.params.asc = undefined;
    store.params.column = undefined;
  },
  setActiveTab(value) {
    store.activeTab = value;
  },
  setBackInfo(row) {
    store.rowInfo = row;
  },
  clearFull() {
    store.fieldParams = {};
    store.params = {
      limit: 10,
      page: 1,
      column: 'expectReturnTime',
      asc: undefined,
      mchUserId: stores.get('mchInfo')?.mchUserId || undefined,
    };
    store.activeTab = undefined;
  },
  //排序默认参数
  setDefaultSort(tabActive, fieldCode, fieldChildCode) {
    if (tabActive == 0 && fieldCode == 'receiveStatus') {
      if (fieldChildCode == undefined) {
        store.params.column = 'expectReturnTime';
      } else {
        store.params.column = 'receiveTime';
      }
    } else {
      if (fieldChildCode == undefined) {
        store.params.column = 'expectReturnTime';
      } else if (fieldChildCode == 9) {
        store.params.column = 'returnTime';
      } else {
        store.params.column = 'receiveTime';
      }
    }
  },
  //设置tab切换请求参数
  setParams(name, fieldCode) {
    switch (name) {
      case 'sortList':
        store.params.column = fieldCode.order ? fieldCode.prop : undefined;
        store.params.asc = fieldCode.order ? map[fieldCode?.order] : undefined;
        actions.getDataList();
        break;
      case 'Size':
        store.params.limit = fieldCode;
        actions.getDataList();
        break;
      case 'Current':
        if (fieldCode) {
          store.params.page = fieldCode;
        } else {
          store.params.page--;
        }
        actions.getDataList();
        break;
      default:
        break;
    }
  },
  setTimeParams(active, type, fieldCode) {
    if (!store.fieldParams[active]) {
      Vue.set(store.fieldParams, active, {});
    }
    console.log(active, type, fieldCode, 'active, type, time');
    store.fieldParams[active][type + 'TimeStart'] = fieldCode
      ? new FilterTime(fieldCode).time[0]
      : undefined;
    store.fieldParams[active][type + 'TimeEnd'] = fieldCode
      ? new FilterTime(fieldCode).time[1]
      : undefined;
    actions.getDataList(active);
  },
  //设置接收时间参数
  setFieldTimeParams(active, type, time) {
    if (!store.fieldParams[active]) {
      Vue.set(store.fieldParams, active, {});
    }
    store.fieldParams[active][type + 'TimeStart'] = time
      ? dayjs(time[0]).format('YYYY-MM-DD ') + '00:00:00'
      : undefined;
    store.fieldParams[active][type + 'TimeEnd'] = time
      ? dayjs(time[1]).format('YYYY-MM-DD ') + '23:59:59'
      : undefined;
    actions.getDataList(active);
  },
  clearFieldParams(tabActive) {
    store.fieldParams[tabActive] = {};
  },
};
export const actions = {
  async getDataList() {
    store.params.mchUserId = stores.get('mchInfo')?.mchUserId;
    const { data, code, message } = await get_page({
      ...store.fieldParams[store.activeTab],
      ...store.params,
      switchType: store.activeTab,
    });
    if (code !== 200) return Vue.prototype.$message.warning(message);
    const { records, totalCount } = data;
    store.tableData.list = records || [];
    store.tableData.totalCount = Number(totalCount);
  },
};
