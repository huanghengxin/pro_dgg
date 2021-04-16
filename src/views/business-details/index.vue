<template>
  <div v-if="permissionInfo" class="business-details">
    <div class="business-details_left">
      <follow-records :business-id="businessId" :from="from" />
      <business-demand-info :business-id="businessId" :from="from" />
      <BusinessRole :business-id="businessId" :from="from" />
    </div>
    <div class="business-details_right">
      <business-info :business-id="businessId" :from="from"></business-info>
      <more-handle :business-id="businessId" :from="from" />
      <!-- <link-company :business-id="businessId" /> -->
    </div>
  </div>
</template>

<script>
import './index.scss';
import FollowRecords from './components/follow-records/index.vue';
import BusinessInfo from './components/business-info';
import BusinessDemandInfo from './components/business-demand-info';
import MoreHandle from './components/more-handle/index.js';
import BusinessRole from './components/business-role/index';
// import LinkCompany from './components/link-company';
import { getQueryString } from 'utils/helper';
import { get_menu_permission } from 'api/cooperation-in-page';
export default {
  name: 'MyBusinessBusinessDetails',
  components: {
    BusinessInfo,
    MoreHandle,
    // LinkCompany,
    FollowRecords,
    BusinessDemandInfo,
    BusinessRole,
  },
  inject: ['reload'],
  provide() {
    return {
      permissionType: this.permissionInfo,
    };
  },
  data() {
    return {
      businessId: '',
      from: '',
      permissionInfo: {},
    };
  },
  watch: {
    //服务主应用抢单，抢单成功后查看商机如果在当前页面路由没有变化参数变化后不刷新
    '$route.query'(newValue) {
      if (this.businessId === newValue.businessId) return;
      this.reload();
    },
  },
  created() {
    let query = new getQueryString();
    this.businessId = query?.businessId;
    this.from = query?.from;
    console.log(this.from, 'this.from');
    this.getMenuPermission(this.businessId);
  },
  methods: {
    //获取操作合作联盟操作权限
    getMenuPermission(bizId) {
      const params = { bizId };
      get_menu_permission(params).then(({ code, data }) => {
        if (code === 200) {
          this.permissionInfo.info = data;
        }
      });
    },
  },
};
</script>
