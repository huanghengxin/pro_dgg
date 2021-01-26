<template>
  <div>
    <el-dialog
      title="移交商机"
      custom-class="move-remind-dialog"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="360px"
    >
      <div>
        <p><i class="iconfont-qds-crm icon-fail"></i>&nbsp; 移交失败</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;失败原因:{{ message }}!</p>
      </div>
      <span slot="footer" class="footer">
        <el-button size="medium" data-tid="recordsCancelButton" @click="dialogVisible = false"
          >取消</el-button
        >
        <el-button type="danger" size="medium" data-tid="remindLose" @click="lose"
          >失效此商机</el-button
        >
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
import { lose_efficacy_business } from 'api/team-manage';
export default {
  name: 'RemindDialog',
  components: {},
  props: {},
  data() {
    return {
      message: '',
      dialogVisible: false,
      businessId: '',
      ok: false,
      item: '',
    };
  },
  computed: {},
  created() {},
  methods: {
    repeat() {
      this.$emit('repeat', this.item);
      this.dialogVisible = false;
    },
    /**
     * @description 点击失效
     */
    lose() {
      this.loading = true;
      const params = {
        bizId: this.businessId,
      };
      lose_efficacy_business(params)
        .then((res) => {
          if (res.code === 200) {
            this.ok = true;
            this.dialogVisible = false;
            this.$emit('reset-list');
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
    openModal(id, res, businessDetail) {
      this.item = businessDetail;
      this.businessId = id;
      this.message = res.message;
      this.dialogVisible = true;
    },
  },
};
</script>
