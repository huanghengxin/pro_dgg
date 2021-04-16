/**
 * @description 商机详情权限
 */
/**
 * @description 商机详情更多操作
 * @attr openModal:ref值及组件名
 * @attr auth：按钮权限
 */
//商机详情更多操作
export const NO_ATTENTION_MORE_HANDLE = [
  { name: '基本信息修改', openModal: 'edit-base-info', auth: 'crmEditBaseInfo' },
  // { name: '下单', openModal: 'push-sheet' },
  { name: '恢复关注', openModal: 'reset-attention', auth: 'crmResetAttention' },
  { name: '操作日志', openModal: 'handle-log', auth: 'crmHandleLog' },
];
export const MORE_HANDLE = [
  { name: '基本信息修改', openModal: 'edit-base-info', auth: 'crmEditBaseInfo' },
  { name: '在线聊', openModal: 'im-chat', auth: 'crmChatIm' },
  { name: '邀约面谈', openModal: 'invite-interview', auth: 'crmInviteInterview' },
  { name: '操作日志', openModal: 'handle-log', auth: 'crmHandleLog' },
  { name: '发起合作', openModal: 'initiate-cooperation', auth: 'crmInitiateCooperation' },
  // { name: '下单', openModal: 'push-sheet' },
  { name: '设置分组', openModal: 'set-group', auth: 'crmSetGroup' },
  { name: '暂不关注', code: 'BUS_ZBGZ', openModal: 'no-attention', auth: 'crmNoAttention' },
  {
    name: '设置下次跟进时间',
    openModal: 'set-next-follow-time',
    auth: 'crmSetNextFollowTime',
  },
  { name: '无效商机', code: 'BUS_WXSJ', openModal: 'no-attention', auth: 'crmInvalidBusiness' },
];
//商机详情已签
export const SIGNED_BUSINESS = [
  { name: '基本信息修改', openModal: 'edit-base-info', auth: 'crmEditBaseInfo' },
  { name: '在线聊', openModal: 'im-chat', auth: 'crmChatIm' },
  { name: '邀约面谈', openModal: 'invite-interview', auth: 'crmInviteInterview' },
  { name: '操作日志', openModal: 'handle-log', auth: 'crmHandleLog' },
  // { name: '发起合作', openModal: 'initiate-cooperation', auth: 'crmInitiateCooperation' },
  // { name: '下单', openModal: 'push-sheet' },
  { name: '设置分组', openModal: 'set-group', auth: 'crmSetGroup' },
  {
    name: '设置下次跟进时间',
    openModal: 'set-next-follow-time',
    auth: 'crmSetNextFollowTime',
  },
];
//自留维护-合作接收人
export const RETENTION_RECEIVE = [
  { name: '基本信息修改', openModal: 'edit-base-info', auth: 'crmEditBaseInfo' },
  { name: '邀约面谈', openModal: 'invite-interview', auth: 'crmInviteInterview' },
];
//自留维护-合作接收人  暂不关注
export const RETENTION_RECEIVE_NO_ATTENTION = [
  { name: '基本信息修改', openModal: 'edit-base-info', auth: 'crmEditBaseInfo' },
];
//转出维护-合作发起人
export const TRANSFER_SPONSOR = [];
//转出维护-合作接收人  自留发起人  暂不关注
export const TRANSFER_RETENTION_NO_ATTENTION = [
  { name: '基本信息修改', openModal: 'edit-base-info', auth: 'crmEditBaseInfo' },
  { name: '操作日志', openModal: 'handle-log', auth: 'crmHandleLog' },
  { name: '恢复关注', openModal: 'reset-attention', auth: 'crmResetAttention' },
];

//经理
export const MORE_TEAM_MANAGE = [
  { name: '移交', openModal: 'cule-move-dialog', auth: 'crmTurnOver' },
  { name: '操作日志', openModal: 'handle-log', auth: 'crmHandleLog' },
];

//全部组件
export const MORE_HANDLE_COMPONENT = [
  'edit-base-info',
  'invite-interview',
  'handle-log',
  'set-group',
  'no-attention',
  'set-next-follow-time',
  'initiate-cooperation',
];
//已签单组件
export const SIGNED_BUSINESS_COMPONENT = [
  'edit-base-info',
  'invite-interview',
  'handle-log',
  'set-group',
  'set-next-follow-time',
];
//自留维护-合作接收人
export const RETENTION_RECEIVE_COMPONENT = ['edit-base-info', 'invite-interview'];
//自留维护-合作接收人 暂不关注
export const RETENTION_RECEIVE_NO_ATTENTION_COMPONENT = ['edit-base-info'];
//转出维护-合作发起人
export const TRANSFER_SPONSOR_COMPONENT = [];
//转出维护-合作接收人  自留发起人  暂不关注
export const TRANSFER_RETENTION_NO_ATTENTION_COMPONENT = ['edit-base-info', 'handle-log'];
//暂不关注组件
export const NO_ATTENTION_MORE_HANDLE_COMPONENT = ['edit-base-info', 'handle-log'];
//经理组件
export const MORE_TEAM_MANAGE_COMPONENT = ['cule-move-dialog', 'handle-log'];
