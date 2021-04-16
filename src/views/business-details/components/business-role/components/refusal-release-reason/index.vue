<template>
  <el-dialog
    title="拒绝合作联盟"
    custom-class="handle-log"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="480px"
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
        <el-form-item label="拒绝原因：" prop="returnReason">
          <el-input
            v-model="ruleForm.returnReason"
            v-emoji="'textarea'"
            type="textarea"
            placeholder="请填写拒绝的原因，便于发起人理解哦～"
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
        >取消
      </el-button>
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
import { rejectCooperation } from 'api/cooperation-in-page';
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
    const checkRefuseReason = (rule, value, callback) => {
      value = value.trim();
      if (!value) {
        callback(new Error('请输入拒绝原因'));
        this.ruleForm.returnReason = '';
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        id: '',
        returnReason: '', //拒绝解除原因
      },
      dialogVisible: false, //控制弹框显示隐藏
      loading: false,
      rules: {
        returnReason: [{ required: true, validator: checkRefuseReason, trigger: 'blur' }],
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
      //校验解除原因字段 returnReason
      this.$refs[formName].validateField('returnReason', (refuseReasonError) => {
        if (!refuseReasonError) {
          this.loading = true;
          const params = { ...this.ruleForm };
          rejectCooperation(params)
            .then((res) => {
              const { code, message } = res;
              if (code === 200) {
                //触发父组件关闭自身弹窗
                this.$emit('refusal-release');
                //触发父组件刷新自列表
                this.$emit('refresh-list');
                this.$message.success(message);
              } else if (code == 7004 || code == 7021 || code == 7019 || code == 7001) {
                this.$emit('refresh-list');
                this.$message.warning(message);
              } else {
                this.$message.warning(message);
              }
              this.loading = false;
              this.dialogVisible = false;
            })
            .catch(() => {
              this.loading = false;
              this.dialogVisible = false;
            });
        }
      });
    },
  },
};
</script>

<style></style>
