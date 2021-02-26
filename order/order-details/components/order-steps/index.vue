<template>
  <div class="steps">
    <el-steps :active="active" align-center>
      <el-step title="提交订单" description="2020-07-19 15:43:23">
        <i v-if="active >= 0" slot="icon">
          <svg-icon
            key="iconfont-qds-crm-inprogress"
            size="16px"
            ava-class="inprogress"
            icon="icon-inprogress"
          />
        </i>
      </el-step>
      <el-step title="支付订单" :description="payOrder">
        <i v-if="active >= 1" slot="icon">
          <svg-icon
            key="iconfont-qds-crm-inprogress"
            size="16px"
            ava-class="inprogress"
            icon="icon-inprogress"
          />
        </i>
        <i v-else slot="icon">
          <svg-icon
            key="iconfont-qds-crm-inprogress"
            size="10px"
            ava-class="notinprogress"
            icon="icon-notinprogress"
          />
        </i>
      </el-step>
      <el-step title="处理中" :description="inHand">
        <i v-if="active >= 2" slot="icon">
          <svg-icon
            key="iconfont-qds-crm-inprogress"
            size="16px"
            ava-class="inprogress"
            icon="icon-inprogress"
          />
        </i>
        <i v-else slot="icon">
          <svg-icon
            key="iconfont-qds-crm-inprogress"
            size="10px"
            ava-class="notinprogress"
            icon="icon-notinprogress"
          />
        </i>
      </el-step>
      <el-step title="订单完成" :description="orderSuccess">
        <i v-if="active >= 3" slot="icon">
          <svg-icon
            key="iconfont-qds-crm-inprogress"
            size="16px"
            ava-class="inprogress"
            icon="icon-inprogress"
          />
        </i>
        <i v-else slot="icon">
          <svg-icon
            key="iconfont-qds-crm-inprogress"
            size="10px"
            ava-class="notinprogress"
            icon="icon-notinprogress"
          />
        </i>
      </el-step>
      <el-step title="完成评价" :description="evaluateSuccess">
        <i v-if="active >= 4" slot="icon">
          <svg-icon
            key="iconfont-qds-crm-inprogress"
            size="16px"
            ava-class="inprogress"
            icon="icon-inprogress"
          />
        </i>
        <i v-else slot="icon">
          <svg-icon
            key="iconfont-qds-crm-inprogress"
            size="10px"
            ava-class="notinprogress"
            icon="icon-notinprogress"
          />
        </i>
      </el-step>
    </el-steps>
  </div>
</template>
<script>
import './index.scss';
import SvgIcon from 'components/svg-icon';
export default {
  components: {
    SvgIcon,
  },
  props: {
    orderStatus: {
      type: String,
      default: '',
    },
    payStatus: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      active: 0,
      payOrder: '', //支付订单
      inHand: '', //处理中
      orderSuccess: '', //订单完成
      evaluateSuccess: '', //完成评价
    };
  },
  watch: {
    orderStatus() {
      if (this.orderStatus == '未付款') {
        this.active = 0;
        this.payOrder = '未支付';
      }
      if (this.orderStatus == '已支付') {
        this.active = 1;
        this.payOrder = '2020-07-20 17:43:55';
      }
      if (this.orderStatus == '待收货、待确认') {
        this.active = 2;
        this.payOrder = '2020-07-20 17:43:55';
        this.inHand = '2020-07-22 12:23:25';
      }
      if (this.orderStatus == '已收货/已确认') {
        this.active = 3;
        this.payOrder = '2020-07-20 17:43:55';
        this.inHand = '2020-07-22 12:23:25';
        this.orderSuccess = '2020-07-22 20:20:21';
      }
      if (this.orderStatus == '已完成评价/系统自动评价') {
        this.active = 4;
        this.payOrder = '2020-07-20 17:43:55';
        this.inHand = '2020-07-22 12:23:25';
        this.orderSuccess = '2020-07-22 20:20:21';
        this.evaluateSuccess = '2020-07-22 21:00:00';
      }
    },
  },
};
</script>
