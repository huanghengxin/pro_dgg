<template>
  <div>
    <el-dialog
      v-show="switchDialog"
      title="邀约面谈"
      custom-class="invite-interview"
      :visible.sync="dialogVisible"
      width="620px"
      :close-on-click-modal="false"
      @close="diologHandleClose"
    >
      <el-form
        ref="ruleForm"
        :rules="rules"
        label-position="left"
        label-width="130px"
        size="small"
        :model="ruleForm"
      >
        <!-- 面谈类型： -->
        <el-form-item
          label="面谈类型："
          required
          :show-message="false"
          class="invite-interview_type"
        >
          <el-radio-group
            v-model="ruleForm.inviteType"
            data-tid="inviteTypeChange"
            @change="inviteTypeChange"
          >
            <el-radio :label="0">客户上门</el-radio>
            <el-radio :label="1">外出拜访</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 约定时间： -->
        <el-form-item label="约定时间：" class="invite-interview_appoint-time" prop="inviteTime">
          <el-date-picker
            v-model="ruleForm.inviteTime"
            format="yyyy-MM-dd HH:mm:ss"
            :picker-options="pickerOptions"
            type="datetime"
            placeholder="选择日期时间"
            :default-time="nowTime"
            data-tid="inviteFocusHandle"
            @focus="focusHandle"
          >
          </el-date-picker>
        </el-form-item>
        <!-- 手机号码： -->
        <el-form-item label="手机号码：" class="invite-interview_phone" prop="phone">
          <div class="quick-note_group">
            <el-select v-model="ruleForm.phone" placeholder="请选择手机号码">
              <el-option
                v-for="item in phoneList"
                :key="item.id"
                :label="item.contactNo"
                :value="item.contactNoFull"
              >
              </el-option>
            </el-select>
            <div
              v-show="!(addPhoneNumber === 0 && sparePhone)"
              class="quick-note_group-add"
              @click="addPhoneHandleClick"
            >
              无可用号码，去添加<i class="el-icon-arrow-right arrow_right"></i>
            </div>
          </div>
        </el-form-item>
        <!-- 面谈地点 -->
        <el-form-item
          label="面谈地点："
          class="invite-interview_area"
          prop="area"
          :rules="rules.area"
        >
          <el-select
            v-if="ruleForm.inviteType === 0"
            key="invite-interview_area"
            v-model="ruleForm.area"
            placeholder="请选择面谈地点"
          >
            <el-option
              v-for="item1 in addressList"
              :key="item1.id"
              :label="item1.detailAdress"
              :value="item1.detailAdress"
            >
            </el-option>
          </el-select>
          <el-input
            v-else
            key="invite-interview_area"
            v-model="ruleForm.area"
            maxlength="100"
            placeholder="请输入面谈地点"
          ></el-input>
        </el-form-item>
        <!-- 陪谈人 -->
        <el-form-item label="陪谈人：" class="invite-interview_people" prop="people">
          <el-select
            v-model="ruleForm.people"
            filterable
            value-key="mchUserId"
            remote
            reserve-keyword
            placeholder="请输入陪谈人号码/系统号/姓名进行搜索"
            :remote-method="remoteMethod"
            :loading="selectLoading"
            popper-class="select-remote"
            clearable
            data-tid="inviteSelect"
            @change="selectChangeHandle"
          >
            <el-option
              v-for="item in peopleList"
              :key="item.mchUserId"
              :label="item.userName + '（' + item.userCenterNo + '）'"
              :value="item"
            >
              <div>
                <p>{{ item.userName + '（' + item.userCenterNo + '）' }}</p>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
        <!-- 客户需携带资料 -->
        <el-form-item label="客户需携带资料：" class="invite-interview_resource" prop="resource">
          <el-checkbox-group v-model="ruleForm.resource">
            <el-checkbox v-for="item in resourceList" :key="item.id" :label="item.name">{{
              item.name
            }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <!-- 弹层按钮 -->
      <span slot="footer" class="footer">
        <span class="footer-info">注：提交后系统将给客户发送邀约短信和薯片</span>
        <div>
          <el-button size="small" @click="dialogVisible = false">取消</el-button>
          <el-button
            type="primary"
            size="small"
            :loading="loading"
            data-tid="inviteSubmit"
            @click="submitHandleClick"
            >提交</el-button
          >
        </div>
      </span>
    </el-dialog>
    <component
      :is="currentComponent"
      :ref="currentComponent"
      data-tid="inviteOnSubmit"
      @on-close="onCloseHandle"
      @on-submit="onSubmitHandle"
    />
  </div>
</template>

<script>
import './index.scss';
import store from 'storejs';
import AddContactPhone from '../add-contact-phone';
import AddStandbyContact from '../add-standby-contact';
import nextOneHourLate from 'utils/mixins/dateTimeValidate';
import {
  get_dictionary_data_by_parent_code,
  list_mch_address,
  find_contacts_by_customer_id,
  get_mch_user_info_list,
  initiate_interview,
} from 'api/common';
import dayjs from 'dayjs';
export default {
  name: 'InviteInterview',
  components: {
    AddContactPhone,
    AddStandbyContact,
  },
  mixins: [nextOneHourLate('inviteTime', 30, 'day', true)],
  props: {
    isPlace: {
      type: String,
      default: '',
    },
  },
  data() {
    const validateArea = (rule, value, callback) => {
      value = value.trim();
      if (!value) {
        callback('请输入面谈地点');
      } else {
        callback();
      }
    };
    return {
      accompanyInfo: {},
      businessInfo: {},
      dialogVisible: false,
      loading: false,
      ruleForm: {
        inviteType: 0,
        inviteTime: '',
        phone: '',
        area: '',
        people: '',
        resource: [],
      },
      addPhoneNumber: 3,
      sparePhone: false,
      currentComponent: '',
      phoneList: [],
      peopleList: [],
      addressList: [],
      resourceList: [],
      switchDialog: true,
      rules: {
        area: [{ required: true, validator: validateArea, trigger: 'blur' }],
        phone: [{ required: true, message: '请选择手机号码' }],
      },
      selectLoading: false,
      mchDetailId: '',
    };
  },
  created() {
    this.mchDetailId = store.get('mchInfo')?.mchDetailId || '';
  },
  methods: {
    /**
     * @description 客户上门和外出拜访修改
     * @param {Number}
     * @returns {}
     */
    inviteTypeChange(val) {
      if (val === 1) {
        this.ruleForm.area = '';
      } else {
        this.$refs.ruleForm.clearValidate('area');
        this.ruleForm.area = this.addressList.find(
          (item) => item.defaultOfficeAddress === 1,
        ).detailAdress;
      }
    },
    /**
     * @description 添加号码回调参数
     * @param {Array} 返回得数据
     */
    onSubmitHandle(res) {
      if (!Array.isArray(res)) return;
      this.addPhoneNumber = 3;
      this.sparePhone = false;
      this.phoneList = [];
      this.phoneListFormat(res);
      this.ruleForm.phone =
        res.find((item) => item.newFlag == 1)?.contactNoFull || this.businessInfo.customerPhone;
    },
    /**
     * @description 陪谈人搜索选中方法
     * @param {Object} 选中得对象
     */
    selectChangeHandle(val) {
      this.accompanyInfo = val;
    },
    /**
     * @description 远程搜索陪谈人
     */
    remoteMethod(keyword) {
      if (!keyword.trim()) return;
      this.selectLoading = true;
      const params = {
        start: 1,
        limit: 1000,
        mchDetailId: this.mchDetailId,
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
            res = res.data;
            this.peopleList = res.records || [];
            this.selectLoading = false;
          } else {
            this.$message.warning(res.message);
          }
        })
        .catch(() => (this.selectLoading = false));
    },
    /**
     * @description 弹框关闭方法
     */
    onCloseHandle(val) {
      this.switchDialog = val;
    },
    /**
     * @description 通过客户id获取联系人号码
     */
    getPhoneList() {
      const params = {
        customerId: this.businessInfo.customerId,
      };
      find_contacts_by_customer_id(params).then((res = []) => {
        if (res.code === 200) {
          res = res.data;
          if (res.length === 0) return;
          this.ruleForm.phone = res[0].contactNoFull; //回显商机上得主号码
          this.phoneListFormat(res);
        } else {
          this.$message.warning(res.message);
        }
      });
    },
    phoneListFormat(res) {
      for (const iterator of res) {
        if (iterator.contactWay !== 'CONTACT_WAY_MB') continue;
        if (iterator.contactRlat === 'CONTACT_RLAT_SPARE') {
          //存在得次联系人号码数量
          this.phoneList.push(iterator);
          this.sparePhone = true; //存在备用联系人
        } else {
          this.addPhoneNumber--;
          this.phoneList.push(iterator);
        }
      }
    },
    /**
     * @description 添加号码
     */
    addPhoneHandleClick() {
      if (this.addPhoneNumber > 0) {
        this.currentComponent = 'AddContactPhone';
      } else {
        this.currentComponent = 'AddStandbyContact';
      }
      this.switchDialog = false;
      this.$nextTick(() => {
        this.$refs[this.currentComponent].openModal(
          this.businessInfo,
          this.addPhoneNumber,
          this.phoneList,
        );
      });
    },
    /**
     * @description 供父组件调用打开弹层方法
     * @param {Object} 点击当前列表项
     */
    openModal(item) {
      this.nextTime = dayjs()
        .add(5, 'm')
        .valueOf(); //打开弹框记录当前时间下一个小时的时间进行对比
      this.businessInfo = Object.freeze(item || {}); //商机信息
      this.dialogVisible = true;
      this.getResourceList();
      this.getAddressList();
      this.getPhoneList();
      this.getPeopleList({
        start: 1,
        limit: 1000,
        mchDetailId: this.mchDetailId,
      });
    },
    /**
     * @description 获取面谈地点
     */
    getAddressList() {
      const param = { mchId: this.mchDetailId };
      list_mch_address(param).then((res = []) => {
        if (res.code === 200) {
          res = res.data;
          this.addressList = res;
          this.ruleForm.area = res.find((item) => item.defaultOfficeAddress === 1).detailAdress;
        } else {
          this.$message.warning(res.message);
        }
      });
    },
    /**
     * @description 获取客户需携带资料
     */
    getResourceList() {
      const params = {
        parentCode: 'QDS_INTERVIEW_BRING_DATA',
      };
      get_dictionary_data_by_parent_code(params).then((res) => {
        if (res.code === 200) {
          res = res.data;
          this.resourceList = Object.freeze(res);
        } else {
          this.$message.warning(res.message);
        }
      });
    },
    diologHandleClose() {
      this.ruleForm.inviteType = 0;
      this.$refs.ruleForm.resetFields();
      this.addPhoneNumber = 3;
      this.sparePhone = false;
      this.currentComponent = '';
      this.phoneList = [];
      this.accompanyInfo = {};
    },

    /**
     * @description 提交表单
     */
    submitHandleClick() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          const params = {};
          const accompanyInfo = this.accompanyInfo;
          const businessInfo = this.businessInfo;
          const ruleForm = this.ruleForm;
          params.accompanyId = accompanyInfo.mchUserId || undefined;
          params.accompanyName = accompanyInfo.userName || undefined;
          params.accompanyNo = accompanyInfo.userCenterNo || undefined;
          params.associationId = businessInfo.id || '';
          params.customerContact = ruleForm.phone.includes('******')
            ? businessInfo.customerContact
            : ruleForm.phone;
          params.customerId = businessInfo.customerId || '';
          params.customerName = businessInfo.customerName || '';
          params.customerNo = businessInfo.customerNo || '';
          params.dataTypeJson = ruleForm.resource?.join(',') || undefined;
          params.inviteAddress = ruleForm.area.trim() || '';
          params.inviteTime = dayjs(ruleForm.inviteTime).format('YYYY/MM/DD HH:mm') || '';
          params.inviteType = ruleForm.inviteType || 0;
          initiate_interview(params)
            .then((res) => {
              if (res.code == 200) {
                this.dialogVisible = false;
                this.$message.success(res.message);
                if (this.isPlace) {
                  this.$eventBus.$emit('invite-update-business-details');
                } else {
                  this.$emit('on-submit');
                }
              } else {
                this.$message.warning(res.message);
                if (res.code === 5002) {
                  if (this.isPlace === 'business-details') {
                    this.$router.go(-1);
                  } else {
                    this.$emit('on-submit');
                  }
                }
              }
              this.loading = false;
            })
            .catch(() => {
              this.loading = false;
            });
        }
      });
    },
  },
};
</script>
