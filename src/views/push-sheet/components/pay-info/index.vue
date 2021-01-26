<template>
  <div class="pay">
    <div class="pay-title">
      <p class="titleWord">付款信息</p>
    </div>
    <div class="pay-content">
      <el-radio-group v-model="query.radio" data-tid="radioChange" @change="radioChange">
        <el-radio label="1">全款</el-radio>
        <el-radio label="2">分批</el-radio>
      </el-radio-group>
      <span class="pay-content-tip">（仅配置了分批的单个服务产品订单支持选择分批）</span>
      <div v-show="isAll" class="all">客户选择全款支付，无分批计划</div>
      <div v-show="!isAll" class="instalments">
        <div class="instalments-info">
          <p>分批金额：<span class="instalments-info-money">1920.00元</span></p>
          <p>
            分期数：
            <el-select
              v-model="query.value"
              placeholder="请选择"
              class="instalments-info-stages"
              data-tid="stagesChange"
              @change="stagesChange"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </p>
        </div>
        <div class="instalments-detail">
          <el-form
            ref="payInfoRuleRef"
            label-position="left"
            size="small"
            :model="setInstalmentsData"
          >
            <el-table
              v-loading="loading"
              :data="setInstalmentsData.instalmentsData"
              style="width: 100%; margin-top: 15px"
              :cell-style="rowClass"
              :header-cell-style="headClass"
            >
              <el-table-column prop="type" label="期数类型">
                <template slot-scope="scope">
                  {{ scope.row.name }}
                </template>
              </el-table-column>
              <el-table-column prop="price" label="金额（元）">
                <template slot-scope="scope">
                  <el-form-item
                    :prop="'instalmentsData.' + scope.$index + '.price'"
                    :rules="rules.price"
                  >
                    <el-input v-model.trim="scope.row.price" clearable></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="percent" label="百分比"> </el-table-column>
              <el-table-column prop="dateTime" label="最晚付款时间">
                <template slot-scope="scope">
                  <el-form-item
                    :prop="'instalmentsData.' + scope.$index + '.dateTime'"
                    :rules="rules.dateTime"
                  >
                    <el-date-picker
                      v-model="scope.row.dateTime"
                      type="date"
                      placeholder="年/月/日"
                      :picker-options="pickerOptions"
                      prefix-icon="el-icon-time"
                      data-tid="dateTimeChange"
                      @change="dateTimeChange"
                    >
                    </el-date-picker>
                  </el-form-item>
                </template>
              </el-table-column>
            </el-table>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { get_order_num } from 'api/push-sheet';
import dayjs from 'dayjs';
import './index.scss';
export default {
  data() {
    var validatePrice = (rule, value, callback) => {
      if (!value) {
        value = value.trim();
        console.log('rule', value);
        callback(new Error('请输入分期价格'));
      } else {
        callback();
      }
    };
    var validateDate = (rule, value, callback) => {
      if (!value) {
        value = value.trim();
        callback(new Error('请选择日期'));
        console.log('rule', value);
      } else {
        callback();
      }
    };
    return {
      loading: false,
      options: [
        {
          value: '2',
          label: '2',
        },
        {
          value: '3',
          label: '3',
        },
        {
          value: '4',
          label: '4',
        },
        {
          value: '5',
          label: '5',
        },
        {
          value: '6',
          label: '6',
        },
        {
          value: '7',
          label: '7',
        },
        {
          value: '8',
          label: '8',
        },
        {
          value: '9',
          label: '9',
        },
        {
          value: '10',
          label: '10',
        },
      ],
      //支付表格数据
      setInstalmentsData: {
        instalmentsData: [
          { name: '首款', price: '', percent: '50%', dateTime: '' },
          { name: '尾款', price: '', percent: '50%', dateTime: '' },
        ],
      },
      ruleForm: {},
      rules: {
        price: [{ validator: validatePrice, trigger: 'blur' }],
        dateTime: [{ validator: validateDate, trigger: 'change' }],
      },
      query: {
        value: 2, //分期数量
        radio: '1',
        select: [],
      },
      isAll: true, //是否全款
      /**
       * @description 时间选择处理
       */
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < dayjs().subtract(1, 'day');
        },
      },
      number: 0,
      stagesList: [], //分期选中的数据
    };
  },
  created() {
    this.get_order_num();
  },
  mounted() {},
  methods: {
    /**
     * @description 打印时间
     */
    dateTimeChange(val) {
      console.log(dayjs(val).format('YYYY-MM-DD HH:mm'));
    },
    radioChange(val) {
      let num;
      if (val == 1) {
        num = true;
        this.isAll = true;
        sessionStorage.setItem('isall', 1);
        this.$refs.payInfoRuleRef.resetFields();
      } else {
        num = false;
        this.loading = true;
        this.isAll = false;
        setTimeout(() => {
          this.loading = false;
        }, 1000);
        sessionStorage.setItem('isall', 2);
      }

      this.$store.commit('pushSheet/editBusinessCode', { index: 2, flag: num });
    },
    /**
     * @description 分期选中时处理表格
     */
    stagesChange(val) {
      this.stagesList = this.setInstalmentsData.instalmentsData;
      this.stagesList.splice(1, this.number);
      const num = val - 2;
      this.number = num;
      for (let i = 0; i < num; i++) {
        let obj = { name: '中期款', price: '', percent: '', dateTime: '' };
        this.stagesList.splice(i + 1, 0, obj);
      }
      const percent = (100 / Number(val)).toFixed(2) + '%';
      this.stagesList.forEach((item) => {
        item.percent = percent;
      });
      // console.log(this.stagesList, 'this.stagesList');
    },
    /**
     * @description
     * @param {}
     * @returns {}
     */
    get_order_num() {
      get_order_num()
        .then((res) => {
          const { code, data, message } = res;
          if (code == 200) {
            console.log(data, '分期数');
            this.validityOptions = data;
          } else {
            this.$message.warning(message);
          }
        })
        .catch(() => {});
    },
    // 校验数据
    validateForm() {
      let flag = false;
      let ref = this.$refs.payInfoRuleRef;
      if (!ref) return;
      // console.log(this, 'payInfoRuleRef', this.$refs.payInfoRuleRef);
      if (Array.isArray(ref)) {
        ref = ref[0];
      }
      if (this.query.radio == 2) {
        ref.validate((valid) => {
          // console.log(valid, 'payinfo', this.$refs.payInfoRuleRef);
          if (valid) {
            flag = valid;
          } else {
            flag = valid;
          }
        });
      } else {
        flag = true;
      }
      console.log(flag, 'payinfosflag');
      return flag;
    },
    // 表头样式设置
    headClass() {
      return 'text-align: left;background:#f2f2f2;';
    },
    // 表格样式设置
    rowClass() {
      return 'text-align: left;';
    },
  },
};
</script>
