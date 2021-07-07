<template>
  <div class="handle-allocation-page">
    <el-dialog
      title="分配客源"
      width="800px"
      :visible.sync="dialogTableVisible"
      :close-on-click-modal="false"
      @close="close"
    >
      <div class="handle-allocation-title">
        <span>规划师：</span>
        <el-input
          v-model="inputSearch"
          clearable
          placeholder="请输入规划师姓名/工号/手机号"
          @keyup.enter.native="handleSearch"
        ></el-input>
        <el-button size="small" type="primary" @click="handleSearch">搜 索</el-button>
      </div>
      <div v-loading="loading" class="handle-allocation-table list-base-ui">
        <el-table
          ref="singleTable"
          height="300"
          :data="tableData.records"
          style="width: 100%"
          highlight-current-row
          @current-change="checkTableRow"
        >
          <template slot="empty">
            <svg-icon key="item-warp" type="nodata" icon="icon-icon_nodata" />
          </template>
          <!-- <el-table-column width="55">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.plannerId"></el-checkbox>
            </template>
          </el-table-column> -->
          <el-table-column prop="plannerName" label="规划师">
            <template slot-scope="scope">
              <show-tooltip :text="scope.row.plannerName || '-'" :width="120"></show-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="merchantName" label="所属商户">
            <template slot-scope="scope">
              <show-tooltip :text="scope.row.merchantName || '-'" :width="120"></show-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="todayNum" label="今日已接"></el-table-column>
          <el-table-column prop="weekNum" label="本周已接"></el-table-column>
          <el-table-column prop="monthNum" label="本月已接/可接">
            <template slot-scope="scope"
              >{{ scope.row.monthNum }}/{{ scope.row.monthCanNum }}
            </template>
          </el-table-column>
        </el-table>
        <div class="footer">
          <el-pagination
            :current-page.sync="start"
            :page-size="50"
            background
            layout="total, prev, pager, next, jumper"
            :total="tableData.totalCount"
            @current-change="handleCurrentChange"
          >
          </el-pagination>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogTableVisible = false">取 消</el-button>
        <el-button size="small" :loading="buttonLoading" type="primary" @click="allocationHandle"
          >确定分配</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import './index.scss';
import SvgIcon from 'components/svg-icon';
import ShowTooltip from 'components/show-tooltip';
import { get_people_list, handle_allocated_biz, query_limit } from 'api/source-manage';
export default {
  name: 'HandleAllocation',
  components: {
    ShowTooltip,
    SvgIcon,
  },
  data() {
    return {
      loading: false,
      inputSearch: '',
      dialogTableVisible: false,
      currentRow: null,
      tableData: {},
      start: 1, //页数
      tableDataPage: 0, //总页数
      param: {
        intentionType: undefined,
        intentionCity: undefined,
      },
      bizId: '',
      buttonLoading: false,
    };
  },
  methods: {
    close() {
      this.inputSearch = '';
      this.tableData = {};
    },
    handleSearch() {
      const regPhone = /^1[3-9]\d{9}$/;
      let phone;
      if (regPhone.test(this.inputSearch)) {
        phone = this.inputSearch;
      }
      this.getTable(phone);
    },
    openModal(item) {
      this.dialogTableVisible = true;
      this.param.intentionType = item.requireCode;
      this.param.intentionCity = item.bizCityCode;
      this.bizId = item.bizId;
      this.getTable();
    },
    /**
     * @description 单个分配
     */
    async allocationHandle() {
      if (!this.currentRow) {
        this.$message.warning('请选择接收人');
        return;
      }
      const plannerId = this.currentRow?.plannerId;
      const param = {
        plannerId,
        bizId: this.bizId,
      };
      try {
        this.buttonLoading = true;
        const result = await query_limit({
          mchUserIds: [plannerId],
        });
        if (result?.code === 200) {
          if (result.data[0]?.limit > 0) {
            const messageBox = await this.$messageBox.confirm(
              '该规划师已被关黑限流是否继续分配？',
              '手动分配',
              {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                closeOnClickModal: false,
                customClass: 'add-source-box',
              },
            );
            if (messageBox === 'confirm') {
              this.handleAllocation(param);
            }
          } else {
            this.handleAllocation(param);
          }
          return;
        }
        this.$message.warning(result.message);
        this.buttonLoading = false;
      } catch (error) {
        this.buttonLoading = false;
      }
    },
    async handleAllocation(param) {
      try {
        const result1 = await handle_allocated_biz(param);
        const { code, message } = result1 || {};
        if (code === 200) {
          this.$message.success(message);
          this.dialogTableVisible = false;
          this.$emit('submit');
        } else {
          this.$message.warning(message);
        }
        this.buttonLoading = false;
      } catch (error) {
        this.buttonLoading = false;
      }
    },
    /**
     * @description 获取人员列表数据
     */
    getTable(phone) {
      const param = {
        searchKey: phone ? undefined : this.inputSearch,
        phone,
        start: this.start,
        limit: 50,
        ...this.param,
      };

      this.loading = true;
      get_people_list(param)
        .then((res) => {
          const { code, data, message } = res;
          if (code === 200) {
            this.tableData = data;
          } else {
            this.$message.warning(message);
          }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    /**
     * @description 表格的当前行选中事件
     */
    checkTableRow(val) {
      this.currentRow = val;
    },
    //第几页
    handleCurrentChange(val) {
      this.start = val;
      this.getTable();
    },
  },
};
</script>
