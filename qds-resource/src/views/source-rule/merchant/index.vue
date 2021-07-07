<template>
  <div class="merchant-rule-page">
    <div class="merchant-rule-explain">
      <div class="explain">
        <div class="explain__title">
          <div class="explain__title-txt1">规则说明</div>
        </div>
        <div class="explain__text">
          <div class="explain__text-1">
            每个【】对应一个输入框，数值的请直接输入数字，时间单位的请填写单位对应的编码，商机库的请填写库对应的编码。
          </div>
          <!-- <div class="explain__text-2">
            时间单位：<span v-for="item in unitCode" :key="item.id"
              >{{ item.name }}{{ item.code }} <i v-show="item.code !== 'U_N_DAYS'">、</i></span
            >
          </div> -->
        </div>
      </div>
    </div>
    <div class="merchant-rule-content list-base-ui">
      <el-table v-loading="loading" :data="showList" style="width: 100%">
        <template slot="empty">
          <svg-icon key="item-warp" type="nodata" icon="icon-icon_nodata" />
        </template>
        <el-table-column prop="ruleName" label="规则名称" min-width="80"> </el-table-column>
        <el-table-column prop="ruleText" label="规则内容" min-width="300">
          <template slot-scope="scope">
            <show-tooltip
              v-if="scope.row.description"
              :text="scope.row.description"
              :text-html="scope.row.textHtml"
              :width="340"
              :tooltip-line-clamp="2"
            ></show-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="值" class-name="main-value" min-width="280">
          <el-form>
            <el-form-item>
              <el-input disabled></el-input>
            </el-form-item>
            <el-form-item>
              <el-input disabled></el-input>
            </el-form-item>
            <el-form-item>
              <el-input disabled></el-input>
            </el-form-item>
          </el-form>
        </el-table-column>
        <el-table-column label="当前状态" min-width="76">
          <template slot-scope="scope">
            {{ scope.row.ruleStatus ? '启用' : '禁用' }}
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import './index.scss';
import SvgIcon from 'components/svg-icon';
import ShowTooltip from 'components/show-tooltip';
// import { queryTreeBook } from 'api/common';
import { get_biz_distribution_type } from 'api/source-manage';
export default {
  name: 'MerchantRule',
  components: {
    SvgIcon,
    ShowTooltip,
  },
  data() {
    return {
      // unitCode: [], //时间单位
      loading: false,
      showList: [], //回显
      // dictionaryMap: {},
      // showListMap: {},
    };
  },
  created() {
    // this.getDictionary();
    this.getPlatformRule();
  },
  methods: {
    getPlatformRule() {
      this.loading = true;
      get_biz_distribution_type({
        code: 'DISTRIBUTION_CENTER_RULE_SET_UP_MODE_CUSTOMER_RULE_PLA',
      })
        .then((res) => {
          const { code, data = {}, message } = res || {};
          if (code === 200) {
            this.showList =
              data.show.sort((a, b) => {
                return parseInt(a.valueFive) - parseInt(b.valueFive);
              }) || [];
            const dictionary = data.dictionary.reduce((acc, cur) => {
              acc[cur.code] = cur;
              return acc;
            }, {});
            const showList = this.showList;
            let // showListMap = {},
              // dictionaryMap = {},
              arr = ['valueOne', 'valueTwo', 'valueThree'],
              reg = /(【X】+)/g;
            for (let i = 0; i < showList.length; i++) {
              const show = showList[i];
              const showCode = show.ruleCode;
              //初始化数据
              if (!show) {
                const dic = data.dictionary[i];
                showList[i] = {
                  ruleCode: dic.code,
                  ruleDesc: dic.name,
                  ruleName: dic.name,
                  ruleStatus: 0,
                  valueOne: '',
                  valueTwo: '',
                  valueThree: '',
                  valueFive: '',
                  textHtml: '',
                };
                // showListMap[showCode] = show;
              } else {
                show.ruleDesc = dictionary[showCode].description;
                let str = show.ruleDesc;
                let j = 0;
                let str1 = str.replace(reg, (match, p1, p2, p3) => {
                  const s = show[arr[j]];
                  p1 = `<span style="color:#4974F5;font-weight: 600;">${s}</span>`;
                  j++;
                  return p1;
                });
                j = 0;
                let str2 = str.replace(reg, (match, p1, p2, p3) => {
                  p1 = show[arr[j]];
                  j++;
                  return p1;
                });
                show.textHtml = str1;
                show.description = str2;
                // showListMap[showCode] = show;
              }
            }
            // this.showListMap = showListMap;
            // this.dictionaryMap = dictionaryMap;
          } else {
            this.$message.warning(message);
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
    // async getDictionary() {
    //   this.loading = true;
    //   try {
    //     const param = {
    //       code: 'rule_code',
    //     };
    //     const result = await queryTreeBook(param);
    //     if (result.code !== 200) {
    //       this.loading = false;
    //       this.$message.warning(result.message);
    //       return;
    //     }
    //     if (result.code === 200) {
    //       this.loading = false;
    //       // 数据字典时间单位
    //       // this.unitCode = result.data.rule_date_code || [];
    //     }
    //   } catch (error) {
    //     this.loading = false;
    //   }
    // },
  },
};
</script>
