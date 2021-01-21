import api from 'utils/api';
//提交
export function createBiz(params) {
  return api.post('/crm-middle-pc/api/crisps-crm/service/yk/biz_business/v1/createBiz.do', params);
}
//验证填入的手机号码在个人库中是否存在
export function checkBizByPhone(params) {
  return api.get(
    '/crm-middle-pc/api/crisps-crm/service/yk/biz_business/v1/checkBizByPhone.do',
    params,
  );
}
