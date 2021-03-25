<template>
  <div class="open">
    <div class="open__search">
      <div class="open__search-from">
        <span class="lable">维护人</span>
        <span
          v-for="(item, index) in belongTo"
          :key="item.code"
          :class="{
            'filter-item': true,
            'filter-item_active': index === active.belongIndex,
          }"
          data-tid="publicChangeBelong"
          @click="changeBelong(item, index)"
        >
          {{ item.name }}
        </span>
      </div>
      <div
        v-show="screeningItems.bizLibrary && screeningItems.bizLibrary.length > 0"
        class="open__search-from"
      >
        <span class="lable">库层级</span>
        <span
          v-for="(item, index) in screeningItems.bizLibrary"
          :key="item.code"
          :class="{
            'filter-item': true,
            'filter-item_active': index === active.gradeIndex,
          }"
          data-tid="publicChangeGrade"
          @click="filterTag(item, index, 'bizLibrary')"
        >
          {{ item.name }}
        </span>
      </div>
      <div
        v-show="screeningItems.inLabraryType && screeningItems.inLabraryType.length > 0"
        class="open__search-from"
      >
        <span class="lable">进库原因</span>
        <span
          v-for="(item, index) in screeningItems.inLabraryType"
          :key="item.code"
          :class="{
            'filter-item': true,
            'filter-item_active': index === active.caseIndex,
          }"
          data-tid="publicChangeCase"
          @click="filterTag(item, index, 'inLabraryType')"
        >
          {{ item.name }}
        </span>
      </div>
      <div
        v-show="screeningItems.inLabraryTime && screeningItems.inLabraryType.length > 0"
        class="open__search-from"
      >
        <span class="lable">进库时间</span>
        <span
          v-for="(item, index) in screeningItems.inLabraryTime"
          :key="index"
          :class="{
            'filter-item': true,
            'filter-item_active': index === active.enterTimeIndex,
          }"
          data-tid="publicChangeEnterTime"
          @click="filterTag(item, index, 'inLabraryTime')"
        >
          {{ item.name }}
        </span>
      </div>
      <div
        v-show="screeningItems.productClass && screeningItems.productClass.length > 0"
        class="open__search-from"
      >
        <span class="lable">产品类型</span>
        <span
          v-for="(item, index) in screeningItems.productClass"
          :key="item.code"
          :class="{
            'filter-item': true,
            'filter-item_active': index === active.needIndex,
          }"
          data-tid="publicChangeNeed"
          @click="filterTag(item, index, 'productClass')"
        >
          {{ item.name }}
        </span>
      </div>
    </div>
    <div class="button-box">
      <el-button class="list-base-box-button" size="small" type="primary" @click="callUp('bus')"
        >打电话</el-button
      >
    </div>
    <div class="open__main">
      <div class="open__main-warp list-base-ui">
        <!-- 不要修改table ref属性值，会影响批量打电话 -->
        <el-table
          ref="tableRef"
          v-loading="loading"
          clear-sort
          :default-sort="{ prop: 'null', order: 'null' }"
          :data="publicLibraryList"
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
          <el-table-column label="客户需求" min-width="180">
            <template slot-scope="scope">
              <more-require
                v-if="scope.row.requireNameStr || scope.row.requireProgress"
                :require-item="scope.row.requireNameStr"
                :require-progress="scope.row.requireProgress"
                is-separate
                :width-num="98"
                :require-id="scope.row.id"
                @open-details="handleNeedDetails"
              />
              <span v-else>暂无数据</span>
            </template>
          </el-table-column>
          <el-table-column prop="getTime" label="获取时间" sortable="custom" min-width="180">
            <template slot-scope="scope">
              <span v-if="scope.row.getTime">{{ scope.row.getTime }}</span>
              <span v-else>暂无数据</span>
            </template>
          </el-table-column>
          <el-table-column label="原维护人" min-width="180">
            <template slot-scope="scope">
              <show-tooltip
                v-if="scope.row.plannerName || scope.row.jobNumber"
                :text="`${scope.row.plannerName}` + `(` + `${scope.row.jobNumber}` + `)`"
                :width="170"
              ></show-tooltip>
              <span v-else>暂无数据</span>
            </template>
          </el-table-column>
          <el-table-column prop="enterTime" label="进库原因/时间" min-width="260" sortable="custom">
            <template slot-scope="scope">
              <div v-if="scope.row.inLabraryTime || scope.row.inLabraryTypeStr">
                <p>{{ scope.row.inLabraryTypeStr }}</p>
                <p>{{ scope.row.inLabraryTime }}</p>
              </div>
              <p v-else>暂无数据</p>
            </template>
          </el-table-column>
          <el-table-column label="备注" min-width="260">
            <template slot-scope="scope">
              <div v-if="scope.row.commonMsg || scope.row.commonMsgTime">
                <show-tooltip
                  v-if="scope.row.commonMsg"
                  :text="scope.row.commonMsg"
                  :width="220"
                ></show-tooltip>
                <p>{{ scope.row.commonMsgTime }}</p>
              </div>
              <p v-else>暂无数据</p>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="130" fixed="right" class-name="list-last">
            <template slot-scope="scope">
              <div class="list-handle">
                <p
                  class="list-handle_follow"
                  :data-tid="'publicListHandleClick' + scope.$index"
                  @click="listHandleClick(scope.row)"
                >
                  拾回
                </p>
                <el-dropdown
                  trigger="click"
                  :data-tid="'handleCommand' + scope.$index"
                  @command="handleCommand"
                >
                  <p class="list-handle_more">更多操作</p>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      :data-tid="'callPhone' + scope.$index"
                      :command="{ component: 'callPhoneRef', item: scope.row }"
                      >打电话</el-dropdown-item
                    >
                    <el-dropdown-item
                      :data-tid="'remark' + scope.$index"
                      :command="{ component: 'remarkRef', item: scope.row }"
                      >备注</el-dropdown-item
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
            :current-page="param.pageNum"
            :page-size="param.pageSize"
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
    <library-records ref="libraryRecordsRef" data-tid="publicResetList" @reset-list="resetList" />
    <show-more-require ref="showMoreRequireRefs" />
    <needs-details-dialog ref="needsDetailsDialog" />
  </div>
</template>

<script>
import './index.scss';
import publicLibrary from './public-library';
export default publicLibrary;
</script>
