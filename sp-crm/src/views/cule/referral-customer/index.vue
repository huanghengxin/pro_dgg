<template>
  <div class="prospective">
    <div class="prospective__search">
      <div class="prospective__search-tab">
        <span>我接收的</span>
      </div>
      <div class="prospective__search-from">
        <span class="lable">接收时间</span>
        <span
          v-for="(item, index) in receiveTime"
          :key="item.code"
          :class="{
            'filter-item': true,
            'filter-item_active': item.code === receiveCode,
          }"
          data-tid="customerChooseTime"
          @click="chooseTime(item, index)"
        >
          {{ item.name }}
        </span>
        <el-date-picker
          v-show="receiveCode === 'QDS_PAGE_TIME_SEARCH_TWO_CUSTOM'"
          v-model="times"
          type="datetimerange"
          size="small"
          clearable
          range-separator="-"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          :default-time="['00:00:00', '23:59:59']"
          data-tid="customerSureTimes"
          @change="sureTimes"
        >
        </el-date-picker>
      </div>
    </div>
    <div class="prospective__main">
      <div class="prospective__main-warp list-base-ui">
        <el-table
          ref="tableRef"
          v-loading="loading"
          :data="potentialCustomerList"
          clear-sort
          :default-sort="{ prop: 'null', order: 'null' }"
          max-height="600"
          data-tid="customerSortList"
          @sort-change="sortList"
        >
          <template slot="empty">
            <svg-icon key="item-warp" type="nodata" icon="icon-icon_nodata" />
          </template>
          <el-table-column
            prop="customerName"
            min-width="150"
            fixed="left"
            label="姓名"
            class-name="list-selection"
          >
            <template slot-scope="scope">
              <div>
                <show-tooltip
                  v-if="scope.row.customerName"
                  :text="scope.row.customerName"
                  :width="110"
                ></show-tooltip>
                <span v-else>暂无数据</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="联系号码" min-width="150">
            <template slot-scope="scope">
              <show-tooltip
                v-if="scope.row.customerContact"
                :text="scope.row.customerContact"
                :width="110"
              ></show-tooltip>
              <span v-else>暂无数据</span>
            </template>
          </el-table-column>
          <el-table-column label="客户需求" min-width="110">
            <template v-if="scope.row.requireName" slot-scope="scope">
              <more-require
                :require-item="scope.row.requireName"
                :require-progress="scope.row.requireProgress"
                is-separate
              />
            </template>
            <span v-else>暂无数据</span>
          </el-table-column>
          <el-table-column label="转介绍人" min-width="200">
            <template slot-scope="scope">
              <show-tooltip
                v-if="scope.row.inputPlannerName"
                :text="scope.row.inputPlannerName"
                :width="180"
              ></show-tooltip>
              <span v-else>暂无数据</span>
            </template>
          </el-table-column>
          <el-table-column label="发起时间" sortable="custom" min-width="120">
            <template slot-scope="scope">
              <span v-if="scope.row.sponsorTime">{{ scope.row.sponsorTime | filterTime }}</span>
              <span v-else>暂无数据</span>
            </template>
          </el-table-column>
          <el-table-column label="接收时间" sortable="custom" min-width="180">
            <template slot-scope="scope">
              <span v-if="scope.row.receiveTime">{{ scope.row.receiveTime }}</span>
              <span v-else>暂无数据</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="100" class-name="list-last">
            <template slot-scope="scope">
              <p class="list-handle_follow" @click="listHandleClick(scope.row)">查看商机</p>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-footer">
          <el-pagination
            background
            :current-page="param.start"
            :page-size="param.limit"
            :page-sizes="[10, 50, 100, 150]"
            layout="total, prev, pager, next, sizes, jumper"
            :total="param.total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          >
          </el-pagination>
        </div>
      </div>
    </div>
    <show-more-require ref="showMoreRequireRefs" />
  </div>
</template>

