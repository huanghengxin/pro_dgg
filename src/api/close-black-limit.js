import api from 'utils/api';
import { param } from 'utils/helper';
// 关黑限流列表
export function limit_list(params) {
  return api.get(
    '/crm-middle-pc/api/crisps-crm/service/yk/rule_planner_flow_limit/v1/limit_list.do',
    params,
  );
}

//批量导入关黑限流数据
export function import_flow_limit(params, type = '') {
  return api.form(
    '/crm-middle-pc/api/crisps-crm/service/yk/rule_planner_flow_limit/v1/import_flow_limit.do?type=' +
      type,
    params,
  );
}

//错误数据导出excel表格;
export function export_limit_list(params) {
  return api.post(
    '/crm-middle-pc/api/crisps-crm/service/yk/rule_planner_flow_limit/v1/export_limit_list.do',
    params,
    {},
    true,
  );
}

//导出关黑限流日志列表
export function export_log_list(params) {
  return api.post(
    '/crm-middle-pc/api/crisps-crm/service/yk/rule_planner_flow_limit/v1/export_log_list.do',
    params,
    {},
    true,
  );
}

// 关黑限流日志列表
export function limit_log_list(params) {
  return api.post(
    '/crm-middle-pc/api/crisps-crm/service/yk/rule_planner_flow_limit/v1/limit_log_list.do',
    params,
  );
}

//手动新增限流
export function insert(params) {
  return api.post(
    '/crm-middle-pc/api/crisps-crm/service/yk/rule_planner_flow_limit/v1/insert.do',
    params,
  );
}

//手动取消限流
export function cancel_limit(params) {
  return api.post(
    '/crm-middle-pc/api/crisps-crm/service/yk/rule_planner_flow_limit/v1/cancel_limit.do',
    params,
  );
}

//关黑限流详情
export function limit_detail(params) {
  return api.get(
    '/crm-middle-pc/api/crisps-crm/service/yk/rule_planner_flow_limit/v1/limit_detail.do',
    params,
  );
}

// 限制方式  数据字典
export function get_dictionary_data_by_parent_code(params) {
  return api.get(
    '/crm-middle-pc/api/crisps-crm/service/yk/v1/personal/get_dictionary_data_by_parent_code.do',
    params,
  );
}

//查询人员列表接口
export function get_plat_form_user_info_list(params) {
  return api.post(
    '/crm-middle-pc/api/crisps-crm/service/nk/v1/get_plat_form_user_info_list.do',
    params,
  );
}

//根据条件分页查询商户列表
export function page_list(params) {
  return api.post(
    '/crm-middle-pc/api/crisps-crm/service/yk/merchant/detail/v1/page_list.do',
    params,
  );
}

//下载模板
export function find(params) {
  return api.get('/tac-external-platform-server/oss/find?' + param(params));
}
