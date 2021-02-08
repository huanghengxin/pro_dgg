<template>
  <div class="business-details">
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
export default {
  name: 'BusinessDetails',
  components: {
    BusinessInfo,
    MoreHandle,
    // LinkCompany,
    FollowRecords,
    BusinessDemandInfo,
    BusinessRole,
  },
  data() {
    return {
      businessId: '',
      from: '',
    };
  },
  created() {
    let query = new getQueryString();
    this.businessId = query?.businessId;
    this.from = query?.from;
  },
};
</script>
