/**
 * @description 遍历字段列表
 * @param {Array} 字段列表
 * @returns {Array} 字段列表
 */

const filterField = function(field) {
  return field.reduce((cur, acc) => {
    // console.log(cur, acc, 'cur, acc');
    cur.push(ALL_LIST[acc]);
    return cur;
  }, []);
};

/**
 * @description 列表筛选字段
 */
const ALL_LIST = {
  receiveStatus: { name: '接收状态', code: 'receiveStatus' },
  buildStatus: { name: '建立状态', code: 'buildStatus' },
  cooperationStatus: { name: '合作状态', code: 'cooperationStatus' },
  cooperationType: { name: '合作类型', code: 'cooperationType' },
  /*
  receiveTimeStart	接收时间-开始(格式:"2021-02-19 00:00:00")	
  receiveTimeEnd	接收时间-结束(格式:"2021-02-19 23:59:59")*/
  receive: { name: '接收时间', code: 'receive' },
  /*
  createTimeStart	发起时间-开始(格式:"2021-02-19 00:00:00")	
  createTimeEnd	发起时间-结束(格式:"2021-02-19 23:59:59")
  */
  create: { name: '发起时间', code: 'create' },
  allocationMode: { name: '分配方式', code: 'allocationMode' },
};
const RECEIVED_LIST = ['receiveStatus', 'cooperationType'];
const RECEIVED_LIST2 = [
  'receiveStatus',
  'cooperationStatus',
  'cooperationType',
  'receive',
  'allocationMode',
];
const RECEIVED_LIST3 = ['buildStatus', 'cooperationType', 'allocationMode', 'create'];
const RECEIVED_LIST4 = [
  'buildStatus',
  'cooperationStatus',
  'cooperationType',
  'allocationMode',
  'create',
];

const list1 = filterField(RECEIVED_LIST);
const list2 = filterField(RECEIVED_LIST2);
const list3 = filterField(RECEIVED_LIST3);
const list4 = filterField(RECEIVED_LIST4);

/**
 * @description 默认字段，前端页面写死
 */

const receiveStatus = [
  { name: '待接收', code: undefined, curPage: '2' },
  { name: '已接收', code: 1, curPage: '1' },
];
const buildStatus = [
  { name: '待建立', curPage: '1' },
  { name: '建立失败', code: 9, curPage: '1' },
  { name: '已建立', code: 1, curPage: '3' },
];

const cooperationType = [
  { name: '不限' },
  { name: '自留维护权', code: 1 },
  { name: '转出维护权', code: 2 },
];

const cooperationStatus = [
  { name: '不限' },
  { name: '合作中', code: 1 },
  { name: '合作成功', code: 2 },
  { name: '已解散', code: 3 },
];

const receive = [
  { name: '不限' },
  { name: '本周', code: 'week' },
  { name: '本月', code: 'month' },
  { name: '自定义时间', code: 'datetime' },
];
const create = [
  { name: '不限' },
  { name: '本周', code: 'week' },
  { name: '本月', code: 'month' },
  { name: '自定义时间', code: 'datetime' },
];

const allocationMode = [{ name: '不限' }, { name: '定向分配', code: 1 }, { name: '抢单', code: 2 }];

/**
 * @description tab页
 */

const tabList = [
  {
    name: '我接收的',
    code: '0',
    filter: { 2: list1, 1: list2 },
    curPageActive: '2',
    filterItem: {
      2: { receiveStatus, cooperationType },
      1: { receiveStatus, cooperationStatus, cooperationType, receive, allocationMode },
    },
  },
  {
    name: '我发起的',
    code: '1',
    curPageActive: '1',
    filter: { 3: list4, 1: list3 },
    filterItem: {
      1: {
        buildStatus,
        cooperationType,
        allocationMode,
        create,
      },
      3: {
        buildStatus,
        cooperationType,
        allocationMode,
        create,
        cooperationStatus,
      },
    },
  },
];

export default tabList;
