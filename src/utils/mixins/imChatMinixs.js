import { get_group_id_biz } from 'api/common';
const imChatMinixs = {
  methods: {
    async IMChatOpen({ customerId = '' }) {
      const res = await get_group_id_biz({
        customerId,
      });
      if (res.code === 200) {
        await this.$mainService?.IM?.openGroupChart({ groupId: res.data });
      } else {
        this.$message.warning(res.message);
        console.log(res.message, 'res.message', customerId);
      }
    },
  },
};

export default imChatMinixs;
