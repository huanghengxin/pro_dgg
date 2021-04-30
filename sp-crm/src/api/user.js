import { createLoginApi } from 'utils/api.js';
const api = createLoginApi();
import { config, envs } from '../../config.js';
let baseURL = '';
baseURL = envs.find((item) => {
  return item.branch == config.branch;
}).apiProxies['/api/*'];

const AuthCenter = '/crisps-auth-center-api';
const UserCenter = '/crisps-user-center-api';
export const UserApi = {
  login: (data) => api.post(`${baseURL}${AuthCenter}/nk/auth/v1/login.do`, data),
  getUserInfo: (data) =>
    api.get(`${baseURL}${UserCenter}/yk/user/v1/find_user_decrypt_by_id.do`, data),
};
const serverName = '/crisps-system';
export const AppApi = {
  // 获取所有应用
  getUserApps: (data) => api.get(`${baseURL}${serverName}/user/v1/apps.do`, data),
  // 查询应用详情
  findAppDetail: (data) => api.get(`${baseURL}${serverName}/app/v1/find.do`, data),
  // 获取应用菜单
  getAppMenus: (data) => api.get(`${baseURL}${serverName}/auth/menu/v1/tree.do`, data),
};
