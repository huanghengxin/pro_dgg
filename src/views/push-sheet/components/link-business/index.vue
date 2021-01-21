<template>
  <div class="clientInfo">
    <div class="clientTitle">
      <div class="titleWord">商机信息</div>
      <el-button
        class="clientTitle_button"
        type="primary"
        size="small"
        icon="el-icon-link"
        @click="linkBusiness"
        >关联商机</el-button
      >
    </div>
    <div class="tipsText">
      <i class="el-icon-warning-outline"></i>
      <p class="warning">
        客户联系电话为客户薯片平台用户账号，确保电话号码准确一致，否则不能推单！
      </p>
    </div>

    <div v-if="selectedInfo" class="clientContent">
      <ul class="infoList">
        <li>
          <span class="infoList-text">客户名称：</span>
          <show-tooltip
            :text="selectedInfo.customerName || '-'"
            :width="300"
            tooltip-class="item-top_name"
          />
        </li>
        <li>
          <span class="infoList-text">商机编码：</span>
          <show-tooltip
            :text="selectedInfo.bizNo || '-'"
            :width="300"
            tooltip-class="item-top_name"
          />
        </li>
        <li>
          <span class="infoList-text">业务区域：</span>
          <show-tooltip
            :text="selectedInfo.bizCityName || '-'"
            :width="300"
            tooltip-class="item-top_name"
          />
        </li>
        <li>
          <span class="infoList-text">联系电话：</span>
          <show-tooltip
            :text="selectedInfo.customerPhone || '-'"
            :width="300"
            tooltip-class="item-top_name"
          />
        </li>
        <li>
          <span class="infoList-text">客户需求：</span>

          <show-tooltip
            :text="
              JSON.parse(selectedInfo.requireName)
                .map((item) => item.intentionName)
                .join(',') || '-'
            "
            :width="300"
            tooltip-class="item-top_name"
          />
        </li>

        <li style="display: flex">
          <span class="infoList-text"> 下单区域： </span>
          <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules">
            <el-form-item prop="area">
              <el-select v-model="ruleForm.area" placeholder="请选择">
                <el-option
                  v-for="itemChild in areaList"
                  :key="itemChild.value"
                  :label="itemChild.value"
                  :value="itemChild.key"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </li>
      </ul>
    </div>
    <div v-else class="no-data">
      <div class="no-data-box">
        <svg-icon key="item-warp" type="nodata" icon="icon-icon_nodata" />
      </div>
    </div>
    <!-- 关联商机对话框 -->
    <el-dialog
      title="选择商机"
      :visible.sync="showLinkBusinessDialog"
      width="1200px"
      :close-on-click-modal="false"
      class="clientInfo-dialog"
      @close="linkBusinessClose"
    >
      <!-- 内容主题区域 -->
      <el-form
        ref="businessFormRef"
        :model="businessForm"
        label-width="80px"
        status-icon
        class="businessForm"
      >
        <el-form-item label="综合搜索:" prop="query">
          <el-input
            v-model="content"
            clearable
            maxlength="50"
            placeholder="客户名称/商机编号"
            data-tid="querySearch"
            @blur="querySearch"
            @clear="clearQuery"
          ></el-input>
        </el-form-item>
        <el-form-item label="联系电话:" prop="phoneNo" style="margin-left: 16px">
          <el-input
            v-model="businessForm.phoneNo"
            clearable
            maxlength="11"
            placeholder="联系电话"
            data-tid="phoneNoSearch"
            @blur="phoneNoSearch"
            @clear="clearPhone"
          >
          </el-input>
        </el-form-item>
        <el-button class="businessForm-button" size="small" @click="clearTerm">清空条件</el-button>
        <el-button type="primary" size="small" @click="newBusiness">新建商机</el-button>
      </el-form>
      <el-table
        v-loading="loading"
        :data="businseeTableData"
        stripe
        style="width: 100%; margin-top: 20px"
      >
        <el-table-column slot="empty">
          <svg-icon key="item-warp" type="nodata" icon="icon-icon_nodata" />
        </el-table-column>
        <el-table-column prop="bizNo" label="商机编号" width="196">
          <template slot-scope="scope">
            <router-link
              :to="'/business-details?businessId=' + (scope.row.id || '')"
              class="router-link"
            >
              <show-tooltip
                :text="scope.row.bizNo || '-'"
                :width="160"
                style="color: #222"
              ></show-tooltip
            ></router-link>
          </template>
        </el-table-column>
        <el-table-column prop="customerName" label="客户名称" width="200">
          <template slot-scope="scope">
            <show-tooltip
              :text="scope.row.customerName || '-'"
              :width="160"
              style="color: #222"
            ></show-tooltip>
          </template>
        </el-table-column>
        <el-table-column width="459" label="客户需求">
          <template slot-scope="scope">
            <div v-if="scope.row.requireName">
              <show-tooltip
                :text="
                  JSON.parse(scope.row.requireName)
                    .map((item) => item.intentionName)
                    .join(',') || '-'
                "
                :width="419"
                style="color: #222"
              ></show-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="联系电话">
          <template slot-scope="scope">
            <show-tooltip
              :text="scope.row.customerPhone || '-'"
              :width="160"
              style="color: #222"
            ></show-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="105">
          <template slot-scope="scope">
            <span style="color: #436eee; cursor: pointer" @click="chooseBusinessItem(scope.row)"
              >选择</span
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          :current-page="businessForm.start"
          :page-size="businessForm.limit"
          layout="total, prev, pager, next"
          :total="total"
          background
          @size-change="sizeChange"
          @current-change="currentChange"
        ></el-pagination>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getQueryString } from 'utils/helper';
