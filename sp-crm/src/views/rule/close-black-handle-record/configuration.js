//关黑限流 操作记录 操作动作
export const HANDLE_TYPE = [
  {
    code: undefined,
    label: '不限',
  },
  {
    code: 'OPERATION_TYPE_ONE',
    label: '单个添加',
  },
  {
    code: 'OPERATION_TYPE_TWO',
    label: '批量导入',
  },
  {
    code: 'OPERATION_TYPE_THREE',
    label: '手动取消',
  },
  {
    code: 'OPERATION_TYPE_FOUR',
    label: '自动取消',
  },
];
