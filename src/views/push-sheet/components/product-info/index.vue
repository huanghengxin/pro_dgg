<template>
  <div>
    <div class="product">
      <div class="product-title">
        <p class="titleWord">产品信息</p>
        <el-button
          type="primary"
          size="small"
          class="product-title_button"
          data-tid="chooseProduct"
          @click="chooseProduct"
          >选择商品</el-button
        >
      </div>
      <div class="tipsText">
        <i class="el-icon-warning-outline"></i>
        <p class="warning">交易产品不支持和其他类型产品一起推单，关联服务产品例外！</p>
      </div>
      <div v-if="setProductTableInfo.productTableInfo.length > 0" class="product-content">
        <div class="computedPrice">
          <el-button size="small" class="delBtn" data-tid="delAll" @click="delAll">删除</el-button>
          <p class="computedPrice-text">
            产品总金额：<span class="computedPrice-text_redcolor">￥{{ total }}</span>
          </p>
          <p class="computedPrice-text">
            产品总数：<span class="computedPrice-text_redcolor">{{
              setProductTableInfo.productTableInfo.length
            }}</span>
          </p>
          <p class="computedPrice-text">
            优惠合计：<span class="computedPrice-text_redcolor">￥{{ memberPrice }}</span>
          </p>
          <p class="computedPrice-text">
            应付/实付金额：<span class="computedPrice-text_redcolor">￥{{ actualPayment }}</span>
          </p>
          <p class="computedPrice-text">
            人名币大写：<span class="computedPrice-text_redcolor">{{ chinesePrice }}</span>
          </p>
        </div>
        <el-form
          ref="ruleForm"
          v-loading="loading"
          label-position="left"
          :model="setProductTableInfo"
          :rules="productRules"
        >
          <el-table
            ref="multipleTable"
            v-loading="loading"
            :data="setProductTableInfo.productTableInfo"
            border
            style="width: 100%"
            align="left"
            :span-method="objectSpanMethod"
            :cell-style="rowClass"
            :header-cell-style="headClass"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="53"> </el-table-column>
            <el-table-column fixed prop="index" label="#" width="65"> </el-table-column>
            <el-table-column label="产品类型" width="139">
              <template slot-scope="scope">
                {{
                  scope.row.proRule == 0
                    ? '服务产品'
                    : scope.row.proRule == 1
                    ? '资源产品'
                    : '交易产品'
                }}
              </template>
            </el-table-column>
            <el-table-column label="产品名称" width="199">
              <template slot-scope="scope">
                <show-tooltip
                  :text="scope.row.className || '-'"
                  :width="160"
                  style="color: #222"
                ></show-tooltip>
                <show-tooltip
                  :text="scope.row.skuContent || '-'"
                  :width="160"
                  style="color: #222"
                ></show-tooltip>
              </template>
            </el-table-column>
            <el-table-column label="任务项" width="216" align="left">
              <template slot-scope="scope">
                <div v-if="scope.row.taskItem" class="task">
                  <div v-if="!scope.row.linkSourceCode" class="task-item">
                    <div
                      v-for="(item, index) in scope.row.taskItem"
                      :key="index"
                      class="task-item-content"
                    >
                      <div class="task-item-content_left">
                        <span>
                          {{ index + 1 + '.' }}
                        </span>
                        <show-tooltip
                          :text="item.name || '-'"
                          :width="100"
                          style="color: #222"
                        ></show-tooltip>
                      </div>
                      <span v-if="item.price" class="task-item-content-price"
                        >￥{{ item.price }}</span
                      >
                    </div>
                  </div>
                  <div v-else>--</div>
                </div>
                <div v-else>--</div>
              </template>
            </el-table-column>
            <el-table-column prop="areaCode" label="产品城市" width="100"> </el-table-column>
            <el-table-column label="产品单价" align="right" header-align="right" width="140">
              <template slot-scope="scope">
                <show-tooltip
                  :text="'￥' + scope.row.referencePrice || '-'"
                  :width="80"
                  style="color: #222"
                ></show-tooltip>
              </template>
            </el-table-column>
            <el-table-column label="产品折扣" header-align="right" width="103">
              <template slot-scope="scope">
                <div v-if="scope.row.proRule == 0">
                  <el-form-item
                    :rules="productRules.discount"
                    :prop="'productTableInfo.' + scope.$index + '.goodsExecutionsNumber'"
                  >
                    <el-input
                      v-model.trim="scope.row.goodsExecutionsNumber"
                      data-tid="goodsExecutionsNumberInput"
                      @keyup.enter.native="keyup"
                      @blur="discountInput(scope.row)"
                    ></el-input>
                  </el-form-item>
                </div>
                <div v-else>
                  {{ scope.row.goodsExecutionsNumber }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="数量" header-align="center" width="100">
              <template slot-scope="scope">
                <div v-if="scope.row.proRule == 0">
                  <el-form-item
                    :rules="productRules.number"
                    :prop="'productTableInfo.' + scope.$index + '.num'"
                  >
                    <el-input v-model.trim="scope.row.num"></el-input>
                  </el-form-item>
                </div>
                <div v-else>
                  {{ scope.row.num }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="memberPrice" label="优惠金额" width="123">
              <div>
                <show-tooltip
                  :text="'￥' + memberPrice || '-'"
                  :width="80"
                  style="color: #222"
                ></show-tooltip>
              </div>
            </el-table-column>
            <el-table-column prop="subTotalPrice" label="小计金额" width="140">
              <div>
                <show-tooltip
                  :text="'￥' + subTotalPrice || '-'"
                  :width="80"
                  style="color: #222"
                ></show-tooltip>
              </div>
            </el-table-column>
            <el-table-column label="服务主体" width="200">
              <template slot-scope="scope">
                <show-tooltip
                  :text="scope.row.name || '-'"
                  :width="160"
                  style="color: #222"
                ></show-tooltip>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="200">
              <template slot-scope="scope">
                <el-button
                  v-if="scope.row.number == 1"
                  type="text"
                  size="small"
                  data-tid="linkResource"
                  @click="linkResource(scope.$index, scope.row)"
                  >关联资源</el-button
                >
                <el-button
                  type="text"
                  size="small"
                  data-tid="delAddressClick"
                  @click="
                    delAddressClick(
                      scope.$index,
                      setProductTableInfo.productTableInfo,
                      scope.row.id,
                    )
                  "
                  >删除</el-button
                >
                <el-button
                  type="text"
                  size="small"
                  data-tid="editTaskItem"
                  @click="editTaskItem(scope.row.id)"
                  >指定消化</el-button
                >
              </template>
            </el-table-column>
            <div slot="empty" class="emptyBg">
              <p>没有记录哦~</p>
            </div>
          </el-table>
        </el-form>
      </div>
      <div v-else class="no-data">
        <div class="no-data-box">
          <svg-icon key="item-warp" type="nodata" icon="icon-icon_nodata" />
        </div>
      </div>
    </div>

    <!-- 关联资源对话框 -->
    <el-dialog
      title="关联资源"
      :visible.sync="linkResourceDialog"
      width="1200px"
      :close-on-click-modal="false"
    >
      <el-tabs
        v-model="linkTabsActiveName"
        type="card"
        data-tid="productTabClick"
        @tab-click="productTabClick"
      >
        <el-tab-pane label="地址资源" name="1">
          <el-form
            ref="linkAddressFormRef"
            :model="linkAddressForm"
            label-width="76px"
            status-icon
            class="linkAddressForm-flexBox"
          >
            <el-form-item class="linkAddressForm-flexBox-item" label="综合搜索:" prop="query">
              <el-input
                v-model="linkAddressForm.query"
                clearable
                data-tid="query"
                placeholder="产品编号/产品名称"
              ></el-input>
            </el-form-item>
            <el-form-item label="单价范围:" class="linkAddressForm-flexBox-item" prop="price">
              <div class="linkAddressForm-flexBox-item-input-box">
                <input
                  v-model="linkAddressForm.price.priceMin"
                  maxlength="5"
                  data-tid="priceMin"
                  class="border-none-right"
                />
                <span>-</span>
                <input
                  v-model="linkAddressForm.price.priceMax"
                  maxlength="5"
                  data-tid="priceMax"
                  class="border-none-left"
                />
              </div>
            </el-form-item>
            <div class="linkAddressForm-flexBox-item">
              <el-button type="primary" size="small" data-tid="searchAddress" @click="searchAddress"
                >搜索</el-button
              >
            </div>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="400电话" name="2">
          <el-form
            ref="numFormRef"
            :model="numForm"
            label-width="76px"
            status-icon
            class="linkAddressForm-flexBox"
          >
            <el-form-item class="linkAddressForm-flexBox-item" label="前四位:" prop="query">
              <el-select v-model="numForm.four" placeholder="请选择">
                <el-option
                  v-for="item in dealClassify"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="linkAddressForm-flexBox-item" label="后四位:" prop="query">
              <el-select
                v-model="numForm.afterFour"
                data-tid="afterFourSelect"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in dealClassify"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="单价范围:" class="linkAddressForm-flexBox-item" prop="price">
              <div class="linkAddressForm-flexBox-item-input-box">
                <input
                  v-model="numForm.price.priceMin"
                  data-tid="priceMinInput"
                  maxlength="5"
                  class="border-none-right"
                />
                <span>-</span>
                <input
                  v-model="numForm.price.priceMax"
                  data-tid="priceMaxInput"
                  maxlength="5"
                  class="border-none-left"
                />
              </div>
            </el-form-item>
            <div class="linkAddressForm-flexBox-item">
              <el-button type="primary" size="small" data-tid="searchAddress" @click="searchAddress"
                >搜索</el-button
              >
            </div>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      <el-table :data="addressTableData" style="width: 100%">
        <el-table-column fixed prop="code" label="产品编号"> </el-table-column>
        <el-table-column prop="name" label="产品名称"> </el-table-column>
        <el-table-column prop="info" label="产品信息"> </el-table-column>
        <el-table-column prop="price" label="价格"> </el-table-column>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              data-tid="addressClick"
              @click="addressClick(scope.row)"
              >选择</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <Pagination
        :current-page="linkAddressForm.currentPage"
        :page-size="linkAddressForm.pagesize"
        layout="total, prev, pager, next"
        :total="100"
        @sizeChange="serveSizeChange"
        @currentChange="serveCurrentChange"
      ></Pagination>
    </el-dialog>
    <!-- 产品表格任务项显示弹框 -->
    <task-item-dialog ref="taskItemRef"></task-item-dialog>
    <!-- 选择产品 -->
    <choose-product
      ref="chooseProductRef"
      @continue-check-list="continueList"
      @continue-confirm-list="confirmList"
    ></choose-product>
  </div>
</template>

<script>
import ProductInfo from './product-info';
export default ProductInfo;
</script>
