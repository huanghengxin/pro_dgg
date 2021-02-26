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
        <el-form-item label="解除原因：" prop="reason">
          <el-input
            v-model="ruleForm.reason"
            v-emoji="'textarea'"
            type="textarea"
            placeholder="为保证双方利益，请务必与合作方进行协商确认后再发起哦～"
            maxlength="200"
            show-word-limit
            resize="none"
          />
          <!-- {{ cooperationId }} -->
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
import { apply } from 'api/cooperation-in-page';
import './index.scss';
export default {
  name: 'RelieveCooperation',
  components: {},
  data() {
    return {
      ruleForm: {
        reason: '', //解除原因
      },
      cooperationId: '', //合作id
      dialogVisible: false, //控制弹框显示隐藏
      loading: false,
      rules: {
        reason: [{ required: true, message: '请输入解除原因', trigger: 'blur' }],
      },
    };
  },

  methods: {
    /**
     * @description 供父组件调用打开弹层
     */
    openModal(id) {
      if (id) {
        console.log(id, 'id');
        this.cooperationId = id;
      }
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
      //校验解除原因字段 reason
      this.$refs[formName].validateField('reason', (reasonError) => {
        if (!reasonError) {
          console.log('commitReason', this.ruleForm.reason);
          this.loading = true;
          let params = { id: this.cooperationId };
          apply(params)
            .then((res) => {
              const { code, message } = res;
              if (code === 200) {
                this.$message({
                  type: 'success',
                  message: '操作成功',
                });
              } else {
                this.$message.warning(message);
              }
              this.loading = false;
              this.dialogVisible = false;
            })
            .catch((res) => {
              this.loading = false;
              this.dialogVisible = false;
            });
          // this.$emit('reload-list');
        }
      });
    },
  },
};
</script>

<style></style>
