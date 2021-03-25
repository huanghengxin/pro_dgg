<template>
  <div class="prospective">
    <div class="prospective__search">
      <div>
        <search-button
          show-word-limit
          placeholder="请输入姓名/客户号码/联系号码"
          data-tid="prospectiveHandleInputValue"
          :from="'cule'"
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
            v-if="param.clueSourceType === 'QDS_CLUE_SOURCE_SEAS'"
            label="信息来源"
            min-width="220"
          >
            <template slot-scope="scope">
              <div v-if="scope.row.informationSource && scope.row.informationSource.length > 0">
                <el-tag v-for="item in scope.row.informationSource" :key="item.id">{{
                  item
                }}</el-tag>
              </div>
              <span v-else>暂无数据</span>
            </template>
          </el-table-column>
          <el-table-column label="客户号码" min-width="180">
            <template slot-scope="scope">
              <show-tooltip
                v-if="scope.row.customerPhone"
                :text="scope.row.customerPhone"
                :width="150"
              ></show-tooltip>
              <span v-else>暂无数据</span>
            </template>
          </el-table-column>
          <el-table-column
            v-if="param.clueSourceType === 'QDS_CLUE_SOURCE_SEAS'"
            label="联系号码"
            min-width="180"
          >
            <template slot-scope="scope">
              <show-tooltip
                v-if="scope.row.hideNumber"
                :text="scope.row.hideNumber"
                :width="150"
              ></show-tooltip>
              <span v-else>暂无数据</span>
            </template>
          </el-table-column>
          <el-table-column label="客户号码" min-width="180">
            <template slot-scope="scope">
              <show-tooltip
                v-if="scope.row.customerPhone"
                :text="scope.row.customerPhone"
                :width="150"
              ></show-tooltip>
              <span v-else>暂无数据</span>
            </template>
          </el-table-column>
          <el-table-column
            v-if="param.clueSourceType === 'QDS_CLUE_SOURCE_SEAS'"
            label="联系号码"
            min-width="180"
          >
            <template slot-scope="scope">
              <show-tooltip
                v-if="scope.row.hideNumber"
                :text="scope.row.hideNumber"
                :width="150"
              ></show-tooltip>
              <span v-else>暂无</span>
            </template>
          </el-table-column>
          <el-table-column label="状态" min-width="150">
            <template slot-scope="scope">
              <span v-if="scope.row.clueStatus">{{ scope.row.clueStatus }}</span>
              <span v-else>暂无数据</span>
            </template>
          </el-table-column>
          <el-table-column label="更新时间" prop="updateTime" sortable="custom" min-width="180">
            <template slot-scope="scope">
              <span v-if="scope.row.updateTime">{{ scope.row.updateTime | filterTime }}</span>
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
            v-if="param.clueStatus !== 'QDS_CLUE_STATUS_NOT'"
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
                  v-if="param.clueSourceType === 'QDS_CLUE_SOURCE_SEAS'"
                  class="list-handle_follow"
                  :data-tid="'customerListHandleClick' + scope.$index"
                  @click="callPhone(scope.row)"
                >
                  打电话
                </p>
                <p
                  v-if="param.clueSourceType === 'QDS_CLUE_SOURCE_IM'"
                  class="list-handle_follow"
                  :data-tid="'IMchat' + scope.$index"
                  @click="onlineChatClick({ code: 'CULE_WXSJ', item: scope.row })"
                >
                  在线聊
                </p>
                <p
                  v-if="param.accredit === 'NO'"
                  class="list-handle_follow"
                  :data-tid="'handleFollowRef' + scope.$index"
                  @click="listHandleClick(scope.row)"
                >
                  写跟进
                </p>
                <el-dropdown
                  v-if="param.accredit !== 'NO'"
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
                      v-if="param.clueSourceType === 'QDS_CLUE_SOURCE_SEAS'"
                      :data-tid="'IMchat' + scope.$index"
                      :command="{
                        component: 'IMchat',
                        item: { code: 'CULE_WXSJ', item: scope.row },
                      }"
                      >在线聊</el-dropdown-item
                    >
                    <el-dropdown-item
                      v-if="param.clueSourceType === 'QDS_CLUE_SOURCE_IM'"
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
                      v-if="param.clueSourceType === 'QDS_CLUE_SOURCE_SEAS'"
                      :data-tid="'InvalidRef' + scope.$index"
                      :command="{
                        component: 'noAttentionRef',
                        item: { code: 'CULE_WXSJ', busId: scope.row.id },
                      }"
                      >无效</el-dropdown-item
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
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          >
          </el-pagination>
        </div>
      </div>
    </div>
    <library-records
      ref="libraryRecordsRef"
      data-tid="publicResetList"
      :from="'prospective'"
      @reset-list="submitHandle"
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
