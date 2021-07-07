import api from 'utils/api';
import { createCrmApi } from 'utils/api';
let crm = createCrmApi();

//查询人员列表接口
export function get_plat_form_user_info_list(params) {
  return crm.post(
    '/crm-middle-pc/api/crisps-crm/service/nk/v1/get_plat_form_user_info_list.do',
    params,
  );
}
//根据条件分页查询商户列表
export function page_list(params) {
  return crm.post(
    '/crm-middle-pc/api/crisps-crm/service/yk/merchant/detail/v1/page_list.do',
    params,
  );
}
//根据条件分页查询服务商
export function get_detail_page(params) {
  return crm.post('/crm-middle-pc/api/crisps-crm/service/yk/firewood/get_detail_page.do', params);
}
//获取商户下得商务信息
export function get_mch_user_info_list(qurry) {
  return crm.post('/crm-middle-pc/api/crisps-crm/service/nk/v1/get_mch_user_info_list.do', qurry);
}
