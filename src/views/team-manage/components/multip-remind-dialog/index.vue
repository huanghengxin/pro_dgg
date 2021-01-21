<template>
  <div class="remind">
    <el-dialog
      title="批量移交商机"
      custom-class="remind-dialog"
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      width="480px"
    >
      <div class="main">
        <p class="main__text">
          共现在<span class="main__text-txtb">{{ total }}</span
          >条商机，其中<span class="main__text-txtg">{{ success }}</span
          >条移交成功，<span class="main__text-txtr">{{ failCules }}</span
          >条移交失败!
        </p>
        <p class="main__txtc">失败原因可能为：接收人库容量已满、接收人已有移交的客户！</p>
      </div>
      <span slot="footer" class="footer">
        <el-button type="primary" size="medium" @click="dialogVisible = false">确定</el-button>
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
    /**
     * @description 供父组件调用打开弹层方法
     * @param {Object} 点击当前列表项
     */
    openModal(res) {
      this.dialogVisible = true;
      this.success = res.data.success;
      this.total = res.data.total;
      this.failCules = res.data.failure;
    },
  },
};
</script>
