<template>
  <div class="production-information-page">
    <div class="production-title">订单信息</div>
    <el-table :data="productionTable" style="width: 100%" class="production-list">
      <el-table-column prop="productionOrder" label="生产单编号">
        <template slot-scope="scope">
          <span class="finance-list-ticket-span">{{ scope.row.productionOrder }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="productionState" label="状态">
        <template slot-scope="scope">
          <span
            :class="
              scope.row.productionState == '办理中'
                ? 'success'
                : scope.row.productionState == '已完成'
                ? 'info'
                : 'warning'
            "
            >{{ scope.row.productionState }}</span
          >
        </template>
      </el-table-column>
      <el-table-column prop="productionMessage" label="产品信息">
        <template slot-scope="scope">
          <div
            v-for="(item, index) in scope.row.productionMessage.split(';')"
            :key="index + 'productionMessage'"
            class="order-product-name"
          >
            <p>{{ item }}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="productionHome" label="企管家"> </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { order_details_production_table } from 'api/order-details';
export default {
  data() {
    return {
      // 生产单列表表格
      productionTable: [],
    };
  },
  mounted() {
    this.getProductionTable(); //生产信息_订单信息
  },
  methods: {
    /**
     * @description 生产信息_订单信息
     */
    getProductionTable() {
      order_details_production_table().then((res) => {
        if (res.code === 200) {
          res = res.data;
          this.productionTable = res;
        }
      });
    },
  },
};
</script>
