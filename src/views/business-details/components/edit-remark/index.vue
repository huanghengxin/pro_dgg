<template>
  <el-dialog
    title="修改备注"
    custom-class="edit-remark"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="620px"
    @close="diologHandleClose"
  >
    <el-form
      ref="ruleForm"
      label-position="left"
      size="small"
      label-width="70px"
      :model="ruleForm"
      :rules="rules"
    >
      <el-form-item class="from-content" label="备注：" prop="content">
        <el-input
          v-model="ruleForm.content"
          v-emoji="'textarea'"
          type="textarea"
          :rows="4"
          :maxlength="200"
          show-word-limit
          resize="none"
          placeholder="请输入客户的需求说明"
        ></el-input>
      </el-form-item>
    </el-form>
    <!-- 弹层按钮 -->
    <span slot="footer" class="footer">
      <el-button size="small" @click="dialogVisible = false">取消</el-button>
      <el-button
        type="primary"
        size="small"
        data-tid="remarkSubmitHandleClick"
        :loading="loading"
        @click="submitHandleClick"
        >提交</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
import { edit_biz_comment } from 'api/business-details';
import './index.scss';
export default {
  name: 'EditRemark',
  data() {
    const validateContent = (rule, value, callback) => {
      value = value?.trim();
      if (!value) {
        callback('内容不能为空');
      } else {
        callback();
      }
    };
    return {
      dialogVisible: false,
      loading: false,
      ruleForm: {
        content: '',
      },
      rules: {
        content: [{ required: true, validator: validateContent, trigger: 'blur' }],
      },
      businessId: '',
    };
  },
  methods: {
    /**
     * @description 提交表单
     */
    submitHandleClick() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.$emit('on-submit');
          let params = {
            bizId: this.businessId,
            comment: this.ruleForm.content?.trim(),
          };
          this.loading = true;
          edit_biz_comment(params)
            .then((res) => {
              if (res.code === 200) {
                this.$emit('set-remark');
                this.dialogVisible = false;
                this.$message.success('操作成功');
              } else {
                this.$message.warning(res.message);
                if (res.code === 5002) {
                  this.$router.go(-1);
                }
              }
              this.loading = false;
            })
            .catch(() => {
              this.loading = false;
            });
        }
      });
    },
    /**
     * @description 供父组件调用打开弹层
     */
    openModal(item) {
      this.businessId = item.id;
      this.ruleForm.content = item.comment;
      this.dialogVisible = true;
    },
    /**
     * @description 弹层关闭抛出事件,重置表单数据
     */
    diologHandleClose() {
      this.$refs.ruleForm.resetFields();
    },
  },
};
</script>
