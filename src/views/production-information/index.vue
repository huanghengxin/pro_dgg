<template>
  <div class="production-information-page">
    <div class="title">
      <span>生产单编号：</span>
      <span>SC742387489327</span>
      <span>当前服务状态：</span>
      <el-tag type="success">办理中(正常)</el-tag>
    </div>
    <div class="content">
      <el-tabs v-model="activeName" class="content-tabs">
        <el-tab-pane label="基本信息" name="first">
          <basic-information></basic-information>
        </el-tab-pane>
        <el-tab-pane label="底单信息" name="second">
          <single-information></single-information>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import './index.scss';
import BasicInformation from './components/basic-information';
import SingleInformation from './components/single-information';
export default {
  components: {
    BasicInformation,
    SingleInformation,
  },
  data() {
    return {
      activeName: 'first',
    };
  },
};
</script>
