import { get_group_id_biz, get_group_id } from 'api/common';
const imChatMinixs = {
  methods: {
    async IMChatOpen({ customerId = '', userId = '' }, type) {
      let path,
        params = {};
      if (type === 'userId') {
        path = get_group_id;
        params.userId = userId;
      } else {
        path = get_group_id_biz;
        params.customerId = customerId;
      }
      try {
        const res = await path(params);
        if (!res) return;
        if (res.code === 200) {
          await this.$mainService?.IM?.openGroupChart({ groupId: res.data });
        } else {
          this.$message.warning(res.message);
        }
      } catch (error) {
        console.error(error, 'IMChatOpen');
      }
    },
  },
};

export default imChatMinixs;
