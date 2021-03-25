<template>
  <div class="add-limit-page">
    <el-dialog
      title="关黑限流"
      :visible.sync="dialogVisible"
      width="620px"
      :close-on-click-modal="false"
      :close-on-press-escape="closeEscape"
      @closed="dialogColsed"
    >
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        label-width="94px"
        label-position="left"
        class="demo-ruleForm"
        :validate-on-rule-change="false"
      >
        <el-form-item label="限制人员：" prop="limitPerson">
          <drop-select
            ref="plannerRefs"
            key="planner"
            value-key="mchUserId"
            placeholder="输入姓名/工号/联系方式"
            type="plannerList"
            data-tid="addLimitPageSearchPlanner"
            @change="selectChangeHandle"
          ></drop-select>
        </el-form-item>
        <!-- 新增限制方式 -->
        <div
          v-for="(item, index) in ruleForm.limitWayList"
          :key="item.id"
          class="new-add-limit-way"
        >
          <el-form-item :label="'限制方式' + (index + 1) + '：'" required class="limit-way">
            <el-form-item
              :prop="'limitWayList.' + index + '.limitTypeName'"
              :rules="rules.limitTypeName"
            >
              <el-select
                v-model="item.limitTypeName"
                clearable
                value-key="code"
                placeholder="请选择限制方式"
                class="limit-way-select"
                data-tid="addLimitPageChangeLimitWay"
                @change="changeLimitWay($event, index)"
              >
                <el-option
                  v-for="option in limitWay"
                  :key="option.id"
                  :label="option.name"
                  :value="option"
                  :disabled="option.disabled"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              :prop="'limitWayList.' + index + '.limitProportion'"
              :rules="rules.limitProportion"
            >
              <el-input
                v-model="item.limitProportion"
                :disabled="item.limitTypeName.code == 'RULE_FLOW_LIMIT_COOPERATION'"
                clearable
                maxlength="3"
                placeholder="输入整数"
                class="limit-way-input"
              ></el-input>
            </el-form-item>
            <span>%</span>
            <span
              v-show="index !== 0"
              class="limit-way-button"
              data-tid="addLimitPageDelLimitWay"
              @click="delLimitWay(index, item)"
              >删除</span
            >
            <span
              v-show="
                ruleForm.limitWayList.length === index + 1 &&
                  ruleForm.limitWayList.length < limitWay.length
              "
              class="limit-way-button"
              data-tid="addLimitPageAddLimitWay"
              @click="addLimitWay"
              >新增</span
            >
          </el-form-item>
          <el-form-item
            label="周期选择："
            :prop="'limitWayList.' + index + '.limitTime'"
            :rules="rules.limitTime"
          >
            <el-date-picker
              v-model="item.limitTime"
              :picker-options="pickerOptions"
              type="daterange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              prefix-icon="el-icon-time"
            >
            </el-date-picker>
          </el-form-item>
        </div>
        <el-form-item label="备注：" prop="remark" class="form-remark">
          <el-input
            v-model="ruleForm.remark"
            type="textarea"
            placeholder="说说被限制的原因吧，对规划师有帮助哦！"
            maxlength="50"
            show-word-limit
            resize="none"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          plain
          :disabled="disButton"
          data-tid="addLimitPageCancelButton"
          @click="dialogVisible = false"
          >取消</el-button
        >
        <el-button
          type="primary"
          :disabled="disButton"
          data-tid="addLimitPageSubmitLimitWay"
          @click="submitLimitWay('ruleForm')"
          >添加</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import './index.scss';
