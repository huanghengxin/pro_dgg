<template>
  <div class="handle-record-search-title">
    <div class="handle-record-title">
      <div class="handle-record-title-text">
        <span>操作记录</span>
        <el-button type="primary" @click="batchExport">批量导出</el-button>
      </div>
      <el-form
        ref="limitForm"
        :model="limitForm"
        label-position="left"
        class="handle-record-title-input"
      >
        <el-form-item label="操作人：">
          <el-select
            ref="select"
            v-model="limitForm.handlePeople"
            filterable
            value-key="mchUserId"
            remote
            placeholder="输入姓名/工号/联系方式"
            :remote-method="searchPlannerName"
            :loading="selectLoading"
            clearable
            @change="selectChangeHandle"
          >
            <el-option
              v-for="people in plannerList"
              :key="people.mchUserId"
              :label="people.userName + '/' + people.userCenterNo"
              :value="people"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="操作对象：">
          <el-select
            v-model="limitForm.handleObject"
            filterable
            value-key="mchUserId"
            remote
            placeholder="输入姓名/工号/联系方式"
            :remote-method="searchHandleObj"
            :loading="selectLoading"
            clearable
            @change="selectChangeHandle"
          >
            <el-option
              v-for="people in handleObjList"
              :key="people.mchUserId"
              :label="people.userName + '/' + people.userCenterNo"
              :value="people"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="限制方式：">
          <el-select v-model="limitForm.limitType">
            <el-option
              v-for="item in limitWayList"
              :key="item.value"
              :label="item.name"
              :value="item.code"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="操作动作：">
          <el-select v-model="limitForm.operationType">
            <el-option
              v-for="item in limitAction"
              :key="item.value"
              :label="item.label"
              :value="item.code"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属商户：">
          <el-select
            v-model="limitForm.merchantName"
            filterable
            value-key="mchUserId"
            remote
            placeholder="输入商户名称/商户编号"
            :remote-method="searchMerchantName"
            :loading="selectLoading"
            clearable
            @change="selectChangeHandle"
          >
            <el-option
              v-for="people in merchantList"
              :key="people.id"
              :label="people.name + '/' + people.mchNo"
              :value="people"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="操作时间：">
          <el-date-picker
            :value="operation"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            prefix-icon="el-icon-time"
            @input="timeChange($event, 'operation')"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="限制周期：">
          <el-date-picker
            :value="limit"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            prefix-icon="el-icon-time"
            @input="timeChange($event, 'limit')"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchTable">搜索</el-button>
          <el-button plain @click="clearInputValue">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="handle-record-table"></div>
  </div>
