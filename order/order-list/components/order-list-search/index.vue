<template>
  <div class="order-list-search">
    <el-tabs v-model="activeName">
      <el-tab-pane label="全部订单" name="first">
        <all-orders :is-more-input="isMoreInput"></all-orders>
      </el-tab-pane>
      <el-tab-pane label="未付款" name="second">配置管理</el-tab-pane>
      <el-tab-pane label="处理中" name="third">角色管理</el-tab-pane>
      <el-tab-pane label="已完成" name="fourth">定时任务补偿</el-tab-pane>
      <el-tab-pane label="已取消" name="five">定时任务补偿</el-tab-pane>
    </el-tabs>
    <div class="order-list-more" @click="showMoreInput">
      <span class="order-list-more-content">
        <span>{{ isMoreInput ? '收起' : '展开' }}</span>
        <i
          :class="['el-icon-d-arrow-right', 'arrow_right', isMoreInput ? 'icon-up' : 'icon-down']"
        ></i>
      </span>
    </div>
  </div>
</template>
<script>
import AllOrders from './components/all-orders';
import './index.scss';
export default {
  components: {
    AllOrders,
  },
  data() {
    return {
      activeName: 'first',
      isMoreInput: false,
    };
  },
  methods: {
    /**
     * @description 展示/收起更多搜索框
     */
    showMoreInput() {
      if (this.isMoreInput == false) {
        this.isMoreInput = true;
      } else {
        this.isMoreInput = false;
      }
    },
  },
};
</script>
