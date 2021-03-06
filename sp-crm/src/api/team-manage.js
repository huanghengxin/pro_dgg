import api from 'utils/api';
// 批量移交商机
export function batch_move_business(params) {
  return api.post(
    '/crm-middle-pc/api/crisps-crm/service/yk/v1/move/batch_move_business.do',
    params,
  );
}
// 获取商机管理列表
export function get_business_management(params) {
  return api.post(
    '/crm-middle-pc/api/crisps-crm/service/yk/v1/move/get_business_management.do',
    params,
  );
}
// 失效某商机
export function lose_efficacy_business(params) {
  return api.post(
    '/crm-middle-pc/api/crisps-crm/service/yk/v1/move/lose_efficacy_business.do',
    params,
  );
}
// 单个移交商机
export function single_move_business(params) {
  return api.post(
    '/crm-middle-pc/api/crisps-crm/service/yk/v1/move/single_move_business.do',
    params,
  );
}
// 单个移交弹出框初始化
export function single_move_page_initialization(params) {
  return api.get(
    '/crm-middle-pc/api/crisps-crm/service/yk/v1/move/single_move_page_initialization.do',
    params,
  );
}
// 商务经理--写跟进

export function write_biz_follow_record_manage(params) {
  return api.post(
    '/crm-middle-pc/api/crisps-crm/service/yk/biz/biz_follow_record/v1/write_biz_follow_record_manage.do',
    params,
  );
}
