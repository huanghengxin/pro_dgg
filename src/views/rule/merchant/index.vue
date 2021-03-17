<!--商户规则设置  -->
<template>
  <div
    ref="merchant"
    v-loading="loading"
    class="merchant"
    :style="{ height: merchantHeight + 'px' }"
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
            每个【】对应一个输入框，数值的请直接输入数字，时间单位的请填写单位对应的编码，商机库的请填写库对应的编码。
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
        <div class="business__title">商机流转规则</div>
        <el-form ref="getRuleListRef" :model="getRuleList">
          <el-table :data="getRuleList.data1" class="business__table">
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
            <el-table-column label="规则内容" min-width="430">
              <template slot-scope="scope">
                <div class="max">
                  <show-tooltip
                    v-if="scope.row.description"
                    :text="scope.row.description"
                    :width="420"
                    :tooltip-line-clamp="2"
                  ></show-tooltip>
                  <!--LZ_PUB_BATCH_CLUE_RETRIEVE 删-->
                  <el-tag
                    v-if="
                      scope.row.max &&
                      scope.row.ruleCode !== 'LZ_PUB_INV' &&
                      scope.row.ruleCode !== 'LZ_PUB_HID' &&
                      scope.row.ruleCode !== 'LZ_PUB_SE' &&
                      scope.row.ruleCode !== 'RULE_LZ_PUBLIC_TRANSFER_MOVE' &&
                      scope.row.ruleCode !== 'RULE_DELAY' &&
                      scope.row.ruleCode !== 'LZ_PRE_DROP_MSG' &&
                      scope.row.ruleCode !== 'LZ_CA_INT' &&
                      scope.row.ruleCode !== 'LZ_PUB_BATCH_CLUE_RETRIEVE'
                    "
                    type="info"
                    effect="dark"
                    >最大值 {{ scope.row.max }} {{ scope.row.timeCode | getTimeName }}</el-tag
                  >
                </div>
              </template>
            </el-table-column>
            <el-table-column class-name="list-input" prop="val1" label="值" min-width="280">
              <template slot-scope="scope">
                <el-form-item
                  :prop="'data1.' + scope.$index + '.val1'"
                  :rules="handleRule(scope.row)"
                >
                  <el-input
                    v-if="
                      scope.row.ruleCode === 'LZ_PUB_INV' ||
                      scope.row.ruleCode === 'LZ_PUB_HID' ||
                      scope.row.ruleCode === 'LZ_PUB_SE' ||
                      scope.row.ruleCode === 'RULE_LZ_PUBLIC_TRANSFER_MOVE' ||
                      scope.row.ruleCode === 'RULE_DELAY' ||
                      scope.row.ruleCode === 'LZ_PRE_DROP_MSG' ||
                      scope.row.ruleCode === 'LZ_CA_INT' ||
                      scope.row.ruleCode === 'LZ_PUB_BATCH_CLUE_RETRIEVE'
                    "
                    disabled
                    type="text"
                    class="val1"
                  ></el-input>
                  <el-input
                    v-else
                    v-model="scope.row.val1"
                    :placeholder="scope.row.max"
                    :disabled="!scope.row.max || !edit || scope.row.status === 2"
                    type="text"
                    :data-tid="'val1Input' + scope.$index"
                    class="val1"
                  ></el-input>
                </el-form-item>
                <el-form-item>
                  <el-input
                    v-if="scope.row.ruleCode === 'LZ_PUB_HID' || scope.row.ruleCode === 'LZ_PUB_SE'"
                    disabled
                    type="text"
                    class="val2"
                  ></el-input>
                  <el-input
                    v-else
                    v-model="scope.row.val2"
                    disabled
                    type="text"
                    class="val2"
                    :data-tid="'val2Input' + scope.$index"
                  ></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="当前状态" min-width="110">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.status"
                  disabled
                  :active-value="1"
                  :inactive-value="2"
                  active-color="#4974F5"
                  inactive-color="#B9B9B9"
                  :data-tid="'status' + scope.$index"
                >
                </el-switch>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
      </div>
      <div class="staff">
        <div class="staff__title">规划师相关数量默认设置</div>
        <el-form ref="getStaffListRef" :model="getStaffList">
          <el-table :data="getStaffList.data2" class="staff__table">
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
            <el-table-column label="规则内容" min-width="430">
              <template slot-scope="scope">
                <div class="max">
                  <show-tooltip
                    v-if="scope.row.description"
                    :text="scope.row.description"
                    :width="420"
                    :tooltip-line-clamp="2"
                  ></show-tooltip>
                  <el-tag v-if="scope.row.max" type="info" effect="dark"
                    >最大值{{ scope.row.max }}</el-tag
                  >
                </div>
              </template>
            </el-table-column>
            <el-table-column class-name="list-input" prop="val1" label="值" min-width="280">
              <template slot-scope="scope">
                <el-form-item
                  :prop="'data2.' + scope.$index + '.val1'"
                  :rules="handleRule(scope.row)"
                >
                  <el-input
                    v-model="scope.row.val1"
                    type="text"
                    :placeholder="scope.row.max"
                    :disabled="!scope.row.max || !edit"
                    class="val1"
                    :data-tid="'rule1Input' + scope.$index"
                  ></el-input>
                </el-form-item>
                <el-form-item>
                  <el-input
                    v-model="scope.row.val2"
                    disabled
                    type="text"
                    class="val2"
                    :data-tid="'rule2Input' + scope.$index"
                  ></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column min-width="110"> </el-table-column>
          </el-table>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import merchant from './merchant';
export default merchant;
import './index.scss';
</script>
