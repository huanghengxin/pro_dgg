<template>
  <div class="cancel-limit-page">
    <el-dialog
      title="取消关黑限流"
      :visible.sync="dialogVisible"
      width="480px"
      :close-on-click-modal="false"
      @closed="dialogColsed"
    >
      <el-checkbox-group v-model="checkList" v-loading="loading">
        <el-checkbox
          v-for="(item, index) in limitWay"
          :key="index + 'limitWayMore'"
          :label="item.id"
        >
          <div class="cancel-limit-checkbox">
            {{ '取消' + item.limitTypeName }}
          </div>
        </el-checkbox>
      </el-checkbox-group>
      <span slot="footer" class="dialog-footer">
        <el-button
          plain
          :disabled="disButton"
          data-tid="cancelLimitPageCancelButton"
          @click="dialogVisible = false"
          >取消</el-button
        >
        <el-button
          type="primary"
          :disabled="disButton"
          data-tid="cancelLimitPageSureCancelLimit"
          @click="sureCancelLimit"
          >确定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import './index.scss';
import { limit_detail, cancel_limit } from 'api/close-black-limit';
export default {
  data() {
    return {
      dialogVisible: false,
      disButton: false,
      loading: false,
      limitWay: [],
      checkList: [],
      cancelDetailsList: [],
    };
  },
  methods: {
    openModal(cancelDetails) {
      this.cancelDetailsList = cancelDetails;
      this.loading = true;
      this.disButton = true;
      let params = { plannerId: cancelDetails.plannerId };
      limit_detail(params)
        .then((res) => {
          if (res.code !== 200) {
            this.$message.warning(res.message);
          } else {
            this.limitWay = res.data;
            if (Array.isArray(res.data) && res.data.length === 0) {
              this.$message.warning('此限制方式已经被取消了！');
              this.dialogVisible = false;
              this.$emit('update-list');
              return;
            }
          }
          this.loading = false;
          this.disButton = false;
          this.dialogVisible = true;
        })
        .catch(() => {
          this.loading = false;
          this.disButton = false;
        });
    },
    dialogColsed() {
      this.checkList = [];
      const len = this.cancelDetailsList.limitTypeName.split('、')?.length;
      if (this.limitWay.length !== len) {
        this.$emit('update-list');
      }
    },
    /**
     * @description 取消关黑限流
     */
    sureCancelLimit() {
      if (!(Array.isArray(this.limitWay) && this.limitWay.length !== 0)) return;
      if (this.limitWay.length !== 0) {
        this.disButton = true;
      }
      let params = this.checkList;
      cancel_limit(params)
        .then((res) => {
          if (res.code === 200) {
            this.$message.success(res.message);
            this.$emit('update-list', this.checkList, this.limitWay);
            this.dialogVisible = false;
          } else {
            this.$message.warning(res.message);
            this.checkList = [];
          }
          this.disButton = false;
        })
        .catch(() => {
          this.disButton = false;
        });
    },
  },
};
</script>
