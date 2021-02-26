<template>
  <el-container>
    <el-container>
      <el-header v-if="!SP_MICRO_FE">
        <el-dropdown trigger="click" @command="handleCommand">
          <div>
            <span v-if="fullName" class="userImg">
              <img src="src/assets/image/avatar.jpeg" alt="" />
            </span>
            <span v-if="fullName">您好！{{ fullName }}</span
            ><i class="el-icon-s-operation"></i>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="a">登出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
      <div v-if="!SP_MICRO_FE && !isShowMenu" class="back-button" @click="handleClick">
        <el-button type="primary"><i class="el-icon-arrow-left"></i></el-button>
      </div>
      <el-main style="width: 1200px; margin: 0 auto">
        <div v-if="!SP_MICRO_FE && isShowMenu" class="el-main_menu">
          <el-menu default-active="1-1" active-text-color="#4974F5">
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
                <el-menu-item index="2-4">
                  <router-link to="/cooperation-alliance-clients" tag="div"
                    >合作联盟客户</router-link
                  >
                </el-menu-item>
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
                <el-submenu index="3-3">
                  <template slot="title">关黑限流</template>
                  <el-menu-item index="3-3-1">
                    <router-link to="/close-black-current-limit" tag="div"
                      >关黑限流进行中</router-link
                    >
                  </el-menu-item>
                  <el-menu-item index="3-3-2">
                    <router-link to="/close-black-handle-record" tag="div">操作记录</router-link>
                  </el-menu-item>
                </el-submenu>
                <el-menu-item index="3-4">
                  <router-link to="/cooperation-platform" tag="div"
                    >合作联盟规则（平台）</router-link
                  >
                </el-menu-item>
                <el-menu-item index="3-5">
                  <router-link to="/cooperation-merchant" tag="div"
                    >合作联盟规则（商户）</router-link
                  >
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
            <!-- <el-menu-item index="7">
              <router-link to="/push-sheet" tag="div">推单</router-link>
            </el-menu-item> -->
          </el-menu>
        </div>

        <div class="el-main_view">
          <keep-alive :include="$store.state['keep-alive'].cacheList">
            <router-view />
          </keep-alive>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'Layout',

  data() {
    return {
      SP_MICRO_FE: window.SP_MICRO_FE,
      isShowMenu: true,
    };
  },
  computed: {
    fullName() {
      return this.$store.state.user.fullName;
    },
  },
  mounted() {
    if (!this.SP_MICRO_FE) {
      this.$watch(
        '$route',
        (val) => {
          this.isShowMenu = ![
            '/my-business/business-details',
            '/team-manage/business-details',
            '/add-business',
            '/error-list',
          ].includes(val.path);
          if (val.path === '/login') {
            this.$store.commit('user/SET_FULLNAME', '');
          }
        },
        { immediate: true },
      );
    }
  },
  created() {
    if (!this.SP_MICRO_FE) {
      this.$store.commit('user/SET_FULLNAME');
    }
  },
  methods: {
    handleClick() {
      this.$router.go(-1);
    },
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
