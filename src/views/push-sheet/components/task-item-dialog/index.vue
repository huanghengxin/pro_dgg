<template>
  <div class="task-item">
    <el-dialog
      title="指定消化"
      :close-on-click-modal="false"
      :visible.sync="taskItemDialog"
      width="820px"
    >
      <p>
        <span class="task-title">产品信息：</span
        ><span class="task-content">有限公司注册/武侯区、有限公司</span>
      </p>
      <el-form ref="taskFormRef" :model="taskForm" :rules="rules" size="small">
        <!-- 常规任务 -->
        <p class="normal-task-title">常规任务项</p>
        <div class="normal-task-box">
          <p class="normal-task-box-title">任务项</p>
          <p class="normal-task-box-title">消化人员</p>
        </div>
        <div v-for="(item, i) in taskInfo.task1" :key="i + 'index'" class="normal-task">
          <div class="normal-task-left">
            <div class="normal-task-left-name-box">
              <div class="normal-task-left-name-box-item">
                <p class="normal-task-left-name-box-item-name">任务项名称{{ i + 1 }}：</p>
                <p class="normal-task-left-name-box-item-normal">
                  <show-tooltip
                    :text="item.taskName"
                    :width="200"
                    style="color: #222"
                  ></show-tooltip>
                </p>
              </div>
            </div>
          </div>
          <div class="normal-task-designee">
            <template v-if="i === 0">
              <div v-if="!isDesignee" class="normal-task-designee-button-box">
                <button
                  class="normal-task-designee-button-box-button"
                  data-tid="isDesignee"
                  @click="isDesignee = true"
                >
                  指定消化
                </button>
                <span class="el-icon-warning-outline normal-task-designee-button-box-tip"
                  >产品为分配模式，可指定消化人员</span
                >
              </div>
            </template>
            <div v-if="isDesignee" class="normal-task-designee-select">
              <el-input
                :value="item.designee"
                clearable
                size="small"
                placeholder="请选择"
                readonly
                suffix-icon="el-icon-arrow-down"
                data-tid="chooseDigestion"
                @focus="chooseDigestion(item.code, 1)"
              >
              </el-input>
            </div>
          </div>
        </div>
      </el-form>
      <p class="normal-task-title">增值任务项</p>
      <div class="normal-task-box">
        <p class="normal-task-box-title">任务项</p>
        <p class="normal-task-box-title">消化人员</p>
      </div>
      <div v-for="(item, i) in taskInfo.task2" :key="i" class="normal-task">
        <div class="normal-task-left">
          <div class="normal-task-left-name-box">
            <div class="normal-task-left-name-box-item">
              <p class="normal-task-left-name-box-item-name">任务项名称{{ i + 1 }}：</p>
              <p class="normal-task-left-name-box-item-appreciation">
                <show-tooltip :text="item.taskName" :width="117" style="color: #222"></show-tooltip>
              </p>
              <p class="normal-task-left-name-box-item-price">￥{{ item.price }}</p>
            </div>
          </div>
        </div>
        <div v-if="isDesignee" class="normal-task-designee">
          <div class="normal-task-designee-button-box">
            <el-input
              :value="item.designee"
              clearable
              size="small"
              placeholder="请选择"
              readonly
              suffix-icon="el-icon-arrow-down"
              data-tid="chooseDigestion"
              @focus="chooseDigestion(item.code, 2)"
            >
            </el-input>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" data-tid="taskItemDialog" @click="taskItemDialog = false"
          >取消</el-button
        >
        <el-button size="small" data-tid="taskItemConfirm" type="primary" @click="taskItemConfirm"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <designee-person ref="designeeRef" @get-designee-modal="getDesigneeModal"></designee-person>
  </div>
</template>

<script>
import DesigneePerson from './designee-person';
import ShowTooltip from 'components/show-tooltip';
import './index.scss';
export default {
  components: {
    DesigneePerson,
    ShowTooltip,
  },
  data() {
    return {
      rules: {
        task1: [{ required: true, message: '请选择', trigger: 'change' }],
      },
      taskItemDialog: false, //表格任务项弹框
      taskInfo: {
        //任务项信息
        task1: [
          {
            taskName: '任务项值任务项值任务项值任务项值任务项值任务项值',
            code: 't1',
          },
          {
            taskName: '任务项值任务项值',
            code: 't2',
          },
          {
            taskName: '任务项值任务项值',
            code: 't3',
          },
        ],
        task2: [
          {
            taskName: '增值项增值项增值增值',
            price: 100,
            code: 't4',
          },
          {
            taskName: '增值项增值项增值增值',
            price: 10000,
            code: 't5',
          },
        ],
      },
      taskForm: {
        //任务项数据
        task1: '',
        task2: '',
        designee1: '',
        designee2: '',
        designee3: '',
      },
      isDesignee: false, //是否指定消化
      //交易产品分类数据
      dealClassify: [
        {
          value: '选项1',
          label: '黄金糕',
        },
        {
          value: '选项2',
          label: '双皮奶',
        },
      ],
      //消化下拉数据：[]
      designeeSelect: [
        {
          value: '1',
          label: '黄金糕',
        },
        {
          value: '2',
          label: '双皮奶',
        },
      ],
      digestionFlag: false, //选择打开消化人员对话框
    };
  },
  methods: {
    /**
     * @description 任务项对话框点击确定关闭
     */
    taskItemConfirm() {
      this.taskItemDialog = false;
      console.log(this.taskInfo, 'this.taskInfo');
    },
    /**
     * @description 任务项对话框点击打开
     */
    openTaskItemDialog() {
      this.taskItemDialog = true;
    },
    /**
     * @description 点击打开消化人员对话框
     */
    chooseDigestion(code, num) {
      // this.selectedIndex = i;
      // this.selectedType = type;
      // console.log(1111);
      this.$refs.designeeRef.openModal(code, num);
    },
    /**
     * @description 等待子级传递数据
     * @returns {Object} 获取一个子级选中人员信息
     */
    getDesigneeModal(val) {
      console.log(val.assistantName, 'val');
      const item = this.taskInfo['task' + val.num];
      for (let t of item) {
        if (t.code === val.code) {
          this.$set(t, 'designee', val.assistantName);
          this.$set(t, 'id', val.id);
          break;
        }
      }
    },
  },
};
</script>
