/**
 * axios请求封装
 * @author chenmb
 * @since 2020/11/12
 */
import Vue from 'vue';
import axios from 'axios';
import { sign } from '@fe/common';
import CONFIG from '@/config';
import store from 'storejs';
import router from '@/router';

// 支持的方法
const methods = ['get', 'head', 'post', 'put', 'delete', 'options', 'patch', 'form'];
const paramsMethods = ['get', 'delete'];

// 添加请求前缀
const API_PREFIX = '/api';

// 允许携带cookie
axios.defaults.withCredentials = true;

class Api {
  constructor(sysCode, secret) {
    this.sysCode = sysCode;
    this.secret = secret;
    methods.forEach(
      (method) =>
        (this[method] = (path, data, headers = {}, isFile) =>
          new Promise((resolve, reject) => {
            this.doFetch(method, path, data, headers, resolve, reject, isFile);
          })),
    );
  }

  doFetch(method, path, data, headers, resolve, reject, isFile = false) {
    axios.defaults.responseType = isFile ? 'blob' : 'text';
    let fileConfig = {};
    const isForm = method === 'form';
    const formData = isForm ? new FormData() : null;
    const token = store.get('token') || undefined;
    let signDataObj = {
      method,
      sysCode: this.sysCode || CONFIG.SYS_CODE,
      secret: this.secret || CONFIG.SECRET,
      token: token,
    };
    if (isForm) {
      if (data && data.length > 0) {
        const paths = [];
        data.forEach((file) => {
          formData.append('file', file);
          paths.push(file.title);
        });
        formData.append('paths', paths.toString(','));
      } else {
        if (data.file instanceof File) {
          fileConfig = {
            onUploadProgress: function (e) {
              if (e.total > 0) {
                e.percent = (e.loaded / e.total) * 100;
              }
              data.onProgress(e);
            },
          };
          formData.append('file', data.file, data.file.name);
        } else {
          const dataKeys = Object.keys(data);
          for (const key of dataKeys) {
            formData.append(key, data[key]);
          }
        }
      }
    } else {
      signDataObj.rawData = data;
    }

    // 签名
    // data = Object.values(data).every((_) => _ === undefined) ? undefined : data;
    const signData = sign(signDataObj);

    const config = {
      headers: {
        'Content-Type': isForm ? 'multipart/form-data' : 'application/json',
        ...headers,
        ...signData,
      },
    };
    data = paramsMethods.indexOf(method) !== -1 ? { params: data, ...config } : data;
    const _path = path.indexOf('http') === 0 ? path : `${API_PREFIX}${path}`;
    axios[isForm ? 'post' : method](
      _path,
      isForm ? formData : data,
      Object.assign({}, config, fileConfig),
    )
      .then(({ data }) => {
        resolve(data);
        if (data.code === 5223) {
          Vue.prototype.$mainService?.logout();
          if (!window.SP_MICRO_FE) {
            router.push('/login');
          }
        }
      })
      .catch(async (error) => {
        reject(error);
      });
  }
}

const api = new Api();

export default api;

export function createLoginApi() {
  return new Api(CONFIG.LOGIN_SYS_CODE, CONFIG.LOGIN_SECRET);
}
