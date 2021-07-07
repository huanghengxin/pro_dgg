import { createResourceApi } from 'utils/api';
const api = createResourceApi();
// import { param } from 'utils/helper';

//录入客源
export function add_source(params) {
  return api.post(
    '/crisps-resource-middle-pc/api/crisps-resource-house/service/yk/add_source/v1/add_source.do',
    params,
  );
}

//完善客源
export function complete_clue(params) {
  return api.post(
    '/crisps-resource-middle-pc/api/crisps-resource-house/service/yk/wait_confirm/v1/complete_clue.do',
    params,
  );
}
//完善客源提示
export function find_by_id(params) {
  return api.get(
    '/crisps-resource-middle-pc/api/crisps-resource-house/service/yk/wait_confirm/v1/find_by_id.do',
    params,
  );
}

//手机号失焦查询客户商机
export function check_biz_by_phone(params) {
  return api.get(
    '/crisps-resource-middle-pc/api/crisps-resource-house/service/yk/add_source/v1/check_biz_by_phone.do',
    params,
  );
}

//获取平台与企大顺客源
export function get_source_list(params) {
  return api.post(
    '/crisps-resource-middle-pc/api/crisps-resource-house/service/yk/add_source/v1/get_source_list.do',
    params,
  );
}

// 查找商机
export function find_detailed_by_id(params) {
  return api.get(
    '/crisps-resource-middle-pc/api/crisps-resource-house/service/yk/add_source/v1/find_resource_details_by_id.do',
    params,
  );
}
// 拾回商机
export function handle_back(params) {
  return api.post(
    '/crisps-resource-middle-pc/api/crisps-resource-house/service/yk/add_source/v1/handle_back.do',
    params,
  );
}

//录入记录
export function add_record(params) {
  return api.post(
    '/crisps-resource-middle-pc/api/crisps-resource-house/service/yk/record_entry/v1/get_record_entry_list.do',
    params,
  );
}

//待确认
export function wait_sure_customer(params) {
  return api.post(
    '/crisps-resource-middle-pc/api/crisps-resource-house/service/yk/wait_confirm/v1/get_wait_confirm_list.do',
    params,
  );
}

//待确认  删除
export function delete_clue(params) {
  return api.get(
    '/crisps-resource-middle-pc/api/crisps-resource-house/service/yk/wait_confirm/v1/delete_clue.do',
    params,
  );
}

//待分配
export function get_await_allocated_list(params) {
  return api.post(
    '/crisps-resource-middle-pc/api/crisps-resource-house/service/yk/await_allocated/v1/get_await_allocated_list.do',
    params,
  );
}

//分配记录
export function get_allocated_record_list(params) {
  return api.post(
    '/crisps-resource-middle-pc/api/crisps-resource-house/service/yk/allocated_record/v1/get_allocated_record_list.do',
    params,
  );
}

//导出
export function export_allocated_record_list(params) {
  return api.post(
    '/crisps-resource-middle-pc/api/crisps-resource-house/service/yk/allocated_record/v1/export_allocated_record_list.do',
    params,
  );
}

//分配人员列表
export function get_people_list(params) {
  return api.post(
    '/crisps-resource-middle-pc/api/crisps-resource-house/service/yk/await_allocated/v1/get_people_list.do',
    params,
  );
}

// 测试客源
export function get_test_resource_list(params) {
  return api.post(
    '/crisps-resource-middle-pc/api/crisps-resource-house/service/yk/test_resource/v1/get_test_resource_list.do',
    params,
  );
}
// 测试客源 删除
export function delete_by_id(params) {
  return api.post(
    '/crisps-resource-middle-pc/api/crisps-resource-house/service/yk/test_resource/v1/delete_by_id.do',
    params,
  );
}

// 设置分配方式
export function get_biz_distribution_type(params) {
  return api.post(
    '/crisps-resource-middle-pc/api/crisps-resource-house/service/yk/distribution_set/v1/get_biz_distribution_type.do',
    params,
  );
}
// 保存分配方式
export function save_resource_distribution_rules(params) {
  return api.post(
    '/crisps-resource-middle-pc/api/crisps-resource-house/service/yk/distribution_set/v1/save_resource_distribution_rules.do',
    params,
  );
}
//智能分配日志
export function get_operation_log_list(params) {
  return api.post(
    '/crisps-resource-middle-pc/api/crisps-resource-house/service/yk/distribution_set/v1/get_operation_log_list.do',
    params,
  );
}
// 手动分配
export function handle_allocated_biz(params) {
  return api.post(
    '/crisps-resource-middle-pc/api/crisps-resource-house/service/yk/await_allocated/v1/handle_allocated_biz.do',
    params,
  );
}

// 删除商机
export function delete_biz(params) {
  return api.post(
    '/crisps-resource-middle-pc/api/crisps-resource-house/service/yk/await_allocated/v1/delete_biz.do',
    params,
  );
}

// 编辑客源
export function update_business(params) {
  return api.post(
    '/crisps-resource-middle-pc/api/crisps-resource-house/service/yk/await_allocated/v1/update_business.do',
    params,
  );
}

// 智能分配批量
export function add_to_smart_allot(params) {
  return api.post(
    '/crisps-resource-middle-pc/api/crisps-resource-house/service/yk/await_allocated/v1/add_to_smart_allot.do',
    params,
  );
}
// 智能分配单个
export function add_one_to_smart_allot(params) {
  return api.post(
    '/crisps-resource-middle-pc/api/crisps-resource-house/service/yk/await_allocated/v1/add_one_to_smart_allot.do',
    params,
  );
}

// 关黑限流判断
export function query_limit(params) {
  return api.post(
    '/crisps-resource-middle-pc/api/crisps-resource-house/service/yk/await_allocated/v1/query_limit.do',
    params,
  );
}
