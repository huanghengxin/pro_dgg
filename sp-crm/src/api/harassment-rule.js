import api from 'utils/api';
// import { param } from 'utils/helper';

// 获取防骚扰规则配置列表
export function get_anti_harassment_configuration_list(params) {
  return api.get(
    '/crm-middle-pc/api/crisps-crm/service/yk/v1/harassment/get_anti_harassment_configuration_list.do',
    params,
  );
}

// 修改防骚扰规则
export function modify_anti_harassment_rule(params) {
  return api.post(
    '/crm-middle-pc/api/crisps-crm/service/yk/v1/harassment/modify_anti_harassment_rule.do',
    params,
  );
}

//获取防骚扰客户列表
export function get_anti_harassment_customer_list(params) {
  return api.post(
    '/crm-middle-pc/api/crisps-crm/service/yk/v1/harassment/get_anti_harassment_customer_list.do',
    params,
  );
}
