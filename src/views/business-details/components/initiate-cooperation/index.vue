<template>
  <el-dialog
    title="发起合作"
    custom-class="initiate-cooperation"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="620px"
    @close="diologHandleClose"
    @opened="handleOpened"
  >
    <!-- 内容 -->
    <el-form
      ref="ruleForms"
      :model="ruleForms"
      :rules="rules"
      label-width="100px"
      label-position="left"
      class="contents"
      :validate-on-rule-change="false"
    >
      <!-- 姓名行！ -->
      <el-form-item label="客户姓名：" prop="customerName" class="contents-customerName">
        <p>{{ ruleForms.customerName || '-' }}</p>
      </el-form-item>

      <!-- 客户需求 选择该商机中未签单、未推单且未处于合作联盟待建立和已建立的有效需求-->
      <el-form-item
        label="客户需求:"
        prop="requirementCode"
        class="contents-is-require"
        :class="requireNameList.length == 1 ? 'contents-requirement' : ''"
      >
        <span v-if="requireNameList.length === 0">无可发起合作需求</span>
        <span v-else-if="requireNameList.length === 1">{{ ruleForms.requirementName }}</span>
        <el-select
          v-else
          v-model="ruleForms.requirementCode"
          data-tid="requirementCode"
          class="contents-beiyong-select"
          @change="requireChange"
        >
          <el-option
            v-for="(item, index) in requireNameList"
            :key="item.id"
            :label="item.intentionName"
            :value="item.id"
            :data-tid="'value' + index"
          ></el-option>
        </el-select>
        <!-- 新增需求？ -->
        <span class="iconfont-qds-crm icon-plus" data-tid="addNewRequire" @click="addNewRequire"
          ><em>新增需求</em>
        </span>
        <!--<el-cascader
          ref="customerRequireRef"
          v-model="ruleForms.customerRequire"
          placeholder="请选择客户需求"
          data-tid="customerRequire"
          :props="props"
        ></el-cascader>-->
        <!-- 提示行！ -->
        <p class="warn-text">
          请选择合作联盟的客户需求（仅可选择未签单和未处于合作期间的一个需求）
        </p>
      </el-form-item>
      <!-- 合作类型 -->
      <el-form-item label="合作类型:" prop="type" class="contents-is-require cooperationType">
        <el-select
          v-model="ruleForms.type"
          data-tid="cooperationType"
          class="contents-beiyong-select"
          @change="typeChange"
        >
          <el-option
            v-for="(item, index) in typeList"
            :key="item.value"
            :label="item.value"
            :value="item.id"
            :data-tid="'value' + index"
          ></el-option>
        </el-select>
        <el-tooltip
          data-tid="searchTooltip"
          :open-delay="320"
          effect="dark"
          :content="tooltip"
          placement="top-start"
          popper-class="show-tooltip"
        >
          <i class="iconfont-qds-crm icon-question" style="color: #bfbfbf"></i>
        </el-tooltip>
      </el-form-item>
      <!-- 分配方式 -->
      <el-form-item
        label="分配方式:"
        prop="allocationMode"
        class="contents-is-require contents-cooperationType"
      >
        <span
          v-for="item in order"
          :key="item.id"
          :class="{
            normal: true,
            active: item.id === isActive,
          }"
          data-tid="allocationMode"
          @click="changeFullFree(item.id)"
        >
          <span>{{ item.name }}</span>
        </span>
      </el-form-item>
      <!-- 合作比例  定向分单-->
      <el-form-item
        label="合作比例:"
        prop="ratio"
        class="contents-is-require no-bottom cooperationProportion"
      >
        <el-input
          v-model="ruleForms.ratio"
          data-tid="ratio"
          :placeholder="
            ratio.minCooperationRatio && ratio.maxCooperationRatio
              ? '平台规定比例' + ratio.minCooperationRatio + '%-' + ratio.maxCooperationRatio + '%'
              : '平台规定比例'
          "
        />
        <p v-if="ratio" class="warn-text">
          合作方分得的比例<span v-if="ruleForms.type">
            ，平台规定最高比例{{ ratio.minCooperationRatio ? ratio.minCooperationRatio + '%-' : ''
            }}{{ ratio.maxCooperationRatio ? ratio.maxCooperationRatio + '%' : '' }}
          </span>
        </p>
      </el-form-item>
      <!-- 合作接收方 -->
      <el-form-item
        v-if="ruleForms.allocationMode == 1"
        label="合作接收方:"
        prop="receiveUserId"
        class="contents-is-require cooperationType cooperationAcceptor"
      >
        <el-select
          v-model="ruleForms.receiveUserName"
          v-loadmore
          class="contents-beiyong-select"
          filterable
          value-key="mchUserId"
          remote
          reserve-keyword
          placeholder="请输入合作接收方号码/工号/姓名进行搜索"
          :remote-method="remoteMethod"
          :loading="selectLoading"
          popper-class="select-remote"
          clearable
          data-tid="receiveUserId"
          @change="selectChangeHandle"
          @blur="handleBlue"
        >
          <el-option
            v-for="(item, index) in peopleList"
            :key="item.mchUserId"
            :label="item.userName + '(' + item.userCenterNo + ')'"
            :value="item"
            :data-tid="'value' + index"
          ></el-option>
        </el-select>
      </el-form-item>

      <!-- 抢单人员范围 发起人可选择参与抢单的人员范围，默认选择“本商户内”-->
      <el-form-item v-else prop="grabOrderScope" label="抢单人员范围:" class="singleRange">
        <el-radio
          v-model="ruleForms.grabOrderScope"
          :label="1"
          class="contents-radio-man"
          data-tid="contents-radio-man"
          >本商户内</el-radio
        >
        <el-radio v-model="ruleForms.grabOrderScope" :label="2" data-tid="contents-radio-woman"
          >薯片平台</el-radio
        >
      </el-form-item>
      <!-- 备注行！ -->
      <el-form-item label="合作原因：" prop="reason" data-tid="reason" class="workingReason">
        <el-input
          v-model="ruleForms.reason"
          v-emoji="'textarea'"
          type="textarea"
          placeholder="说说这个客户的情况吧，对接收的规划师有帮助哦"
          maxlength="200"
          show-word-limit
          resize="none"
        />
      </el-form-item>
    </el-form>
    <!-- 弹层按钮 -->
    <span slot="footer" class="footer">
      <p>发起后在等待建立合作过程中将不可取消，请谨慎操作。</p>
      <el-button size="small" data-tid="recordsCancelButton" @click="dialogVisible = false"
        >取消</el-button
      >
      <el-button
        type="primary"
        size="small"
        :loading="loading"
        data-tid="recordsConfirmBtn"
        @click="submitV('ruleForms')"
        >提交合作</el-button
      >
    </span>
    <NewRequire ref="newRequireRef" @init-cooperation="initCoopration" />
  </el-dialog>
</template>

<script>
import Cooperations from './cooperattion';
export default Cooperations;
</script>
