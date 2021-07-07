<template>
  <div v-loading="loading" class="edit-source-page">
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      label-width="116px"
      label-position="left"
      class="left-content"
    >
      <el-form-item label="手机号码：" prop="customerPhone">
        <span v-if="customerPhone">{{ customerPhone || '' }}</span>
        <template v-else>
          <el-input
            v-model.trim="ruleForm.customerPhone"
            maxlength="11"
            clearable
            placeholder="请输入11位手机号码"
            data-tid="phoneBlurValidate"
            @blur="phoneBlurValidate"
          ></el-input>
          <i v-if="inputLoading" class="el-icon-loading input-loading"></i>
        </template>
      </el-form-item>
      <el-form-item label="姓名：" prop="customerName">
        <el-input
          v-model="ruleForm.customerName"
          clearable
          maxlength="20"
          data-tid="nameInput"
          placeholder="请输入客户姓名或企业名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="性别：" prop="customerSex">
        <el-radio v-model="ruleForm.customerSex" label="1" data-tid="content-radio-man"
          >男</el-radio
        >
        <el-radio v-model="ruleForm.customerSex" label="0" data-tid="content-radio-woman"
          >女</el-radio
        >
      </el-form-item>
      <el-form-item v-if="showRequire" label="客户需求：" prop="customerRequire">
        <el-cascader
          ref="customerRequireRef"
          v-model="ruleForm.customerRequire"
          clearable
          :options="optionsData"
          placeholder="请选择"
          data-tid="customerRequire"
          :props="props"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="业务区域：" prop="bizAreaCode">
        <el-select v-model="ruleForm.bizAreaCode" clearable data-tid="areaCode">
          <el-option
            v-for="(item, index) in areaList"
            :key="item.code"
            :label="item.name"
            :value="item.code"
            :data-tid="'value' + index"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="来源URL：" prop="sourceUrl">
        <el-input
          v-model.trim="ruleForm.sourceUrl"
          clearable
          maxlength="200"
          data-tid="nameInput"
          placeholder="请输入"
          @blur="urlBlurGetSource"
        ></el-input>
      </el-form-item>
      <el-form-item label="来源平台：" prop="sourceSyscode">
        <el-select
          v-model="ruleForm.sourceSyscode"
          clearable
          data-tid="bizSource"
          @change="sysListChange"
        >
          <el-option
            v-for="(item, index) in sourceSysList"
            :key="item.code"
            :label="item.name"
            :value="item.code"
            :data-tid="'value' + index"
          ></el-option>
        </el-select>
        <div class="source-text">根据填写的URL自动识别，识别错误或失败可手动选择</div>
      </el-form-item>
      <el-form-item label="一级来源渠道：" prop="firstSourceChannel">
        <el-select
          v-model="ruleForm.firstSourceChannel"
          :disabled="firstSourceList.length === 0"
          clearable
          placeholder="请先选择来源平台"
          data-tid="firstSourceChannel"
          @change="firstCodeChange"
        >
          <el-option
            v-for="(item, index) in firstSourceList"
            :key="item.code"
            :label="item.name"
            :value="item.code"
            :data-tid="'value' + index"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级来源渠道：" prop="secondSourceChannel">
        <el-select
          v-model="ruleForm.secondSourceChannel"
          :disabled="secondSourceList.length === 0"
          clearable
          placeholder="请先选择一级来源渠道"
          data-tid="secondSourceChannel"
        >
          <el-option
            v-for="(item, index) in secondSourceList"
            :key="item.code"
            :label="item.name"
            :value="item.code"
            :data-tid="'value' + index"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="关键词：" prop="keyword">
        <el-input
          v-model="ruleForm.keyword"
          clearable
          maxlength="20"
          data-tid="nameInput"
          placeholder="请输入"
        ></el-input>
      </el-form-item>
      <el-form-item label="备注：" data-tid="comment" prop="comment">
        <el-input
          v-model="ruleForm.comment"
          v-emoji="'textarea'"
          type="textarea"
          placeholder="请输入客户的需求说明"
          maxlength="200"
          show-word-limit
          resize="none"
        >
        </el-input>
      </el-form-item>
      <el-form-item v-if="!['add_source', 'complete_clue'].includes(type)" class="footer-button">
        <el-button
          size="small"
          @click="
            () => {
              $emit('close');
            }
          "
          >取 消</el-button
        >
        <el-button size="small" :loading="buttonLoading" type="primary" @click="submit"
          >确 定</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import EditResource from './index';
export default EditResource;
</script>
