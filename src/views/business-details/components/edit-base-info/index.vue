<template>
  <el-dialog
    title="基本信息修改"
    custom-class="edit-base-info"
    :visible.sync="dialogVisible"
    width="620px"
    :close-on-click-modal="false"
    @close="diologHandleClose"
  >
    <!-- 输入框 -->
    <el-form
      ref="ruleForm"
      :rules="rules"
      label-position="left"
      size="small"
      label-width="100px"
      :model="ruleForm"
    >
      <el-form-item class="from-name" label="姓名：" prop="customerName">
        <el-input
          v-model.trim="ruleForm.customerName"
          maxlength="20"
          clearable
          placeholder="请输入客户姓名或企业名称"
        ></el-input>
      </el-form-item>
      <el-form-item class="from-sex" label="性别：" prop="customerSex">
        <el-radio v-model="ruleForm.customerSex" :label="1" class="from-sex-man">男</el-radio>
        <el-radio v-model="ruleForm.customerSex" :label="0">女</el-radio>
      </el-form-item>
      <el-form-item class="from-phone" :show-message="false" required label="手机号码：">
        <div>
          <span>{{ customerPhone }}</span>
          <span
            :class="{
              'iconfont-qds-crm': true,
              'icon-plus': true,
              disabled: ruleForm.phoneArray && ruleForm.phoneArray.length > 1,
            }"
            data-tid="infoAddNew"
            @click="addNew"
            ><em>新增</em>
          </span>
        </div>
        <div class="warn">
          <span class="iconfont-qds-crm icon-attention warn-icon"
            ><em class="warn-text">保存后不可更改，且会作为核查的重要依据，请认真填写。</em></span
          >
        </div>
        <div>
          <el-form-item
            v-for="(item, index) in ruleForm.phoneArray"
            :key="item.id"
            :prop="'phoneArray.' + index + '.contactNo'"
            :rules="rules.contactNo"
            class="new-add"
          >
            <!-- 关联行？ -->
            <el-input
              v-model.trim="item.contactNo"
              :disabled="Boolean(item.id)"
              clearable
              type="text"
              placeholder="请输入手机号码"
              class="other-input"
              maxlength="11"
            />
            <el-button
              :data-index="index"
              plain
              size="small"
              icon="el-icon-delete"
              :disabled="ruleForm.phoneArray && ruleForm.phoneArray.length > 0 && Boolean(item.id)"
              data-tid="infoDeleteInput"
              @click="deleteInput(index)"
            ></el-button>
          </el-form-item>
        </div>
      </el-form-item>
      <el-form-item class="from-client-require" :show-message="false" required label="客户需求：">
        {{ clientRequire }}
      </el-form-item>
      <el-form-item class="from-level" :show-message="false" required label="意向等级：">
        <el-rate
          v-model="ruleForm.intentionLevel"
          :max="texts.length"
          show-text
          :texts="texts"
        ></el-rate>
      </el-form-item>
      <el-form-item class="from-content" label="备注：" prop="comment">
        <el-input
          v-model="ruleForm.comment"
          v-emoji="'textarea'"
          type="textarea"
          :rows="4"
          :maxlength="200"
          show-word-limit
          resize="none"
          placeholder="请输入客户的需求说明"
        ></el-input>
      </el-form-item>
      <!-- 备用行！ -->
      <el-form-item label="备用联系人：" class="content-beiyong">
        <el-form-item prop="contactPerson.standbyName">
          <el-input
            v-model="ruleForm.contactPerson.standbyName"
            maxlength="20"
            clearable
            type="text"
            data-tid="standbyNamePhoneInput"
            placeholder="请输入联系人姓名"
          />
        </el-form-item>
        <el-form-item prop="contactPerson.standbyPhone">
          <el-input
            v-model.trim="ruleForm.contactPerson.standbyPhone"
            :disabled="isDisabledStand"
            maxlength="11"
            clearable
            type="text"
            data-tid="standbyPhoneInput"
            placeholder="请输入手机号码"
          />
        </el-form-item>
        <el-select v-model="ruleForm.contactPerson.standbySex">
          <el-option label="请选择" :value="2"></el-option>
          <el-option label="男" :value="1"></el-option>
          <el-option label="女" :value="0"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <!-- 弹层按钮 -->
    <span slot="footer" class="footer">
      <el-button size="small" data-tid="recordsCancelButton" @click="dialogVisible = false"
        >取消</el-button
      >
      <el-button
        type="primary"
        :loading="loading"
        size="small"
        data-tid="infoSubmitHandleClick"
        @click="submitHandleClick"
        >提交</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
