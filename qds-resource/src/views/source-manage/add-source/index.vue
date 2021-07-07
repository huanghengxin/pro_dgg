<template>
  <div class="add-source-page">
    <div>
      <div class="left-title">
        <span>录入资源</span>
      </div>
      <edit-source
        ref="addSourceRef"
        key="add-resource"
        :type="type"
        @biz="setSourceList"
        @reset="reset"
        @no-biz="update"
      ></edit-source>
      <el-button
        :style="{ marginLeft: '116px' }"
        :loading="saveButtonLoading"
        size="small"
        type="primary"
        data-tid="addDetailSubmitV"
        @click="submitV"
        >保存</el-button
      >
    </div>
    <div v-show="isTabs" class="right-source">
      <div>
        <p class="right-title">平台与企大顺客源</p>
        <span>共查询到 {{ tableDataPage }} 条数据</span>
      </div>
      <div v-loading="loading">
        <template v-if="sourceList.length === 0">
          <svg-icon key="item-warp" type="nodata" icon="icon-icon_nodata" />
        </template>
        <div
          v-for="(item, index) in sourceList"
          v-else
          :key="index + 'sourceList'"
          class="tabs-card"
        >
          <div
            v-for="(i, sub) in constantsSource"
            :key="sub + 'constantsSource'"
            class="tabs-card-row"
          >
            <div class="tabs-card-title">{{ i.name }}</div>
            <div v-if="i.code === 'requireName'" class="tabs-card-content">
              {{ getContent(item) }}
            </div>
            <div v-else-if="i.code === 'bizCityName'" class="tabs-card-content">
              {{ removeRepetitionArea(item) }}
            </div>
            <div v-else class="tabs-card-content" v-html="item[i.code]"></div>
          </div>
          <el-button
            v-if="item.curSearName !== '暂无数据' && item.type !== 'allocationing'"
            size="small"
            type="primary"
            @click="handleSource(item)"
            >{{ item.buttonName }}</el-button
          >
          <span v-if="item.type === 'allocationing'" class="tabs-card-tips"
            >自动分配队列中，无法进行人工分配</span
          >
        </div>
        <el-pagination
          v-if="tableDataPage != 0"
          small
          :page-size="3"
          :pager-count="5"
          background
          layout="prev, pager, next"
          :total="tableDataPage"
          @current-change="handleCurrentChange"
        >
        </el-pagination>
      </div>
    </div>
    <el-dialog
      title="编辑客源"
      width="680px"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      custom-class="edit-source-dialog"
    >
      <edit-source
        ref="editSourceRef"
        key="edit-resource"
        type="handle_back"
        @update="update"
        @no-biz="update"
        @close="dialogVisible = false"
      ></edit-source>
    </el-dialog>
  </div>
</template>
<script>
import './index.scss';
import addSource from './index.js';
export default addSource;
</script>
