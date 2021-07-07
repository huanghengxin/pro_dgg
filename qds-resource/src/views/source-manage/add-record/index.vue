<template>
  <div class="add-record-page">
    <div class="add-record-title">
      <div class="search-input">
        <span>客户：</span>
        <el-input
          v-model="inputName"
          maxlength="20"
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
        <span class="search-input-ml16">来源平台：</span>
        <el-select v-model="params.sourceSyscode">
          <el-option
            v-for="item in bizSourceList"
            :key="item.code"
            :label="item.name"
            :value="item.code"
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
          v-show="isActive === 3"
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
    <div v-loading="loading" class="add-record-table list-base-ui">
      <el-table :data="tableData.records" style="width: 100%">
        <template slot="empty">
          <svg-icon key="item-warp" type="nodata" icon="icon-icon_nodata" />
        </template>
        <el-table-column prop="bizNo" label="商机编号" min-width="200" class-name="list-selection">
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
        <el-table-column prop="inputPeople" label="录入人" min-width="200">
          <template slot-scope="scope">
            <show-tooltip :text="scope.row.inputPeople || '-'" :width="180"></show-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="inputTime" label="录入时间" min-width="200">
          <template slot-scope="scope">
            {{ scope.row.inputTime || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="sourcePlatform" label="来源平台" min-width="140">
          <template slot-scope="scope">
            {{ scope.row.sourcePlatform || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="firstSource" label="一级来源渠道" min-width="140">
          <template slot-scope="scope">
            {{ scope.row.firstSource || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="secondSource" label="二级来源渠道" min-width="140">
          <template slot-scope="scope">
            {{ scope.row.secondSource || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="sourceUrl" label="来源URL" min-width="280">
          <template slot-scope="scope">
            <show-tooltip :text="scope.row.sourceUrl || '-'" :width="240"></show-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="keyword" label="关键词" min-width="140">
          <template slot-scope="scope">
            <show-tooltip :text="scope.row.keyword || '-'" :width="80"></show-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <div class="footer">
        <el-pagination
          :current-page.sync="params.start"
          :page-sizes="[10, 20, 30, 40, 50]"
          background
          layout="total, prev, pager, next,sizes,  jumper"
          :total="tableData.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import './index.scss';
import DropSelect from 'components/drop-select';
import ShowTooltip from 'components/show-tooltip';
import SvgIcon from 'components/svg-icon';
import dayjs from 'dayjs'; // 使用日期过滤
import FilterTime from 'utils/filter-time'; // 使用日期过滤
import { TIME_TAG } from 'constants/constants';
import { add_record } from 'api/source-manage';
import { find_tree_book_list } from 'api/common';
import { golbalSearchAddParams } from 'utils/index';
export default {
  name: 'AddRecord',
  components: {
    ShowTooltip,
    SvgIcon,
    DropSelect,
  },
  data() {
    return {
      params: {
        sourceSyscode: undefined,
        start: 1, //页数
      },
      limit: 10, //每页显示多少条
      inputName: '',
      pickerTime: '',
      isActive: 0,
      loading: false,
      bizSourceList: [],
      tableData: {},
    };
  },
  computed: {
    timeTagList() {
      return TIME_TAG;
    },
  },
  created() {
    this.changeTime(0);
    this.getSourcePlatform(); //来源平台
  },
  methods: {
    /**
     * @description 获取客户需求/区域
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
     * @description 标记时间切换
     */
    changeTime(index) {
      this.params.start = 1;
      const params = this.params;
      this.isActive = index;
      if (index === 3) return;
      params.createTimeStart =
        new FilterTime(this.timeTagList[index].ext1, 'YYYY-MM-DD').time[0] + ' 00:00:00';
      params.createTimeEnd =
        new FilterTime(this.timeTagList[index].ext1, 'YYYY-MM-DD').time[1] + ' 23:59:59';
      this.getTable();
      this.pickerTime = '';
    },
    /**
     * @description 确认自定义时间
     */
    sureDate(val) {
      if (!val) {
        this.params.createTimeStart = undefined;
        this.params.createTimeEnd = undefined;
        return;
      }
      this.params.createTimeStart = dayjs(val[0]).format('YYYY-MM-DD 00:00:00');
      this.params.createTimeEnd = dayjs(val[1]).format('YYYY-MM-DD 23:59:59');
      // this.getTable();
    },
    /**
     * @description 搜索
     */
    searchParams() {
      this.params.start = 1;
      this.getTable();
    },
    /**
     * @description 重置
     */
    resetParams() {
      this.params = {
        sourceSyscode: undefined,
        start: 1, //页数
      };
      this.inputName = '';
      this.pickerTime = '';
      this.isActive = 0;
      this.$refs.plannerRefs.resetInput();
      this.changeTime(0);
    },
    /**
     * @description 获取来源平台
     */
    getSourcePlatform() {
      const param = {
        code: 'RESOURCE_PLATFORM_CODE',
        type: 1,
        status: 1,
      };
      find_tree_book_list(param).then((res) => {
        if (res.code === 200) {
          this.bizSourceList = res?.data || [];
          const unlimited = { code: undefined, name: '不限' };
          this.bizSourceList.unshift(unlimited);
        } else {
          this.$message.warning(res.message);
        }
      });
    },
    /**
     * @description 获取列表数据
     */
    getTable() {
      this.loading = true;
      let params = { ...this.params, ...golbalSearchAddParams(this.inputName) };
      params.limit = this.limit;
      add_record(params)
        .then((res) => {
          if (res.code === 200) {
            this.tableData = res.data;
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
    /**
     * @description 搜索后选中方法
     */
    selectChangeHandle(val, type) {
      this.params.createrId = val?.mchUserId || undefined;
    },
  },
};
</script>
