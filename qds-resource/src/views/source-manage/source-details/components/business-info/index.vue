<template>
  <div v-loading="loading" class="business-info">
    <div class="name-info business-info_item">
      <show-tooltip :text="businessInfo.customerName || ''" :width="262"></show-tooltip>
      <span v-if="businessInfo.noAttention == '1'" class="name-info_attention">暂不关注</span>
    </div>
    <div class="business-info_item sex-info">
      <span v-if="businessInfo.customerSex">{{ businessInfo.customerSex == 1 ? '男' : '女' }}</span>
      <span v-else>未选择性别</span>
      <el-rate
        :value="Number(businessInfo.intentionLevel) || 0"
        :max="Number(businessInfo.intentionLevel) || 0"
        disabled
        disabled-void-color="transparent"
      >
      </el-rate>
    </div>
    <div class="business-info_item record-info">
      <show-tooltip
        v-if="businessInfo.comment"
        :tooltip-line-clamp="2"
        :text="businessInfo.comment || ''"
        :width="268"
      ></show-tooltip>
      <span v-else>暂无备注</span>
      <i
        v-show="canEdit"
        class="iconfont-qds-crm icon-offlinesign"
        data-tid="infoShowModalHandleClick"
        @click="
          showModalHandleClick('editRemarkRef', {
            comment: businessInfo.comment,
            id: businessInfo.id,
          })
        "
      ></i>
    </div>
    <div class="business-info_item-small">
      <span class="item-label">商机编号：</span><span>{{ businessInfo.bizNo || '-' }}</span>
    </div>
    <div class="business-info_item-small phone-info">
      <span class="item-label">手机号码：</span>
      <div v-if="businessInfo.customerPhone">
        <div>
          <span>
            {{ businessInfo.customerPhone || '-' }}
          </span>
        </div>
        <div v-for="item in businessInfo.relation" :key="item.id" class="phone-info_sen">
          <span>
            {{ item.contactNo || '-' }}
          </span>
        </div>
      </div>
      <span v-else>-</span>
    </div>
    <div class="business-info_item-small require-info">
      <!-- 有效且未签单的客户需求 -->
      <span class="item-label">客户需求：</span>
      <show-tooltip
        v-if="businessInfo.requireName"
        key="require-info"
        :text="businessInfo.requireName.replace(/(,+)/g, '、') || '-'"
        :width="260"
      ></show-tooltip>
      <div v-else key="require-info">-</div>
    </div>
    <div class="business-info_item-small">
      <span class="item-label">来源平台：</span>
      <span key="time-info">
        {{ (getWayMap && getWayMap[businessInfo.sourceSyscode]) || '-' }}
      </span>
    </div>
    <div class="business-info_item-small">
      <span class="item-label">一级来源渠道：</span>
      <span>
        {{ (getWayMap && getWayMap[businessInfo.firstSource]) || '-' }}
      </span>
    </div>
    <div class="business-info_item-small">
      <span class="item-label">二级来源渠道：</span>
      <span>
        {{ (getWayMap && getWayMap[businessInfo.secondSource]) || '-' }}
      </span>
    </div>
    <div class="business-info_item-small require-info">
      <span class="item-label">来源URL：</span>
      <span>
        <show-tooltip
          key="business-url"
          :text="businessInfo.sourceUrl || '-'"
          :width="260"
        ></show-tooltip>
      </span>
    </div>
    <div class="business-info_item-small require-info">
      <span class="item-label">关键词：</span>
      <span>
        <show-tooltip
          key="business-url"
          :text="businessInfo.keyword || '-'"
          :width="260"
        ></show-tooltip>
      </span>
    </div>
    <div class="business-info_item-small require-info">
      <span class="item-label">录入人：</span>
      <span>
        {{ businessInfo.createrName || '-' }}
      </span>
    </div>
    <div class="business-info_item-small require-info">
      <span class="item-label">录入时间：</span>
      <span>
        {{ businessInfo.createTime || '-' }}
      </span>
    </div>
    <div class="business-info_item-small require-info">
      <span class="item-label">客户属性：</span>

      <span v-if="businessInfo.customerAttribute" class="customer-property">
        <show-tooltip
          v-if="getCustomerAttr(businessInfo.customerAttribute)"
          :text="businessInfo.customerAttribute || '-'"
          :tooltip-line-clamp="2"
          :width="260"
        ></show-tooltip>
        <template v-else>
          <div
            v-for="(item, index) in businessInfo.customerAttribute.slice(
              0,
              moreIcon ? 2 : undefined,
            )"
            :key="index"
          >
            <span> {{ item }}</span>
          </div>
          <i
            :class="{
              'iconfont-qds-crm': true,
              'icon-downoutline': businessInfo.customerAttribute.length > 3 && moreIcon,
              'icon-upoutline': businessInfo.customerAttribute.length > 3 && !moreIcon,
            }"
            @click="showMoreAttr"
          ></i>
        </template>
      </span>
      <span v-else>-</span>
    </div>
    <div class="business-info_item-small phone-info">
      <span class="item-label">备用联系人：</span>
      <show-tooltip
        v-if="businessInfo.bakRelation && businessInfo.bakRelation.contactName"
        key="business-bakRelation-show"
        :text="contactName"
        :width="260"
      ></show-tooltip>
      <span
        v-else-if="canEdit"
        key="business-bakRelation-button"
        :class="{
          'iconfont-qds-crm': true,
          'icon-plus': true,
        }"
        data-tid="infoAddStandbyPerson"
        @click="addStandbyPerson"
        ><em>新增</em></span
      >
      <span v-else key="business-bakRelation-else">-</span>
    </div>
    <div class="business-info_item-small phone-info">
      <span class="item-label">备用联系号码：</span>
      <span>{{ businessInfo.bakRelation ? businessInfo.bakRelation.contactNo || '-' : '-' }}</span>
    </div>
    <edit-remark ref="editRemarkRef" @set-remark="setRemark" />
    <add-standby ref="addStandbyContact"></add-standby>
  </div>
