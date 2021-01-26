<template>
  <el-dialog
    title="编辑/新增分组"
    custom-class="set-group-dialog"
    :visible.sync="dialogVisible"
    width="480px"
    :close-on-click-modal="false"
    @close="diologHandleClose"
  >
    <!-- 新建分组 -->
    <el-button
      :disabled="setGroupListFrom.setGroupList.length > 9"
      size="mini"
      type="primary"
      icon="iconfont-qds-crm icon-plusoutline"
      data-tid="addGroupHandleClick"
      @click="addGroupHandleClick"
      >新建分组</el-button
    >
    <div class="set-group_info">
      <i class="iconfont-qds-crm icon-attention"></i>
      <span>支持最多设置10个分组</span>
    </div>
    <!-- 输入框 -->
    <el-form ref="ruleForm" label-position="left" size="small" :model="setGroupListFrom">
      <el-form-item
        v-for="(item, index) in setGroupListFrom.setGroupList"
        :key="index + 'group'"
        class="set-group_item"
        :prop="'setGroupList.' + index + '.groupName'"
        :rules="rules.groupName"
      >
        <el-input
          v-model.trim="item.groupName"
          :maxlength="10"
          clearable
          show-word-limit
          placeholder="请输入分组名称"
        ></el-input>
        <el-button
          :data-index="index"
          plain
          size="small"
          icon="el-icon-delete"
          :disabled="disDeleteGroup"
          data-tid="deleteGroup"
          @click="deleteGroup(item, index)"
        ></el-button>
      </el-form-item>
    </el-form>
    <!-- 弹层按钮 -->
    <span slot="footer" class="footer">
      <el-button size="small" data-tid="recordsCancelButton" @click="dialogVisible = false"
        >取消</el-button
      >
      <el-button
        type="primary"
        :loading="loading"
        size="small"
        data-tid="groupSubmit"
        @click="submitHandleClick"
        >提交</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
import './index.scss';
import { edit_business_group, delete_business_group, get_business_groups } from 'api/my-business';
export default {
  name: 'EditGroup',
  data() {
    const validateGroupName = (rule, value, callback) => {
      value = value.trim();
      const flag = this.setGroupListFrom.setGroupList.filter((item) => value === item.groupName);
      if (flag.length > 1) {
        callback('已存在相同分组名，请重新输入');
      } else {
        callback();
      }
    };
    return {
      disDeleteGroup: false,
      dialogVisible: false,
      loading: false,
      groupId: '',
      busGroupId: '',
      setGroupListFrom: {
        setGroupList: [],
      },
      rules: {
        groupName: [{ validator: validateGroupName, trigger: 'blur' }],
      },
    };
  },
  created() {},
  methods: {
    /**
     * @description 提交表单
     */
    submitHandleClick() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.setGroupListFrom.setGroupList.length === 0) {
            this.$message.info('已经没有分组可以提交了');
            return;
          }
          const params = { groupVos: this.setGroupListFrom.setGroupList || [] };
          this.loading = true;
          edit_business_group(params)
            .then((res) => {
              if (res.code === 200) {
                this.$eventBus.$emit('edit-on-submit_update-business-info');
                this.$eventBus.$emit('edit-on-submit_update-list-search');
                this.groupId = res.data;
                this.dialogVisible = false;
              } else {
                this.$message.warning(res.message);
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
     * @description 点击新增分组按钮
     */
    addGroupHandleClick() {
      const item = { groupName: '' };
      this.setGroupListFrom.setGroupList.push(item);
    },
    /**
     * @description 供父组件调用打开弹层
     */
    openModal(list, id) {
      this.setGroupListFrom.setGroupList = list.concat();
      this.dialogVisible = true;
      this.busGroupId = id;
    },
    /**
     * @description 弹层关闭抛出事件,重置表单数据
     */
    diologHandleClose() {
      this.$emit('on-submit', this.groupId);
      this.busGroupId = '';
      this.$refs.ruleForm.resetFields();
      this.setGroupListFrom.setGroupList = [];
    },
    /**
     * @description 获取分组数据方法
     */
    getGroupList(type) {
      get_business_groups().then((res) => {
        if (res.code === 200) {
          res = res.data;
          this.setGroupListFrom.setGroupList =
            res.map((item) => {
              return {
                groupName: item.groupName,
                groupId: item.id,
              };
            }) || [];
          if (type) {
            const index = res?.findIndex((item) => item.id === this.busGroupId);
            console.log('ssssssssssssssssssss', index, this.busGroupId);
            this.$eventBus.$emit('edit-on-submit_update-list-search', index);
          }
        } else {
          this.$message.warning(res.message);
        }
      });
    },
    /**
     * @description 点击删除图标事件
     * @param {Number} 当前点击的索引
     */
    deleteGroup(item, index) {
      if (item.groupId) {
        this.disDeleteGroup = true;
        this.loading = true;
        const params = {
          groupId: item.groupId,
        };
        delete_business_group(params)
          .then((res) => {
            if (res.code === 200) {
              this.groupId = '';
              this.$eventBus.$emit('edit-on-submit_update-business-info');
              this.getGroupList('delete');
              this.disDeleteGroup = false;
            } else {
              this.$message.warning(res.message);
            }
            this.loading = false;
          })
          .catch(() => {
            this.loading = false;
          });
      } else {
        this.setGroupListFrom.setGroupList.splice(index, 1);
      }
    },
  },
};
</script>
