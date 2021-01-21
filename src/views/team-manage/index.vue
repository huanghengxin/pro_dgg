<template>
  <div class="manage">
    <div class="manage__search">
      <el-form ref="ruleForm" :model="ruleForm" label-width="100px" :inline="true">
        <el-form-item label="客户：" label-width="48px" prop="keyword">
          <el-input
            v-model.trim="ruleForm.keyword"
            class="keyword"
            clearable
            placeholder="请输入姓名/联系号码/商机编号查询"
            :maxlength="20"
            @clear="clearInput"
          ></el-input>
        </el-form-item>
        <el-form-item label="商机状态：" label-width="70px" prop="bizStatus">
          <el-select v-model="ruleForm.bizStatus" clearable placeholder="不限" @clear="clearInput">
            <el-option
              v-for="item in businessStatue"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="规划师：" label-width="56px" prop="plannerId" class="getPerson">
          <el-select
            v-model="ruleForm.plannerId"
            filterable
            value-key="mchUserId"
            remote
            :popper-append-to-body="false"
            reserve-keyword
            placeholder="不限"
            :remote-method="remoteMethod"
            :loading="selectLoading"
            popper-class="team-manage_select-remote"
            clearable
            @change="selectChangeHandle"
            @clear="clearInput"
          >
            <el-option
              v-for="item in peopleList"
              :key="item.mchUserId"
              :label="`${item.userName}` + `(` + `${item.userCenterNo}` + `）`"
              :value="item.mchUserId"
            >
              <div>
                <p>{{ item.userName + '（' + item.userCenterNo + '）' }}</p>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="获取时间" label-width="58px">
          <span
            v-for="(item, index) in enterTimeList"
            :key="index"
            :class="{
              'filter-item': true,
              'filter-item_active': index === enterTimeIndex,
            }"
            @click="changeEnterTime(item, index)"
          >
            {{ item.name }}
          </span>
          <el-date-picker
            v-show="enterTimeIndex === 4"
            v-model="times"
            type="datetimerange"
            clearable
            range-separator="-"
            :default-time="['00:00:00', '23:59:59']"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            @change="sureTimes"
          >
          </el-date-picker>
          <el-button size="small" type="primary" @click="searchHanle">搜索</el-button>
          <el-button size="small" @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="button-box">
      <el-button size="small" class="list-base-box-button" type="primary" @click="multiplHandleMove"
        >移交</el-button
      >
    </div>

    <div class="manage__main list-base-ui">
      <el-table
        ref="multipleTable"
        v-loading="loading"
        :data="teamBusyList"
        size="small"
        max-height="600"
        clear-sort
        :default-sort="{ prop: 'null', order: 'null' }"
        @selection-change="handleSelectionChange"
        @sort-change="sortList"
        @select-all="selectAllClick"
      >
        <template slot="empty">
          <svg-icon key="item-warp" type="nodata" icon="icon-icon_nodata" />
        </template>
        <el-table-column type="selection" min-width="44" class-name="list-selection">
        </el-table-column>
        <el-table-column class="list-name" fixed="left" label="姓名" min-width="150">
          <template slot-scope="scope">
            <router-link
              v-show="scope.row.customerName"
              :to="'/business-details?businessId=' + (scope.row.id || '')"
            >
              <show-tooltip
                v-if="scope.row.customerName"
                :text="scope.row.customerName"
                :width="110"
              ></show-tooltip>
            </router-link>
            <div v-show="scope.row.intentionLevel">
              <el-rate
                :value="Number(scope.row.intentionLevel)"
                disabled
                disabled-void-color="transparent"
              ></el-rate>
            </div>
            <div v-show="scope.row.bizSource">
              <span class="from">{{ scope.row.bizSource | fromFormat }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="联系方式" min-width="180">
          <template slot-scope="scope">
            <show-tooltip
              v-if="scope.row.customerContact"
              :text="scope.row.customerContact"
              :width="110"
            ></show-tooltip>
            <span v-else>暂无数据</span>
          </template>
        </el-table-column>
        <el-table-column label="所属规划师" min-width="200">
          <template slot-scope="scope">
            <show-tooltip
              v-if="scope.row.plannerName"
              :text="`${scope.row.plannerName}` + `（` + `${scope.row.jobNumber}` + `）`"
              :width="180"
            ></show-tooltip>
            <span v-else>暂无数据</span>
          </template>
        </el-table-column>
        <el-table-column prop="getTime" label="获取时间" sortable="custom" min-width="180">
          <template slot-scope="scope">
            <span v-if="scope.row.getTime">{{ scope.row.getTime }}</span>
            <span v-else>暂无数据</span>
          </template>
        </el-table-column>
        <el-table-column
          class="parentNodeColumn"
          prop="followTime"
          label="最新跟进信息"
          min-width="280"
          sortable="custom"
        >
          <template slot-scope="scope">
            <div v-if="scope.row.lastFollowInfo || scope.row.lastFollowTime">
              <div>
                <show-tooltip
                  v-show="scope.row.lastFollowInfo"
                  :text="scope.row.lastFollowInfo"
                  :width="240"
                  :tooltip-line-clamp="2"
                ></show-tooltip>
              </div>
              <div>
                <span v-show="scope.row.lastFollowTime">{{
                  scope.row.lastFollowTime | filterTime
                }}</span>
              </div>
            </div>
            <p v-else>暂无数据</p>
          </template>
        </el-table-column>
        <el-table-column prop="dropTime" label="预计掉库时间" min-width="280" sortable="custom">
          <template slot-scope="scope">
            <div v-if="scope.row.dropTime || scope.row.dropTypeName">
              <p v-show="scope.row.dropTime">{{ scope.row.dropTime | filterTime }}</p>
              <p v-show="scope.row.dropTypeName">{{ scope.row.dropTypeName }}</p>
            </div>
            <p v-else>暂无数据</p>
          </template>
        </el-table-column>
        <el-table-column label="客户需求" min-width="180">
          <template v-if="scope.row.requireName" slot-scope="scope">
            <more-require
              :require-item="scope.row.requireName"
              :require-progress="scope.row.requireProgress"
              is-separate
            />
          </template>
          <p v-else>暂无数据</p>
        </el-table-column>
        <el-table-column min-width="70" label="操作" fixed="right">
          <template slot-scope="scope">
            <p class="move" data-tid="remindHandleMove" @click="handleMove(scope.row)">移交</p>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="pagination-footer">
        <el-pagination
          background
          :current-page="ruleForm.start"
          :page-sizes="[10, 50, 100, 150]"
          :page-size="ruleForm.limit"
          layout="total, prev, pager, next, sizes, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        >
        </el-pagination>
      </div>
    </div>
    <cule-move-dialog
      ref="culeMoveDialog"
      @reset-list="resetList"
      @success-reset-list="resetList"
    />
    <multip-move-dialog ref="multipMoveDialog" @reset-list="resetList" />
    <show-more-require ref="showMoreRequireRefs" />
  </div>
</template>

<script>
import teamManage from './team-manage';
export default teamManage;
import './index.scss';
</script>
