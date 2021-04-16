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
        v-if="from !== 'team-manage' && (isCurUser || permissionType.info != 'TRANSFER_SPONSOR')"
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
      <span class="item-label">商机编号：</span><span>{{ businessInfo.bizNo }}</span>
    </div>
    <div class="business-info_item-small phone-info">
      <span class="item-label">手机号码：</span>
      <div v-if="businessInfo.customerPhone">
        <div>
          <span>
            {{ businessInfo.customerPhone }}
          </span>
          <i
            v-if="
              from !== 'team-manage' &&
              (isCurUser ||
                permissionType.info == 'RETENTION_SPONSOR' ||
                permissionType.info == 'TRANSFER_RECEIVE')
            "
            class="iconfont-qds-crm icon-view1 phone-info_icon"
            data-tid="infoShowModalHandleClick"
            @click="showModalHandleClick('showPhoneRef', businessInfo.customerContact)"
          ></i>
          <i
            v-if="
              (isCurUser || permissionType.info != 'TRANSFER_SPONSOR') &&
              businessInfo.noAttention != '1'
            "
            v-callLoading="callLoading"
            v-accControls:noAttention="businessInfo"
            class="iconfont-qds-crm icon-dianhua phone-info_icon"
            data-tid="infoBusinessInfoCall"
            @click="businessInfoCall"
          ></i>
        </div>

        <div v-for="item in businessInfo.relation" :key="item.id" class="phone-info_sen">
          <span>
            {{ item.contactNo }}
          </span>
          <i
            v-if="
              from !== 'team-manage' &&
              (isCurUser ||
                permissionType.info == 'RETENTION_SPONSOR' ||
                permissionType.info == 'TRANSFER_RECEIVE')
            "
            class="iconfont-qds-crm icon-view1 phone-info_icon"
            data-tid="infoShowModalHandleClick"
            @click="showModalHandleClick('showPhoneRef', item.contactNoFull)"
          ></i>
          <i
            v-if="
              (isCurUser || permissionType.info != 'TRANSFER_SPONSOR') &&
              businessInfo.noAttention != '1'
            "
            v-accControls:noAttention="businessInfo"
            class="iconfont-qds-crm icon-dianhua phone-info_icon"
            data-tid="infoBusinessInfoCall"
            @click="businessInfoCall(item.contactNoFull)"
          ></i>
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
        :text="businessInfo.requireName.replace(/(,+)/g, '、')"
        :width="260"
      ></show-tooltip>
      <div v-else key="require-info">-</div>
    </div>
    <div class="business-info_item-small">
      <span class="item-label">下次跟进时间：</span>
      <span v-if="businessInfo.nextFollowTime" key="time-info">
        {{ businessInfo.nextFollowTime | filterSecond }}
      </span>
      <span v-else key="time-info">-</span>
    </div>
    <div class="business-info_item-small">
      <span class="item-label">预计掉库时间：</span>
      <span v-if="businessInfo.dropTime && businessInfo.noAttention != 1" class="color-info">
        {{ businessInfo.dropTime | filterSecond }}
      </span>
      <span v-else>-</span>
    </div>
    <div class="business-info_item-small">
      <span class="item-label">预计掉库类型：</span>
      <span v-if="businessInfo.noAttention == 1" class="color-info">暂不关注/不掉库</span>
      <span v-else-if="businessInfo.dropTypeCode" class="color-info">
        {{ businessInfo.dropTypeName || '暂无数据' }}
      </span>
      <span v-else>-</span>
    </div>
    <div class="business-info_item-small">
      <span class="item-label">获取方式：</span>
      <span>{{ getWayMap[businessInfo.getWay] || '暂无数据' }}</span>
    </div>
    <div class="business-info_item-small">
      <span class="item-label">获取时间：</span>
      <span>{{ businessInfo.getTime | filterSecond }}</span>
    </div>
    <div class="business-info_item-small require-info">
      <span class="item-label">备用联系人：</span>
      <show-tooltip
        v-if="businessInfo.bakRelation && businessInfo.bakRelation.contactName"
        key="business-bakRelation"
        :text="contactName"
        :width="260"
      ></show-tooltip>
      <span
        v-else
        v-show="from !== 'team-manage' && (isCurUser || permissionType.info != 'TRANSFER_SPONSOR')"
        key="business-bakRelation"
        :class="{
          'iconfont-qds-crm': true,
          'icon-plus': true,
        }"
        data-tid="infoAddStandbyPerson"
        @click="addStandbyPerson"
        ><em>新增</em></span
      >
    </div>
    <div
      v-if="businessInfo.bakRelation && businessInfo.bakRelation.contactNo"
      class="business-info_item-small phone-info"
    >
      <span class="item-label">备用联系号码：</span
      ><span>{{ businessInfo.bakRelation.contactNo }}</span>
      <i
        v-if="
          from !== 'team-manage' &&
          (isCurUser ||
            permissionType.info == 'RETENTION_SPONSOR' ||
            permissionType.info == 'TRANSFER_RECEIVE')
        "
        class="iconfont-qds-crm icon-view1 phone-info_icon"
        data-tid="infoShowModalHandleClick"
        @click="showModalHandleClick('showPhoneRef', businessInfo.bakRelation.contactNoFull)"
      ></i>
      <i
        v-if="
          (isCurUser || permissionType.info != 'TRANSFER_SPONSOR') &&
          businessInfo.noAttention != '1'
        "
        v-accControls:noAttention="businessInfo"
        class="iconfont-qds-crm icon-dianhua phone-info_icon"
        data-tid="infoBusinessInfoCall"
        @click="businessInfoCall(businessInfo.bakRelation.contactNoFull)"
      ></i>
    </div>
    <div>
      <span class="item-label">分组：</span>
      <span v-if="businessInfo.groupName">{{ businessInfo.groupName }}</span>
      <span v-else>-</span>
    </div>
    <show-phone ref="showPhoneRef" />
    <edit-remark ref="editRemarkRef" @set-remark="setRemark" />
    <add-standby ref="addStandbyContact"></add-standby>
  </div>
