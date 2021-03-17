<template>
  <div>
    <div class="list-base-box">
      <el-button
        class="list-base-box-button"
        size="small"
        type="primary"
        data-tid="businessCallUp"
        @click="callUp('bus')"
        >打电话</el-button
      >
    </div>
    <div class="list-base-ui list-base">
      <!-- 不要修改table ref属性值，会影响批量打电话 -->
      <el-table
        ref="tableRef"
        v-loading="loading"
        :data="tableData.data"
        style="width: 100%"
        @sort-change="sortHandleChange"
      >
        <template slot="empty">
          <svg-icon key="item-warp" ava-class="empty" type="nodata" icon="icon-icon_nodata" />
        </template>
        <el-table-column type="selection" width="44" class-name="list-selection"> </el-table-column>
        <el-table-column label="姓名" fixed="left" class-name="list-name" min-width="120">
          <template slot-scope="scope">
            <div>
              <router-link
                :to="
                  `/my-business/business-details?businessId=${scope.row.id || ''}&from=my-business`
                "
                class="router-link"
              >
                <show-tooltip :text="scope.row.customerName" :width="120"></show-tooltip>
              </router-link>
            </div>
            <el-rate
              v-if="params.type !== 'SIGN_ORDER'"
              :value="Number(scope.row.intentionLevel)"
              disabled
              disabled-void-color="transparent"
            >
            </el-rate>
            <div class="list-name_way">{{ scope.row.getWay }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="customerTel" label="联系号码" min-width="150">
          <template slot-scope="scope">
            {{ scope.row.customerPhone || '暂无数据' }}
          </template>
        </el-table-column>
        <el-table-column label="获取时间" prop="getTime" sortable="custom" min-width="150">
          <template slot-scope="scope">
            <template v-if="scope.row.getTime">
              {{ scope.row.getTime | filterTimes }}
            </template>
            <template v-else><div>暂无数据</div></template>
          </template>
        </el-table-column>
        <el-table-column
          prop="lastFollowTime"
          min-width="260"
          label="最新跟进信息"
          sortable="custom"
        >
          <template slot-scope="scope">
            <template v-if="scope.row.lastFollowInfo">
              <show-tooltip :text="scope.row.lastFollowInfo" :width="240"></show-tooltip>
              <div>{{ scope.row.lastFollowTime | filterTimes }}</div>
            </template>
            <template v-else><div>暂无数据</div></template>
          </template>
        </el-table-column>
        <el-table-column
          min-width="150"
          prop="nextFollowTime"
          label="下次跟进时间"
          sortable="custom"
        >
          <template slot-scope="scope">
            <template v-if="scope.row.nextFollowTime">
              {{ scope.row.nextFollowTime | filterTimes }}
            </template>
            <template v-else><div>暂无数据</div></template>
          </template>
        </el-table-column>
        <el-table-column min-width="150" prop="dropTime" label="预计掉库时间" sortable="custom">
          <template slot-scope="scope">
            <template v-if="scope.row.noAttention == 1">暂不关注/不掉库</template>
            <template v-else-if="scope.row.dropTypeName && scope.row.dropTime">
              <div>{{ scope.row.dropTime | filterTimes }}</div>
              <div>{{ scope.row.dropTypeName }}</div>
            </template>
            <template v-else><div>暂无数据</div></template>
          </template>
        </el-table-column>
        <el-table-column
          :label="params.type === 'SIGN_ORDER' ? '签单业务' : '客户需求'"
          min-width="260"
        >
          <template slot-scope="scope">
            <more-require :require-item="scope.row.requireName" :is-sign-order="params.type" />
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="140" class-name="list-last">
          <template slot-scope="scope">
            <div v-if="scope.row.noAttention != 1" class="list-handle">
              <p
                class="list-handle_follow"
                :data-tid="'listHandleClick' + scope.$index"
                @click="listHandleClick(scope.row, 'write')"
              >
                写跟进
              </p>
              <el-dropdown
                v-show="activeTabcode !== 'SIGN_ORDER'"
                trigger="click"
                @command="handleCommand"
              >
                <p class="list-handle_more">更多操作</p>
                <el-dropdown-menu slot="dropdown" key="el-dropdown-menu" data-tid="dropdown">
                  <el-dropdown-item
                    :data-tid="'callPone' + scope.$index"
                    :command="{ component: 'callPhoneRef', item: scope.row }"
                    >打电话</el-dropdown-item
                  >
                  <el-dropdown-item
                    :data-tid="'setGroup' + scope.$index"
                    :command="{ component: 'setGroupRef', item: scope.row }"
                    >设置分组</el-dropdown-item
                  >
                  <el-dropdown-item
                    data-tid="inviteInterview"
                    :command="{ component: 'inviteInterviewRef', item: scope.row }"
                    >邀约面谈</el-dropdown-item
                  >
                  <el-dropdown-item
                    :data-tid="'imChat' + scope.$index"
                    :command="{
                      component: 'IMchat',
                      item: scope.row,
                    }"
                    >在线聊</el-dropdown-item
                  >
                </el-dropdown-menu>
              </el-dropdown>
              <el-dropdown
                v-show="activeTabcode === 'SIGN_ORDER'"
                trigger="click"
                @command="handleCommand"
              >
                <p class="list-handle_more">更多操作</p>
                <el-dropdown-menu slot="dropdown" key="el-dropdown-menu" data-tid="dropdown">
                  <el-dropdown-item
                    :data-tid="'callPone' + scope.$index"
                    :command="{ component: 'callPhoneRef', item: scope.row }"
                    >打电话</el-dropdown-item
                  >
                  <el-dropdown-item
                    :data-tid="'imChat' + scope.$index"
                    :command="{
                      component: 'IMchat',
                      item: scope.row,
                    }"
                    >在线聊</el-dropdown-item
                  >
                </el-dropdown-menu>
              </el-dropdown>
            </div>
            <div v-else>
              <p
                class="list-handle_follow"
                data-tid="resetAttention"
                @click="resetAttention(scope.row.id)"
              >
                恢复关注
              </p>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-footer">
        <el-pagination
          :page-sizes="[10, 20, 30, 40, 50]"
          background
          data-tid="handlePagination"
          layout="total, prev, pager, next,sizes,  jumper"
          :total="tableData.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        >
        </el-pagination>
      </div>
      <!-- 弹层组件 -->
      <write-follow-record ref="writeFollowRecordRef" @on-submit="onSubmitHandle" />
      <set-group ref="setGroupRef" @on-submit="onSubmitHandle" />
      <invite-interview ref="inviteInterviewRef" @on-submit="onSubmitHandle" />
      <show-more-require ref="showMoreRequireRef" :is-sign-order="params.type" />
    </div>
  </div>
