import api from 'utils/api';
// import { param } from 'utils/helper';

// 数据字典  yapi
export function getCuleDictionaryApi(params) {
  return api.get(
    '/crm-middle-pc/api/crisps-crm/service/yk/v1/personal/query_code_dictionary.do',
    params,
  );
}
// 转介绍客户
// 列表
export function get_referral_business_list(params) {
  return api.post(
    '/crm-middle-pc/api/crisps-crm/service/yk/v1/referral/get_referral_business_list.do',
    params,
  );
}
// 我的潜在客户列表
export function get_my_potential_customer_lists(params) {
  return api.post(
    '/crm-middle-pc/api/crisps-crm/service/yk/v1/personal/get_my_potential_customer_lists.do',
    params,
  );
}
// 我的潜在客户更多更近 跟进记录
export function get_follow_up_content(params) {
  return api.post(
    '/crm-middle-pc/api/crisps-crm/service/yk/v1/personal/get_follow_up_content.do',
    params,
  );
}

// 我的潜在客户 写跟进
export function add_follow_up_content(params) {
  return api.post(
    '/crm-middle-pc/api/crisps-crm/service/yk/v1/personal/add_follow_up_content.do',
    params,
  );
}
// 我的潜在客户打电话回调
export function ring_up_callback(params) {
  return api.post(
    '/crm-middle-pc/api/crisps-crm/service/yk/v1/personal/ring_up_callback.do?',
    params,
  );
}
// 线索转商机初始化接口
export function get_conversion_business_resource(params) {
  return api.get(
    '/crm-middle-pc/api/crisps-crm/service/yk/v1/personal/get_conversion_business_resource.do',
    params,
  );
}
// 我的潜在客户线索转商机
export function clue_conversion_business(params) {
  return api.post(
    '/crm-middle-pc/api/crisps-crm/service/yk/v1/personal/clue_conversion_business.do',
    params,
  );
}

// 线索公海库
// 新增公海库线索备注
export function add_remark_to_high_seas(params) {
  return api.post(
    '/crm-middle-pc/api/crisps-crm/service/yk/v1/high_seas/add_remark_to_high_seas.do',
    params,
  );
}

//  线索公海库 量拾回线索
export function batch_pick_up_clue(params) {
  return api.post(
    '/crm-middle-pc/api/crisps-crm/service/yk/v1/high_seas/batch_pick_up_clue.do',
    params,
  );
}
// 线索公海库列表
export function get_high_seas_library_lists(params) {
  return api.post(
    '/crm-middle-pc/api/crisps-crm/service/yk/v1/high_seas/get_high_seas_library_lists.do',
    params,
  );
}
// 线索公海库  拾回并转化
export function pick_up_and_conversion(params) {
  return api.post(
    '/crm-middle-pc/api/crisps-crm/service/yk/v1/high_seas/pick_up_and_conversion.do',
    params,
  );
}
// 线索公海库 单个拾回线索
export function pick_up_clue(params) {
  return api.post('/crm-middle-pc/api/crisps-crm/service/yk/v1/high_seas/pick_up_clue.do', params);
}

// 公共库列表 getPublicLibraryApi
export function biz_business_list(params) {
  return api.post(
    '/crm-middle-pc/api/crisps-crm/service/yk/biz_business/v1/biz_business_list.do',
    params,
  );
}
// 公共库数据字典
export function get_common_lib_menu(params) {
  return api.get(
    '/crm-middle-pc/api/crisps-crm/service/yk/biz_business/v1/get_common_lib_menu.do',
    params,
  );
}
// 拾回商机
export function pickUp(params) {
  return api.get('/crm-middle-pc/api/crisps-crm/service/yk/biz_business/v1/pickUp.do', params);
}
//公海库备注
export function noteHide(params) {
  return api.post('/crm-middle-pc/api/crisps-crm/service/yk/biz_hide/v1/noteHide', params);
}