</template>

<script>
import './index.scss';
import ShowTooltip from 'components/show-tooltip';
import ShowPhone from '../show-phone';
import EditRemark from '../edit-remark';
import AddStandby from '../../../my-business/components/add-standby-contact';
import { get_business_info } from 'api/business-details';
import { get_dictionary_data_by_parent_code } from 'api/common';
import callMixins from 'utils/mixins/callMixins';
import dayjs from 'dayjs';
import stores from 'storejs';
export default {
  name: 'BusinessInfo',
  components: {
    ShowTooltip,
    ShowPhone,
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
    console.log(
      stores.get('mchInfo')?.mchUserId,
      this.businessInfo,
      '12312412asd 31231231231123312',
    );
  },
  beforeDestroy() {
    this.$eventBus.$off('edit-on-submit_update-business-info');
  },
  methods: {
    /**
     * @description 请求数据字典
     */
    async getParentCode(parentCode) {
      let params = {
        parentCode: parentCode,
      };
      const { code, data } = await get_dictionary_data_by_parent_code(params);
      if (code === 200) {
        return data?.reduce((acc, cur) => {
          acc[cur.code] = cur.name;
          return acc;
        }, {});
      }
    },
    /**
     * @description 打电话需要刷新页面方法
     */
    flowRefresh() {
      this.$router.go(-1);
    },
    /**
     * @description 商机详情打电话
     * @param {String} 改变当前选中的号码
     */
    businessInfoCall(contactNoFull) {
      const type = this.from === 'team-manage' ? 'team-manage' : 'bus';
      this.callMixins(type, this.businessInfo, 'one', contactNoFull);
    },
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
      const wayData = await this.getParentCode('CRM_GET_WAY');
      console.log('sdjhjfshfj', wayData);
      this.getWayMap = Object.freeze(wayData);
      this.loading = true;
      const params = { bizId: this.businessId };
      get_business_info(params)
        .then((res) => {
          const { code, data, message } = res;
          if (code === 200) {
            if (data.relation.length >= 1) {
              data.relation.shift();
            }
            data.requireName = data.requireName
              ? JSON.parse(data.requireName)
                  .map((item) => item.intentionName)
                  .join(',')
              : '';
            this.$eventBus.$emit('get-business-info', data);
            this.businessInfo = Object.freeze(data) || {};
            this.businessInfoUserId = data.plannerId;
          } else {
            this.$message.warning(message);
            if (res.code === 5002) {
              this.$router.go(-1);
            }
          }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>

<style></style>
