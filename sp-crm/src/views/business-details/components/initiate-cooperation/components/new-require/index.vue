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
        ><el-cascader
          ref="requirementRef"
          v-model="ruleForms.customerRequire"
          placeholder="请选择客户需求"
          data-tid="customerRequire"
          style="width: 300px"
          :props="props"
        ></el-cascader>
      </el-form-item>
      <!-- 业务区域 -->
      <el-form-item label="业务区域：" prop="areaCode" class="content-bizAreaCode common-style">
        <el-select
          v-model="ruleForms.areaCode"
          data-tid="bizArea"
          class="content-beiyong-select"
          style="width: 300px"
          @change="change"
        >
          <el-option
            v-for="(item, index) in areaList"
            :key="item.name"
            :label="item.name"
            :value="item.code"
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
import { get_all_businessArea, get_search } from 'api/cooperation-in-page';
export default {
  name: 'AddRequire',
  components: {},
  data() {
    return {
      dialogVisible: false,
      ruleForms: {
        customerRequire: '', //客户需求
        bizArea: '', //业务区域
        areaCode: '', //业务区域code
        areaName: '', //业务区域名称
        // name: '',
      },
      areaList: [],
      parentRequireList: [], //用于选中的需求是否重复
      rules: {
        customerRequire: [
          {
            required: true,
            message: '请选择您的需求',
            trigger: 'change',
          },
        ],
        areaCode: [{ required: true, message: '请选择业务区域', trigger: 'change' }],
      },
      props: {
        lazy: true,
        lazyLoad: (node, resolve) => {
          const { level, data, value = '' } = node;
          const params = {
            productTypeCode: data?.productTypeCode || value,
            code: value || '',
          };
          get_search(params).then((res) => {
            if (res.code === 200) {
              let { data } = res;
              data = Array.isArray(data) ? data : [];
              const _arrMap = data.map((item) => {
                return {
                  value: item.code,
                  label: item.name,
                  leaf: level >= 2,
                  productTypeCode: item.productTypeCode,
                };
              });
              resolve(_arrMap);
            } else {
              this.$message.warning(res.message);
              resolve([]);
            }
          });
        },
      },
    };
  },
  methods: {
    /**
     * @description 弹框关闭清空数据
     */
    diologHandleClose() {
      this.$refs.ruleForms.resetFields();
    },
    /**
     * @description 获取用户授权的区域范围
     */
    getAreaList() {
      const params = { a: 1 };
      get_all_businessArea(params)
        .then((res) => {
          if (res.code === 200) {
            res = res.data;
            this.areaList = res?.cityList || [];
          } else {
            this.$message.warning(res.message);
          }
        })
        .catch(() => {});
    },
    /**
     * @description 供父组件调用打开弹层
     */
    openModal(list) {
      this.getAreaList(); //地区
      //父级传的额需求列表 用于判断选择需求时是否已有该需求
      this.parentRequireList = list;
      this.dialogVisible = true;
    },
    change(val) {
      console.log(val, 'val111');
    },
    /**
     * @description 提交
     */
    submit(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const quire = this.$refs.requirementRef.getCheckedNodes();
          console.log(quire, 'quire');
          let params = this.ruleForms,
            obj = {};
          params.productTypeCode = quire[0]?.data.productTypeCode || ''; //一级产品类型
          params.requirementCode = quire[0]?.value || ''; //三级需求编码
          params.requirementName = quire[0]?.label || ''; //三级需求名称
          params.requirementParentCode = quire[0]?.parent.value || ''; //二级需求编码
          params.requirementParentName = quire[0]?.parent.label || ''; //二级需求名称
          obj.id = params.requirementCode;
          obj.intentionName = params.requirementName;
          params.areaName =
            this.areaList.find((item) => {
              //查找上次选中的数据是否包含本次数据
              return item.code === params.areaCode;
            })?.name || '';
          let flag = this.parentRequireList.find((item) => {
            return item.intentionCode == params.requirementCode;
          });
          //判断需求是否已经存在 如果存在就提示 并return
          console.log(flag, 'flag');
          if (flag != undefined) {
            this.$message.warning('需求已存在，请重新选择');
            return false;
          }
          this.$emit('init-cooperation', params, obj);
          this.dialogVisible = false;
        }
      });
    },
  },
};
</script>
