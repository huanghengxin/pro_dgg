import localforage from 'localforage';

class WebStorage extends localforage.__proto__.constructor {
  constructor(config) {
    super(config);
  }
  async set(key, value) {
    try {
      return await this.setItem(key, JSON.stringify(value));
    } catch (error) {
      Promise.reject(error);
    }
  }
  async get(key) {
    try {
      const res = await this.getItem(key);
      return JSON.parse(res);
    } catch (error) {
      Promise.reject(error);
    }
  }
}

const dictStorage = new WebStorage({ name: 'dict' });
dictStorage.clear();
export { dictStorage };

//   const codes = params.codes.split(',');
//   let obj = {},
//     codeData = [];
//   for (const value of codes) {
//     const data = await dictStorage.get(value);
//     if (data) {
//       obj[value] = data;
//     } else {
//       codeData.push(value);
//     }
//   }
//   if (codeData.length) {
//     params.codes = codeData.join(',');
//     const result = await api.get(path, params);
//     if(result.code === 200){

//     }
//   }
