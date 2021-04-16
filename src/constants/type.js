/**
 * @description 数据字典翻译
 */
//需求类型
export const PRODUCE_TYPE_MAP = {
  PRO_CLASS_TYPE_SERVICE: 1, //服务
  PRO_CLASS_TYPE_SERVICE_RESOURCE: 2, //资源
  PRO_CLASS_TYPE_TRANSACTION: 3, //交易
  PRO_CLASS_TYPE_SALES: 4, //销售
};
//操作日志类型
export const HANDLE_LOG = {
  CRM_OPER_ADD_BIZ: '新增商机',
  CRM_OPER_EDIT_BIZ: '编辑商机',
  CRM_OPER_DEL_BIZ: '删除商机',
  CRM_OPER_ADD_REQ: '新增需求',
  CRM_OPER_EDIT_REQ: '编辑需求',
  CRM_OPER_DEL_REQ: '删除需求',
  CRM_OPER_MOVE_BIZ: '移交商机',
  CRM_OPER_PICKUP_BIZ: '商机拾回',
  CRM_OPER_DROP_BIZ: '商机掉库',
  CRM_OPER_CALL: '打电话',
  CRM_OPER_FOLLOW: '写跟进',
  CRM_OPER_INVITATION: '邀约',
  CRM_OPER_INTERVIEW: '面谈完成',
  CRM_OPER_DISABLE_FLAG: '标记无效',
  CRM_OPER_PUSH_ORDER: '推单',
  CRM_OPER_PUSH_ORDER_NEW: '推单子类型：新建需求（状态和进度修改使用）',
  CRM_OPER_PUSH_ORDER_UPDATE: '推单子类型：修改需求（状态和进度修改使用）',
  CRM_OPER_SIGN_ORDER: '签单',
  CRM_OPER_NO_ATTENTION: '暂不关注',
  CRM_OPER_CANCEL_NO_ATTENTION: '取消暂不关注',
  CRM_OPER_SET_NEXT_FOLLOW_TIME: '设置下次跟进时间',
  CRM_OPER_SET_GROUP: '设置分组',
  CRM_OPER_ADD_CONTACT: '新增联系人',
  CRM_OPER_CANCEL_INTERVIEW: '取消面谈',
};
