<template>
  <div>
    <el-dialog
      title="移交商机"
      custom-class="multip-move-dialog"
      :visible.sync="dialogVisible"
      :rules="rules"
      width="620px"
      :close-on-click-modal="false"
      @close="diologHandleClose"
    >
      <div>
        <p class="text">
          <i class="iconfont-qds-crm icon-success"></i> 共选择<span class="text__txt">{{
            businessIdArr.length
          }}</span
          >条商机
          <span v-show="businessIdArr.length > 50" class="text__remind"
            >( 单次最多选择50条哦～)</span
          >
        </p>
        <el-form
          ref="ruleForm"
          :model="ruleForm"
          label-width="130px"
          label-position="left"
          size="small"
          :rules="rules"
        >
          <el-form-item label="商机接收人：" prop="safftId">
            <el-select
              v-model="ruleForm.safftId"
              filterable
              remote
              clearable
              reserve-keyword
              :popper-append-to-body="false"
              value-key="mchUserId"
              placeholder="请搜索选择收人"
              :remote-method="remoteMethod"
              :loading="selectLoading"
              popper-class="multip-move-select-remote"
              data-tid="platFormSelectChange"
              @change="selectChangeHandle"
            >
              <el-option
                v-for="item in peopleList"
                :key="item.mchUserId"
                :label="`${item.userName}` + `(` + `${item.userCenterNo}` + `）`"
                :value="item.mchUserId"
              >
                <div>
                  <p>{{ item.userName + '（' + item.userCenterNo + '）' }}</p>
                </div>
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>

      <span slot="footer" class="footer">
        <span class="note">接收人库容量已满!接收人已有客户可能会导致商机移交失效!</span>
        <div>
          <el-button size="medium" data-tid="recordsCancelButton" @click="dialogVisible = false"
            >取消</el-button
          >
          <el-button
            type="primary"
            size="medium"
            :loading="loading"
            data-tid="platFormOnSubmit"
            @click="onSubmitHandle"
            >提交</el-button
          >
        </div>
      </span>
    </el-dialog>
    <multip-remind-dialog ref="multipRemindDialog" />
  </div>
</template>

<script>
import './index.scss';
import store from 'storejs';
import { batch_move_business } from 'api/team-manage';
import { get_mch_user_info_list } from 'api/common';

import MultipRemindDialog from '../multip-remind-dialog/index.vue';
export default {
  name: 'MultipCuleMoveDialog',
  components: {
    MultipRemindDialog,
  },
  props: {},
  data() {
    var validateSafft = (rule, value, callback) => {
      if (this.ruleForm.safftId === '') {
        this.loading = false;
        callback(new Error('请选择接收人'));
      }
      callback();
    };
    return {
      safftId: '',
      dialogVisible: false,
      peopleList: [],
      selectLoading: false,
      ruleForm: {
        safftId: '',
      },
      rules: {
        safftId: [
          {
            validator: validateSafft,
            trigger: 'change',
            required: true,
          },
        ],
      },
      businessIdArr: '',
      loading: false,
      userName: '',
      mchDetailId: '',
    };
  },
  computed: {},
  created() {},
  methods: {
    /**
     * @description 陪谈人搜索选中方法
     * @param {Object} 选中得对象
     */
    selectChangeHandle(val) {
      this.safftId = val;
    },
    /**
     * @description 远程搜索陪谈人
     */
    remoteMethod(keyword) {
      if (!keyword.trim()) return;
      this.selectLoading = true;
      const params = {
        mchDetailId: this.mchDetailId,
        start: 1,
        limit: 1000,
      };
      const regPhone = /^1[3-9]\d{9}$/;
      if (regPhone.test(keyword)) {
        params.phone = keyword;
      } else {
        params.searchKey = keyword;
      }
      this.getPeopleList(params);
    },
    getPeopleList(params) {
      get_mch_user_info_list(params)
        .then((res) => {
          if (res.code === 200) {
            this.peopleList = res.data.records || [];
            this.selectLoading = false;
          } else {
            this.$message.warning(res.message);
          }
        })
        .catch(() => (this.selectLoading = false));
    },
    /**
     * @description 点击提交移交
     */
    onSubmitHandle() {
      this.loading = true;
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.move_business();
        } else {
          return false;
        }
      });
    },
    /**
     * @description 弹层关闭清空数据
     */
    diologHandleClose() {
      this.$refs.ruleForm.resetFields();
    },
    /**
     * @description 供父组件调用打开弹层方法
     * @param {Object} 点击当前列表项
     */
    openModal(arr) {
      this.businessIdArr = arr || [];
      this.dialogVisible = true;
      this.mchDetailId = store.get('mchInfo')?.mchDetailId || '';
      this.getPeopleList({
        mchDetailId: this.mchDetailId,
        start: 1,
        limit: 1000,
      });
    },
    /**
     * @description 点击提交请求接口
     */
    move_business() {
      const param = {
        plannerId: this.ruleForm.safftId,
        list: this.businessIdArr,
      };
      batch_move_business(param)
        .then((res) => {
          if (res.code === 200) {
            this.$emit('reset-list');
            this.dialogVisible = false;
            this.$refs.multipRemindDialog.openModal(res);
          } else {
            this.dialogVisible = false;
            this.$messageBox
              .alert(
                `<span>移交失败</span><br/> <span>失败原因：${res.message}</span>`,
                `移交商机`,
                {
                  dangerouslyUseHTMLString: true,
                  confirmButtonText: '确定',
                  closeOnClickModal: false,
                  customClass: 'message-box-min-height',
                  type: 'error',
                },
              )
              .catch(() => {});
          }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>
