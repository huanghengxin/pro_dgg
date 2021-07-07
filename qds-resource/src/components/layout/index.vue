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
      <div v-if="!SP_MICRO_FE && !isShowMenu && fallback" class="back-button" @click="handleClick">
        <el-button type="primary"><i class="el-icon-arrow-left"></i></el-button>
      </div>
      <el-main style="width: 1200px; margin: 0 auto">
        <div v-if="!SP_MICRO_FE && isShowMenu" class="el-main_menu">
          <el-menu ref="elMenuRef" :default-active="defaultActive" active-text-color="#4974F5">
            <el-submenu index="1">
              <template slot="title">客源仓管理</template>
              <el-menu-item-group>
                <el-menu-item index="1-1" route="/add-source">
                  <router-link to="/add-source" tag="div">录入客源</router-link>
                </el-menu-item>
                <el-menu-item index="1-2" route="/add-record">
                  <router-link to="/add-record" tag="div">录入记录</router-link>
                </el-menu-item>
                <el-menu-item index="1-3" route="/await-confirm">
                  <router-link to="/await-confirm" tag="div">待确认</router-link>
                </el-menu-item>
                <el-menu-item index="1-4" route="/await-allocation">
                  <router-link to="/await-allocation" tag="div">待分配</router-link>
                </el-menu-item>
                <el-menu-item index="1-5" route="/allocation-record">
                  <router-link to="/allocation-record" tag="div">分配记录</router-link>
                </el-menu-item>
                <el-menu-item index="1-6" route="/test-source">
                  <router-link to="/test-source" tag="div">测试客源</router-link>
                </el-menu-item>
                <el-menu-item index="1-7" route="/set-allocation-way">
                  <router-link to="/set-allocation-way" tag="div">设置</router-link>
                </el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-submenu index="2">
              <template slot="title">客源规则管理</template>
              <el-menu-item-group>
                <el-menu-item index="2-1" route="/platform">
                  <router-link to="/platform" tag="div">客户流转规则-平台</router-link>
                </el-menu-item>
                <el-menu-item index="2-2" route="/merchant">
                  <router-link to="/merchant" tag="div">客户流转规则-商户</router-link>
                </el-menu-item>
              </el-menu-item-group>
            </el-submenu>
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
      fallback: true,
      defaultActive: '',
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
          this.$nextTick(() => {
            const items = this.$refs.elMenuRef?.items;
            if (items) {
              for (const key in items) {
                const value = items[key];
                if (val.path === value.route) {
                  this.defaultActive = value.index;
                }
              }
            }
          });
          this.isShowMenu = !['/source-details', '/login'].includes(val.path);
          if (val.path === '/login') {
            this.fallback = false;
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
