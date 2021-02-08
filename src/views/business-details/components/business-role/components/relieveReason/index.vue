<template>
  <el-dialog
    title="解除原因"
    custom-class="handle-log"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="360px"
    @close="diologHandleClose"
  >
    <!-- 解除原因文本框 -->
    <div class="relieveReason">
      <i class="iconfont-qds-crm icon-carefulfilled"></i>
      <p>{{ relieveReason }}</p>
    </div>
    <!-- 弹层按钮 -->
    <span slot="footer" class="footer">
      <el-button size="small" data-tid="recordsCancelButton" @click="refusalRelease"
        >拒绝解除</el-button
      >
      <el-button
        :loading="loading"
        type="primary"
        size="small"
        data-tid="recordsCancelButton"
        @click="commitReason"
        >同意解除</el-button
      >
      <el-button type="primary" size="small" data-tid="okButton" @click="dialogVisible = false"
        >好的</el-button
      >
    </span>
    <RefusalReleaseReason
      ref="refusalReleaseReasonRef"
      class="refusalRelease"
      @refusal-release="refusalReleaseDialogClose"
    />
  </el-dialog>
</template>

<script>
import RefusalReleaseReason from '../refusalReleaseReason/index.vue';
import { get_refuse_coooeration_reason } from 'api/cooperation-in-page';
import './index.scss';
export default {
  name: 'RelieveCooperation',
  components: { RefusalReleaseReason },
  data() {
    return {
      businessId: '', //商机id
      coopState: '', //合作状态
      relieveReason: '', //解除原因
      dialogVisible: false, //控制弹框显示隐藏
      loading: false,
    };
  },

  methods: {
    /**
     * @description 供父组件调用打开弹层
     */
    openModal(id, coopState) {
      console.log(id, coopState, 'id');
      this.businessId = id;
      this.coopState = coopState;
      this.dialogVisible = true;
      this.get_refuse_coooeration_reason();
    },
    /**
     * @description 获取拒绝原因
     * @param {}
     * @returns {}
     */
    get_refuse_coooeration_reason() {
      const params = { id: this.id };
      get_refuse_coooeration_reason(params)
        .then((res) => {
          console.log(res.data, 'res');
          const { data } = res;
          this.relieveReason = data.relieveReason;
        })
        .catch(() => {});
    },
    /**
     * @description 弹窗关闭
     */
    diologHandleClose() {
      this.dialogVisible = false;
      this.loading = false;
      this.relieveReason = '';
    },
    /**
     * @description 拒绝解除
     */
    refusalRelease() {
      this.$refs.refusalReleaseReasonRef.openModal(this.businessId);
    },
    /**
     * @description 同意解除
     * @param {}
     * @returns {}
     */
    commitReason() {
      console.log('commitReason', this.relieveReason);
      this.loading = true;
      setTimeout(() => {
        this.loading = true;
        this.dialogVisible = false;
        this.$emit('reload-list');
      }, 2000);
    },
    /**
     * @description 供填写拒绝原因子弹框关闭当前窗口
     * @param {}
     * @returns {}
     */
    refusalReleaseDialogClose() {
      this.dialogVisible = false;
      //触发父组件关闭自身弹窗
      this.$emit('reload-list');
    },
  },
};
</script>

<style></style>