import validatePhone from 'utils/validate';
import { get_dictionary_data_by_parent_code, edit_biz_info } from 'api/common';
import './index.scss';
export default {
  name: 'EditGroup',
  mixins: [validatePhone],
  props: {},
  data() {
    return {
      dialogVisible: false,
      loading: false,
      customerPhone: '',
      isDisabledStand: false,
      ruleForm: {
        customerName: '',
        customerSex: '',
        phoneArray: [],
        intentionLevel: 3,
        comment: '',
        contactPerson: {
          standbyName: '',
          standbyPhone: '',
          standbySex: 2,
        },
      },
      businessInfo: {}, //商机基础信息数据
      clientRequire: '',
      texts: [],
      rules: {
        contactPerson: {
          standbyPhone: [
            {
              validator: this.checkContactNo,
              trigger: 'blur',
            },
          ],
          standbyName: [
            { validator: this.checkStandbyName, trigger: 'blur' },
            { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' },
          ],
        },
        contactNo: [{ validator: this.checkContactNo, trigger: 'blur' }], //次联系人号码验证
        customerName: [
          { required: true, validator: this.checkCtomerName, trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' },
        ],
      },
    };
  },
  methods: {
    /**
     * @description 查询数据字典意向等级
     */
    getIntentionList() {
      const params = {
        parentCode: 'INTENTION_LEVEL',
      };
      get_dictionary_data_by_parent_code(params).then((res) => {
        if (res.code === 200) {
          this.texts = res.data
            ?.sort((a, b) => a.sort - b.sort)
            .map((item) => {
              return '（' + item.name + '）' || '';
            });
        } else {
          this.$message.warning(res.message);
        }
      });
    },
    /**
     * @description 新增手机号
     */
    addNew() {
      if (this.ruleForm.phoneArray && this.ruleForm.phoneArray.length > 1) return;
      this.ruleForm.phoneArray.push({ contactNo: '' });
    },
    /**
     * @description 提交表单
     */
    submitHandleClick() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          const ruleForm = this.ruleForm;
          const bakRelation = this.businessInfo.bakRelation;
          let params = {
            bizId: this.businessInfo.id || '',
            comment: ruleForm.comment?.trim() || '',
            contactPerson: {
              standbyName: ruleForm.contactPerson.standbyName.trim() || undefined,
              standbyPhone: ruleForm.contactPerson.standbyPhone.trim() || undefined,
              standbySex: ruleForm.contactPerson.standbyPhone
                ? ruleForm.contactPerson.standbySex
                : undefined,
            },
            customerName: ruleForm.customerName.trim() || undefined,
            customerSex: ruleForm.customerSex.toString() || undefined,
            intentionLevel: ruleForm.intentionLevel || undefined,
            relationArray: ruleForm.phoneArray.reduce((acc, cur) => {
              if (!cur.id) {
                cur.contactNo && acc.push(cur.contactNo);
              }
              return acc;
            }, []),
          };
          params.contactPerson.id = bakRelation.contactNo ? bakRelation.id : undefined;
          this.loading = true;
          edit_biz_info(params)
            .then((res) => {
              if (res.code === 200) {
                this.$eventBus.$emit('edit-on-submit_update-business-info');
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
    openModal(businessInfo) {
      const ruleForm = this.ruleForm;
      this.businessInfo = businessInfo;
      ruleForm.comment = businessInfo.comment;
      ruleForm.contactPerson.standbyName = businessInfo.bakRelation?.contactName || '';
      ruleForm.contactPerson.standbyPhone = businessInfo.bakRelation?.contactNo || '';
      if (ruleForm.contactPerson.standbyPhone) {
        this.isDisabledStand = true;
      }
      ruleForm.contactPerson.standbySex =
        businessInfo.bakRelation.sex == '1' ? 1 : businessInfo.bakRelation.sex == '0' ? 0 : 2;
      ruleForm.customerName = businessInfo.customerName;
      ruleForm.customerSex =
        businessInfo?.customerSex == '0' ? 0 : businessInfo.customerSex == '1' ? 1 : '';
      this.customerPhone = businessInfo.customerPhone;
      ruleForm.phoneArray = businessInfo.relation.concat([]);
      this.clientRequire = businessInfo.requireName;
      ruleForm.intentionLevel = businessInfo.intentionLevel * 1;
      this.getIntentionList();
      this.dialogVisible = true;
    },
    /**
     * @description 弹层关闭抛出事件,重置表单数据
     */
    diologHandleClose() {
      this.$refs.ruleForm.resetFields();
      this.ruleForm.phoneArray = [];
    },
    /**
     * @description 点击删除图标事件
     * @param {Number} 当前点击的索引
     */
    deleteInput(value) {
      this.ruleForm.phoneArray?.splice(value, 1);
    },
  },
};
</script>
