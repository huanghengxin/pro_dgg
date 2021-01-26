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
            ref="serveFormRef"
            :model="serveForm"
            label-width="76px"
            status-icon
            class="serveForm"
          >
            <div class="flexBox">
              <el-form-item class="flexBox-item" label="综合搜索:" prop="searchKey">
                <el-input
                  v-model="serveForm.searchKey"
                  clearable
                  data-tid="proSearchKeyInput"
                  placeholder="产品名称/产品编号"
                  @clear="clearQuery"
                ></el-input>
              </el-form-item>
              <el-form-item class="flexBox-item" label="产品分类:" prop="`classifyCode`">
                <!-- 选择"产品分类级联-->
                <el-cascader
                  v-model="serveForm.classifyCode"
                  placeholder="请选择产品分类"
                  :props="productProps"
                  clearable
                  data-tid="proClassifyCodeChangeSelect"
                  @change="productPropsChange"
                ></el-cascader>
              </el-form-item>
              <el-form-item class="flexBox-item" label="产品城市:" prop="cityCode">
                <el-select
                  v-model="serveForm.cityCode"
                  clearable
                  data-tid="proCityChangeSelect"
                  placeholder="请选择"
                  @change="cityChange"
                >
                  <el-option
                    v-for="itemChild in productCity"
                    :key="itemChild.value"
                    :label="itemChild.value"
                    :value="itemChild.key"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="单价范围:" class="flexBox-item" prop="price">
                <tow-input ref="serveTwoInputRefs" unit="" />
              </el-form-item>
              <div class="flexBox-item">
                <el-button
                  type="primary"
                  size="small"
                  data-tid="proSearchProductTabClick"
                  @click="searchService"
                  >搜索</el-button
                >
                <el-button type="info" size="small" data-tid="proResetService" @click="resetService"
                  >重置</el-button
                >
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
              <el-form-item class="flexBox-item" label="综合搜索:" prop="searchKey">
                <el-input
                  v-model="resourceForm.searchKey"
                  clearable
                  data-tid="searchKeyService"
                  placeholder="客户名称/商机编号"
                ></el-input>
              </el-form-item>
              <el-form-item class="flexBox-item" label="产品分类:" prop="parentClassifyCode">
                <el-cascader
                  v-model="resourceForm.parentClassifyCode"
                  placeholder="请选择产品分类"
                  :props="productProps"
                  clearable
                  data-tid="resourceParentClassifyCodeChange"
                  @change="productPropsChange"
                ></el-cascader>
              </el-form-item>
              <el-form-item label="单价范围:" class="flexBox-item" prop="price">
                <tow-input ref="resourceTwoInputRefs" unit="" />
              </el-form-item>
              <div class="flexBox-item">
                <el-button
                  type="primary"
                  size="small"
                  data-tid="resourceSearchService"
                  @click="searchService"
                  >搜索</el-button
                >
                <el-button
                  type="info"
                  size="small"
                  data-tid="resourceResetService"
                  @click="resetService"
                  >重置</el-button
                >
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
              <el-form-item class="flexBox-item" label="综合搜索:" prop="searchKey">
                <el-input
                  v-model="dealForm.searchKey"
                  data-tid="dealInput"
                  clearable
                  placeholder="客户名称/商机编号"
                ></el-input>
              </el-form-item>
              <el-form-item class="flexBox-item" label="产品分类:" prop="classifyCode">
                <el-cascader
                  v-model="dealForm.classifyCode"
                  placeholder="请选择产品分类"
                  :props="productProps"
                  clearable
                  data-tid="dealClassifyCode"
                  @change="productPropsChange"
                ></el-cascader>
              </el-form-item>
              <el-form-item label="单价范围:" class="flexBox-item" prop="price">
                <tow-input ref="dealTwoInputRefs" unit="" />
              </el-form-item>
              <div class="flexBox-item">
                <el-button
                  type="primary"
                  size="small"
                  data-tid="searchTabClick"
                  @click="searchService"
                  >搜索</el-button
                >
                <el-button
                  type="info"
                  size="small"
                  data-tid="dealResetService"
                  @click="resetService"
                  >重置</el-button
                >
              </div>
            </div>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      <div v-if="activeName == tabType">
        <div v-show="serviceAlreadyTableData != null" class="choose-product-alreadyTable">
          <div class="choose-product-alreadyTable-box">
            <span class="choose-product-alreadyTable-box-title">已选产品</span>
            <div class="choose-product-alreadyTable-box-delAll" data-tid="delAll" @click="delAll">
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
                  data-tid="remove"
                  @click="remove(scope.row, scope.$index)"
                  >移除</span
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <!-- 产品表格 -->
      <el-table
        v-loading="loading"
        :data="productTableInfo"
        stripe
        style="width: 1160px"
        max-height="600px"
      >
        <el-table-column slot="empty">
          <svg-icon key="item-warp" type="nodata" icon="icon-icon_nodata" />
        </el-table-column>
        <el-table-column label="产品编号" width="160">
          <template slot-scope="scope">
            <show-tooltip
              :text="scope.row.productNo || scope.row.id || '-'"
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
        <el-table-column label="产品分类" width="200">
          <template slot-scope="scope">
            <show-tooltip
              :text="scope.row.className || '-'"
              :width="160"
              style="color: #222"
            ></show-tooltip>
          </template>
        </el-table-column>
        <el-table-column v-if="activeName != 'deal'" label="产品城市" prop="areaCode">
          <template slot-scope="scope">
            <show-tooltip
              :text="scope.row.classCode || '-'"
              :width="160"
              style="color: #222"
            ></show-tooltip>
          </template>
        </el-table-column>
        <el-table-column v-if="activeName == 'deal'" label="资源信息">
          <template slot-scope="scope">
            <div v-for="(item, i) in scope.row.attr" :key="i">
              <show-tooltip :text="item || '-'" :width="80" style="color: #222"></show-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="right" header-align="right" label="产品单价" width="120">
          <template slot-scope="scope">
            <show-tooltip
              :text="'￥' + scope.row.referencePrice || scope.row.platformPrice || '-'"
              :width="80"
              style="color: #222"
            ></show-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="105">
          <template slot-scope="scope">
            <span v-if="scope.row.state == 0" class="sold-out">下架 </span>
            <span v-else class="has-been-on">已上架 </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="105">
          <template slot-scope="scope">
            <span
              v-if="!scope.row.isClick"
              style="color: #436eee; cursor: pointer"
              data-tid="chooseBusinessItem"
              @click="chooseBusinessItem(scope.row)"
              >选择</span
            >
            <span v-else style="color: #666">选择</span>
          </template>
        </el-table-column>
      </el-table>
      <div v-if="showPaginationFlag" class="pagination">
        <el-pagination
          :total="total"
          :current-page="pageData.pageNum"
          background
          :page-sizes="[10, 50, 100, 150]"
          layout="total, prev, pager, next"
          @size-change="sizeChange"
          @current-change="currentChange"
        ></el-pagination>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" data-tid="cancelButton" @click="chooseProductDialog = false"
          >取 消</el-button
        >
        <el-button size="small" type="primary" data-tid="confirmProduct" @click="confirmProduct"
          >确 定</el-button
        >
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
