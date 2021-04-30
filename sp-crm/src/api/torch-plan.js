import api from 'utils/api';
//获取规则列表
export function get_config_by_detail(params) {
  return api.get(
    '/crm-middle-pc/api/crisps-crm/service/yk/firewood/get_config_by_detail.do',
    params,
  );
}
//获取人员列表
export function get_people_list(params) {
  return api.post(
    '/crm-middle-pc/api/crisps-crm/service/yk/firewood/get_salary_fire_user_page.do',
    params,
  );
}
//保存规则
export function add_update_config(params) {
  return api.post('/crm-middle-pc/api/crisps-crm/service/yk/firewood/add_update_config.do', params);
}
//导出
export function get_salary_fire_user_page(params) {
  return api.post(
    '/crm-middle-pc/api/crisps-crm/service/yk/firewood/get_salary_fire_user_page.export',
    params,
    {},
    true,
  );
}
