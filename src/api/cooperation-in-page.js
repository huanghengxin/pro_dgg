import api from 'utils/api';
// import { param } from 'utils/helper';
//查询维护人
export function get_business_accendant(params) {
  return api.get('http://yapi.dgg.cn/mock/432/get_business_accendant', params);
}
//查询商机角色
export function get_list_by_role(params) {
  return api.post('http://yapi.dgg.cn/mock/432/api/yk/cooperation/v1/get_list_by_role.do', params);
}
//查询合作联盟
export function get_page(params) {
  return api.post('http://yapi.dgg.cn/mock/432/api/yk/cooperation/v1/get_page.do', params);
}
//查询拒绝原因
export function get_refuse_coooeration_reason(params) {
  return api.get('http://yapi.dgg.cn/mock/432/get_refuse_coooeration_reason', params);
}

//查询数据字典
export function get_shujuzidian(params) {
  return api.get('http://yapi.dgg.cn/mock/432/get_shujuzidian', params);
}
//获取未合作的需求列表
export function get_no_cooperation_list(params) {
  return api.get(
    'http://yapi.dgg.cn/mock/432/api/yk/cooperation/requirement/v1/get_no_cooperation_list.do',
    params,
  );
}
//发起合作(有客户信息)
export function save_by_present_customer(params) {
  return api.post(
    'http://yapi.dgg.cn/mock/432/api/yk/cooperation/v1/save_by_present_customer.do',
    params,
  );
}
//发起合作(无客户信息)
export function save_by_absent_customer(params) {
  return api.post(
    'http://yapi.dgg.cn/mock/432/api/yk/cooperation/v1/save_by_absent_customer.do',
    params,
  );
}
//发起解除合作
export function apply(params) {
  return api.post('http://yapi.dgg.cn/mock/432/api/yk/cooperation/dissolution/v1/apply.do', params);
}
//通过手机查询商机
export function get_by_cusomer_phone(params) {
  return api.post(
    'http://yapi.dgg.cn/mock/432/api/yk/cooperation/business/v1/get_by_cusomer_phone.do',
    params,
  );
}
//查询解除合作操作权限
export function get_permission(params) {
  return api.post(
    'http://yapi.dgg.cn/mock/432/api/yk/cooperation/dissolution/v1/get_permission.do',
    params,
  );
}
//解除合作 -合作接收方
export function accept(params) {
  return api.post(
    'http://yapi.dgg.cn/mock/432/api/yk/cooperation/dissolution/v1/accept.do',
    params,
  );
}
//接收合作 -合作接收方
export function receive(params) {
  return api.post('http://yapi.dgg.cn/mock/432/api/yk/cooperation/v1/receive.do', params);
}
//拒绝合作 -合作接收方
export function reject(params) {
  return api.post('http://yapi.dgg.cn/mock/432/api/yk/cooperation/v1/reject.do', params);
}
