<template>
  <div class="list-search">
    <!-- 头部搜索框和录入商机按钮 -->
    <div class="top-part">
      <search-button
        :value="searchInputValue[activeTabField]"
        placeholder="请输入姓名/联系号码/商机编号查询"
        data-tid="searchHandleInput"
        @on-blur="handleInput"
        @search="handleSearch"
        @clear="clearInputHandle"
      ></search-button>
      <router-link to="/add-business">
        <div class="add-business">
          <i class="el-icon-edit add-business-icon"></i
          ><span class="add-business-name">录入商机</span>
        </div>
      </router-link>
    </div>
    <!-- tab页切换 -->
    <div class="tab-warp">
      <div class="warp-tabs">
        <div
          v-for="(item, index) in tabList"
          :key="item.code"
          :class="{
            'warp-item': true,
            'warp-item_active': tabActive === index,
          }"
        >
          <span
            class="warp-item_name"
            data-tid="searchTabClick"
            @click="tabHandleClick(index, item.code)"
            >{{ item.name }}</span
          >
          <el-tooltip
            :open-delay="400"
            effect="dark"
            :content="item.tooltip"
            placement="top-start"
            popper-class="show-tooltip"
          >
            <i class="iconfont-qds-crm icon-question"></i>
          </el-tooltip>
        </div>
      </div>
      <div class="warp-status" @click="dynamicBusiness">
        <p>
          新增&nbsp;<span class="warp-status_number">{{ stateNumber }}</span
          >&nbsp;条商机动态，去查看
        </p>
        <i class="el-icon-d-arrow-right arrow_right"></i>
      </div>
    </div>
    <!-- 筛选 -->
    <div class="filter-list">
      <transition name="fade">
        <div v-if="Object.keys(isShowFilterBar).length" class="list-checked">
          <span class="list-checked_name">已选择</span>
          <div class="list-checked_tag">
            <template v-for="(item, activeK) in isShowFilterBar">
              <el-tag
                :key="activeK"
                size="small"
                closable
                :disable-transitions="true"
                class="checked-tag_item"
                data-tid="searchHandleClose"
                @close="handleClose(activeK)"
              >
                {{ item.name }}
              </el-tag>
            </template>
          </div>
          <div
            class="list-checked_clear"
            data-tid="searchClearClick"
            @click="clearConditionHandleClick"
          >
            <span>清空条件</span>
          </div>
        </div>
      </transition>
      <transition-group v-loading="loading" class="filter-warp" name="slide-fade" tag="div">
        <template v-if="showNode">
          <div
            v-for="(value, key) in getFilterType"
            :key="key"
            data-tid="searchCilterClick"
            @click="filterListHandleClick"
          >
            <div v-if="Array.isArray(value)" class="list-warp">
              <div class="list-warp_name">{{ key | filterName }}</div>
              <div class="list-warp_content">
                <template v-for="(child, index) in getFilterType[key]">
                  <div :key="child.code" class="item-warp">
                    <div
                      :data-index="index"
                      :data-code="key"
                      :data-item_name="child.text"
                      :data-item_code="child.ext1"
                      :class="{
                        'filter-item': true,
                        'filter-item_active':
                          fieldActive[activeTabField] && fieldActive[activeTabField][key] === index,
                      }"
                    >
                      {{ child.text }}
                    </div>
                    <el-date-picker
                      v-if="['signTime', 'getTime'].includes(key) && index === 4"
                      v-show="fieldActive[activeTabField] && fieldActive[activeTabField][key] === 4"
                      v-model="userDefinedTime[activeTabField][key]"
                      size="small"
                      type="datetimerange"
                      range-separator="-"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      data-tid="searchChangeHandle"
                      @change="changeHandle(key)"
                    >
                    </el-date-picker>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </template>
      </transition-group>
      <div class="list-more">
        <span class="list-more_content" @click="showMoreHandleClick"
          ><span>{{ showMoreFilterField[activeTabField] ? '收起' : '展开' }}</span
          ><i
            :class="[
              'el-icon-d-arrow-right',
              'arrow_right',
              showMoreFilterField[activeTabField] ? 'icon-up' : 'icon-down',
            ]"
          ></i
        ></span>
      </div>
    </div>
  </div>
</template>

<script>
import listSearch from './index.js';
export default listSearch;
</script>
