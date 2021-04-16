<template>
  <div>
    <div v-loading="loading" class="add-business-page">
      <!-- 头部！ -->
      <div class="title">
        <span>发起合作</span>
      </div>
      <!-- 内容 -->
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        label-width="100px"
        label-position="left"
        class="content"
        :validate-on-rule-change="false"
        ><!-- 手机行！ -->
        <el-form-item label="手机号码：" prop="customerPhone" class="content-phone">
          <div class="phone-warp">
            <div v-if="desePhone">{{ desePhone }}</div>
            <el-input
              v-else
              key="desensitization"
              v-model.trim="ruleForm.customerPhone"
              maxlength="11"
              placeholder="请输入11位手机号码"
              data-tid="customerPhoneInput"
              @input="phoneBlurValidate"
            ></el-input>
            <!-- 新增？ -->
            <span
              :class="{
                'iconfont-qds-crm': true,
                'icon-plus': true,
                disabled: !isRelevance || ruleForm.phoneArray.length > 1,
              }"
              data-tid="addNew"
              @click="addNew"
              ><em>新增</em>
            </span>
          </div>
          <!-- 提示行！ -->
          <div class="warn">
            <span class="iconfont-qds-crm icon-attention warn-icon"
              ><em class="warn-text">保存后不可更改，且会作为核查的重要依据，请认真填写。</em></span
            >
          </div>
        </el-form-item>
        <transition name="fade">
          <div>
            <el-form-item
              v-for="(item, index) in ruleForm.phoneArray"
              :key="item.id"
              :prop="'phoneArray.' + index + '.contactNo'"
              :rules="rules.contactNo"
              class="new-add"
            >
              <!-- 关联行？ -->
              <el-input
                v-model.trim="item.contactNo"
                :disabled="Boolean(item.id)"
                clearable
                type="text"
                placeholder="请输入手机号码"
                class="other-input"
                :data-tid="'contactNo' + index"
                maxlength="11"
              />
              <el-button
                :data-index="index"
                plain
                size="medium"
                icon="el-icon-delete"
                :data-tid="'delPhone' + index"
                :disabled="ruleForm.phoneArray.length > 0 && Boolean(item.id)"
                @click="delPhone(index)"
              ></el-button>
            </el-form-item>
          </div>
        </transition>
        <!-- 姓名行！ -->
        <el-form-item label="姓名：" prop="customerName">
          <!-- v-emoji="'input'" -->
          <el-input
            v-model="ruleForm.customerName"
            clearable
            maxlength="20"
            data-tid="nameInput"
            placeholder="请输入客户姓名或企业名称"
            class="clearable"
          ></el-input>
        </el-form-item>
        <!-- 性别行！ -->
        <el-form-item label="性别：" prop="customerSex">
          <el-radio
            v-model="ruleForm.customerSex"
            :label="1"
            class="content-radio-man"
            data-tid="content-radio-man"
            >男</el-radio
          >
          <el-radio v-model="ruleForm.customerSex" :label="0" data-tid="content-radio-woman"
            >女</el-radio
          >
        </el-form-item>

        <!-- 客户需求： 客户需求可选择全平台所有启用业务。-->
        <el-form-item label="客户需求：" prop="requirementArray">
          <el-cascader
            ref="requirementRef"
            v-model="ruleForm.requirementArray"
            placeholder="请选择客户需求"
            data-tid="requirementArray"
            :props="props"
          ></el-cascader>
          <!-- 新增需求？ -->
          <!-- 
            <span
            v-show="isNewRequire"
            class="iconfont-qds-crm icon-plus"
            data-tid="addNewRequire"
            @click="addNewRequire"
            ><em>新增需求</em>
          </span>
           -->
        </el-form-item>
        <!-- 意向等级： -->
        <el-form-item prop="intentionLevel" label="意向等级：" :show-message="false" required>
          <el-rate
            v-model="ruleForm.intentionLevel"
            :max="texts.length"
            :texts="texts"
            show-text
            class="content-level"
            data-tid="intentionLevel"
            @change="ratechange"
          >
          </el-rate>
        </el-form-item>
        <!-- 业务区域： -->
        <el-form-item label="业务区域：" prop="areaCode">
          <el-select v-model="ruleForm.areaCode" data-tid="areaCode" class="content-beiyong-select">
            <el-option
              v-for="(item, index) in areaList"
              :key="item.name"
              :label="item.name"
              :value="item.code"
              :data-tid="'value' + index"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 合作类型： -->
        <el-form-item label="合作类型：" prop="type">
          <el-select
            v-model="ruleForm.type"
            data-tid="type"
            class="content-beiyong-select"
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
          <!--     <i class="iconfont-qds-crm icon-question" style="color: #bfbfbf">
          <show-tooltip :text="tooltip" :width="300" tooltip-class="item-top_name" />
        </i> -->
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
          class="content-is-require content-cooperationType"
        >
          <span
            v-for="item in order"
            :key="item.id"
            :class="{
              normal: true,
              active: item.id == isActive,
            }"
            data-tid="allocationMode"
            @click="changeFullFree(item.id)"
          >
            <span>{{ item.name }}</span>
          </span>
        </el-form-item>
        <!-- 合作比例 -->
        <el-form-item
          label="合作比例:"
          prop="ratio"
          class="contents-is-require no-bottom cooperationProportion warn"
        >
          <el-input
            v-model="ruleForm.ratio"
            data-tid="ratio"
            :placeholder="
              ratio.minCooperationRatio && ratio.maxCooperationRatio
                ? '平台规定比例' +
                  ratio.minCooperationRatio +
                  '%-' +
                  ratio.maxCooperationRatio +
                  '%'
                : '平台规定比例'
            "
          />
          <p v-if="ratio" class="warn-text">
            合作方分得的比例<span v-if="ratio.minCooperationRatio && ratio.maxCooperationRatio">
              ，平台规定最高比例{{
                ratio.minCooperationRatio ? ratio.minCooperationRatio + '%-' : ''
              }}{{ ratio.maxCooperationRatio ? ratio.maxCooperationRatio + '%' : '' }}
            </span>
          </p>
        </el-form-item>
        <!-- 合作接收方 -->
        <el-form-item
          v-if="ruleForm.allocationMode == 1"
          label="合作接收方:"
          prop="receiveUserId"
          class="content-is-require cooperationType cooperationAcceptor"
        >
          <el-select
            v-model="ruleForm.receiveUserId"
            v-loadmore
            class="content-beiyong-select"
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
              :label="item.userName + '/' + item.userCenterNo"
              :value="item"
              :data-tid="'value' + index"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 抢单人员范围 发起人可选择参与抢单的人员范围，默认选择“本商户内”-->
        <el-form-item
          v-else
          label="抢单人员范围"
          prop="grabOrderScope"
          data-tid="grabOrderScope"
          class="singleRange"
        >
          <el-radio
            v-model="ruleForm.grabOrderScope"
            label="1"
            class="content-radio-man"
            data-tid="content-radio-man"
            >本商户内</el-radio
          >
          <el-radio v-model="ruleForm.grabOrderScope" label="2" data-tid="content-radio-woman"
            >薯片平台</el-radio
          >
        </el-form-item>
        <!-- 合作原因行！ -->
        <el-form-item label="合作原因：" prop="reason" data-tid="reason">
          <el-input
            v-model="ruleForm.reason"
            v-emoji="'textarea'"
            type="textarea"
            placeholder="说说这个客户的情况吧，对接收的规划师有帮助哦"
            maxlength="200"
            show-word-limit
            resize="none"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <!-- 提交！ -->
      <div class="footer">
        <el-button
          size="medium"
          type="primary"
          data-tid="addDetailSubmitV"
          @click="submitV('ruleForm')"
          >提交合作</el-button
        >
        <p>发起后在等待建立合作过程中将不可取消，请谨慎操作。</p>
      </div>
    </div>
    <InitiateCooperation ref="initiateCooperationRef" @reset-form="resetForm" />
  </div>
</template>
<script>
import addBusiness from './index.js';
export default addBusiness;
</script>
