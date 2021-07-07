<template>
  <div class="await-allocation-page">
    <div class="await-allocation-title">
      <div class="search-input">
        <span>客户：</span>
        <el-input
          v-model="inputName"
          maxlength="50"
          clearable
          placeholder="请输入客户姓名/联系号码/商机编号查询"
          @keyup.enter.native="searchParams"
        ></el-input>
        <span class="search-input-ml16">录入人：</span>
        <drop-select
          ref="plannerRefs"
          value-key="mchUserId"
          placeholder="请输入姓名/工号进行搜索"
          type="plannerList"
          is-dimission
          is-administrator
          data-tid="addRecordSearchPlanner"
          class="drop-select"
          @change="selectChangeHandle"
        ></drop-select>
        <span class="search-input-ml16">待分配类型：</span>
        <el-select v-model="params.allocationType">
          <el-option
            v-for="item in allocationTypeList"
            :key="item.ext1"
            :label="item.text"
            :value="item.ext1"
          >
          </el-option>
        </el-select>
      </div>
      <div class="sign-time">
        <span class="fw600">录入时间：</span>
        <span
          v-for="(item, index) in timeTagList"
          :key="index + 'time'"
          :class="{
            'filter-item': true,
            active: index === isActive,
            noActive: loading == true,
          }"
          data-tid="harassmentChangeTime"
          @click="changeTime(index)"
        >
          <span>{{ item.text }}</span>
        </span>
        <el-date-picker
          v-show="isActive === 4"
          v-model="pickerTime"
          type="daterange"
          range-separator="-"
          start-placeholder="选择开始时间"
          end-placeholder="选择结束时间"
          class="date-picker"
          data-tid="harassmentSureDate"
          @change="sureDate"
        >
        </el-date-picker>
        <el-button
          size="small"
          type="primary"
          class="search-button"
          data-tid="harassmentSearchParams"
          @click="searchParams"
          >搜 索</el-button
        >
        <el-button size="small" plain data-tid="harassmentResetParams" @click="resetParams"
          >重 置</el-button
        >
      </div>
    </div>
    <el-button size="small" :loading="buttonLoading" type="primary" @click="distribution"
      >智能分配</el-button
    >
    <div v-loading="loading" class="await-allocation-table list-base-ui">
      <el-table
        ref="multipleTable"
        :data="tableData.records"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        @select-all="selectAllClick"
      >
        <template slot="empty">
          <svg-icon key="item-warp" type="nodata" icon="icon-icon_nodata" />
        </template>
        <el-table-column type="selection" width="44" class-name="list-selection"> </el-table-column>
        <el-table-column prop="bizNo" label="商机编号" min-width="200" class-name="list-name">
          <template slot-scope="scope">
            {{ scope.row.bizNo || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="customerName" label="客户姓名" min-width="120">
          <template slot-scope="scope">
            <show-tooltip :text="scope.row.customerName || '-'" :width="80"></show-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="customerPhone" label="联系号码" min-width="160">
          <template slot-scope="scope">
            {{ scope.row.customerPhone || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="requireName" label="客户需求/区域" min-width="180">
          <template slot-scope="scope">
            <show-tooltip :text="handleRequireName(scope.row) || '-'" :width="140"></show-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="awaitAllocatedType" label="待分配类型" min-width="140">
          <template slot-scope="scope">
            {{ allocationType[scope.row.awaitAllocatedType] }}
          </template>
        </el-table-column>
        <el-table-column prop="comment" label="备注" min-width="180">
          <template slot-scope="scope">
            <show-tooltip :text="scope.row.comment || '-'" :width="140"></show-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="sourceSyscode" label="来源平台" min-width="140">
          <template slot-scope="scope">
            {{ scope.row.sourceSyscode || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="sourceUrl" label="来源URL" min-width="280">
          <template slot-scope="scope">
            <show-tooltip :text="scope.row.sourceUrl || '-'" :width="240"></show-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="keyword" label="关键词" min-width="120">
          <template slot-scope="scope">
            <show-tooltip :text="scope.row.keyword || '-'" :width="80"></show-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="inputPeople" label="录入人" min-width="220">
          <template slot-scope="scope">
            <show-tooltip :text="scope.row.inputPeople || '-'" :width="180"></show-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="inputTime" label="录入时间" min-width="200">
          <template slot-scope="scope">
            {{ scope.row.inputTime || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="140" class-name="list-last">
          <template slot-scope="scope">
            <div class="list-handle">
              <p
                class="list-handle_follow"
                :data-tid="'publicListHandleClick' + scope.$index"
                @click="handleAllocation(scope.row)"
              >
                手动分配
              </p>
              <el-dropdown
                trigger="click"
                :data-tid="'handleCommand' + scope.$index"
                @command="handleCommand"
              >
                <p class="list-handle_more">更多</p>
                <el-dropdown-menu slot="dropdown" class="list-handle-more-item">
                  <el-dropdown-item
                    :data-tid="'callPhone' + scope.$index"
                    :command="{ component: 'autoAllocation', item: scope.row }"
                    >智能分配</el-dropdown-item
                  >
                  <el-dropdown-item
                    :data-tid="'remark' + scope.$index"
                    :command="{ component: 'edit', item: scope.row }"
                    >编辑</el-dropdown-item
                  >
                  <el-dropdown-item
                    :data-tid="'callPhone' + scope.$index"
                    :command="{ component: 'delSource', item: scope.row }"
                    >删除</el-dropdown-item
                  >
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="footer">
        <el-pagination
          :current-page.sync="params.start"
          :page-sizes="[10, 20, 30, 40, 50]"
          background
          layout="total, prev, pager, next,sizes,jumper"
          :total="tableData.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        >
        </el-pagination>
      </div>
    </div>
    <el-dialog
      title="编辑客源"
      width="680px"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      custom-class="edit-source-dialog"
      @close="dialogClose"
    >
      <edit-source
        ref="editSourceRef"
        type="update_business"
        @update="update"
        @close="dialogVisible = false"
      ></edit-source>
    </el-dialog>
    <handle-allocation ref="handleAllocationRef" @submit="submit"></handle-allocation>
  </div>
</template>
<script>
import './index.scss';
import DropSelect from 'components/drop-select';
import ShowTooltip from 'components/show-tooltip';
import SvgIcon from 'components/svg-icon';
import EditSource from '../components/edit-source/index.vue';
import HandleAllocation from '../components/handle-allocation';
import dayjs from 'dayjs'; // 使用日期过滤
import FilterTime from 'utils/filter-time'; // 使用日期过滤
import callMixins from 'utils/mixins/callMixins';
import { AWAIT_ALLOCATION_TYPE, UNLIMITED_TIME_TAG } from 'constants/constants';
import { get_requirement_info } from 'api/common';
import {
  get_await_allocated_list,
  delete_biz,
  add_to_smart_allot,
  add_one_to_smart_allot,
} from 'api/source-manage';
import { getQueryString } from 'utils/helper';
import { golbalSearchAddParams } from 'utils/index';
export default {
  name: 'AwaitAllocation',
  components: {
    ShowTooltip,
    SvgIcon,
    DropSelect,
    EditSource,
    HandleAllocation,
  },
  mixins: [callMixins],
  data() {
    return {
      params: {
        allocationType: undefined,
        start: 1, //页数
      },
      limit: 10, //每页显示多少条
      inputName: '',
      pickerTime: '',
      reset: false,
      isActive: 0,
      dialogVisible: false,
      loading: false,
      buttonLoading: false,
      allocationTypeList: [], //待分配类型
      tableData: [],
      multipleSelection: [],
      allocationType: {
        0: '新增待分配',
        1: '拾回待分配',
        2: '掉库待分配',
        3: '智能退回待分配',
      },
    };
  },
  computed: {
    timeTagList() {
      return UNLIMITED_TIME_TAG;
    },
  },
  created() {
    this.allocationTypeList = Object.freeze(AWAIT_ALLOCATION_TYPE);
    let query = new getQueryString();
    if (query.bizNo) {
      this.reset = true;
      this.inputName = query.bizNo;
      this.searchParams(true);
    } else {
      this.getTable();
    }
  },
  methods: {
    dialogClose() {
      this.$refs.editSourceRef.reset();
    },
    update() {
      this.getTable();
      this.dialogVisible = false;
    },
    submit() {
      this.resetParam();
      if (this.tableData.records?.length == 1 && this.params.start != 1) {
        this.params.start--;
      }
      this.getTable();
    },
    resetParam() {
      if (this.reset) {
        this.inputName = '';
        this.params.bizNo = undefined;
        this.delUrl();
      }
    },
    /**
     * @description 多选智能分配
     */
    distribution() {
      this.buttonLoading = true;
      if (this.multipleSelection.length === 0) {
        this.$message.warning('请勾选商机');
        this.buttonLoading = false;
        return;
      }
      const h = this.$createElement;
      this.$messageBox({
        title: '提示',
        message: h('p', null, [
          h('i', null, '已选定 '),
          h('i', { style: 'color: #E6A23C' }, this.multipleSelection.length),
          h('i', null, ' 条商机进行智能分配！'),
        ]),
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
      })
        .then(() => {
          const param = {
            list: (this.multipleSelection || []).map((i) => i.bizId),
          };
          this.distrib(param);
        })
        .catch(() => {
          this.buttonLoading = false;
          return;
        });
    },
    /**
     * @description 智能分配批量
     */
    distrib(param) {
      add_to_smart_allot(param).then(async (res) => {
        const { code, data, message } = res || {};
        if (code === 200) {
          const h = this.$createElement;
          this.buttonLoading = false;
          try {
            await this.$messageBox({
              title: '提示',
              message: h('p', null, [
                h('i', { style: 'color: #67c23a' }, data.success),
                h('i', null, ' 条商机正在自动分配中！'),
                h('i', { style: 'color: #f56c6c' }, data.failure),
                h('i', null, ' 条商机自动分配失败！'),
              ]),
              confirmButtonText: '确定',
              closeOnClickModal: false,
            });
          } catch (err) {
            //防止报错
          } finally {
            this.resetParam();
            this.getTable();
          }
          return;
        }
        this.$message.warning(message);
        this.buttonLoading = false;
      });
    },
    /**
     * @description 智能分配单个
     */
    distribOne(param) {
      add_one_to_smart_allot(param)
        .then((res) => {
          if (res.code === 200) {
            this.$message.success(res.message);
            this.getTable();
          } else {
            this.$message.warning(res.message);
          }
        })
        .catch(() => {});
    },
    /**
     * @description 删除
     */
    del(param) {
      delete_biz(param).then((res) => {
        const { code, message } = res || {};
        if (code === 200) {
          if (this.tableData.records?.length == 1 && this.params.start != 1) {
            this.params.start--;
          }
          this.resetParam();
          this.getTable();
          this.$message.success(message);
          return;
        }
        this.$message.warning(message);
      });
    },
    /**
     * @description 表格全选
     */
    selectAllClick(row) {
      //
    },
    /**
     * @description 表格CheckBox
     */
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    /**
     * @description 处理客户需求/区域
     */
    handleRequireName(item) {
      try {
        let reqName = JSON.parse(item.requireName);
        return reqName
          .map((i) => {
            return (i.intentionName || '-') + '/' + (item.bizCityName || '-');
          })
          .join('、');
      } catch (error) {
        return '-' + '/' + (item.bizCityName || '-');
      }
    },
    /**
     * @description 手动分配
     */
    handleAllocation(row) {
      this.$refs.handleAllocationRef.openModal(row);
    },
    /**
     * @description 点击操作栏下拉选项
     */
    handleCommand(command) {
      const obj = {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false,
        customClass: 'message-box-icon',
      };
      switch (command.component) {
        case 'autoAllocation':
          this.$messageBox
            .confirm(
              '请确认是否进入智能分配，操作后将自动分配到企大顺规划师库中。',
              '转为智能分配',
              obj,
            )
            .then(() => {
              const param = {
                resourceId: command.item.bizId,
              };
              this.distribOne(param);
            });
          break;
        case 'edit':
          this.edit(command.item);
          break;
        default:
          this.$messageBox
            .confirm('请确认是否删除此客源，确认后客源将永久删除无法恢复。', '无效客源', obj)
            .then(() => {
              const param = {
                id: command.item.bizId,
              };
              this.del(param);
            })
            .catch(() => {});
          break;
      }
    },
    /**
     * @description 获取列表数据
     */
    getTable(bol) {
      this.loading = true;
      get_await_allocated_list({
        ...this.params,
        limit: this.limit,
        ...golbalSearchAddParams(this.inputName),
      })
        .then((res) => {
          if (res.code === 200) {
            this.tableData = res.data;
            if (res.data.records?.length === 0 && typeof bol === 'boolean') {
              this.$message.warning('该商机已被删除或已分配！');
            }
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
     * @description 搜索
     */
    searchParams(bol) {
      this.params.start = 1;
      this.getTable(bol);
    },
    delUrl() {
      // 删除地址栏参数,录入客源跳转
      let url = window.location.href;
      window.location.href = url.split('?')[0]; //页面url
      this.$refs.plannerRefs.resetInput();
    },
    edit(item) {
      get_requirement_info({
        bizId: item.bizId,
      })
        .then((res) => {
          if (res.code !== 200) {
            this.$message.warning(res.message);
            return;
          }
          const data = res.data ? res.data[0] : [];
          if (!data) {
            this.$message.warning('商机已不存在');
            this.getTable();
            return;
          }
          item.productType = data.productType;
          item.parentCode = data.parentCode;
          item.intentionCode = data.intentionCode;
          this.dialogVisible = true;
          this.$nextTick(() => {
            this.$refs.editSourceRef.openModal(item);
          });
        })
        .catch(() => {
          //
        });
    },
    /**
     * @description 重置
     */
    resetParams() {
      this.reset = false;
      this.params = {
        allocationType: undefined,
        start: 1,
      };
      this.inputName = '';
      this.pickerTime = '';
      this.isActive = 0;
      this.delUrl();
      this.getTable();
    },
    /**
     * @description 标记时间切换
     */
    changeTime(index) {
      this.params.start = 1;
      const params = this.params;
      this.isActive = index;
      if (index === 4) return;
      if (index === 0) {
        params.createStartTime = undefined;
        params.createEndTime = undefined;
        this.getTable();
      } else {
        params.createStartTime =
          new FilterTime(this.timeTagList[index].ext1, 'YYYY-MM-DD').time[0] + ' 00:00:00';
        params.createEndTime =
          new FilterTime(this.timeTagList[index].ext1, 'YYYY-MM-DD').time[1] + ' 23:59:59';
        this.getTable();
      }
      this.pickerTime = '';
    },
    /**
     * @description 确认自定义时间
     */
    sureDate(val) {
      if (!val) {
        this.params.createStartTime = undefined;
        this.params.createEndTime = undefined;
        return;
      }
      this.params.createStartTime = dayjs(val[0]).format('YYYY-MM-DD 00:00:00');
      this.params.createEndTime = dayjs(val[1]).format('YYYY-MM-DD 23:59:59');
      // this.getTable();
    },
    /**
     * @description 搜索后选中方法
     */
    selectChangeHandle(val) {
      this.params.createrId = val?.mchUserId || undefined;
    },
    /**
     * @description 分页
     * @param {Number}
     */
    //每页多少条
    handleSizeChange(val) {
      this.limit = val;
      this.getTable();
    },
    //第几页
    handleCurrentChange(val) {
      this.params.start = val;
      this.getTable();
    },
  },
};
</script>
