<!--平台规则设置  -->
<template>
  <div
    ref="platform"
    v-loading="loading"
    class="platform"
    :style="{ height: platformHeight + 'px' }"
  >
    <div class="fixation">
      <div class="switchboard">
        <span class="switchboard__txt1">商机流转规则当前状态：</span>
        <div class="switchboard__content">
          <span v-show="switchboardStatus === 1" class="switchboard__txt3">开启</span>
          <span v-show="switchboardStatus === 2" class="switchboard__txt4">关闭</span>
          <el-switch
            :value="switchboardStatus"
            :active-value="1"
            :inactive-value="2"
            active-color="#4974F5"
            inactive-color="#B9B9B9"
            data-tid="changeSwitchboard"
            @change="changeSwitchboard"
          >
          </el-switch>
          <span v-show="switchboardStatus === 2" class="switchboard__txt4">
            （关闭时间：{{ start }} 至 {{ end }}）</span
          >
          <span class="switchboard__txt2"> （关闭后个人库商机/线索将不执行掉库） </span>
        </div>
      </div>
      <!-- 说明 -->
      <div class="explain">
        <div class="explain__title">
          <div class="explain__title-txt1">规则说明</div>
          <el-button
            type="primary"
            data-tid="savePlatformRule"
            :disabled="!edit"
            @click="savePlatformRule"
            >保存</el-button
          >
        </div>
        <div class="explain__text">
          <div class="explain__text-1">
            每个【】对应一个输入框，数值的请直接输入数字，时间单位的请填写单位对应的编码，商机库的请填写库对应的编码。
          </div>
          <div class="explain__text-2">
            时间单位：<span v-for="item in unitCode" :key="item.id"
              >{{ item.name }}{{ item.code }} <i v-show="item.code !== 'U_N_DAYS'">、</i></span
            >
            <span>。</span>
          </div>
          <div class="explain__text-2">
            商机库：<span v-for="item in libraryCode" :key="item.id"
              >{{ item.name }}{{ item.code }} <i v-show="item.code !== 'GROUP'">、</i></span
            >
            <span>。</span>
          </div>
          <div class="explain__text-1">
            以下规则将针对平台入驻的所有商户执行，数值都为最大值，各商户可在该数值下进行调整。流转的库只可由平台设置，商户无权限进行设置。
          </div>
        </div>
      </div>
    </div>
    <div class="content">
      <div class="business">
        <div class="business__title">商机流转规则</div>
        <el-form ref="getRuleListRef" :model="getRuleList" :rules="rules">
          <el-table :data="getRuleList.data1" class="business__table">
            <template slot="empty">
              <svg-icon key="item-warp" type="nodata" icon="icon-icon_nodata" />
            </template>
            <el-table-column label="规则名称" min-width="92">
              <template slot-scope="scope">
                <show-tooltip
                  v-if="scope.row.name"
                  :text="scope.row.name"
                  :width="82"
                ></show-tooltip>
              </template>
            </el-table-column>
            <el-table-column label="规则内容" min-width="362">
              <template slot-scope="scope">
                <show-tooltip
                  v-if="scope.row.description"
                  :text="scope.row.description"
                  :width="362"
                  :tooltip-line-clamp="2"
                ></show-tooltip>
              </template>
            </el-table-column>
            <el-table-column prop="val1" label="值" min-width="430" class-name="list-input">
              <template slot-scope="scope">
                <el-form-item :prop="'data1.' + scope.$index + '.val1'" :rules="rules.val1">
                  <el-input
                    v-model="scope.row.val1"
                    type="text"
                    class="val"
                    :disabled="!edit"
                  ></el-input>
                </el-form-item>
                <el-form-item :prop="'data1.' + scope.$index + '.val2'" :rules="rules.val2">
                  <el-input
                    v-model="scope.row.val2"
                    type="text"
                    class="val"
                    :disabled="!edit"
                  ></el-input>
                </el-form-item>
                <el-form-item :prop="'data1.' + scope.$index + '.val3'" :rules="rules.val3">
                  <el-input
                    v-model="scope.row.val3"
                    type="text"
                    class="val"
                    :disabled="!edit"
                  ></el-input>
                </el-form-item>
                <el-form-item :prop="'data1.' + scope.$index + '.val4'" :rules="rules.val4">
                  <el-input
                    v-model="scope.row.val4"
                    type="text"
                    class="val"
                    :disabled="!edit"
                  ></el-input>
                </el-form-item>
                <el-form-item prop="val5">
                  <el-input
                    v-model="scope.row.val5"
                    type="text"
                    class="val"
                    :disabled="!edit"
                  ></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="当前状态" min-width="80">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.status"
                  :disabled="scope.row.id === '' || !edit"
                  :active-value="1"
                  :inactive-value="2"
                  active-color="#4974F5"
                  inactive-color="#B9B9B9"
                  :data-tid="'changeSwitch' + scope.$index"
                  @change="changeSwitch(scope.$index, scope.row)"
                >
                </el-switch>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
      </div>
      <div class="staff">
        <div class="staff__title">规划师相关数量上限设置</div>
        <el-form ref="getStaffListRef" :model="getStaffList" :rules="rules">
          <el-table :data="getStaffList.data2" class="staff__table">
            <template slot="empty">
              <svg-icon key="item-warp" type="nodata" icon="icon-icon_nodata" />
            </template>
            <el-table-column label="规则名称" min-width="92">
              <template slot-scope="scope">
                <show-tooltip
                  v-if="scope.row.name"
                  :text="scope.row.name"
                  :width="82"
                ></show-tooltip>
              </template>
            </el-table-column>
            <el-table-column label="规则内容" min-width="362">
              <template slot-scope="scope">
                <show-tooltip
                  v-if="scope.row.description"
                  :text="scope.row.description"
                  :width="352"
                  :tooltip-line-clamp="2"
                ></show-tooltip>
              </template>
            </el-table-column>
            <el-table-column class-name="list-input" prop="val1" label="值" min-width="430">
              <template slot-scope="scope">
                <el-form-item :prop="'data2.' + scope.$index + '.val1'" :rules="rules.val1">
                  <el-input
                    v-model="scope.row.val1"
                    type="text"
                    class="val"
                    data-tid="val1Input"
                    :disabled="!edit"
                  ></el-input>
                </el-form-item>
                <el-form-item :prop="'data2.' + scope.$index + '.val2'" :rules="rules.val2">
                  <el-input
                    v-model="scope.row.val2"
                    type="text"
                    class="val"
                    data-tid="val2Input"
                    :disabled="!edit"
                  ></el-input>
                </el-form-item>
                <el-form-item :prop="'data2.' + scope.$index + '.val3'" :rules="rules.val3">
                  <el-input
                    v-model="scope.row.val3"
                    type="text"
                    class="val"
                    data-tid="val3Input"
                    :disabled="!edit"
                  ></el-input>
                </el-form-item>
                <el-form-item :prop="'data2.' + scope.$index + '.val4'" :rules="rules.val4">
                  <el-input
                    v-model="scope.row.val4"
                    type="text"
                    class="val"
                    data-tid="val4Input"
                    :disabled="!edit"
                  ></el-input>
                </el-form-item>
                <el-form-item prop="val5">
                  <el-input
                    v-model="scope.row.val5"
                    type="text"
                    class="val"
                    data-tid="val5Input"
                    :disabled="!edit"
                  ></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column min-width="80"></el-table-column>
          </el-table>
        </el-form>
      </div>
    </div>

    <close-all-rule-dialog
      ref="closeAllRuleDialog"
      :switchboard-status="switchboardStatus"
      data-tid="platFormOnSubmitHandle"
      @on-submit="onSubmitHandle"
    />
  </div>
</template>

<script>
import platform from './platform';
export default platform;
import './index.scss';
</script>
