<template>
  <div class="business-role">
    <p class="role">商机角色</p>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane v-loading="accendantLoading" label="维护人" name="accendant">
        <div v-if="role.cooperationMaintainer" class="accendant-item">
          <div class="accendant-item-left">
            <img
              v-if="role.cooperationMaintainer && role.cooperationMaintainer.userImgUrl"
              :src="role.cooperationMaintainer.userImgUrl"
              alt=""
            />
            <div v-else class="accendant-item-left_avatar">
              {{
                role.cooperationMaintainer && role.cooperationMaintainer.planName.substring(0, 2)
              }}
            </div>
          </div>
          <div class="accendant-item-content">
            <p class="accendant-item-content-name">
              {{ (role.cooperationMaintainer && role.cooperationMaintainer.planName) || '-' }}
              <span v-if="role.cooperationMaintainer">{{
                '(' + role.cooperationMaintainer.workId + ')' || '-'
              }}</span>
            </p>
            <p class="accendant-item-content-brand">
              {{ (role.cooperationMaintainer && role.cooperationMaintainer.orgName) || '-' }}-{{
                (role.cooperationMaintainer && role.cooperationMaintainer.titleName) || '-'
              }}
            </p>
            <p class="accendant-item-content-number">
              电话：
              <span>{{
                (role.cooperationMaintainer && role.cooperationMaintainer.phone) || '-'
              }}</span>
            </p>
          </div>
        </div>
        <span v-else>
          <svg-icon key="item-warp" ava-class="empty" type="nodata" icon="icon-icon_nodata"
        /></span>
      </el-tab-pane>
      <el-tab-pane v-loading="loading" label="合作联盟" name="Partners">
        <div
          v-for="item in cooperationList"
          v-show="cooperationList && cooperationList.length >= 1"
          :key="item.id"
          class="cooperationInfo"
        >
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
                v-if="item.status == 'GRAB'"
                class="cooperationInfo-titleInfo-contentCont-grabSingleBox"
              >
                <p class="cooperationInfo-titleInfo-contentCont-grabSingleBox-grabSingleText">
                  <i class="iconfont-qds-crm icon-Urgelighting"></i> 抢单中
                </p>
                <!--  <div
                  v-if="
                    permissionType.info == 'RETENTION_SPONSOR' ||
                    permissionType.info == 'TRANSFER_RECEIVE'
                  "
                  class="common-button cooperationInfo-titleInfo-contentCont-grabSingleBox-priceApply"
                >
                  查看加价申请
                </div>-->
              </div>
              <p
                v-else-if="item.status == 'SUCCESS'"
                class="cooperationInfo-titleInfo-contentCont-success"
              >
                <i class="iconfont-qds-crm icon-success1"></i>
                合作成功
              </p>
            </div>
          </div>
          <div v-if="item.sponsor" class="accendant-item proportion-item">
            <div class="accendant-item-left">
              <img v-if="item.sponsor.avatar" :src="item.sponsor.avatar" alt="" />
              <div v-else class="accendant-item-left_avatar">
                {{ item.sponsor.name && item.sponsor.name.substring(0, 2) }}
              </div>
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
              <div class="accendant-item-right-date">
                {{ item.sponsor.createTime | filterTime }}日发起
              </div>
              <!-- 
                <div v-else class="accendant-item-right-ring">
                <span>待接收</span>
                <span class="accendant-item-right-ring-box" @click="ringSomeOne(item.sponsor.id)">
                  <i class="iconfont-qds-crm icon-notice"></i> 提醒TA
                </span>
              </div>
               -->
            </div>
          </div>
          <!-- 合作接收人 -->
          <div v-if="item.status != 'GRAB' && item.receive" class="accendant-item proportion-item">
            <div class="accendant-item-left">
              <img v-if="item.receive && item.receive.avatar" :src="item.receive.avatar" alt="" />
              <div v-else class="accendant-item-left_avatar">
                {{ item.receive.name && item.receive.name.substring(0, 2) }}
              </div>
            </div>
            <div class="accendant-item-content proportion-item">
              <p class="accendant-item-content-box">
                <span class="accendant-item-content-name">
                  {{ item.receive.name || '-' }}
                  <span>{{ '(' + item.receive.jobNo + ')' || '-' }}</span>
                </span>
                <span
                  v-if="item.status != 'GRAB'"
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
              <div v-if="item.status != 'RECEIVE'" class="accendant-item-right-date">
                {{ item.receive.receiveTime | filterTime }}日接收
              </div>
              <div v-else class="accendant-item-right-ring">
                <span>{{ item.status == 'RECEIVE' ? '待接收' : '' }}</span>
              </div>
            </div>
          </div>
        </div>
        <div v-show="cooperationList.length < 1 && activeName == 'Partners'">
          <svg-icon key="item-warp" ava-class="empty" type="nodata" icon="icon-icon_nodata" />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import BusinessRole from './businessRole.js';
export default BusinessRole;
</script>
