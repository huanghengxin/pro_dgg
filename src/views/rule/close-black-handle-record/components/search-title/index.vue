<template>
  <div class="handle-record-search-title">
    <div class="handle-record-title">
      <div class="handle-record-title-text">
        <span>操作记录</span>
        <el-button
          v-permission="['batchExport']"
          type="primary"
          data-tid="recordPageBatchExport"
          @click="batchExport"
          >批量导出</el-button
        >
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
            v-loadmore="'plannerList'"
            filterable
            value-key="mchUserId"
            remote
            placeholder="输入姓名/工号/联系方式"
            :remote-method="searchPlannerName"
            :loading="selectLoading"
            clearable
            popper-class="limit-select"
            :popper-append-to-body="false"
            data-tid="recordPageSearchPlanner"
            @change="selectChangeHandle"
            @focus="resetStart"
          >
            <el-option
              v-for="people in plannerList"
              :key="people.mchUserId"
              :label="people.userName + '/' + people.userCenterNo"
              :value="people"
            >
              <show-tooltip
                :text="people.userName + '/' + people.userCenterNo"
                title-class="content-title"
                :width="242"
                tooltip-class="content-record"
              ></show-tooltip>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="操作对象：">
          <el-select
            v-model="limitForm.handleObject"
            v-loadmore="'handleObjList'"
            filterable
            value-key="mchUserId"
            remote
            placeholder="输入姓名/工号/联系方式"
            :remote-method="searchHandleObj"
            :loading="selectLoading"
            clearable
            popper-class="limit-select"
            :popper-append-to-body="false"
            data-tid="recordPageSearchHandleObj"
            @change="selectChangeHandle"
            @focus="resetStart"
          >
            <el-option
              v-for="people in handleObjList"
              :key="people.mchUserId"
              :label="people.userName + '/' + people.userCenterNo"
              :value="people"
            >
              <show-tooltip
                :text="people.userName + '/' + people.userCenterNo"
                title-class="content-title"
                :width="242"
                tooltip-class="content-record"
              ></show-tooltip>
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
        <el-form-item v-permission="['merchantSearch']" label="商户：">
          <el-select
            v-model="limitForm.merchantName"
            v-loadmore="'merchantList'"
            filterable
            value-key="id"
            remote
            placeholder="输入商户名称/商户编号"
            :remote-method="searchMerchantName"
            :loading="selectLoading"
            clearable
            popper-class="limit-select"
            :popper-append-to-body="false"
            data-tid="recordPageSearchMerchant"
            @change="selectChangeHandle"
            @focus="resetStart"
          >
            <el-option
              v-for="people in merchantList"
              :key="people.id"
              :label="people.name + '/' + people.mchNo"
              :value="people"
            >
              <show-tooltip
                :text="people.name + '/' + people.mchNo"
                title-class="content-title"
                :width="242"
                tooltip-class="content-record"
              ></show-tooltip>
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
            data-tid="recordPageTimeChange"
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
            data-tid="recordPageTimeChange"
            @input="timeChange($event, 'limit')"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" data-tid="recordPageSearchTable" @click="searchTable"
            >搜索</el-button
          >
          <el-button plain data-tid="recordPageClearInputValue" @click="clearInputValue"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <div class="handle-record-table"></div>
  </div>
</template>
<script>
import './index.scss';
import scrollLoad from 'utils/mixins/scrollLoad';
import ShowTooltip from 'components/show-tooltip';
import { export_log_list } from 'api/close-black-limit';
import { get_dictionary_data_by_parent_code } from 'api/common';
import { mutations, store } from '../../observable';
import { HANDLE_TYPE } from '../../configuration';
export default {
  name: 'CloseBlackHandleRecordTitle',
  components: {
    ShowTooltip,
  },
  mixins: [scrollLoad],
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
      limitWayList: [], //限制方式
      limitAction: [], //操作动作
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
      if (this.limitNumber === 0) {
        this.$message.warning('暂无数据！');
        return;
      }
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
        export_log_list(params)
          .then((res) => {
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
          })
          .catch(() => {
            store.loading = false;
          });
      });
    },
    /**
     * @description 搜索数据
     */
    searchTable() {
      mutations.setFieldParams(this.limitForm);
      this.$eventBus.$emit('reset-start');
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
      this.plannerList = [];
      this.handleObjList = [];
      this.merchantList = [];
      this.$refs.select.focus();
      mutations.clearFieldParams();
      this.$eventBus.$emit('reset-start');
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
        const allList = { code: undefined, name: '不限' };
        this.limitWayList.unshift(allList);
      });
    },
    /**
     * @description 重置start
     */
    resetStart() {
      this.optionPage = 1;
    },
    /**
     * @description 操作人远程搜索方法
     */
    searchPlannerName(keyword) {
      if (!keyword.trim()) return;
      this.optionKey = keyword.trim();
      this.getPeopleList(keyword.trim(), 'plannerList');
    },
    /**
     * @description 操作对象远程搜索方法
     */
    searchHandleObj(keyword) {
      if (!keyword.trim()) return;
      this.optionKey = keyword.trim();
      this.getPeopleList(keyword.trim(), 'handleObjList');
    },
    /**
     * @description 商户远程搜索方法
     */
    searchMerchantName(keyword) {
      if (!keyword.trim()) return;
      this.optionKey = keyword.trim();
      this.getPeopleList(keyword.trim(), 'merchantList');
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
  },
};
</script>
