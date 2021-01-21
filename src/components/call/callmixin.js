/* eslint-disable */
export default {
  methods: {
    //监听通话session 事件
    listenUserAgentSessionEvent(userAgentSession) {
      //接听
      userAgentSession.on('accepted', () => {
        this.dialogCallInTitle = '通话中...';
        this.callState = 2;
        this.setCallDurationInterval();
        // this.acceptphone(userAgentSession)
        console.log('接听');
      });
      //取消呼叫
      userAgentSession.on('cancel', () => {
        this.callState = 0; // 打电话状态 0 空闲中 1 呼叫中 2 通话中
        console.log('取消呼叫');

        // console.log('11111end取消呼叫');
      });
      //呼叫失败
      userAgentSession.on('failed', (response) => {
        this.dialogCallIn = false;
        this.callState = 0;
        this.$message.error('呼叫失败!');

        // console.log('11111end呼叫失败');
        console.log('呼叫失败response:' + response);
      });
      //无法接通
      userAgentSession.on('rejected', (response, cause) => {
        console.log('无法接通');

        // console.log('11111end无法接通');
      });
      //挂机
      userAgentSession.on('bye', (request) => {
        console.log('挂机');
      });
      //结束
      userAgentSession.on('terminated', (message, cause) => {
        console.log('结束');
        this.callState = 0;

        console.log(this.$parent.flag, this.$parent, 'this.$parent.flag1');
        this.$parent.flag = false;
        console.log(this.$parent.flag, 'this.$parent.flag2');
        // console.log('11111end结束');
      });
      //拨号中
      userAgentSession.on('progress', (response) => {
        console.log('拨号中...');
        this.callState = 1;
      });
    },
    //接听来电
    acceptphone(userAgentSession) {
      userAgentSession.accept({
        media: {
          render: {
            remote: this.$refs.remoteVideo,
            local: this.$refs.localVideo,
          },
          constraints: {
            audio: true,
            video: false,
          },
        },
      });
    },
  },
};
/* eslint-enable */
