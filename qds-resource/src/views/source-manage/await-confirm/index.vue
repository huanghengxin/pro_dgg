<template>
  <div class="await-confirm-page">
    <div class="await-confirm-title">
      <div class="search-input">
        <span>客户：</span>
        <el-input
          v-model="customInput"
          maxlength="20"
          clearable
          placeholder="请输入客户姓名/联系号码进行查询"
          @keyup.enter.native="searchParams"
        ></el-input>
        <span class="search-input-ml16">来源渠道：</span>
        <el-select v-model="params.sourceSyscode" clearable placeholder="请选择">
          <el-option
            v-for="item in sourcesList"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          >
          </el-option>
        </el-select>
      </div>
      <div class="sign-time">
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
    <div v-loading="loading" class="await-confirm-table list-base-ui">
      <el-table :data="tableData.records" style="width: 100%">
        <template slot="empty">
          <svg-icon key="item-warp" type="nodata" icon="icon-icon_nodata" />
        </template>
        <el-table-column
          prop="customerName"
          label="客户姓名"
          min-width="120"
          class-name="list-selection"
        >
          <template slot-scope="scope">
            <show-tooltip :text="scope.row.customerName || '-'" :width="80"></show-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="customerPhone" label="联系号码" min-width="160">
          <template slot-scope="scope">
            {{ scope.row.customerPhone || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="客户需求/区域" min-width="180">
          <template slot-scope="scope">
            <show-tooltip
              :text="`${scope.row.requireName || '-'}/${scope.row.bizCityName || '-'}`"
              :width="140"
            ></show-tooltip>
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
        <el-table-column prop="comment" label="备注" min-width="200">
          <template slot-scope="scope">
            <show-tooltip :text="scope.row.comment || '-'" :width="160"></show-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="sourceUrl" label="来源URL" min-width="300">
          <template slot-scope="scope">
            <show-tooltip :text="scope.row.sourceUrl || '-'" :width="260"></show-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="keyword" label="关键词" min-width="120">
          <template slot-scope="scope">
            <show-tooltip :text="scope.row.keyword || '-'" :width="80"></show-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="customerAttr" label="客户属性" min-width="220">
          <template slot-scope="scope">
            <show-tooltip
              v-if="getCustomerAttr(scope.row.customerAttr)"
              :text="scope.row.customerAttr || '-'"
              :width="180"
            ></show-tooltip>
            <template v-else>
              <div
                v-for="(item, index) in scope.row.customerAttr.slice(0, moreIcon ? 2 : undefined)"
                :key="index"
              >
                <show-tooltip :text="item || '-'" :width="140"></show-tooltip>
              </div>
              <span class="more-customerAttr" @click="showMoreAttr">
                {{ scope.row.customerAttr.length > 3 && moreIcon ? '更多' : '收起' }}
                <i
                  :class="{
                    'iconfont-qds-crm': true,
                    'icon-downoutline': scope.row.customerAttr.length > 3 && moreIcon,
                    'icon-upoutline': scope.row.customerAttr.length > 3 && !moreIcon,
                  }"
                ></i>
              </span>
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="enterTime" label="进入时间" min-width="200">
          <template slot-scope="scope">
            {{ scope.row.enterTime || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="140" class-name="list-last">
          <template slot-scope="scope">
            <div class="list-handle">
              <p
                class="list-handle_follow"
                :data-tid="'publicListHandleClick' + scope.$index"
                @click="perfectionSource(scope.row)"
              >
                完善客源
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
                    :command="{ component: 'callPhoneRef', item: scope.row }"
                    >打电话</el-dropdown-item
                  >
                  <el-dropdown-item
                    :data-tid="'remark' + scope.$index"
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
import { UNLIMITED_TIME_TAG } from 'constants/constants';
import { find_tree_book_list } from 'api/common';
import { wait_sure_customer, delete_clue, find_by_id } from 'api/source-manage';
import dayjs from 'dayjs'; // 使用日期过滤
import FilterTime from 'utils/filter-time'; // 使用日期过滤
import ShowTooltip from 'components/show-tooltip';
import SvgIcon from 'components/svg-icon';
import callMixins from 'utils/mixins/callMixins';
import { golbalSearchAddParams } from 'utils/index';
import { mutations } from './observable';
export default {
  name: 'AwaitConfirm',
  components: {
    ShowTooltip,
    SvgIcon,
  },
  mixins: [callMixins],
  data() {
    return {
      params: {
        sourceSyscode: undefined,
        start: 1, //页数
      },
      limit: 10, //每页显示多少条
      customInput: '',
      isActive: 0,
      loading: false,
      pickerTime: '',
      sourcesList: [],
      tableData: [],
      tableDataPage: 0, //总页数
      moreIcon: true,
    };
  },
  computed: {
    timeTagList() {
      return UNLIMITED_TIME_TAG;
    },
  },
  created() {
    this.getSources();
    this.getTable();
  },
  methods: {
    /**
     * @description 点击操作栏下拉选项
     */
    handleCommand(command) {
      switch (command.component) {
        case 'callPhoneRef':
          this.callMixins(command.item, 'one');
          break;
        default:
          this.$messageBox
            .confirm('请确认是否删除此客源，确认后客源将永久删除无法恢复。', '无效客源', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
              closeOnClickModal: false,
              customClass: 'message-box-icon',
            })
            .then(() => {
              // 删除线索
              this.deleteClue(command.item);
            })
            .catch(() => {});
          break;
      }
    },
    /**
     * @description 删除线索
     * @param {}
     * @returns {}
     */
    deleteClue(item) {
      const param = {
        id: item.id,
      };
      delete_clue(param)
        .then((res) => {
          const { code, message } = res;
          if (code === 200) {
            this.$message.success(message);
            if (this.tableData.records?.length == 1 && this.params.start != 1) {
              this.params.start--;
            }
            this.getTable();
            return;
          }
          this.$message.warning(message);
        })
        .catch(() => {});
    },
    /**
     * @description 完善客源
     */
    perfectionSource(row) {
      find_by_id({ id: row.id })
        .then((res) => {
          const { code, data, message } = res || {};
          if (code === 200) {
            if (data.conversion) {
              this.$message.warning('线索已转化！');
              this.getTable();
              return;
            } else {
              mutations.setRecordsObj(row);
              this.$router.push('/add-source');
            }
          } else if (code === 5055) {
            this.$message.warning('线索不存在，可能被删除');
            this.getTable();
            return;
          } else {
            this.$message.warning(message);
          }
        })
        .catch(() => {});
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
     * @description 获取列表数据
     */
    getTable() {
      this.loading = true;
      let params = { ...this.params, ...golbalSearchAddParams(this.customInput) };
      params.limit = this.limit;
      wait_sure_customer(params)
        .then((res) => {
          if (res.code === 200) {
            const records = res.data.records;
            for (let i = 0; i < records.length; i++) {
              const attr = records[i].customerAttr;
              if (this.handleJson(attr)) {
                const arr = [];
                const customerAttr = JSON.parse(attr);
                for (const key in customerAttr) {
                  const value = customerAttr[key];
                  arr.push(`${key}：${value}`);
                }
                records[i].customerAttr = arr;
              }
            }
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
    handleJson(str) {
      try {
        JSON.parse(str);
        return true;
      } catch (e) {
        console.log(e);
        return false;
      }
    },
    getCustomerAttr(customerAttr) {
      return typeof customerAttr === 'string' ? true : false;
    },
    showMoreAttr() {
      this.moreIcon = !this.moreIcon;
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
      this.customInput = '';
      this.pickerTime = '';
      this.isActive = 0;
      this.getTable();
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
     * @description 标记时间切换
     */
    changeTime(index) {
      this.params.start = 1;
      const params = this.params;
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
