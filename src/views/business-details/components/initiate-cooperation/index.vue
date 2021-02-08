<template>
  <el-dialog
    title="发起合作"
    custom-class="initiate-cooperation"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="620px"
    @close="diologHandleClose"
  >
    <!-- 内容 -->
    <el-form
      ref="ruleForms"
      :model="ruleForms"
      :rules="rules"
      label-width="100px"
      label-position="left"
      class="content"
      :validate-on-rule-change="false"
    >
      <!-- 姓名行！ -->
      <el-form-item label="客户姓名：" prop="customerName" class="content-customerName">
        <p>{{ ruleForms.customerName }}</p>
      </el-form-item>

      <!-- 客户需求 选择该商机中未签单、未推单且未处于合作联盟待建立和已建立的有效需求-->
      <el-form-item label="客户需求:" prop="customerRequire" class="content-is-require">
        <el-select
          v-if="requireNameList.length > 1"
          v-model="ruleForms.customerRequire"
          data-tid="customerRequire"
          class="content-beiyong-select"
        >
          <el-option
            v-for="(item, index) in requireNameList"
            :key="item.requirementNo"
            :label="item.intentionName"
            :value="item.requirementNo"
            :data-tid="'value' + index"
          ></el-option>
        </el-select>
        <p v-else>{{ ruleForms.customerRequire }}</p>
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
      <el-form-item
        label="合作类型:"
        prop="cooperationType"
        class="content-is-require cooperationType"
      >
        <el-select
          v-model="ruleForms.cooperationType"
          data-tid="cooperationType"
          class="content-beiyong-select"
          @change="typeChange"
        >
          <el-option
            v-for="(item, index) in typeList"
            :key="item.value"
            :label="item.value"
            :value="item.key"
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
        prop="fullFree"
        class="content-is-require content-cooperationType"
      >
        <span
          v-for="item in order"
          :key="item.id"
          :class="{
            normal: true,
            active: item.id === isActive,
          }"
          data-tid="fullFree"
          @click="changeFullFree(item.id)"
        >
          <span>{{ item.name }}</span>
        </span>
      </el-form-item>
      <!-- 合作比例  定向分单-->
      <el-form-item
        v-if="ruleForms.fullFree == 1"
        label="合作比例:"
        prop="cooperationProportion"
        class="content-is-require no-bottom cooperationProportion"
      >
        <el-input
          v-model="ruleForms.cooperationProportion"
          data-tid="cooperationProportion"
          placeholder="平台规定比例30%~45%"
        />
        <p class="warn-text">合作方分得的比例，平台规定最高比例30%-45%</p>
      </el-form-item>
      <!-- 合作比例 抢单-->
      <el-form-item
        v-else
        label="合作比例:"
        prop="cooperationProportion"
        class="content-is-require no-bottom cooperationProportion"
      >
        <el-input
          v-model="ruleForms.cooperationProportion"
          data-tid="cooperationProportion"
          placeholder="平台规定比例20%~45%"
        />
        <p class="warn-text">合作方分得的比例，平台规定最高比例20%-45%</p>
      </el-form-item>
      <!-- 合作接收方 -->
      <el-form-item
        v-if="ruleForms.fullFree == 1"
        label="合作接收方:"
        prop="cooperationAcceptor"
        class="content-is-require cooperationType cooperationAcceptor"
      >
        <el-select
          v-model="ruleForms.cooperationAcceptor"
          data-tid="cooperationAcceptor"
          class="content-beiyong-select"
          filterable
          value-key="mchUserId"
          remote
          reserve-keyword
          placeholder="请输入合作接收方号码/系统号/姓名进行搜索"
          :remote-method="remoteMethod"
          :loading="selectLoading"
          popper-class="select-remote"
          clearable
          @change="selectChangeHandle"
          @blur="handleBlue"
        >
          <el-option
            v-for="(item, index) in peopleList"
            :key="item.mchUserId"
            :label="item.userName"
            :value="item"
            :data-tid="'value' + index"
          ></el-option>
        </el-select>
      </el-form-item>

      <!-- 抢单人员范围 发起人可选择参与抢单的人员范围，默认选择“本商户内”-->
      <el-form-item v-else label="抢单人员范围" class="singleRange">
        <el-radio
          v-model="ruleForms.singleRange"
          :label="1"
          class="content-radio-man"
          data-tid="content-radio-man"
          >本商户内</el-radio
        >
        <el-radio v-model="ruleForms.singleRange" :label="2" data-tid="content-radio-woman"
          >薯片平台</el-radio
        >
      </el-form-item>
      <!-- 备注行！ -->
      <el-form-item label="合作原因：" data-tid="workingReason" class="workingReason">
        <el-input
          v-model="ruleForms.workingReason"
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
        data-tid="recordsConfirmBtn"
        @click="submitV('ruleForms')"
        >提交合作</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
import Cooperations from './cooperattion';
export default Cooperations;
</script>
