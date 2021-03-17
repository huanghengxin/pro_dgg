<template>
  <div class="follow-records">
    <div class="title">跟进记录</div>
    <!-- tab页切换 -->
    <div class="tab-warp">
      <div class="warp-tabs" data-tid="recordTabChangeHandleClidk" @click="tabChangeHandleClidk">
        <div class="warp-tabs_left">
          <div
            v-for="item in tabList"
            :key="item.code"
            class="warp-tabs_item"
            :data-code="item.code"
          >
            <span
              :data-code="item.code"
              :class="{ 'warp-tabs_item-active': item.code == tabActive }"
            >
              {{ item.name }}
            </span>
          </div>
        </div>
        <div class="warp-tabs_right">
          <el-date-picker
            v-if="checked"
            v-model="time"
            :picker-options="pickerOptions"
            value-format="yyyy-MM"
            size="small"
            type="month"
            placeholder="选择月"
            data-tid="changeTimeHandle"
            @change="changeTimeHandle"
          >
          </el-date-picker>
          <el-checkbox
            v-model="checked"
            data-tid="clearTimeHandleClick"
            @change="clearTimeHandleClick"
            >查看90天以前</el-checkbox
          >
          <el-button
            v-accControls:noAttention="noAttentionStatus"
            type="primary"
            :disabled="disabledButton"
            icon="iconfont-qds-crm icon-edit"
            size="small"
            data-tid="recordWriteFollowRcordHandle"
            @click="writeFollowRcordHandle"
            >写跟进</el-button
          >
        </div>
      </div>
    </div>
    <div v-loading="loading">
      <div
        v-show="tabActive == 1"
        class="interview-warp"
        data-tid="recordSwitchTypeClick"
        @click="switchTypeClick"
      >
        <div
          :class="{
            'interview-warp_item': true,
            'interview-warp_item-active': subTabActive == 1,
          }"
          data-code="1"
        >
          邀约日程（{{ total.invite || 0 }}）
        </div>
        <div
          :class="{
            'interview-warp_item': true,
            'interview-warp_item-active': subTabActive == 2,
          }"
          data-code="2"
        >
          面谈记录（{{ total.interview || 0 }}）
        </div>
      </div>
      <div ref="scrollContentRef" class="warp-content">
        <template v-if="isShowNoData">
          <div key="item-warp" class="item-warp">
            <div v-for="(item, index) in recordsList" :key="item.id">
              <div class="warp-content_item">
                <div class="inprogress">
                  <svg-icon
                    v-if="index === 0"
                    key="iconfont-qds-crm-inprogress"
                    ava-class="first-icon"
                    icon="icon-inprogress"
                  />
                  <svg-icon v-else key="iconfont-qds-crm-inprogress" icon="icon-notinprogress" />
                </div>
                <div class="content">
                  <template v-for="field in fieldList">
                    <div :key="field.code">
                      <!-- 判断是否是跟进内容类型，是需要对是否打电话进行判断 -->
                      <template v-if="field.code === 'followContent'">
                        <p v-if="item.followType === 'CRM_OPER_CALL'">
                          <span>打电话：</span>
                          <i
                            class="iconfont-qds-crm icon-start content-icon"
                            data-tid="recordOpenAudioDialog"
                            @click="openAudioDialog(item)"
                            ><em>播放录音</em></i
                          >
                        </p>
                        <p v-else>
                          <show-tooltip
                            v-if="item.followContent"
                            :text="item.followContent"
                            title="跟进内容："
                            title-class="content-title"
                            :tooltip-line-clamp="2"
                            :width="672"
                            tooltip-class="content-record"
                          ></show-tooltip>
                        </p>
                      </template>
                      <template v-else>
                        <!-- 判断是否是发起时间 -->
                        <template v-if="field.code === 'createTime'">
                          <p class="content-time invite-warp">
                            <span class="invite-warp_left">
                              <span>发起时间：</span>
                              {{ item.createTime }}
                              <!-- subTabActive == 1为邀约类型 （根据接口参数）-->
                              <!-- item.inviteStatus == 0为待面谈状态需要展示取消面谈按钮 -->
                              <span
                                v-show="subTabActive == 1"
                                :class="{
                                  'content-tag': true,
                                  'content-tag_active': item.inviteStatus == 0, //0为待面谈
                                }"
                                >{{ item.inviteStatus | statusFormat }}</span
                              >
                            </span>
                            <span
                              v-if="from !== 'team-manage'"
                              v-show="subTabActive == 1 && item.inviteStatus == 0"
                              class="invite-warp_right"
                              data-tid="recordCancelInviteClick"
                              @click="cancelInviteClick(item.id)"
                            >
                              <i class="el-icon-circle-close"><em>取消面谈</em></i>
                            </span>
                          </p>
                          <p
                            v-show="subTabActive == 1 && item.inviteStatus == 0"
                            class="invite-info"
                          >
                            <i class="iconfont-qds-crm icon-attention"> </i>
                            <span>面谈结束时请在企大顺app邀约日程中操作</span>
                          </p>
                        </template>
                        <!-- 其他字段在constants中配置数据的字段 -->
                        <!-- 'inviteType', 'interviewType'为邀约类型和面谈类型返回的数据为数字需要翻译 -->
                        <template v-else>
                          <p :class="{ 'content-time': field.name === '' || field.time }">
                            <span v-if="field.name" class="content-title">{{ field.name }}</span>
                            <span>{{ field.followPerson }}</span>
                            {{ field.time ? field.time : '' }}
                            {{
                              ['inviteType', 'interviewType'].includes(field.code)
                                ? item[field.code] == 0
                                  ? '客户上门'
                                  : '外出拜访'
                                : item[field.code]
                            }}{{ field.jobNum ? '（' + item[field.jobNum] + '）' : '' }}
                          </p>
                        </template>
                      </template>
                    </div>
                  </template>
                  <p v-if="item.accompanyName">
                    <span class="content-title">陪同人：</span>
                    <span
                      >{{ item.accompanyName
                      }}{{ item.accompanyNo ? '（' + item.accompanyNo + '）' : '' }}</span
                    >
                  </p>
                  <p v-if="item.dataTypeJson">
                    <span class="content-title">需携带资料：</span>
                    <span>{{ item.dataTypeJson }}</span>
                  </p>
                </div>
              </div>
            </div>
            <div v-show="isShow" class="no-more">没有更多数据</div>
          </div>
        </template>
        <template v-else>
          <svg-icon
            key="item-warp"
            :text-content="textContent"
            type="nodata"
            ava-class="no-data"
            icon="icon-icon_nodata"
          />
        </template>
      </div>
    </div>
    <write-follow-rcord
      ref="writeFollowRcordRef"
      is-place="business-details"
      data-tid="recordWriteFollowRecordk"
      :from="from"
      @on-submit="writeFollowRecord"
    />
    <play-recording ref="playRecordingRef" :customer-name="customerName" />
  </div>
</template>

<script>
import FollowRecords from './index';
export default FollowRecords;
</script>
