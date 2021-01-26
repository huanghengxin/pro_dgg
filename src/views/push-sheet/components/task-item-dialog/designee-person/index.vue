<template>
  <div class="designee-person">
    <el-dialog
      title="选择消化人员"
      :close-on-click-modal="false"
      :visible.sync="digestionFlag"
      width="1200px"
    >
      <div class="designee-person-searchBox">
        <el-input v-model="designneForm.query" placeholder="商户名称/店员姓名"></el-input>
        <el-button size="small" type="primary" data-tid="searchPerson">搜索</el-button>
      </div>
      <el-table
        v-loading="loading"
        :data="designeeTableInfo"
        style="width: 100%"
        data-tid="sortHandleChange"
        @sort-change="sortHandleChange"
      >
        <el-table-column prop="assistantName" label="店员姓名"></el-table-column>
        <el-table-column prop="phone" label="店员手机"></el-table-column>
        <el-table-column prop="shopName" label="商户名称"></el-table-column>
        <el-table-column prop="dabaoPoints" label="大宝分" sortable="custom"></el-table-column>
        <el-table-column prop="taskNum" label="在办任务数" sortable="custom"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <span
              style="color: #436eee; cursor: pointer"
              data-tid="chooseDesignner"
              @click="chooseDesignner(scope.row)"
              >选择</span
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- <el-pagination
        :current-page="designneForm.currentPage"
        layout="total, prev, pager, next"
        :page-size="designneForm.pagesize"
        :total="100"
        @sizeChange="sizeChange"
        @currentChange="currentChange"
      ></el-pagination> -->
    </el-dialog>
  </div>
</template>

<script>
import './index.scss';
import { getDesigneeData } from 'api/push-sheet';
export default {
  components: {},
  data() {
    return {
      loading: false,
      digestionFlag: false, //选择打开消化人员对话框
      paramsData: {},
      designneForm: {
        query: '',
        currentPage: 1, //当前页
        pagesize: 10, //每页显示条数
      },
      designeeTableInfo: [], //表格数据
      code: '',
    };
  },
  // watch: {
  //   getDesigneeData: {
  //     handler: function (val, oldval) {
  //       console.log('修改后', val, '修改前', oldval);
  //       this.loading = true;
  //       setTimeout(() => {
  //         this.loading = false;
  //       }, 1000);
  //     },
  //   },
  // },
  computed: {
    params() {
      return {
        query: this.designneForm.query,
        currentPage: this.designneForm.currentPage,
        pagesize: this.designneForm.pagesize,
        ...this.paramsData,
      };
    },
  },
  created() {},
  methods: {
    /**
     * @description 打开对话框
     */
    openModal(code, num) {
      this.code = {
        code,
        num,
      };
      console.log(code, num, this.code);

      this.digestionFlag = true;
      this.loading = true;
      getDesigneeData(this.params).then(() => {
        setTimeout(() => {
          this.loading = false;
          let res = [
            {
              id: 1,
              assistantName: '店员姓名1',
              phone: '店员手机',
              shopName: '商户名称',
              dabaoPoints: '大宝分',
              taskNum: '在办任务数',
            },
            {
              id: 2,
              assistantName: '店员姓名2',
              phone: '店员手机',
              shopName: '商户名称',
              dabaoPoints: '大宝分',
              taskNum: '在办任务数',
            },
          ];
          this.designeeTableInfo = res;
        }, 1000);
      });
    },
    /**
     * @description 服务产品 改变当前页显示数量
     */
    sizeChange(val) {
      this.pagesize = val;
    },
    /**
     * @description 服务产品 改变当前页
     */
    currentChange(val) {
      this.currentPage = val;
    },
    /**
     * @description 关闭父级弹框
     * @param {Object}
     */
    chooseDesignner(row) {
      // this.code.designee = row;
      row.code = this.code.code;
      row.num = this.code.num;
      this.$emit('get-designee-modal', row); //传递当前行数据
      this.digestionFlag = false;
    },
    /**
     * @description 排序
     */
    sortHandleChange(val) {
      const map = {
        ascending: 'asc',
        descending: 'desc',
      };
      const sort = val.order ? map[val?.order] : undefined;
      this.$set(this.paramsData, 'sortFeild', val.order ? val.prop : undefined);
      this.$set(this.paramsData, 'sort', sort);
    },
  },
};
</script>

<style lang="scss"></style>
