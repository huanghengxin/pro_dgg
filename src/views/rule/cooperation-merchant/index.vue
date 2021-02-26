<!--商户规则设置  -->
<template>
  <div
    ref="cooperation"
    v-loading="loading"
    class="cooperation"
    :style="{ height: cooperationHeight + 'px' }"
  >
    <div class="fixation">
      <div class="explain">
        <div class="explain__title">
          <div class="explain__title-txt1">规则说明</div>
        </div>
        <div class="explain__text">
          <div class="explain__text-1">
            每个【】对应一个输入框，数值的请直接输入数字，时间单位的请填写单位对应的编码。
          </div>
          <div class="explain__text-2">
            时间单位：
            <span v-for="item in unitCode" :key="item.id"
              >{{ item.name }}{{ item.code }} <i v-show="item.code !== 'U_N_DAYS'">、</i></span
            >
            <span>。</span>
          </div>
        </div>
      </div>
    </div>
    <div class="content">
      <div class="business">
        <div class="business__title">合作联盟规则</div>
        <el-form>
          <el-table :data="libraryRule" class="business__table">
            <template slot="empty">
              <svg-icon key="item-warp" type="nodata" icon="icon-icon_nodata" />
            </template>
            <el-table-column label="规则名称" min-width="110">
              <template slot-scope="scope">
                <show-tooltip
                  v-if="scope.row.name"
                  :text="scope.row.name"
                  :width="92"
                ></show-tooltip>
              </template>
            </el-table-column>
            <el-table-column label="规则内容" min-width="820">
              <template slot-scope="scope">
                <div class="max">
                  <show-tooltip
                    v-if="scope.row.description"
                    :text="scope.row.description"
                    :width="800"
                    :tooltip-line-clamp="2"
                  ></show-tooltip>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import cooperation from './cooperation';
export default cooperation;
import './index.scss';
</script>
