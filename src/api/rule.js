import api from 'utils/api';

// 数据字典  rule_code
export function queryTreeBook(params) {
  return api.post('/crm-middle-pc/api/crisps-crm/service/yk/v1/rule/queryTreeBook.do', params);
}

//多个code查询数据字典
export function get_tree_book_by_codes(params) {
  return api.get(
    '/crm-middle-pc/api/crisps-crm/service/nk/treebook/v1/get_tree_book_by_codes.do',
    params,
  );
}

// 后台平台规则
export function query_rules() {
  return api.post('/crm-middle-pc/api/crisps-crm/service/yk/v1/rule/platform/query_rules.do');
}
// 后台商户规则
export function merchants_query_rules() {
  return api.post('/crm-middle-pc/api/crisps-crm/service/yk/v1/rule/merchants/query_rules.do');
}

// 平台规则保存
export function update_platform_ruleList(params) {
  return api.post(
    '/crm-middle-pc/api/crisps-crm/service/yk/v1/rule/platform/update_platform_ruleList.do',
    params,
  );
}

// 商户规则保存
export function update_merchants(params) {
  return api.post(
    '/crm-middle-pc/api/crisps-crm/service/yk/v1/rule/merchants/update_merchants.do',
    params,
  );
}

// 规则总开关 开启关闭 保存
export function exe_platform_rule_switch(params) {
  return api.post(
    '/crm-middle-pc/api/crisps-crm/service/yk/v1/rule/platform/exe_platform_rule_switch.do',
    params,
  );
}

//  总开关查询 传code
export function rules_switch_boarded(params) {
  return api.post(
    '/crm-middle-pc/api/crisps-crm/service/yk/v1/rule/platform/rules_switch_boarded.do',
    params,
  );
}
// 规则总开关保存
export function switchboardtSaveApi(params) {
  return api.get(
    '/crm-middle-pc/api/crisps-crm/service/yk/v1/rule/rules_switchboard_status_save.do',
    params,
  );
}

// // 合作联盟后台商户规则
export function query_cooperate() {
  return api.post('/crm-middle-pc/api/crisps-crm/service/yk/v1/rule/platform/query_cooperate.do');
}

// 合作联盟保存修改接口
export function save_cooperate(params) {
  return api.post(
    '/crm-middle-pc/api/crisps-crm/service/yk/v1/rule/platform/save_cooperate.do',
    params,
  );
}
