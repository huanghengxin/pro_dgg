<template>
  <div>
    <el-dialog
      v-show="switchDialog"
      title="写跟进"
      custom-class="write-follow-record"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :width="width"
      data-tid="writeFollowRrecord"
      @close="diologHandleClose"
    >
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        :label-width="labelWidth"
        label-position="left"
        size="small"
      >
        <el-form-item label="跟进内容：" prop="text">
          <el-input
            v-model="ruleForm.text"
            v-emoji="'textarea'"
            type="textarea"
            :rows="4"
            :maxlength="200"
            show-word-limit
            resize="none"
            placeholder="请输入跟进内容"
          ></el-input>
        </el-form-item>
        <div
          :class="from === 'team-manage' ? 'quick-note-team-manage' : 'quick-note'"
          data-tid="noteHanleClick"
          @click="noteHanleClick"
        >
          <span
            v-for="(item, index) in quickNoteList"
            :key="item.code"
            :data-name="item.description"
            :data-index="index"
            :class="{
              'quick-note_item': true,
              'quick-note_item-active': item.active,
            }"
            >{{ item.description }}</span
          >
        </div>
        <el-form-item v-if="from !== 'team-manage'" label="下次跟进时间：" prop="nextFollowTime">
          <el-date-picker
            ref="dateTimeRef"
            v-model="ruleForm.nextFollowTime"
            type="datetime"
            placeholder="选择日期时间"
            format="yyyy-MM-dd HH:mm"
            :picker-options="pickerOptions"
            :default-time="nowTime"
            data-tid="focusHandleDateClick"
            @focus="focusHandle"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item v-if="from !== 'team-manage'" label="商机分组：" prop="groupId">
          <div class="quick-note_group">
            <el-select v-model="ruleForm.groupId" clearable placeholder="请选择分组">
              <el-option
                v-for="item in groupList"
                :key="item.id"
                :label="item.groupName"
                :value="item.groupId"
              >
              </el-option>
            </el-select>
            <div
              v-show="showSetGroup"
              class="quick-note_group-add"
              data-tid="addGroupHandleClick"
              @click="addGroupHandleClick"
            >
              无可用分组，去新建
              <i class="iconfont-qds-crm icon-rightoutline"></i>
            </div>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="footer">
        <el-button size="small" data-tid="recordsCancelButton" @click="dialogVisible = false"
          >取消</el-button
        >
        <el-button
          :loading="loading"
          type="primary"
          size="small"
          data-tid="followSubmit"
          @click="submitFormHandle"
          >提交</el-button
        >
      </span>
    </el-dialog>
    <edit-group
      v-if="showSetGroup"
      ref="setGroupRef"
      data-tid="followSubmit"
      @on-close="onCloseHandle"
      @on-submit="onSubmitHandle"
    ></edit-group>
  </div>
</template>

