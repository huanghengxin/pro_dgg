<template>
  <el-dialog
    title="查看号码"
    custom-class="show-phone"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="360px"
    @closed="diologHandleClose"
  >
    <div v-loading="loading">
      <div class="phone">{{ phone }}</div>
      <div class="conunt">{{ conunt }}s后自动关闭</div>
    </div>
  </el-dialog>
</template>

<script>
import './index.scss';
import { show_real_phone } from 'api/common';
export default {
  name: 'ShowPhone',
  data() {
    return {
      dialogVisible: false,
      phone: '',
      loading: false,
      conunt: 5,
      timer: '',
    };
  },
  methods: {
    /**
     * @description 关闭弹层恢复数据
     */
    diologHandleClose() {
      this.conunt = 5;
      this.phone = '';
      clearInterval(this.timer);
    },
    /**
     * @description 打开弹层
     * @param {String} 手机号码
     */
    openModal(phone) {
      this.dialogVisible = true;
      this.getPhone(phone);
    },
    /**
     * @description 获取真实手机号展示
     * @param {String} 手机号码
     */
    getPhone(phone) {
      const params = {
        encryptPhone: phone,
      };
      this.loading = true;
      show_real_phone(params)
        .then((res) => {
          if (res.code === 200) {
            res = res.data;
            this.phone = res;
            this.loading = false;
            this.timingClose();
          } else {
            this.$message.warning(res.message);
          }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    /**
     * @description 定时关闭方法
     */
    timingClose() {
      this.timer = setInterval(() => {
        if (this.conunt === 1) {
          clearInterval(this.timer);
          this.dialogVisible = false;
        }
        this.conunt--;
      }, 1000);
    },
  },
};
</script>

<style></style>