<script>
import './index.scss';
import FilterTime from 'utils/filter-time'; // 使用日期过滤
import ShowTooltip from 'components/show-tooltip';
import SvgIcon from 'components/svg-icon';
import { get_referral_business_list } from 'api/cule';
import { get_dictionary_data_by_parent_code } from 'api/common';
import MoreRequire from 'views/dynamic-business/components/more-require';
import dayjs from 'dayjs';
import ShowMoreRequire from 'views/dynamic-business/components/show-more-require';
export default {
  components: {
    ShowTooltip,
    SvgIcon,
    MoreRequire,
    ShowMoreRequire,
  },
  filters: {
    statusFormat(val) {
      const map = {
        QDS_CLUE_STATUS_NOT: '未联系',
        QDS_CLUE_STATUS_ALREADY: '已联系',
      };
      return map[val];
    },
    filterTime(val) {
      return val ? dayjs(val).format('YYYY-MM-DD') : '';
    },
  },

  provide() {
    return {
      parentLoadMore: this.loadMore,
    };
  },
  data() {
    return {
      action: 1,
      times: [],
      loading: false,
      receiveTime: [], //接收时间
      receiveCode: 'QDS_PAGE_TIME_SEARCH_TWO_UNLIMITED',
      sattfs: [], //员工
      businessStatue: [], //商机状态
      potentialCustomerList: [], //列表数据
      total: 0,
      param: {
        endTime: '',
        isAsc: '',
        limit: 10,
        orderBy: '',
        start: 1,
        startTime: '',
      },
      // searchPage: 1,
    };
  },
  created() {
    this.getReferralCustomerList(this.param);
    // 时间数据字典
    this.getDictionary('QDS_PAGE_TIME_SEARCH_TWO');
  },
  mounted() {},
  methods: {
    /**
     * @description 点击更多-加载更多
     */
    loadMore(val) {
      this.$refs.showMoreRequireRefs.openModal(val);
    },
    /**
     * @description 监听子组件的事件跟进响应成功后刷新列表
     */
    submitHandle(val) {
      this.getReferralCustomerList(this.param);
    },
    /**
     * @description 排序查询
     */
    sortList(val) {
      const map = {
        receiveTime: '1',
        sponsorTime: '2',
      };
      if (map[val.prop]) {
        if (val.order) {
          this.ruleForm.orderBy = map[val.prop];
          this.ruleForm.isAsc = val.order === 'descending' ? 1 : 0;
        } else {
          this.ruleForm.orderBy = '1';
          this.ruleForm.isAsc = 0;
        }
      }

      this.getReferralCustomerList(this.param);
    },
    /**
     * @description 清楚排序
     */
    sortClear() {
      this.$refs.tableRef.clearSort();
      this.param.isAsc = 0;
      this.param.orderBy = '1';
    },
    /**
     * @description 将字符串转化成数组
     * @param {String}
     */
    requireList(str) {
      let arr = str.split(',');
      return arr;
    },
    /**
     * @description 线索来源
     * @param {String} 点击的选项
     */
    chooseTime(item) {
      this.receiveCode = item.code;
      if (item?.ext2 && item?.ext2 !== 'custom') {
        const result = new FilterTime(item?.ext2).time;
        this.param.startTime = result[0];
        this.param.endTime = result[1];
        this.param.start = 1;
        if (this.times?.length > 0) {
          this.times = [];
          this.param.start = 1;
        }
        this.sortClear();
        this.getReferralCustomerList(this.param);
      }
      if (item?.ext2 && item?.ext2 === 'custom') {
        this.times = [];
      }

      if (!item?.ext2) {
        if (this.times?.length > 0) {
          this.times = [];
          this.param.start = 1;
        }
        this.param.startTime = '';
        this.param.endTime = '';
        this.param.start = 1;
        this.sortClear();
        this.getReferralCustomerList(this.param);
      }
    },
    /**
     * @description 确定自定义时间
     */
    sureTimes(val) {
      if ((this.times && this.times[0]) === null || (this.times && this.times[1]) === null) {
        this.param.startTime = '';
        this.param.endTime = '';
        this.param.start = 1;
      } else {
        this.param.startTime =
          dayjs(this.times && this.times[0]).format('YYYY-MM-DD HH:mm:ss') || '';
        this.param.endTime = dayjs(this.times && this.times[1]).format('YYYY-MM-DD HH:mm:ss') || '';
        this.param.start = 1;
        this.sortClear();
        this.getReferralCustomerList(this.param);
      }
    },
    /**
     * @description 点击操作栏下拉选项
     * @param {String} 点击的选项
     */
    handleCommand(command) {
      switch (command.component) {
        case 'callPhoneRef':
          this.callPhone(command.item.id);
          break;
        default:
          this.$router.push(`/add-business?id=${command.item.id}`);
          break;
      }
    },
    /**
     * @description 写跟进点击事件，打开弹层
     *
     * @param {Object} 当前点击行
     */
    hanleMoreRemark(row) {
      this.$refs['moreFollowRecordRef'].openModal(row);
    },
    /**
     * @description 写跟进点击事件，打开弹层
     * @param {Object} 当前点击行
     */
    listHandleClick(row) {
      this.$router.push(`/business-details?businessId=${row.bizId}`);
    },
    /**
     * @description 数据字典线索来源
     */
    async getDictionary(code) {
      const param = {
        parentCode: code,
      };
      const result = await get_dictionary_data_by_parent_code(param);
      if (result.code !== 200) {
        this.$message.warning(result.message);
      }
      if (result.code === 200) {
        this.receiveTime = result.data || [];
      }
    },
    /**
     * @description 潜在客户列表数据
     * @returns {Object} 返回数据
     */
    getReferralCustomerList(param) {
      this.loading = true;
      get_referral_business_list(param)
        .then((result) => {
          if (result.code === 200) {
            this.param.total = result.data.totalCount * 1;
            this.potentialCustomerList = result.data.records;
            this.loading = false;
          } else {
            this.loading = false;
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
    /**
     * @description 分页
     */
    handleSizeChange(val) {
      this.param.limit = val;
      this.param.start = 1;
      this.getReferralCustomerList(this.param);
    },
    handleCurrentChange(val) {
      this.param.start = val;
      this.getReferralCustomerList(this.param);
    },
  },
};
</script>
