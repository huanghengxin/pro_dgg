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
    asc: true,
    mchUserId: undefined,
  },
  activeTab: undefined,
  //列表数据
  tableData: {
    totalCount: 0,
    list: [],
  },
  rowInfo: null, //重新发起列表一行数据
  permissionInfo: null,
  loading: false,
});
export const mutations = {
  //设置不同tab页筛选项
  setFieldParams(tabActive, fieldCode, fieldChildCode) {
    if (!store.fieldParams[tabActive]) {
      Vue.set(store.fieldParams, tabActive, {});
    }
    Vue.set(store.fieldParams[tabActive], fieldCode, fieldChildCode);
  },
  setPermissionInfo(val) {
    store.permissionInfo.info = val;
  },
  //默认排序参数
  clearSortParams(fieldChildCode) {
    if (store.activeTab == 0) {
      const accept = store.fieldParams[0] && store.fieldParams[0]['receiveStatus'];
      if (accept === undefined) {
        store.params.column = 'expectReturnTime';
        store.params.asc = true;
      } else {
        store.params.column = 'receiveTime';
        store.params.asc = undefined;
      }
    } else {
      const initiate = store.fieldParams[1] && store.fieldParams[1]['buildStatus'];
      if (initiate === undefined) {
        store.params.column = 'expectReturnTime';
        store.params.asc = true;
      } else if (initiate == 9) {
        store.params.column = 'returnTime';
        store.params.asc = undefined;
      } else {
        store.params.column = 'receiveTime';
        store.params.asc = undefined;
      }
    }
  },
  //设置当前页
  setActiveTab(value) {
    store.activeTab = value;
  },
  setDefaultPage() {
    store.params.page = 1;
  },
  setBackInfo(row) {
    store.rowInfo = row;
  },
  clearCurTab(tab) {
    Vue.set(store.fieldParams, tab, {});
  },
  clearFull() {
    store.fieldParams = {};
    store.params = {
      limit: 10,
      page: 1,
      column: 'expectReturnTime',
      asc: true,
      mchUserId: undefined,
    };
    store.activeTab = undefined;
  },
  //排序默认参数
  setDefaultSort() {
    console.log(store.activeTab, 'store.activeTab');
    const { params } = store;
    params.column = 'expectReturnTime';
    params.asc = true;
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
    store.loading = true;
    store.params.mchUserId = stores.get('mchInfo')?.mchUserId;
    const { data, code, message } = await get_page({
      ...store.fieldParams[store.activeTab],
      ...store.params,
      switchType: store.activeTab,
    });
    if (code !== 200) {
      store.loading = false;
      return Vue.prototype.$message.warning(message);
    }
    const { records, totalCount } = data;
    store.loading = false;
    store.tableData.list = records || [];
    store.tableData.totalCount = Number(totalCount);
  },
};
