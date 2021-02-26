<template>
  <div class="add-limit-page">
    <el-dialog
      title="关黑限流"
      :visible.sync="dialogVisible"
      width="620px"
      :close-on-click-modal="false"
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
          <el-select
            v-model="ruleForm.limitPerson"
            filterable
            value-key="mchUserId"
            remote
            placeholder="请输入"
            :remote-method="remoteMethod"
            :loading="selectLoading"
            clearable
            @change="selectChangeHandle"
          >
            <el-option
              v-for="people in plannerList"
              :key="people.mchUserId"
              :label="people.userName + '（' + people.userCenterNo + '）'"
              :value="people"
            >
            </el-option>
          </el-select>
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
                @change="changeLimitWay(index)"
              >
                <el-option
                  v-for="option in limitWay"
                  :key="option.id"
                  :label="option.name"
                  :value="option"
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
            <span v-show="index !== 0" class="limit-way-button" @click="delLimitWay(index)"
              >删除</span
            >
            <span
              v-show="
                ruleForm.limitWayList.length === index + 1 && ruleForm.limitWayList.length < 3
              "
              class="limit-way-button"
              @click="addLimitWay()"
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
            placeholder="说说这个客户的情况吧，对接收的规划师有帮助哦"
            maxlength="50"
            show-word-limit
            resize="none"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button plain @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitLimitWay('ruleForm')">添加</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import './index.scss';
import dayjs from 'dayjs';
import store from 'storejs';
import { get_dictionary_data_by_parent_code } from 'api/common';
import { insert, get_plat_form_user_info_list } from 'api/close-black-limit';
import validateCloseBlackCurrentLimit from 'utils/mixins/closeBlackCurrentLimit';
export default {
  mixins: [validateCloseBlackCurrentLimit],
  data() {
    return {
      delIndex: '',
      dialogVisible: false, //控制dialog开关
      mchDetailId: '', //商户ID
      selectLoading: false, //搜索输入框的加载
      plannerList: [], //远程搜索人员名单
      //禁用当前时间之前的时间
      pickerOptions: {
        disabledDate(time) {
          const day = dayjs(time);
          return day < dayjs().subtract(1, 'day');
        },
      },
      limitWay: [],
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
  created() {
    this.mchDetailId = store.get('mchInfo')?.mchDetailId || '';
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
      this.plannerList = [];
    },
    /**
     * @description 添加关黑限流
     */
    submitLimitWay(formName) {
      this.delIndex = '';
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let params = {};
          params.limitWayList = [];
          this.ruleForm.limitWayList.forEach((item, index) => {
            let { limitTime, ...obj } = item;
            if (limitTime) {
              obj.startTime = dayjs(limitTime[0]).format('YYYY-MM-DD ') + '00:00:00';
              obj.endTime = dayjs(limitTime[1]).format('YYYY-MM-DD ') + '23:59:59';
              obj.limitType = obj.limitTypeName.code;
              obj.limitTypeName = obj.limitTypeName.name;
            }
            params.limitWayList.push(obj);
            params.merchantId = this.ruleForm.limitPerson.mchDetailId;
            params.merchantName = this.ruleForm.limitPerson.recentCompany;
            params.plannerContact = this.ruleForm.limitPerson.phone;
            params.plannerId = this.ruleForm.limitPerson.mchUserId;
            params.plannerName = this.ruleForm.limitPerson.userName;
            params.plannerNo = this.ruleForm.limitPerson.userCenterNo;
            params.remark = this.ruleForm.remark;
          });
          insert(params).then((res) => {
            this.$emit('add-limit');
            if (res.code === 200) {
              this.$message.success(res.message);
            } else {
              this.$message.warning(res.message);
            }
            this.dialogVisible = false;
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
        if (res.code === 200) this.limitWay = Object.freeze(res.data);
      });
    },
    /**
     * @description 删除按钮
     */
    delLimitWay(index) {
      this.delIndex = index;
      this.ruleForm.limitWayList?.splice(index, 1);
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
    changeLimitWay(index) {
      this.delIndex = '';
      console.log(this.ruleForm.limitWayList[index].limitTypeName.code);
      if (this.ruleForm.limitWayList[index].limitTypeName.code == 'RULE_FLOW_LIMIT_COOPERATION') {
        this.ruleForm.limitWayList[index].limitProportion = 100;
      } else {
        this.ruleForm.limitWayList[index].limitProportion = '';
      }
    },
    /**
     * @description 远程搜索方法
     */
    remoteMethod(keyword) {
      if (!keyword.trim()) return;
      this.selectLoading = true;
      const params = {
        start: 1,
        limit: 1000,
        userCenterStatus: -1,
        userCenterAuthStatus: '',
        status: -1,
      };
      const regPhone = /^1[3-9]\d{9}$/;
      if (regPhone.test(keyword)) {
        params.phone = keyword;
      } else {
        params.searchKey = keyword;
      }
      this.getPeopleList(params);
    },
    /**
     * @description 限制人员搜索后选中方法
     */
    selectChangeHandle(val) {
      if (val === '') {
        this.plannerList = [];
      }
    },
    /**
     * @description 获取限制人员名单
     */
    getPeopleList(params) {
      get_plat_form_user_info_list(params)
        .then((res) => {
          if (res.code === 200) {
            res = res.data;
            this.plannerList = res.records || [];
            this.selectLoading = false;
          } else {
            this.$message.warning(res.message);
          }
        })
        .catch(() => (this.selectLoading = false));
    },
  },
};
</script>
