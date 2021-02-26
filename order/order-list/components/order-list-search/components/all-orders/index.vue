<template>
  <el-form ref="searchForm" :model="searchForm" :rules="rules" class="search-input">
    <!-- 用户名称： -->
    <el-form-item label="用户名称：">
      <el-input
        v-model.trim="searchForm.userName"
        maxlength="50"
        placeholder="请输入用户名称"
      ></el-input>
    </el-form-item>
    <!-- 用户电话： -->
    <el-form-item label="用户电话：" prop="userPhone">
      <el-input
        v-model.trim="searchForm.userPhone"
        maxlength="11"
        placeholder="请输入电话"
      ></el-input>
    </el-form-item>
    <!-- 编号查询： -->
    <el-form-item label="编号查询：">
      <el-input
        v-model.trim="searchForm.number"
        maxlength="50"
        placeholder="客户单编号/订单编号"
      ></el-input>
    </el-form-item>
    <!-- 产品类型???默认显示全部 -->
    <el-form-item label="产品类型：">
      <el-cascader v-model="searchForm.productType" placeholder="全部" :props="props"></el-cascader>
    </el-form-item>
    <!-- 订单状态： -->
    <el-form-item label="订单状态：">
      <el-input
        v-if="searchForm.productType == ''"
        v-model="searchForm.orderStatus"
        class="order-status-disabled"
        readonly="readonly"
        @focus="orderStatusToast"
      ></el-input>
      <el-select v-else v-model="searchForm.orderStatus">
        <el-option v-for="item in orderStatus" :key="item.value" :value="item.value"> </el-option>
      </el-select>
    </el-form-item>
    <!-- 合同主体???默认显示全部 -->
    <el-form-item v-if="isMoreInput" label="合同主体：">
      <el-select v-model="searchForm.contract" filterable>
        <el-option
          v-for="item in contract"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </el-form-item>
    <!-- 签单人 -->
    <el-form-item v-if="isMoreInput" label="签单人：">
      <el-input
        v-model.trim="searchForm.signName"
        maxlength="50"
        placeholder="姓名/工号"
      ></el-input>
    </el-form-item>
    <!-- 下单区域???默认显示全部 -->
    <el-form-item v-if="isMoreInput" label="下单区域：">
      <el-select v-model="searchForm.orderArea">
        <el-option
          v-for="item in orderArea"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </el-form-item>
    <!-- 产品区域???默认显示全部 -->
    <el-form-item v-if="isMoreInput" label="产品区域：">
      <el-select v-model="searchForm.productArea">
        <el-option
          v-for="item in productArea"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </el-form-item>
    <!-- 下单时间： -->
    <el-form-item v-if="isMoreInput" label="下单时间：">
      <el-date-picker
        v-model="searchForm.orderTime"
        type="date"
        placeholder="请选择时间"
        prefix-icon="el-icon-time"
      >
      </el-date-picker>
    </el-form-item>
    <!-- 下单方式： -->
    <el-form-item v-if="isMoreInput" label="下单方式：">
      <el-select v-model="searchForm.orderWay">
        <el-option
          v-for="item in orderWay"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </el-form-item>
    <!-- 签单部门 -->
    <el-form-item v-if="isMoreInput" label="签单部门：">
      <el-select v-model="searchForm.signSection">
        <el-option
          v-for="item in signSection"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="searchList('searchForm')">搜索</el-button>
      <el-button @click="clearInputValue">重置</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { get_user_business_category } from 'api/common';
import dayjs from 'dayjs'; // 使用日期过滤
export default {
  props: {
    isMoreInput: {
      type: Boolean,
    },
  },
  data() {
    let checkUserPhone = (rule, value, callback) => {
      const regPhone = /^1[3-9]\d{9}$/;
      const flag = regPhone.test(value);
      if (!value) {
        callback();
      } else if (!flag) {
        callback('请输入正确手机号');
      } else {
        callback();
      }
    };
    return {
      searchForm: {
        userName: '',
        userPhone: '',
        number: '',
        productType: '',
        orderStatus: '全部',
        contract: '全部',
        signName: '',
        orderArea: '全部',
        productArea: '全部',
        orderTime: '',
        orderWay: '全部',
        signSection: '全部',
      },
      rules: {
        userPhone: [{ required: false, validator: checkUserPhone, trigger: 'blur' }],
      },
      //订单状态下拉选择器
      orderStatus: [
        { value: '全部' },
        { value: '未付款' },
        { value: '待分配' },
        { value: '待接收' },
        { value: '处理中' },
        { value: '待确认' },
        { value: '已完成' },
        { value: '已取消' },
      ],
      contract: [],
      orderArea: [],
      productArea: [],
      orderWay: [{ value: '全部' }, { value: '推单' }, { value: '分享' }, { value: '自主下单' }],
      signSection: [],
      //产品类型 - 动态加载级联选择器
      props: {
        lazy: true,
        lazyLoad: (node, resolve) => {
          const { level, data, value } = node;
          const params = {
            productTypeCode: data?.productTypeCode || undefined,
            code: value,
          };
          get_user_business_category(params).then((res) => {
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
     * @description 搜索数据
     */
    searchList(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.searchForm.orderTime !== '') {
            this.searchForm.orderTime = dayjs(this.searchForm.orderTime).format('YYYY-MM-DD');
          }
          console.log(this.searchForm);
        }
      });
    },
    /**
     * @description 重置数据 - 页面数据不做刷新
     */
    clearInputValue() {
      this.searchForm = {
        userName: '',
        userPhone: '',
        number: '',
        productType: '',
        orderStatus: '全部',
        contract: '全部',
        signName: '',
        orderArea: '全部',
        productArea: '全部',
        orderTime: '',
        orderWay: '全部',
        signSection: '',
      };
    },
    /**
     * @description 订单状态提示信息
     */
    orderStatusToast() {
      if (this.searchForm.productType == '') {
        this.$message.warning('请选择产品类型');
      }
    },
  },
};
</script>
