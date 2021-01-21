<template>
  <div v-if="flag" class="callOutBox">
    <Call :sip-config="sipConfig" @biz-item="playCall"></Call>
    <div style="margin: 8px 0 0 2px">
      <!-- 
      <el-button @click="handCall">拨打电话</el-button>
      <el-button @click="handleAddPhoneNumber">批量添加号码</el-button>
      <el-button @click="playCall">添加号码</el-button>
      -->
      <el-button @click="handleAddPhoneNumber">批量添加号码</el-button>
    </div>
  </div>
</template>

<script>
import Call from 'components/call/index';
import store from 'storejs';
import { get_phone, playCall } from 'api/my-business';
import { find_contacts_by_customer_id, find_contacts_by_ids } from 'api/common';
export default {
  components: {
    Call,
  },
  data() {
    return {
      flag: false,
      flagShow: false,
      sipConfig: {
        uri: '', // 坐席
        wsServers: [], //服务器wss地址
        authorizationUser: '', // 坐席账号
        password: '', // 密码
        displayName: '', // 显示名称一般和账号同
        contactName: '', // 联系人姓名
        serverUrl: '@172.16.74.194', // 服务器API地址
      },
      bizItem: {},
      mutBizData: [], //多选数据
      selectedIds: '', //多选数据
    };
  },
  created() {
    this.getPhone();
  },
  mounted() {
    this.$eventBus.$on('opt-user', () => {
      console.log('选择用户');
    });
    this.$eventBus.$on('opt-phone-number', () => {
      console.log('选择号码');
    });
    this.$eventBus.$on('biz-item', (val) => {
      console.log(val, 'valvalvalvalvalvalval');
      this.bizItem = val;
      this.flag = true;
      this.flagShow = false;
      // this.playCall(this.bizItem);
      // this.handleAdd();
    });
    // this.$eventBus.$on('aside-call-up', (val, ids) => {
    //   console.log('..................................');
    //   console.log(val, ids, 'val'); //val 多选商机数据
    //   this.mutBizData = val; //多选数据
    //   this.selectedIds = ids; //多选ids
    //   this.flagShow = true;
    //   if (val && val.length > 0) {
    //     this.handleAddPhoneNumber();
    //   } else {
    //     this.handCall();
    //   }
    // });
  },
  methods: {
    /**
     * @description 获取分机信息
     */
    getPhone() {
      get_phone().then((res) => {
        if (res.code === 200) {
          console.log(res.data);
          this.sipConfig.uri = res.data.phone + '@' + res.data.decrHost;
          this.sipConfig.wsServers = ['wss://' + res.data.decrWss];
          this.sipConfig.authorizationUser = res.data.phone;
          this.sipConfig.password = res.data.decrPwd;
          this.sipConfig.displayName = res.data.phone;
          this.sipConfig.contactName = res.data.phone;
          console.log(this.sipConfig, 'this.sipConfig');
          this.flagShow = true;
        } else {
          this.$message.warning(res.message);
          this.flag = false;
          this.flagShow = false;
        }
      });
    },
    // 拨打电话 拨号盘
    handCall() {
      this.$nextTick(() => {
        this.flag = true;
        this.flagShow = false;
        this.$eventBus.$emit('open-dialer');
      });
    },
    //用打电话接口
    playCall() {
      let params = {
        type: 1,
        libType: 'PERSONAL',
        customerId: this.bizItem?.customerId || '',
        // phoneNumber: 2038,
        phoneNumber: this.bizItem?.customerContact || '',
      };
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
    /**
     * @description 批量添加号码
     */
    handleAddPhoneNumber() {
      let userid = store.get('mchInfo').mchUserId;
      const params = this.selectedIds;
      let phoneList = [];
      //批量id查询联系人
      find_contacts_by_ids(params).then((res = []) => {
        if (res.length === 0) return;
        for (const iterator of res) {
          if (iterator.contactWay !== 'CONTACT_WAY_MB') continue;
          let obj = {
            tel: '1240',
            notel: iterator.contactNo,
            telName: iterator.contactName,
          };
          phoneList.push(obj);
        }
        const phone_number_info = [
          {
            name: '新用户',
            customerid: '123', //客户Id
            busId: '456', //商机Id
            userid: userid,
            busCode: '', //一级业态code，可以传多个，逗号，隔开，没有就传空
            labels: '', //用户标签,多个，逗号，隔开，没有就传空
            merchantuserid: '', //商户用户id
            phoneList: phoneList,
          },
          {
            name: '新用户',
            customerid: '123', //客户Id
            busId: '456', //商机Id
            userid: userid,
            busCode: '', //一级业态code，可以传多个，逗号，隔开，没有就传空
            labels: '', //用户标签,多个，逗号，隔开，没有就传空
            merchantuserid: '', //商户用户id
            phoneList: phoneList,
          },
        ];
        console.log(phone_number_info, 'phone_number_info');
        this.$nextTick(() => {
          this.$eventBus.$emit('add-phone-number', phone_number_info);
        });
      });
    },
    // 添加号码
    handleAdd() {
      let userid = store.get('mchInfo').mchUserId;
      console.log(this.bizItem, 'bizItem-add-number');
      const params = { customerId: this.bizItem?.customerId || '' };
      let phoneList = [];
      find_contacts_by_customer_id(params).then((res = []) => {
        if (res.length === 0) return;
        for (const iterator of res) {
          if (iterator.contactWay !== 'CONTACT_WAY_MB') continue;
          let obj = {
            tel: '2003',
            notel: iterator.contactNo,
            telName: iterator.contactName,
          };
          phoneList.push(obj);
        }
        console.log(phoneList, 'phoneList-----');
        const phone_number_info = [
          {
            name: this.bizItem.customerName, //客户名称(可以传空)
            merchantuserid: '', //商户id
            customerid: this.bizItem.customerId, //客户Id
            userid: userid, //用户id
            busId: this.bizItem.id, //商机Id
            busCode: '', ///一级业态code，可以传多个，逗号，隔开，没有就传空
            labels: '', //用户标签,多个，逗号，隔开，没有就传空
            phoneList: phoneList,
          },
        ];
        console.log(phone_number_info, 'phone_number_info');

        this.$nextTick(() => {
          this.$eventBus.$emit('add-phone-number', phone_number_info);
        });
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.callOutBox {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
</style>
