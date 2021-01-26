<template>
  <div class="seas">
    <div class="seas__search">
      <div class="seas__search-from">
        <span class="lable">进库时间</span>
        <span
          v-for="(item, index) in enterTimeList"
          :key="item.code"
          :class="{
            'filter-item': true,
            'filter-item_active': index === enterTimeIndex,
          }"
          data-tid="recordChangeEnterTime"
          @click="changeEnterTime(item, index)"
        >
          {{ item.name }}
        </span>
      </div>
    </div>

    <div class="button-box">
      <el-button
        size="small"
        class="list-base-box-button"
        type="primary"
        @click="multiplCuleHandleRetrieve"
        >拾回</el-button
      >
    </div>

    <div class="seas__main">
      <div class="seas__main-warp list-base-ui">
        <!-- 不要修改table ref属性值，会影响批量打电话 -->
        <el-table
          ref="tableRef"
          v-loading="loading"
          :data="publicLibraryList"
          clear-sort
          :default-sort="{ prop: 'null', order: 'null' }"
          data-tid="recordSortList"
          @selection-change="handleSelectionChange"
          @select-all="selectAllClick"
          @sort-change="sortList"
        >
          <template slot="empty">
            <svg-icon key="item-warp" type="nodata" icon="icon-icon_nodata" />
          </template>
          <el-table-column type="selection" width="44" class-name="list-selection">
          </el-table-column>
          <el-table-column
            prop="customerName"
            label="姓名"
            fixed="left"
            min-width="120"
            class-name="list-name"
          >
            <template slot-scope="scope">
              <show-tooltip
                v-if="scope.row.customerName"
                :text="scope.row.customerName"
                :width="80"
              ></show-tooltip>
              <span v-else>暂无数据</span>
            </template>
          </el-table-column>
          <el-table-column label="联系号码" min-width="160">
            <template slot-scope="scope">
              <show-tooltip
                v-if="scope.row.customerPhone"
                :text="scope.row.customerPhone"
                :width="120"
              ></show-tooltip>
              <span v-else>暂无数据</span>
            </template>
          </el-table-column>
          <el-table-column label="意向业务" min-width="180">
            <template v-if="scope.row.intentionType" slot-scope="scope">
              <more-require :require-item="scope.row.intentionType" :symbol="'|'" is-separate />
            </template>
            <span v-else>暂无数据</span>
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
          <el-table-column label="进库原因/时间" min-width="240">
            <template slot-scope="scope">
              <div v-if="scope.row.enterStorageReason || scope.row.enterStorageTime">
                <p v-show="scope.row.enterStorageReason">{{ scope.row.enterStorageReason }}</p>
                <p v-show="scope.row.enterStorageTime">{{ scope.row.enterStorageTime }}</p>
              </div>
              <p v-else>暂无数据</p>
            </template>
          </el-table-column>
          <el-table-column prop="lastRemarkTime" label="备注" sortable="custom" min-width="240">
            <template slot-scope="scope">
              <div v-if="scope.row.lastRemarkContent">
                <show-tooltip :text="scope.row.lastRemarkContent" :width="194"></show-tooltip>
                <p>{{ scope.row.lastRemarkTime }}</p>
              </div>
              <p v-else>暂无数据</p>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="130" fixed="right" class-name="list-last">
            <template slot-scope="scope">
              <div class="list-handle">
                <p
                  class="list-handle_follow"
                  :data-tid="'remarkListHandleClick' + scope.$index"
                  @click="listHandleClick(scope.row)"
                >
                  拾回
                </p>
                <el-dropdown trigger="click" @command="handleCommand">
                  <p class="list-handle_more">更多操作</p>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      :data-tid="'clueSeasLibraryCallPhone' + scope.$index"
                      :command="{ component: 'callPhoneRef', item: scope.row }"
                      >打电话</el-dropdown-item
                    >
                    <el-dropdown-item
                      :data-tid="'clueSeasLibraryRemark' + scope.$index"
                      :command="{ component: 'remarkRef', item: scope.row }"
                      >备注</el-dropdown-item
                    >
                    <el-dropdown-item
                      :data-tid="'clueSeasLibraryConversionRef' + scope.$index"
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
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          >
          </el-pagination>
        </div>
      </div>
    </div>
    <multip-cule-retrieve-dialog
      ref="multipCuleRetrieveDialog"
      data-tid="recordResetList"
      @reset-list="resetList"
    />
    <library-records
      ref="libraryRecordsRef"
      data-tid="recordRecordsResetList"
      @reset-list="recordsResetList"
    />
    <show-more-require ref="showMoreRequireRefs" />
  </div>
</template>
<script>
import './index.scss';
import clueSeasLibrary from './clue-seas-library.js';
export default clueSeasLibrary;
</script>
