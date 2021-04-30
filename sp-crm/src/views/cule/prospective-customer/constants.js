export const CLUE_SOURCE_LIST = [
  { code: 'QDS_CLUE_SOURCE_SEAS', name: '留资线索' },
  { code: 'QDS_CLUE_SOURCE_IM', name: 'IM线索' },
];
export const CLUE_IMPOWER_LIST = [
  { code: 'NO', name: '未授权' },
  { code: 'YES', name: '已授权' },
];
export const CLUE_STATUS_LIST = [
  { code: 'QDS_CLUE_STATUS_NOT', name: '待联系' },
  { code: 'QDS_CLUE_STATUS_ALREADY', name: '已联系' },
];

export const QDS_CLUE_SOURCE_STAS_LIST = [
  { code: 'clueStatus', name: '是否联系', searchList: CLUE_STATUS_LIST },
];

export const QDS_CLUE_SOURCE_IM_LIST = [
  { code: 'accredit', name: '号码授权', searchList: CLUE_IMPOWER_LIST },
  { code: 'clueStatus', name: '是否联系', searchList: CLUE_STATUS_LIST },
];
