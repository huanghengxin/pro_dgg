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
          <el-button
            type="primary"
            :disabled="!edit"
            data-tid="saveMerchantRule"
            @click="saveMerchantRule"
            >保存</el-button
          >
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
        <el-form ref="getRuleListRef" :model="getRuleList">
          <el-table :data="getRuleList.data1" class="business__table">
            <template slot="empty">
              <svg-icon key="item-warp" type="nodata" icon="icon-icon_nodata" />
            </template>
            <el-table-column label="规则名称" min-width="120">
              <template slot-scope="scope">
                <show-tooltip
                  v-if="scope.row.name"
                  :text="scope.row.name"
                  :width="102"
                ></show-tooltip>
              </template>
            </el-table-column>
            <el-table-column label="规则内容" min-width="400">
              <template slot-scope="scope">
                <div class="max">
                  <show-tooltip
                    v-if="scope.row.description"
                    :text="scope.row.description"
                    :width="380"
                    :tooltip-line-clamp="2"
                  ></show-tooltip>
                </div>
              </template>
            </el-table-column>
            <el-table-column class-name="list-input" prop="val1" label="值" min-width="310">
              <template slot-scope="scope">
                <!-- handleRuleVal1 -->
                <el-form-item
                  :prop="'data1.' + scope.$index + '.val1'"
                  :rules="handleRuleVal1(scope.row)"
                >
                  <el-input
                    v-model="scope.row.val1"
                    :placeholder="scope.row.val1"
                    type="text"
                    :data-tid="'val1Input' + scope.$index"
                    class="val1"
                  ></el-input>
                </el-form-item>
                <el-form-item
                  :prop="'data1.' + scope.$index + '.val2'"
                  :rules="handleRuleVal2(scope.row)"
                >
                  <el-input
                    v-model="scope.row.val2"
                    :placeholder="scope.row.val2"
                    type="text"
                    class="val1"
                    :data-tid="'val2Input' + scope.$index"
                  ></el-input>
                </el-form-item>
                <el-form-item
                  :prop="'data1.' + scope.$index + '.val3'"
                  :rules="handleRuleVal3(scope.row)"
                >
                  <el-input
                    v-model="scope.row.val3"
                    :placeholder="scope.row.val3"
                    type="text"
                    :data-tid="'val3Input' + scope.$index"
                    class="val1"
                  ></el-input>
                </el-form-item>
                <el-form-item
                  :prop="'data1.' + scope.$index + '.val4'"
                  :rules="handleRuleVal4(scope.row)"
                >
                  <el-input
                    v-model="scope.row.val4"
                    :placeholder="scope.row.val4"
                    type="text"
                    class="val1"
                    :data-tid="'val4Input' + scope.$index"
                  ></el-input>
                </el-form-item>
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
