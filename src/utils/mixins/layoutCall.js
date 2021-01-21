import { get_phone, playCall } from 'api/my-business';
// import { find_contacts_by_ids } from 'api/common';
// import store from 'storejs';
const layoutCall = {
  data() {
    return {
      flag: false,
      falgShow: false,
      sipConfig: {
        uri: '', // 坐席
        wsServers: [], //服务器wss地址
        authorizationUser: '', // 坐席账号
        password: '', // 密码
        displayName: '', // 显示名称一般和账号同
        contactName: '', // 联系人姓名
        serverUrl: '@172.16.74.194', // 服务器API地址
      },
    };
  },
  created() {
    if (!this.SP_MICRO_FE) {
      this.getPhone();
    }
  },
  mounted() {
    //接收到商机列表传递数据 -打电话 type：1商机 3线索 2 拨号盘
    this.$eventBus.$on('biz-item-layout', (val, isData) => {
      console.log(val, isData, 'val, isData');
      if (isData) {
        this.$eventBus.$emit('add-phone-number', val);
      } else {
        this.handCall();
      }
    });
  },
  methods: {
    // 拨打电话,拨号盘
    handCall() {
      this.flag = true;
      // this.flagShow = true;
      this.$eventBus.$emit('open-dialer');
    },
    /**
     * @description 获取分机信息
     */
    getPhone() {
      get_phone().then((res) => {
        if (res.code === 200) {
          this.sipConfig.uri = res.data.phone + '@' + res.data.decrHost;
          this.sipConfig.wsServers = ['wss://' + res.data.decrWss];
          this.sipConfig.authorizationUser = res.data.phone;
          this.sipConfig.password = res.data.decrPwd;
          this.sipConfig.displayName = res.data.phone;
          this.sipConfig.contactName = res.data.phone;

          this.flagShow = true;
        } else {
          this.$message.warning(res.message);
          // this.flag = false;
          this.flagShow = false;
        }
      });
    },
    //调用打电话接口
    playCall() {
      let params = {};
      // this.$eventBus.$on('type', (type) => {
      console.log(this.callType, 'this.callType');
      if (this.callType == 1) {
        params = {
          type: this.callType || 1,
          libType: 'PERSONAL',
          customerId: this.bizItem?.customerId || '',
          bizId: this.bizItem.id || '',
          customerName: this.bizItem?.customerName || '',
          // phoneNumber: 2038,
          phoneNumber: this.bizItem?.customerContact || '',
        };
      } else if (this.callType == 3) {
        params = {
          clueSourceType: this.bizItem?.clueSourceType || '',
          type: this.callType || 1,
          clueId: this.bizItem?.id || '',
          libType: 'PERSONAL',
          customerId: this.bizItem?.customerId || '',
          customerName: this.bizItem?.customerName || '',
          bizId: this.bizItem.id || '',
          // phoneNumber: 2038,
          phoneNumber: this.bizItem?.customerContact || '',
        };
      } else {
        console.log('拨号盘');
      }
      console.log(this.callType, params, 'this.callType,params');
      // });
      playCall(params).then((res) => {
        if (res.code === 200) {
          this.flagShow = true;
        } else {
          this.flagShow = false;
          this.flag = false;
          this.$message.warning(res.message);
        }
      });
    },
  },
};

export default layoutCall;
