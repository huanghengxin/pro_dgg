<template>
  <el-dialog
    title="添加手机号码"
    custom-class="add-contact-phone"
    :visible.sync="dialogVisible"
    width="480px"
    :close-on-click-modal="false"
    @close="diologHandleClose"
  >
    <div class="added-phone">
      <p>已添加手机号码：</p>
      <div class="added-phone_right">
        <p>
          <span v-for="(item, index) in phoneList" :key="item.id"
            >{{ item.contactNo }}<em v-if="index !== phoneList.length - 1">、</em></span
          >
        </p>
      </div>
    </div>
    <el-form
      ref="ruleForm"
      label-position="left"
      size="small"
      label-width="122px"
      :model="ruleForm"
    >
      <el-form-item label="手机号码：" required>
        <div class="add-button">
          <el-button
            :disabled="ruleForm.phoneArray.length >= num"
            type="primary"
            icon="el-icon-plus"
            size="small"
            @click="addPhoneHandleClick"
            >新增号码</el-button
          >
        </div>
        <el-form-item
          v-for="(item, index) in ruleForm.phoneArray"
          :key="index + 'contact'"
          :prop="'phoneArray.' + index + '.contact'"
          :rules="rules.contact"
        >
          <el-input
            v-model.trim="item.contact"
            type="text"
            maxlength="11"
            placeholder="请输入11位手机号码"
          ></el-input>
          <el-button plain icon="el-icon-delete" @click="deleteGroup(index)"></el-button>
        </el-form-item>
        <!-- 提示行！ -->
        <div class="warn">
          <span class="iconfont-qds-crm icon-attention warn-icon"
            ><em class="warn-text">保存后不可更改，且会作为核查的重要依据，请认真填写。</em>
          </span>
        </div>
      </el-form-item>
    </el-form>
    <span slot="footer" class="footer">
      <el-button size="small" @click="dialogVisible = false">取消</el-button>
      <el-button
        type="primary"
        size="small"
        :loading="loading"
        data-tid="addSubmitHandleClick"
        @click="submitHandleClick"
        >提交</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
import './index.scss';
import store from 'storejs';
import { save_contact } from 'api/common';

export default {
  name: 'AddContactPhone',
  data() {
    const phone = store.get('userInfo')?.mainAccount || '';
    //手机号验证新规则
    const regPhone = /^1[3-9]\d{9}$/;
    const checkPhone = (rule, value, callback) => {
      value = value.trim();
      const flag = regPhone.test(value);
      if (value === '') {
        callback('手机号不能为空');
      } else if (!flag) {
        callback('请输入正确手机号');
      } else if (phone === value) {
        callback('不能输入自己的号码');
      } else if (this.ruleForm.phoneArray.filter((item) => item.contact === value).length > 1) {
        callback('不能输入相同号码');
      } else {
        callback();
      }
    };
    return {
      businessInfo: {},
      phoneList: [],
      num: null,
      dialogVisible: false,
      loading: false,
      ruleForm: {
        phoneArray: [],
      },
      rules: {
        contact: [{ required: true, validator: checkPhone, trigger: 'blur' }],
      },
    };
  },
  methods: {
    /**
     * @description 点击新建号码
     */
    addPhoneHandleClick() {
      if (this.ruleForm.phoneArray > this.num) return;
      this.ruleForm.phoneArray.push({ contact: '' });
    },
    /**
     * @description 点击删除图标事件
     * @param {Number} 当前点击的索引
     */
    deleteGroup(index) {
      this.ruleForm.phoneArray?.splice(index, 1);
    },
    /**
     * @description 提交表单
     */
    submitHandleClick() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          const phoneArray = this.ruleForm.phoneArray;
          const len = phoneArray.length - 1;
          const str = phoneArray?.reduce((acc, cur, index) => {
            if (cur.contact) {
              acc += cur.contact + (index === len ? '' : ',');
            }
            return acc;
          }, '');
          if (!str) {
            this.$message.warning('请新增号码');
            return;
          }
          const params = {
            contactName: this.businessInfo.customerName,
            contactNo: str,
            customerId: this.businessInfo.customerId,
            contactRlat: 'CONTACT_RLAT_ONESELF',
            bizId: this.businessInfo.id,
          };
          this.loading = true;
          save_contact(params)
            .then((res) => {
              if (res.code === 200) {
                res = res.data;
                this.$emit('on-submit', res);
                this.$eventBus.$emit('edit-on-submit_update-business-info');
                this.dialogVisible = false;
              } else {
                this.$message.warning(res.message);
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
     * @description 弹层关闭抛出事件,重置表单数据
     */
    diologHandleClose() {
      this.$refs.ruleForm.resetFields();
      this.num = 2;
      this.phoneList = [];
      this.$emit('on-close', true);
    },
    /**
     * @description 供父组件调用打开弹层
     */
    openModal(businessInfo, num, phoneList) {
      console.log('nnnnnnnn', businessInfo);
      this.phoneList = phoneList;
      this.num = num;
      this.businessInfo = businessInfo;
      this.dialogVisible = true;
    },
  },
};
</script>

<style></style>
