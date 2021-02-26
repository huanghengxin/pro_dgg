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

// 支持的方法
const methods = ['get', 'head', 'post', 'put', 'delete', 'options', 'patch', 'form'];
const paramsMethods = ['get', 'delete'];

// 添加请求前缀
const API_PREFIX = '/api';

// 允许携带cookie
axios.defaults.withCredentials = true;

class Api {
  constructor() {
    methods.forEach(
      (method) =>
        (this[method] = (path, data = {}, headers = {}, isFile) =>
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
            onUploadProgress: function(e) {
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
    }
    const token = store.get('token') || undefined;
    // 签名
    const signData = sign({
      method,
      rawData: data,
      sysCode: CONFIG.SYS_CODE,
      secret: CONFIG.SECRET,
      token: token,
      // token: '758741708686645825',
    });
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
        }
      })
      .catch(async (error) => {
        Vue.prototype.$message({
          message: data?.message,
          type: 'error',
        });
        reject(error);
      });
  }
}

const api = new Api();

export default api;
