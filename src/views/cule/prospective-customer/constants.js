export const CULE_SOURCE_LIST = [
  { code: 'QDS_ClUE_SOURCE_STAY', name: '留资线索' },
  { code: 'QDS_ClUE_SOURCE_IM', name: 'IM线索' },
];
export const CULE_IMPOWER_LIST = [
  { code: 'QDS_ClUE_IMPOWER_NOT', name: '未授权' },
  { code: 'DS_ClUE_IMPOWER_YES', name: '已授权' },
];
export const CULE_STATUS_LIST = [
  { code: 'QDS_ClUE_STATUS_NOT', name: '未联系' },
  { code: 'QDS_ClUE_STATUS_ALREADY', name: '已联系' },
];

export const QDS_ClUE_SOURCE_STAY_LIST = [
  { code: 'clueStatus', name: '是否联系', searchList: CULE_STATUS_LIST },
];

export const QDS_ClUE_SOURCE_IM_LIST = [
  { code: 'clueImpower', name: '号码授权', searchList: CULE_IMPOWER_LIST },
  { code: 'clueStatus', name: '是否联系', searchList: CULE_STATUS_LIST },
];
