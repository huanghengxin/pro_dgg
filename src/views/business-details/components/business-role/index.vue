<template>
  <div class="business-role">
    <p class="role">商机角色</p>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="维护人" name="accendant">
        <div class="accendant-item">
          <div class="accendant-item-left">
            <img :src="role.avatar" alt="" />
          </div>
          <div class="accendant-item-content">
            <p class="accendant-item-content-name">
              {{ role.name || '-' }} <span>{{ '(' + role.jobNo + ')' || '-' }}</span>
            </p>
            <p class="accendant-item-content-brand">
              {{ role.commercialTenant || '-' }}-{{ role.title || '-' }}
            </p>
            <p class="accendant-item-content-number">
              电话： <span>{{ role.number || '-' }}</span>
            </p>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="合作联盟" name="Partners">
        <div v-for="item in cooperationList" :key="item.id" class="cooperationInfo">
          <div class="cooperationInfo-titleInfo">
            <div class="cooperationInfo-titleInfo-leftCont">
              <p class="cooperationInfo-titleInfo-require">
                合作需求：<span
                  >{{ item.customerRequirementName || '-' }}-{{
                    item.customerBizAreaName || '-'
                  }}</span
                >
              </p>
              <p class="cooperationInfo-titleInfo-proportion">
                合作人预计分润比例：
                <span>{{ item.ratio + '%' || '-' }}</span>
                <span class="cooperationInfo-titleInfo-proportion-tip">
                  （此数据只为参考，最终比例以订单结算时为准）
                </span>
              </p>
            </div>
            <div class="cooperationInfo-titleInfo-contentCont">
              <div
                v-if="item.status == 2"
                class="cooperationInfo-titleInfo-contentCont-grabSingleBox"
              >
                <p class="cooperationInfo-titleInfo-contentCont-grabSingleBox-grabSingleText">
                  <i class="iconfont-qds-crm icon-Urgelighting"></i> 抢单中
                </p>
                <div
                  class="common-button cooperationInfo-titleInfo-contentCont-grabSingleBox-priceApply"
                >
                  查看加价申请
                </div>
              </div>
              <div
                v-if="item.status == 3"
                class="cooperationInfo-titleInfo-contentCont-onlineTalkBox"
              >
                <div
                  class="common-button cooperationInfo-titleInfo-contentCont-onlineTalkBox-onlineTalk"
                  @click="onlineTalk(item.id)"
                >
                  在线聊
                </div>
                <div
                  class="common-button cooperationInfo-titleInfo-contentCont-onlineTalkBox-cancel"
                  data-tid="relieveCooperation"
                  @click="relieveCooperation(item.id)"
                >
                  解除合作
                </div>
                <el-tooltip
                  data-tid="searchTooltip"
                  :open-delay="320"
                  effect="dark"
                  :content="tooltip"
                  placement="top-start"
                  popper-class="show-tooltip"
                >
                  <i class="iconfont-qds-crm icon-question icon-tip" style="color: #bfbfbf"></i>
                </el-tooltip>
              </div>
              <p v-else-if="item.status == 4" class="cooperationInfo-titleInfo-contentCont-success">
                <i class="iconfont-qds-crm icon-success1"></i>
                合作成功
              </p>
            </div>
          </div>
          <div class="accendant-item proportion-item">
            <div class="accendant-item-left">
              <img :src="item.sponsor.avatar" alt="" />
            </div>
            <div class="accendant-item-content proportion-item">
              <p class="accendant-item-content-box">
                <span class="accendant-item-content-name">
                  {{ item.sponsor.name || '-' }}
                  <span>{{ '(' + item.sponsor.jobNo + ')' || '-' }}</span>
                </span>
                <span
                  class="common"
                  :class="
                    item.sponsor.roleName == '合作发起人'
                      ? 'accendant-item-content-cooperator'
                      : 'accendant-item-content-cosponsor'
                  "
                >
                  {{ item.sponsor.roleName || '- ' }}
                </span>
              </p>
              <p class="accendant-item-content-brand">
                {{ item.sponsor.commercialTenant || '-' }}-{{ item.sponsor.title || '-' }}
              </p>
              <p class="accendant-item-content-number">
                电话： <span>{{ item.sponsor.number || '-' }}</span>
              </p>
            </div>
            <div class="accendant-item-right">
              <div v-if="item.status != 2" class="accendant-item-right-date">
                {{ item.sponsor.create_date | filterTime }}日发起
              </div>
              <div v-else class="accendant-item-right-ring">
                <span>待接收</span>
                <span class="accendant-item-right-ring-box" @click="ringSomeOne(item.sponsor.id)">
                  <i class="iconfont-qds-crm icon-notice"></i> 提醒TA
                </span>
              </div>
            </div>
          </div>
          <!-- 合作接收人 -->
          <div class="accendant-item proportion-item">
            <div class="accendant-item-left">
              <img :src="item.receive.avatar" alt="" />
            </div>
            <div class="accendant-item-content proportion-item">
              <p class="accendant-item-content-box">
                <span class="accendant-item-content-name">
                  {{ item.receive.name || '-' }}
                  <span>{{ '(' + item.receive.jobNo + ')' || '-' }}</span>
                </span>
                <span
                  v-if="item.status != 2"
                  class="common"
                  :class="item.receive.roleName ? 'accendant-item-content-cosponsor' : ''"
                >
                  {{ item.receive.roleName || '- ' }}
                </span>
              </p>
              <p class="accendant-item-content-brand">
                {{ item.receive.commercialTenant || '-' }}-{{ item.receive.title || '-' }}
              </p>
              <p class="accendant-item-content-number">
                电话： <span>{{ item.receive.number || '-' }}</span>
              </p>
            </div>
            <div class="accendant-item-right">
              <div v-if="item.status != 2" class="accendant-item-right-date">
                {{ item.receive.receiveTime | filterTime }}日发起
              </div>
              <div v-else class="accendant-item-right-ring">
                <span>待接收</span>
                <span class="accendant-item-right-ring-box" @click="ringSomeOne(item.receive.id)">
                  <i class="iconfont-qds-crm icon-notice"></i> 提醒TA
                </span>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <!-- 发起解除合作联盟 -->
    <RelieveCooperation ref="relieveCooperationRef" class="relieveCooperation"></RelieveCooperation>
    <!-- 解除 拒绝合作 -->
    <RelieveReason
      ref="relieveReasonRef"
      class="relieveReason"
      @reload-list="loadList"
    ></RelieveReason>
  </div>
</template>

<script>
import BusinessRole from './businessRole.js';
export default BusinessRole;
</script>
