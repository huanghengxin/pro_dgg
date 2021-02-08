<template>
  <div class="handle-record-table list-base-ui">
    <el-table :data="handleRecordTable" style="width: 100%">
      <template slot="empty">
        <svg-icon key="item-warp" type="nodata" icon="icon-icon_nodata" />
      </template>
      <el-table-column prop="createrName" label="操作人" min-width="90" fixed="left">
        <template slot-scope="scope">
          <span>{{ scope.row.createrName }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="操作时间" min-width="180"> </el-table-column>
      <el-table-column prop="operationTypeName" label="操作动作" min-width="120"> </el-table-column>
      <el-table-column prop="plannerName" label="操作对象" min-width="120"> </el-table-column>
      <el-table-column prop="plannerNo" label="平台工号" min-width="160"> </el-table-column>
      <el-table-column prop="merchantName" label="所属商户" min-width="140"> </el-table-column>
      <el-table-column prop="limitTypeName" label="限制方式" min-width="160"> </el-table-column>
      <el-table-column prop="limitProportion" label="限制程度" min-width="140">
        <template slot-scope="scope">
          <span>{{ scope.row.limitProportion }}%</span>
        </template>
      </el-table-column>
      <el-table-column label="限制周期" min-width="220">
        <template slot-scope="scope">
          <span>{{
            scope.row.startTime.split(' ')[0] + ' ~ ' + scope.row.endTime.split(' ')[0]
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" min-width="220">
        <template slot-scope="scope">
          <show-tooltip
            v-if="scope.row.remark"
            :text="scope.row.remark"
            title-class="content-title"
            :width="160"
            tooltip-class="content-record"
          ></show-tooltip>
          <span v-else>暂无备注</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="page-break">
      <el-pagination
        :current-page="start"
        :page-sizes="[10, 20, 30, 40, 50]"
        background
        layout="total, prev, pager, next,sizes,  jumper"
        :total="handleRecordPage"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>
  </div>
</template>
<script>
import './index.scss';
import { limit_log_list } from 'api/close-black-current-limit';
import ShowTooltip from 'components/show-tooltip';
import SvgIcon from 'components/svg-icon';
export default {
  components: {
    ShowTooltip,
    SvgIcon,
  },
  data() {
    return {
      handleRecordTable: [],
      limit: 10, //每页显示多少条
      start: 1, //页数
      handleRecordPage: 0, //总页数
    };
  },
  mounted() {
    this.getHandleRecordTable();
  },
  methods: {
    /**
     * @description 分页
     * @param {Number}
     */
    handleSizeChange(val) {
      //每页多少条
      this.limit = val;
      this.getHandleRecordTable();
    },
    handleCurrentChange(val) {
      //第几页
      this.start = val;
      this.getHandleRecordTable();
    },
    /**
     * @description 获取表格数据
     */
    getHandleRecordTable() {
      let params = {
        limit: this.limit,
        start: this.start,
      };
      limit_log_list(params).then((res) => {
        this.handleRecordTable = res.data.records;
        this.handleRecordPage = Number(res.data.totalCount) || 0;
      });
    },
  },
};
</script>
