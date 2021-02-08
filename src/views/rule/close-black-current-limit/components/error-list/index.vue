<template>
  <div class="error-list-page">
    <div class="error-list-title">
      <div>导入关黑限流错误名单</div>
      <el-button type="primary" @click="againUpload">重新上传</el-button>
    </div>
    <div class="error-list-text">
      <span class="iconfont-qds-crm icon-surface_informationcircle"></span>
      <span>一共{{}}条数据错误，请修改后重新上传</span>
    </div>
    <div class="error-list-table">
      <el-table :data="errorListTable" style="width: 100%">
        <el-table-column prop="number" label="序号" min-width="80">
          <!-- <template slot-scope="scope">
            <span v-if="!scope.row.handleTable">{{ scope.row.number }}</span>
            <el-input v-else v-model="scope.row.number"></el-input>
          </template> -->
        </el-table-column>
        <el-table-column prop="closeBlackName" label="姓名" min-width="120px">
          <template slot-scope="scope">
            <span v-if="!scope.row.handleTable">{{ scope.row.closeBlackName }}</span>
            <el-input v-else v-model="scope.row.closeBlackName"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="closeBlackNumber" label="工号" min-width="120px">
          <template slot-scope="scope">
            <span v-if="!scope.row.handleTable">{{ scope.row.closeBlackNumber }}</span>
            <el-input v-else v-model="scope.row.closeBlackNumber"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="closeBlackBizPerson" label="商户" min-width="140px">
          <template slot-scope="scope">
            <span v-if="!scope.row.handleTable">{{ scope.row.closeBlackBizPerson }}</span>
            <el-input v-else v-model="scope.row.closeBlackBizPerson"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="limitWay" label="限制方式" min-width="160px">
          <template slot-scope="scope">
            <span v-if="!scope.row.handleTable">{{ scope.row.limitWay }}</span>
            <el-input v-else v-model="scope.row.limitWay"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="limitDegree" label="限制程度" min-width="140px">
          <template slot-scope="scope">
            <span v-if="!scope.row.handleTable">{{ scope.row.limitDegree }}</span>
            <el-input v-else v-model="scope.row.limitDegree"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="time" label="限制周期" min-width="220px">
          <template slot-scope="scope">
            <span v-if="!scope.row.handleTable">{{ scope.row.time }}</span>
            <el-date-picker
              v-else
              v-model="limitTime"
              :picker-options="pickerOptions"
              type="daterange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              prefix-icon="el-icon-time"
            >
            </el-date-picker>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注说明" min-width="160px">
          <template slot-scope="scope">
            <show-tooltip
              v-if="!scope.row.handleTable"
              :text="scope.row.remark"
              title-class="content-title"
              :width="100"
              tooltip-class="content-record"
            ></show-tooltip>
            <el-input v-else v-model="scope.row.remark"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="错误说明" min-width="160px">
          <template slot-scope="scope">
            <show-tooltip
              :text="scope.row.remark"
              title-class="content-title"
              :width="100"
              tooltip-class="content-record"
            ></show-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          prop="handle"
          label="操作"
          fixed="right"
          min-width="120px"
          class-name="error-list-handle"
        >
          <template slot-scope="scope">
            <span @click="editErrorRow(scope.row)">{{
              !scope.row.handleTable ? '修改' : '确定'
            }}</span>
            <span>取消</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <batch-add-limit ref="batchAddLimitRefs"></batch-add-limit>
  </div>
</template>
<script>
import './index.scss';
import dayjs from 'dayjs';
import { closeblack_currentlimit } from 'api/close-black-current-limit';
import ShowTooltip from 'components/show-tooltip';
import BatchAddLimit from '../batch-add-limit';
export default {
  components: {
    ShowTooltip,
    BatchAddLimit,
  },
  data() {
    return {
      errorListTable: [],
      limitTime: '',
      //禁用当前时间之前的时间
      pickerOptions: {
        disabledDate(time) {
          const day = dayjs(time);
          return day < dayjs().subtract(1, 'day');
        },
      },
    };
  },
  mounted() {
    this.getErrorListTable();
  },
  methods: {
    /**
     * @description 重新上传
     */
    againUpload() {
      this.$refs.batchAddLimitRefs.openModal();
    },
    /**
     * @description 修改表格数据
     */
    editErrorRow(row) {
      //为点击的那一行动态添加一个属性，用来判断
      this.$set(row, 'handleTable', !row.handleTable);
    },
    /**
     * @description 获取表格数据
     */
    getErrorListTable() {
      closeblack_currentlimit().then((res) => {
        this.errorListTable = res.data;
        this.errorListTable.map((item) => {
          item.time;
        });
      });
    },
  },
};
</script>
