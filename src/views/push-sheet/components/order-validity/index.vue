<template>
  <div>
    <div class="validity">
      <div class="validity-title">
        <p class="titleWord">订单有效期</p>
        <div class="tipsText">
          <i class="el-icon-warning-outline"></i>
          <p class="warning">超过订单有效期，未付款订单将自动关闭！</p>
        </div>
      </div>
      <el-form ref="validityNumFormRef" :model="validityNumForm" size="small">
        <div class="validity-time">
          <p>订单有效期：</p>
          <div class="validity-time-first-select">
            <el-select
              v-model="ruleForm.value1"
              placeholder="请选择"
              style="width: 300px"
              @change="validityChange"
            >
              <el-option
                v-for="item in validityOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
          <div v-if="isCustom" class="customSelect">
            <el-form-item prop="validityNum" :rules="validityNumRules.validityNum">
              <el-input
                v-model="validityNumForm.validityNum"
                clearable
                class="customSelect-with-select"
              >
                <el-select
                  slot="append"
                  v-model="ruleForm.value3"
                  style="width: 74px"
                  @change="unitChange"
                >
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-input>
            </el-form-item>
          </div>
        </div>
        <div class="validity-mark">
          <p class="validity-mark_width">备注信息：</p>

          <!--   v-emoji="'textarea'" -->
          <el-input
            v-model="ruleForm.textarea"
            clearable
            type="textarea"
            :rows="5"
            maxlength="200"
            show-word-limit
            resize="none"
            style="width: 471px"
            placeholder="请输入200字以内的备注说明"
          >
          </el-input>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script>
import './index.scss';
export default {
  data() {
    var checkNum = (rule, value, callback) => {
      console.log(value, 'value');
      if (!value) {
        callback(new Error('请输入'));
      } else {
        callback();
      }
    };
    return {
      //自定义选项
      validityOptions: [
        {
          value: '0',
          label: '请选择',
        },
        {
          value: '1',
          label: '24小时',
        },
        {
          value: '2',
          label: '48小时',
        },
        {
          value: '3',
          label: '72小时',
        },
        {
          value: '4',
          label: '88小时',
        },
        {
          value: '5',
          label: '自定义',
        },
      ],
      //天数 小时
      options: [
        {
          value: '1',
          label: '天',
        },
        {
          value: '2',
          label: '小时',
        },
      ],
      ruleForm: {
        value1: '', //下拉选择框值
        value2: '5', //下拉选择框值
        value3: '1', //下拉选择框值
        unit: '1',

        textarea: '', //文本框备注信息
      },
      validityNumForm: {
        validityNum: '', //自定义输入内容
      },
      validityNumRules: {
        validityNum: [
          {
            validator: checkNum,
            trigger: 'blur',
          },
        ],
      },
      rules: {
        unit: [{ required: true, message: '请选择', trigger: 'change' }],
        value1: [{ required: true, message: '请选择', trigger: 'change' }],
        value2: [{ required: true, message: '请选择', trigger: 'change' }],
        value3: [{ required: true, message: '请选择', trigger: 'change' }],
      },
      isCustom: false, //下拉框是否是自定义
      inputWithSelectFlag: false, //下拉框是否是自定义
    };
  },
  created() {
    this.ruleForm.value1 = this.validityOptions[1].value;
  },
  mounted() {},
  methods: {
    /**
     * @description 订单有效期切换事件
     */
    validityChange(val, lab) {
      this.$refs.validityNumFormRef.resetFields();
      if (val == this.validityOptions.length - 1) {
        this.isCustom = true;
      } else {
        this.isCustom = false;
        // this.inputWithSelectFlag = true;
      }
    },
    /**
     * @description 单位i切换
     */
    unitChange(val) {
      console.log(val, 'val');
      this.unit = val;
    },

    // 校验数据
    checkForm() {
      let flag = false;
      let ref = this.$refs.validityNumFormRef;
      if (!ref) return;
      if (Array.isArray(ref)) {
        ref = ref[0];
      }
      if (this.ruleForm.value1 == this.validityOptions.length - 1) {
        ref.validate((valid) => {
          console.log(valid, 'valid-------------------');
          if (valid) {
            flag = valid;
          } else {
            flag = valid;
          }
        });
      } else {
        flag = true;
      }
      return flag;
    },
  },
};
</script>
