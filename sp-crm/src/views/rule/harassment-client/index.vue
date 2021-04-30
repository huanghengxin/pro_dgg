<template>
  <div class="harassment-client-page">
    <div class="harassment-client-title">
      <div class="search-condition">
        <span>客户：</span>
        <el-input v-model="params.customerPhone" placeholder="请输入客户号码进行查询"></el-input>
        <span class="search-condition-ml16">骚扰标签：</span>
        <el-select v-model="params.antiTag">
          <el-option
            v-for="item in antiTagList"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          >
          </el-option>
        </el-select>
        <span class="search-condition-ml16">标记原因：</span>
        <el-select v-model="params.antiReason">
          <el-option
            v-for="item in antiReasonList"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          >
          </el-option>
        </el-select>
      </div>
      <div class="sign-time">
        <span>标记时间</span>
        <span
          v-for="(item, index) in timeTagList"
          :key="index + 'time'"
          :class="{
            'filter-item': true,
            active: index === isActive,
            noActive: loading == true,
          }"
          @click="changeTime(index)"
        >
          <span>{{ item.text }}</span>
        </span>
        <el-date-picker
          v-show="isActive === 4"
          v-model="customTime"
          type="daterange"
          range-separator="-"
          start-placeholder="选择开始时间"
          end-placeholder="选择结束时间"
          class="date-picker"
          @change="sureDate"
        >
        </el-date-picker>
        <el-button size="small" type="primary" class="search-button" @click="searchParams"
          >搜 索</el-button
        >
        <el-button size="small" plain @click="resetParams">重 置</el-button>
      </div>
    </div>
    <div class="harassment-client-table list-base-ui">
      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%"
        :default-sort="{ prop: 'tagTime', order: 'null' }"
      >
        <template slot="empty">
          <svg-icon key="item-warp" type="nodata" icon="icon-icon_nodata" />
        </template>
        <el-table-column prop="customerName" label="姓名" min-width="80">
          <template slot-scope="scope">
            <show-tooltip
              :text="scope.row.customerName"
              title-class="content-title"
              :width="80"
              tooltip-class="content-record"
            ></show-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="customerPhone" label="联系号码" min-width="80"> </el-table-column>
        <el-table-column prop="tagName" label="骚扰标签" min-width="80"> </el-table-column>
        <el-table-column prop="reasonName" label="标记原因" min-width="180">
          <template slot-scope="scope">
            <show-tooltip
              :text="scope.row.reasonName"
              title-class="content-title"
              :width="220"
              tooltip-class="content-record"
            ></show-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="tagTime" label="标记时间" sortable min-width="120">
        </el-table-column>
        <el-table-column prop="acquaintanceList" label="熟人规划师" min-width="100">
          <template slot-scope="scope">
            <div v-if="scope.row.acquaintanceList" class="last-column">
              <show-tooltip
                :text="planner"
                title-class="content-title"
                :width="120"
                tooltip-class="content-record"
              ></show-tooltip>
              <el-popover
                v-if="scope.row.acquaintanceList.length > 1"
                placement="bottom"
                trigger="click"
                popper-class="more-popover"
                @show="showPopver(scope.$index)"
                @hide="hidePopver(scope.$index)"
              >
                <p v-for="(item, index) in morePlanner" :key="index + 'acquaintanceList'">
                  <show-tooltip
                    :text="item"
                    title-class="content-title"
                    :width="120"
                    tooltip-class="content-record"
                  ></show-tooltip>
                </p>
                <div slot="reference">
                  <i
                    :class="{
                      'iconfont-qds-crm': true,
                      'icon-downoutline': !scope.row.moreIcon,
                      'icon-upoutline': scope.row.moreIcon,
                    }"
                  ></i>
                </div>
              </el-popover>
            </div>
            <div v-else>-</div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import './index.scss';
