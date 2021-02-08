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
        :rules="rules"
        label-position="left"
        class="handle-record-title-input"
      >
        <el-form-item label="操作人：">
          <el-select
            v-model="limitForm.handlePeople"
            filterable
            value-key="mchUserId"
            remote
            placeholder="搜索操作人"
            :remote-method="remoteMethod"
            :loading="selectLoading"
            clearable
            @change="selectChangeHandle"
            @blur="handleBlue"
          >
            <el-option
              v-for="people in peopleList"
              :key="people.mchUserId"
              :label="people.userName + '（' + people.userCenterNo + '）'"
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
            :remote-method="remoteMethod"
            :loading="selectLoading"
            clearable
            @change="selectChangeHandle"
            @blur="handleBlue"
          >
            <el-option
              v-for="people in peopleList"
              :key="people.mchUserId"
              :label="people.userName + '（' + people.userCenterNo + '）'"
              :value="people"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="限制方式：">
          <el-select v-model="limitForm.limitWay" value-key="code">
            <el-option
              v-for="item in limitWayList"
              :key="item.value"
              :label="item.name"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="操作动作：">
          <el-select v-model="limitForm.limitAction">
            <el-option
              v-for="item in limitAction"
              :key="item.value"
              :label="item.label"
              :value="item.label"
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
            placeholder="搜索商户"
            :remote-method="remoteMethod"
            :loading="selectLoading"
            clearable
            @change="selectChangeHandle"
            @blur="handleBlue"
          >
            <el-option
              v-for="people in peopleList"
              :key="people.mchUserId"
              :label="people.userName + '（' + people.userCenterNo + '）'"
              :value="people"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="操作时间：">
          <el-date-picker
            v-model="limitForm.handleTime"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            prefix-icon="el-icon-time"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="限制周期：">
          <el-date-picker
            v-model="limitForm.limitTime"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            prefix-icon="el-icon-time"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchTable">搜索</el-button>
          <el-button @click="clearInputValue">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="handle-record-table"></div>
  </div>
</template>
<script>
import './index.scss';
import dayjs from 'dayjs';
import store from 'storejs';
import { get_mch_user_info_list, get_dictionary_data_by_parent_code } from 'api/common';
import { limit_log_list } from 'api/close-black-current-limit';
export default {
  data() {
    return {
      limitNumber: '',
      mchDetailId: '', //商户ID
      selectLoading: false, //搜索输入框的加载
      peopleList: [], //远程搜索人员名单
      defaultPeopleList: [],
      accompanyInfo: {}, //供提交时传值
      limitForm: {
        handlePeople: '',
        handleObject: '',
        limitWay: '不限',
        limitAction: '不限',
        merchantName: '',
        handleTime: '',
        limitTime: '',
      },
      rules: {},
      limitWayList: [
        {
          value: '选项1',
          label: '不限',
        },
        {
          value: '选项2',
          label: '资源',
        },
        {
          value: '选项3',
          label: '展位',
        },
        {
          value: '选项4',
          label: '合作联盟',
        },
      ],
      limitAction: [
        {
          value: '选项1',
          label: '不限',
        },
        {
          value: '选项2',
          label: '单个添加',
        },
        {
          value: '选项3',
          label: '批量导入',
        },
        {
          value: '选项4',
          label: '手动取消',
        },
        {
          value: '选项5',
          label: '自动取消',
        },
      ],
    };
  },
  created() {
    this.mchDetailId = store.get('mchInfo')?.mchDetailId || '';
  },
  mounted() {
    this.getCode('RULE_FLOW_LIMIT_TYPE'); //请求数据字典，再加载列表
  },
  methods: {
    /**
     * @description 批量导出
     */
    batchExport() {
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
      })
        .then(() => {
          this.$message({
            type: 'success',
            message: '导出成功!',
          });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消导出',
          });
        });
    },
    /**
     * @description 搜索数据
     */
    searchTable() {
      //       {
      //   "createrId": 0,  (没接口)
      //   "isAsc": true,    (不要)
      //   "limit": 0,
      //   "limitEndTime": "2021-02-08T07:25:45.254Z",
      //   "limitStartTime": "2021-02-08T07:25:45.254Z",
      //   "limitType": "string",
      //   "mchId": 0,
      //   "operationEndTime": "2021-02-08T07:25:45.254Z",
      //   "operationStartTime": "2021-02-08T07:25:45.254Z",
      //   "operationType": "string",
      //   "orderBy": "string",
      //   "plannerId": 0,
      //   "start": 0
      // }
      let params = {};
      if (this.limitForm.limitTime) {
        params.limitStartTime =
          dayjs(this.limitForm.limitTime[0]).format('YYYY-MM-DD ') + '00:00:00';
        params.limitEndTime = dayjs(this.limitForm.limitTime[1]).format('YYYY-MM-DD ') + '23:59:59';
      }
      params.limitType = this.limitForm.limitWay === '不限' ? '' : this.limitForm.limitWay.code;
      console.log(params);
    },
    /**
     * @description 重置数据 - 页面数据做刷新
     */
    clearInputValue() {
      this.limitForm = {
        handlePeople: '',
        handleObject: '',
        limitWay: '不限',
        limitAction: '全部',
        merchantName: '',
        handleTime: '',
        limitTime: '',
      };
    },
    /**
     * @description 请求数据字典，再加载列表
     * @param {}
     */
    async getCode(limitCode) {
      let paramCode = {
        parentCode: limitCode,
      };
      const result = await get_dictionary_data_by_parent_code(paramCode);
      this.limitWayList = Object.assign(result.data);
      let allList = { code: '', name: '不限' };
      this.limitWayList.unshift(allList);
    },
    /**
     * @description 远程搜索方法
     */
    remoteMethod(keyword) {
      if (!keyword.trim()) return;
      this.selectLoading = true;
      const params = {
        start: 1,
        limit: 1000,
        mchDetailId: this.mchDetailId,
      };
      const regPhone = /^1[3-9]\d{9}$/;
      if (regPhone.test(keyword)) {
        params.phone = keyword;
      } else {
        params.searchKey = keyword;
      }
      this.getPeopleList(params);
    },
    /**
     * @description 限制人员搜索后选中方法
     */
    selectChangeHandle(val) {
      if (val === '') {
        this.peopleList = this.defaultPeopleList;
      }
      this.accompanyInfo = val;
    },
    handleBlue() {
      if (this.peopleList.length === 0) {
        this.peopleList = this.defaultPeopleList;
      }
    },
    /**
     * @description 获取限制人员名单
     */
    getPeopleList(params, type) {
      get_mch_user_info_list(params)
        .then((res) => {
          if (res.code === 200) {
            res = res.data;
            this.peopleList = res.records || [];
            if (type) {
              this.defaultPeopleList = res.records;
            }
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
