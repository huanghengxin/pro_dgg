<template>
  <!-- 第一步产品信息对话框 -->
  <div class="choose-product">
    <el-dialog
      title="选择产品"
      :visible.sync="chooseProductDialog"
      :close-on-click-modal="false"
      width="1200px"
      class="choose-product-dialog"
      @closed="closedChooseProductModal"
    >
      <el-tabs
        v-model="activeName"
        type="card"
        data-tid="productTabClick"
        @tab-click="productTabClick"
      >
        <!-- 服务产品 -->
        <el-tab-pane label="服务产品" name="serve">
          <el-form
            ref="productFormRef"
            :model="productForm"
            label-width="76px"
            status-icon
            class="productForm"
          >
            <div class="flexBox">
              <el-form-item class="flexBox-item" label="综合搜索:" prop="query">
                <el-input
                  v-model="productForm.query"
                  clearable
                  placeholder="产品名称/产品编号"
                ></el-input>
              </el-form-item>
              <el-form-item class="flexBox-item" label="产品分类:" prop="productType">
                <!-- 选择"产品分类级联-->
                <!-- 
                  <el-cascader
                  v-model="productForm.productType"
                  expand-trigger="hover"
                  :options="productClassify"
                  :props="productProps"
                  clearable
                ></el-cascader>
                 -->
                <el-cascader
                  v-model="productForm.productCity"
                  placeholder="请选择产品分类"
                  :props="productProps"
                  clearable
                ></el-cascader>
              </el-form-item>
              <el-form-item class="flexBox-item" label="产品城市:" prop="productCity">
                <!-- 选择城市分类级联-->
                <!--
                 <el-cascader
                  v-model="productForm.productCity"
                  expand-trigger="hover"
                  :options="productCity"
                  :props="cityProps"
                  clearable
                ></el-cascader>
                -->
                <el-cascader
                  v-model="productForm.productCity"
                  placeholder="请选择产品城市"
                  :props="cityProps"
                  clearable
                ></el-cascader>
              </el-form-item>
              <el-form-item label="单价范围:" class="flexBox-item" prop="price">
                <div class="flexBox-item-input-box">
                  <input
                    v-model="productForm.price.priceMin"
                    maxlength="5"
                    class="border-none-right"
                  />
                  <span>-</span>
                  <input
                    v-model="productForm.price.priceMax"
                    maxlength="5"
                    class="border-none-left"
                  />
                </div>
              </el-form-item>
              <div class="flexBox-item">
                <el-button
                  type="primary"
                  size="small"
                  data-tid="searchProductTabClick"
                  @click="searchService"
                  >搜索</el-button
                >
                <el-button type="info" size="small" @click="resetService">重置</el-button>
              </div>
            </div>
          </el-form>
        </el-tab-pane>
        <!-- 资源产品 -->
        <el-tab-pane label="资源产品" name="resource">
          <el-form
            ref="resourceFormRef"
            :model="resourceForm"
            label-width="76px"
            status-icon
            class="resourceForm"
          >
            <div class="flexBox">
              <el-form-item class="flexBox-item" label="综合搜索:" prop="query">
                <el-input
                  v-model="resourceForm.query"
                  clearable
                  placeholder="客户名称/商机编号"
                ></el-input>
              </el-form-item>
              <el-form-item class="flexBox-item" label="产品分类:" prop="productType">
                <el-select v-model="resourceForm.productType" placeholder="请选择">
                  <el-option
                    v-for="item in resourceClassify"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="单价范围:" class="flexBox-item" prop="price">
                <div class="flexBox-item-input-box">
                  <input
                    v-model="resourceForm.price.priceMin"
                    maxlength="5"
                    class="border-none-right"
                  />
                  <span>-</span>
                  <input
                    v-model="resourceForm.price.priceMax"
                    maxlength="5"
                    class="border-none-left"
                  />
                </div>
              </el-form-item>
              <div class="flexBox-item">
                <el-button type="primary" size="small" @click="searchService">搜索</el-button>
                <el-button type="info" size="small" @click="resetService">重置</el-button>
              </div>
            </div>
          </el-form>
        </el-tab-pane>
        <!-- 交易产品 -->
        <el-tab-pane label="交易产品" name="deal">
          <el-form
            ref="dealFormRef"
            :model="dealForm"
            label-width="76px"
            status-icon
            class="dealForm"
          >
            <div class="flexBox">
              <el-form-item class="flexBox-item" label="综合搜索:" prop="query">
                <el-input
                  v-model="dealForm.query"
                  clearable
                  placeholder="客户名称/商机编号"
                ></el-input>
              </el-form-item>
              <el-form-item class="flexBox-item" label="产品分类:" prop="productType">
                <el-select v-model="dealForm.productType" placeholder="请选择">
                  <el-option
                    v-for="item in dealClassify"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="单价范围:" class="flexBox-item" prop="price">
                <div class="flexBox-item-input-box">
                  <input
                    v-model="dealForm.price.priceMin"
                    maxlength="5"
                    class="border-none-right"
                  />
                  <span>-</span>
                  <input v-model="dealForm.price.priceMax" maxlength="5" class="border-none-left" />
                </div>
              </el-form-item>
              <div class="flexBox-item">
                <el-button
                  type="primary"
                  size="small"
                  data-tid="searchTabClick"
                  @click="searchService"
                  >搜索</el-button
                >
                <el-button type="info" size="small" @click="resetService">重置</el-button>
              </div>
            </div>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      <div v-if="activeName == tabType">
        <div v-show="serviceAlreadyTableData != null" class="choose-product-alreadyTable">
          <div class="choose-product-alreadyTable-box">
            <span class="choose-product-alreadyTable-box-title">已选产品</span>
            <div class="choose-product-alreadyTable-box-delAll" @click="delAll">
              <i class="el-icon-delete"></i> 全部移除
            </div>
          </div>
          <!-- 已选产品表格 -->
          <el-table :data="serviceAlreadyTableData">
            <el-table-column slot="empty">
              <svg-icon key="item-warp" type="nodata" icon="icon-icon_nodata" />
            </el-table-column>
            <el-table-column prop="productNo" label="产品编号" width="219">
              <template slot-scope="scope">
                <show-tooltip
                  :text="scope.row.productNo || '-'"
                  :width="183"
                  style="color: #222"
                ></show-tooltip>
              </template>
            </el-table-column>
            <el-table-column label="产品名称" width="253">
              <template slot-scope="scope">
                <show-tooltip
                  :text="scope.row.className || '-'"
                  :width="213"
                  style="color: #222"
                ></show-tooltip>
              </template>
            </el-table-column>
            <el-table-column label="产品属性" width="340">
              <template slot-scope="scope">
                <show-tooltip
                  :text="scope.row.productDescription || ''"
                  :width="300"
                  style="color: #222"
                ></show-tooltip>
              </template>
            </el-table-column>
            <el-table-column label="数量">
              <template slot-scope="scope">
                <span>{{ scope.row.goodsExecutionsNumber }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="105">
              <template slot-scope="scope">
                <span
                  style="color: #436eee; cursor: pointer"
                  @click="remove(scope.row, scope.$index)"
                  >移除</span
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <!-- 产品表格 -->
      <el-table v-loading="loading" :data="productTableInfo" stripe style="width: 1160px">
        <el-table-column slot="empty">
          <svg-icon key="item-warp" type="nodata" icon="icon-icon_nodata" />
        </el-table-column>
        <el-table-column label="产品编号" width="156">
          <template slot-scope="scope">
            <show-tooltip
              :text="scope.row.productNo || '-'"
              :width="120"
              style="color: #222"
            ></show-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="产品名称" width="200">
          <template slot-scope="scope">
            <show-tooltip
              :text="scope.row.name || '-'"
              :width="160"
              style="color: #222"
            ></show-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="产品分类" width="240">
          <template slot-scope="scope">
            <show-tooltip
              :text="scope.row.className || '-'"
              :width="200"
              style="color: #222"
            ></show-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="产品城市" prop="areaCode" width="160"> </el-table-column>
        <el-table-column align="right" header-align="right" label="产品单价" width="120">
          <template slot-scope="scope">
            <show-tooltip
              :text="'￥' + scope.row.referencePrice || '-'"
              :width="80"
              style="color: #222"
            ></show-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.state == 0" class="sold-out">下架 </span>
            <span v-else class="has-been-on">已上架 </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="105">
          <template slot-scope="scope">
            <span style="color: #436eee; cursor: pointer" @click="chooseBusinessItem(scope.row)"
              >选择</span
            >
          </template>
        </el-table-column>
      </el-table>
      <div v-if="showPaginationFlag" class="pagination">
        <el-pagination
          :total="total"
          background
          :page-sizes="[10, 50, 100, 150]"
          layout="total, prev, pager, next"
          @size-change="sizeChange"
          @current-change="currentChange"
        ></el-pagination>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="chooseProductDialog = false">取 消</el-button>
        <el-button size="small" type="primary" @click="confirmProduct">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 确认产品信息弹框  服务-->
    <ConfirmProductServe
      ref="confirmProductServeRef"
      :avitve="activeName"
      @on-choose-serve="OnChooseHandleServe"
      @on-choose-resource="OnChooseHandleResource"
      @on-choose-confirm="OnChooseConfirmHandle"
      @close-modal="closeModal"
      @getServeInfo="getServeInfo"
    ></ConfirmProductServe>
  </div>
</template>

<script>
import chooseProsuct from './chooseProsuct';
export default chooseProsuct;
import './index.scss';
</script>
