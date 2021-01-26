<template>
  <div>
    <el-dialog
      title="关闭流转规则"
      :visible.sync="dialogVisible"
      custom-class="close-all-rule-dialog"
      width="480px"
      :close-on-click-modal="false"
      @close="diologHandleClose"
    >
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="84px" size="mini">
        <el-form-item label="选择时间：" prop="date">
          <el-date-picker
            v-model="ruleForm.date"
            type="daterange"
            range-separator="至"
            value-format="yyyy-MM-dd"
            start-placeholder="选择开始时间"
            end-placeholder="选择结束时间"
            :picker-options="pickerOptions"
            data-tid="platFormSureDate"
            @change="sureDate"
          >
            <!-- :default-time="nowTime" -->
          </el-date-picker>
        </el-form-item>
      </el-form>
      <span class="warming">
        <i class="iconfont-qds-crm icon-attention"></i>
        个人库商机/线索在选择的时间内不执行掉库，请谨慎选择时间。</span
      >
      <span slot="footer" class="footer">
        <el-button size="medium" data-tid="recordsCancelBtn" @click="dialogVisible = false"
          >取消</el-button
        >
        <el-button
          type="primary"
          size="medium"
          :loading="loading"
          data-tid="onSubmitHandle"
          @click="onSubmitHandle"
          >确定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import './index.scss';
import { exe_platform_rule_switch } from 'api/rule';
import dayjs from 'dayjs';
export default {
  name: 'CloseRuleDialog',
  components: {},
  props: {
    switchboardStatus: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          const day = dayjs(time);
          return day < dayjs().subtract(1, 'day');
        },
      },
      parma: {
        val1: '',
        val2: '',
        val3: '',
        val4: '',
        status: '',
        ruleCode: '',
        id: '',
      },
      rules: {
        date: [{ required: true, message: '请选择时间', trigger: 'blur' }],
      },
      loading: false,
      typeClose: '',
      ruleForm: { date: [] },
      dialogVisible: false,
    };
  },
  computed: {},
  created() {},
  methods: {
    /**
     * @description 时间确定
     */
    sureDate() {
      this.parma.val1 = (this.ruleForm.date && this.ruleForm.date[0]) || '';
      this.parma.val2 = (this.ruleForm.date && this.ruleForm.date[1]) || '';
    },
    /**
     * @description 保存数据
     */
    switchboardtSave() {
      this.loading = true;
      exe_platform_rule_switch(this.parma)
        .then((res) => {
          if (res.code === 200) {
            this.$emit('on-submit');
            this.$message({
              type: 'success',
              message: '关闭规则成功!',
            });
            this.loading = false;
            this.dialogVisible = false;
          } else {
            this.dialogVisible = false;
            this.$message.warning(res.message);
          }
        })
        .catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: '关闭规则失败！',
          // });
          this.loading = false;
        });
    },
    /**
     * @description 点击提交移交
     */
    onSubmitHandle() {
      //  请求保存时间接口
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.switchboardtSave();
        } else {
          return false;
        }
      });
    },
    /**
     * @description 供父组件调用打开弹层方法
     * @param {Object} 点击当前列表项
     */
    openModal(obj) {
      this.parma.status = obj.status;
      this.parma.id = obj.id;
      this.parma.ruleCode = obj.ruleCode;
      this.dialogVisible = true;
    },
    /**
     * @description 弹层关闭抛出事件,重置表单数据
     */
    diologHandleClose(val) {
      this.ruleForm.date = [];
    },
  },
  /**
   * @description 总开关结束时间范围内
   */
};
</script>
