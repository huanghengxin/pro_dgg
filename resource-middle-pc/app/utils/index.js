'use strict';

// 产品属性处理
function attrHandle(item) {
  let fieldStr = item.fieldValueCn || item.fieldValue;
  switch (item.fieldCode) {
    case 'registered_capital':
      fieldStr = this.priceHandle(fieldStr);
      break;
    case 'registration_time':
      fieldStr = this.yearsHandle(fieldStr);
      break;
    case 'qualification_registration_area':
      fieldStr = fieldStr.split(',')[0];
      break;
    case 'qualification_expire_date':
      fieldStr = fieldStr.split('-')[0] + '年';
      break;
    case 'safety_production_license':
      fieldStr = fieldStr === '是' ? '有安许证' : '无安许证';
      break;
    case 'qualification_registered_capital':
      fieldStr = this.priceHandle(fieldStr);
      break;
    default:
      break;
  }
  return fieldStr;
}
/**
 * 获取薯片平台下的所有节点
 */
function getCripsInstance() {
  const { app } = this;
  const upInstances = [];
  if (app.eurekaInstances) {
    const instances = app.eurekaInstances['crisps-app-wap-bff-api'];
    if (instances && instances.length > 0) {
      for (const i of instances) {
        if (i.status.toUpperCase() === 'UP') {
          upInstances.push(i);
        }
      }
    }
  }
  return upInstances;
}
// 属性年限展示处理
function yearsHandle(str) {
  const timeArr = str.split('-').map(item => +item);
  timeArr[1] -= 1;
  const a = _moment();
  const b = _moment(timeArr);
  const diifTime = a.diff(b, 'years', true);
  if (diifTime < 1) {
    // 1年以下
    return '1年以下';
  }
  if (diifTime >= 1 && diifTime < 2) {
    // 1-2年
    return '1-2年';
  }
  if (diifTime >= 2 && diifTime < 3) {
    // 2-3年
    return '2-3年';
  }
  if (diifTime >= 3) {
    // 3年以上
    return '3年以上';
  }
  return str;
}
// 属性价格展示处理
function priceHandle(price) {
  price = this.priceFixed(`${price}/100`, 2);
  if (price < 1000000) {
    return '100以万下';
  }
  if (price >= 1000000 && price < 5000000) {
    return '100-500万';
  }
  if (price >= 5000000 && price < 10000000) {
    return '500-1000万';
  }
  if (price >= 10000000) {
    return '1000万以上';
  }
  return price;
}
// 手机号码隐藏显示
function numberSuitScanf(phoneNumber) {
  let numberString = '暂无';
  if (phoneNumber == null) {
    return numberString;
  }
  if (phoneNumber.length === 11) {
    const replaceStr = phoneNumber.substr(3, 6);
    numberString = phoneNumber.replace(replaceStr, '******');
  } else {
    const halfLength = phoneNumber.length / 2;
    if (halfLength < 4) {
      const replaceStr = phoneNumber.substr(
        phoneNumber.length - halfLength,
        halfLength
      );
      numberString = phoneNumber.replace(replaceStr, '****');
    } else {
      const replaceStr = phoneNumber.substr(phoneNumber.length - 4, 4);
      numberString = phoneNumber.replace(replaceStr, '****');
    }
  }
  return numberString;
}
/**
 * 进度计算后保留指定小数位数,返回字符串
 * @param.num: String config文件中APPID下对应的项目实例名称
 * @param.bit: String 请求路径
 * @return {String}
 */
function priceFixed(num, bit) {
  let numObj = Number(0);
  if (Number(this.calculate(num))) {
    numObj = Number(this.calculate(num));
  }
  return numObj.toFixed(bit);
}
/**
 * 精度计算
 */
