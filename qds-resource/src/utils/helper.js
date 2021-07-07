import dayjs from 'dayjs';

/**
 * @param {Array} actual
 * @returns {Array}
 */
export function cleanArray(actual) {
  const newArray = [];
  for (let i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i]);
    }
  }
  return newArray;
}
/**
 * @param {Object} json
 * @returns {Array}
 */
export function param(json) {
  if (!json) return '';
  return cleanArray(
    Object.keys(json).map((key) => {
      if (json[key] === undefined) return '';
      return encodeURIComponent(key) + '=' + encodeURIComponent(json[key]);
    }),
  ).join('&');
}

export function getQueryString(url) {
  url = url == null ? window.location.href : url;
  const search = url.substring(url.lastIndexOf('?') + 1);
  const obj = {};
  const reg = /([^?&=]+)=([^?&=]*)/g;
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1);
    let val = decodeURIComponent($2);
    val = String(val);
    obj[name] = val;
    return rs;
  });
  return obj;
}

export function filterTime(times, type) {
  let time = dayjs(times);
  if (!time.isValid()) return times; //检查对象变量是否已经实例化
  const day = dayjs().startOf('D'); //当前0点
  const next = dayjs()
    .add(1, 'd')
    .startOf('D');
  const prev = dayjs()
    .subtract(1, 'd')
    .startOf('D');
  const nowTime = dayjs();
  const oneDay = 1000 * 60 * 60 * 24;
  const oneH = 1000 * 60 * 60;
  const oneM = 1000 * 60;
  const value = nowTime - time;
  if (type === 'mustUnderstand') {
    if (value <= oneM && value >= 0) {
      return '刚刚';
    } else if (value <= oneH && value >= 0) {
      return Math.floor(value / 1000 / 60) + '分钟前';
    } else if (time < next && time >= day && value >= 0) {
      return Math.floor(value / 1000 / (60 * 60)) + '小时前';
    } else if (time < day && value <= oneDay) {
      return '昨日' + dayjs(time).format('HH:mm');
    } else {
      return dayjs(time).format('YYYY-MM-DD HH:mm');
    }
  } else if (time >= day && time < day + oneDay) {
    return '今日' + dayjs(time).format('HH:mm');
  } else if (next <= time && time < next + oneDay) {
    return '明日' + dayjs(time).format('HH:mm');
  } else if (time < day && time >= prev) {
    return '昨日' + dayjs(time).format('HH:mm');
  } else {
    return dayjs(time).format('YYYY-MM-DD HH:mm');
  }
}
export function filterWithSecTime(times) {
  let time = dayjs(times);
  if (!time.isValid()) return times;
  return dayjs(time).format('YYYY-MM-DD HH:mm');
}

export function isObject(val) {
  return val !== null && typeof val === 'object';
}
