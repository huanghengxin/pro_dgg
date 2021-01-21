<template>
  <div v-loading="loading" class="link-company">
    <div class="title">
      <span>关联企业</span>
      <div
        :class="{ 'title-button': true, disable: companyList && companyList.length > 9 }"
        @click="handleClick"
      >
        <i class="iconfont-qds-crm icon-plus"></i><span>新增</span>
      </div>
    </div>
    <div v-if="companyList && companyList.length > 0" @click="buttonHandleClick">
      <div v-for="(item, i) in companyList" :key="item.companyId" class="company-item">
        <show-tooltip :text="item.name || ''" :width="332"></show-tooltip>
        <div class="company-item_button">
          <span>{{ item.legalRep || '' }}</span>
          <span :data-id="item.companyId">查一下</span>
          <span @click="deleteRelevance(item.id, i)">解除关联</span>
        </div>
      </div>
    </div>
    <svg-icon
      v-else
      key="item-warp"
      type="nodata"
      icon="icon-icon_nodata"
      :text-content="textContent"
    />
    <ding-qi-cha ref="dingQiChaRef" />
  </div>
</template>

<script>
import './index.scss';
import DingQiCha from 'components/ding-qi-cha';
import ShowTooltip from 'components/show-tooltip';
import { find_companys_by_customerid, remove_customer_company } from 'api/business-details';
import SvgIcon from 'components/svg-icon';
export default {
  name: 'LinkCompany',
  components: {
    DingQiCha,
    ShowTooltip,
    SvgIcon,
  },
  props: {
    businessId: { type: String, default: '' },
  },
  data() {
    return {
      textContent: '暂无关联企业',
      companyList: [],
      loading: false,
      customerId: '',
    };
  },
  created() {
    if (!this.customerId) {
      this.$eventBus.$on('get-business-info', (value) => {
        if (value.customerId === this.customerId) return;
        this.customerId = value.customerId;
        const params = {
          customerId: this.customerId,
        };
        this.getCompanyList(params);
      });
    }
  },
  beforeDestroy() {
    this.$eventBus.$off('get-business-info');
  },
  mounted() {},
  methods: {
    handleClick() {
      if (this.companyList && this.companyList.length > 9) return;
      this.$refs.dingQiChaRef.openModal();
    },
    /**
     * @description 点击查一下和解除关联
     * @param {Event} 事件对象
     */
    buttonHandleClick(e) {
      const dataset = e.target.dataset;
      const id = dataset.id;
      if (!id) return;
    },
    getCompanyList(params) {
      this.loading = true;
      find_companys_by_customerid(params)
        .then((res) => {
          if (res.code === 200) {
            this.companyList = res.data;
            this.loading = false;
          } else {
            this.$message.warning(res.message);
          }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    /**
     * @description 解除关联
     */
    deleteRelevance(enterpriseId, index) {
      this.loading = true;
      const params = {
        id: enterpriseId,
      };
      remove_customer_company(params).then((res) => {
        const list = this.companyList.splice(index, 1);
        this.$set(this.companyList, list);
        this.loading = false;
      });
    },
  },
};
</script>

<style></style>