import FilterTime from 'utils/filter-time'; // 使用日期过滤
import dayjs from 'dayjs'; // 使用日期过滤
import ShowTooltip from 'components/show-tooltip';
import SvgIcon from 'components/svg-icon';
import { TIME_TAG } from './configuration';
import { get_anti_harassment_customer_list } from 'api/harassment-rule';
import { get_dictionary_data_by_parent_code } from 'api/common';
export default {
  name: 'HarassmentClient',
  components: {
    ShowTooltip,
    SvgIcon,
  },
  data() {
    return {
      params: {
        antiTag: '',
        antiReason: '',
        customerPhone: undefined,
        startTime: '',
        endTime: '',
        isAsc: true,
        orderBy: 'tagTime',
        // limit: 10,
        // start: 1,
      },
      customTime: '',
      isActive: 0,
      loading: false,
      tableData: [],
      antiTagList: [],
      antiReasonList: [],
      planner: '',
      morePlanner: '',
    };
  },
  computed: {
    timeTagList() {
      return TIME_TAG;
    },
  },
  mounted() {
    this.getAntiTagList();
    this.getAntiReasonList();
    this.getTable();
  },
  methods: {
    /**
     * @description 标记时间切换
     */
    changeTime(index) {
      const params = this.params;
      this.isActive = index;
      if (this.isActive === 0) {
        params.startTime = undefined;
        params.endTime = undefined;
      } else if (this.isActive < 4) {
        params.startTime = new FilterTime(this.timeTagList[index].ext1, 'YYYY-MM-DD').time[0];
        params.endTime = new FilterTime(this.timeTagList[index].ext1, 'YYYY-MM-DD').time[1];
      } else {
        params.startTime = undefined;
        params.endTime = undefined;
      }
      this.customTime = '';
      console.log('标记时间切换', this.params);
    },
    /**
     * @description 确认自定义时间
     */
    sureDate(val) {
      if (!val) return;
      this.params.startTime = dayjs(val[0]).format('YYYY-MM-DD 00:00:00');
      this.params.endTime = dayjs(val[1]).format('YYYY-MM-DD 23:59:59');
      console.log('自定义时间', this.params);
    },
    /**
     * @description 搜索
     */
    searchParams() {
      let params = this.params;
      console.log('搜索', params);
    },
    /**
     * @description 重置
     */
    resetParams() {
      this.params = {};
      this.customTime = '';
      this.isActive = 0;
      console.log('重置', this.params);
    },
    /**
     * @description 获取数据
     */
    getTable() {
      this.loading = true;
      get_anti_harassment_customer_list(this.params)
        .then((res) => {
          if (res.code === 200) {
            this.tableData = res.data.records;
            this.getAcquaintanceList();
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
     * @description 熟人规划师
     */
    getAcquaintanceList() {
      this.tableData?.forEach((item) => {
        const acquaintance = item.acquaintanceList;
        this.planner = acquaintance
          .split(',')
          .slice(0, 1)
          .toString();
        this.morePlanner = acquaintance.split(',').slice(1);
      });
    },
    /**
     * @description 监听下拉框显示与隐藏
     */
    showPopver(index) {
      this.$set(this.tableData[index], 'moreIcon', true);
    },
    hidePopver(index) {
      this.$set(this.tableData[index], 'moreIcon', false);
    },
    /**
     * @description 数据字典
     */
    async getAntiTagList() {
      const param = {
        parentCode: 'QDS_RULE_ANTI_HARASSMENT_TAG_LEVEL',
      };
      const result = await get_dictionary_data_by_parent_code(param).catch(() => {});
      this.antiTagList = result.data || [];
      this.params.antiTag = 'QDS_RULE_ANTI_HARASSMENT_TAG_LEVEL_UNLIMITED';
    },
    async getAntiReasonList() {
      const param = {
        parentCode: 'QDS_RULE_ANTI_HARASSMENT_SIGN_REASON',
      };
      const result = await get_dictionary_data_by_parent_code(param).catch(() => {});
      this.antiReasonList = result.data || [];
      this.params.antiReason = 'QDS_RULE_ANTI_HARASSMENT_SIGN_REASON_UNLIMITED';
    },
  },
};
</script>
