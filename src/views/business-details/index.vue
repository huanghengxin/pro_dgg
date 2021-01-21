<template>
  <div class="business-details">
    <div class="business-details_left">
      <follow-records :business-id="businessId" />
      <business-demand-info :business-id="businessId" />
    </div>
    <div class="business-details_right">
      <business-info :business-id="businessId"></business-info>
      <more-handle :business-id="businessId" />
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
  },
  data() {
    return {
      businessId: '',
    };
  },
  created() {
    let query = new getQueryString();
    this.businessId = query?.businessId;
  },
};
</script>
