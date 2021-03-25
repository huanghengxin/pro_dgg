import api from 'utils/api';
// import { param } from 'utils/helper';
//查询维护人
export function get_business_accendant(params) {
  return api.get('http://yapi.dgg.cn/mock/432/get_business_accendant', params);
}
//查询商机角色
export function get_list_by_role(params) {
  return api.get(
    '/crm-middle-pc/api/crisps-crm/service/yk/cooperation/v1/get_list_by_role.do',
    params,
  );
}
//查询合作联盟列表
export function get_page(params) {
  return api.post('/crm-middle-pc/api/crisps-crm/service/yk/cooperation/v1/get_page.do', params);
}
//查询拒绝原因
export function get_refuse_coooeration_reason(params) {
  return api.get('http://yapi.dgg.cn/mock/432/get_refuse_coooeration_reason', params);
}
//获取未合作的需求列表
export function getMeetAllianceListByBizId(params) {
  return api.get('/crm-middle-pc/api/crisps-crm/service/yk/getMeetAllianceListByBizId.do', params);
}
//获取合作联盟全平台需求 -字典
export function get_search(params) {
  return api.post('/crm-middle-pc/api/crisps-crm/service/nk/classification/search.do', params);
}
//获取合作比例
export function cooperation_proportion(params) {
  return api.post(
    '/crm-middle-pc/api/crisps-crm/service/yk/cooperation/find/cooperation_proportion.do',
    params,
  );
}
//获取合作联盟全平台业务区域
export function get_all_businessArea(params) {
  return api.post(
    '/crm-middle-pc/api/crisps-crm/service/yk/cooperation/v1/businessArea.do',
    params,
  );
}
//发起合作(有客户信息)
export function save_by_present_customer(params) {
  return api.post(
    // 'http://172.16.132.3:10105/api/crisps-crm/service/yk/cooperation/v1/save_by_present_customer.do',
    '/crm-middle-pc/api/crisps-crm/service/yk/cooperation/v1/save_by_present_customer.do',
    params,
  );
}
//发起合作(无客户信息)
export function save_by_absent_customer(params) {
  return api.post(
    '/crm-middle-pc/api/crisps-crm/service/yk/cooperation/v1/save_by_absent_customer.do',
    params,
  );
}
//发起解除合作  -商机详情
export function apply_relieve(params) {
  return api.post(
    '/crm-middle-pc/api/crisps-crm/service/yk/cooperation/dissolution/v1/apply.do',
    params,
  );
}
//查询解除合作操作权限
export function get_permission(params) {
  return api.post(
    '/crm-middle-pc/api/crisps-crm/service/yk/cooperation/dissolution/v1/get_permission.do',
    params,
  );
}
//解除合作 -合作接收方
export function accept(params) {
  return api.post(
    '/crm-middle-pc/api/crisps-crm/service/yk/cooperation/dissolution/v1/accept.do',
    params,
  );
}
//接收合作 -合作接收方
export function receiveCooperation(params) {
  return api.post('/crm-middle-pc/api/crisps-crm/service/yk/cooperation/v1/receive.do', params);
}
//拒绝合作 -合作接收方列表
export function rejectCooperation(params) {
  return api.post('/crm-middle-pc/api/crisps-crm/service/yk/cooperation/v1/reject.do', params);
}
//获取合作接收方信息
export function get_receiver(qurry) {
  return api.post('/crm-middle-pc/api/crisps-crm/service/nk/cooperative/receiver.do', qurry);
}
//获取合作权限
export function get_menu_permission(qurry) {
  return api.get(
    '/crm-middle-pc/api/crisps-crm/service/yk/cooperation/v1/get_permission.do',
    qurry,
  );
}
