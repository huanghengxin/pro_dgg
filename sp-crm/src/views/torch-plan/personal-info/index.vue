<template>
  <div class="personal-info">
    <el-form ref="ruleForm" :inline="true" :model="ruleForm" class="personal-info-row">
      <div class="personal-info-row_first">
        <el-form-item label="综合搜索:" prop="userNoOrName">
          <el-input
            v-model="ruleForm.userNoOrName"
            placeholder="请输入姓名或工号"
            data-tid="searchInputValue"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="服务商:" prop="mchDetailId">
          <drop-select
            ref="torchPeopleRefs"
            key="torchPeople"
            value-key="id"
            placeholder="全部"
            type="peopleList"
            data-tid="mchDetailId"
            is-default
            clearable
            @change="selectChangeHandle"
          ></drop-select>
        </el-form-item>
      </div>
      <div class="personal-info-row_second">
        <el-form-item label="入职时间:" prop="datetime">
          <el-date-picker
            v-model="datetime"
            type="daterange"
            :clearable="true"
            range-separator="-"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            @change="dateChange"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询结果</el-button>
          <el-button type="default" @click="reset">重置</el-button>
        </el-form-item>
      </div>
    </el-form>
    <div class="personal-info-title-box">
      <span class="personal-info-title-box_title">数据列表</span>
      <el-button type="default" @click="exportExecl">导出数据</el-button>
    </div>
    <el-table v-loading="loading" :data="formData" class="personal-info-table">
      <template slot="empty">
        <svg-icon key="item-warp" type="nodata" icon="icon-icon_nodata" />
      </template>
      <el-table-column label="服务商" min-width="150" fixed="left">
        <template slot-scope="scope">
          <show-tooltip
            v-if="scope.row.mchDetailName"
            :text="scope.row.mchDetailName"
            :width="130"
          ></show-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="姓名" min-width="110">
        <template slot-scope="scope">
          <show-tooltip
            v-if="scope.row.mchUserName"
            :text="scope.row.mchUserName"
            :width="90"
          ></show-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="工号" min-width="120">
        <template slot-scope="scope">
          <show-tooltip
            v-if="scope.row.userCenterNo"
            :text="scope.row.userCenterNo"
            :width="100"
          ></show-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="职务" min-width="123">
        <template slot-scope="scope">
          <show-tooltip
            v-if="scope.row.position"
            :text="scope.row.position"
            :width="103"
          ></show-tooltip>
          <span v-else>暂无</span>
        </template>
      </el-table-column>
      <el-table-column label="部门" min-width="110">
        <template slot-scope="scope">
          <show-tooltip
            v-if="scope.row.departmentName"
            :text="scope.row.departmentName"
            :width="92"
          ></show-tooltip>
          <span v-else>暂无</span>
        </template>
      </el-table-column>
      <el-table-column label="徒弟资格" min-width="90">
        <template slot-scope="scope">
          <show-tooltip
            v-if="scope.row.isApprentice + ''"
            :text="
              scope.row.isConfigApprentice == 0 ? '-' : scope.row.isApprentice == 1 ? '有' : '无'
            "
            :width="72"
          ></show-tooltip>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="师傅资格" min-width="90">
        <template slot-scope="scope">
          <show-tooltip
            v-if="scope.row.isMaster + ''"
            :text="scope.row.isConfigMaster == 0 ? '-' : scope.row.isMaster == 1 ? '有' : '无'"
            :width="72"
          ></show-tooltip>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="是否有徒弟" min-width="110">
        <template slot-scope="scope">
          <show-tooltip
            v-if="scope.row.apprenticeNum + ''"
            :text="
              scope.row.isConfigApprentice == 0 ? '-' : scope.row.apprenticeNum > 0 ? '有' : '无'
            "
            :width="72"
          ></show-tooltip>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="是否有师傅" min-width="110">
        <template slot-scope="scope">
          <show-tooltip
            v-if="scope.row.masterNum + ''"
            :text="scope.row.isConfigMaster == 0 ? '-' : scope.row.masterNum > 0 ? '有' : '无'"
            :width="92"
          ></show-tooltip>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="入职时间" min-width="120">
        <template slot-scope="scope">
          <show-tooltip
            v-if="scope.row.entryTime"
            :text="scope.row.entryTime | filterTime"
            :width="100"
          ></show-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <div class="personal-info-pagination">
      <el-pagination
        :current-page="params.start"
        :page-sizes="[10, 20, 30, 40, 50]"
        background
        layout="total, prev, pager, next,sizes,jumper"
        :total="total"
        data-tid="recordPageHandlePageBreak"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { get_people_list, get_salary_fire_user_page } from 'api/torch-plan';
