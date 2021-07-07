<template>
  <el-dialog
    title="添加备用联系人"
    custom-class="add-contact-phone"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="480px"
    @close="diologHandleClose"
  >
    <el-form
      ref="ruleForm"
      label-position="left"
      size="small"
      label-width="110px"
      :model="ruleForm"
      :rules="rules"
    >
      <!-- 姓名行！ -->
      <el-form-item label="姓名：" prop="customerName">
        <el-input
          v-model="ruleForm.customerName"
          clearable
          maxlength="20"
          placeholder="请输入客户姓名或企业名称"
          data-tid="customerNameInput"
          class="clearable"
        ></el-input>
      </el-form-item>
      <!-- 性别行！ -->
      <el-form-item label="性别：" prop="customerSex">
        <el-radio v-model="ruleForm.customerSex" :label="1" class="content-radio-man">男</el-radio>
        <el-radio v-model="ruleForm.customerSex" :label="0">女</el-radio>
      </el-form-item>
      <!-- 手机行！ -->
      <el-form-item label="手机号码：" prop="customerPhone" class="content-phone">
        <el-input
          v-model.trim="ruleForm.customerPhone"
          maxlength="11"
          data-tid="customerPhoneInput"
          placeholder="请输入11位手机号码"
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
        data-tid="addContactSubmit"
        @click="submitHandleClick"
        >提交</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
import './index.scss';
import validatePhone from 'utils/validate';
import { save_contact, list_biz_status } from 'api/common';
export default {
  name: 'AddContactPhone',
  mixins: [validatePhone],
  data() {
    return {
      businessInfo: {},
      dialogVisible: false,
      loading: false,
      ruleForm: {
        customerName: '',
        customerPhone: '',
        customerSex: 2,
      },
      rules: {
        customerName: [{ validator: this.checkStandbyName, trigger: 'blur' }],
        customerPhone: [{ required: true, validator: this.checkPhone, trigger: 'blur' }],
      },
    };
  },
  methods: {
    /**
     * @description 提交表单
     */
    submitHandleClick() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          try {
            this.loading = true;
            const businessInfo = this.businessInfo;
            const result = await list_biz_status({ ids: [businessInfo.id] });
            const { code, data, message } = result || {};
            if (code !== 200) return this.$message.warning(message);
            if (!(data[0]?.bizLibrary === 'PLATFORM' && data[0]?.allocationStatus == 0)) {
              this.$message.warning('商机已不在个人库');
              this.$router.go(-1);
              return;
            }
            const ruleForm = this.ruleForm;
            const params = {
              contactName: ruleForm.customerName?.trim() || undefined,
              customerName: businessInfo.customerName || undefined,
              contactNo: ruleForm.customerPhone?.trim(),
              customerId: businessInfo.customerId,
              contactRlat: 'CONTACT_RLAT_SPARE',
              sex: ruleForm.customerSex,
              bizId: businessInfo.id,
            };
            let res = await save_contact(params);
            if (res.code === 200) {
              res = res.data;
              this.$emit('on-submit', res);
              this.$eventBus.$emit('edit-on-submit_update-business-info');
              this.dialogVisible = false;
            } else {
              this.$message.warning(res.message);
            }
            this.loading = false;
          } catch (error) {
            this.loading = false;
          }
        }
      });
    },
    /**
     * @description 弹层关闭抛出事件,重置表单数据
     */
    diologHandleClose() {
      this.$refs.ruleForm.resetFields();
      this.$emit('on-close', true);
    },
    /**
     * @description 供父组件调用打开弹层
     */
    openModal(businessInfo) {
      this.businessInfo = businessInfo;
      this.dialogVisible = true;
    },
  },
};
</script>
