<template>
  <div class="prospective">
    <div class="prospective__search">
      <div class="prospective__search-from">
        <span class="lable">线索来源</span>
        <span
          v-for="item in culeFrom"
          :key="item.id"
          :class="{
            'filter-item': true,
            'filter-item_active': item.code === active.culeFrom,
          }"
          data-tid="customerChangeCuleFrom"
          @click="changeCuleFrom(item)"
        >
          {{ item.name }}
        </span>
      </div>
      <div class="prospective__search-from">
        <span class="lable">线索状态</span>
        <span
          v-for="(item, index) in clueStatusList"
          :key="item.code"
          :class="{
            'filter-item': true,
            'filter-item_active': item.code === active.clueStatus,
          }"
          data-tid="customerChangeCuleStatus"
          @click="changeCuleStatus(item, index)"
        >
          {{ item.name }}
        </span>
      </div>
    </div>
    <div class="prospective__main">
      <div class="prospective__main-warp list-base-ui">
        <!-- 不要修改table ref属性值，会影响批量打电话 -->
        <el-table
          ref="tableRef"
          v-loading="loading"
          :data="potentialCustomerList"
          clear-sort
          :default-sort="{ prop: 'null', order: 'null' }"
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
              <div v-if="scope.row.customerName">
                <show-tooltip :text="scope.row.customerName" :width="120"></show-tooltip>
              </div>
              <span v-else>暂无数据</span>
            </template>
          </el-table-column>
          <el-table-column label="联系号码" min-width="180">
            <template slot-scope="scope">
              <span v-if="scope.row.customerPhone">{{ scope.row.customerPhone }}</span>
              <span v-else>暂无数据</span>
            </template>
          </el-table-column>
          <el-table-column label="状态" min-width="150">
            <template slot-scope="scope">
              <span v-if="scope.row.clueStatus">{{ scope.row.clueStatus | statusFormat }}</span>
              <span v-else>暂无数据</span>
            </template>
          </el-table-column>
          <el-table-column label="意向业务" min-width="180">
            <template slot-scope="scope">
              <more-require
                v-if="scope.row.intentionType"
                :require-item="scope.row.intentionType"
                :symbol="'|'"
                is-separate
              />
              <span v-else>暂无数据</span>
            </template>
          </el-table-column>
          <el-table-column label="意向区域" min-width="180">
            <template slot-scope="scope">
              <div v-if="scope.row.intentionCity">
                <show-tooltip
                  :text="scope.row.intentionCity.replace(/\|/g, ',')"
                  :width="150"
                ></show-tooltip>
              </div>
              <span v-else>暂无数据</span>
            </template>
          </el-table-column>
          <el-table-column
            v-if="param.clueStatus !== 'QDS_ClUE_STATUS_NOT'"
            prop="lastRemarkTime"
            class="refresh-follow"
            label="最新跟进信息"
            sortable="custom"
            min-width="280"
          >
            <template slot-scope="scope">
              <div
                v-if="scope.row.lastRemarkContent || scope.row.lastRemarkTime"
                class="follow-box"
              >
                <div class="follow">
                  <show-tooltip :text="scope.row.lastRemarkContent" :width="200"></show-tooltip>
                  <p
                    v-show="scope.row.lastRemarkContent"
                    class="follow-more"
                    @click="hanleMoreRemark(scope.row)"
                  >
                    【更多】
                  </p>
                </div>
                <p>{{ scope.row.lastRemarkTime | filterTime }}</p>
              </div>
              <span v-else>暂无数据</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="130" fixed="right" class-name="list-last">
            <template slot-scope="scope">
              <div class="list-handle">
                <p
                  class="list-handle_follow"
                  :data-tid="'customerListHandleClick' + scope.$index"
                  @click="listHandleClick(scope.row)"
                >
                  写跟进
                </p>
                <el-dropdown
                  trigger="click"
                  :data-tid="'handleCommand' + scope.$index"
                  @command="handleCommand"
                >
                  <p class="list-handle_more">更多操作</p>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      :data-tid="'callPhoneRef' + scope.$index"
                      :command="{ component: 'callPhoneRef', item: scope.row }"
                      >打电话</el-dropdown-item
                    >
                    <el-dropdown-item
                      :data-tid="'conversionRef' + scope.$index"
                      :command="{ component: 'conversionRef', item: scope.row }"
                      >转商机</el-dropdown-item
                    >
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-footer">
          <el-pagination
            background
            :current-page="param.start"
            :page-size="param.limit"
            :page-sizes="[10, 20, 30, 40, 50]"
            layout="total, prev, pager, next, sizes, jumper"
            :total="param.total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          >
          </el-pagination>
        </div>
      </div>
    </div>
    <write-follow-dailog
      ref="writeFollowDailogRef"
      data-tid="customerSubmitHandle"
      @on-submit="submitHandle"
    />
    <more-follow-record ref="moreFollowRecordRef" />
    <show-more-require ref="showMoreRequireRefs" />
  </div>
</template>

<script>
import './index.scss';
import MoreRequire from 'views/dynamic-business/components/more-require';
import ShowMoreRequire from 'views/dynamic-business/components/show-more-require';
import ShowTooltip from 'components/show-tooltip';
import WriteFollowDailog from './components/write-follow-dailog';
import MoreFollowRecord from './components/more-follow-record';

