<template>
  <el-dialog
    title="写跟进"
    custom-class="write-follow-dailog"
    :visible.sync="dialogVisible"
    width="620px"
    :close-on-click-modal="false"
    @close="diologHandleClose"
  >
    <el-form
      ref="ruleForm"
      :rules="rules"
      label-position="left"
      label-width="84px"
      size="small"
      :model="ruleForm"
    >
      <el-form-item label="跟进内容：" prop="content">
        <el-input
          v-model="ruleForm.content"
          v-emoji="'textarea'"
          type="textarea"
          :rows="4"
          :maxlength="200"
          show-word-limit
          resize="none"
          placeholder="请输入跟进内容"
        ></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="footer">
      <el-button size="small" data-tid="recordsCancelButton" @click="dialogVisible = false"
        >取消</el-button
      >
      <el-button
        type="primary"
        size="small"
        :loading="loading"
        data-tid="followSubmitHandleClick"
        @click="submitHandleClick"
        >提交</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
import './index.scss';
import { add_follow_up_content } from 'api/cule';
export default {
  name: 'LibraryRecords',
  data() {
    const validateContent = (rule, value, callback) => {
      value = value.trim();
      if (!value) {
        callback('内容不能为空');
      } else {
        callback();
      }
    };
    return {
      clueId: '',
      dialogVisible: false,
      loading: false,
      clueSourceType: '',
      ruleForm: {
        content: '',
        feedback: '',
      },
      rules: {
        content: [
          {
            required: true,
            validator: validateContent,
            trigger: 'blur',
          },
        ],
      },
      feedbackList: [],
    };
  },
  methods: {
    /**
     * @description 供父组件调用打开弹层方法
     * @param {Object} 点击当前列表项
     */
    openModal(item, type) {
      this.clueSourceType = type;
      this.clueId = item?.id || '111';
      this.dialogVisible = true;
    },
    /**a
     * @description 写跟进
     * @param {}  线索id
     */
    addFollowContent() {
      this.loading = true;
      const param = {
        clueId: this.clueId,
        noteContent: this.ruleForm.content.trim(),
        clueSourceType: this.clueSourceType,
      };
      add_follow_up_content(param)
        .then((res) => {
          if (res.code === 200) {
            this.$emit('on-submit', '看看传的参数');
            this.$message({
              type: 'success',
              message: '写跟进成功！',
            });
            this.dialogVisible = false;
          } else {
            this.$message.warning(res.message);
          }
          this.loading = false;
        })
        .catch((rej) => {
          this.loading = false;
        });
    },
    /**
     * @description 关闭
     */
    diologHandleClose() {
      this.$refs.ruleForm.resetFields();
      this.dialogVisible = false;
    },
    /**
     * @description 表单提交
     */
    submitHandleClick() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.addFollowContent();
        } else {
          return false;
        }
      });
    },
  },
};
</script>
