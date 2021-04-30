<template>
  <div>
    <el-dialog
      v-show="switchDialog"
      title="设置分组"
      custom-class="set-group"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="480px"
      @close="diologHandleClose"
    >
      <el-form ref="ruleForm" :model="ruleForm" label-position="left" size="small">
        <el-form-item label="选择分组：" prop="groupId">
          <el-button
            v-if="groupList.length === 0"
            key="set-group"
            size="mini"
            type="primary"
            icon="el-icon-plus"
            data-tid="addGroupHandleClick"
            @click="addGroupHandleClick"
            >新建分组</el-button
          >
          <div v-else key="set-group">
            <el-select v-model="ruleForm.groupId" clearable placeholder="请选择分组">
              <el-option
                v-for="item in groupList"
                :key="item.groupId"
                :label="item.groupName"
                :value="item.groupId"
              >
              </el-option>
            </el-select>
            <span
              class="set-group_edit"
              data-tid="editGroupHandleClick"
              @click="addGroupHandleClick"
              >编辑</span
            >
          </div>
        </el-form-item>
      </el-form>
      <!-- 弹层按钮 -->
      <span slot="footer" class="footer">
        <el-button size="small" data-tid="recordsCancelButton" @click="dialogVisible = false"
          >取消</el-button
        >
        <el-button
          type="primary"
          :disabled="disabled"
          :loading="loading"
          size="small"
          data-tid="searchSubmit"
          @click="submitHandleClick"
          >提交</el-button
        >
      </span>
    </el-dialog>
    <edit-group ref="setGroupRef" data-tid="searchSubmit" @on-submit="onSubmitHandle"></edit-group>
  </div>
</template>

<script>
import './index.scss';
import { get_business_groups, set_business_group } from 'api/my-business';
import EditGroup from '../edit-group/index.vue';
export default {
  name: 'SetGroup',
  components: {
    EditGroup,
  },
  props: {
    isPlace: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      disabled: false,
      dialogVisible: false,
      groupList: [],
      showButton: false,
      loading: false,
      ruleForm: {
        groupId: '',
      },
      switchDialog: true,
      businessId: '',
      groupId: '',
    };
  },

  methods: {
    /**
     * @description 添加分组成功回调
     */
    onSubmitHandle(id) {
      this.switchDialog = true;
      if (id) {
        this.getGroupList({ groupId: id }, 'edit');
      } else {
        this.getGroupList(undefined, 'edit');
      }
    },
    /**
     * @description 提交方法
     */
    submitHandleClick() {
      const params = {
        businessId: this.businessId,
        groupId: this.ruleForm.groupId || 0,
      };
      this.loading = true;
      set_business_group(params)
        .then((res) => {
          if (res.code === 200) {
            if (this.isPlace) {
              this.$eventBus.$emit('edit-on-submit_update-business-info');
            } else {
              this.$emit('on-submit');
            }
            this.$message.success('操作成功');
            this.dialogVisible = false;
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
    },
    /**
     * @description 点击新建按钮方法
     */
    addGroupHandleClick() {
      this.$refs.setGroupRef.openModal(this.groupList, this.groupId);
      this.switchDialog = false;
    },
    /**
     * @description 获取分组数据方法
     */
    getGroupList(item, type) {
      // this.showSetGroup = true;
      get_business_groups().then((res) => {
        if (res.code === 200) {
          res = res.data;
          this.groupList =
            res.map((item) => {
              return {
                groupName: item.groupName,
                groupId: item.id,
              };
            }) || [];
          if (item) {
            this.ruleForm.groupId =
              this.groupList.find((it) => it.groupId === item?.groupId)?.groupId || '';
          }
          if (type === 'edit') {
            const index = res?.findIndex((item) => item.id === this.groupId);
            this.$eventBus.$emit('edit-on-submit_update-list-search', index);
          }
          if (this.groupList.length === 0) {
            this.disabled = true;
          } else {
            this.disabled = false;
          }
        } else {
          this.$message.warning(res.message);
        }
      });
    },
    diologHandleClose() {
      this.groupId = '';
      this.$refs.ruleForm.resetFields();
    },
    openModal(item) {
      this.groupId = item.groupId;
      this.dialogVisible = true;
      this.businessId = item.id;
      if (this.groupList.length === 0) {
        this.showButton = true;
      }
      this.getGroupList(item);
    },
  },
};
</script>

<style></style>