import SvgIcon from 'components/svg-icon';
import callMixins from 'utils/mixins/callMixins';
import { filterTime as filterTimeDate } from 'utils/helper'; // 使用日期过滤
import { get_my_potential_customer_lists } from 'api/cule';
import { get_dictionary_data_by_parent_code } from 'api/common';
export default {
  components: {
    ShowTooltip,
    WriteFollowDailog,
    MoreFollowRecord,
    SvgIcon,
    ShowMoreRequire,
    MoreRequire,
  },
  filters: {
    statusFormat(val) {
      const map = {
        QDS_ClUE_STATUS_NOT: '未联系',
        QDS_ClUE_STATUS_ALREADY: '已联系',
      };
      return map[val];
    },
    filterTime(val) {
      return val ? filterTimeDate(val) : '';
    },
  },
  mixins: [callMixins],
  provide() {
    return {
      parentLoadMore: this.loadMore,
    };
  },
  data() {
    return {
      dialogVisible: false,
      len: 3,
      moreNeed: [],
      loading: false,
      currentComponent: '',
      currentComponentItem: null,
      culeFrom: [], //线索来源数据字典
      clueStatusList: [],
      active: {
        culeFrom: 'QDS_ClUE_SOURCE_IM',
        clueStatus: 'QDS_ClUE_STATUS_NOT',
      },
      sattfs: [], //员工
      businessStatue: [], //商机状态
      potentialCustomerList: [], //列表数据
      total: 0,
      param: {
        start: 1,
        limit: 10,
        clueSourceType: 'QDS_ClUE_SOURCE_IM',
        clueStatus: 'QDS_ClUE_STATUS_NOT',
        orderBy: '1', //排序字段 orderBy
        isAsc: 0,
      },
    };
  },
  created() {
    this.getTeamBusyList(this.param);
    this.getDictionary('QDS_ClUE_SOURCE');
    this.getDictionary('QDS_ClUE_STATUS');
  },
  mounted() {},
  methods: {
    /**
     * @description 点击更多-加载更多
     * @param {Object}
     */
    loadMore(val) {
      this.$refs.showMoreRequireRefs.openModal(val);
    },
    /**
     * @description 监听子组件的事件跟进响应成功后刷新列表
     */
    submitHandle() {
      if (
        this.active.clueStatus === 'QDS_ClUE_STATUS_NOT' &&
        this.potentialCustomerList?.length == 1 &&
        this.param.start != 1
      ) {
        this.param.start--;
      }
      this.getTeamBusyList(this.param);
    },
    /**
     * @description 排序查询
     */
    sortList(val) {
      const map = {
        lastRemarkTime: '1',
      };
      if (map[val.prop]) {
        if (val.order) {
          this.param.orderBy = map[val.prop];
          this.param.isAsc = val.order === 'descending' ? 1 : 0;
        } else {
          this.param.orderBy = '1';
          this.param.isAsc = 0;
        }
      }
      this.getTeamBusyList(this.param);
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
     * @description 线索来源
     * @param {String} 点击的选项
     */
    changeCuleFrom(item) {
      this.param.clueSourceType = item.code;
      this.active.culeFrom = item.code;
      this.param.start = 1;
      this.getTeamBusyList(this.param);
    },
    /**
     * @description 线索状态
     * @param {String} 点击的选项
     */
    changeCuleStatus(item) {
      this.active.clueStatus = item.code;
      this.param.clueStatus = item.code;
      this.param.start = 1;
      this.sortClear();
      this.getTeamBusyList(this.param);
    },
    /**
     * @description 打电话需要刷新页面方法
     */
    flowRefresh() {
      this.submitHandle();
    },
    /**
     * @description 框架上打电话方法
     * @param {String} 商机id
     */
    callPhone(item) {
      if (item && item.customerPhone) {
        this.callMixins('clue', item, 'one');
      } else {
        this.$message.warning('该线索未授权电话号码');
      }
    },
    /**
     * @description 点击操作栏下拉选项
     * @param {String} 点击的选项
     */
    handleCommand(command) {
      switch (command.component) {
        case 'callPhoneRef':
          this.callPhone(command.item);
          break;
        default:
          if (command.item && command.item.customerPhone) {
            this.$messageBox
              .confirm('您是否继续转商机?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                customClass: 'message-box-min-height',
              })
              .then(() => {
                this.$router.push(
                  `/add-business?clueId=${command.item.id}&type=${this.param.clueSourceType}`,
                );
              })
              .catch(() => {
                this.$message({
                  type: 'info',
                  message: '已取消转商机!',
                });
              });
          } else {
            this.$message({
              type: 'warning',
              message: '该线索用户未授权，不能跳转商机!',
            });
          }
          break;
      }
    },
    /**
     * @description 更多更近
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
      this.$refs['writeFollowDailogRef'].openModal(row, this.param.clueSourceType);
    },
    /**
     * @description 数据字典线索来源
     */
    async getDictionary(code) {
      const param = {
        parentCode: code,
      };
      const result = await get_dictionary_data_by_parent_code(param);
      if (result.code === 200) {
        if (code === 'QDS_ClUE_SOURCE') {
          this.culeFrom = result.data || [];
        }
        if (code === 'QDS_ClUE_STATUS') {
          this.clueStatusList = result.data || [];
        }
      } else {
        this.$message.warning(result.message);
      }
    },
    /**
     * @description 潜在客户列表数据
     * @returns {Object} 返回数据
     */
    getTeamBusyList(param) {
      this.loading = true;
      get_my_potential_customer_lists(param)
        .then((result) => {
          if (result.code === 200) {
            this.param.total = result.data.totalCount * 1;
            this.potentialCustomerList = result.data.records;
            this.loading = false;
          } else {
            this.loading = false;
            this.$message.warning(result.message);
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
      this.getTeamBusyList(this.param);
    },
    handleCurrentChange(val) {
      this.param.start = val;
      this.getTeamBusyList(this.param);
    },
  },
};
</script>
