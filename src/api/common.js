import api from 'utils/api';
import { param } from 'utils/helper';

export function getCompanyList(params) {
  return api.get('/business_ding_qi_cha.do', params);
}

//获取当前规划师暂不关注数量
export function get_storage_by_type(params) {
  return api.get(
    '/crm-middle-pc/api/crisps-crm/service/yk/biz_business/v1/get_storage_by_type.do',
    params,
  );
}

export function recoverInattention(params) {
  return api.post(
    '/crm-middle-pc/api/crisps-crm/service/yk/biz_inattention_record/v1/recoverInattention.do?' +
      param(params),
    params,
  );
}

//获取无效商机剩余数量
export function get_disable_used(params) {
  return api.get(
    '/crm-middle-pc/api/crisps-crm/service/yk/biz_business/v1/get_disable_used.do',
    params,
  );
}

//获取当前规划师配置得最大暂不关注时间
export function get_inattention_time(params) {
  return api.get(
    '/crm-middle-pc/api/crisps-crm/service/yk/biz_inattention_record/v1/get_inattention_time.do',
    params,
  );
}

//发起面谈邀请
export function initiate_interview(params) {
  return api.post(
    '/crm-middle-pc/api/crisps-crm/service/yk/web/biz_interview_record/v1/initiate_interview',
    params,
  );
}

//获取真实手机号码
export function show_real_phone(params) {
  return api.get(
    '/crm-middle-pc/api/crisps-crm/service/yk/biz_business/v1/show_real_phone.do',
    params,
  );
}

//获取操作日志数据
export function oper_log_list(params) {
  return api.post(
    '/crm-middle-pc/api/crisps-crm/service/yk/biz/biz_follow_record/v1/oper_log_list',
    params,
  );
}

// 获取用户已配置的授权业务信息接口;
export function get_user_business_category(params) {
  return api.post(
    '/crm-middle-pc/api/crisps-crm/service/yk/v1/get_user_business_category.do',
    params,
  );
}

// 获取用户授权的区域范围;
export function get_user_website(params) {
  return api.get('/crm-middle-pc/api/crisps-crm/service/yk/v1/get_user_website.do', params);
}

// 获取联系人列表;
export function listContact(params) {
  return api.post(
    '/crm-middle-pc/api/crisps-crm/service/yk/biz_business/v1/listContact.do?' + param(params),
    params,
  );
}

// 获取用户信息;
export function get_login_user_info(params) {
  return api.get('/crm-middle-pc/api/crisps-crm/service/yk/v1/get_login_user_info.do', params);
}

// 写跟进;
export function write_biz_follow_record(params) {
  return api.post(
    '/crm-middle-pc/api/crisps-crm/service/yk/biz/biz_follow_record/v1/write_biz_follow_record.do',
    params,
  );
}

// 查询商户办公地址
export function list_mch_address(params) {
  return api.get('/crm-middle-pc/api/crisps-crm/service/nk/v1/list_mch_address.do', params);
}

// 数据字典
export function get_dictionary_data_by_parent_code(params) {
  return api.get(
    '/crm-middle-pc/api/crisps-crm/service/yk/v1/personal/get_dictionary_data_by_parent_code.do',
    params,
  );
}

//新增需求
export function create(params) {
  return api.post('/crm-middle-pc/api/crisps-crm/service/yk/biz/biz_requirement/v1/create', params);
}

//新增需求-时间
export function getTreeBook(params) {
  return api.post(
    '/crm-middle-pc/api/crisps-crm/service/yk/biz_business/v1/getTreeBook.do',
    params,
  );
}

// 通过客户id查客户中心号码
export function find_contacts_by_customer_id(params) {
  return api.get(
    '/crm-middle-pc/api/crisps-crm/service/nk/api/contact/v1/find_contacts_by_customer_id.do',
    params,
  );
}

//获取商户下得商务信息
export function get_mch_user_info_list(qurry) {
  return api.post('/crm-middle-pc/api/crisps-crm/service/nk/v1/get_mch_user_info_list.do', qurry);
}
//
export function save_contact(qurry) {
  return api.post('/crm-middle-pc/api/crisps-crm/service/yk/api/contact/v1/save_contact.do', qurry);
}

//
export function get_product_list(qurry) {
  return api.post('/crm-middle-pc/api/crisps-crm/service/nk/v1/get_product_list.do', qurry);
}

//修改基本信息
export function edit_biz_info(params) {
  return api.post(
    '/crm-middle-pc/api/crisps-crm/service/yk/biz_business/v1/edit_biz_info.do',
    params,
  );
}

//删除需求
export function edit_demand(params) {
  return api.post('/crm-middle-pc/api/crisps-crm/service/yk/biz/biz_requirement/v1/edit', params);
}

//打电话接口-批量id
export function find_contacts_by_ids(params) {
  return api.post(
    '/crm-middle-pc/api/crisps-crm/service/yk/customer/v1/find_contacts_by_ids.do',
    params,
  );
}

//打电话前调用接口判断当前商机是否在个人库
export function verify_call(params) {
  return api.post(
    '/crm-middle-pc/api/crisps-crm/service/yk/biz_business/v1/shupiancall/verify_call.do',
    params,
  );
}
