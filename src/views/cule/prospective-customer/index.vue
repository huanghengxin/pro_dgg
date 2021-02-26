<template>
  <div class="prospective">
    <div class="prospective__search">
      <div>
        <search-button
          show-word-limit
          placeholder="请输入姓名/联系方式/商机编号查询"
          data-tid="prospectiveHandleInputValue"
          @search="searchUser"
          @clear="handleInputValue"
        ></search-button>
      </div>
      <div class="prospective__search-tabs">
        <span
          v-for="item in clueSourceList"
          :key="item.id"
          :class="{
            'tabs-item': true,
            'tabs-item_active': item.code === param.clueSourceType,
          }"
          data-tid="customerChangeCuleFrom"
          @click="filterTag(item, 'clueSourceType')"
        >
          {{ item.name }}
        </span>
      </div>
      <div v-for="item in curTabFilter" :key="item.code" class="prospective__search-list">
        <span class="lable">{{ item.name }}</span>
        <span
          v-for="one in item.searchList"
          :key="one.code"
          :class="{
            'filter-item': true,
            'filter-item_active': one.code === param[item.code],
          }"
          data-tid="customerChangeCuleStatus"
          @click="filterTag(one, item.code)"
        >
          {{ one.name }}
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
            min-width="120"
            fixed="left"
            label="姓名"
            class-name="list-selection"
          >
            <template slot-scope="scope">
              <div v-if="scope.row.customerName">
                <show-tooltip :text="scope.row.customerName" :width="100"></show-tooltip>
              </div>
              <span v-else>暂无数据</span>
            </template>
          </el-table-column>
          <el-table-column
            v-if="param.clueSourceType === 'QDS_ClUE_SOURCE_STAY'"
            label="信息来源"
            min-width="220"
          >
            <template slot-scope="scope">
              <div v-if="scope.row.keep">
                <el-tag>{{ scope.row.keep }}</el-tag>
                <el-tag>{{ scope.row.keep2 }}</el-tag>
              </div>
              <span v-else>暂无数据</span>
            </template>
          </el-table-column>
          <el-table-column label="客户号码" min-width="180">
            <template slot-scope="scope">
              <span v-if="scope.row.customerPhone">{{ scope.row.customerPhone }}</span>
              <span v-else>暂无数据</span>
            </template>
          </el-table-column>
          <el-table-column
            v-if="param.clueSourceType === 'QDS_ClUE_SOURCE_STAY'"
            label="联系号码"
            min-width="180"
          >
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
          <el-table-column label="获取时间" sortable="custom" min-width="180">
            <template slot-scope="scope">
              <span v-if="scope.row.clueStatus">{{ scope.row.clueStatus | statusFormat }}</span>
              <span v-else>暂无数据</span>
            </template>
          </el-table-column>
          <el-table-column label="意向业务" min-width="180">
            <template slot-scope="scope">
              <more-require
                v-if="scope.row.intentionType"
                :width-num="166"
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
          <el-table-column label="操作" min-width="150" fixed="right" class-name="list-last">
            <template slot-scope="scope">
              <div class="list-handle">
                <p
                  v-if="param.clueSourceType === 'QDS_ClUE_SOURCE_STAY'"
                  class="list-handle_follow"
                  :data-tid="'customerListHandleClick' + scope.$index"
                  @click="callPhone(scope.row)"
                >
                  打电话
                </p>
                <p
                  v-if="param.clueSourceType === 'QDS_ClUE_SOURCE_IM'"
                  class="list-handle_follow"
                  :data-tid="'ChatHandleClick' + scope.$index"
                  @click="listChatClick(scope.row)"
                >
                  在线聊
                </p>
                <el-dropdown
                  trigger="click"
                  :data-tid="'handleCommand' + scope.$index"
                  @command="handleCommand"
                >
                  <p class="list-handle_more">更多操作</p>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      :data-tid="'handleFollowRef' + scope.$index"
                      :command="{ component: 'handleFollowRef', item: scope.row }"
                      >写跟进</el-dropdown-item
                    >
                    <el-dropdown-item
                      v-if="param.clueSourceType === 'QDS_ClUE_SOURCE_STAY'"
                      :data-tid="'ChatHandleClick' + scope.$index"
                      :command="{ component: 'callPhoneRef', item: scope.row }"
                      >在线聊</el-dropdown-item
                    >
                    <el-dropdown-item
                      v-if="param.clueSourceType === 'QDS_ClUE_SOURCE_IM'"
                      :data-tid="'callPhoneRef' + scope.$index"
                      :command="{ component: 'callPhoneRef', item: scope.row }"
                      >打电话</el-dropdown-item
                    >
                    <el-dropdown-item
                      :data-tid="'conversionRef' + scope.$index"
                      :command="{ component: 'conversionRef', item: scope.row }"
                      >转商机</el-dropdown-item
                    >
                    <el-dropdown-item
                      v-if="param.clueSourceType === 'QDS_ClUE_SOURCE_STAY'"
                      :data-tid="'noUse' + scope.$index"
                      :command="{
                        component: 'noAttentionRef',
                        item: { code: 'CULE_WXSJ', busId: scope.row.id },
                      }"
                      >无效</el-dropdown-item
                    >
                    <!-- <el-dropdown-item
                      :data-tid="'InvalidRef' + scope.$index"
                      :command="{ component: 'InvalidRef', item: scope.row }"
                      >无效</el-dropdown-item
                    > -->
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
    <no-attention ref="noAttentionRef" @on-submit="onSubmitHandle" />
  </div>
</template>

<script>
import './index.scss';
import ProspectiveCustomer from './prospective-customer';
export default ProspectiveCustomer;
</script>
