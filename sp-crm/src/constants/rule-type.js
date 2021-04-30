/**
 * @description 规则校验配置
 */
// 流传规则
export const flowRule = {
  val2: [
    'LZ_FIR',
    'LZ_PRI_CON',
    'LZ_PRI_SAC',
    'LZ_PUB_GRO',
    'LZ_PUB_MER',
    'LZ_CA_INT',
    'LZ_PUB_HID',
    'LZ_PUB_SE',
    'RULE_LZ_PUBLIC_TRANSFER_MOVE',
    'RULE_DELAY',
  ],

  val3: [
    'LZ_FIR',
    'LZ_PRI_CON',
    'LZ_PRI_SAC',
    'LZ_PUB_GRO',
    'LZ_PUB_MER',
    'LZ_PUB_HID',
    'LZ_PUB_SE',
    'RULE_LZ_PUBLIC_TRANSFER_MOVE',
  ],
  val4: ['LZ_PUB_HID', 'LZ_PUB_SE'],
};
// 上限规则
export const limitRule = {
  val2: ['RULE_SX_NOT_CONCERNED_LIMIT'],
};

export const MerchantflowRule = {
  val2: ['LZ_FIR'],
};