function calculate(input) {
  const f = {
    add: '+',
    sub: '-',
    div: '/',
    mlt: '*',
    mod: '%',
    exp: '^',
    lk: '(',
    rk: ')',
  };
  f.ooo = [
    [[f.mlt], [f.div], [f.mod], [f.exp]],
    [[f.add], [f.sub], [f.lk], [f.rk]],
  ];

  input = input.replace(/[^0-9%^*\/\-+.]/g, ''); // 清除不必要的字符
  let output;
  for (let i = 0, n = f.ooo.length; i < n; i++) {
    // 正则表达式，用于查找浮点数或整数之间的操作符
    const re = new RegExp(
      '(\\d+\\.?\\d*)([\\' + f.ooo[i].join('\\') + '])(\\d+\\.?\\d*)'
    );
    re.lastIndex = 0; // 采取预防措施，重新启动pos
    // 循环时仍然需要计算优先级
    while (re.test(input)) {
      output = operation(+RegExp.$1, RegExp.$2, +RegExp.$3);
      if (isNaN(output) || !isFinite(output)) {
        return output;
      } // 如果不是数字就退出
      input = input.replace(re, output);
    }
  }
  return output;

  function isInteger(num) {
    // 判断一个数字是否为整数
    return Math.floor(num) === num;
  }
  function toInteger(floatNum) {
    // 将一个浮点数转换成整数，返回整数和倍数
    const ret = { times: 1, num: 0 };
    // 是整数
    if (isInteger(floatNum)) {
      ret.num = floatNum;
      return ret;
    }
    const strfi = floatNum + '';
    // 查找小数点的下标
    const dotPos = strfi.indexOf('.');
    // 获取小数的位数
    const len = strfi.substr(dotPos + 1).length;
    // Math.pow(10,len)指定10的len次幂。
    const time = Math.pow(10, len);

    // 将浮点数转化为整数
    const intNum = parseInt(floatNum * time + 0.5, 10);
    ret.times = time;
    ret.num = intNum;
    return ret;
  }
  function operation(a, op, b) {
    const o1 = toInteger(a);
    const o2 = toInteger(b);
    const n1 = o1.num;
    const n2 = o2.num;
    const t1 = o1.times;
    const t2 = o2.times;
    const max = t1 > t2 ? t1 : t2;
    let result = null;
    // eslint-disable-next-line default-case
    switch (op) {
      case f.add:
        if (t1 === t2) {
          result = n1 + n2;
        } else if (t1 > t2) {
          result = n1 + n2 * (t1 / t2);
        } else {
          result = n1 * (t2 / t1) + n2;
        }
        return result / max;
        // eslint-disable-next-line no-unreachable
        break;
      case f.sub:
        if (t1 === t2) {
          result = n1 - n2;
        } else if (t1 > t2) {
          result = n1 - n2 * (t1 / t2);
        } else {
          result = n1 * (t2 / t1) - n2;
        }
        return result / max;
        // eslint-disable-next-line no-unreachable
        break;
      case f.mlt:
        result = (n1 * n2) / (t1 * t2);
        return result;
        // eslint-disable-next-line no-unreachable
        break;
      case f.div:
        // result = (n1 / n2) / (t2 / t1);
        let _t1 = 0,
          _t2 = 0,
          r1,
          r2;
        try {
          _t1 = a.toString().split('.')[1].length;
        } catch (e) {}
        try {
          _t2 = b.toString().split('.')[1].length;
        } catch (e) {}
        r1 = Number(a.toString().replace('.', ''));
        r2 = Number(b.toString().replace('.', ''));
        result = (r1 / r2) * Math.pow(10, _t2 - _t1);
        return result;
        // eslint-disable-next-line no-unreachable
        break;
      case f.mod:
        result = (n1 / n2) % (t2 / t1);
        return result;
        // eslint-disable-next-line no-unreachable
        break;
      case f.exp:
        return Math.pow(n1 / max, n2 / max);
        // eslint-disable-next-line no-unreachable
        break;
    }
  }
}
/**
 * 将Egg的curl错误提示转换为项目统一的标准错误对象。
 * @param {Object} err  错误对象。
 * @return {Object}  错误信息对象。例如:{code: '404',message: '域名不存在',data: '域名不存在',}。
 */
function errMessage(err) {
  switch (err.code) {
    case 'ECONNRESET':
      return {
        code: '501',
        message: '服务端主动断开 socket 连接，导致 HTTP 请求链路异常',
        data: '服务端主动断开 socket 连接，导致 HTTP 请求链路异常',
      };
    case 'ECONNREFUSED':
      return {
        code: '406',
        message:
          '请求的 url 所属 IP 或者端口无法连接成功,请确保IP或者端口设置正确',
        data:
          '请求的 url 所属 IP 或者端口无法连接成功,请确保IP或者端口设置正确',
      };
    case 'ENOTFOUND':
      return {
        code: '404',
        message: `${err.path}域名不存在`,
        data: `${err.path}域名不存在`,
      };
    default:
      return {
        code: '404',
        message: `${err.path}域名不存在`,
        data: `${err.path}域名不存在`,
      };
  }
}
/**
 * 获取某个可用服务,随机取
 * @param {*} instances 所有实例
 * @return {*} json
 */
function getOneInstanceFromAll(instances) {
  if (instances != null) {
    const upInstances = [];
    for (const i of instances) {
      if (i.status.toUpperCase() === 'UP') {
        upInstances.push(i);
      }
    }
    if (upInstances.length > 0) {
      const instanceIndex =
        upInstances.length === 1 ? 0 : Date.now() % upInstances.length;
      return upInstances[instanceIndex];
    }
    return '';
  }
  return '';
}
/** Thanks to  coordinator-node-client */
/**
 * 根据实例获取一个完整的ip方式的服务地址。
 * @param {*} instance  app的实例。
 * @return {string}  url地址,包括协议，ip和端口。例如:http://192.168.1.100:8080。
 */
function getServerPath(instance) {
  let url = '';
  const http = 'http://';
  const https = 'https://';
  if (instance) {
    if (instance.port && instance.port['@enabled'] === 'true') {
      url = http + instance.ipAddr + ':' + instance.port.$;
    } else if (
      instance.securePort &&
      instance.securePort['@enabled'] === 'true'
    ) {
      url = https + instance.ipAddr + ':' + instance.securePort.$;
    }
  }
  return url;
}
module.exports = {
  getOneInstanceFromAll,
  getServerPath,
};
