<template>
  <el-dialog
    title="拒绝合作联盟"
    custom-class="handle-log"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="480px"
    append-to-body
    @close="diologHandleClose"
  >
    <!-- 解除原因文本框 -->
    <div class="refusaltextarea">
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="拒绝原因：" prop="refuseReason">
          <el-input
            v-model="ruleForm.refuseReason"
            v-emoji="'textarea'"
            type="textarea"
            placeholder="请填写拒绝的原因，便于发起人理解 哦～"
            maxlength="200"
            show-word-limit
            resize="none"
          />
          <!-- id:{{ id }}  -->
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
  // props: {
  //   id: {
  //     type: String,
  //     default: '',
  //   },
  // },
  data() {
    return {
      id: '',
      ruleForm: {
        refuseReason: '', //拒绝解除原因
      },
      dialogVisible: false, //控制弹框显示隐藏
      loading: false,
      rules: {
        refuseReason: [{ required: true, message: '请输入拒绝原因', trigger: 'blur' }],
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
      if (id) this.id = id;
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
      //校验解除原因字段 refuseReason
      this.$refs[formName].validateField('refuseReason', (refuseReasonError) => {
        if (!refuseReasonError) {
          console.log('commitReason', this.ruleForm.refuseReason);
          this.loading = true;
          setTimeout(() => {
            this.loading = true;
            this.dialogVisible = false;
            //触发父组件关闭自身弹窗
            this.$emit('refusal-release');
          }, 2000);
        }
      });
    },
  },
};
</script>

<style></style>
