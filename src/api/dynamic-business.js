import api from 'utils/api';
//获取数据
export function dynamic_list(params) {
  return api.post(
    '/crm-middle-pc/api/crisps-crm/service/yk/biz_dynamic/v1/dynamic_list.do',
    params,
  );
}
// 拾回商机
export function pickUp(params) {
  return api.get('/crm-middle-pc/api/crisps-crm/service/yk/biz_business/v1/pickUp.do', params);
}
