<template>
  <div>
    <el-dialog
      v-show="switchDialog"
      title="邀约面谈"
      custom-class="invite-interview"
      :visible.sync="dialogVisible"
      width="620px"
      :close-on-click-modal="false"
      @close="diologHandleClose"
    >
      <el-form
        ref="ruleForm"
        :rules="rules"
        label-position="left"
        label-width="130px"
        size="small"
        :model="ruleForm"
      >
        <!-- 面谈类型： -->
        <el-form-item
          label="面谈类型："
          required
          :show-message="false"
          class="invite-interview_type"
        >
          <el-radio-group
            v-model="ruleForm.inviteType"
            data-tid="inviteTypeChange"
            @change="inviteTypeChange"
          >
            <el-radio :label="0">客户上门</el-radio>
            <el-radio :label="1">外出拜访</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 约定时间： -->
        <el-form-item label="约定时间：" class="invite-interview_appoint-time" prop="inviteTime">
          <el-date-picker
            v-model="ruleForm.inviteTime"
            format="yyyy-MM-dd HH:mm:ss"
            :picker-options="pickerOptions"
            type="datetime"
            placeholder="选择日期时间"
            :default-time="nowTime"
            data-tid="inviteFocusHandle"
            @focus="focusHandle"
          >
          </el-date-picker>
        </el-form-item>
        <!-- 手机号码： -->
        <el-form-item label="手机号码：" class="invite-interview_phone" prop="phone">
          <div class="quick-note_group">
            <el-select v-model="ruleForm.phone" placeholder="请选择手机号码">
              <el-option
                v-for="item in phoneList"
                :key="item.id"
                :label="item.contactNo"
                :value="item.contactNoFull"
              >
              </el-option>
            </el-select>
            <div
              v-show="!(addPhoneNumber === 0 && sparePhone)"
              class="quick-note_group-add"
              data-tid="addPhoneHandleClick"
              @click="addPhoneHandleClick"
            >
              无可用号码，去添加
              <i class="iconfont-qds-crm icon-rightoutline"></i>
            </div>
          </div>
          <!-- 提示行！ -->
          <div class="warn">
            <span class="iconfont-qds-crm icon-attention warn-icon"
              ><em class="warn-text">该手机号将用于接收邀约短信，请与客户确认。</em></span
            >
          </div>
        </el-form-item>
        <!-- 面谈地点 -->
        <el-form-item
          label="面谈地点："
          class="invite-interview_area"
          prop="area"
          :rules="rules.area"
        >
          <el-select
            v-if="ruleForm.inviteType === 0"
            key="invite-interview_area"
            v-model="ruleForm.area"
            placeholder="请选择面谈地点"
          >
            <el-option
              v-for="item1 in addressList"
              :key="item1.id"
              :label="item1.detailAdress"
              :value="item1.detailAdress"
            >
            </el-option>
          </el-select>
          <el-input
            v-else
            key="invite-interview_area"
            v-model="ruleForm.area"
            maxlength="100"
            placeholder="请输入面谈地点"
          ></el-input>
        </el-form-item>
        <!-- 陪谈人 -->
        <el-form-item label="陪谈人：" class="invite-interview_people" prop="people">
          <drop-select
            ref="inviteRefs"
            key="invite"
            value-key="mchUserId"
            placeholder="请输入陪谈人号码/工号/姓名进行搜索"
            type="inviteList"
            is-default
            data-tid="selectChangeHandle"
            @change="selectChangeHandle"
          ></drop-select>
        </el-form-item>
        <!-- 客户需携带资料 -->
        <el-form-item
          v-if="resourceList.length && resourceList.length > 0"
          label="客户需携带资料："
          class="invite-interview_resource"
          prop="resource"
        >
          <el-checkbox-group v-model="ruleForm.resource">
            <el-checkbox v-for="item in resourceList" :key="item.id" :label="item.name">{{
              item.name
            }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <!-- 弹层按钮 -->
      <span slot="footer" class="footer">
        <span class="footer-info">注：提交后系统将给客户发送邀约短信和薯片消息</span>
        <div>
          <el-button size="small" data-tid="recordsCancelButton" @click="dialogVisible = false"
            >取消</el-button
          >
          <el-button
            type="primary"
            size="small"
            :loading="loading"
            data-tid="inviteSubmit"
            @click="submitHandleClick"
            >提交</el-button
          >
        </div>
      </span>
    </el-dialog>
    <component
      :is="currentComponent"
      :ref="currentComponent"
      data-tid="inviteOnSubmit"
      @on-close="onCloseHandle"
      @on-submit="onSubmitHandle"
    />
  </div>
</template>

<script>
import inviteInterview from './index';
export default inviteInterview;
</script>
