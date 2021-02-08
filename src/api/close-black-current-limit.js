import api from 'utils/api';
// 关黑限流列表 Yapi
export function closeblack_currentlimit() {
  return api.get('http://yapi.dgg.cn/mock/117/closeblack_currentlimit.do');
}

// 关黑限流列表
export function limit_list(params) {
  return api.get('http://172.16.133.198:10103/yk/rule_planner_flow_limit/v1/limit_list.do', params);
}

// //批量导入关黑限流数据
// export function import_flow_limit() {
//   return api.get('http://172.16.133.198:10103/yk/rule_planner_flow_limit/v1/import_flow_limit.do');
// }

// 关黑限流日志列表
export function limit_log_list(params) {
  return api.post(
    'http://172.16.133.198:10103/yk/rule_planner_flow_limit/v1/limit_log_list.do',
    params,
  );
}

//手动新增限流
export function insert(params) {
  return api.post('http://172.16.133.198:10103/yk/rule_planner_flow_limit/v1/insert.do', params);
}

//手动取消限流
export function cancel_limit(params) {
  return api.post(
    'http://172.16.133.198:10103/yk/rule_planner_flow_limit/v1/cancel_limit.do',
    params,
  );
}

//关黑限流详情
export function limit_detail(params) {
  return api.get(
    'http://172.16.133.198:10103/yk/rule_planner_flow_limit/v1/limit_detail.do',
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
