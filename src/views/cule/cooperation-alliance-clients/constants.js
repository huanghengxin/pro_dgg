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
  acceptStatus: { name: '接收状态', code: 'acceptStatus' },
  buildStatus: { name: '建立状态', code: 'buildStatus' },
  teamworkStatus: { name: '合作状态', code: 'teamworkStatus' },
  teamworkType: { name: '合作类型', code: 'teamworkType' },
  acceptTime: { name: '接收时间', code: 'acceptTime' },
  startTime: { name: '发起时间', code: 'startTime' },
  distributionType: { name: '分配方式', code: 'distributionType' },
};
const RECEIVED_LIST = ['acceptStatus', 'teamworkType'];
const RECEIVED_LIST2 = [
  'acceptStatus',
  'teamworkStatus',
  'teamworkType',
  'acceptTime',
  'distributionType',
];
const RECEIVED_LIST3 = ['buildStatus', 'teamworkType', 'distributionType', 'startTime'];
const RECEIVED_LIST4 = [
  'buildStatus',
  'teamworkStatus',
  'teamworkType',
  'distributionType',
  'startTime',
];

const list1 = filterField(RECEIVED_LIST);
const list2 = filterField(RECEIVED_LIST2);
const list3 = filterField(RECEIVED_LIST3);
const list4 = filterField(RECEIVED_LIST4);

/**
 * @description 默认字段，前端页面写死
 */
const acceptStatus = [
  { name: '待接收', code: 'waitAccept' },
  { name: '已接收', code: 'accepted' },
];
const buildStatus = [
  { name: '待建立' },
  { name: '建立失敗', code: 'buildFild' },
  { name: '已建立', code: 'builded' },
];

const teamworkType = [
  { name: '不限' },
  { name: '自留维护权', code: 1 },
  { name: '转出维护权', code: 2 },
];

const teamworkStatus = [
  { name: '不限' },
  { name: '合作中', code: 1 },
  { name: '已解散', code: 2 },
  { name: '合作成功', code: 3 },
];

const acceptTime = [
  { name: '不限' },
  { name: '本周', code: 'week' },
  { name: '本月', code: 'month' },
  { name: '自定义时间', code: 'datetime' },
];
const startTime = [
  { name: '不限' },
  { name: '本周', code: 'week' },
  { name: '本月', code: 'month' },
  { name: '自定义时间', code: 'datetime' },
];

const distributionType = [
  { name: '不限' },
  { name: '定向分配', code: 1 },
  { name: '抢单', code: 2 },
];

/**
 * @description tab页
 */

const tabList = [
  {
    name: '我接收的',
    code: 'DJS',
    filter: { waitAccept: list1, accepted: list2 },
    curPageActive: 'waitAccept',
    filterItem: {
      waitAccept: { acceptStatus, teamworkType },
      accepted: { acceptStatus, teamworkStatus, teamworkType, acceptTime, distributionType },
    },
  },
  {
    name: '我发起的',
    code: 'YJS',
    curPageActive: 'build',
    filter: { builded: list4, build: list3 },
    filterItem: {
      build: {
        buildStatus,
        teamworkType,
        distributionType,
        startTime,
      },
      builded: {
        buildStatus,
        teamworkType,
        distributionType,
        startTime,
        teamworkStatus,
      },
    },
  },
];

export default tabList;