<script>
import './index.scss';
import { get_business_groups } from 'api/my-business';
import { write_biz_follow_record_manage } from 'api/team-manage';
import dayjs from 'dayjs';
import { write_biz_follow_record, getTreeBook } from 'api/common';
import nextOneHourLate from 'utils/mixins/dateTimeValidate';
import EditGroup from '../edit-group/index.vue';
export default {
  name: 'WriteFollowRecord',
  components: {
    EditGroup,
  },
  mixins: [nextOneHourLate('nextFollowTime', 1, 'y')],
  props: {
    isPlace: {
      type: String,
      default: '',
    },
    from: {
      type: String,
      default: '',
    },
  },
  data() {
    const validateContent = (rule, value, callback) => {
      value = value.trim();
      if (!value) {
        callback('内容不能为空');
      } else {
        callback();
      }
    };
    return {
      loading: false,
      showSetGroup: false,
      dialogVisible: false,
      width: '820px',
      labelWidth: '130px',
      ruleForm: {
        text: '',
        nextFollowTime: '',
        groupId: undefined,
      },
      rules: {
        text: [{ validator: validateContent, trigger: 'change', required: true }],
      },
      groupList: [],
      businessId: '',
      quickNoteList: [],
      switchDialog: true,
    };
  },
  methods: {
    /**
     * @description 提交表单
     */
    submitFormHandle() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          const params = {};
          const ruleForm = this.ruleForm;
          params.text = ruleForm.text.trim();
          params.bizId = this.businessId;
          if (this.from === 'team-manage') {
            write_biz_follow_record_manage(params)
              .then((res) => {
                if (res.code === 200) {
                  res = res.data;
                  this.dialogVisible = false;
                  this.$emit('on-submit');
                  this.$message.success('操作成功');
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
            return;
          }
          params.groupId = ruleForm.groupId || 0;
          params.nextFollowTime = ruleForm.nextFollowTime
            ? dayjs(ruleForm.nextFollowTime).format('YYYY-MM-DD HH:mm') + ':00'
            : '';
          this.loading = true;
          write_biz_follow_record(params)
            .then((res) => {
              if (res.code === 200) {
                res = res.data;
                this.dialogVisible = false;
                this.$emit('on-submit');
                this.$message.success('操作成功');
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
    /**
     * @description 添加分组成功回调
     */
    onSubmitHandle(id) {
      this.switchDialog = true;
      if (id) {
        this.getGroupList(id);
      } else {
        this.getGroupList();
      }
    },
    /**
     * @description 关闭添加分组弹层回调
     */
    onCloseHandle(flag) {
      this.switchDialog = flag;
    },
    /**
     * @description 点击无可用分组方法
     */
    addGroupHandleClick() {
      this.$refs.setGroupRef.openModal(this.groupList);
      this.switchDialog = false;
    },
    /**
     * @description 弹层关闭清空数据
     */
    diologHandleClose() {
      this.$refs.ruleForm.resetFields();
      this.ruleForm.nextFollowTime = '';
      this.quickNoteList = [];
    },
    quickNote(data_index, data_name) {
      const item = this.quickNoteList[data_index];
      this.$set(item, 'active', !item.active);
      if (item.active) {
        this.ruleForm.text = this.ruleForm.text + data_name;
      } else {
        this.ruleForm.text = this.ruleForm.text.replace(data_name, '');
      }
    },
    /**
     * @description 点击快捷备注添加到文本域中
     * @param {Event} 事件对象
     */
    noteHanleClick(e) {
      const data_name = e.target.dataset.name + '，';
      const data_index = e.target.dataset.index;
      if (!data_index) return;
      if (this.quickNoteList[data_index].active) {
        this.quickNote(data_index, data_name);
        return;
      }
      if (data_name.length + this.ruleForm.text.length > 200) return;
      this.quickNote(data_index, data_name);
    },
    /**
     * @description 获取快捷备注数据方法
     */
    getQuickNoteList() {
      const params = {
        type: 1,
        code: 'CRM_BIZ_QUICK_NOTE',
        status: 1,
      };
      this.loading = true;
      getTreeBook(params)
        .then((res) => {
          if (res.code === 200) {
            res = res.data;
            this.quickNoteList = res;
          } else {
            this.$message.warning(res.message);
          }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    /**
     * @description 供父组件调用打开弹层方法
     * @param {Object} 点击当前列表项
     */
    openModal({ id = '', groupId = '', nextFollowTime = '' }) {
      if (this.from === 'team-manage') {
        this.width = '680px';
        this.labelWidth = '100px';
      }
      this.nextTime = dayjs().add(5, 'm').valueOf();
      this.businessId = id;
      if (nextFollowTime && dayjs(nextFollowTime).isValid()) {
        this.ruleForm.nextFollowTime = dayjs().isBefore(dayjs(nextFollowTime))
          ? nextFollowTime
          : '';
      }
      this.dialogVisible = true;
      this.getGroupList(groupId);
      this.getQuickNoteList();
    },
    /**
     * @description 获取分组数据方法
     */
    getGroupList(id) {
      const params = {
        businessId: this.businessId,
      };
      get_business_groups(params).then((res) => {
        if (res.code === 200) {
          res = res.data;
          this.groupList = res.map((item) => {
            const { groupName, id } = item;
            return {
              groupName,
              groupId: id,
            };
          });
          this.ruleForm.groupId = this.groupList.find((it) => it.groupId === id)?.groupId || '';
          this.showSetGroup = true;
        } else {
          this.$message.warning(res.message);
        }
      });
    },
  },
};
</script>
