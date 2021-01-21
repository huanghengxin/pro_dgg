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
              <el-form-item prop="platformType">
                <el-select
                  v-model="ruleForm.platformType"
                  style="width: 100%"
                  placeholder="请选择商户类型"
                >
                  <el-option label="企大宝" value="COMDIC_PLATFORM_QIDABAO"> </el-option>
                  <el-option label="企大顺" value="COMDIC_PLATFORM_QIDASHUN"> </el-option>
                  <el-option label="运营" value="COMDIC_PLATFORM_MANAGMENT"> </el-option>
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
                @click="login"
              >
                登&nbsp;录
              </el-button>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="手机号登录" name="phone">
            <el-form
              ref="ruleForm"
              size="medium"
              label-suffix="："
              status-icon
              :model="phoneForm"
              class="demo-ruleForm"
            >
              <el-form-item prop="phone">
                <el-input v-model="phoneForm.phone" type="text" placeholder="请输入手机号">
                  <i slot="prefix" class="input_icon el-input__icon el-icon-user"></i>
                </el-input>
              </el-form-item>
              <el-form-item prop="captcha">
                <div class="captcha">
                  <el-input
                    v-model="phoneForm.captcha"
                    class="captcha-input"
                    type="password"
                    placeholder="请输入验证码"
                  >
                    <i slot="prefix" class="input_icon el-input__icon el-icon-lock"></i>
                  </el-input>

                  <el-button class="captcha-btn">获取验证码</el-button>
                </div>
              </el-form-item>

              <div class="remember">
                <el-checkbox v-model="checked">自动登录</el-checkbox>
                <a>找回密码</a>
              </div>
              <el-button type="primary" class="btn_login" data-tid="login" @click="login">
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
      phoneForm: {
        phone: '18512811263',
        captcha: '',
      },

      ruleForm: {
        account: '17765488997',
        password: '488997',
        platformType: 'COMDIC_PLATFORM_QIDASHUN',
      },
    };
  },
  computed: {},
  methods: {
    login() {
      if (this.activeName === 'phone') {
        this.$message({
          message: '暂不支持手机登录',
          type: 'warning',
        });
        return;
      }
      const { account, password, platformType } = this.ruleForm;

      if (!account || !password) {
        this.$message({
          message: '请填写完整登录信息',
          type: 'warning',
        });
      } else {
        this.$store.dispatch('user/Login', {
          account,
          password,
          platformType,
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
