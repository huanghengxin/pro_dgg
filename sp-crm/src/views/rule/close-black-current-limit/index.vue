<template>
  <div class="close-black-current-limit-page">
    <!-- 标题 -->
    <div class="close-black-current-limit-title">
      <div>
        <span>关黑限流进行中</span>
      </div>
      <el-form>
        <el-form-item label="限制人员：">
          <drop-select
            ref="plannerRefs"
            key="planner"
            value-key="mchUserId"
            placeholder="输入姓名/工号/联系方式"
            type="plannerList"
            auto-focus
            data-tid="limitPageSearchPlanner"
            @change="selectChangeHandle"
          ></drop-select>
        </el-form-item>
        <el-form-item v-permission="['merchantSearch']" label="商户：">
          <drop-select
            ref="merchantRefs"
            key="merchant"
            value-key="id"
            placeholder="输入商户名称/商户编号"
            type="merchantList"
            data-tid="limitPageSearchMerchant"
            @change="selectChangeHandle"
          ></drop-select>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            class="search-button"
            data-tid="limitPageSearchData"
            @click="searchData"
            >搜索</el-button
          >
          <el-button plain data-tid="limitPageResetInput" @click="resetInput">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 导入按钮 -->
    <div class="close-black-current-limit-button">
      <el-button
        v-permission="['addLimit']"
        type="primary"
        data-tid="limitPageOpenAddLimit"
        @click="openAddLimit"
        >添加单个</el-button
      >
      <el-button
        v-permission="['batchAddLimit']"
        type="primary"
        data-tid="limitPageOpenBatchAddLimit"
        @click="openBatchAddLimit"
        >批量导入</el-button
      >
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
            <show-tooltip
              :text="scope.row.merchantName"
              title-class="content-title"
              :width="100"
              tooltip-class="content-record"
            ></show-tooltip>
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
            <span :data-tid="'openLimitDetails' + scope.$index" @click="openLimitDetails(scope.row)"
              >限制详情</span
            >
            <span
              v-permission="['cancelLimit']"
              :data-tid="'openCancelLimit' + scope.$index"
              @click="openCancelLimit(scope.row)"
              >取消</span
            >
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
        :total="closeBlackTotal"
        data-tid="limitPageHandlePageBreak"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>
    <limit-details
      ref="limitDetailsRefs"
      data-tid="updateList"
      @update-list="updateList"
    ></limit-details>
    <cancel-limit
      ref="cancelLimitRefs"
      data-tid="updateList"
      @update-list="CancelLimit"
    ></cancel-limit>
    <add-limit ref="addLimitRefs" data-tid="updateList" @update-list="updateList"></add-limit>
    <batch-add-limit
      ref="batchAddLimitRefs"
      data-tid="updateList"
      @update-list="updateList"
    ></batch-add-limit>
  </div>
</template>
<script>
import { limit_list, cancel_limit, limit_detail } from 'api/close-black-limit';
import LimitDetails from './components/limit-details';
import CancelLimit from './components/cancel-limit';
import AddLimit from './components/add-limit';
import BatchAddLimit from './components/batch-add-limit';
import ShowTooltip from 'components/show-tooltip';
import SvgIcon from 'components/svg-icon';
import DropSelect from 'components/drop-select';
import './index.scss';
export default {
  name: 'CloseBlackCurrentLimit',
  components: {
    LimitDetails,
    CancelLimit,
    AddLimit,
    BatchAddLimit,
    ShowTooltip,
    SvgIcon,
    DropSelect,
  },
  data() {
    return {
      closeBlackTableData: [],
      loading: false,
      closeBlackTotal: 0, //总条数
      limit: 10, //每页显示多少条
      start: 1, //页数
      params: {
        plannerId: undefined, //规划师id
        mchId: undefined, //商户id
      },
    };
  },
  mounted() {
    this.getCloseBlackTable();
  },
  methods: {
    CancelLimit(checkListDetails, limitWayDetails) {
      if (
        this.closeBlackTableData?.length == 1 &&
        this.start != 1 &&
        checkListDetails.length == limitWayDetails.length
      ) {
        this.start--;
      }
      this.getCloseBlackTable();
    },
    updateList() {
      this.start = 1;
      this.getCloseBlackTable();
    },
    /**
     * @description 搜索
     */
    searchData() {
      this.start = 1;
      this.getCloseBlackTable();
    },
    /**
     * @description 重置
     */
    resetInput() {
      this.params = {};
      this.start = 1;
      this.$refs.plannerRefs.resetInput();
      this.$refs.merchantRefs.resetInput();
      this.getCloseBlackTable();
    },
    /**
     * @description 分页
     * @param {Number}
     */
    //每页多少条
    handleSizeChange(val) {
      this.limit = val;
      this.getCloseBlackTable();
    },
    //第几页
    handleCurrentChange(val) {
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
      const limitTypeList = cancelDetails.limitTypeName.split('、');
      if (limitTypeList.length > 1) {
        this.$refs.cancelLimitRefs.openModal(cancelDetails);
      } else {
        this.$messageBox
          .confirm(
            '取消' + cancelDetails.limitTypeName?.replace(/(\(.+\))|(（.+）)/, ''),
            '取消关黑限流',
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
              customClass: 'danger-limit-way',
              closeOnClickModal: false,
            },
          )
          .then(() => {
            this.loading = true;
            let detailsParams = { plannerId: cancelDetails.plannerId };
            let cancelParams = [];
            limit_detail(detailsParams)
              .then((res) => {
                if (res.code !== 200) {
                  this.$message.warning(res.message);
                  this.loading = false;
                } else {
                  if (Array.isArray(res.data) && res.data.length === 0) {
                    this.$message.warning('此限制方式已经被取消了！');
                    this.loading = false;
                    this.getCloseBlackTable();
                    return;
                  }
                  cancelParams.push(res.data[0].id);
                  this.cancelLimit(cancelParams);
                }
              })
              .catch(() => {
                this.loading = false;
              });
          });
      }
    },
    cancelLimit(cancelParams) {
      cancel_limit(cancelParams)
        .then((res) => {
          if (res.code === 200) {
            this.$message.success(res.message);
            if (this.closeBlackTableData?.length == 1 && this.start != 1) {
              this.start--;
            }
            this.getCloseBlackTable();
          } else {
            this.$message.warning(res.message);
            this.loading = false;
          }
        })
        .catch(() => {
          this.loading = false;
        });
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
      let params = this.params;
      params.limit = this.limit;
      params.start = this.start;
      limit_list(params)
        .then((res) => {
          if (res.code === 200) {
            this.closeBlackTableData = res.data.records;
            this.closeBlackTotal = res.data.totalCount;
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
     * @description 限制人员搜索后选中方法
     */
    selectChangeHandle(val, type) {
      if (type === 'plannerList') {
        this.params.plannerId = val.mchUserId;
      } else {
        this.params.mchId = val.id;
      }
    },
  },
};
</script>
