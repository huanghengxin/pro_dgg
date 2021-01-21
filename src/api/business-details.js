import api from 'utils/api';
import { param } from 'utils/helper';

//查询关联企业
export function find_companys_by_customerid(params) {
  return api.get(
    '/crm-middle-pc/api/crisps-crm/service/yk/biz_customer/find_companys_by_customerid.do',
    params,
  );
}

//获取跟进记录--全部/跟进/打电话
export function follow_record_list(params) {
  return api.post(
    '/crm-middle-pc/api/crisps-crm/service/yk/biz/biz_follow_record/v1/follow_record_list',
    params,
  );
}

//获取跟进记录--邀约面谈
export function interview_list(params) {
  return api.get(
    '/crm-middle-pc/api/crisps-crm/service/yk/web/biz_interview_record/v1/interview_list',
    params,
  );
}

//获取邀约条数、面谈条数
export function count_interview(params) {
  return api.get(
    '/crm-middle-pc/api/crisps-crm/service/yk/web/biz_interview_record/v1/count_interview',
    params,
  );
}

//取消面谈
export function cancel_interview(params) {
  return api.post(
    '/crm-middle-pc/api/crisps-crm/service/yk/web/biz_interview_record/v1/cancel_interview?' +
      param(params),
    params,
  );
}

//获取客户需求
export function get_requirement_info(params) {
  return api.get(
    '/crm-middle-pc/api/crisps-crm/service/yk/biz_business/v1/get_requirement_info.do',
    params,
  );
}

//商机详情
export function get_business_info(params) {
  return api.get(
    '/crm-middle-pc/api/crisps-crm/service/yk/biz_business/v1/get_business_info.do',
    params,
  );
}

//解除关联
export function remove_customer_company(params) {
  return api.get(
    '/crm-middle-pc/api/crisps-crm/service/yk/biz_customer/remove_customer_company.do',
    params,
  );
}

//编辑商机备注
export function edit_biz_comment(params) {
  return api.post(
    '/crm-middle-pc/api/crisps-crm/service/yk/biz_business/v1/edit_biz_comment.do',
    params,
  );
}

//设置下次跟进时间
export function set_next_follow_time(params) {
  return api.post(
    '/crm-middle-pc/api/crisps-crm/service/yk/biz/biz_follow_record/v1/set_next_follow_time.do',
    params,
  );
}
//删除需求
export function del_demand(params) {
  return api.post(
    '/crm-middle-pc/api/crisps-crm/service/yk/biz/biz_requirement/v1/del?' + param(params),
    params,
  );
}
