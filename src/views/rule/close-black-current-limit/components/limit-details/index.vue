<template>
  <div class="limit-details-page">
    <el-dialog
      title="限制详情"
      :visible.sync="dialogVisible"
      width="480px"
      :close-on-click-modal="false"
      destroy-on-close
      @closed="dialogColsed"
    >
      <div class="limit-details-scroll">
        <div class="limit-details-content">
          <div>
            <div class="first-row">
              <span class="explain">姓名：</span>
              <span class="explain-content">{{ limitDetailsList.plannerName }}</span>
            </div>
            <div>
              <span class="explain">商户：</span>
              <span class="explain-content">{{ limitDetailsList.merchantName }}</span>
            </div>
          </div>
          <div>
            <!-- <div class="first-row">
              <span class="explain">联系方式：</span>
              <span class="explain-content">{{ limitDetailsList.plannerPhone }}</span>
            </div> -->
            <div>
              <span class="explain">平台工号：</span>
              <span class="explain-content">{{ limitDetailsList.plannerNo }}</span>
            </div>
          </div>
        </div>
        <div
          v-for="(item, index) in limitDetailsArray"
          :key="index + 'limitDetailsArray'"
          class="limit-details-tabs"
        >
          <div>{{ item.limitTypeName }}</div>
          <div class="limit-details-tabs-content">
            <div class="limit-details-tabs-content-row">
              <div class="explain">限制程度：</div>
              <div class="explain-content">{{ item.limitProportion }}%</div>
            </div>
            <div class="limit-details-tabs-content-row">
              <div class="explain">限制周期：</div>
              <div class="explain-content">
                {{ item.startTime.split(' ')[0] + ' ~ ' + item.endTime.split(' ')[0] }}
              </div>
            </div>
            <div class="limit-details-tabs-content-row">
              <div class="explain">操作人：</div>
              <div class="explain-content">{{ item.updaterName }}</div>
            </div>
            <div v-if="item.remark" class="limit-details-tabs-content-row">
              <div>
                <div class="explain">备注：</div>
              </div>
              <div class="explain-content">{{ item.remark }}</div>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import './index.scss';
import { limit_detail } from 'api/close-black-current-limit';
export default {
  data() {
    return {
      dialogVisible: false,
      activeName: 'first',
      limitDetailsList: {}, //限制详情所有数据
      limitDetailsArray: [], //限制详情的限制方式
    };
  },
  methods: {
    openModal(details) {
      this.dialogVisible = true;
      this.limitDetailsList = details;
      let params = { plannerId: details.plannerId };
      limit_detail(params).then((res) => {
        this.limitDetailsArray = res.data;
      });
    },
    dialogColsed() {
      this.activeName = 'first';
    },
  },
};
</script>
