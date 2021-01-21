<template>
  <div class="order-list-page">
    <!-- 头部步骤条 -->
    <order-steps :order-status="orderStatus" :pay-status="payStatus"></order-steps>
    <!-- 内容 -->
    <div class="content">
      <!-- 订单状态栏 -->
      <div class="content-top">
        <div>
          <span class="top-name">订单编号：</span>
          <span>D2011212000001</span>
        </div>
        <div class="top-middle">
          <span class="top-name">订单状态：</span>
          <el-tag
            :type="
              orderStatus == '未付款'
                ? 'danger'
                : orderStatus == '已支付'
                ? 'info'
                : orderStatus == '待收货、待确认'
                ? 'warning'
                : orderStatus == '已收货/已确认'
                ? 'info'
                : 'success'
            "
            :hit="tagBorder"
            >{{ orderStatus }}</el-tag
          >
        </div>
        <div>
          <span class="top-name">支付状态：</span>
          <el-tag
            :type="
              payStatus == '未付款'
                ? 'danger'
                : payStatus == '部分付款'
                ? 'warning'
                : payStatus == '处理中'
                ? 'success'
                : 'info'
            "
            :hit="tagBorder"
            >{{ payStatus }}</el-tag
          >
        </div>
      </div>
      <el-tabs v-model="activeName" class="content-tabs">
        <!-- 订单信息 -->
        <el-tab-pane label="订单信息" name="first">
          <order-information></order-information>
        </el-tab-pane>
        <!-- 财务信息 -->
        <el-tab-pane label="财务信息" name="second">
          <money-information></money-information>
        </el-tab-pane>
        <!-- 生产信息 -->
        <el-tab-pane label="生产信息" name="third">
          <production-information></production-information>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import { order_details_order_information } from 'api/order-details';
import './index.scss';
import OrderSteps from './components/order-steps';
import OrderInformation from './components/order-information';
import MoneyInformation from './components/money-information';
import ProductionInformation from './components/production-information';
export default {
  components: {
    OrderSteps,
    OrderInformation,
    MoneyInformation,
    ProductionInformation,
  },
  data() {
    return {
      tagBorder: true, //是否有边框描边
      activeName: 'first',
      orderStatus: '',
      payStatus: '',
    };
  },
  mounted() {
    this.getStatus(); //订单状态、支付状态
  },
  methods: {
    /**
     * @description 订单状态/支付状态
     */
    getStatus() {
      order_details_order_information().then((res) => {
        if (res.code === 200) {
          res = res.data;
          res.forEach((item) => {
            this.orderStatus = item.orderStatus;
            this.payStatus = item.payStatus;
          });
        }
      });
    },
  },
};
</script>
