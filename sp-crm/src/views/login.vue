<template>
  <div class="login">
    <div class="login-content">
      <div class="login-head">
        <img class="login-head-logo" src="~@/assets/image/logo_index.png" alt="" />
      </div>
      <div class="login-form">
        <el-tabs v-model="activeName">
          <el-tab-pane label="账号密码登录" name="passwd">
            <el-form
              ref="ruleForm"
              size="medium"
              label-suffix="："
              status-icon
              :model="ruleForm"
              class="demo-ruleForm"
            >
              <el-form-item prop="account">
                <el-input v-model="ruleForm.account" type="text" placeholder="请输入账号">
                  <i slot="prefix" class="input_icon el-input__icon el-icon-user"></i>
                </el-input>
              </el-form-item>
              <el-form-item prop="password">
                <el-input v-model="ruleForm.password" show-password placeholder="请输入密码">
                  <i slot="prefix" class="input_icon el-input__icon el-icon-lock"></i>
                </el-input>
              </el-form-item>
              <el-form-item prop="user">
                <el-select
                  v-model="user"
                  placeholder="请选择"
                  style="width: 360px"
                  @change="userChange"
                >
                  <el-option
                    v-for="item in options"
                    :key="item.name"
                    :label="item.name"
                    :value="item.ruleForm"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <div class="remember">
                <el-checkbox v-model="checked">自动登录</el-checkbox>
                <a>找回密码</a>
              </div>
              <el-button
                :loading="$store.state.user.loginLoading"
                type="primary"
                class="btn_login"
                data-tid="login"
                native-type="submit"
                @click="login"
              >
                登&nbsp;录
              </el-button>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="login-footer">Copyright © 2020-2021 成都薯片科技有限公司</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      checked: true,
      activeName: 'passwd',
      loading: false,
      user: '',
      options: [
        {
          name: '张',
          ruleForm: 'zhang',
        },
        {
          name: '黄',
          ruleForm: 'huang',
        },
      ],
      ruleForm: {
        account: '18512811263',
        password: '123456',
      },
    };
  },
  computed: {},
  methods: {
    userChange(user) {
      const users = {
        zhang: {
          account: '18512811263',
          password: '123456',
        },
        huang: {
          account: '17765488997',
          password: '123456',
        },
      };
      this.ruleForm = users[user];
      this.login();
    },
    login() {
      if (this.activeName === 'phone') {
        this.$message({
          message: '暂不支持手机登录',
          type: 'warning',
        });
        return;
      }
      const { account, password } = this.ruleForm;

      if (!account || !password) {
        this.$message({
          message: '请填写完整登录信息',
          type: 'warning',
        });
      } else {
        this.$store.dispatch('user/Login', {
          account,
          password,
          platformType: 'COMDIC_PLATFORM_QIDASHUN',
        });
      }
    },
  },
};
</script>

<style scoped lang="scss">
.login {
  // background: url('~@/assets/images/bg.jpg') no-repeat;
  background-color: #fff;
  background-size: 100%;
  text-align: center;
  &-content {
    min-height: 580px;
    height: 100vh;
    position: relative;
    .login-footer {
      color: $base-color;
      font-size: 12px;
      position: absolute;
      bottom: 20px;
      text-align: center;
      width: 100%;
    }
  }
  &-head {
    padding-top: 120px;
    text-align: center;
    &-title {
      font-size: 34px;
    }
    &-logo {
      width: 160px;
      height: 64px;
    }
  }
  &-form {
    margin-top: 40px;
    display: inline-block;
    width: 360px;
    .remember {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      margin-bottom: 20px;
    }
    &::v-deep {
      .el-tabs__nav-wrap::after {
        content: none;
      }
      .el-form-item {
        margin-bottom: 15px;
      }
    }
    .input_icon {
      color: #4974f5;
    }
    .btn_login {
      width: 100%;
    }
    .captcha {
      display: flex;
      flex-direction: row;
      align-items: center;
      &-input {
        flex: 1;
        margin-right: 10px;
      }
      &-btn {
        height: 32px;
        width: 100px;
        flex-shrink: 0;
      }
    }
  }
}
</style>
