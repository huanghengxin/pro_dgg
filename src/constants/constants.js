//我的商机列表页
export const TAB_LIST = [
  {
    name: '今日待跟进',
    code: 'TODAY_FOLLOW',
    tooltip: '此列表下为您今日需要跟进的商机，请今日内及时跟进，否则可能会掉库哦～',
  },
  {
    name: '开发中',
    code: 'DEVELOPING',
    tooltip: '此列表下为您正在开发客户或再次开发签单的商机，再加把油客户就要成功签约啦～',
  },
  {
    name: '已签单',
    code: 'SIGN_ORDER',
    tooltip: '此列表下为您已经签过单的商机，要不定时的联系下客户，说不定客户又有新的需求呢～',
  },
];
//全部筛选项类型
export const FILTER_LIST = {
  followType: { name: '待跟进类型', code: 'followType' },
  reqProgress: { name: '需求进度', code: 'reqProgress' },
  intentionLevel: { name: '意向等级', code: 'intentionLevel' },
  groupId: { name: '商机分组', code: 'groupId' },
  requirement: { name: '客户需求', code: 'requirement' },
  isMoreDemand: { name: '多个需求', code: 'isMoreDemand' },
  predictDropType: { name: '预计掉库类型', code: 'predictDropType' },
  isNoAttention: { name: '暂不关注', code: 'isNoAttention' },
  getWayCode: { name: '获取方式', code: 'getWayCode' },
  getTime: { name: '获取时间', code: 'getTime' },
  bizSource: { name: '商机来源', code: 'bizSource' },
  orderBusiness: { name: '签单业务', code: 'requirement' },
  signTime: { name: '签单时间', code: 'signTime' },
  productType: { name: '需求类型', code: 'productType' },
};
// 我的商机筛选字段
export const MY_BUSINESS_FIELD = {
  //待跟进列表
  TODAY_FOLLOW: [
    'followType',
    'reqProgress',
    'intentionLevel',
    'groupId',
    'requirement',
    'isMoreDemand',
    'predictDropType',
    'isNoAttention',
    'getWayCode',
    'getTime',
    'bizSource',
    'productType',
  ],
  DEVELOPING: [
    'reqProgress',
    'intentionLevel',
    'groupId',
    'requirement',
    'isMoreDemand',
    'predictDropType',
    'isNoAttention',
    'bizSource',
    'getWayCode',
    'getTime',
    'productType',
  ],
  SIGN_ORDER: [
    'orderBusiness',
    'signTime',
    'groupId',
    'bizSource',
    'getWayCode',
    'getTime',
    'productType',
  ],
};
//我的商机筛选项待跟进类型
export const followType = [
  { text: '即将掉库', ext1: 'UPCOMING_DROP' },
  { text: '今日掉库', ext1: 'TODAY_DROP' },
  { text: '设置今日跟进', ext1: 'SET_TODAY_FOLLOWING' },
  { text: '其他待跟进', ext1: 'OTHER' },
];

export const defaultFilterTime = [
  { text: '不限', ext1: '' },
  { text: '今日', ext1: 'day' },
  { text: '本周', ext1: 'week' },
  { text: '本月', ext1: 'month' },
  { text: '自定义时间', ext1: 'datetime' },
];

export const defaultFilter = [
  { text: '不限', ext1: '' },
  { text: '是', ext1: 1 },
  { text: '否', ext1: 0 },
];

export const defaultMapObj = {
  TODAY_FOLLOW: {
    followType: followType,
    isMoreDemand: defaultFilter,
    isNoAttention: defaultFilter,
    getTime: defaultFilterTime,
  },

  DEVELOPING: {
    isMoreDemand: defaultFilter,
    isNoAttention: defaultFilter,
    getTime: defaultFilterTime,
  },

  SIGN_ORDER: {
    signTime: defaultFilterTime,
    getTime: defaultFilterTime,
  },
};
/**
 * @description 默认tab映射表
 */
