<template>
  <el-container>
    <el-container>
      <el-header v-if="!SP_MICRO_FE">
        <span v-if="fullName" class="userImg">
          <img src="src/assets/image/avatar.jpeg" alt="" />
        </span>
        <!-- 引入图片的两种方式 -->
        <!-- <img :src="logo" />
        <img src="../../assets/images/logo.png" /> -->
        <span v-if="fullName">您好！{{ fullName }}</span>
        <el-dropdown trigger="click" @command="handleCommand">
          <i class="el-icon-s-operation"></i>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="a">登出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>

      <!-- <div v-if="!SP_MICRO_FE" class="callBox"> -->
      <!-- <div v-if="flag" class="callOutBox"> -->
      <!-- <Call :sip-config="sipConfig" @biz-item="playCall"></Call> -->
      <!-- <Call :sip-config="sipConfig" @biz-item="playCall"></Call>
          <div style="margin: 8px 0 0 2px"> -->
      <!-- 
              <el-button @click="handCall">拨打电话</el-button>
              <el-button @click="handleAddPhoneNumber">批量添加号码</el-button>
              <el-button @click="playCall">添加号码</el-button>
              <el-button @click="handleAddPhoneNumber">批量添加号码</el-button>
              -->
      <!-- </div> -->
      <!-- </div> -->
      <!-- </div> -->
      <!-- <div v-if="!SP_MICRO_FE" class="asideBox"> -->
      <!-- <div class="asideBox-callUp asideBox-commonSty" @click="callUp">
          <span class="el-icon-phone"></span>
          <span>打电话</span>
        </div>
        <div class="asideBox-imCheat asideBox-commonSty" @click="imCheat">
          <span class="el-icon-chat-dot-square"></span>
          <span>IM聊天</span>
        </div> -->
      <!-- <chat-warp
          ref="im-warp"
          :visible="cheatFlag"
          :user-type="iMConfig.userType"
          :user-id="iMConfig.userId"
          :token="iMConfig.token"
          :secret="iMConfig.secret"
          :app-key="iMConfig.appKey"
          :sys-code="iMConfig.sysCode"
          :chat-warp-height="600"
          :on-close="
            () => {
              cheatFlag = false;
            }
          "
        /> -->
      <!-- </div> -->
      <div v-if="!SP_MICRO_FE && !isShowMenu" class="back-button" @click="handleClick">
        <el-button type="primary"><i class="el-icon-arrow-left"></i></el-button>
      </div>
      <el-main style="width: 1200px; margin: 0 auto">
        <div v-if="!SP_MICRO_FE && isShowMenu" class="el-main_menu">
          <el-menu default-active="1-1">
            <el-submenu index="1">
              <template slot="title">商机</template>
              <el-menu-item-group>
                <el-menu-item index="1-1">
                  <router-link to="/my-business" tag="div">我的商机</router-link>
                </el-menu-item>
                <el-menu-item index="1-2">
                  <router-link to="/dynamic-business" tag="div">商机动态</router-link>
                </el-menu-item>
              </el-menu-item-group>
            </el-submenu>

            <el-submenu index="2">
              <template slot="title">线索</template>
              <el-menu-item-group>
                <el-menu-item index="2-1">
                  <router-link to="/prospective-customer" tag="div">我的潜在客户</router-link>
                </el-menu-item>
                <el-menu-item index="2-2">
                  <router-link to="/public-library" tag="div">公共库</router-link>
                </el-menu-item>
                <el-menu-item index="2-3">
                  <router-link to="/clue-seas-library" tag="div">线索公海库</router-link>
                </el-menu-item>
                <!-- <el-menu-item index="2-4">
                  <router-link to="/referral-customer" tag="div">转介绍客户</router-link>
                </el-menu-item> -->
              </el-menu-item-group>
            </el-submenu>
            <el-submenu index="3">
              <template slot="title">规则设置</template>
              <el-menu-item-group>
                <el-menu-item index="3-1">
                  <router-link to="/platform" tag="div">规则设置（平台）</router-link>
                </el-menu-item>
                <el-menu-item index="3-2">
                  <router-link to="/merchant" tag="div">规则设置（商户）</router-link>
                </el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-submenu index="4">
              <template slot="title">经营管理</template>
              <el-menu-item-group>
                <el-menu-item index="4-1">
                  <router-link to="/team-manage" tag="div">经营管理</router-link>
                </el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-submenu index="6">
              <template slot="title">订单</template>
              <el-menu-item-group>
                <el-menu-item index="6-1">
                  <router-link to="/order-list" tag="div">订单列表</router-link>
                </el-menu-item>
                <el-menu-item index="6-2">
                  <router-link to="/order-details" tag="div">订单详情</router-link>
                </el-menu-item>
                <el-menu-item index="6-3">
                  <router-link to="/production-information" tag="div">生产信息</router-link>
                </el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-menu-item index="7">
              <router-link to="/push-sheet" tag="div">推单</router-link>
            </el-menu-item>
          </el-menu>
        </div>
        <div class="el-main_view">
          <router-view />
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
// import store from 'storejs';
// import CONFIG from '@/config';
// import layoutCall from 'utils/mixins/layoutCall';
// import Call from 'components/call/index';
export default {
  components: {
    // Call,
  },
  // mixins: [layoutCall],
  data() {
    return {
      SP_MICRO_FE: window.SP_MICRO_FE,
      isShowMenu: true,
      // multipleSelection: [],
      // selectedIds: [],
      // bizItem: {}, //商机列表传来的数据
      //im数据
      // cheatFlag: false,
      // iMConfig: {},
    };
  },
  computed: {
    fullName() {
      return this.$store.state.user.fullName;
    },
  },
  watch: {
    $route: {
      handler(val) {
        this.isShowMenu = !['/business-details', '/add-business'].includes(val.path);
        if (val.path === '/login') {
          this.$store.commit('user/SET_FULLNAME', '');
        }
      },
      immediate: true,
    },
    // flag: {
    //   handler(newVal, oldVal) {
    //     console.log('new:' + newVal, 'old:' + oldVal);
    //   },
    //   deep: true,
    //   immediate: true,
    // },
  },
  created() {
    if (!this.SP_MICRO_FE) {
      // this.iMConfig = Object.freeze({
      //   userId: store.get('mchInfo').mchUserId,
      //   userType: store.get('userType'),
      //   token: store.get('token'),
      //   secret: CONFIG.SECRET,
      //   appKey: CONFIG.APPKEY,
      //   sysCode: CONFIG.SYS_CODE,
      // });
      this.$store.commit('user/SET_FULLNAME');
    }
  },
  mounted() {
    if (!this.SP_MICRO_FE) {
      // //接收到从商机列表传来的数据 是否多选数据
      // const _this = this;
      // _this.$eventBus.$on('transfer-data', (val, ids) => {
      //   console.log(val.length, ids, 'val1 '); //val 多选商机数据
      //   _this.multipleSelection = val; //多选数据
      //   _this.selectedIds = ids; //多选ids
      //   // _this.flagShow = true;
      //   if (val && val.length > 0) {
      //     _this.handleAddPhoneNumber();
      //   } else {
      //     _this.handCall();
      //   }
      // });
      // //监听businessList多选数据
      // _this.$eventBus.$on('aside-call-up', (val, ids) => {
      //   console.log(val, '监听多选数据改变');
      //   _this.multipleSelection = val; //多选数据
      //   _this.selectedIds = ids; //多选ids
      //   //   that.flagShow = true;
      // });
    }
  },
  methods: {
    handleClick() {
      this.$router.go(-1);
    },
    // //右侧-打电话
    // callUp() {
    //   this.$eventBus.$emit('aside-more-call-mixins', 1);
    // },
    // //右侧IM
    // imCheat() {
    //   this.cheatFlag = !this.cheatFlag;
    // },
    /**
     * @description 退出登录
     */
    handleCommand() {
      this.$store.dispatch('user/Logout');
      this.$store.commit('user/SET_FULLNAME', '');
    },
  },
};
</script>