import ShowTooltip from 'components/show-tooltip';
import SvgIcon from 'components/svg-icon';
import DropSelect from 'components/drop-select';
import './index.scss';
import dayjs from 'dayjs';
import stores from 'storejs';
import { storePeopleList, mutations } from './observable';
export default {
  components: {
    SvgIcon,
    ShowTooltip,
    DropSelect,
  },
  // directives: {
  //   // 自定义指令 设置滚动到底部加载下一页的数据
  //   loadmore: {
  //     inserted(el, binding, vnode) {
  //       // 获取element-ui定义好的scroll盒子
  //       const SELECTWRAP_DOM = el.querySelector('.el-select-dropdown .el-select-dropdown__wrap');
  //       SELECTWRAP_DOM.addEventListener('scroll', function () {
  //         if (vnode.context.optionFlag) {
  //           // 滚到底部
  //           const CONDITION = this.scrollHeight - this.scrollTop <= this.clientHeight;
  //           if (CONDITION) {
  //             vnode.context.optionPage += 1;
  //             vnode.context.getPeopleList(
  //               vnode.context.optionKey,
  //               'peopleList',
  //               vnode.context.optionPage,
  //             );
  //           }
  //         }
  //       });
  //     },
  //   },
  // },
  filters: {
    filterTime(date) {
      return dayjs(date).format('YYYY-MM-DD');
    },
  },
  data() {
    return {
      params: {
        start: 1,
        limit: 10,
      },
      mchDetailId: stores.get('mchInfo')?.mchDetailId,
      loading: false,
      ruleForm: {
        // phone: undefined,
        // searchKey: undefined,
        userNoOrName: undefined,
        mchDetailId: undefined,
        entryTimeStart: undefined,
        entryTimeEnd: undefined,
      },
      datetime: null,
      accompanyInfo: {},
      total: null,
      formData: [],
      optionPage: 1, //下拉框页数
      optionKey: '', //下拉框关键字
      optionFlag: false, //滚动加载
      peopleList: [],
      selectLoading: false,
    };
  },
  computed: {
    dataList() {
      return storePeopleList.dataList.records;
    },
    //总条数
    peopleListTotal() {
      return storePeopleList.dataList.totalCount;
    },
  },
  created() {
    // this.getPeopleList();
    this.getPersonal();
    console.log(this.peopleListTotal, 'peopleListTotal');
  },
  methods: {
    dateChange(val) {
      if (val) {
        val.map((item, index) => {
          console.log(dayjs(item).format('YYYY-MM-DD'), index, 'val');
          if (index == 0) {
            this.ruleForm.entryTimeStart = dayjs(item).format('YYYY-MM-DD');
          } else {
            this.ruleForm.entryTimeEnd = dayjs(item).format('YYYY-MM-DD');
          }
        });
      } else {
        this.ruleForm.entryTimeStart = undefined;
        this.ruleForm.entryTimeEnd = undefined;
        // this.getPersonal();
      }
    },
    getPersonal() {
      this.loading = true;
      const params = { ...this.ruleForm, ...this.params };
      params.mchDetailId = this.ruleForm.mchDetailId;
      get_people_list(params)
        .then((res) => {
          const { code, data, message } = res;
          if (code == 200) {
            this.total = data.totalCount;
            this.formData = data.records || [];
            // 把数据放进store里
            mutations.saveDataList(data);
          } else {
            this.$message.warning(message);
          }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    /**
     * @description 陪谈人搜索选中方法
     */
    selectChangeHandle(val) {
      console.log(val, 'val12');
      if (!val) {
        this.peopleList = [];
        // this.peopleList = this.defaultPeopleList;
      }
      // this.ruleForm.mchDetailId = val.mchUserId;
      this.accompanyInfo = val;
    },
    //提交保存
    onSubmit() {
      console.log('submit!', this.ruleForm);
      const accompanyInfo = this.accompanyInfo;
      this.ruleForm.mchDetailId = accompanyInfo.id || undefined;
      this.params.start = 1;
      this.getPersonal();
    },
    //重置表单
    reset() {
      this.params.start = 1;
      this.$refs.ruleForm.resetFields();
      this.$refs.torchPeopleRefs.resetInput();
      this.ruleForm.entryTimeStart = undefined;
      this.ruleForm.entryTimeEnd = undefined;
      this.accompanyInfo = {};
      this.datetime = null;
      this.getPersonal();
    },

    /**
     * @description 导出
     */
    exportExecl() {
      if (this.loading === true) return;
      if (this.peopleListTotal === 0) {
        this.$message.warning('暂无数据！');
        return;
      }
      const h = this.$createElement;
      this.$messageBox({
        title: '消息',
        message: h('p', null, [
          h('i', null, '总共'),
          h('i', null, this.peopleListTotal),
          h('i', null, '条人员数据，确认导出吗？'),
        ]),
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
      })
        .then(() => {
          this.loading = true;
          let params = Object.assign({}, this.ruleForm);
          params.mchDetailId = this.ruleForm.mchDetailId;
          params.start = this.params.start;
          params.limit = this.params.limit;
          get_salary_fire_user_page(params)
            .then((res) => {
              if (res) {
                let blob = new Blob([res], { type: 'application/vnd.ms-excel' });
                let reader = new FileReader();
                reader.onload = (readResponent) => {
                  try {
                    let result = readResponent.target.result;
                    let resultObj = JSON.parse(result);
                    this.$message.warning(resultObj.message);
                  } catch (error) {
                    let ANode = document.createElement('a');
                    ANode.style.display = 'none';
                    ANode.href = URL.createObjectURL(blob);
                    ANode.download = '薪火计划人员信息.xls';
                    document.body.appendChild(ANode);
                    ANode.click();
                    document.body.removeChild(ANode);
                    window.URL.revokeObjectURL(ANode.href);
                  }
                };
                reader.readAsText(blob);
              } else {
                this.$message.warning('导出失败');
              }
              this.loading = false;
            })
            .catch(() => {
              this.$mesage.warning('导出失败');
              this.loading = false;
            });
        })
        .catch(() => {
          this.loading = false;
        });
    },
    /**
     * @description 分页
     * @param {Number}
     */
    handleSizeChange(val) {
      //每页多少条
      this.params.limit = val;
      this.params.start = 1;
      this.getPersonal();
    },
    handleCurrentChange(val) {
      //第几页
      this.params.start = val;
      this.getPersonal();
    },
  },
};
</script>

<style></style>
