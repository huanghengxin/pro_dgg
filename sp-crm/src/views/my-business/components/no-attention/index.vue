<template>
  <el-dialog
    :title="activeDialog === 'BUS_WXSJ' ? dialogInfo.title : dialogInfo.title2"
    custom-class="no-attention"
    :visible.sync="dialogVisible"
    width="620px"
    :close-on-click-modal="false"
    @close="diologHandleClose"
  >
    <el-form
      ref="ruleForm"
      label-position="left"
      :label-width="dialogInfo.labelWidth"
      size="small"
      :rules="rules"
      :model="ruleForm"
    >
      <el-form-item
        v-if="activeDialog === 'BUS_WXSJ' || activeDialog === 'CULE_WXSJ'"
        :label="dialogInfo.label1"
        prop="noAttention"
      >
        <el-select
          v-model="ruleForm.noAttention"
          :placeholder="dialogInfo.placeholder1"
          data-tid="searchNoAttention"
          @change="noAttentionChangeHandle"
        >
          <el-option
            v-for="item in invalidList"
            :key="item.value"
            :label="item.name"
            :value="item.code"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="activeDialog === 'BUS_ZBGZ'"
        :label="dialogInfo.label1"
        prop="noAttention"
      >
        <el-input
          v-model="ruleForm.noAttention"
          :placeholder="dialogInfo.placeholder1"
          :controls="false"
        >
          <template slot="append">天</template>
        </el-input>
      </el-form-item>
      <!-- 其他无效原因 -->
      <el-form-item
        v-if="activeDialog === 'BUS_ZBGZ' || ruleForm.noAttention === 'OTHER_REASON'"
        :label="dialogInfo.label2"
        prop="reason"
      >
        <el-input
          v-model="ruleForm.reason"
          v-emoji="'textarea'"
          type="textarea"
          :rows="4"
          :maxlength="200"
          show-word-limit
          resize="none"
          :placeholder="dialogInfo.placeholder2"
          data-tid="dialogInfoInput"
        ></el-input>
      </el-form-item>
    </el-form>
    <!-- 弹层按钮 -->
    <span slot="footer" class="footer">
      <span class="footer-info" v-html="dialogInfo.footerInfo(num)"></span>
      <div>
        <el-button size="small" data-tid="recordsCancelButton" @click="dialogVisible = false"
          >取消</el-button
        >
        <el-button
          type="primary"
          size="small"
          :loading="loading"
          data-tid="searchSubmit"
          @click="submitHandleClick"
          >提交</el-button
        >
      </div>
    </span>
  </el-dialog>
</template>

<script>
import './index.scss';
import { NO_ATTENTION } from 'constants/constants';
import {
  get_dictionary_data_by_parent_code,
  get_storage_by_type,
  get_disable_used,
  get_inattention_time,
} from 'api/common';
import { inattention, disableBiz } from 'api/my-business';
import { ginvalid_operation, get_invalid_details } from 'api/cule';

