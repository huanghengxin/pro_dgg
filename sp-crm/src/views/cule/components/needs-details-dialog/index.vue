<template>
  <el-dialog
    :visible.sync="dialogVisible"
    custom-class="needs-details-dialog"
    :close-on-click-modal="false"
    width="620px"
    :show-close="false"
    @closed="dialogColsed"
  >
    <business-demand-info ref="businessDemandInfoRefs" :width="620" :business-id="clubid" type
      ><i class="el-icon-close" data-tid="needsCloseHandleClick" @click="closeHandleClick"></i
    ></business-demand-info>
  </el-dialog>
</template>

<script>
import './index.scss';
import BusinessDemandInfo from 'views/business-details/components/business-demand-info';

export default {
  name: 'NeedsDetailsgDialog',
  components: {
    BusinessDemandInfo,
  },
  provide: {
    permissionType() {
      return { info: '' };
    },
  },
  props: {},
  data() {
    return {
      clubid: '',
      dialogVisible: false,
    };
  },
  computed: {},
  created() {},
  methods: {
    dialogColsed() {
      this.$eventBus.$emit('closed-more');
    },
    closeHandleClick() {
      this.dialogVisible = false;
      this.clubid = '';
    },
    /**
     * @description 点击提交移交
     */
    onSubmitHandle() {
      this.dialogVisible = false;
    },
    /**
     * @description 供父组件调用打开弹层方法
     * @param {Object} 点击当前列表项
     */
    openModal(status) {
      this.$nextTick().then(() => {
        this.$refs.businessDemandInfoRefs.reset();
      });
      this.clubid = status;
      this.dialogVisible = true;
    },
  },
};
</script>