export const defaultMapFilterList = {
  TODAY_FOLLOW: {
    BIZ_GROUP_CODE: 'groupId', //商机分组
    GET_WAY_PC_MENU: 'getWayCode', //获取方式
    INTENTION_LEVEL_PC_MENU: 'intentionLevel', //意向等级
    PREDICT_DROP_TYPE: 'predictDropType', //预计掉库类型
    PROGRESS_PC_MENU: 'reqProgress', //需求进度
    SECOND_REQUIREMENT: 'requirement', //客户需求
    BIZ_SOURCE_PC_MENU: 'bizSource',
    REQ_TYPE_PC_MENU: 'productType',
  },
  DEVELOPING: {
    PROGRESS_PC_MENU: 'reqProgress', //需求进度
    INTENTION_LEVEL_PC_MENU: 'intentionLevel', //意向等级
    BIZ_GROUP_CODE: 'groupId', //商机分组
    SECOND_REQUIREMENT: 'requirement', //客户需求
    PREDICT_DROP_TYPE: 'predictDropType', //预计掉库类型
    GET_WAY_PC_MENU: 'getWayCode', //获取方式
    BIZ_SOURCE_PC_MENU: 'bizSource',
    REQ_TYPE_PC_MENU: 'productType',
  },
  SIGN_ORDER: {
    SECOND_REQUIREMENT: 'orderBusiness', //客户需求
    BIZ_GROUP_CODE: 'groupId', //商机分组
    GET_WAY_PC_MENU: 'getWayCode', //获取方式
    BIZ_SOURCE_PC_MENU: 'bizSource',
    REQ_TYPE_PC_MENU: 'productType',
  },
};
//暂不关注和无效商机
export const NO_ATTENTION = {
  //无效商机弹层
  BUS_WXSJ: {
    title: '无效商机',
    label1: '无效原因：',
    label2: '无效原因：',
    placeholder1: '请选择无效原因',
    placeholder2: '请输入无效原因',
    footerInfo: (num) => {
      return `今日剩余无效量为&nbsp;<span class='footer-info_var'>${num}</span>&nbsp;条，请合理使用。`;
    },
    labelWidth: '100px',
  },
  //暂不关注弹层
  BUS_ZBGZ: {
    title: '暂不关注',
    label1: '暂不关注时间：',
    label2: '暂不关注原因：',
    placeholder1: '请输入暂不关注时间',
    placeholder2: '请输入暂不关注原因',
    footerInfo: (num) => {
      return `注：暂不关注不执行掉库。当前剩余&nbsp;<span class='footer-info_var'>${num}</span>&nbsp;暂不关注`;
    },
    labelWidth: '125px',
  },
};

//商机详情更多操作
export const FOLLOW_RECORDS = [
  { name: '全部', code: '' },
  { name: '跟进', code: 'CRM_OPER_FOLLOW' },
  { name: '打电话', code: 'CRM_OPER_CALL' },
  { name: '邀约面谈', code: 1 },
];
// 商机详情跟进记录 基础
export const RECORD_FIELD_BASE = [
  { name: '', code: 'followTime' },
  { name: '跟进人：', code: 'followPerson' },
  { name: '跟进内容：', code: 'followContent' },
];

// 商机详情跟进记录 邀约
export const RECORD_FIELD_INVITE = [
  { time: '发起时间：', code: 'createTime' },
  { name: '邀约人：', code: 'inviterName', jobNum: 'inviterNo' },
  { name: '邀约类型：', code: 'inviteType' },
  { name: '邀约地点：', code: 'inviteAddress' },
  { name: '约定时间：', code: 'inviteTime' },
];

// 商机详情跟进记录 面谈
export const RECORD_FIELD_INTERVIEW = [
  { time: '发起时间：', code: 'createTime' },
  { name: '面谈人：', code: 'inviterName', jobNum: 'inviterNo' },
  { name: '面谈类型：', code: 'inviteType' },
  { name: '面谈地点：', code: 'inviteAddress' },
];

// 商机详情跟进记录 面谈
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

//订单列表
export const ORDER_LIST_MAIN = [
  { name1: '', code1: 'userName' },
  { name1: '', code1: 'payStatus' },
  { name1: '下单时间：', code1: 'orderTime' },
  { name1: '方式：', code1: 'getWay' },
  { name1: '区域：', code1: 'areaName' },
  { name1: '企管家：', code1: 'homeName' },
  // { name1: '订单信息：', code1: 'orderInformation' },
  // { name1: '', code1: 'orderType' },
  // { name1: '', code1: 'orderNumber' },
  // { name1: '', code1: 'contractNumber' },
  // { name1: '合同主体：', code1: 'contractMain' },
];

//订单详情 订单信息
export const ORDER_DETAILS_ORDER_INFORMATION = [
  { name1: '订单类型：', code1: 'orderType', name2: '合同主体：', code2: 'contractPart' },
  {
    name1: '签单人员：',
    code1: 'signBillPerson',
    name2: '合同编号：',
    code2: 'contractNumber',
  },
  { name1: '用户名称：', code1: 'userName', name2: '下单方式：', code2: 'orderWay' },
  { name1: '用户账号：', code1: 'userAccount', name2: '下单金额：', code2: 'orderMoney' },
  { name1: '下单区域：', code1: 'orderArea', name2: '实付金额：', code2: 'practicalMoney' },
  { name1: '下单时间：', code1: 'orderTime', name2: '待付金额：', code2: 'waitMoney' },
  { name1: '支付时间：', code1: 'payTime', name2: '完成时间：', code2: 'finishTime' },
  { name1: '备注：', code1: 'remark' },
];

//生产单信息 订单信息
export const PRODUCTION_ORDER_DETAILS = [
  { name1: '生产单编号：', code1: 'productionNo', name2: '企管家：', code2: 'productionHome' },
  { name1: '产品类型：', code1: 'productionType', name2: '分单模式：', code2: 'SingleMode' },
  { name1: '产品城市：', code1: 'productionCity', name2: '分单时间：', code2: 'SingleTime' },
  { name1: '生产单状态：', code1: 'productionStatus', name2: '截止时间：', code2: 'finishTime' },
  { name1: '产品名称：', code1: 'productionName' },
  { name1: '', code1: 'remark' },
];
