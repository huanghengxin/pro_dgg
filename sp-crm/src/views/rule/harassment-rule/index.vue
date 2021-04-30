<template>
  <div class="prevent-harass-page">
    <div class="harassment-title">
      <div class="harassment-title-explain">
        <span>规则说明</span>
        <el-button :disabled="isSaveButton" type="primary" size="mini" @click="saveButton"
          >保存</el-button
        >
      </div>
      <div>每个 X 对应一个值输入框，依次填写，没有填写完整的规则，默认保存为禁用状态。</div>
    </div>
    <div class="harassment-table-title">防骚扰限制规则</div>
    <div class="harassment-table-main">
      <!-- 拨打限制 -->
      <div class="table-title-text">拨打限制</div>
      <el-table v-loading="loading" :data="callLimitTable" style="width: 100%">
        <template slot="empty">
          <svg-icon key="item-warp" type="nodata" icon="icon-icon_nodata" />
        </template>
        <el-table-column prop="ruleName" label="规则名称" min-width="82"> </el-table-column>
        <el-table-column prop="ruleText" label="规则内容" min-width="300">
          <template slot-scope="scope">
            <show-tooltip
              v-if="scope.row.ruleText"
              :text="scope.row.ruleText"
              :width="360"
            ></show-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="值" class-name="main-value check-input" min-width="250">
          <template slot-scope="scope">
            <el-form ref="callLimitRef" :rules="rules" :model="scope.row">
              <el-form-item prop="val1">
                <el-input v-model="scope.row.val1" @input="saveValid"></el-input>
              </el-form-item>
              <el-form-item prop="val2">
                <el-input v-model="scope.row.val2" class="middle" @input="saveValid"></el-input>
              </el-form-item>
              <el-form-item>
                <el-input disabled></el-input>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="当前状态" min-width="76">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              active-value="1"
              inactive-value="2"
              active-color="#4974F5"
              inactive-color="#BFBFBF"
            >
            </el-switch>
          </template>
        </el-table-column>
      </el-table>
      <!-- 防骚扰客户隐藏 -->
      <div class="table-title-text">防骚扰客户隐藏</div>
      <el-table v-loading="loading" :data="harassmentTable" style="width: 100%">
        <template slot="empty">
          <svg-icon key="item-warp" type="nodata" icon="icon-icon_nodata" />
        </template>
        <el-table-column prop="ruleName" label="规则名称" min-width="82"> </el-table-column>
        <el-table-column prop="ruleText" label="规则内容" min-width="300">
          <template slot-scope="scope">
            <show-tooltip
              v-if="scope.row.ruleText"
              :text="scope.row.ruleText"
              :width="360"
            ></show-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="值" class-name="main-value" min-width="250">
          <el-form>
            <el-form-item>
              <el-input disabled></el-input>
            </el-form-item>
            <el-form-item>
              <el-input disabled class="middle"></el-input>
            </el-form-item>
            <el-form-item>
              <el-input disabled></el-input>
            </el-form-item>
          </el-form>
        </el-table-column>
        <el-table-column label="当前状态" min-width="76">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              active-value="1"
              inactive-value="2"
              active-color="#4974F5"
              inactive-color="#BFBFBF"
            >
            </el-switch>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import './index.scss';
import ShowTooltip from 'components/show-tooltip';
import SvgIcon from 'components/svg-icon';
import {
  get_anti_harassment_configuration_list,
  modify_anti_harassment_rule,
} from 'api/harassment-rule';
export default {
  name: 'PreventHarass',
  components: {
    ShowTooltip,
    SvgIcon,
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
      loading: false,
      isError: undefined,
      callLimitTable: [],
      harassmentTable: [],
      rules: {
        val1: [{ validator: checkInput, trigger: 'change' }],
        val2: [{ validator: checkInput, trigger: 'change' }],
      },
    };
  },
  computed: {
    isSaveButton() {
      const val1 = this.callLimitTable[0]?.val1;
      const val2 = this.callLimitTable[0]?.val2;
      return val1 === '' ||
        val2 === '' ||
        this.loading === true ||
        this.isError ||
        this.callLimitTable.length === 0
        ? true
        : false;
    },
  },
  created() {
    this.getHarassmentList();
  },
  mounted() {},
  methods: {
    getHarassmentList() {
      this.loading = true;
      let params = {
        chooseTag: 'ANTI_HARASSMENT_LIMIT',
      };
      get_anti_harassment_configuration_list(params)
        .then((res) => {
          if (res.code === 200) {
            this.callLimitTable = res.data.limitList;
            this.harassmentTable = res.data.hiddenList;
          } else {
            this.$message.warning(res.message);
          }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    saveButton() {
      let params = { list: [...this.callLimitTable, ...this.harassmentTable] };
      this.$refs.callLimitRef.validate((valid) => {
        if (valid) {
          this.loading = true;
          modify_anti_harassment_rule(params)
            .then((res) => {
              if (res.code === 200) {
                this.$message.success(res.message);
                this.getHarassmentList();
              } else {
                this.$message.warning(res.message);
              }
              this.loading = false;
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          return false;
        }
      });
    },
    saveValid() {
      this.$refs.callLimitRef.validate((valid) => {
        this.isError = !valid;
      });
    },
  },
};
</script>
