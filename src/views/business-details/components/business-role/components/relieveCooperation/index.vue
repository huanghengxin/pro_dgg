<template>
  <el-dialog
    title="解除合作联盟"
    custom-class="handle-log"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="480px"
    @close="diologHandleClose"
  >
    <!-- 解除原因文本框 -->
    <div class="relieveReason">
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="解除原因：" prop="relieveReason">
          <el-input
            v-model="ruleForm.relieveReason"
            v-emoji="'textarea'"
            type="textarea"
            placeholder="为保证双方利益，请务必与合作方进行协商确认后再发起哦～"
            maxlength="200"
            show-word-limit
            resize="none"
          />
          <!-- {{ businessId }} -->
        </el-form-item>
      </el-form>
    </div>
    <!-- 弹层按钮 -->
    <span slot="footer" class="footer">
      <el-button size="small" data-tid="recordsCancelButton" @click="dialogVisible = false"
        >取消</el-button
      >
      <el-button
        :loading="loading"
        type="primary"
        size="small"
        data-tid="recordsCancelButton"
        @click="commitReason('ruleForm')"
        >提交</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
import './index.scss';
export default {
  name: 'RelieveCooperation',
  components: {},
  data() {
    return {
      ruleForm: {
        relieveReason: '', //解除原因
      },
      businessId: '',
      dialogVisible: false, //控制弹框显示隐藏
      loading: false,
      rules: {
        relieveReason: [{ required: true, message: '请输入解除原因', trigger: 'blur' }],
      },
    };
  },

  methods: {
    /**
     * @description 供父组件调用打开弹层
     */
    openModal(id) {
      console.log(id, 'id');
      this.businessId = id;
      this.dialogVisible = true;
    },
    /**
     * @description 弹窗关闭
     */
    diologHandleClose() {
      this.dialogVisible = false;
      this.loading = false;
      this.$refs.ruleForm.resetFields();
    },
    /**
     * @description 提交
     * @param {}
     * @returns {}
     */
    commitReason(formName) {
      //校验解除原因字段 relieveReason
      this.$refs[formName].validateField('relieveReason', (relieveReasonError) => {
        if (!relieveReasonError) {
          console.log('commitReason', this.ruleForm.relieveReason);
          this.loading = true;
          setTimeout(() => {
            this.loading = true;
            this.dialogVisible = false;
            this.$emit('reload-list');
          }, 2000);
        }
      });
    },
  },
};
</script>

<style></style>
