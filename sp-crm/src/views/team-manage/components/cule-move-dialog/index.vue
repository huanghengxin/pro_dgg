<template>
  <div>
    <el-dialog
      title="移交商机"
      :visible.sync="dialogVisible"
      custom-class="cule-move-dialog"
      width="620px"
      :close-on-click-modal="false"
      @closed="diologHandleClose"
    >
      <div width="100%">
        <el-form
          ref="ruleForm"
          :model="ruleForm"
          :rules="rules"
          label-width="130px"
          label-position="left"
          size="small"
        >
          <el-form-item label="客户姓名：">
            <span class="name">{{ businessDetail && businessDetail.customerName }}</span>
          </el-form-item>
          <el-form-item label="客户需求：">
            <div v-if="businessDetail && businessDetail.requireName" class="need">
              <span v-for="(item, index) in hanleNeedDetail()" :key="index" class="need__item"
                >{{ item.intentionName }}{{ item.signTime ? '（' + '已签' + '）' : '' }}</span
              >
            </div>
          </el-form-item>
          <el-form-item label="商机接收人：" prop="safftId">
            <div class="quick-note_group">
              <el-select
                v-model="ruleForm.safftId"
                filterable
                remote
                clearable
                :popper-append-to-body="false"
                reserve-keyword
                value-key="mchUserId"
                placeholder="请搜索选择接收人"
                :remote-method="remoteMethod"
                :loading="selectLoading"
                popper-class="cule-move-select-remote"
                data-tid="platFormSelectChange"
                @change="selectChangeHandle"
                @blur="handleBlue"
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
            </div>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="footer">
        <span class="note">接收人库容量已满!接收人已有客户可能会导致商机移交失败!</span>
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
    <remind-dialog ref="remindDialog" :from="type" @reset-list="resetList" @repeat="openModal" />
  </div>
</template>

<script>
import './index.scss';
import store from 'storejs';
import { single_move_business } from 'api/team-manage';
import { get_mch_user_info_list } from 'api/common';
import RemindDialog from '../remind-dialog/index.vue';

export default {
  name: 'CuleMoveDialog',
  components: {
    RemindDialog,
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
      type: '',
      mchDetailId: '',
      userName: '',
      dialogVisible: false,
      safftId: '',
      ruleForm: {
        safftId: '', //移交人
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
      // businessDetailList: [],
      businessDetail: {}, //详情
      needList: [], //客户需求选中
      rowPlannerId: '',
      businessId: '',
      loading: false,
      selectLoading: false,
      peopleList: [],
      res: '',
      defaultPeopleList: [],
    };
  },
  computed: {},
  created() {},
  methods: {
    /**
     * @description
     */
    handleBlue(e) {
      if (this.peopleList.length === 0) {
        this.peopleList = this.defaultPeopleList;
      }
    },
    /**
     * @description 失效商机事件方法
     */
    resetList(val) {
      this.$emit('reset-list');
    },
    /**
     * @description 陪谈人搜索选中方法
     * @param {Object} 选中得对象
     */
    selectChangeHandle(val) {
      if (val === '') {
        this.peopleList = this.defaultPeopleList;
      }
      this.safftId = val;
    },
    /**
     * @description 远程规划师人
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
    getPeopleList(params, type) {
      get_mch_user_info_list(params)
        .then((res) => {
          if (res.code === 200) {
            this.peopleList = res.data.records || [];
            if (type) {
              this.defaultPeopleList = res.data.records;
            }
            this.selectLoading = false;
          } else {
            this.$message.warning(res.message);
          }
        })
        .catch(() => (this.selectLoading = false));
    },

    /**
     * @description 将字符串转化成数组
     * @param {String}
     */
    requireList(str) {
      let arr = str.split(',');
      return arr;
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
      if (Object.keys(this.res).length) {
        const res = this.res;
        if (res.code === 10008) {
          this.$refs.remindDialog.openModal(this.businessId, res, this.businessDetail, this.from);
        } else {
          this.$messageBox
            .alert(`<span>移交失败</span><br/> <span>失败原因：${res.message}</span>`, `移交商机`, {
              dangerouslyUseHTMLString: true,
              confirmButtonText: '确定',
              closeOnClickModal: false,
              customClass: 'message-box-min-height team-manage-error',
              type: 'error',
            })
            .then(() => {
              this.$emit('success-reset-list');
            })
            .catch(() => {
              this.$emit('success-reset-list');
            });
        }
      }
      this.res = {};
      this.$refs.ruleForm.resetFields();
    },
    /**
     * @description 供父组件调用打开弹层方法
     * @param {Object} 点击当前列表项
     */
    openModal(item, type) {
      this.type = type;
      this.businessDetail = item;
      this.businessId = item.id;
      this.rowPlannerId = item.plannerId;
      this.dialogVisible = true;
      this.mchDetailId = store.get('mchInfo')?.mchDetailId || '';
      this.getPeopleList(
        {
          mchDetailId: this.mchDetailId,
          start: 1,
          limit: 1000,
        },
        'default',
      );
    },
    hanleNeedDetail() {
      let requireList = this.businessDetail?.requireName?.split(',');
      if (!Array.isArray(requireList)) return;
      let requireProgress = this.businessDetail?.requireProgress?.split(',');
      const arr = requireList.reduce((acc, cur, index) => {
        const obj = {
          intentionName: cur,
        };
        if (requireProgress) {
          obj.signTime = requireProgress[index] === 'CRM_BIZ_PROGRESS_SIGN_ORDER' ? true : null;
        }
        acc.push(obj);
        return acc;
      }, []);

      return arr;
    },

    /**
     * @description 点击移交请求接口
     */
    move_business() {
      const param = {
        list: [
          {
            bizId: this.businessId,
            plannerId: this.rowPlannerId,
          },
        ],
        plannerId: this.safftId,
      };

      single_move_business(param)
        .then((res) => {
          if (res.code === 200) {
            this.$message.success('操作成功');
            this.$emit('success-reset-list');
          } else {
            this.res = res;
          }
          this.loading = false;
          this.dialogVisible = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>
