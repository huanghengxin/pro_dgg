<template>
  <div class="close-black-current-limit-page">
    <!-- 标题 -->
    <div class="close-black-current-limit-title">
      <div>
        <span>关黑限流进行中</span>
      </div>
      <el-form ref="limitForm" :model="limitForm">
        <el-form-item label="限制人员：">
          <el-select
            ref="select"
            v-model="limitForm.limitPerson"
            filterable
            value-key="mchUserId"
            remote
            placeholder="不限"
            :remote-method="remoteMethod"
            :loading="selectLoading"
            clearable
            @change="selectChangeHandle"
            @blur="handleBlue"
          >
            <el-option
              v-for="people in peopleList"
              :key="people.mchUserId"
              :label="people.userName + '/' + people.userCenterNo"
              :value="people"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属商户：">
          <el-select
            v-model="limitForm.bizPerson"
            filterable
            value-key="mchUserId"
            remote
            placeholder="不限"
            :remote-method="remoteMethod"
            :loading="selectLoading"
            clearable
            @change="selectChangeHandle"
            @blur="handleBlue"
          >
            <el-option
              v-for="people in peopleList"
              :key="people.mchUserId"
              :label="people.userName + '/' + people.userCenterNo"
              :value="people"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="search-button" @click="searchData">搜索</el-button>
          <el-button plain @click="resetInput">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 导入按钮 -->
    <div class="close-black-current-limit-button">
      <el-button type="primary" @click="openAddLimit">添加单个</el-button>
      <el-button type="primary" @click="openBatchAddLimit">批量导入</el-button>
    </div>
    <!-- 表格内容 -->
    <div class="close-black-current-limit-table list-base-ui">
      <el-table v-loading="loading" :data="closeBlackTableData" style="width: 100%">
        <template slot="empty">
          <svg-icon key="item-warp" type="nodata" icon="icon-icon_nodata" />
        </template>
        <el-table-column prop="plannerName" label="姓名" class-name="close-black-name">
          <template slot-scope="scope">
            <span>{{ scope.row.plannerName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="plannerNo" label="平台工号">
          <template slot-scope="scope">
            <span>{{ scope.row.plannerNo }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="merchantName" label="商户">
          <template slot-scope="scope">
            <span>{{ scope.row.merchantName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="limitTypeName"
          width="360px"
          label="关黑限流方式/限制程度"
          class-name="close-black-way"
        >
          <template slot-scope="scope">
            <show-tooltip
              :text="scope.row.limitTypeName"
              title-class="content-title"
              :tooltip-line-clamp="2"
              :width="320"
              tooltip-class="content-record"
            ></show-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="closeBlackHandle" label="操作" class-name="close-black-handle">
          <template slot-scope="scope">
            <span @click="openLimitDetails(scope.row)">限制详情</span>
            <span @click="openCancelLimit(scope.row)">取消</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页按钮 -->
    <div class="page-break">
      <el-pagination
        :current-page="start"
        :page-sizes="[10, 20, 30, 40, 50]"
        background
        layout="total, prev, pager, next,sizes,  jumper"
        :total="closeBlackTableDataPage"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>
    <limit-details ref="limitDetailsRefs"></limit-details>
    <cancel-limit ref="cancelLimitRefs" @cancel-limit="cancelLimit"></cancel-limit>
    <add-limit ref="addLimitRefs" @add-limit="addLimit"></add-limit>
    <batch-add-limit ref="batchAddLimitRefs" @batch-add="batchAdd"></batch-add-limit>
  </div>
</template>
<script>
import { limit_list } from 'api/close-black-current-limit';
import { get_mch_user_info_list } from 'api/common';
import store from 'storejs';
import LimitDetails from './components/limit-details';
import CancelLimit from './components/cancel-limit';
import AddLimit from './components/add-limit';
import BatchAddLimit from './components/batch-add-limit';
import ShowTooltip from 'components/show-tooltip';
import SvgIcon from 'components/svg-icon';
import './index.scss';
export default {
  components: {
    LimitDetails,
    CancelLimit,
    AddLimit,
    BatchAddLimit,
    ShowTooltip,
    SvgIcon,
  },
  data() {
    return {
      closeBlackTableData: [],
      limitForm: {
        limitPerson: '',
        bizPerson: '',
      },
      mchDetailId: '', //商户ID
      merchantId: undefined, //搜索的商户id
      plannerId: undefined, //规划师id
      selectLoading: false, //搜索输入框的加载
      peopleList: [], //远程搜索人员名单
      defaultPeopleList: [],
      accompanyInfo: {}, //供提交时传值
      loading: false,
      limit: 10, //每页显示多少条
      start: 1, //页数
      closeBlackTableDataPage: 0, //总页数
    };
  },
  created() {
    this.mchDetailId = store.get('mchInfo')?.mchDetailId || '';
  },
  mounted() {
    this.getCloseBlackTable();
  },
  methods: {
    addLimit() {
      this.getCloseBlackTable();
    },
    cancelLimit() {
      this.getCloseBlackTable();
    },
    batchAdd() {
      this.getCloseBlackTable();
    },
    /**
     * @description 搜索
     */
    searchData() {
      this.merchantId =
        this.limitForm.limitPerson.mchDetailId || this.limitForm.bizPerson.mchDetailId;
      this.plannerId = this.limitForm.limitPerson.mchUserId || this.limitForm.bizPerson.mchUserId;
      this.getCloseBlackTable();
    },
    /**
     * @description 重置
     */
    resetInput() {
      this.limitForm = {};
      this.peopleList = [];
      this.$refs.select.focus();
      this.merchantId = undefined;
      this.plannerId = undefined;
      this.getCloseBlackTable();
    },
    /**
     * @description 分页
     * @param {Number}
     */
    handleSizeChange(val) {
      //每页多少条
      this.limit = val;
      this.getCloseBlackTable();
    },
    handleCurrentChange(val) {
      //第几页
      this.start = val;
      this.getCloseBlackTable();
    },
    /**
     * @description 打开限制详情
     */
    openLimitDetails(details) {
      this.$refs.limitDetailsRefs.openModal(details);
    },
    /**
     * @description 取消关黑限流
     */
    openCancelLimit(cancelDetails) {
      this.$refs.cancelLimitRefs.openModal(cancelDetails);
    },
    /**
     * @description 添加单个限制
     */
    openAddLimit() {
      this.$refs.addLimitRefs.openModal();
    },
    /**
     * @description 批量添加
     */
    openBatchAddLimit() {
      this.$refs.batchAddLimitRefs.openModal();
    },
    /**
     * @description 获取表格数据
     */
    getCloseBlackTable() {
      this.loading = true;
      let params = {
        limit: this.limit,
        start: this.start,
        merchantId: this.merchantId,
        plannerId: this.plannerId,
      };
      limit_list(params)
        .then((res) => {
          if (res.code === 200) {
            this.closeBlackTableData = res.data.records;
            this.closeBlackTableDataPage = res.data.totalCount;
          } else {
            this.$message.warning(res.message);
          }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
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
