import store from 'storejs';
import { find_contacts_by_customer_id, find_contacts_by_ids, verify_call } from 'api/common';
let mchUserId = store.get('mchInfo').mchUserId;
let userid = store.get('userId');
const callMixins = {
  data() {
    return {
      callLoading: false,
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
    async callMixinsDealType(sourceType, data, type, contactNoFull) {
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
            customerName: multipleSelection.customerName,
            merUerId: store.get('mchInfo').mchUserId,
            customerId: multipleSelection.customerId, //客户Id
            phoneNumber: multipleSelection.customerPhoneCipher || multipleSelection.customerContact,
          },
          customerid: multipleSelection.customerId,
          customerPhone: multipleSelection.customerPhoneCipher || multipleSelection.customerPhone,
          userid: userid,
          busCode: '', //一级业态code，可以传多个，逗号，隔开，没有就传空
          labels: '', //用户标签,多个，逗号，隔开，没有就传空
          merchantuserid: mchUserId, //商户用户id
          phoneList: phoneList,
        };
        if (sourceType === 'bus' || sourceType === 'team-manage') {
          params.bus_info.bizId = multipleSelection.id; //商机Id
          params.bus_info.libType = multipleSelection.bizLabrary
            ? multipleSelection.bizLabrary
            : 'PERSONAL';
          params.bus_info.type = sourceType === 'bus' ? 1 : 5;
        } else {
          params.bus_info.clueId = multipleSelection.id; //商机Id
          params.bus_info.libType = 'CLUE_D'; //线索Id
          params.bus_info.type = 3;
          params.bus_info.clueSourceType = multipleSelection.clueSourceType || '';
        }
        callData.push(params);
      }
      console.log('callPhoneData', callData);
      await this.$mainService?.CALL?.addPhoneNumber(2, callData); //调用主应用方法添加号码
      await this.$mainService?.CALL?.changeCurSelectPhoneNumber(contactNoFull); //调用主应用方法改变当前号码
    },
    /**
     * @description 校验商机是否可以打电话
     * @param {String} 当前列表是否是商机还是线索
     */
    validateCall(sourceType) {
      const multipleSelection = this.multipleSelection[0];
      const validateCall = {
        merUerId: store.get('mchInfo').mchUserId,
        customerId: multipleSelection.customerId, //客户Id
        phoneNumber: multipleSelection.customerPhoneCipher || multipleSelection.customerContact,
      };
      if (sourceType === 'bus' || sourceType === 'team-manage') {
        validateCall.bizId = multipleSelection.id; //商机Id
        validateCall.libType = multipleSelection.bizLabrary
          ? multipleSelection.bizLabrary
          : 'PERSONAL';
        validateCall.type = sourceType === 'bus' ? 1 : 5;
      } else {
        validateCall.clueId = multipleSelection.id; //商机Id
        validateCall.libType = 'CLUE_D'; //线索Id
        validateCall.type = 3;
        validateCall.clueSourceType = multipleSelection.clueSourceType || '';
      }
      return verify_call(validateCall);
    },
    /**
     * @description 获取联系人列表
     */
    async callMixins(sourceType, item, type, contactNoFull) {
      try {
        let params, pathApi;
        params = {};
        this.callLoading = true;
        if (type === 'one') {
          this.multipleSelection = [item];
          //单个打电话需要判断当前是否可以打电话
          const { code, message } = await this.validateCall(sourceType);
          if (code !== 200) {
            this.$message.warning(message);
            typeof this.flowRefresh === 'function' && this.flowRefresh(); //调用页面刷新方法
            this.callLoading = false;
            return;
          }
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
            sourceType,
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
        this.callLoading = false;
      } catch (error) {
        this.callLoading = false;
      }
    },
  },
};

export default callMixins;