</template>

<script>
import './index.scss';
import ShowTooltip from 'components/show-tooltip';
import EditRemark from '../edit-remark/index.vue';
import AddStandby from '../add-standby-contact/index.vue';
import { get_business_info } from 'api/source-details';
import { find_tree_book_list } from 'api/common';
import callMixins from 'utils/mixins/callMixins';
import dayjs from 'dayjs';
import stores from 'storejs';
export default {
  name: 'BusinessInfo',
  components: {
    ShowTooltip,
    EditRemark,
    AddStandby,
  },
  filters: {
    filterSecond(val) {
      return val && dayjs(val).isValid() ? dayjs(val).format('YYYY-MM-DD HH:mm') : '';
    },
  },
  mixins: [callMixins],
  inject: ['permissionType'],
  props: {
    businessId: {
      type: String,
      default: '',
    },
    from: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      businessInfo: {},
      loading: false,
      busInfo: {},
      businessInfoUserId: undefined,
      getWayMap: {},
      canEdit: '',
      moreIcon: true,
    };
  },
  computed: {
    contactName() {
      const businessInfo = this.businessInfo;
      const sex =
        businessInfo.bakRelation.sex == 1
          ? '（男）'
          : businessInfo.bakRelation.sex == 0
          ? '（女）'
          : '';
      return businessInfo.bakRelation.contactName + sex;
    },
    isCurUser() {
      return stores.get('mchInfo')?.mchUserId == this.businessInfoUserId;
    },
  },
  created() {
    if (this.businessId) {
      this.getBusinessInfo();
    }
  },
  mounted() {
    this.$eventBus.$on('edit-on-submit_update-business-info', () => {
      this.getBusinessInfo();
    });
  },
  beforeDestroy() {
    this.$eventBus.$off('edit-on-submit_update-business-info');
  },
  methods: {
    addStandbyPerson() {
      this.$refs.addStandbyContact.openModal(this.businessInfo);
    },
    setRemark() {
      this.getBusinessInfo();
    },
    /**
     * @description 编辑备注 查看号码
     */
    showModalHandleClick(ref, param) {
      this.$refs[ref].openModal(param);
    },
    /**
     * @description 获取商机基本信息
     */
    async getBusinessInfo() {
      try {
        this.loading = true;
        const params = { bizId: this.businessId };
        const promiseList = [];
        promiseList.push(
          find_tree_book_list({
            code: 'RESOURCE_PLATFORM_CODE',
            status: 1,
            type: 2,
          }),
          get_business_info(params),
        );
        const [result0, result1] = await Promise.all(promiseList);
        if (result0?.code === 200) {
          const data1 = result0?.data || {};
          const data1Map = data1.reduce((acc, cur) => {
            acc[cur.code] = cur.name;
            return acc;
          }, {});
          this.getWayMap = Object.freeze(data1Map);
        }
        const { code, data, message } = result1;
        if (code === 200) {
          if (data.relation?.length >= 1) {
            data.relation.shift();
          }
          data.requireName = data.requireName
            ? JSON.parse(data.requireName)
                .map((item) => item.intentionName)
                .join(',')
            : '';
          this.$eventBus.$emit('get-business-info', data);
          const attr = data.customerAttribute;
          if (this.handleJson(attr)) {
            const arr = [];
            const customerAttribute = JSON.parse(attr);
            for (const key in customerAttribute) {
              const value = customerAttribute[key];
              arr.push(`${key}：${value}`);
            }
            data.customerAttribute = arr;
          }
          this.businessInfo = Object.freeze(data) || {};
          this.canEdit = data?.bizLibrary === 'PLATFORM' && data?.allocationStatus == 0;
          this.businessInfoUserId = data.plannerId;
        } else {
          this.$router.go(-1);
          this.$message.warning(message);
        }
        this.loading = false;
      } catch (error) {
        this.loading = false;
      }
    },
    handleJson(str) {
      try {
        JSON.parse(str);
        return true;
      } catch (e) {
        console.log(e);
        return false;
      }
    },
    getCustomerAttr(customerAttribute) {
      return typeof customerAttribute === 'string' ? true : false;
    },
    showMoreAttr() {
      this.moreIcon = !this.moreIcon;
    },
  },
};
</script>

<style></style>
