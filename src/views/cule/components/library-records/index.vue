<template>
  <el-dialog
    :title="from === 'prospective' ? '写跟进' : '备注'"
    custom-class="library-records"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="620px"
    @close="diologHandleClose"
  >
    <el-form
      ref="ruleForm"
      :rules="rules"
      label-position="left"
      label-width="100px"
      size="small"
      :model="ruleForm"
    >
      <el-form-item label="跟进内容：" prop="text">
        <el-input
          v-model="ruleForm.text"
          v-emoji="'textarea'"
          type="textarea"
          :rows="4"
          :maxlength="200"
          show-word-limit
          resize="none"
          data-tid="recordListInput"
          placeholder="请输入跟进内容"
        ></el-input>
      </el-form-item>
      <el-form-item
        v-if="feedbackList.length && from !== 'prospective'"
        label="情况反馈："
        prop="feedback"
      >
        <el-radio-group v-model="ruleForm.feedback">
          <div class="">
            <el-radio
              v-for="item in feedbackList"
              :key="item.code"
              :label="item.code"
              data-tid="recordChangeCode"
              @click.native.prevent="changeCode(item.code)"
              >{{ item.name }}</el-radio
            >
          </div>
        </el-radio-group>
        <p v-show="hideDays && from !== 'prospective'" class="note-remind">
          <i class="iconfont-qds-crm icon-attention"></i> 注：提交后商机将隐藏
          <span>{{ hideDays }}</span
          >天，感谢您的反馈。
        </p>
      </el-form-item>
    </el-form>
    <!-- 弹层按钮 -->
    <span slot="footer" class="footer">
      <el-button size="small" data-tid="recordsCancelButton" @click="dialogVisible = false"
        >取消</el-button
      >
      <el-button
        type="primary"
        size="small"
        :loading="loading"
        data-tid="recordSubmitHandleClick"
        @click="submitHandleClick"
        >提交</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
import './index.scss';
// 新增线索公海库备注
import { add_remark_to_high_seas, noteHide } from 'api/cule';
import { get_dictionary_data_by_parent_code } from 'api/common';
import { add_follow_up_content } from 'api/cule';
// 新增公共库备注
export default {
  name: 'LibraryRecords',
  props: {
    from: {
      type: String,
      default: '',
    },
  },
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
      dialogVisible: false,
      loading: false,
      ruleForm: {
        text: '',
        feedback: '',
        bizId: '',
      },
      rules: {
        text: [
          {
            validator: validateContent,
            trigger: 'change',
            required: true,
          },
        ],
      },
      feedbackList: [],
      hideDays: '',
    };
  },
  created() {},
  methods: {
    getfeedback() {
      return (this.feedbackList || []).reduce((cur, acc) => {
        cur[acc.code] = acc;
        return cur;
      }, {});
    },
    /**
     * @description 选择框发生变化
     */
    changeCode(change) {
      // 文字提示的天數
      change === this.ruleForm.feedback
        ? (this.ruleForm.feedback = '')
        : (this.ruleForm.feedback = change);
      change === this.ruleForm.feedback
        ? (this.hideDays = this.getfeedback()[change].ext1)
        : (this.hideDays = '');
    },
    /**
     * @description 数据字典
     */
    async getDictionary(code) {
      const param = {
        parentCode: code,
      };
      const result = await get_dictionary_data_by_parent_code(param).catch(() => {});
      this.feedbackList = result.data || [];
    },
    /**
     * @description 线索公海库备注接口
     */
    addRemarkToHighSeas() {
      const param = {
        clueId: this.ruleForm.bizId,
        feedbackType: this.ruleForm.feedback,
        lastRemarkContent: this.ruleForm.text.trim(),
      };
      add_remark_to_high_seas(param)
        .then((res) => {
          if (res.code === 200) {
            this.$message({
              message: '备注成功！',
              type: 'success',
            });
            this.dialogVisible = false;
            this.$emit('reset-list', Number(this.hideDays) > 0 ? true : false);
          } else {
            this.$message.warning(res.message);
          }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    /**a
     * @description 写跟进潜在客户
     * @param {}  线索id
     */
    addFollowContent() {
      this.loading = true;
      const param = {
        clueId: this.ruleForm.bizId,
        noteContent: this.ruleForm.text.trim(),
        clueSourceType: this.type,
      };
      add_follow_up_content(param)
        .then((res) => {
          if (res.code === 200) {
            this.$emit('reset-list', '看看传的参数');
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
     * @description 公共库备注接口
     */
    publicLibraryNoteHide() {
      const param = {
        bizId: this.ruleForm.bizId,
        feedback: this.ruleForm.feedback,
        followContent: this.ruleForm.text,
        hideDays: this.hideDays,
        text: this.feedbackList?.find((item) => item.code === this.ruleForm.feedback)?.name || '',
      };
      noteHide(param)
        .then((res) => {
          if (res.code === 200) {
            this.dialogVisible = false;
            this.$message({
              message: '备注成功！',
              type: 'success',
            });
            this.$emit('reset-list', Number(this.hideDays) > 0 ? true : false);
          } else {
            this.$message.warning(res.message);
          }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    /**
     * @description 供父组件调用打开弹层方法
     * @param {Object} 点击当前列表项
     */
    openModal(item, type) {
      this.type = type;
      this.ruleForm.bizId = item?.id || '111';
      if (this.type === 'clue-seas-library') {
        this.getDictionary('QDS_CLUE_FEEDBACK');
      } else {
        this.getDictionary('CRM_BIZ_FEEDBACK');
      }
      this.dialogVisible = true;
    },
    diologHandleClose() {
      this.$refs.ruleForm.resetFields();
      this.hideDays = '';
      this.loading = false;
    },
    submitHandleClick() {
      this.loading = true;
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.type === 'clue-seas-library') {
            this.addRemarkToHighSeas();
          }
          if (this.type === 'public-library') {
            this.publicLibraryNoteHide();
          }
          if (this.from === 'prospective') {
            this.addFollowContent();
          }
        } else {
          this.loading = false;
          return false;
        }
      });
    },
  },
};
</script>
