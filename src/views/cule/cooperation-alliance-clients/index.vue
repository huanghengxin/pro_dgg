<template>
  <div class="cooperationCustomer">
    <div class="cooperationCustomer-seasBox">
      <list-search :tab-list="tabList" />
      <div class="tocooperationBox">
        <el-button type="primary" size="small" class="tocooperation" @click="tocooperation"
          >发起合作</el-button
        >
      </div>
    </div>
    <div class="cooperationCustomer__main">
      <div class="cooperationCustomer__main-warp list-base-ui">
        <!-- 不要修改table ref属性值，会影响批量打电话 -->
        <el-table
          ref="tableRef"
          v-loading="loading"
          :data="tableData.data"
          clear-sort
          :default-sort="{ prop: 'null', order: 'null' }"
          data-tid="recordSortList"
          @sort-change="sortList"
        >
          <template slot="empty">
            <svg-icon key="item-warp" type="nodata" icon="icon-icon_nodata" />
          </template>
          <el-table-column
            prop="customerName"
            label="姓名"
            fixed="left"
            min-width="90"
            class-name="list-name"
          >
            <template slot-scope="scope">
              <show-tooltip
                v-if="scope.row.customerName"
                :text="scope.row.customerName"
                :width="50"
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
          <el-table-column label="客户需求" min-width="100">
            <template slot-scope="scope">
              <div v-if="scope.row.require">
                <show-tooltip
                  :text="scope.row.require.replace(/\|/g, ',')"
                  :width="100"
                ></show-tooltip>
              </div>
              <span v-else>暂无数据</span>
            </template>
          </el-table-column>
          <el-table-column label="业务区域" min-width="120">
            <template slot-scope="scope">
              <div v-if="scope.row.businessArea">
                <show-tooltip
                  :text="scope.row.businessArea.replace(/\|/g, ',')"
                  :width="80"
                ></show-tooltip>
              </div>
              <span v-else>暂无数据</span>
            </template>
          </el-table-column>
          <el-table-column label="合作状态" min-width="100">
            <template slot-scope="scope">
              <div v-if="scope.row.cooperationState">
                <show-tooltip
                  :text="scope.row.cooperationState == 1 ? '合作中' : '已解除'"
                  :width="100"
                ></show-tooltip>
              </div>
              <span v-else>暂无数据</span>
            </template>
          </el-table-column>
          <el-table-column prop="lastRemarkTime" label="合作类型" min-width="120">
            <template slot-scope="scope">
              <div v-if="scope.row.cooperationType">
                <show-tooltip :text="scope.row.cooperationType" :width="80"></show-tooltip>
              </div>
              <p v-else>暂无数据</p>
            </template>
          </el-table-column>

          <el-table-column
            prop="lastRemarkTime"
            label="合作得分比例"
            sortable="custom"
            min-width="120"
          >
            <template slot-scope="scope">
              <div v-if="scope.row.cooperationRatio">
                <p>{{ scope.row.cooperationRatio + '%' }}</p>
              </div>
              <p v-else>暂无数据</p>
            </template>
          </el-table-column>
          <el-table-column
            prop="lastRemarkTime"
            label="预计退回时间"
            sortable="custom"
            min-width="180"
          >
            <template slot-scope="scope">
              <div v-if="scope.row.backTime">
                <show-tooltip :text="scope.row.backTime" :width="140"></show-tooltip>
              </div>
              <p v-else>暂无数据</p>
            </template>
          </el-table-column>
          <el-table-column label="发起人/时间" sortable="custom" min-width="180" prop="date">
            <template slot-scope="scope">
              <div v-if="scope.row.initiator || scope.row.date">
                <p v-show="scope.row.initiator">
                  {{ scope.row.initiator }}{{ '(' + scope.row.jobNo + ')' }}
                </p>
                <show-tooltip
                  v-show="scope.row.date"
                  :text="scope.row.date"
                  :width="140"
                ></show-tooltip>
              </div>
              <p v-else>暂无数据</p>
            </template>
          </el-table-column>

          <el-table-column prop="lastRemarkTime" label="合作原因" min-width="180">
            <template slot-scope="scope">
              <div v-if="scope.row.cooperationReason">
                <show-tooltip :text="scope.row.cooperationReason" :width="140"></show-tooltip>
              </div>
              <p v-else>暂无数据</p>
            </template>
          </el-table-column>
          <el-table-column label="接收时间" min-width="180">
            <template slot-scope="scope">
              <div v-if="scope.row.date">
                <show-tooltip
                  v-show="scope.row.date"
                  :text="scope.row.date"
                  :width="140"
                ></show-tooltip>
              </div>
              <p v-else>暂无数据</p>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="140" fixed="right" class-name="list-last">
            <template slot-scope="scope">
              <div class="list-handle">
                <p
                  class="list-handle_follow"
                  :data-tid="'appcet' + scope.$index"
                  @click="listHandleClick(scope.row.id)"
                >
                  接收
                </p>
                <p
                  class="list-handle_follow"
                  :data-tid="'refuseCooperation' + scope.$index"
                  @click="refuseCooperation(scope.row.id)"
                >
                  拒绝
                </p>
              </div>
            </template>
          </el-table-column>
          <!--<el-table-column label="操作" min-width="180" fixed="right" class-name="list-last">
            <template slot-scope="scope">
              <div class="list-handle">
                <p
                  class="list-handle_follow"
                  :data-tid="'refuseCooperation' + scope.$index"
                  @click="checkBusiness(scope.row.id)"
                >
                  查看商机
                </p>
                <p
                  class="list-handle_follow"
                  :data-tid="'refuseCooperation' + scope.$index"
                  @click="onlineTalk(scope.row.id)"
                >
                  在线聊
                </p>
              </div>
            </template>
          </el-table-column> -->
        </el-table>
        <div class="pagination-footer">
          <el-pagination
            background
            :current-page="param.start"
            :page-size="param.limit"
            :page-sizes="[10, 20, 30, 40, 50]"
            layout="total, prev, pager, next, sizes, jumper"
            :total="tableData.total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          >
          </el-pagination>
        </div>
      </div>
    </div>
    <RefusalReleaseReason ref="refusalReleaseReasonRef" class="refusalRelease" />
  </div>
</template>
<script>
import './index.scss';
import cooperationAllianceClients from './cooperation-alliance-clients.js';
export default cooperationAllianceClients;
</script>
