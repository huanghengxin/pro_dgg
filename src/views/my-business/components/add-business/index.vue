<template>
  <div v-loading="loading" class="add-business-page">
    <!-- 头部！ -->
    <div class="title">
      <span>{{ query && query.clueId ? '转商机' : '录入商机' }}</span>
    </div>
    <!-- 内容 -->
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      label-width="100px"
      label-position="left"
      class="content"
    >
      <!-- 姓名行！ -->
      <el-form-item label="姓名：" prop="customerName">
        <!-- v-emoji="'input'" -->
        <el-input
          v-model="ruleForm.customerName"
          onkeyup="this.value=this.value.replace(/^\s+/g,'')"
          clearable
          maxlength="20"
          data-tid="nameInput"
          placeholder="请输入客户姓名或企业名称"
          class="clearable"
        ></el-input>
      </el-form-item>
      <!-- 性别行！ -->
      <el-form-item label="性别：" prop="customerSex">
        <el-radio v-model="ruleForm.customerSex" :label="1" class="content-radio-man">男</el-radio>
        <el-radio v-model="ruleForm.customerSex" :label="0">女</el-radio>
      </el-form-item>
      <!-- 手机行！ -->
      <el-form-item label="手机号码：" prop="customerPhone" class="content-phone">
        <div class="phone-warp">
          <div v-if="desensitization" key="desensitization">{{ desensitization }}</div>
          <el-input
            v-else
            key="desensitization"
            v-model.trim="ruleForm.customerPhone"
            maxlength="11"
            placeholder="请输入11位手机号码"
            data-tid="customerPhoneInput"
            @blur="phoneBlurValidate"
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
              maxlength="11"
            />
            <el-button
              :data-index="index"
              plain
              size="medium"
              icon="el-icon-delete"
              data-tid="delPhone"
              :disabled="ruleForm.phoneArray.length > 0 && Boolean(item.id)"
              @click="delPhone(index)"
            ></el-button>
          </el-form-item>
        </div>
      </transition>
      <!-- 客户需求： -->
      <el-form-item label="客户需求：" prop="customerRequire">
        <el-cascader
          ref="customerRequireRef"
          v-model="ruleForm.customerRequire"
          placeholder="请选择客户需求"
          :props="props"
        ></el-cascader>
      </el-form-item>
      <!-- 意向等级： -->
      <el-form-item prop="intentionGrade" label="意向等级：" :show-message="false" required>
        <el-rate
          v-model="ruleForm.intentionGrade"
          :max="texts.length"
          :texts="texts"
          show-text
          class="content-level"
        >
        </el-rate>
      </el-form-item>
      <!-- 业务区域： -->
      <el-form-item label="业务区域：" prop="areaCode">
        <el-select v-model="ruleForm.areaCode" class="content-beiyong-select">
          <el-option
            v-for="item in areaList"
            :key="item.value"
            :label="item.value"
            :value="item.key"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- 备注行！ -->
      <el-form-item label="备注：">
        <el-input
          v-model="ruleForm.remark"
          v-emoji="'textarea'"
          type="textarea"
          placeholder="请输入客户的需求说明"
          maxlength="200"
          show-word-limit
          resize="none"
        >
        </el-input>
      </el-form-item>
      <!-- 备用行！ -->
      <el-form-item label="备用联系人：" class="content-beiyong">
        <el-form-item prop="contactPerson.standbyName">
          <el-input
            v-model="ruleForm.contactPerson.standbyName"
            maxlength="20"
            clearable
            type="text"
            placeholder="请输入联系人姓名"
          />
        </el-form-item>
        <el-form-item prop="contactPerson.standbyPhone">
          <el-input
            v-model.trim="ruleForm.contactPerson.standbyPhone"
            :disabled="isDisabledStand"
            maxlength="11"
            clearable
            type="text"
            placeholder="请输入手机号码"
          />
        </el-form-item>
        <el-select v-model="ruleForm.contactPerson.standbySex">
          <el-option label="请选择" :value="2"></el-option>
          <el-option label="男" :value="1"></el-option>
          <el-option label="女" :value="0"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <!-- 提交！ -->
    <div class="footer">
      <el-button
        size="medium"
        type="primary"
        data-tid="addDetailSubmitV"
        @click="submitV('ruleForm')"
        >提交</el-button
      >
    </div>
  </div>
</template>
<script>
import addBusiness from './index.js';
export default addBusiness;
</script>