import dayjs from 'dayjs';
import DropSelect from 'components/drop-select';
import { get_dictionary_data_by_parent_code } from 'api/common';
import { insert } from 'api/close-black-limit';
import validateCloseBlackCurrentLimit from 'utils/mixins/closeBlackCurrentLimit';
export default {
  components: {
    DropSelect,
  },
  mixins: [validateCloseBlackCurrentLimit],
  data() {
    return {
      delIndex: '',
      dialogVisible: false, //控制dialog开关
      selectLoading: false, //搜索输入框的加载
      disButton: false,
      closeEscape: true,
      //禁用当前时间之前的时间
      pickerOptions: {
        disabledDate(time) {
          const day = dayjs(time);
          return day < dayjs().subtract(1, 'day');
        },
      },
      limitWay: [], //数据字典
      disLimitWay: {},
      ruleForm: {
        limitPerson: '',
        limitWayList: [{ limitTypeName: '', limitProportion: '', limitTime: '' }],
        remark: '',
      },
      rules: {
        limitPerson: [{ required: true, message: '请选择限制人员', trigger: 'change' }],
        limitTypeName: [{ required: true, validator: this.checkLimitTypeName, trigger: 'change' }],
        limitProportion: [
          { required: true, validator: this.checkLimitProportion, trigger: 'change' },
        ],
        limitTime: [{ required: true, validator: this.checkLimitTime, trigger: 'change' }],
      },
    };
  },
  methods: {
    openModal() {
      this.getCode('RULE_FLOW_LIMIT_TYPE'); //请求数据字典，再加载列表
      this.dialogVisible = true;
    },
    /**
     * @description 监听关闭dialog时的数据
     */
    dialogColsed() {
      this.$refs.ruleForm.resetFields();
      this.ruleForm.limitWayList = [{ limitTypeName: '', limitProportion: '', limitTime: '' }];
      this.$refs.plannerRefs.resetInput();
    },
    /**
     * @description 添加关黑限流
     */
    submitLimitWay(formName) {
      this.delIndex = '';
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.disButton = true;
          this.closeEscape = false;
          const limitPerson = this.ruleForm.limitPerson;
          let params = {};
          params.limitWayList = [];
          this.ruleForm.limitWayList.forEach((item) => {
            let { limitTime, ...obj } = item;
            if (limitTime) {
              obj.startTime = dayjs(limitTime[0]).format('YYYY-MM-DD ') + '00:00:00';
              obj.endTime = dayjs(limitTime[1]).format('YYYY-MM-DD ') + '23:59:59';
              obj.limitType = obj.limitTypeName.code;
              obj.limitTypeName = obj.limitTypeName.name;
            }
            params.limitWayList.push(obj);
          });
          params.merchantId = limitPerson.mchDetailId;
          params.merchantName = limitPerson.recentCompany;
          params.plannerContact = limitPerson.phone;
          params.plannerId = limitPerson.mchUserId;
          params.plannerName = limitPerson.userName;
          params.plannerNo = limitPerson.userCenterNo;
          params.remark = this.ruleForm.remark?.trim();
          insert(params)
            .then((res) => {
              this.$emit('update-list');
              if (res.code === 200) {
                this.$message.success(res.message);
              } else {
                this.$message.warning(res.message);
              }
              this.dialogVisible = false;
              this.disButton = false;
              this.closeEscape = true;
            })
            .catch(() => {
              this.disButton = false;
              this.closeEscape = true;
            });
        } else {
          return false;
        }
      });
    },
    /**
     * @description 请求数据字典，再加载列表
     * @param {}
     */
    getCode(code) {
      let paramCode = {
        parentCode: code,
      };
      get_dictionary_data_by_parent_code(paramCode).then((res) => {
        if (res.code === 200) {
          const result = res.data;
          this.limitWay = Object.assign(result);
        }
      });
    },
    /**
     * @description 删除按钮
     */
    delLimitWay(index) {
      const val = this.disLimitWay.find(
        (item) => item.id === this.ruleForm.limitWayList[index].limitTypeName.id,
      );
      for (let i = 0; i < this.disLimitWay.length; i++) {
        if (this.disLimitWay[i] === val) {
          this.disLimitWay[i] = '';
        }
      }
      this.delIndex = index;
      this.ruleForm.limitWayList?.splice(index, 1);
      const disLimitWay = this.disLimitWay;
      if (disLimitWay[index]) {
        disLimitWay[index].disabled = false;
      }
      delete disLimitWay[index];
      let i = 0;
      for (let key in disLimitWay) {
        const value = disLimitWay[key];
        delete disLimitWay[key];
        disLimitWay[i] = value;
        i++;
      }
    },
    /**
     * @description 新增按钮
     */
    addLimitWay() {
      this.ruleForm.limitWayList.push({
        limitTypeName: '',
        limitProportion: '',
        limitTime: '',
      });
    },
    /**
     * @description 监听限制方式改变时
     * @param {}
     * @returns {}
     */
    changeLimitWay(val, index) {
      this.delIndex = '';
      const disLimitWay = this.disLimitWay;
      disLimitWay[index] = val;
      this.limitWay.forEach((item) => {
        item.disabled = false;
      });
      for (const key in disLimitWay) {
        const value = disLimitWay[key];
        if (value) {
          value.disabled = true;
        }
      }
      if (val.code == 'RULE_FLOW_LIMIT_COOPERATION') {
        this.ruleForm.limitWayList[index].limitProportion = 100;
      } else {
        this.ruleForm.limitWayList[index].limitProportion = '';
      }
    },
    /**
     * @description 限制人员搜索后选中方法
     */
    selectChangeHandle(val) {
      this.ruleForm.limitPerson = val;
    },
  },
};
</script>
