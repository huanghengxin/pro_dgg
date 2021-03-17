<template>
  <div class="dynamic-business-page">
    <div class="title">
      <span>掉库</span>
      <!-- 搜索框 -->
      <search-button
        show-word-limit
        placeholder="请输入姓名/联系方式/商机编号查询"
        data-tid="dynamicHandleInputValue"
        @search="searchUser"
        @clear="handleInputValue"
      ></search-button>
      <!-- 时间选择 -->
      <div class="title-time">
        <span>动态时间</span>
        <span
          v-for="(item, index) in time"
          :key="item.id"
          :class="{
            'filter-item': true,
            active: index === isActive,
            noActive: loading == true,
          }"
          data-tid="dynamicChangeTime"
          @click="changeTime(index)"
        >
          <span>{{ item.timing | timingFilters }}</span>
        </span>
        <el-date-picker
          v-show="isActive === 3"
          v-model="date"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          class="date-picker"
          data-tid="dynamicSureDate"
          @change="sureDate"
        >
        </el-date-picker>
      </div>
    </div>
    <!-- 内容框 -->
    <div class="list-base-ui">
      <el-table
        ref="multipleTable"
        v-loading="loading"
        :data="tableDataRecords"
        :default-sort="{ prop: 'drop_time', order: 'null' }"
        clear-sort
        data-tid="dynamicSortOrder"
        @sort-change="sortOrder"
      >
        <template slot="empty">
          <svg-icon key="item-warp" type="nodata" icon="icon-icon_nodata" />
        </template>
        <el-table-column label="姓名" fixed="left" class-name="list-selection">
          <template v-if="scope.row.customerName" slot-scope="scope">
            <show-tooltip :text="scope.row.customerName" :width="160"></show-tooltip>
            <el-rate
              v-if="scope.row.intentionLevel"
              :value="Number(scope.row.intentionLevel)"
              disabled
              disabled-void-color="transparent"
            >
            </el-rate>
            <span v-if="scope.row.getWay" class="info-text">{{ scope.row.getWay }}</span>
          </template>
        </el-table-column>
        <el-table-column label="详细需求">
          <template slot-scope="scope">
            <more-require :require-item="scope.row.requireName" />
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="联系号码">
          <template slot-scope="scope">
            <span v-text="scope.row.customerContact"></span>
          </template>
        </el-table-column>
        <el-table-column prop="drop_time" label="掉库时间/原因" sortable="custom">
          <template slot-scope="scope">
            <p v-text="scope.row.dropTime"></p>
            <p>{{ scope.row.dropType || '暂无数据' }}</p>
          </template>
        </el-table-column>
        <el-table-column prop="location" label="当前位置">
          <template slot-scope="scope">
            <span>{{ library[scope.row.library] }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="76px" class-name="list-last">
          <template slot-scope="scope">
            <span
              v-show="
                scope.row.library && ['GROUP', 'MERCHANT', 'BRAND'].includes(scope.row.library)
              "
              class="handle-blue"
              :data-tid="'dynamicPickUp' + scope.$index"
              @click="pickUp(scope.row.bizId)"
              >拾回</span
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="footer">
        <el-pagination
          :current-page="start"
          :page-sizes="[10, 20, 30, 40, 50]"
          background
          layout="total, prev, pager, next,sizes,  jumper"
          :total="tableDataPage"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        >
        </el-pagination>
      </div>
    </div>
    <show-more-require ref="showMoreRequireRefs" />
  </div>
</template>
<script>
import SearchButton from 'components/search-button';
import MoreRequire from './components/more-require';
import ShowMoreRequire from './components/show-more-require';
import ShowTooltip from 'components/show-tooltip';
import FilterTime from 'utils/filter-time'; // 使用日期过滤
import dayjs from 'dayjs'; // 使用日期过滤
import { dynamic_list, pickUp } from 'api/dynamic-business';
import { get_dictionary_data_by_parent_code } from 'api/common';
import SvgIcon from 'components/svg-icon';
import './index.scss';
export default {
  components: {
    SearchButton,
    SvgIcon,
    MoreRequire,
    ShowMoreRequire,
    ShowTooltip,
  },
  filters: {
    timingFilters(val) {
      const map = {
        day: '今日',
        seven: '7天内',
        thirty: '30天内',
      };
      return map[val] ? map[val] : '自定义时间';
    },
  },
  provide() {
    return {
      parentLoadMore: this.loadMore,
    };
  },
  data() {
    return {
      library: {}, //当前位置
      date: '', //自定义时间
      isActive: 0, //时间选择
      loading: false,
      //tab-text-动态时间
      time: [
        { id: 1, timing: 'day' },
        { id: 2, timing: 'seven' },
        { id: 3, timing: 'thirty' },
        { id: 4, timing: '自定义时间' },
      ],
      tableDataRecords: [],
      tableDataPage: 0, //总页数
      limit: 10, //每页显示多少条
      start: 1, //页数
      bizNo: undefined, //商机编号
      customerName: undefined, //用户名称
      phoneNo: undefined, //手机号
      dropTimeStart: undefined, //查询时间段开始
      dropTimeEnd: undefined, //查询时间段结束
      orderBy: undefined, //排序时间
      isAsc: undefined, //排序的顺序
    };
  },
  mounted() {
    this.getCode('rule_biz_db_code'); //请求数据字典，再加载列表
  },
  methods: {
    loadMore(val) {
      this.$refs.showMoreRequireRefs.openModal(val);
    },
    /**
     * @description 监听输入框清空
     */
    handleInputValue(content) {
      if (content == '') {
        this.$refs.multipleTable.clearSort();
        this.isAsc = undefined;
        this.orderBy = undefined;
        this.customerName = undefined;
        this.phoneNo = undefined;
        this.bizNo = undefined;
        this.getTable();
      }
    },
    /**
     * @description 分页
     * @param {Number}
     */
    handleSizeChange(val) {
      //每页多少条
      this.limit = val;
      this.getTable();
    },
    handleCurrentChange(val) {
      //第几页
      this.start = val;
      this.getTable();
    },
    /**
     * @description 拾回操作
     * @param {Object}
     */
    pickUp(rowId) {
      const params = {
        bizId: rowId,
      };
      this.$messageBox
        .confirm('请确定拾回此商机, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          customClass: 'message-box-min-height',
          closeOnClickModal: false,
        })
        .then(() => {
          pickUp(params).then(
            (res) => {
              if (res.code === 200) {
                this.$message({
                  type: 'success',
                  message: res.message,
                });
                if (this.tableDataRecords?.length == 1 && this.start != 1) {
                  this.start--;
                }
                setTimeout(() => {
                  this.getTable();
                }, 2000);
              } else {
                this.getTable();
                this.$message({
                  type: 'warning',
                  message: res.message,
                });
              }
            },
            (err) => {
              this.getTable();
            },
          );
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消拾回',
          });
        });
    },
    /**
     * @description 确定自定义时间
     * @param {String}
     */
    sureDate(val) {
      if (!val) return;
      this.start = 1;
      this.dropTimeStart = dayjs(val[0]).format('YYYY-MM-DD');
      this.dropTimeEnd = dayjs(val[1]).format('YYYY-MM-DD');
      this.getTable();
    },
    /**
     * @description 动态时间切换
     * @param {Number}
     */
    changeTime(index) {
      this.start = 1;
      this.isActive = index;
      this.$refs.multipleTable.clearSort();
      this.isAsc = undefined;
      this.orderBy = undefined;
      if (this.isActive < 3) {
        this.dropTimeStart = new FilterTime(this.time[index].timing, 'YYYY-MM-DD').time[0];
        this.dropTimeEnd = new FilterTime(this.time[index].timing, 'YYYY-MM-DD').time[1];
        this.date = '';
        this.getTable();
      }
    },
    /**
     * @description 搜索按钮
     */
    searchUser(params, content) {
      if ((this.isActive === 3 && this.date == '') || this.date === null) {
        this.changeTime(0);
      } else {
        this.start = 1;
        this.$refs.multipleTable.clearSort();
        this.isAsc = undefined;
        this.orderBy = undefined;
        this.bizNo = params.bizNo;
        this.customerName = params.customerName;
        this.phoneNo = params.phoneNo;
        this.getTable();
      }
    },
    /**
     * @description 排序查询
     * @param {Object}
     */
    sortOrder(val) {
      if (val.order == 'ascending') {
        this.isAsc = true;
        this.orderBy = val.prop;
        this.start = 1;
        this.getTable();
      } else if (val.order == 'descending') {
        this.isAsc = false;
        this.orderBy = val.prop;
        this.start = 1;
        this.getTable();
      } else {
        this.isAsc = undefined;
        this.orderBy = val.prop;
        this.start = 1;
        this.getTable();
      }
    },

    /**
     * @description 请求数据字典，再加载列表
     * @param {}
     */
    async getCode(code) {
      let paramCode = {
        parentCode: code,
      };
      const result = await get_dictionary_data_by_parent_code(paramCode);
      const obj = result.data?.reduce((acc, cur) => {
        acc[cur.code] = cur.name;
        return acc;
      }, {});
      this.library = Object.freeze(obj);
      this.changeTime(0);
    },
    /**
     * @description 请求数据
     */
    getTable() {
      this.loading = true;
      let params = {
        limit: this.limit,
        start: this.start,
        bizNo: this.bizNo,
        customerName: this.customerName,
        phoneNo: this.phoneNo,
        dropTimeStart: this.dropTimeStart,
        dropTimeEnd: this.dropTimeEnd,
        orderBy: this.orderBy,
        isAsc: this.isAsc,
      };
      dynamic_list(params)
        .then((res) => {
          if (res.code === 200) {
            res = res.data;
            if (!Array.isArray(res.records)) return;
            this.tableDataPage = Number(res.totalCount);
            this.tableDataRecords = res.records;
          } else {
            this.$message.warning(res.message);
          }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>
