<template>
  <div class="test-source-page">
    <div class="test-source-title">
      <div class="tab-warp">
        <div class="warp-tabs" data-tid="recordTabChangeHandleClidk" @click="tabChangeHandleClidk">
          <div class="warp-tabs_left">
            <div
              v-for="item in tabList"
              :key="item.code"
              class="warp-tabs_item"
              :data-code="item.code"
            >
              <span
                :data-code="item.code"
                :class="{ 'warp-tabs_item-active': item.code == tabActive }"
              >
                {{ item.name }}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div :class="{ 'search-input': true, 'dis-in-line': tabActive === 'BIZ' }">
        <span>客户：</span>
        <el-input
          v-model="inputSearch[tabActive]"
          maxlength="20"
          clearable
          placeholder="请输入客户姓名/号码进行查询"
          @keyup.enter.native="searchParams"
        ></el-input>
        <span v-show="tabActive === 'CLUE'" class="search-input-ml16">来源渠道：</span>
        <el-select v-show="tabActive === 'CLUE'" v-model="sourceSyscode">
          <el-option
            v-for="item in sourcesList"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          >
          </el-option>
        </el-select>
      </div>
      <div v-show="tabActive === 'CLUE'" class="sign-time">
        <span class="fw600">进入时间：</span>
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
      </div>
      <div class="search-button">
        <el-button
          size="small"
          type="primary"
          data-tid="harassmentSearchParams"
          @click="searchParams"
          >搜 索</el-button
        >
        <el-button size="small" plain data-tid="harassmentResetParams" @click="resetParams"
          >重 置</el-button
        >
      </div>
    </div>
    <div v-loading="loading" class="test-source-table list-base-ui">
      <el-table ref="table" :data="tableData.records">
        <template slot="empty">
          <svg-icon key="item-warp" type="nodata" icon="icon-icon_nodata" />
        </template>
        <template v-if="tabActive === 'BIZ'">
          <el-table-column
            :key="1"
            prop="bizNo"
            label="商机编号"
            min-width="200"
            class-name="list-selection"
          >
            <template slot-scope="scope">
              {{ scope.row.bizNo || '-' }}
            </template>
          </el-table-column>
        </template>
        <el-table-column :key="2" label="客户姓名" min-width="100" class-name="list-selection">
          <template slot-scope="scope">
            <show-tooltip :text="scope.row.customerName || '-'" :width="80"></show-tooltip>
          </template>
        </el-table-column>
        <el-table-column :key="3" prop="customerPhone" label="联系号码" min-width="140">
          <template slot-scope="scope">
            {{ scope.row.customerPhone || '-' }}
          </template>
        </el-table-column>
        <el-table-column :key="4" label="客户需求/区域" min-width="180">
          <template slot-scope="scope">
            <show-tooltip
              :text="`${scope.row.requireName || '-'}/${scope.row.bizCityName || '-'}` || '-'"
              :width="140"
            ></show-tooltip>
          </template>
        </el-table-column>
        <el-table-column :key="5" prop="sourcePlatform" label="来源平台" min-width="140">
          <template slot-scope="scope">
            {{ scope.row.sourcePlatform || '-' }}
          </template>
        </el-table-column>
        <el-table-column :key="6" prop="firstSource" label="一级来源渠道" min-width="140">
          <template slot-scope="scope">
            {{ scope.row.firstSource || '-' }}
          </template>
        </el-table-column>
        <el-table-column :key="7" prop="secondSource" label="二级来源渠道" min-width="140">
          <template slot-scope="scope">
            {{ scope.row.secondSource || '-' }}
          </template>
        </el-table-column>
        <el-table-column :key="8" label="备注" min-width="200">
          <template slot-scope="scope">
            <show-tooltip :text="scope.row.remark || '-'" :width="160"></show-tooltip>
          </template>
        </el-table-column>
        <el-table-column :key="9" prop="sourceUrl" label="来源URL" min-width="280">
          <template slot-scope="scope">
            <show-tooltip :text="scope.row.sourceUrl || '-'" :width="240"></show-tooltip>
          </template>
        </el-table-column>
        <el-table-column :key="10" prop="keyword" label="关键词" min-width="120">
          <template slot-scope="scope">
            <show-tooltip :text="scope.row.keyword || '-'" :width="80"></show-tooltip>
          </template>
        </el-table-column>
        <template v-if="tabActive === 'BIZ'">
          <el-table-column :key="11" prop="inputPeople" label="录入人" min-width="180">
            <template slot-scope="scope">
              <show-tooltip :text="scope.row.inputPeople || '-'" :width="160"></show-tooltip>
            </template>
          </el-table-column>
        </template>
        <template v-if="tabActive === 'BIZ'">
          <el-table-column :key="12" prop="inputTime" label="录入时间" min-width="200">
            <template slot-scope="scope">
              {{ scope.row.inputTime || '-' }}
            </template>
          </el-table-column>
        </template>
        <template v-if="tabActive === 'CLUE'">
          <el-table-column :key="13" prop="customerAttribute" label="客户属性" min-width="220">
            <template slot-scope="scope">
              <show-tooltip
                v-if="getCustomerAttr(scope.row.customerAttribute)"
                :text="scope.row.customerAttribute || '-'"
                :width="180"
              ></show-tooltip>
              <template v-else>
                <div
                  v-for="(item, index) in scope.row.customerAttribute.slice(
                    0,
                    moreIcon ? 2 : undefined,
                  )"
                  :key="index"
                >
                  <span> {{ item }}</span>
                </div>
                <span class="more-customerAttribute" @click="showMoreAttr">
                  {{ scope.row.customerAttribute.length > 3 && moreIcon ? '更多' : '收起' }}
                  <i
                    :class="{
                      'iconfont-qds-crm': true,
                      'icon-downoutline': scope.row.customerAttribute.length > 3 && moreIcon,
                      'icon-upoutline': scope.row.customerAttribute.length > 3 && !moreIcon,
                    }"
                    @click="showMoreAttr"
                  ></i>
                </span>
              </template>
            </template>
          </el-table-column>
        </template>
        <template v-if="tabActive === 'CLUE'">
          <el-table-column :key="14" prop="inputTime" label="进入时间" min-width="200">
            <template slot-scope="scope">
              {{ scope.row.inputTime || '-' }}
            </template>
          </el-table-column>
        </template>
        <el-table-column :key="15" label="操作" fixed="right" width="100" class-name="list-last">
          <template slot-scope="scope">
            <span @click="delTestSource(scope.row)">删除</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="footer">
        <el-pagination
          :current-page.sync="start"
          :page-sizes="[10, 20, 30, 40, 50]"
          background
          layout="total, prev, pager, next, sizes, jumper"
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
import ShowTooltip from 'components/show-tooltip';
import { find_tree_book_list } from 'api/common';
import { get_test_resource_list, delete_by_id } from 'api/source-manage';
import { TEST_SOURCE, UNLIMITED_TIME_TAG } from 'constants/constants';
import dayjs from 'dayjs'; // 使用日期过滤
import FilterTime from 'utils/filter-time'; // 使用日期过滤
import SvgIcon from 'components/svg-icon';
import { golbalSearchAddParams } from 'utils/index';
export default {
  name: 'TestSource',
  components: {
    SvgIcon,
    ShowTooltip,
  },
  data() {
    return {
      tabActive: 'CLUE',
      sourceSyscode: undefined,
      params: {},
      start: 1, //页数
      inputSearch: {},
      pickerTime: '',
      sourcesList: [], //来源渠道
      isActive: 0,
      loading: false,
      tableData: [],
      limit: 10, //每页显示多少条
      moreIcon: true,
    };
  },
  computed: {
    tabList() {
      return Object.freeze(TEST_SOURCE);
    },
    timeTagList() {
      return UNLIMITED_TIME_TAG;
    },
  },
  created() {
    this.getSources();
    this.getTable();
    this.init();
  },
  methods: {
    init() {
      const arr = [
        { v: '', c: 'inputSearch' },
        { v: undefined, c: 'params' },
      ];
      for (let j = 0; j < arr.length; j++) {
        const value = arr[j];
        const obj = {};
        for (let index = 0; index < TEST_SOURCE.length; index++) {
          const value1 = TEST_SOURCE[index];
          obj[value1.code] = value.v ?? {};
        }
        this.$set(this, value.c, obj);
      }
    },
    getTable() {
      this.loading = true;
      const { tabActive, limit, start, sourceSyscode, params } = this;
      get_test_resource_list({
        type: tabActive,
        limit,
        start,
        sourceSyscode: tabActive === 'CLUE' ? sourceSyscode : undefined,
        ...params[tabActive],
        ...golbalSearchAddParams(this.inputSearch[tabActive]),
      })
        .then((res) => {
          const { code, data, message } = res || {};
          if (code === 200) {
            const records = data.records;
            for (let i = 0; i < records.length; i++) {
              const attr = records[i].customerAttribute;
              if (this.handleJson(attr)) {
                const arr = [];
                const customerAttribute = JSON.parse(attr);
                for (const key in customerAttribute) {
                  const value = customerAttribute[key];
                  arr.push(`${key}：${value}`);
                }
                records[i].customerAttribute = arr;
              }
            }
            this.tableData = res.data;
          } else {
            this.$message.warning(message);
          }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    handleJson(str) {
      try {
        JSON.parse(str);
        return true;
      } catch (e) {
        console.log(e);
        return false;
      }
    },
    getCustomerAttr(customerAttribute) {
      return typeof customerAttribute === 'string' ? true : false;
    },
    showMoreAttr() {
      this.moreIcon = !this.moreIcon;
    },
    /**
     * @description 搜索
     */
    searchParams() {
      this.start = 1;
      this.getTable();
    },
    /**
     * @description 重置
     */
    resetParams() {
      const tabActive = this.tabActive;
      this.params[tabActive] = {};
      this.inputSearch[tabActive] = '';
      this.pickerTime = '';
      this.sourceSyscode = undefined;
      this.isActive = 0;
      this.getTable();
    },
    /**
     * @description 确认自定义时间
     */
    sureDate(val) {
      if (!val) {
        this.params[this.tabActive].createTimeStart = undefined;
        this.params[this.tabActive].createTimeEnd = undefined;
        return;
      }
      const params = this.params[this.tabActive];
      params.createTimeStart = dayjs(val[0]).format('YYYY-MM-DD 00:00:00');
      params.createTimeEnd = dayjs(val[1]).format('YYYY-MM-DD 23:59:59');
    },
    /**
     * @description 标记时间切换
     */
    changeTime(index) {
      this.start = 1;
      const params = this.params[this.tabActive];
      this.isActive = index;
      if (index === 4) return;
      if (index === 0) {
        params.createTimeStart = undefined;
        params.createTimeEnd = undefined;
        this.getTable();
      } else {
        params.createTimeStart =
          new FilterTime(this.timeTagList[index].ext1, 'YYYY-MM-DD').time[0] + ' 00:00:00';
        params.createTimeEnd =
          new FilterTime(this.timeTagList[index].ext1, 'YYYY-MM-DD').time[1] + ' 23:59:59';
        this.getTable();
      }
      this.pickerTime = '';
    },
    /**
     * @description 删除
     */
    delTestSource(row) {
      this.$messageBox
        .confirm('请确认是否删除此客源，确认后客源将永久删除无法恢复。', '无效客源', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          closeOnClickModal: false,
          customClass: 'message-box-icon',
        })
        .then(() => {
          delete_by_id({ id: row.id }).then((res) => {
            if (res.code === 200) {
              this.$message.success(res.message);
              if (this.tableData.records?.length == 1 && this.start != 1) {
                this.start--;
              }
              this.getTable();
            } else {
              this.$message.warning(res.message);
            }
          });
        })
        .catch(() => {});
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
      this.start = val;
      this.getTable();
    },
    /**
     * @description 获取来源渠道
     */
    getSources() {
      const param = {
        code: 'RESOURCE_PLATFORM_CODE',
        type: 1,
        status: 1,
      };
      find_tree_book_list(param).then((res) => {
        if (res.code === 200) {
          this.sourcesList = res?.data || [];
          const unlimited = { code: undefined, name: '不限' };
          this.sourcesList.unshift(unlimited);
        } else {
          this.$message.warning(res.message);
        }
      });
    },
    /**
     * @description tab切换方法
     * @param {Event} 事件对象
     */
    tabChangeHandleClidk(e) {
      const code = e.target.dataset.code;
      if (code === undefined || this.loading) return;
      this.tabActive = code;
      this.tableData = [];
      this.start = 1;
      this.getTable();
    },
  },
};
</script>
