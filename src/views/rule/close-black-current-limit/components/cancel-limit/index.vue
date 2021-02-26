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
        <div
          v-for="(item, index) in limitWay"
          :key="index + 'limitWayMore'"
          class="cancel-limit-checkbox"
        >
          <el-checkbox
            :label="'取消' + item.limitTypeName"
            @change="changeCheckBox(item.id)"
          ></el-checkbox>
        </div>
      </el-checkbox-group>
      <span slot="footer" class="dialog-footer">
        <el-button plain @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="sureCancelLimit">确定</el-button>
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
      loading: false,
      limitWay: [],
      checkList: [],
      limitIds: [],
    };
  },
  methods: {
    openModal(cancelDetails) {
      this.dialogVisible = true;
      this.loading = true;
      let params = { plannerId: cancelDetails.plannerId };
      limit_detail(params).then((res) => {
        this.limitWay = res.data;
        this.loading = false;
      });
    },
    dialogColsed() {
      this.checkList = [];
    },
    /**
     * @description 取消关黑限流
     */
    sureCancelLimit() {
      if (!(Array.isArray(this.limitWay) && this.limitWay.length !== 0)) return;
      let params = this.limitWay.length > 1 ? this.limitIds : this.limitWay[0].id.split();
      cancel_limit(params)
        .then((res) => {
          if (res.code === 200) {
            this.$message.success(res.message);
            this.dialogVisible = false;
            this.$emit('cancel-limit');
          } else {
            this.$message.warning(res.message);
          }
        })
        .catch(() => {});
    },
    /**
     * @description
     */
    changeCheckBox(limitIds) {
      this.limitIds.push(limitIds);
    },
  },
};
</script>
