import api from 'utils/api';
// import { param } from 'utils/helper';
//查询维护人
export function get_business_accendant(params) {
  return api.get('http://yapi.dgg.cn/mock/432/get_business_accendant', params);
}
//查询合作联盟
export function get_business_cooperation_alliance(params) {
  return api.get('http://yapi.dgg.cn/mock/432/get_business_cooperation_alliance', params);
}
//查询合作联盟
export function get_cooperation_alliance_list(params) {
  return api.get('http://yapi.dgg.cn/mock/432/get_cooperation_alliance_list', params);
}
//查询拒绝原因
export function get_refuse_coooeration_reason(params) {
  return api.get('http://yapi.dgg.cn/mock/432/get_refuse_coooeration_reason', params);
}

//查询拒绝原因
export function get_shujuzidian(params) {
  return api.get('http://yapi.dgg.cn/mock/432/get_shujuzidian', params);
}
