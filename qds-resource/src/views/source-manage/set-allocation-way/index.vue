<template>
  <div class="set-allocation-way-page">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane
        v-loading="loading"
        label="客源分配方式"
        name="first"
        :disabled="loading"
        class="allocation-way"
      >
        <template v-if="iconLoading">
          <svg-icon key="item-warp" type="nodata" icon="icon-icon_nodata" />
        </template>
        <el-form v-else label-width="140px" label-position="left">
          <template v-if="Object.keys(showListMap).length">
            <el-form-item
              v-for="item in dictionary"
              :key="item.id"
              :label="item.name + ':'"
              :show-message="false"
              :required="item.ext1 !== 'text'"
            >
              <template v-if="item.ext1 === 'select'">
                <el-select
                  v-model="showListMap[item.code].valueOne"
                  collapse-tags
                  multiple
                  :disabled="JSON.parse(showListMap[item.code].valueTwo)"
                  data-tid="bizSource"
                >
                  <el-option
                    v-for="(child, index) in handle(item.ext2)"
                    :key="child.code"
                    :label="child.name"
                    :value="child.code"
                    :data-tid="'value' + index"
                  ></el-option>
                </el-select>
              </template>
              <template v-if="item.ext1 === 'cascader'">
                <el-cascader
                  ref="customerRequireRef"
                  v-model="showListMap[item.code].valueOne"
                  :disabled="JSON.parse(showListMap[item.code].valueTwo)"
                  :options="options"
                  :props="props"
                  collapse-tags
                ></el-cascader>
              </template>
              <template v-if="item.ext1 === 'text'">{{ item.description }}</template>
              <el-checkbox
                v-if="item.ext1 !== 'text'"
                v-model="showListMap[item.code].valueTwo"
                true-label="true"
                false-label="false"
                @change="handleCheckAllChange($event, showListMap[item.code].ruleCode)"
                >全选</el-checkbox
              >
            </el-form-item>
          </template>
          <el-form-item v-if="Object.keys(showListMap).length">
            <el-button
              size="small"
              type="primary"
              :loading="saveButtonLoading"
              :disabled="!isSaveButton"
              @click="saveAllocation('DISTRIBUTION_CENTER_RULE_SET_UP_MODE')"
              >保存</el-button
            >
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane
        v-loading="loading"
        label="智能分配设置"
        name="second"
        :disabled="loading"
        class="set-allocation"
      >
        <template v-if="iconLoading">
          <svg-icon key="item-warp" type="nodata" icon="icon-icon_nodata" />
        </template>
        <el-form
          v-else
          ref="ruleForm2"
          :model="ruleForm2"
          :rules="rules"
          label-width="140px"
          label-position="left"
        >
          <template v-if="Object.keys(showListMap).length">
            <el-form-item
              v-for="item in dictionary"
              :key="item.id"
              :label="item.name + ':'"
              :prop="item.ext1"
              :class="item.ext1"
            >
              <template v-if="item.ext1 === 'allocationState'">
                <el-switch
                  v-model="showListMap[item.code].valueOne"
                  active-value="1"
                  inactive-value="0"
                  active-color="#4974F5"
                  inactive-color="#BFBFBF"
                >
                </el-switch>
              </template>
              <template v-if="item.ext1 === 'executeTime'">
                <el-time-picker
                  v-model="ruleForm2.executeTime"
                  is-range
                  range-separator="至"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  placeholder="选择时间范围"
                  value-format="HH:mm"
                  format="HH:mm"
                >
                </el-time-picker>
                <!-- <el-time-select
                  v-model="showListMap[item.code].valueOne"
                  :clearable="false"
                  placeholder="起始时间"
                  :picker-options="{
                    start: '00:00',
                    step: '00:15',
                    end: '23:59',
                  }"
                >
                </el-time-select>
                <el-time-select
                  v-model="showListMap[item.code].valueTwo"
                  placeholder="结束时间"
                  :clearable="false"
                  :picker-options="{
                    start: '00:00',
                    step: '00:15',
                    end: '23:59',
                    minTime: showListMap[item.code].valueOne,
                  }"
                >
                </el-time-select> -->
              </template>
              <template v-if="item.ext1 === 'changeTime'">
                <div class="set-allocation-right">
                  <span>客源进入智能分配</span>
                  <el-input v-model="showListMap[item.code].valueOne"></el-input>
                  <span>分钟后未分配成功，则进入人工分配。</span>
                </div>
              </template>
            </el-form-item>
          </template>
          <el-form-item v-if="Object.keys(showListMap).length">
            <el-button
              size="small"
              type="primary"
              :loading="saveButtonLoading"
              @click="saveAllocation('DISTRIBUTION_CENTER_RULE_SET_UP')"
              >保存</el-button
            >
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="智能分配日志" name="third" :disabled="loading" class="allocation-log">
        <div class="allocation-log-title">
          <div>
            <span>资源编号：</span>
            <el-input
              v-model="params.resourceNo"
              maxlength="20"
              clearable
              placeholder="请输入资源编号进行查询"
              @keyup.enter.native="searchParams"
            ></el-input>
            <span>客户名称：</span>
            <el-input
              v-model="params.customerName"
              maxlength="20"
              clearable
              placeholder="请输入客户名称进行查询"
              @keyup.enter.native="searchParams"
            ></el-input>
          </div>
          <div>
            <span>分配结果：</span>
            <el-select v-model="params.isSuccess">
              <el-option
                v-for="item in allotResultList"
                :key="item.ext1"
                :label="item.text"
                :value="item.ext1"
              >
              </el-option>
            </el-select>
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
        <div v-loading="loading" class="allocation-log-table list-base-ui">
          <el-table :data="tableData" style="width: 100%">
            <template slot="empty">
              <svg-icon key="item-warp" type="nodata" icon="icon-icon_nodata" />
            </template>
            <el-table-column prop="resourceNo" label="资源编号" min-width="200">
              <template slot-scope="scope">
                {{ scope.row.resourceNo || '-' }}
              </template>
            </el-table-column>
            <el-table-column prop="customerName" label="客户名称" min-width="120">
              <template slot-scope="scope">
                <show-tooltip :text="scope.row.customerName || '-'" :width="80"></show-tooltip>
              </template>
            </el-table-column>
            <el-table-column prop="customerPhone" label="客户号码" min-width="160">
              <template slot-scope="scope">
                {{ scope.row.customerPhone || '-' }}
              </template>
            </el-table-column>
            <el-table-column prop="entryTime" label="进入时间" min-width="200">
              <template slot-scope="scope">
                {{ scope.row.entryTime || '-' }}
              </template>
            </el-table-column>
            <el-table-column prop="startTime" label="开始分配时间" min-width="200">
              <template slot-scope="scope">
                {{ scope.row.startTime || '-' }}
              </template>
            </el-table-column>
            <el-table-column prop="endTime" label="分配结束时间" min-width="200">
              <template slot-scope="scope">
                {{ scope.row.endTime || '-' }}
              </template>
            </el-table-column>
            <el-table-column prop="allotType" label="分配类型" min-width="140">
              <template slot-scope="scope">
                {{ scope.row.allotType || '-' }}
              </template>
            </el-table-column>
            <el-table-column prop="assignerName" label="分配人" min-width="200">
              <template slot-scope="scope">
                <show-tooltip :text="scope.row.assignerName || '-'" :width="180"></show-tooltip>
              </template>
            </el-table-column>
            <el-table-column prop="msg" label="消费体" min-width="220">
              <template v-if="scope.row.msg" slot-scope="scope">
                <show-tooltip :text="scope.row.msg || '-'" :width="160"></show-tooltip>
              </template>
            </el-table-column>
            <el-table-column prop="isSuccess" label="分配结果" min-width="140">
              <template slot-scope="scope">
                <span :class="scope.row.isSuccess === '成功' ? 'success-color' : 'error-color'">{{
                  scope.row.isSuccess
                }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="message" label="分配说明" min-width="220">
              <template v-if="scope.row.message" slot-scope="scope">
                <show-tooltip :text="scope.row.message || '-'" :width="160"></show-tooltip>
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
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import './index.scss';
import setAllocationWay from './index.js';
export default setAllocationWay;
</script>
