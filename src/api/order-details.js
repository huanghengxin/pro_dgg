import api from 'utils/api';
//订单详情-订单信息
export function order_details_order_information() {
  return api.get('http://yapi.dgg.cn/mock/307/order_information.do');
}
//订单详情-订单产品
export function order_details_order_product() {
  return api.get('http://yapi.dgg.cn/mock/307/order_products.do');
}
//订单详情-发票申请记录
export function order_details_invoice_table() {
  return api.get('http://yapi.dgg.cn/mock/307/invoice_table.do');
}
//订单详情-合同申请记录
export function order_details_contract_table() {
  return api.get('http://yapi.dgg.cn/mock/307/contract_table.do');
}
//订单详情-生产信息_订单信息
export function order_details_production_table() {
  return api.get('http://yapi.dgg.cn/mock/307/production_table.do');
}

//生产信息——订单信息
export function production_basic() {
  return api.get('http://yapi.dgg.cn/mock/307/production_basic.do');
}
//生产信息-基本信息-生产进度
export function production_plan() {
  return api.get('http://yapi.dgg.cn/mock/307/production_plan.do');
}
//生产信息-底单信息
export function production_bottom() {
  return api.get('http://yapi.dgg.cn/mock/307/production_bottom.do');
}
//订单列表-内容
export function order_list() {
  return api.get('http://yapi.dgg.cn/mock/307/order_list.do');
}
