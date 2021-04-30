<template>
  <div class="cooperationCustomer">
    <div class="cooperationCustomer-seasBox">
      <list-search
        :tab-list="tabList"
        class="tabList"
        :tab-active-prop="activeName"
        @clear-sort="clearSort"
      />
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
            min-width="140"
            class-name="list-name"
          >
            <template slot-scope="scope">
              <show-tooltip
                v-if="scope.row.customerName"
                :text="scope.row.customerName || '-'"
                :width="120"
              ></show-tooltip>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column label="联系号码" min-width="160">
            <template slot-scope="scope">
              <show-tooltip
                v-if="scope.row.customerPhone"
                :text="scope.row.customerPhone || '-'"
                :width="100"
              ></show-tooltip>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column label="客户需求" min-width="120">
            <template slot-scope="scope">
              <div v-if="scope.row.requirementName">
                <show-tooltip
                  :text="scope.row.requirementName.replace(/\|/g, ',') || ''"
                  :width="80"
                ></show-tooltip>
              </div>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column label="业务区域" min-width="100">
            <template slot-scope="scope">
              <div v-if="scope.row.bizAreaName">
                <show-tooltip
                  :text="scope.row.bizAreaName.replace(/\|/g, ',') || '-'"
                  :width="80"
                ></show-tooltip>
              </div>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column v-if="map.cooperationStatus" label="合作状态" min-width="100">
            <template slot-scope="scope">
              <div v-if="scope.row.status">
                <p class="receive">
                  <show-tooltip
                    title-class="receive"
                    :text="cooperationStatus(scope.row)"
                    :width="100"
                  ></show-tooltip>
                </p>
                <p v-if="scope.row.dissolutionStatus == 3" style="color: #999">
                  <show-tooltip
                    :text="scope.row.dissolutionReason || '-'"
                    :width="80"
                  ></show-tooltip>
                </p>
              </div>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="lastRemarkTime"
            :label="
              statusType == 'buildStatus' && statusValue == undefined ? '合作类型/比例' : '合作类型'
            "
            :min-width="statusType == 'buildStatus' && statusValue == undefined ? '160' : '120'"
          >
            <template slot-scope="scope">
              <div v-if="scope.row.type">
                <show-tooltip
                  :text="scope.row.type == 1 ? '自留维护权' : '转出维护权' || '-'"
                  :width="80"
                ></show-tooltip>
                <span v-if="statusType == 'buildStatus' && statusValue == undefined">{{
                  '/' + scope.row.ratio + '%'
                }}</span>
              </div>
              <p v-else>-</p>
            </template>
          </el-table-column>
          <!--分配方式-->
          <el-table-column
            v-if="map.allocationModeStatus"
            prop="lastRemarkTime"
            label="分配方式"
            min-width="120"
          >
            <template slot-scope="scope">
              <div v-if="scope.row.allocationMode">
                <p>{{ scope.row.allocationMode == 1 ? '定向分单' : '抢单' }}</p>
              </div>
              <p v-else>-</p>
            </template>
          </el-table-column>
          <!--合作分得比例-->
          <el-table-column
            v-if="map.ratioStatus"
            prop="lastRemarkTime"
            :label="
              (statusType == 'receiveStatus' && statusValue == undefined) ||
              (statusType == 'receiveStatus' && statusValue == 1)
                ? '合作分得比例'
                : statusType == 'buildStatus' && statusValue == 1
                ? '合作分出比例'
                : ''
            "
            sortable="custom"
            min-width="120"
          >
            <template slot-scope="scope">
              <div v-if="scope.row.ratio">
                <p>{{ scope.row.ratio + '%' }}</p>
              </div>
              <p v-else>-</p>
            </template>
          </el-table-column>
          <!--预计退回时间-->
          <el-table-column
            v-if="map.expectReturnTimeStatus"
            prop="expectReturnTime"
            label="预计退回时间"
            sortable="custom"
            min-width="160"
          >
            <template slot-scope="scope">
              <div v-if="scope.row.expectReturnTime">
                {{ scope.row.expectReturnTime | filterTime }}
                <!-- <show-tooltip :text="scope.row.returnTime" :width="120"></show-tooltip> -->
              </div>
              <p v-else>-</p>
            </template>
          </el-table-column>

          <el-table-column
            v-if="statusType == 'buildStatus' && statusValue == 9"
            prop="returnTime"
            label="退回原因/时间"
            sortable="custom"
            min-width="220"
          >
            <template slot-scope="scope">
              <div v-if="scope.row.returnReason || scope.row.returnTime" style="text-align: left">
                <show-tooltip
                  title-class="receive"
                  :text="scope.row.returnReason || '-'"
                  :width="180"
                ></show-tooltip>
                <p>{{ scope.row.returnTime | filterTime }}</p>
              </div>
              <p v-else>-</p>
            </template>
          </el-table-column>
          <!-- 发起人/时间 -->
          <el-table-column
            v-if="map.createTimePersonTimeStatus"
            label="发起人/时间"
            sortable="custom"
            min-width="220"
            prop="createTime"
          >
            <template slot-scope="scope">
              <div v-if="scope.row.sponsorName || scope.row.createTime">
                <p class="receive">
                  <show-tooltip
                    title-class="receive"
                    :text="scope.row.sponsorName + '(' + scope.row.sponsorJob + ')' || '-'"
                    :width="160"
                  ></show-tooltip>
                </p>
                {{ scope.row.createTime | filterTime }}
              </div>
              <p v-else>-</p>
            </template>
          </el-table-column>
          <!-- 发起时间 -->
          <el-table-column
            v-if="map.createTimeTimeStatus"
            label="发起时间"
            sortable="custom"
            min-width="170"
            prop="createTime"
          >
            <template slot-scope="scope">
              <div v-if="scope.row.createTime">
                {{ scope.row.createTime | filterTime }}
              </div>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <!-- 接收人 -->
          <el-table-column
            v-if="map.receiveUserNameStatus"
            label="接收人"
            min-width="180"
            prop="receiveName"
          >
            <template slot-scope="scope">
              <p
                v-if="
                  (scope.row.allocationMode == 2 && !scope.row.receiveName) ||
                    !scope.row.receiveName
                "
              >
                暂无
              </p>
              <div v-else>
                <show-tooltip
                  title-class="receive"
                  :text="scope.row.receiveName + '(' + scope.row.receiveJob + ')' || '-'"
                  :width="140"
                ></show-tooltip>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            v-if="map.receiveUserNameTimeStatus"
            label="接收人/时间"
            sortable="custom"
            min-width="220"
            prop="receiveTime"
          >
            <template slot-scope="scope">
              <div>
                <p class="receive">
                  <span
                    v-if="
                      (scope.row.allocationMode == 2 && !scope.row.receiveName) ||
                        !scope.row.receiveName
                    "
                    >暂无</span
                  >
                  <show-tooltip
                    v-else
                    title-class="receive"
                    :text="scope.row.receiveName + '(' + scope.row.receiveJob + ')' || '-'"
                    :width="160"
                  ></show-tooltip>
                </p>
                <p v-if="scope.row.receiveTime">
                  {{ scope.row.receiveTime | filterTime }}
                </p>
              </div>
            </template>
          </el-table-column>
          <!-- 合作原因 -->
          <el-table-column v-if="map.reasonStatus" prop="reason" label="合作原因" min-width="180">
            <template slot-scope="scope">
              <div v-if="scope.row.reason">
                <show-tooltip :text="scope.row.reason || '-'" :width="140"></show-tooltip>
              </div>
              <p v-else>暂无</p>
            </template>
          </el-table-column>
          <el-table-column
            v-if="statusType == 'receiveStatus' && statusValue == 1"
            sortable="custom"
            label="接收时间"
            min-width="180"
            prop="receiveTime"
          >
            <template slot-scope="scope">
              <div v-if="scope.row.receiveTime">
                {{ scope.row.receiveTime | filterTime }}
              </div>
              <p v-else>-</p>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            :min-width="
              statusType == 'receiveStatus' && statusValue == undefined
                ? '140'
                : statusType == 'receiveStatus' && statusValue == 1
                ? '180'
                : statusType == 'buildStatus' && statusValue == 1
                ? '180'
                : '120'
            "
            fixed="right"
            class-name="list-last"
          >
            <template slot-scope="scope">
              <div v-if="map.receiveBtnStatus" class="list-handle">
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
              <div v-else-if="map.checkBusBtnStatus" class="list-handle">
                <p
                  class="list-handle_follow"
                  :data-tid="'checkBusiness' + scope.$index"
                  @click="checkBusiness(scope.row)"
                >
                  查看商机
                </p>
                <p
                  class="list-handle_follow"
                  :data-tid="'onlineTalk' + scope.$index"
                  @click="onlineTalk(scope.row)"
                >
                  在线聊
                </p>
              </div>
              <div
                v-else-if="map.remindSomeBtnStatus && scope.row.allocationMode != 2"
                class="list-handle"
              >
                <p
                  class="list-handle_follow"
                  :data-tid="'remindSomeBody' + scope.$index"
                  @click="remindSomeBody(scope.row)"
                >
                  提醒他(她)
                </p>
              </div>
              <div v-else-if="map.againInitiateStatus" class="list-handle">
                <p
                  class="list-handle_follow"
                  :data-tid="'againInitiate' + scope.$index"
                  :class="actived === scope.$index ? 'disabledColor' : 'activeColor'"
                  @click="againInitiate(scope.row, scope.$index)"
                >
                  重新发起
                </p>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-footer">
          <el-pagination
            background
            :current-page="storeParam.start"
            :page-size="storeParam.limit"
            :page-sizes="[10, 20, 30, 40, 50]"
            layout="total, prev, pager, next, sizes, jumper"
            :total="tableData.totalCount"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          >
          </el-pagination>
        </div>
      </div>
    </div>
    <RefusalReleaseReason
      ref="refusalReleaseReasonRef"
      class="refusalRelease"
      @refresh-list="listRefresh"
    />
    <InitiateCooperation ref="initiateCooperationRef" />
  </div>
</template>
<script>
import cooperationAllianceClients from './index.js';
export default cooperationAllianceClients;
</script>
