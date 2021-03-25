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
        <el-form-item label="解除原因：" prop="cause">
          <el-input
            v-model="ruleForm.cause"
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
import { apply_relieve } from 'api/cooperation-in-page';
import './index.scss';
export default {
  name: 'RelieveCooperation',
  components: {},
  data() {
    const checkRefuseReason = (rule, value, callback) => {
      value = value.trim();
      if (!value) {
        callback(new Error('解除原因不能为空'));
        this.ruleForm.cause = '';
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        id: '', //合作联盟id
        cause: '', //解除原因
      },
      dialogVisible: false, //控制弹框显示隐藏
      loading: false,
      rules: {
        cause: [{ required: true, validator: checkRefuseReason, trigger: 'blur' }],
      },
    };
  },

  methods: {
    /**
     * @description 供父组件调用打开弹层
     */
    openModal(id) {
      console.log(id, 'id');
      this.dialogVisible = true;
      if (id) this.ruleForm.id = id;
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
     */
    commitReason(formName) {
      //校验解除原因字段 cause
      this.$refs[formName].validateField('cause', (reasonError) => {
        if (!reasonError) {
          console.log('commitReason', this.ruleForm.cause);
          this.loading = true;
          let params = { ...this.ruleForm };
          apply_relieve(params)
            .then((res) => {
              const { code, message } = res;
              if (code === 200) {
                this.$message.success('解除申请已发出');
                //触发父组件刷新自列表
                this.$emit('refresh-list');
              } else {
                this.$message.warning(message);
              }
              this.dialogVisible = false;
              this.loading = false;
            })
            .catch(() => {
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
