<template>
  <el-dialog
    title="新增需求"
    custom-class="handle-log"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="480px"
    :append-to-body="true"
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
      <!-- 客户需求！ -->
      <el-form-item
        label="客户需求："
        prop="customerRequire"
        class="content-customerRequire common-style"
      >
        <el-select
          v-model="ruleForms.customerRequire"
          data-tid="cooperationType"
          class="content-beiyong-select"
        >
          <el-option
            v-for="(item, index) in typeList"
            :key="item.value"
            :label="item.value"
            :value="item.key"
            :data-tid="'value' + index"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- 业务区域 -->
      <el-form-item label="业务区域：" prop="bizAreaCode" class="content-bizAreaCode common-style">
        <el-select
          v-model="ruleForms.bizAreaCode"
          data-tid="bizAreaCode"
          class="content-beiyong-select"
        >
          <el-option
            v-for="(item, index) in areaList"
            :key="item.value"
            :label="item.value"
            :value="item.key"
            :data-tid="'value' + index"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <!-- 弹层按钮 -->
    <span slot="footer" class="footer">
      <el-button size="small" data-tid="recordsCancelButton" @click="dialogVisible = false"
        >取消</el-button
      >
      <el-button
        type="primary"
        size="small"
        data-tid="recordsCancelButton"
        @click="submit('ruleForms')"
        >确定</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
import { get_user_website } from 'api/common';
import './index.scss';
export default {
  name: 'AddRequire',
  components: {},
  data() {
    return {
      dialogVisible: false,
      loading: false,
      ruleForms: {
        customerRequire: '', //客户需求
        bizAreaCode: '', //业务区域
      },
      //合作类型
      typeList: [
        { id: 1, key: 'ZILIU', value: '自留' },
        { id: 2, key: 'WEIHU', value: '维护' },
      ],
      areaList: [],
      rules: {
        customerRequire: [
          {
            required: true,
            message: '请选择您的需求',
            trigger: 'change',
          },
        ],
        bizAreaCode: [{ required: true, message: '请选择业务区域', trigger: 'change' }],
      },
    };
  },
  created() {
    this.getAreaList(); //地区
  },
  methods: {
    /**
     * @description 弹框关闭清空数据
     */
    diologHandleClose() {},
    /**
     * @description 获取用户授权的区域范围
     */
    getAreaList() {
      get_user_website()
        .then((res) => {
          if (res.code === 200) {
            res = res.data;
            this.areaList = res?.list || [];
          } else {
            this.$message.warning(res.message);
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
    /**
     * @description 供父组件调用打开弹层
     */
    openModal() {
      this.dialogVisible = true;
    },
    /**
     * @description 提交
     */
    submit(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          console.log(this.ruleForms, 'this.ruleForms');
          this.dialogVisible = false;
        }
      });
    },
  },
};
</script>

<style></style>
