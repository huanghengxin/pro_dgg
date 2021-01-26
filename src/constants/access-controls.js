/**
 * @description 商机列表权限控制
 */

//详情中权限判断
const accControls = {
  // 暂不关注
  noAttention: {
    noAttention: 1, //为1是暂不关注 //2为恢复暂不关注
  },
};

//列表中权限判断

const accControlsList = function(row) {
  const signOrder = {
    left: {
      name: '写跟进',
      command: {
        component: 'reset-attention',
        id: row.id,
      },
    },
    right: {
      name: '打电话',
      command: { component: 'callPhoneRef', item: row },
    },
  };
  const all = {
    left: {
      name: '写跟进',
      command: {
        component: 'reset-attention',
        id: row.id,
      },
    },
    right: [
      {
        name: '打电话',
        command: { component: 'callPhoneRef', item: row },
      },
      {
        name: '设置分组',
        command: { component: 'setGroupRef', item: row },
      },
      {
        name: '邀约面谈',
        command: { component: 'inviteInterviewRef', item: row },
      },
      {
        name: '暂不关注',
        command: {
          component: 'noAttentionRef',
          item: { code: 'BUS_ZBGZ', busId: row.id },
        },
      },
      {
        name: '无效',
        command: {
          component: 'noAttentionRef',
          item: { code: 'BUS_WXSJ', busId: row.id },
        },
      },
    ],
  };
  // 暂不关注
  const noAttention = {
    left: {
      name: '恢复关注',
      command: {
        component: 'reset-attention',
        id: row.id,
      },
    },
  };
  return { signOrder, all, noAttention };
};

export { accControls, accControlsList };
