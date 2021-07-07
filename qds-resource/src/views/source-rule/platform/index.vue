<template>
  <div class="platform-rule-page">
    <div class="platform-rule-explain">
      <div class="explain">
        <div class="explain__title">
          <div class="explain__title-txt1">规则说明</div>
          <el-button
            size="small"
            type="primary"
            data-tid="savePlatformRule"
            :disabled="loading"
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
          </div>
          <!-- <div class="explain__text-2">
            商机库：<span v-for="item in libraryCode" :key="item.id"
              >{{ item.name }}{{ item.code }} <i v-show="item.code !== 'GROUP'">、</i></span
            >
          </div> -->
          <div class="explain__text-1">
            以下规则将针对平台入驻的所有商户执行，数值都为最大值，各商户可在该数值下进行调整。流转的库只可由平台设置，商户无权限进行设置。
          </div>
        </div>
      </div>
    </div>
    <div class="platform-rule-content list-base-ui">
      <el-form ref="platformRef" :model="getRuleList" :rules="rules">
        <el-table v-loading="loading" :data="getRuleList.data1" style="width: 100%">
          <template slot="empty">
            <svg-icon key="item-warp" type="nodata" icon="icon-icon_nodata" />
          </template>
          <el-table-column prop="ruleName" label="规则名称" min-width="80"> </el-table-column>
          <el-table-column prop="description" label="规则内容" min-width="300">
            <template slot-scope="scope">
              <show-tooltip
                v-if="dictionaryMap[scope.row.ruleCode].description"
                :text="dictionaryMap[scope.row.ruleCode].description"
                :width="340"
                :tooltip-line-clamp="2"
              ></show-tooltip>
            </template>
          </el-table-column>
          <el-table-column class-name="main-value" prop="valueOne" label="值" min-width="380">
            <template slot-scope="scope">
              <el-form-item :prop="'data1.' + scope.$index + '.valueOne'" :rules="rules.valueOne">
                <el-input v-model="scope.row.valueOne" data-tid="val1Input"></el-input>
              </el-form-item>
              <el-form-item
                :prop="'data1.' + scope.$index + '.valueTwo'"
                :rules="
                  scope.row.ruleCode ===
                  'DISTRIBUTION_CENTER_RULE_SET_UP_MODE_CUSTOMER_RULE_PLA_INTERVAL'
                    ? null
                    : rules.valueTwo
                "
              >
                <el-input
                  v-model="scope.row.valueTwo"
                  data-tid="val2Input"
                  :disabled="
                    !showListMap[scope.row.ruleCode].valueTwo &&
                    scope.row.ruleCode ===
                      'DISTRIBUTION_CENTER_RULE_SET_UP_MODE_CUSTOMER_RULE_PLA_INTERVAL'
                  "
                ></el-input>
              </el-form-item>
              <el-form-item
                :prop="'data1.' + scope.$index + '.valueThree'"
                :rules="
                  scope.row.ruleCode ===
                  'DISTRIBUTION_CENTER_RULE_SET_UP_MODE_CUSTOMER_RULE_PLA_INTERVAL'
                    ? null
                    : rules.valueTwo
                "
              >
                <el-input
                  v-model="scope.row.valueThree"
                  data-tid="val3Input"
                  :disabled="
                    !showListMap[scope.row.ruleCode].valueThree &&
                    scope.row.ruleCode ===
                      'DISTRIBUTION_CENTER_RULE_SET_UP_MODE_CUSTOMER_RULE_PLA_INTERVAL'
                  "
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-input disabled></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="当前状态" min-width="76">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.ruleStatus"
                :active-value="1"
                :inactive-value="0"
                active-color="#4974F5"
                inactive-color="#BFBFBF"
              >
              </el-switch>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
    </div>
  </div>
