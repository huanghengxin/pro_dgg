<template>
  <div class="error-list-page">
    <div class="error-list-title">
      <div>导入关黑限流错误名单</div>
      <el-button type="primary" @click="exportLimit">导出</el-button>
    </div>
    <div v-if="errorListTable && errorListTable.length !== 0" class="error-list-text">
      <span class="iconfont-qds-crm icon-surface_informationcircle"></span>
      <span>{{
        '您一共' +
          errorListTable.length +
          '条数据错误，请修改后重新上传，返回刷新此页面错误数据不保存！'
      }}</span>
    </div>
    <div class="error-list-table">
      <el-table v-loading="loading" :data="errorListTable" lazy style="width: 100%">
        <template slot="empty">
          <svg-icon
            key="item-warp"
            type="nodata"
            icon="icon-icon_nodata"
            :text-content="textContent"
          />
        </template>
        <el-table-column prop="num" label="序号" min-width="80"> </el-table-column>
        <el-table-column prop="plannerName" label="姓名" min-width="160px">
          <template slot-scope="scope">
            <!-- <show-tooltip
              v-if="scope.row.plannerName"
              :text="scope.row.plannerName"
              title-class="content-title"
              :width="100"
              tooltip-class="content-record"
            ></show-tooltip> -->
            <span v-if="scope.row.plannerName">{{ scope.row.plannerName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="plannerNo" label="工号" min-width="160px">
          <template slot-scope="scope">
            <!-- <show-tooltip
              v-if="scope.row.plannerNo"
              :text="scope.row.plannerNo"
              title-class="content-title"
              :width="100"
              tooltip-class="content-record"
            ></show-tooltip> -->
            <span v-if="scope.row.plannerNo">{{ scope.row.plannerNo }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="merchantName" label="商户" min-width="160px">
          <template slot-scope="scope">
            <!-- <show-tooltip
              v-if="scope.row.merchantName"
              :text="scope.row.merchantName"
              title-class="content-title"
              :width="100"
              tooltip-class="content-record"
            ></show-tooltip> -->
            <span v-if="scope.row.merchantName">{{ scope.row.merchantName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="limitTypeName" label="限制方式" min-width="160px">
          <template slot-scope="scope">
            <!-- <show-tooltip
              v-if="scope.row.limitTypeName"
              :text="scope.row.limitTypeName"
              title-class="content-title"
              :width="100"
              tooltip-class="content-record"
            ></show-tooltip> -->
            <span v-if="scope.row.limitTypeName">{{ scope.row.limitTypeName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="limitProportion" label="限制程度" min-width="140px">
          <template slot-scope="scope">
            <span v-if="scope.row.limitProportion">限流{{ scope.row.limitProportion }}%</span>
          </template>
        </el-table-column>
        <el-table-column label="限制周期" min-width="240px">
          <template slot-scope="scope">
            <span v-if="scope.row.startTime && scope.row.endTime">{{
              scope.row.startTime + ' ~ ' + scope.row.endTime
            }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注说明" min-width="160px">
          <template slot-scope="scope">
            <show-tooltip
              v-if="scope.row.remark"
              :text="scope.row.remark"
              title-class="content-title"
              :width="100"
              tooltip-class="content-record"
            ></show-tooltip>
            <span v-else>暂无备注</span>
          </template>
        </el-table-column>
        <el-table-column prop="errorReason" label="错误说明" min-width="160px">
          <template slot-scope="scope">
            <show-tooltip
              :text="scope.row.errorReason"
              title-class="content-title"
              :width="100"
              tooltip-class="content-record"
            ></show-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          prop="handle"
          label="操作"
          fixed="right"
          min-width="80px"
          class-name="error-list-handle"
        >
          <template slot-scope="scope">
            <span @click="deleteErrorRow(scope.$index)">删除</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import './index.scss';
import { storeError, mutations } from '../../observable';
import { export_limit_list } from 'api/close-black-limit';
import ShowTooltip from 'components/show-tooltip';
import SvgIcon from 'components/svg-icon';
export default {
  components: {
    ShowTooltip,
    SvgIcon,
  },
  data() {
    return {
      textContent: '暂无错误数据',
      loading: false,
    };
  },
  computed: {
    errorListTable() {
      return storeError.errorList;
    },
  },
  created() {},
  methods: {
    /**
     * @description 列表懒加载
     */
    load(tree, treeNode, resolve) {},
    /**
     * @description 导出错误数据
     */
    exportLimit() {
      this.loading = true;
      let params = storeError.errorList;
      export_limit_list(params).then((res) => {
        let blob = new Blob([res], { type: 'application/vnd.ms-excel' });
        let ANode = document.createElement('a');
        ANode.style.display = 'none';
        ANode.href = URL.createObjectURL(blob);
        ANode.download = '关黑限流错误数据.xls';
        document.body.appendChild(ANode);
        ANode.click();
        document.body.removeChild(ANode);
        window.URL.revokeObjectURL(ANode.href);
        this.loading = false;
      });
    },
    /**
     * @description 删除
     */
    deleteErrorRow(index) {
      mutations.deleteErrorList(index);
    },
  },
};
</script>
