<template>
  <div>
    <el-dialog
      title="拾回线索"
      :visible.sync="dialogVisible"
      custom-class="multip-cule-retrieve-dialog"
      :close-on-click-modal="false"
      width="620px"
    >
      <p class="text">
        <i class="iconfont-qds-crm icon-success"></i> 共选择<span class="txt">{{
          clueIdArr.length
        }}</span
        >条线索
        <span v-show="clueIdArr.length > 50" class="text__remind">( 单次最多选择50条哦～)</span>
      </p>

      <span slot="footer" class="footer">
        <span class="note">您库容量已满!您已有客户可能会导致线索拾回失败!</span>
        <div>
          <el-button size="medium" data-tid="recordsCancelButton" @click="dialogVisible = false"
            >取消</el-button
          >
          <el-button
            type="primary"
            size="medium"
            :loading="loading"
            data-tid="recordOnSubmitHandle"
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
import { batch_pick_up_clue } from 'api/cule';
import MultipRemindDialog from '../multip-remind-dialog/index.vue';
export default {
  name: 'MultipCuleMoveDialog',
  components: {
    MultipRemindDialog,
  },
  props: {},
  data() {
    return {
      loading: false,
      dialogVisible: false,
      ruleForm: {
        safftId: '', //移交人
      },
      safftRule: {
        required: true,
      },
      sattfList: [],
      clueIdArr: '',
    };
  },
  computed: {},
  created() {},
  methods: {
    /**
     * @description 点击提交移交
     */
    onSubmitHandle() {
      this.handOver();
    },
    /**
     * @description 供父组件调用打开弹层方法
     * @param {Object} 点击当前列表项
     */
    openModal(arr) {
      this.clueIdArr = arr || [];
      this.dialogVisible = true;
    },
    /**
     * @description 获取规划师
     *
    /**
     * @description 点击提交批量拾回
     */
    handOver() {
      const param = {
        clueIds: this.clueIdArr,
      };
      this.loading = true;
      batch_pick_up_clue(param)
        .then((res) => {
          if (res.code === 200) {
            this.$refs.multipRemindDialog.openModal(res);
            this.$emit('reset-list', res.data);
            this.dialogVisible = false;
          } else {
            this.$message.warning(res.message);
          }
          this.loading = false;
        })
        .catch((res) => {
          this.loading = false;
        });
    },
  },
};
</script>
