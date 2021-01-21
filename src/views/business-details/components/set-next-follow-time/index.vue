<template>
  <el-dialog
    title="设置下次跟进时间"
    custom-class="set-next-follow-time"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="480px"
    @close="diologHandleClose"
  >
    <el-form
      ref="ruleForm"
      label-position="left"
      size="small"
      label-width="115px"
      :model="ruleForm"
      :rules="rules"
    >
      <el-form-item label="下次跟进时间：" prop="nextFollowTime">
        <el-date-picker
          ref="dateTimeRef"
          v-model="ruleForm.nextFollowTime"
          popper-class="set-next-follow-datatime"
          type="datetime"
          placeholder="选择日期时间"
          format="yyyy-MM-dd HH:mm"
          :picker-options="pickerOptions"
          :default-time="nowTime"
          data-tid="recordFocusHandle"
          @focus="focusHandle"
        />
      </el-form-item>
    </el-form>
    <!-- 弹层按钮 -->
    <span slot="footer" class="footer">
      <el-button size="small" @click="dialogVisible = false">取消</el-button>
      <el-button
        type="primary"
        :loading="loading"
        size="small"
        data-tid="recordSubmitHandleClick"
        @click="submitHandleClick"
        >提交</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
import './index.scss';
import dayjs from 'dayjs';
import nextOneHourLate from 'utils/mixins/dateTimeValidate';
import { set_next_follow_time } from 'api/business-details';
export default {
  name: 'EditRemark',
  components: {},
  mixins: [nextOneHourLate('nextFollowTime', 1, 'y')],
  data() {
    return {
      businessId: '',
      dialogVisible: false,
      loading: false,
      ruleForm: {
        nextFollowTime: '',
      },
    };
  },
  methods: {
    /**
     * @description 提交表单
     */
    submitHandleClick() {
      const ruleForm = this.ruleForm;
      const params = {
        bizId: this.businessId,
        nextFollowTime: ruleForm.nextFollowTime
          ? dayjs(ruleForm.nextFollowTime).format('YYYY-MM-DD HH:mm') + ':00'
          : '',
      };
      this.loading = true;
      set_next_follow_time(params)
        .then((res) => {
          if (res.code === 200) {
            this.$message.success('操作成功');
            this.$eventBus.$emit('edit-on-submit_update-business-info');
            this.dialogVisible = false;
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
    },
    /**
     * @description 供父组件调用打开弹层
     */
    openModal({ id, nextFollowTime = '' }) {
      this.businessId = id;
      this.nextTime = dayjs()
        .add(5, 'm')
        .valueOf(); //打开弹框记录当前时间下一个小时的时间进行对比
      if (nextFollowTime && dayjs(nextFollowTime).isValid()) {
        this.ruleForm.nextFollowTime = dayjs().isBefore(dayjs(nextFollowTime))
          ? nextFollowTime
          : '';
      }
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