</template>
<script>
import './index.scss';
import SvgIcon from 'components/svg-icon';
import ShowTooltip from 'components/show-tooltip';
import { get_biz_distribution_type, save_resource_distribution_rules } from 'api/source-manage';
import { queryTreeBook } from 'api/common';
export default {
  name: 'PlatformRule',
  components: {
    SvgIcon,
    ShowTooltip,
  },
  data() {
    const checkInput = (rule, value, callback) => {
      value = value?.trim();
      const reg = /^[1-9][0-9]{0,3}$/;
      if (!reg.test(value)) {
        callback('数值≤9999正整数');
      } else {
        callback();
      }
    };
    return {
      unitCode: [], //时间单位
      // libraryCode: [], //商机库
      loading: false,
      showList: [], //回显
      dictionaryMap: {},
      showListMap: {},
      rules: {
        valueOne: [{ validator: checkInput, trigger: 'change' }],
        valueTwo: [{ validator: checkInput, trigger: 'change' }],
        valueThree: [{ validator: checkInput, trigger: 'change' }],
      },
    };
  },
  computed: {
    getLibraryRule() {
      return (
        this.showList?.reduce((acc, cur) => {
          acc[cur.ruleCode] = cur;
          return acc;
        }, {}) || {}
      );
    },
    /**
     * @description 规则列表数据
     */
    getRuleList() {
      const arr =
        this.showList?.map((item) => {
          const {
            ruleStatus,
            valueOne = '',
            valueTwo = '',
            valueThree = '',
            valueFive = '',
            val5 = '',
            id = '',
          } = this.getLibraryRule[item.ruleCode] || {};
          return {
            ruleStatus,
            valueOne,
            valueTwo,
            valueThree,
            valueFive,
            val5,
            id,
            ...item,
          };
        }) || [];
      return {
        data1: arr.sort((a, b) => {
          return parseInt(a.valueFive) - parseInt(b.valueFive);
        }),
      };
    },
  },
  created() {
    this.getPlatformRule();
    this.getDictionary();
  },
  methods: {
    getPlatformRule() {
      this.loading = true;
      get_biz_distribution_type({
        code: 'DISTRIBUTION_CENTER_RULE_SET_UP_MODE_CUSTOMER_RULE_PLA',
      })
        .then((res) => {
          if (res.code === 200) {
            this.showList = res.data.show || [];
            const dictionary = res.data.dictionary;
            const showList = res.data.show;
            let showListMap = {},
              dictionaryMap = {};
            for (let i = 0; i < showList.length; i++) {
              //初始化数据
              if (!showList[i]) {
                showList[i] = {
                  ruleCode: dictionary[i].code,
                  ruleDesc: dictionary[i].name,
                  ruleName: dictionary[i].name,
                  ruleStatus: 0,
                  valueOne: '',
                  valueTwo: '',
                  valueThree: '',
                  valueFive: '',
                };
                showListMap[showList[i].ruleCode] = showList[i];
              } else {
                showListMap[showList[i].ruleCode] = showList[i];
                dictionaryMap[dictionary[i].code] = dictionary[i];
              }
            }
            this.showListMap = showListMap;
            this.dictionaryMap = dictionaryMap;
          } else {
            this.$message.warning(res.message);
          }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    /**
     * @description 数据字典接口
     * @returns {Object} 返回数据
     */
    async getDictionary() {
      this.loading = true;
      try {
        const param = {
          code: 'rule_code',
        };
        const result = await queryTreeBook(param);
        if (result.code !== 200) {
          this.loading = false;
          this.$message.warning(result.message);
          return;
        }
        if (result.code === 200) {
          this.loading = false;
          // 数据字典单位
          this.unitCode = result.data.rule_date_code || [];
          // 数据字典库编码
          // this.libraryCode = result.data.rule_biz_db_code || [];
        }
      } catch (error) {
        this.loading = false;
      }
    },
    /**
     * @description 保存
     */
    savePlatformRule() {
      this.$refs.platformRef.validate((valid) => {
        if (valid) {
          this.$messageBox
            .confirm('请确定保存规则, 是否继续?', '保存提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
            })
            .then(() => {
              this.loading = true;
              let params = [];
              this.getRuleList.data1.forEach((i, index) => {
                const obj = {};
                obj.ruleCode = i.ruleCode;
                obj.ruleName = i.ruleName;
                obj.ruleStatus = i.ruleStatus.toString();
                obj.ruleDesc = i.ruleName;
                obj.valueOne = i.valueOne;
                obj.valueTwo = i.valueTwo;
                obj.valueThree = i.valueThree;
                obj.valueFive = index;
                obj.id = i.id;
                params.push(obj);
              });
              save_resource_distribution_rules({ rules: params }).then((res) => {
                if (res.code === 200) {
                  this.$message.success(res.message);
                } else {
                  this.$message.warning(res.message);
                }
                this.loading = false;
                this.getPlatformRule();
              });
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          return;
        }
      });
    },
  },
};
</script>