export default {
  name: 'NoAttention',
  props: {
    isPlace: {
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
    const validateNoAttention = (rule, value, callback) => {
      value = value.trim();
      if (this.activeDialog === 'BUS_ZBGZ') {
        if (value === '') {
          callback('请输入暂不关注时间');
        } else {
          const isnum = /^[0-9]{1,}?$/;
          if (!isnum.test(value)) {
            callback('输入的时间为整数');
          } else if (!(0 < Number(value) && Number(value) <= this.maximum)) {
            callback(`时间在 1 天到 ${this.maximum} 天之间`);
          }
          callback();
        }
      }
      if (this.activeDialog === 'BUS_WXSJ' || this.activeDialog === 'CULE_WXSJ') {
        if (value === '') {
          callback('请选择无效原因');
        } else {
          callback();
        }
      }
    };
    return {
      maximum: 1,
      dialogVisible: false,
      invalidList: [],
      ruleForm: {
        noAttention: '',
        reason: '',
      },
      loading: false,
      rules: {
        noAttention: [{ required: true, validator: validateNoAttention, trigger: 'blur' }],
        reason: [{ required: true, validator: validateContent, trigger: 'blur' }],
      },
      activeDialog: '',
      num: 0,
      businessId: '',
    };
  },
  computed: {
    dialogInfo() {
      if (this.activeDialog === 'BUS_WXSJ' || this.activeDialog === 'CULE_WXSJ') {
        return NO_ATTENTION['BUS_WXSJ'];
      } else {
        return NO_ATTENTION['BUS_ZBGZ'];
      }
    },
  },
  methods: {
    noAttentionChangeHandle() {
      this.ruleForm.reason = '';
    },
    getMaxNoAttentionTime() {
      get_inattention_time().then((res) => {
        if (res.code === 200) {
          res = res.data;
          this.maximum = res || 1;
        } else {
          this.$message.warning(res.message);
        }
      });
    },
    /**
     * @description 供父组件调用打开弹层
     */
    openModal(item) {
      this.activeDialog = item.code;
      this.businessId = item.busId;
      // console.log(this.businessId, '555555555555');
      switch (this.activeDialog) {
        case 'BUS_WXSJ':
          this.getNoAttentionOption();
          this.getNum();
          break;
        case 'BUS_ZBGZ':
          this.getNum('NO_ATTENTION');
          this.getMaxNoAttentionTime();
          break;
        default:
          // 线索
          this.getClueNum({ clueId: this.businessId });
          break;
      }
    },
    /**
     * @description 弹框关闭，清空数据
     */
    diologHandleClose() {
      this.$refs.ruleForm.resetFields();
      this.num = 0;
    },
    /**
     * @description 提交表单
     */
    submitHandleClick() {
      if (this.num == 0) {
        switch (this.activeDialog) {
          case 'BUS_ZBGZ':
            this.$message.error(`剩余暂不关注数量为0`);
            break;
          case 'CULE_WXSJ':
            this.$message.error(`剩余无效线索数量为0`);
            break;
          default:
            this.$message.error(`剩余无效商机数量为0`);
            break;
        }
        return;
      }
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          const ruleForm = this.ruleForm;
          let params = {},
            path;

          if (this.activeDialog === 'BUS_ZBGZ') {
            params.bizId = this.businessId || '';
            params.days = ruleForm.noAttention.trim();
            params.reason = ruleForm.reason.trim();
            path = inattention;
          } else if (this.activeDialog === 'BUS_WXSJ') {
            params.bizId = this.businessId || '';
            params.disableReason = ruleForm.noAttention;
            params.disableDescription = ruleForm.reason.trim() || '';
            path = disableBiz;
          } else {
            params.clueId = this.businessId || '';
            params.invalidCode = ruleForm.noAttention;
            params.invalidReason = this.invalidList.filter(
              (item) => item.code == ruleForm.noAttention,
            )[0].name;
            path = ginvalid_operation;
          }
          // 还有线索提交
          this.loading = true;
          path(params)
            .then((res) => {
              if (res.code === 200) {
                res = res.data;
                if (this.isPlace) {
                  if (this.activeDialog === 'BUS_WXSJ') {
                    this.$router.push('/my-business');
                  } else {
                    this.$eventBus.$emit('edit-on-submit_update-business-info');
                  }
                } else {
                  //提交表单
                  this.$emit('on-submit', this.activeDialog);
                }
                this.$message.success('操作成功');
                this.dialogVisible = false;
              } else {
                this.$message.warning(res.message);
                if (res.code === 5002) {
                  if (this.isPlace === 'business-details') {
                    this.$router.go(-1);
                  } else {
                    this.$emit('on-submit');
                  }
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
     * @description 线索默认Num
     */
    getClueNum(params) {
      get_invalid_details(params).then((res) => {
        if (res.code === 200) {
          res = res.data;
          this.invalidList = Object.freeze(res?.invalidReasonList);
          this.num = res.surplusCount;
          if (this.num === 0) {
            this.$message.info('剩余的无效线索数量为0');
            this.dialogVisible = false;
            return;
          }
          this.dialogVisible = true;
        } else {
          this.$message.warning(res.message);
        }
      });
    },
    /**
     * @description 获取暂不关注剩余数量/获取无效商机剩余数量
     */
    getNum(type) {
      const params = {
        type,
      };
      if (this.activeDialog === 'BUS_ZBGZ') {
        get_storage_by_type(params).then((res) => {
          if (res.code === 200) {
            res = res.data;
            const num = Number(res.capacity) - Number(res.used);
            this.num = num < 0 ? 0 : num;
            if (this.num === 0) {
              this.$message.info('剩余的暂不关注数量为0');
              this.dialogVisible = false;
              return;
            }
            this.dialogVisible = true;
          } else {
            this.$message.warning(res.message);
          }
        });
      } else {
        get_disable_used(params).then((res) => {
          if (res.code === 200) {
            res = res.data;
            this.num = Number(res) || 0;
            if (this.num === 0) {
              this.$message.info('剩余的无效商机数量为0');
              this.dialogVisible = false;
              return;
            }
            this.dialogVisible = true;
          } else {
            this.$message.warning(res.message);
          }
        });
      }
    },
    /**
     * @description 获取暂不关注配置最大时间
     */
    getNoAttentionOption() {
      const params = {
        parentCode: 'INVALID_REASON',
      };
      get_dictionary_data_by_parent_code(params).then((res) => {
        if (res.code === 200) {
          res = res.data;
          res = res.sort((a, b) => a.sort - b.sort);
          this.invalidList = Object.freeze(res);
        } else {
          this.$message.warning(res.message);
        }
      });
    },
  },
};
</script>

<style></style>
