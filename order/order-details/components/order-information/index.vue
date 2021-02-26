<template>
  <div class="order-information-page">
    <div class="order-title">订单信息</div>
    <div class="order-list">
      <p v-for="(item, index) in orderListName" :key="index + 'orderList'">
        <span>
          <span>{{ item.name1 }}</span>
          <em>{{ orderListContent ? orderListContent[item.code1] : '-' }}</em>
        </span>
        <span v-if="item.name2">
          <span>{{ item.name2 }}</span>
          <em>{{ orderListContent ? orderListContent[item.code2] : '-' }}</em>
        </span>
      </p>
    </div>
    <div class="order-title">订单产品</div>
    <div class="order-product">
      <div class="order-product-top">
        <div>
          <span>产品合计金额：</span>
          <span class="product-price">￥6000.00</span>
        </div>
        <div class="top-middle">
          <span>产品优惠：</span>
          <span class="product-price">-￥100.00</span>
        </div>
        <div>
          <span>订单金额：</span>
          <span class="product-price">￥5900.00</span>
        </div>
      </div>
      <el-table :data="orderTable" style="width: 100%">
        <el-table-column prop="productId" label="产品编号" min-width="150">
          <template slot-scope="scope">
            <span
              v-for="(item, index) in scope.row.productId.split(',')"
              :key="index + 'productName'"
            >
              <span>{{ item }}</span>
              <el-tooltip
                v-show="scope.row.relevance == '订单标识：关联'"
                effect="dark"
                placement="top-start"
              >
                <div slot="content">{{ scope.row.orderNumber }}<br />{{ scope.row.relevance }}</div>
                <i class="el-icon-warning"></i>
              </el-tooltip>
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="productName" label="产品名称" min-width="240">
          <template slot-scope="scope">
            <div
              v-for="(item, index) in scope.row.productName.split('。')"
              :key="index + 'productName'"
              class="order-product-name"
            >
              <p>{{ item }}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="taskItem" label="任务项" min-width="180">
          <template slot-scope="scope">
            <div
              v-for="(item, index) in scope.row.taskItem.split(',')"
              :key="index + 'taskItem'"
              class="order-product-item"
            >
              <p>{{ item }}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="productArea" label="产品地区" min-width="80"> </el-table-column>
        <el-table-column prop="productMoney" label="产品金额" min-width="100"> </el-table-column>
        <el-table-column prop="productCount" label="数量" min-width="80"> </el-table-column>
        <el-table-column prop="productDiscounts" label="产品优惠" min-width="80"> </el-table-column>
        <el-table-column prop="productRelevance" label="关联产品" min-width="150">
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { order_details_order_information, order_details_order_product } from 'api/order-details';
import { ORDER_DETAILS_ORDER_INFORMATION } from 'constants/constants';
export default {
  data() {
    return {
      // 订单信息列表
      orderListName: [], //订单信息列表名称
      orderListContent: {}, //订单信息列表内容
      // 订单产品表格
      orderTable: [],
    };
  },
  mounted() {
    this.getOrderListContent(); //订单信息列表内容
    this.getOrderListName(); //订单信息列表名称
    this.getOrderProductTable(); //订单产品表格
  },
  methods: {
    /**
     * @description 订单信息列表
     */
    getOrderListContent() {
      order_details_order_information().then((res) => {
        if (res.code === 200) {
          res = res.data;
          this.orderListContent = res[0];
        }
      });
    },
    getOrderListName() {
      this.orderListName = Object.freeze(ORDER_DETAILS_ORDER_INFORMATION);
    },
    /**
     * @description 订单产品表格
     */
    getOrderProductTable() {
      order_details_order_product().then((res) => {
        if (res.code === 200) {
          res = res.data;
          this.orderTable = res;
        }
      });
    },
  },
};
</script>
