import store from 'storejs';
import { find_contacts_by_customer_id, find_contacts_by_ids, verify_call } from 'api/common';
let mchUserId = store.get('mchInfo').mchUserId;
let userid = store.get('userId');
const callMixins = {
  data() {
    return {
      multipleSelection: [], //多选数据
      selectedIds: [], //多选id
    };
  },
  mounted() {},
  methods: {
    callUp(sourceType) {
      this.selectedIds = [];
      this.multipleSelection = [];
      this.handleSelection(this.$refs.tableRef.selection || []);
      if (this.selectedIds.length > 0) {
        this.callMixins(sourceType);
      } else {
        this.$message.warning('请先选择商机');
      }
    },
    /**
     * @description 获取多选框数据
     * @param {Array} 多选数据集合
     */
    handleSelection(val) {
      for (const item of val) {
        const id = item.customerId || '';
        this.selectedIds.push(id);
        this.multipleSelection.push(item);
      }
    },
    /**
     * @description 处理数据类型
     */
    async callMixinsDealType(data, type, contactNoFull) {
      let phoneList = [],
        callData = [];
      const dataLen = type === 'one' ? data.length : Object.keys(data).length;
      for (let i = 0; i < dataLen; i++) {
        const multipleSelection = this.multipleSelection[i];
        let item;
        if (type === 'one') {
          item = data[0];
        } else {
          item = data[multipleSelection.customerId] || [];
        }
        phoneList = [];
        for (let j = 0, itemLen = item.length; j < itemLen; j++) {
          let obj = {};
          if (type == 'one') {
            obj.tel = item[j].contactNoFull; //加密号码
            obj.notel = item[j].contactNo; //脱敏号码
          } else {
            obj.tel = item[j].enPhoneNumber; //加密号码
            obj.notel = item[j].phone; //脱敏号码
          }
          phoneList.push(obj);
        }
        const params = {
          name: multipleSelection.customerName,
          bus_info: {
            sysCode: 'service-centre',
            id: multipleSelection.id,
            customerid: multipleSelection.customerId,
            customerName: multipleSelection.customerName,
            data: {
              oppObj1: multipleSelection.id,
            },
          },
          phoneList: phoneList,
        };
        callData.push(params);
      }
      console.log('callPhoneData', callData);
      await this.$mainService?.CALL?.addPhoneNumber(2, callData); //调用主应用方法添加号码
      await this.$mainService?.CALL?.changeCurSelectPhoneNumber(contactNoFull); //调用主应用方法改变当前号码
    },

    /**
     * @description 获取联系人列表
     */
    async callMixins(item, type, contactNoFull) {
      try {
        let params, pathApi;
        params = {};
        if (type === 'one') {
          this.multipleSelection = [item];
          pathApi = find_contacts_by_customer_id;
          params.customerId = item?.customerId || '';
        } else {
          params = this.selectedIds;
          pathApi = find_contacts_by_ids;
        }
        const res = await pathApi(params);
        const { code, data = [], message } = res;
        if (code === 200) {
          this.callMixinsDealType(
            type === 'one'
              ? [data]
              : data.reduce((acc, cur) => {
                  acc[cur.customerId] = cur.customerPhoneInfoList;
                  return acc;
                }, {}),
            type,
            contactNoFull,
          );
        } else {
          this.$message.warning(message);
        }
      } catch (error) {
        console.error(error);
      }
    },
  },
};

export default callMixins;

// const { code, message } = {
//   code: 20004,
//   message:
//     '您好，客户已标记为“重度骚扰”，为维护您的权益和平台运营安全，本次拨打已被拦截，请谅解。',
//   data: '',
// };
// let messageBox,
//   messageInfo = {
//     title: '防骚扰提示',
//     $type: 'confirm',
//     type: 'warning',
//     dangerouslyUseHTMLString: true,
//     distinguishCancelAndClose: true,
//     closeOnClickModal: false,
//     closeOnPressEscape: false,
//     customClass: 'team-manage-error',
//   };
// if (code === 200) {
//   pathApi = find_contacts_by_customer_id;
//   params.customerId = item?.customerId || '';
// } else if (code === 20001) {
//   //中度骚扰
//   messageInfo.message = (message + '').replace(
//     '中度骚扰',
//     '<span style="color:#E6A23C">中度骚扰</span>',
//   );
//   messageInfo.showCancelButton = true;
//   messageInfo.confirmButtonText = '取消拨打';
//   messageInfo.cancelButtonText = '继续拨打';
//   console.log('messageInfomessageInfomessageInfo ', messageInfo);
//   try {
//     messageBox = await this.$messageBox(messageInfo);
//     if (messageBox === 'confirm') return;
//   } catch (error) {
//     if (error === 'close') return;
//   }
// } else if (code === 20002) {
//   //重度骚扰 无熟人标签
//   messageInfo.message = (message + '').replace(
//     '重度骚扰',
//     '<span style="color:#F56C6C">重度骚扰</span>',
//   );
//   messageInfo.confirmButtonText = '好的';
//   messageBox = await this.$messageBox(messageInfo);
//   return;
// } else if (code === 20003) {
//   //重度骚扰 有熟人标签
//   messageInfo.message = (message + '').replace(
//     '重度骚扰',
//     '<span style="color:#F56C6C">重度骚扰</span>',
//   );
//   messageInfo.showCancelButton = true;
//   messageInfo.confirmButtonText = '取消拨打';
//   messageInfo.cancelButtonText = '继续拨打';
//   try {
//     messageBox = await this.$messageBox(messageInfo);
//     if (messageBox === 'confirm') return;
//   } catch (error) {
//     if (error === 'close') return;
//   }
// } else if (code === 20004) {
//   //拨打次数打上限
//   messageInfo.message = message;
//   messageInfo.confirmButtonText = '好的';
//   messageBox = await this.$messageBox(messageInfo);
//   return;
// } else {
//   this.$message.warning(message);
//   typeof this.flowRefresh === 'function' && this.flowRefresh(); //调用页面刷新方法
//   return;
// }