</template>
<script>
import './index.scss';
import { export_log_list, get_plat_form_user_info_list, page_list } from 'api/close-black-limit';
import { get_dictionary_data_by_parent_code } from 'api/common';
import { mutations, store } from '../../observable';
import { HANDLE_TYPE } from '../../configuration';
export default {
  data() {
    return {
      limitNumber: '',
      operation: '', //操作时间
      limit: '', //限制周期
      selectLoading: false, //搜索输入框的加载
      plannerList: [], //操作人搜索名单
      handleObjList: [], //操作对象搜索名单
      merchantList: [], //商户搜索名单
      limitForm: {
        handlePeople: undefined,
        handleObject: undefined,
        limitType: undefined,
        operationType: undefined,
        merchantName: undefined,
      },
      limitWayList: [],
      limitAction: [],
    };
  },
  mounted() {
    this.getCode('RULE_FLOW_LIMIT_TYPE'); //请求数据字典，再加载列表
    this.limitAction = Object.freeze(HANDLE_TYPE);
  },
  methods: {
    /**
     * @description 监听时间变化
     */
    timeChange(value, type) {
      this[type] = value;
      mutations.setFieldTimeParams(type, value);
    },
    /**
     * @description 批量导出
     */
    batchExport() {
      if (store.loading === true) return;
      this.limitNumber = store.handleRecordTable.total;
      if (this.limitNumber === 0) return this.$message.warning('暂无数据可以导出！');
      if (this.limitNumber > 5000)
        return this.$message.warning(
          '导出数量超过导出限定数量5000条,请使用筛选条件减少数据导出量！',
        );
      const h = this.$createElement;
      this.$messageBox({
        title: '消息',
        message: h('p', null, [
          h('i', null, '已选定 '),
          h('i', null, this.limitNumber),
          h('i', null, '条关黑限流数据，确认导出吗？'),
        ]),
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
      }).then(() => {
        store.loading = true;
        let params = store.fieldParams;
        export_log_list(params).then((res) => {
          let blob = new Blob([res], { type: 'application/vnd.ms-excel' });
          let reader = new FileReader();
          reader.onload = (readResponent) => {
            try {
              let result = readResponent.target.result;
              let resultObj = JSON.parse(result);
              this.$message.warning(resultObj.message);
            } catch (error) {
              let ANode = document.createElement('a');
              ANode.style.display = 'none';
              ANode.href = URL.createObjectURL(blob);
              ANode.download = '关黑限流操作记录.xls';
              document.body.appendChild(ANode);
              ANode.click();
              document.body.removeChild(ANode);
            }
          };
          reader.readAsText(blob);
          store.loading = false;
        });
      });
    },
    /**
     * @description 搜索数据
     */
    searchTable() {
      mutations.setFieldParams(this.limitForm);
    },
    /**
     * @description 重置
     */
    clearInputValue() {
      this.limitForm = {
        handlePeople: undefined,
        handleObject: undefined,
        limitType: undefined,
        operationType: undefined,
        merchantName: undefined,
      };
      this.limit = '';
      this.operation = '';
      this.$refs.select.focus();
      mutations.clearFieldParams();
    },
    /**
     * @description 请求数据字典，再加载列表
     * @param {}
     */
    getCode(limitCode) {
      let paramCode = {
        parentCode: limitCode,
      };
      get_dictionary_data_by_parent_code(paramCode).then((res) => {
        if (res.code === 200) this.limitWayList = Object.assign(res.data);
        let allList = { code: undefined, name: '不限' };
        this.limitWayList.unshift(allList);
      });
    },
    /**
     * @description 操作人远程搜索方法
     */
    searchPlannerName(keyword) {
      if (!keyword.trim()) return;
      this.getPeopleList(keyword, 'plannerList');
    },
    /**
     * @description 操作对象远程搜索方法
     */
    searchHandleObj(keyword) {
      if (!keyword.trim()) return;
      this.getPeopleList(keyword, 'handleObjList');
    },
    /**
     * @description 所属商户远程搜索方法
     */
    searchMerchantName(keyword) {
      if (!keyword.trim()) return;
      this.getPeopleList(keyword, 'merchantList');
    },
    /**
     * @description 限制人员搜索后选中方法
     */
    selectChangeHandle(val) {
      if (val === '') {
        this.plannerList = [];
        this.merchantList = [];
        this.handleObjList = [];
      }
    },
    /**
     * @description 获取限制人员名单
     */
    getPeopleList(keyword, type) {
      this.selectLoading = true;
      let params = {
        page: 1,
        limit: 1000,
      };
      if (type === 'plannerList') {
        params.userCenterStatus = -1;
        params.userCenterAuthStatus = '';
        params.status = -1;
        params.page = undefined;
        params.start = 1;
      }
      const regPhone = /^1[3-9]\d{9}$/;
      if (regPhone.test(keyword)) {
        params.phone = keyword;
      } else {
        params.searchKey = keyword;
      }
      const path =
        type === 'plannerList'
          ? get_plat_form_user_info_list
          : type === 'handleObjList'
          ? get_plat_form_user_info_list
          : page_list;
      path(params)
        .then((res) => {
          if (res.code === 200) {
            res = res.data;
            this[type] = res.records || [];
            this.selectLoading = false;
          } else {
            this.$message.warning(res.message);
          }
        })
        .catch(() => (this.selectLoading = false));
    },
  },
};
</script>
