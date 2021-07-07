import api from 'utils/api';
import { createCrmApi } from 'utils/api';
let crm = createCrmApi();
//获取全平台需求 -字典
export function get_search(params) {
  return crm.post('/crm-middle-pc/api/crisps-crm/service/nk/classification/search.do', params);
}
//获取全平台业务区域
export function get_all_businessArea(params) {
  return crm.post(
    '/crm-middle-pc/api/crisps-crm/service/yk/cooperation/v1/businessArea.do',
    params,
  );
}
//来源渠道 来源平台 单个数据字典
export function find_tree_book_list(params) {
  return api.get(
    '/crisps-resource-middle-pc/api/crisps-resource-house/service/yk/resource_common/v1/find_tree_book_list.do',
    params,
  );
}
// 多个code查询数据字典;
export function find_tree_book_list_multi(params) {
  return api.get(
    '/crisps-resource-middle-pc/api/crisps-resource-house/service/yk/resource_common/v1/find_tree_book_list_multi.do',
    params,
  );
}
// 获取分配权限
export function get_mch_base_info(params) {
  return api.get(
    '/crisps-resource-middle-pc/api/crisps-resource-house/service/yk/resource_common/v1/get_mch_base_info.do',
    params,
  );
}
// 数据字典  rule_code
export function queryTreeBook(params) {
  return crm.post('/crm-middle-pc/api/crisps-crm/service/yk/v1/rule/queryTreeBook.do', params);
}

// 通过客户id查客户中心号码
export function find_contacts_by_customer_id(params) {
  return api.get(
    '/crm-middle-pc/api/crisps-crm/service/nk/api/contact/v1/find_contacts_by_customer_id.do',
    params,
  );
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

//删除需求
export function edit_demand(params) {
  return api.post(
    '/crisps-resource-middle-pc/api/crisps-resource-house/service/yk/resource_details/v1/edit_unallocated.do',
    params,
  );
}
//新增需求-时间
export function getTreeBook(params) {
  return api.post(
    '/crm-middle-pc/api/crisps-crm/service/yk/biz_business/v1/getTreeBook.do',
    params,
  );
}
// 数据字典 parent
export function get_dictionary_data_by_parent_code(params) {
  return api.get(
    '/crm-middle-pc/api/crisps-crm/service/yk/v1/personal/get_dictionary_data_by_parent_code.do',
    params,
  );
}
//通过商户用户id查询群组id
export function get_group_id(params) {
  return api.get('/crm-middle-pc/api/crisps-crm/service/yk/v1/get_group_id.do', params);
}
//通过客户id查询群组id
export function get_group_id_biz(params) {
  return api.get('/crm-middle-pc/api/crisps-crm/service/yk/v1/get_group_id_biz', params);
}
//产品列表
export function get_product_list(qurry) {
  return api.post('/crm-middle-pc/api/crisps-crm/service/nk/v1/get_product_list.do', qurry);
}
//保存备用联系人
export function save_contact(qurry) {
  return api.post(
    '/crisps-resource-middle-pc/api/crisps-resource-house/service/yk/resource_details/v1/save_customer_contact.do',
    qurry,
  );
}
//获取真实手机号码
export function show_real_phone(params) {
  return api.post(
    '/crm-middle-pc/api/crisps-crm/service/yk/biz_business/v1/show_real_phone.do',
    params,
  );
}
// 写跟进;
export function write_biz_follow_record(params) {
  return api.post(
    '/crm-middle-pc/api/crisps-crm/service/yk/biz/biz_follow_record/v1/write_biz_follow_record.do',
    params,
  );
}

// 查询需求详情
export function get_requirement_info(params) {
  return api.get(
    '/crisps-resource-middle-pc/api/crisps-resource-house/service/yk/await_allocated/v1/get_requirement_info.do',
    params,
  );
}

// 查询商机最新信息
export function get_biz_by_id(params) {
  return api.get(
    '/crisps-resource-middle-pc/api/crisps-resource-house/service/yk/allocated_record/v1/get_biz_by_id.do',
    params,
  );
}

// 查询商机状态
export function list_biz_status(params) {
  return api.post(
    '/crisps-resource-middle-pc/api/crisps-resource-house/service/yk/allocated_record/v1/list_biz_status.do',
    params,
  );
}
