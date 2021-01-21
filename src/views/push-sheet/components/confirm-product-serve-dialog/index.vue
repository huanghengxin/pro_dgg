<template>
  <el-dialog
    title="确认产品信息"
    :visible.sync="serviceProductDialog"
    width="620px"
    :close-on-click-modal="false"
    custom-class="confirm-product-serve"
    @closed="productClosed"
  >
    <div v-loading="loading">
      <!-- 指定消化弹框  服务 -->
      <div v-if="productName == 'serve'" class="companySignUp">
        <p class="companySignUp-title-text">
          {{ serveName }} <span class="text-color">￥{{ registerCompanyPrice }}</span>
        </p>
        <div class="companySignUp-skuBox">
          <span>SKU属性1:</span>
          <div class="companySignUp-skuBox-sku">
            <div
              v-for="(item, i) in sku1"
              :key="item.id"
              :class="{ normal: true, active: item.code === skuSubmit.sku1.code }"
              @click="skuHandleClick('sku1', i, item)"
            >
              {{ item.name }}
            </div>
          </div>
        </div>
        <div class="companySignUp-skuBox">
          <span>SKU属性2:</span>

          <div class="companySignUp-skuBox-sku">
            <div
              v-for="(item, i) in sku2"
              :key="item.id"
              :class="{ normal: true, active: item.code === skuSubmit.sku2.code }"
              @click="skuHandleClick('sku2', i, item)"
            >
              {{ item.name }}
            </div>
          </div>
        </div>
        <div class="companySignUp-skuBox">
          <span>SKU属性3:</span>
          <div class="companySignUp-skuBox-sku">
            <div
              v-for="(item, i) in sku3"
              :key="item.id"
              :class="{ normal: true, active: item.code === skuSubmit.sku3.code }"
              @click="skuHandleClick('sku3', i, item)"
            >
              {{ item.name }}
            </div>
          </div>
        </div>
        <div class="company-proNum">
          <p>产品数值:</p>
          <div class="company-proNum-input-number">
            <button
              :disabled="query.serviceNum <= 1"
              :class="[
                'company-proNum-input-number-public-style',
                query.serviceNum <= 1 ? 'shallow-color' : 'text-deep-color',
              ]"
              @click="reserveMinus"
            >
              -
            </button>
            <input
              v-model="query.serviceNum"
              type="text"
              class="company-proNum-input-number-input"
              disabled
            />
            <button class="company-proNum-input-number-public-style" @click="reserveAdd">+</button>
          </div>
        </div>
        <div class="companySignUp-skuBox">
          <span>增值任务项:</span>
          <div class="companySignUp-skuBox-sku">
            <div
              v-for="(item, i) in addedValue"
              :key="item.id"
              :class="{
                normal: true,
                active: item.code === skuSubmit.addedValue.code,
              }"
              @click="skuHandleClick('addedValue', i, item)"
            >
              {{ item.priceContent }}
            </div>
          </div>
        </div>
      </div>
      <!-- 指定消化弹框  资源 -->
      <div v-else-if="productName == 'resource'" class="officeAddress">
        <p class="officeAddress-title-text">
          孵化园办公地址 <span class="text-color">￥400.00</span>
        </p>
        <p class="officeAddress-product-info">产品信息</p>
        <div class="officeAddress-title">
          <p class="officeAddress-title-name">区域:</p>
          <show-tooltip
            :text="'四川省/成都市/武侯区四川省/成都市/武侯区四川省/成都市/武侯区'"
            :width="300"
            tooltip-class="officeAddress-title-address"
          />
        </div>
        <div class="officeAddress-title">
          <p class="officeAddress-title-name">详细地址:</p>
          <show-tooltip
            :text="'科华北路长荣街135号'"
            :width="140"
            tooltip-class="officeAddress-title-address"
          />
        </div>
        <div class="officeAddress-title">
          <p class="officeAddress-title-name">产品数量:</p>
          <div class="officeAddress-title-input-number">
            <button
              :disabled="query.resourceNum == 0"
              class="officeAddress-title-input-number-public-style"
              :class="deepColorFlag ? 'text-deep-color' : 'shallow-color'"
            >
              -
            </button>
            <input
              v-model="query.resourceNum"
              type="text"
              class="officeAddress-title-input-number-input"
              disabled
            />
            <button
              :disabled="query.resourceNum == 10"
              class="officeAddress-title-input-number-public-style"
              :class="shallowColorFlag ? 'text-deep-color' : 'shallow-color'"
            >
              +
            </button>
          </div>
        </div>
      </div>
      <!-- 指定消化弹框  交易 -->
      <div v-else class="companyTransfer">
        <p class="companyTransfer-title-text">
          公司转让【成都】<span class="text-color">￥400.00</span>
        </p>
        <p class="companyTransfer-product-info">资源信息</p>
        <div class="companyTransfer-title">
          <p class="companyTransfer-title-name">统一信用代码:</p>
          <show-tooltip
            :text="'153******21'"
            :width="300"
            tooltip-class="companyTransfer-title-address"
          />
        </div>
        <div class="companyTransfer-title">
          <p class="companyTransfer-title-name">注册资本:</p>
          <show-tooltip
            :text="'550万元'"
            :width="300"
            tooltip-class="companyTransfer-title-address"
          />
        </div>
        <div class="companyTransfer-title">
          <p class="companyTransfer-title-name">实缴资本:</p>
          <show-tooltip
            :text="'550万元'"
            :width="300"
            tooltip-class="companyTransfer-title-address"
          />
        </div>
        <div class="companyTransfer-title">
          <p class="companyTransfer-title-name">注册时间:</p>
          <show-tooltip
            :text="'2020-09-09'"
            :width="300"
            tooltip-class="companyTransfer-title-address"
          />
        </div>
        <div class="companyTransfer-title">
          <p class="companyTransfer-title-name">公司地址:</p>
          <show-tooltip
            :text="'科华南路一段55号'"
            :width="300"
            tooltip-class="companyTransfer-title-address"
          />
        </div>
        <div class="companyTransfer-title">
          <p class="companyTransfer-title-name">产品数量:</p>
          <div class="companyTransfer-title-input-number">
            <div
              class="companyTransfer-title-input-number-public-style"
              :class="deepColorFlag ? 'text-deep-color' : 'shallow-color'"
            >
              -
            </div>
            <input
              v-model="query.dealNum"
              type="text"
              class="companyTransfer-title-input-number-input"
              disabled
            />
            <div
              class="companyTransfer-title-input-number-public-style"
              :class="shallowColorFlag ? 'text-deep-color' : 'shallow-color'"
            >
              +
            </div>
          </div>
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" class="four-Word" @click="continueBuy">继续加购</el-button>
      <el-button size="small" type="primary" @click="confirmSku">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import productServeDialog from './productServeDialog';
export default productServeDialog;
</script>