<style lang="less">
.el-header {
  border-bottom: 1px solid #e6e6e6;
  line-height: 60px;
  text-align: right;

  &:hover {
    cursor: pointer;
  }

  svg {
    width: 24px;
    height: 24px;
  }

  img,
  svg {
    vertical-align: middle;
  }
}
.callBox {
  padding: 0 16px 10px;
  div {
    // display: flex;
    // align-items: center;
    // justify-content: flex-end;
    .el-button {
      height: 32px !important;
      line-height: 10px;
    }
  }
}
.asideBox {
  height: 120px;
  position: fixed;
  padding: 5px;
  z-index: 99;
  color: #fff;
  top: 45%;
  right: 0;
  &-commonSty {
    width: 50px;
    height: 50px;
    padding: 0 5px;
    line-height: 20px;
    font-size: 12px;
    background-color: rgba(57, 62, 68, 0.8);
    text-align: center;
    padding: 9px 2px;
    display: flex;
    flex-direction: column;
    cursor: pointer;
    user-select: none;
    z-index: 999;
  }
  &-callUp {
    margin-bottom: 5px;
  }
  &-callUp:hover {
    background-color: #ffa947;
  }
  &-imCheat {
    cursor: pointer;
  }
  &-imCheat:hover {
    background-color: #ffa947;
  }
}
.back-button {
  width: 40px;
  height: 40px;
  position: fixed;
  top: 70px;
  left: calc(calc(100% - 1300px) / 2);
}
.el-header {
  background-color: #fff;
  .userImg {
    display: inline-block;
    & > img {
      width: 32px;
      height: 32px;
    }
  }
}
.el-container {
  background-color: #eee;
}
.el-submenu .el-menu-item {
  min-width: 180px;
  width: 180px !important;
}
.el-main {
  width: 99%;
  padding: 0 !important;
  background-color: #eee;
  display: flex;
  overflow: auto;

  &_menu {
    min-width: 180px;
    margin-right: 16px;
  }
  &_view {
    width: 100%;
    overflow: auto;
  }
}
</style>
