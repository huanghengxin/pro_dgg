'use strict';
/**
 * @description 客源分配中心
 */
module.exports = {
  query_resource_rules_by_codes:
    '/yk/distributions/resource-distribution-rule/query_resource_rules_by_codes.do',
  save_resource_distribution_rules:
    '/yk/distributions/resource-distribution-rule/save_resource_distribution_rules.do',
  get_planner_list: '/yk/v1/will/get_planner_list.do',
  get_distribution_record_list: '/yk/v1/will/get_distribution_record_list.do',
  export_distribution_record: '/yk/v1/will/export_distribution_record.do',
  add_to_smart_allot: '/yk/v1/will/add_to_smart_allot.do',
  manual_allot: '/yk/v1/will/manual_allot.do',
  get_operation_log_list: '/yk/v1/operation/get_operation_log_list.do',
  pick_up_edit_biz: '/yk/v1/will/pick_up_edit_biz.do', // 拾回编辑资源
  add_one_to_smart_allot: '/yk/v1/will/add_one_to_smart_allot.do', // 单个智能分配
};
