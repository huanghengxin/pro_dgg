const commonMixins = {
  data() {
    return {};
  },
  mounted() {},
  computed: {
    map() {
      const map = {
        //合作状态列是否显
        cooperationStatus:
          (this.statusType == 'receiveStatus' && this.statusValue == 1) ||
          (this.statusType == 'buildStatus' && this.statusValue == 1),
        //分配方式列是否显示
        allocationModeStatus:
          (this.statusType == 'buildStatus' && this.statusValue == undefined) ||
          (this.statusType == 'buildStatus' && this.statusValue == 9),
        //合作分得比例是否显示
        ratioStatus:
          (this.statusType == 'receiveStatus' && this.statusValue == undefined) ||
          (this.statusType == 'receiveStatus' && this.statusValue == 1) ||
          (this.statusType == 'buildStatus' && this.statusValue == 1),
        //预计退回时间是否显示
        expectReturnTimeStatus:
          (this.statusType == 'receiveStatus' && this.statusValue == undefined) ||
          (this.statusType == 'buildStatus' && this.statusValue == undefined),
        //发起人/时间是否显示
        createTimePersonTimeStatus:
          (this.statusType == 'receiveStatus' && this.statusValue == undefined) ||
          (this.statusType == 'receiveStatus' && this.statusValue == 1),
        //发起时间是否显示
        createTimeTimeStatus:
          (this.statusType != 'receiveStatus' && this.statusValue == undefined) ||
          (this.statusType != 'receiveStatus' && this.statusValue == 1) ||
          (this.statusType != 'receiveStatus' && this.statusValue == 9),
        //接收人是否显示
        receiveUserNameStatus:
          (this.statusType == 'buildStatus' && this.statusValue == undefined) ||
          (this.statusType == 'buildStatus' && this.statusValue == 9),
        //接收人时间是否显示
        receiveUserNameTimeStatus: this.statusType == 'buildStatus' && this.statusValue == 1,
        //原因是否显示
        reasonStatus:
          (this.statusType == 'receiveStatus' && this.statusValue == undefined) ||
          (this.statusType == 'receiveStatus' && this.statusValue == 1),
        //接收 拒绝按钮是否显示
        receiveBtnStatus: this.statusType == 'receiveStatus' && this.statusValue == undefined,
        //查看商机 在线聊按钮是否显示
        checkBusBtnStatus:
          (this.statusType == 'receiveStatus' && this.statusValue == 1) ||
          (this.statusType == 'buildStatus' && this.statusValue == 1),
        //提醒按钮是否显示
        remindSomeBtnStatus: this.statusType == 'buildStatus' && this.statusValue == undefined,
        //重新发起按钮是否显示
        againInitiateStatus: this.statusType == 'buildStatus' && this.statusValue == 9,
      };
      return map;
    },
  },
};

export default commonMixins;