</template>

<script>
import './index.scss';
import { filterTime } from 'utils/helper';
import { myBizList } from 'api/my-business';
import { recoverInattention } from 'api/common';
import MoreRequire from 'views/dynamic-business/components/more-require';
import ShowMoreRequire from 'views/dynamic-business/components/show-more-require';
import ShowTooltip from 'components/show-tooltip';
import SvgIcon from 'components/svg-icon';
import WriteFollowRecord from '../write-follow-record';
import SetGroup from '../set-group';
import InviteInterview from '../invite-interview/index.vue';
import { PREDICT_DROP_TYPE_MAP } from 'constants/type';
// import { accControlsList } from 'constants/access-controls';
import callMixins from 'utils/mixins/callMixins';
import imChatMinixs from 'utils/mixins/imChatMinixs';
export default {
  name: 'BusinessList',
  components: {
    ShowTooltip,
    WriteFollowRecord,
    SetGroup,
    InviteInterview,

    SvgIcon,
    MoreRequire,
    ShowMoreRequire,
  },
  filters: {
    filterTimes(val) {
      return val ? filterTime(val) : '';
    },
    dropTypeMap(val) {
      return PREDICT_DROP_TYPE_MAP[val];
    },
  },
  mixins: [callMixins, imChatMinixs],
  provide() {
    return {
      parentLoadMore: this.loadMore,
    };
  },
  data() {
    return {
      tableData: {
        total: 0,
        data: [],
      },
      loading: false,
      start: 1,
      limit: 10,
      paramsData: {},
      activeTabcode: '',
    };
  },
  computed: {
    params() {
      return {
        // type: history.state.tab_active ? history.state.tab_active : 'TODAY_FOLLOW',
        type: 'TODAY_FOLLOW',
        ...this.paramsData,
        start: this.start,
        limit: this.limit,
      };
    },
  },
  watch: {
    params: {
      handler() {
        this.getListData(this.params);
      },
      deep: true,
    },
  },
  activated() {
    this.handleEventBus();
    this.getListData(this.params);
  },
  mounted() {},
  beforeDestroy() {
    this.$eventBus.$off('my-business_transfer-params');
  },
  deactivated() {
    this.$eventBus.$off('my-business_transfer-params');
  },
  methods: {
    handleEventBus() {
      this.$eventBus.$on('my-business_transfer-params', (val) => {
        let searchInput = val[2];
        //判断tab切换，需要清空排序
        this.$refs.tableRef.clearSort();
        //判断是否是综合筛选，综合筛选需要清空之前得筛选项
        if (searchInput) {
          this.paramsData = {};
        }
        this.start = 1;
        this.activeTabcode = val[1];
        let obj = Object.assign({}, val[0], { type: val[1] }, searchInput);
        this.$set(this, 'paramsData', obj);
      });
    },
    /**
     * @description 打电话需要刷新页面方法
     */
    flowRefresh() {
      this.onSubmitHandle('BUS_WXSJ');
    },
    loadMore(val) {
      this.$refs.showMoreRequireRef.openModal(val);
    },
    onSubmitHandle(val) {
      if (val === 'BUS_WXSJ' && this.tableData?.data.length == 1 && this.start != 1) {
        this.start--;
      } else {
        this.getListData(this.params);
      }
    },
    sortHandleChange(val) {
      const map = {
        ascending: 'asc',
        descending: 'desc',
      };
      const sort = val.order ? map[val?.order] : undefined;
      this.$set(this.paramsData, 'sortFeild', val.order ? val.prop : undefined);
      this.$set(this.paramsData, 'sort', sort);
    },

    handleCurrentChange(val) {
      this.start = val;
    },
    handleSizeChange(val) {
      this.limit = val;
    },
    /**
     * @description 列表上打电话方法
     */
    callPhone(item) {
      this.callMixins('bus', item, 'one');
    },
    /**
     * @description 点击操作栏下拉选项
     * @param {String} 点击的选项
     */
    handleCommand(command) {
      console.log(command, 'command');
      switch (command.component) {
        case 'callPhoneRef':
          this.callPhone(command.item);
          break;
        case 'IMchat':
          this.IMChatOpen(command.item);
          break;
        case 'pushSheetRef':
          this.$router.push('/push-sheet');
          break;
        default:
          this.$refs[command.component].openModal(command.item);
          break;
      }
    },
    resetAttention(id) {
      this.$messageBox
        .confirm('请确认是否恢复暂不关注？', '恢复关注', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          customClass: 'message-box-min-height',
          closeOnClickModal: false,
        })
        .then(() => {
          const obj = {
            bizId: id,
          };
          recoverInattention(obj).then((res) => {
            if (res.code === 200) {
              this.getListData(this.params);
              this.$message.success('操作成功');
            } else {
              this.$message.warning(res.message);
            }
          });
        });
    },
    /**
     * @description 写跟进点击事件，打开弹层
     * @param {Object} 当前点击行
     */
    listHandleClick(row) {
      this.$refs['writeFollowRecordRef'].openModal(row);
    },
    /**
     * @description 获取数据
     */
    getListData(params) {
      this.loading = true;
      myBizList(params)
        .then((res) => {
          if (res.code === 200) {
            res = res.data;
            this.tableData.data = Object.freeze(res.records) || [];
            this.tableData.total = res.totalCount * 1 || 0;
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
