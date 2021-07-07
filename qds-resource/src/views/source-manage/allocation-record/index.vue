<template>
  <div class="allocation-record-page">
    <div class="allocation-record-title">
      <div>
        <span>客户：</span>
        <el-input
          v-model="params.keyword"
          maxlength="20"
          clearable
          placeholder="输入姓名/号码/商机编号查询"
          @keyup.enter.native="searchParams"
        ></el-input>
      </div>
      <div>
        <span>客源需求：</span>
        <el-cascader
          ref="customerRequireRef"
          v-model="params.customerRequire"
          clearable
          placeholder="请选择"
          data-tid="customerRequire"
          :props="props"
        ></el-cascader>
      </div>
      <div>
        <span>接收商户：</span>
        <drop-select
          ref="plannerRefs0"
          value-key="id"
          placeholder="输入商户名称关键词查询"
          type="merchantList"
          class="drop-select"
          @change="selectChangeHandle"
        ></drop-select>
      </div>
      <div>
        <span>接收人：</span>
        <drop-select
          ref="plannerRefs1"
          value-key="mchUserId"
          placeholder="输入姓名/工号/手机号查询"
          type="acceptList"
          is-dimission
          is-administrator
          class="drop-select"
          @change="selectChangeHandle"
        ></drop-select>
      </div>
      <div>
        <span>来源平台：</span>
        <el-select v-model="params.sourceChannel">
          <el-option
            v-for="item in sourcesList"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          >
          </el-option>
        </el-select>
      </div>
      <div>
        <span>录入人：</span>
        <drop-select
          ref="plannerRefs2"
          value-key="mchUserId"
          placeholder="输入姓名/工号/手机号查询"
          type="plannerList"
          is-dimission
          is-administrator
          data-tid="addRecordSearchPlanner"
          class="drop-select"
          @change="selectChangeHandle"
        ></drop-select>
      </div>
      <div>
        <span>分配方式：</span>
        <el-select v-model="params.allotWay">
          <el-option
            v-for="item in allocationWayList"
            :key="item.ext1"
            :label="item.text"
            :value="item.ext1"
          >
          </el-option>
        </el-select>
      </div>
      <div>
        <span>分配人：</span>
        <drop-select
          ref="plannerRefs3"
          value-key="mchUserId"
          placeholder="输入姓名/工号/手机号查询"
          type="handleObjList"
          is-dimission
          is-administrator
          data-tid="addRecordSearchPlanner"
          class="drop-select"
          @change="selectChangeHandle"
        ></drop-select>
      </div>
      <div>
        <span>录入时间：</span>
        <el-date-picker
          v-model="addTime"
          type="daterange"
          range-separator="-"
          start-placeholder="选择开始时间"
          end-placeholder="选择结束时间"
          data-tid="harassmentSureDate"
          @change="sureDate($event, 'entry')"
        >
        </el-date-picker>
      </div>
      <div>
        <span>分配时间：</span>
        <el-date-picker
          v-model="allocationTime"
          type="daterange"
          range-separator="-"
          start-placeholder="选择开始时间"
          end-placeholder="选择结束时间"
          data-tid="harassmentSureDate"
          @change="sureDate($event, 'allot')"
        >
        </el-date-picker>
      </div>
      <div>
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
    <el-button size="small" type="primary" @click="exportRecord">导出</el-button>
    <div v-loading="loading" class="allocation-record-table list-base-ui">
      <el-table :data="tableData" style="width: 100%">
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
            <show-tooltip :text="scope.row.customerPhone || '-'" :width="100"></show-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="客户需求/区域" min-width="180">
          <template slot-scope="scope">
            <show-tooltip
              :text="`${scope.row.requireName}/${scope.row.bizCityName}` || '-'"
              :width="140"
            ></show-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="allotWay" label="分配方式" min-width="140">
          <template slot-scope="scope">
            {{ allocationWayType[scope.row.allotWay] || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="entryTime" label="录入时间" min-width="220">
          <template slot-scope="scope">
            {{ scope.row.entryTime || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="allotTime" label="分配时间" min-width="220">
          <template slot-scope="scope">
            {{ scope.row.allotTime || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="assignerName" label="分配人" min-width="220">
          <template slot-scope="scope">
            <show-tooltip :text="scope.row.assignerName || '-'" :width="180"></show-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="merchantsName" label="接收商户" min-width="220">
          <template slot-scope="scope">
            <show-tooltip
              :text="scope.row.merchantsName || '-'"
              :tooltip-line-clamp="2"
              :width="160"
            ></show-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="plannerName" label="接收人" min-width="220">
          <template slot-scope="scope">
            <show-tooltip :text="scope.row.plannerName || '-'" :width="180"></show-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="entryName" label="录入人" min-width="220">
          <template slot-scope="scope">
            <show-tooltip :text="scope.row.entryName || '-'" :width="180"></show-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="keyword" label="关键词" min-width="140">
          <template slot-scope="scope">
            <show-tooltip :text="scope.row.keyword || '-'" :width="80"></show-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="sourceUrl" label="来源URL" min-width="280">
          <template slot-scope="scope">
            <show-tooltip :text="scope.row.sourceUrl || '-'" :width="240"></show-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="sourceChannel" label="来源平台" min-width="140">
          <template slot-scope="scope">
            {{ scope.row.sourceChannel || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" min-width="240" class-name="list-last">
          <template slot-scope="scope">
            <span
              v-if="scope.row.bizLibrary ? scope.row.bizLibrary !== 'INVALID' : false"
              class="handle-text"
              @click="lookDetails(scope.row.resourceId)"
              >查看详情</span
            >
            <span
              v-if="scope.row.bizLibrary ? ['PERSONAL'].includes(scope.row.bizLibrary) : false"
              class="handle-text middle"
              @click="imChat(scope.row)"
              >联系跟进人</span
            >
            <span
              v-if="
                scope.row.bizLibrary
                  ? !['INVALID', 'PERSONAL', 'PLATFORM'].includes(scope.row.bizLibrary)
                  : false
              "
              class="handle-text"
              @click="handleBack(scope.row)"
              >拾回</span
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="footer">
        <el-pagination
          :current-page.sync="params.start"
          :page-sizes="[10, 20, 30, 40, 50]"
          background
          layout="total, prev, pager, next,sizes,  jumper"
          :total="tableDataPage"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        >
        </el-pagination>
      </div>
    </div>
    <el-dialog
      title="编辑客源"
      width="680px"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      custom-class="edit-source-dialog"
    >
      <edit-source
        ref="editSourceRef"
        type="handle_back"
        load-biz-info
        @update="update"
        @no-biz="update"
        @close="dialogVisible = false"
      ></edit-source>
    </el-dialog>
  </div>
</template>
<script>
import './index.scss';
import allocationRecord from './index.js';
export default allocationRecord;
</script>
