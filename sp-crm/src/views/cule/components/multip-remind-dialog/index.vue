<!--拾回操作提醒 废弃-->
<template>
  <div>
    <el-dialog
      title="批量拾回线索"
      custom-class="multip-remind-dialog"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="480px"
      @close="diologHandleClose"
    >
      <div class="main">
        <p class="main__text">
          共现在<span class="main__text-txtb">{{ total }}</span
          >条线索，其中<span class="main__text-txtg">{{ success }}</span
          >条拾回成功，<span class="main__text-txtr">{{ failCules }}</span
          >条拾回失败!
        </p>
        <p class="main__txtc">失败原因可能为：您库容量已满!</p>
      </div>
      <span slot="footer" class="footer">
        <el-button
          type="primary"
          size="medium"
          data-tid="recordsCancelButton"
          @click="dialogVisible = false"
          >确定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import './index.scss';
export default {
  name: 'MultipRemindDialog',
  components: {},
  props: {},
  data() {
    return {
      total: '',
      success: '',
      failCules: '',
      dialogVisible: false,
    };
  },
  computed: {},
  created() {},
  methods: {
    diologHandleClose() {
      this.success = '';
      this.total = '';
      this.failCules = '';
    },
    /**
     * @description 供父组件调用打开弹层方法
     * @param {Object} 点击当前列表项
     */
    openModal(res) {
      this.success = res.data.success;
      this.total = res.data.total;
      this.failCules = res.data.failure;
      this.dialogVisible = true;
    },
  },
};
</script>
