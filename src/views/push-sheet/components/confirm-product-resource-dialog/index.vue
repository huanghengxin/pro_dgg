<template>
  <div class="confirm-resource">
    <!-- 确认产品信息弹框  资源 -->
    <el-dialog
      title="确认产品信息"
      :close-on-click-modal="false"
      :visible.sync="resourceProductDialog"
      width="620px"
    >
      <div class="officeAddress">
        <p class="officeAddress-title-text">
          孵化园办公地址 <span class="text-color">￥400.00</span>
        </p>
        <p class="officeAddress-product-info">产品信息</p>
        <div class="officeAddress-title">
          <p class="officeAddress-title-name">区域：</p>
          <show-tooltip
            :text="'四川省/成都市/武侯区四川省/成都市/武侯区四川省/成都市/武侯区'"
            :width="300"
            tooltip-class="officeAddress-title-address"
          />
        </div>
        <div class="officeAddress-title">
          <p class="officeAddress-title-name">详细地址：</p>
          <show-tooltip
            :text="'科华北路长荣街135号'"
            :width="140"
            tooltip-class="officeAddress-title-address"
          />
        </div>
        <div class="officeAddress-title">
          <p class="officeAddress-title-name">产品数量：</p>
          <div class="officeAddress-title-input-number">
            <button
              :disabled="resourceNum == 0"
              class="officeAddress-title-input-number-public-style"
              :class="deepColorFlag ? 'text-deep-color' : 'shallow-color'"
            >
              -
            </button>
            <input
              v-model="resourceNum"
              type="text"
              class="officeAddress-title-input-number-input"
              disabled
            />
            <button
              :disabled="resourceNum == 10"
              class="officeAddress-title-input-number-public-style"
              :class="shallowColorFlag ? 'text-deep-color' : 'shallow-color'"
            >
              +
            </button>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resourceContinueBuy">继续加购</el-button>
        <el-button type="primary" @click="resourceConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import './index.scss';
export default {
  data() {
    return {
      resourceProductDialog: false, //点击资源产品选择，显示属性对话框
      resourceNum: 1, //计数器 数量 资源产品
    };
  },
  created() {},
  methods: {
    //继续加购 资源产品
    resourceContinueBuy() {
      this.resourceAlreadyTableData = this.selectedResourceInfo;
      this.resourceProductDialog = false;
    },
    //确定Sku 资源产品
    resourceConfirm() {
      this.productTableInfo.push(this.selectedResourceRowInfo);
      this.chooseProductDialog = false;
      this.resourceProductDialog = false;
    },
    openModal() {
      this.resourceProductDialog = true;
    },
  },
};
</script>