import ShowTooltip from 'components/show-tooltip';
import SvgIcon from 'components/svg-icon';
import { get_user_website, get_user_business_category } from 'api/common';
import { myBizList, get_business_info } from 'api/push-sheet';
import './index.scss';
export default {
  components: {
    ShowTooltip,
    SvgIcon,
  },
  data() {
    // var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    // var checkphoneNo = (rule, value, callback) => {
    //   if (!Number(value)) {
    //     return callback(new Error('请输入数字值'));
    //   } else {
    //     if (!myreg.test(value)) {
    //       return callback(new Error('请输入正确的手机号'));
    //     } else {
    //       callback();
    //     }
    //   }
    // };
    return {
      loading: false,
      //商机表单
      businessForm: {
        phoneNo: null, //联系电话
        start: 1, //当前页
        limit: 10, //每页显示条数
        bizNo: null,
        customerName: null,
      },
      content: '', //综合搜索
      total: 40,
      // businessFormRules: {
      //   phoneNo: [{ validator: checkphoneNo, trigger: 'blur' }],
      //   // query: [{ required: true, message: '请输入客户名称/商机编号', trigger: 'blur' }],
      // },
      selectedInfo: null, //商机选中数据
      /*控制显示属性*/
      showLinkBusinessDialog: false, //控制商机对话框显示隐藏
      businseeTableData: [],
      //选择区域
      ruleForm: {
        area: '',
      },
      rules: {
        area: [{ required: true, message: '请选择下单区域', trigger: 'change' }],
      },
      areaList: [],
      bizDetailInfo: {}, //根据商机id查询详情
      queryBizId: null,
    };
  },
  watch: {
    selectedInfo: {
      handler(newName, oldName) {
        console.log(newName, oldName);
        if (newName) {
          this.getAreaList();
        }
      },
      immediate: true,
    },
  },
  created() {
    let query = new getQueryString();
    console.log(query, 'query');
    if (query.businessId) {
      this.$store.commit('pushSheet/editBusinessCode', 1);

      this.queryBizId = query.businessId;
      // 获取商机数据
      this.getBizDetail(query.businessId);
      this.getAreaList();
    }
  },
  mounted() {},
  methods: {
    /**
     * @description 手机号
     */
    phoneNoSearch(e) {
      this.businessForm.phoneNo = e.target.value;
      if (this.businessForm.phoneNo == '') {
        this.businessForm.phoneNo = null;
      }
      this.getBusinessList();
    },
    /**
     * @description 在点击由 clearable 属性生成的清空按钮时触发
     */
    clearQuery() {
      this.businessForm.bizNo = null;
      this.businessForm.customerName = null;
      this.getBusinessList();
    },
    /**
     * @description 在点击由 clearable 属性生成的清空按钮时触发
     */
    clearPhone() {
      this.businessForm.phoneNo = null;
      this.getBusinessList();
    },
    /**
     * @description 商家编码
     */
    querySearch(e) {
      this.content = e.target.value;
      const regNumber = /^BSJ[0-9]|bsj[0-9]*$/;
      if (regNumber.test(this.content)) {
        this.businessForm.type = 'bizNumber';
        this.businessForm.bizNo = this.content;
      } else {
        this.businessForm.type = 'name';
        this.businessForm.customerName = this.content;
      }
      if (this.businessForm.customerName == '' || this.businessForm.bizNo == '') {
        this.businessForm.customerName = null;
        this.businessForm.bizNo = null;
      }
      this.getBusinessList();
    },
    /**
     * @description 获取商机列表
     */
    getBusinessList() {
      // let params = { keyword: this.searchContent, limit: 10 };
      // params.page = this.page;
      console.log(this.businessForm, 'this.businessForm');
      let params = this.businessForm;
      myBizList(params)
        .then((res) => {
          const { code, data, message } = res;
          if (code == 200) {
            this.loading = false;
            this.businseeTableData = data.records;
            this.businessForm.limit = Number(data.limit);
            this.businessForm.start = Number(data.currentPage);
            this.total = Number(data.totalCount);
          } else {
            this.$message.warning(message);
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
    /**
     * @description 获取用户授权的区域范围
     */
    getAreaList() {
      get_user_website()
        .then((res) => {
          if (res.code === 200) {
            res = res.data;
            this.areaList = res?.list || [];
          } else {
            this.$message.warning(res.message);
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
    /**
     * @description 获取用户授权的区域范围
     */
    getBizDetail(bizId) {
      let params = { bizId: bizId };
      params.page = this.page;
      get_business_info(params).then((res) => {
        this.selectedInfo = res;
        console.log(this.selectedInfo, 'bizDetailInfo');
      });
    },

    /**
     * @description 关联商机 控制关联上级对话框显示与
     * @param {Object}
     */
    linkBusiness() {
      this.showLinkBusinessDialog = true;
      this.loading = true;
      this.getBusinessList();
    },
    /**
     * @description 当监听商机对话框的关闭事件
     */
    linkBusinessClose() {
      this.$refs.businessFormRef.resetFields();
    },
    /**
     * @description 清空条件
     */
    clearTerm() {
      this.content = null;
      this.$refs.businessFormRef.resetFields();
      this.businessForm.bizNo = null;
      this.businessForm.type = null;
      this.businessForm.customerName = null;
      this.getBusinessList();
    },
    /**
     * @description 跳转新建商机
     */
    newBusiness() {
      this.$router.push(`add-business?type=${'PUSH_SHEET'}`);
    },
    /**
     * @description 选择商机项
     * @param {Object}
     */
    chooseBusinessItem(row) {
      if (!row) return;
      this.$store.commit('pushSheet/editBusinessCode', { index: 0, flag: true });
      this.$store.commit('pushSheet/editBusinessData', row);
      this.$emit('change-status', 1);
      this.selectedInfo = row;
      sessionStorage.setItem('isClicked', true);
      this.showLinkBusinessDialog = false;
    },
    /**
     * @description  adesctiption:改变当前页显示数量
     */
    sizeChange(val) {
      this.businessForm.limit = val;
      this.getBusinessList();
    },
    /**
     * @description  adesctiption:改变当前页显示数量
     */
    currentChange(val) {
      this.businessForm.start = val;
      this.getBusinessList();
    },
    // 校验数据
    validateForm() {
      let flag = false;
      // console.log(this.$refs['ruleFormRef']);
      let ref = this.$refs['ruleFormRef'];
      if (!ref) return;
      if (Array.isArray(ref)) {
        ref = ref[0];
      }
      ref.validate((valid) => {
        console.log(valid, 'business', this.$refs['ruleFormRef']);
        if (valid) {
          flag = true;
        } else {
          flag = false;
        }
      });
      return flag;
    },
  },
};
</script>
