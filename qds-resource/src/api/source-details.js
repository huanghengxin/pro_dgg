import api from 'utils/api';
import { createCrmApi } from 'utils/api';
let crm = createCrmApi();
import { param } from 'utils/helper';

//获取合作权限
export function get_menu_permission(qurry) {
  return crm.get(
    '/crm-middle-pc/api/crisps-crm/service/yk/cooperation/v1/get_permission.do',
    qurry,
  );
}
//获取客户需求
export function get_requirement_info(params) {
  return crm.get(
    '/crm-middle-pc/api/crisps-crm/service/yk/biz_business/v1/get_requirement_info.do',
    params,
  );
}
//删除需求
export function del_demand(params) {
  return crm.post(
    '/crm-middle-pc/api/crisps-crm/service/yk/biz/biz_requirement/v1/del?' + param(params),
    params,
  );
}
//商机详情
export function get_business_info(params) {
  return api.get(
    '/crisps-resource-middle-pc/api/crisps-resource-house/service/yk/resource_details/v1/get_business_detail.do',
    params,
  );
}
//获取跟进记录--全部/跟进/打电话
export function follow_record_list(params) {
  return crm.post(
    '/crm-middle-pc/api/crisps-crm/service/yk/biz/biz_follow_record/v1/follow_record_list',
    params,
  );
}
//获取跟进记录--邀约面谈
export function interview_list(params) {
  return crm.get(
    '/crm-middle-pc/api/crisps-crm/service/yk/web/biz_interview_record/v1/interview_list',
    params,
  );
}
//获取邀约条数、面谈条数
export function count_interview(params) {
  return crm.get(
    '/crm-middle-pc/api/crisps-crm/service/yk/web/biz_interview_record/v1/count_interview',
    params,
  );
}
//取消面谈
export function cancel_interview(params) {
  return crm.post(
    '/crm-middle-pc/api/crisps-crm/service/yk/web/biz_interview_record/v1/cancel_interview?' +
      param(params),
    params,
  );
}
//合作关系建立X天后，发起人解除合作无需合作接收方同意，请知晓。
export function get_relieve_timeout(qurry) {
  return crm.get(
    '/crm-middle-pc/api/crisps-crm/service/yk/v1/rule/platform/get_relieve_timeout.do',
    qurry,
  );
}
//查询商机角色
export function get_list_by_role(params) {
  return crm.get(
    '/crm-middle-pc/api/crisps-crm/service/yk/cooperation/v1/get_list_by_role.do',
    params,
  );
}
//拒绝合作 -合作接收方列表
export function rejectCooperation(params) {
  return crm.post('/crm-middle-pc/api/crisps-crm/service/yk/cooperation/v1/reject.do', params);
}
//发起解除合作  -商机详情
export function apply_relieve(params) {
  return crm.post(
    '/crm-middle-pc/api/crisps-crm/service/yk/cooperation/dissolution/v1/apply.do',
    params,
  );
}
//查询拒绝原因
export function get_refuse_coooeration_reason(params) {
  return crm.get('http://yapi.dgg.cn/mock/432/get_refuse_coooeration_reason', params);
}
// 获取商机分组
export function get_business_groups(params) {
  return crm.post(
    '/crm-middle-pc/api/crisps-crm/service/yk/biz_group/v1/get_business_groups.do',
    params,
  );
}
// 商务经理--写跟进
export function write_biz_follow_record_manage(params) {
  return crm.post(
    '/crm-middle-pc/api/crisps-crm/service/yk/biz/biz_follow_record/v1/write_biz_follow_record_manage.do',
    params,
  );
}
//编辑商机备注
export function edit_biz_comment(params) {
  return crm.post(
    '/crm-middle-pc/api/crisps-crm/service/yk/biz_business/v1/edit_biz_comment.do',
    params,
  );
}
// 新增和编辑分组
export function edit_business_group(params) {
  return crm.post(
    '/crm-middle-pc/api/crisps-crm/service/yk/biz_group/v1/edit_business_group.do',
    params,
  );
}
// 新增和编辑分组
export function delete_business_group(params) {
  return crm.post(
    '/crm-middle-pc/api/crisps-crm/service/yk/biz_group/v1/delete_business_group.do?' +
      param(params),
    params,
  );
}
