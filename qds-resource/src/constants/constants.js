//客源列表
export const PASSENGER_SOURCE = [
  { name: '客户姓名：', code: 'customerName' },
  { name: '商机编号：', code: 'bizNo' },
  { name: '客户需求：', code: 'requireName' },
  { name: '业务区域：', code: 'bizCityName' },
  { name: '当前位置：', code: 'curSearName' },
];
//时间筛选不带不限
export const TIME_TAG = [
  { text: '今日', ext1: 'day' },
  { text: '本周', ext1: 'week' },
  { text: '本月', ext1: 'month' },
  { text: '自定义时间', ext1: 'datetime' },
];
//时间筛选带不限
export const UNLIMITED_TIME_TAG = [
  { text: '不限', ext1: '' },
  { text: '今日', ext1: 'day' },
  { text: '本周', ext1: 'week' },
  { text: '本月', ext1: 'month' },
  { text: '自定义时间', ext1: 'datetime' },
];
//分配状态
export const DISTRIBUTION_STATE = [
  { text: '不限', ext1: '' },
  { text: '待分配', ext1: 'await' },
  { text: '分配中', ext1: 'ing' },
  { text: '已分配', ext1: 'ed' },
];
//待分配类型
export const AWAIT_ALLOCATION_TYPE = [
  { text: '不限', ext1: undefined },
  { text: '新增待分配', ext1: 0 },
  { text: '拾回待分配', ext1: 1 },
  { text: '掉库待分配', ext1: 2 },
  { text: '智能退回待分配', ext1: 3 },
];
//分配方式
export const ALLOCATION_WAY = [
  { text: '不限', ext1: undefined },
  { text: '人工分配', ext1: 'ARTIFICIAL_ALLOT' },
  { text: '智能分配', ext1: 'SMART_ALLOT' },
];
//分配结果
export const ALLOCATION_RESULT = [
  { text: '不限', ext1: undefined },
  { text: '成功', ext1: 1 },
  { text: '失败', ext1: 0 },
];
//测试客源
export const TEST_SOURCE = [
  { name: '待确认', code: 'CLUE' },
  { name: '测试客源', code: 'BIZ' },
];

// 客源详情跟进记录 面谈
export const CLIENT_DEMAND_INFO = [
  { name1: '意向产品：', code1: 'intentionProduct' },
  { name1: '业务区域：', code1: 'bizAreaName' },
  {
    name1: '客户预算：',
    code1: 'expectedMoney',
  },
  {
    name1: '预期时间：',
    code1: 'expectedCompletedTime',
  },
];
//客源详情更多操作
export const FOLLOW_RECORDS = [
  { name: '全部', code: '' },
  { name: '跟进', code: 'CRM_OPER_FOLLOW' },
  { name: '打电话', code: 'CRM_OPER_CALL' },
  { name: '邀约面谈', code: 1 },
];
// 客源详情跟进记录 基础
export const RECORD_FIELD_BASE = [
  { name: '', code: 'followTime' },
  { name: '跟进人：', code: 'followPerson' },
  { name: '跟进内容：', code: 'followContent' },
];
// 客源详情跟进记录 面谈
export const RECORD_FIELD_INTERVIEW = [
  { time: '面谈时间：', code: 'confirmCompleteTime' },
  { name: '面谈人：', code: 'inviterName', jobNum: 'inviterNo' },
  { name: '面谈类型：', code: 'inviteType' },
  { name: '面谈地点：', code: 'inviteAddress' },
];
// 客源详情跟进记录 邀约
export const RECORD_FIELD_INVITE = [
  { time: '发起时间：', code: 'createTime' },
  { name: '邀约人：', code: 'inviterName', jobNum: 'inviterNo' },
  { name: '邀约类型：', code: 'inviteType' },
  { name: '邀约地点：', code: 'inviteAddress' },
  { name: '约定时间：', code: 'inviteTime' },
];
