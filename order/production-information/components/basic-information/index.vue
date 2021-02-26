<template>
  <div class="basic-information-page">
    <div class="basic-information">订单信息</div>
    <div class="basic-list">
      <p v-for="(item, index) in basicListName" :key="index + 'basicList'">
        <span>
          <span>{{ item.name1 }}</span>
          <em
            :class="
              basicListContent[item.code1] == '办理中'
                ? 'green'
                : basicListContent[item.code1] == '已完成'
                ? 'info'
                : basicListContent[item.code1] == '已退单'
                ? 'danger'
                : ''
            "
            >{{ basicListContent[item.code1] }}</em
          >
        </span>
        <span v-if="item.name2">
          <span>{{ item.name2 }}</span>
          <em>
            {{ basicListContent[item.code2] }}
          </em>
        </span>
      </p>
    </div>
    <div class="production-schedule">生产进度</div>
    <el-table :data="productionData">
      <el-table-column prop="mission" label="任务项" min-width="120"> </el-table-column>
      <el-table-column prop="status" label="状态" min-width="120">
        <template slot-scope="scope">
          <span
            :class="
              scope.row.status == '办理中'
                ? 'success'
                : scope.row.status == '已处理'
                ? 'info'
                : scope.row.status == '已暂停'
                ? 'danger'
                : 'warning'
            "
            >{{ scope.row.status }}</span
          >
        </template>
      </el-table-column>
      <el-table-column prop="plan" label="办理进度" min-width="200">
        <template slot-scope="scope">
          <el-progress :percentage="scope.row.plan" :color="progressColor"></el-progress>
        </template>
      </el-table-column>
      <el-table-column prop="deadline" label="截止时间" min-width="200"> </el-table-column>
      <el-table-column prop="transactor" label="办理人" min-width="160"> </el-table-column>
      <el-table-column prop="bizUser" label="办理商户" min-width="200"> </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { production_basic, production_plan } from 'api/order-details';
import { PRODUCTION_ORDER_DETAILS } from 'constants/constants';
export default {
  data() {
    return {
      progressColor: '#67C33A',
      //基本信息列表
      basicListName: [],
      basicListContent: {},
      //生产表格
      productionData: [],
    };
  },
  mounted() {
    this.getbasicListName();
    this.getbasicListContent();
    this.getProductionData(); //基本信息-生产进度
  },
  methods: {
    /**
     * @description 基本信息-订单信息
     */
    getbasicListName() {
      this.basicListName = Object.freeze(PRODUCTION_ORDER_DETAILS);
    },
    getbasicListContent() {
      production_basic().then((res) => {
        if (res.code === 200) {
          res = res.data;
          this.basicListContent = res[0];
        }
      });
    },
    /**
     * @description 基本信息-生产进度
     */
    getProductionData() {
      production_plan().then((res) => {
        if (res.code === 200) {
          res = res.data;
          this.productionData = res;
        }
      });
    },
  },
};
</script>
