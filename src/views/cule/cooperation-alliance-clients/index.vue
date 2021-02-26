<template>
  <div class="cooperationCustomer">
    <div class="cooperationCustomer-seasBox">
      <list-search :tab-list="tabList" :tab-active-prop="activeName" class="tabList" />
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
          :data="tableData.list"
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
            min-width="70"
            class-name="list-name"
          >
            <template slot-scope="scope">
              <show-tooltip
                v-if="scope.row.customerName"
                :text="scope.row.customerName"
                :width="70"
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
              <div v-if="scope.row.customerRequirementName">
                <show-tooltip
                  :text="scope.row.customerRequirementName.replace(/\|/g, ',')"
                  :width="100"
                ></show-tooltip>
              </div>
              <span v-else>暂无数据</span>
            </template>
          </el-table-column>
          <el-table-column label="业务区域" min-width="100">
            <template slot-scope="scope">
              <div v-if="scope.row.customerBizAreaName">
                <show-tooltip
                  :text="scope.row.customerBizAreaName.replace(/\|/g, ',')"
                  :width="80"
                ></show-tooltip>
              </div>
              <span v-else>暂无数据</span>
            </template>
          </el-table-column>
          <el-table-column label="合作状态" min-width="100">
            <template slot-scope="scope">
              <div v-if="scope.row.status">
                <show-tooltip
                  :text="
                    scope.row.status == 0 ? '合作中' : scope.row.status == 1 ? '合作成功' : '已解散'
                  "
                  :width="100"
                ></show-tooltip>
                <p v-if="scope.row.status == 2 && scope.row.abandonStatus == 2" style="color: #999">
                  {{ scope.row.abandonReason }}
                </p>
              </div>
              <span v-else>暂无数据</span>
            </template>
          </el-table-column>
          <el-table-column prop="lastRemarkTime" label="合作类型" min-width="120">
            <template slot-scope="scope">
              <div v-if="scope.row.type">
                <show-tooltip :text="scope.row.type" :width="80"></show-tooltip>
              </div>
              <p v-else>暂无数据</p>
            </template>
          </el-table-column>

          <el-table-column
            prop="lastRemarkTime"
            label="合作分得比例"
            sortable="custom"
            min-width="120"
          >
            <template slot-scope="scope">
              <div v-if="scope.row.ratio">
                <p>{{ scope.row.ratio + '%' }}</p>
              </div>
              <p v-else>暂无数据</p>
            </template>
          </el-table-column>
          <el-table-column prop="returnTime" label="预计退回时间" sortable="custom" min-width="160">
            <template slot-scope="scope">
              <div v-if="scope.row.returnTime">
                {{ scope.row.returnTime | filterTime }}
                <!-- <show-tooltip :text="scope.row.returnTime" :width="120"></show-tooltip> -->
              </div>
              <p v-else>暂无数据</p>
            </template>
          </el-table-column>
          <el-table-column label="发起人/时间" sortable="custom" min-width="160" prop="createDate">
            <template slot-scope="scope">
              <div v-if="scope.row.sponsorUserName || scope.row.createDate">
                <p v-show="scope.row.sponsorUserName">
                  {{ scope.row.sponsorUserName }}{{ '(' + scope.row.jobNumber + ')' }}
                </p>
                {{ scope.row.createDate | filterTime }}
                <!-- <show-tooltip
                  v-show="scope.row.createDate"
                  :text="scope.row.createDate"
                  :width="140"
                ></show-tooltip> -->
              </div>
              <p v-else>暂无数据</p>
            </template>
          </el-table-column>
          <el-table-column label="接收人" sortable="custom" min-width="160" prop="receiveUserName">
            <template slot-scope="scope">
              <div v-if="scope.row.receiveUserName || scope.row.receiveTime">
                <p v-show="scope.row.receiveUserName">
                  {{ scope.row.receiveUserName }}
                </p>
              </div>
              <p v-else>暂无数据</p>
            </template>
          </el-table-column>
          <el-table-column label="接收人/时间" sortable="custom" min-width="160" prop="receiveTime">
            <template slot-scope="scope">
              <div v-if="scope.row.receiveUserName || scope.row.receiveTime">
                <p v-show="scope.row.receiveUserName">
                  {{ scope.row.receiveUserName }}{{ '(' + scope.row.jobNumber + ')' }}
                </p>
                {{ scope.row.receiveTime | filterTime }}
                <!-- <show-tooltip
                  v-show="scope.row.receiveTime"
                  :text="scope.row.receiveTime"
                  :width="140"
                ></show-tooltip> -->
              </div>
              <p v-else>暂无数据</p>
            </template>
          </el-table-column>

          <el-table-column prop="lastRemarkTime" label="合作原因" min-width="180">
            <template slot-scope="scope">
              <div v-if="scope.row.reason">
                <show-tooltip :text="scope.row.reason" :width="140"></show-tooltip>
              </div>
              <p v-else>暂无数据</p>
            </template>
          </el-table-column>
          <el-table-column label="接收时间" min-width="180">
            <template slot-scope="scope">
              <div v-if="scope.row.receiveTime">
                {{ scope.row.receiveTime | filterTime }}
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
