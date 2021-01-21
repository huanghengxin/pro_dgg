import SIP from 'sip.js';
import callmixin from './callmixin.js';
import './index.scss';
import Badge from './Badge';
export default {
  name: 'Call',
  components: {
    Badge,
  },
  props: {
    sipConfig: {
      type: Object,
      default: () => {
        return {};
      },
    },
    bizItem: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  mixins: [callmixin],
  data() {
    return {
      userName: '', // 用户名称
      userTel: '', // 用户电话号码
      userNoTel: '', // 用户脱敏电话号码
      dialogCall: false, // 拨号弹框
      callStartTimeStramp: 0, //拨打开始时间戳
      callEndTimeStramp: 0, //拨打结束时间戳
      callDurationInterval: undefined, //呼叫时间计算器
      num: [
        // 拨号号码
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
        ['*', 0, '#'],
      ],
      phone_number: '', // 输入号码
      arr: [], // 输入号码转化数组
      dialogCallIn: false, // 通话中弹框
      dialogCallInTitle: '正在拨号...', // 通话中标题
      userAgent: null,
      userAgentSession: null,
      optCallInfo: [], // 已选择拨号号码信息
      callState: 0, // 打电话状态 0 空闲中 1 呼叫中 2 通话中
      callWay: 1, // 拨打方式 1 输入号码 2 添加号码
    };
  },
  computed: {
    callDuration() {
      let time = this.callEndTimeStramp - this.callStartTimeStramp;
      return this.callTimeStampDuration(time || 0);
    },
    optNumber() {
      const curItems = this.optCallInfo.filter((item) => item.name === this.userName);
      return curItems.length > 0 ? curItems[0].phoneList : [];
    },
  },
  directives: {
    // 拖拽指令
    drag: {
      bind: function(el, binding, vnode) {
        if (el.querySelector('.el-dialog__header') && el.querySelector('.el-dialog')) {
          const dialogHeaderEl = el.querySelector('.el-dialog__header');
          const dragDom = el.querySelector('.el-dialog');
          dialogHeaderEl.style.cssText += ';cursor:move;';
          dragDom.style.cssText += ';top:0;';

          const getStyle = (function() {
            if (window.document.currentStyle) {
              return (dom, attr) => dom.currentStyle[attr];
            } else {
              return (dom, attr) => getComputedStyle(dom, null)[attr];
            }
          })();

          dialogHeaderEl.onmousedown = (e) => {
            const disX = e.clientX - dialogHeaderEl.offsetLeft;
            const disY = e.clientY - dialogHeaderEl.offsetTop;

            const dragDomWidth = dragDom.offsetWidth;
            const dragDomHeight = dragDom.offsetHeight;

            const screenWidth = document.body.clientWidth;
            const screenHeight = document.body.clientHeight;

            const minDragDomLeft = dragDom.offsetLeft;
            const maxDragDomLeft = screenWidth - dragDom.offsetLeft - dragDomWidth;

            const minDragDomTop = dragDom.offsetTop;
            const maxDragDomTop = screenHeight - dragDom.offsetTop - dragDomHeight;

            let styL = getStyle(dragDom, 'left');
            let styT = getStyle(dragDom, 'top');

            if (styL.includes('%')) {
              styL = +document.body.clientWidth * (+styL / 100);
              styT = +document.body.clientHeight * (+styT / 100);
            } else {
              styL = +styL.replace(/\px/g, '');
              styT = +styT.replace(/\px/g, '');
            }

            document.onmousemove = function(e) {
              let left = e.clientX - disX;
              let top = e.clientY - disY;

              if (-left > minDragDomLeft) {
                left = -minDragDomLeft;
              } else if (left > maxDragDomLeft) {
                left = maxDragDomLeft;
              }

              if (-top > minDragDomTop) {
                top = -minDragDomTop;
              } else if (top > maxDragDomTop) {
                top = maxDragDomTop;
              }

              dragDom.style.cssText += `;left:${left + styL}px;top:${top + styT}px;`;

              vnode.child.$emit('drag-dialog');
            };

            document.onmouseup = function() {
              document.onmousemove = null;
              document.onmouseup = null;
            };
          };
        }
      },
    },
  },
  created() {
    window.addEventListener('beforeunload', this.beforeunloadFn);
  },
  mounted() {
    console.log('scopedSlots1111111111', this.sipConfig);
    // 初始化
    this.initCall();
    // 监听打开拨号器
    this.$eventBus.$on('open-dialer', () => {
      if (this.callState === 0) {
        this.openDialogCall();
      } else {
        this.$message.warning('通话中...！');
      }
    });
    // 监听添加号码
    this.$eventBus.$on('add-phone-number', (item, type) => {
      // console.log(item, 'call-组件');
      // if (this.callState === 0) {
      //   if (type == 'one') {
      //     this.userName = item.name;
      //     this.userTel = item.phoneList[0].tel;
      //     this.userNoTel = item.phoneList[0].notel;
      //   } else {
      //     console.log(this.optCallInfo, 'this.optCallInfo');
      //     this.userName = item[0].name;
      //     this.userTel = item[0].phoneList[0].tel;
      //     this.userNoTel = item[0].phoneList[0].notel;
      //   }
      //   this.optCallInfo = item;
      //   this.callWay = 2;
      //   console.log(this.callWay, 'this.callWay--------------------------');
      // } else {
      //   this.$message.warning('通话中...！');
      // }
    });
  },
  beforeDestroy() {
    if (this.userAgentSession) {
      console.log('销毁！');
      this.userAgentSession.terminate();
    }
  },
  destroyed() {
    window.removeEventListener('beforeunload', this.beforeunloadFn);
  },
  methods: {
    //注销坐席
    unregister() {
      this.userAgent.unregister();
      console.log('注销坐席');
    },
    // 初始化
    initCall() {
      this.userAgent = new SIP.UA({
        uri: this.sipConfig.uri, //坐席
        wsServers: this.sipConfig.wsServers, //服务器地址
        authorizationUser: this.sipConfig.authorizationUser, //坐席账号
        password: this.sipConfig.password, //密码
        displayName: this.sipConfig.displayName, //显示名称一般和账号同
        hackIpInContact: true,
        rtcpMuxPolicy: 'negotiate',
        hackWssInTransport: true, // 设置为true 则注册时 transport=wss; false:transport=ws;
        rel100: SIP.C.supported.SUPPORTED,
        log: {
          level: 0,
        },
        contactName: this.sipConfig.contactName,
        serverUrl: this.sipConfig.serverUrl,
      });

      //监听已连接
      this.userAgent.on('registered', () => {
        console.log('已连接');
        this.$emit('biz-item');
      });
      //监听来电
      this.userAgent.on('invite', (session) => {
        console.log('监听来电：' + session);
        this.userAgentSession = session;
        // let phone_number = session.transaction.request.data.match(/(From: )\"(.*)\"/)[2]; //电话号码提取
        this.acceptphone(session);
        this.listenUserAgentSessionEvent(session);
      });
      //监听拨号
      this.userAgent.on('progress', (response) => {
        console.log('监听拨号:' + response);
      });
      //监听拒接
      this.userAgent.on('rejected', function(response, cause) {
        console.log('监听拒接:' + response + '|cause:' + cause);
      });
      //监听错误
      this.userAgent.on('failed', function(response, cause) {
        console.log('错误:' + response + '|cause:' + cause);
      });
      //监听结束
      this.userAgent.on('ended', function(response, cause) {
        console.log('结束:' + response + '|cause:' + cause);
      });
    },
    // 监听页面刷新
    beforeunloadFn() {
      if (this.userAgentSession) {
        console.log('销毁！');
        this.userAgentSession.terminate();
      }
    },
    // 拨号码
    handleClick(e) {
      if (this.phone_number) {
        this.arr = String(this.phone_number).split('');
      }
      this.arr.push(e);
      const str = this.arr.join('');
      this.phone_number = str;
      this.$nextTick(() => {
        this.$refs.callPhoneInput.focus();
      });
    },
    //清空电话号码
    clearPhoneNumber() {
      this.phone_number = null;
      this.arr = [];
    },
    //设置电话号码
    setPhoneNumber(num) {
      if (num === undefined) {
        return;
      }
      this.phone_number = num;
      this.arr = String(num).split('');
    },
    // 打开拨号弹框
    openDialogCall() {
      // 打开拨号弹框
      this.clearPhoneNumber();
      this.dialogCall = true;
      this.callWay = 1;
    },
    // 拨打电话
    async handleCall() {
      await this.callPhone();
      // 关闭拨号弹框
      this.dialogCall = false;
      // 打开通话弹框
      // this.dialogCallIn = true;
      // this.setCallDurationInterval();
      if (this.callWay === 1) {
        const newCallInfo = [
          {
            name: '新客户',
            phoneList: [
              {
                tel: this.phone_number,
                notel: this.phone_number,
              },
            ],
          },
        ];
        this.optCallInfo = [...newCallInfo];
        this.userName = newCallInfo[0].name;
        this.userTel = newCallInfo[0].phoneList[0].tel;
        this.userNoTel = newCallInfo[0].phoneList[0].notel;
      }
    },
    // 挂断电话
    async hangupHandle() {
      await this.userAgentSession.terminate();
      this.dialogCallIn = false;
      clearInterval(this.callDurationInterval);
    },
    // 弹框-拨打电话接口
    callPhone() {
      const options = {
        media: {
          constraints: {
            audio: true,
            video: false,
          },
          render: {
            remote: this.$refs.remoteVideo,
            local: this.$refs.localVideo,
          },
        },
      };
      const get_number = `${this.phone_number}_12345678912342345123`;
      let session = this.userAgent.invite(`sip:${get_number}${this.sipConfig.serverUrl}`, options);
      console.log(session, this.sipConfig.serverUrl, 'session');
      this.userAgentSession = session;
      this.listenUserAgentSessionEvent(session);
      this.callState = 1;
    },
    // 已选择号码-拨打电话接口
    optNumberCallPhone() {
      const options = {
        media: {
          constraints: {
            audio: true,
            video: false,
          },
          render: {
            remote: this.$refs.remoteVideo,
            local: this.$refs.localVideo,
          },
        },
      };
      const get_number = `${this.userTel}_12345678912342345123`;
      let session = this.userAgent.invite(`sip:${get_number}${this.sipConfig.serverUrl}`, options);
      this.userAgentSession = session;
      this.listenUserAgentSessionEvent(session);
      this.callState = 1;
    },
    // 切换用户
    changeUser() {
      const curItems = this.optCallInfo.filter((item) => item.name === this.userName);
      this.userTel = curItems.length > 0 ? curItems[0].phoneList[0].tel : '';
      this.userNoTel = curItems.length > 0 ? curItems[0].phoneList[0].notel : '';
      this.$eventBus.$emit('opt-user', curItems);
    },
    // 切换电话号码
    changePhoneNumber() {
      const curItems = this.optCallInfo.filter((item) => item.name === this.userName);
      this.$eventBus.$emit('opt-phone-number', curItems);
    },
    // 切换用户下一个用户
    changeUserNext() {
      let curItems = [];
      for (let i = 0; i < this.optCallInfo.length; i++) {
        if (this.optCallInfo[i].name === this.userName && i < this.optCallInfo.length - 1) {
          curItems[0] = this.optCallInfo[i + 1];
        }
      }
      if (curItems.length > 0) {
        this.userTel = curItems[0].phoneList[0].tel;
        this.userNoTel = curItems[0].phoneList[0].notel;
        this.userName = curItems[0].name;
        this.$eventBus.$emit('opt-user-next', curItems);
      } else {
        this.$message.warning('已经是最后一条！');
      }
    },
    //呼叫时间计时器
    setCallDurationInterval() {
      let _self = this;
      _self.callStartTimeStramp = +new Date(); //设置开始时间戳
      _self.callEndTimeStramp = _self.callStartTimeStramp; //设置结束时间戳
      clearInterval(_self.callDurationInterval);
      _self.callDurationInterval = setInterval(() => {
        _self.callEndTimeStramp = +new Date();
      }, 1000);
    },
    // 毫秒转换返回时间 hh:mm:ss
    callTimeStampDuration(time) {
      time = Number(time);
      time = parseInt(time / 1000); //毫秒转换为秒
      let hour = parseInt(time / 3600);
      let minute = parseInt((time % 3600) / 60);
      let second = time % 60;
      let str = '';
      if (hour <= 9) {
        str += '0' + hour;
      } else {
        str += hour;
      }
      str += ':';
      str += this.strFillZeroPre(minute, 2) + ':';
      str += this.strFillZeroPre(second, 2);

      return str;
    },
    // 字符串长度填充
    strFillZeroPre(str, num, flg) {
      let t = new Array(num + 1).join(flg || 0);
      return (t + str).substr(-num);
    },
  },
};
