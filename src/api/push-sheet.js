import api from 'utils/api';
//获取商机列表数据
export function myBizList(params) {
  return api.post(
    '/crm-middle-pc/api/crisps-crm/service/yk/biz_business/v1/order_biz_list.do',
    params,
  );
}
//根据商机id获取商机数据
export function get_business_info(params) {
  return api.get(
    '/crm-middle-pc/api/crisps-crm/service/yk/biz_business/v1/get_business_info.do',
    params,
  );
}
//获取服务产品列表数据
export function get_page(params) {
  return api.post(
    '/crm-middle-pc/api/crisps-crm/service/yk/product/service/v1/get_page.do',
    params,
  );
}
// 获取用户授权的区域范围;
export function get_user_website(params) {
  return api.get('/crm-middle-pc/api/crisps-crm/service/yk/v1/get_user_website.do', params);
}
// 获取用户已配置的授权业务信息接口;
export function get_user_business_category(params) {
  return api.get(
    '/crm-middle-pc/api/crisps-crm/service/yk/v1/get_user_business_category.do',
    params,
  );
}
export function getProductInfo(params) {
  return api.get('/business_ding_qi_cha.do', params);
}

export function getAddressResource(params) {
  return api.get('/business_ding_qi_cha.do', params);
}

export function getDesigneeData(params) {
  return api.get('/business_ding_qi_cha.do', params);
}
