import api from 'utils/api';
import { param } from 'utils/helper';
//获取商机动态数量数据
export function countUnRead(params) {
  return api.get('/crm-middle-pc/api/crisps-crm/service/yk/biz_dynamic/v1/count_unread.do', params);
}

// 获取列表数据
export function myBizList(params) {
  return api.post('/crm-middle-pc/api/crisps-crm/service/yk/biz_business/v1/myBizList.do', params);
}
// 获取商机分组
export function get_business_groups(params) {
  return api.post(
    '/crm-middle-pc/api/crisps-crm/service/yk/biz_group/v1/get_business_groups.do',
    params,
  );
}
// 设置商机分组
export function set_business_group(params) {
  return api.post(
    '/crm-middle-pc/api/crisps-crm/service/yk/biz_group/v1/set_business_group.do',
    params,
  );
}

// 新增和编辑分组
export function edit_business_group(params) {
  return api.post(
    '/crm-middle-pc/api/crisps-crm/service/yk/biz_group/v1/edit_business_group.do',
    params,
  );
}

// 新增和编辑分组
export function delete_business_group(params) {
  return api.post(
    '/crm-middle-pc/api/crisps-crm/service/yk/biz_group/v1/delete_business_group.do?' +
      param(params),
    params,
  );
}

// PC加载搜索项
export function pc_menu(params) {
  return api.get('/crm-middle-pc/api/crisps-crm/service/yk/biz_business/v1/pc_menu.do', params);
}

// 商机暂不关注
export function inattention(params) {
  return api.post(
    '/crm-middle-pc/api/crisps-crm/service/yk/biz_inattention_record/v1/inattention.do',
    params,
  );
}
//商机无效商机
export function disableBiz(params) {
  return api.post('/crm-middle-pc/api/crisps-crm/service/yk/biz_business/v1/disableBiz.do', params);
}
//商机获取分机信息 主机信息
export function get_phone(params) {
  return api.get(
    '/crm-middle-pc/api/crisps-crm/service/yk/biz_business/v1/shupiancall/get_phone.do',
    params,
  );
}
//打电话接口
export function playCall(params) {
  return api.post(
    '/crm-middle-pc/api/crisps-crm/service/yk/biz_business/v1/shupiancall/call.do',
    params,
  );
}
