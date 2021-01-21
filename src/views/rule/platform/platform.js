import './index.scss';
import dayjs from 'dayjs';
import ShowTooltip from 'components/show-tooltip';
import SvgIcon from 'components/svg-icon';
import { flowRule, limitRule } from 'constants/rule-type';

import {
  queryTreeBook,
  query_rules,
  update_platform_ruleList,
  rules_switch_boarded,
  exe_platform_rule_switch,
} from 'api/rule';
import CloseAllRuleDialog from './components/close-all-rule-dialog';

export default {
  name: 'Platform',
  components: {
    ShowTooltip,
    CloseAllRuleDialog,
    SvgIcon,
  },
  data() {
    const validateVal1 = (rule, value, callback) => {
      value = value?.trim();
      const field = rule.field;
      const indexArr = field.split('.');
      const i = indexArr[1];
      const d = indexArr[0];
      const item = this.getRuleList.data1[i];
      if (d === 'data1') {
        var regex = /^[A-Z_]+$/gi;
        var reg = /^[1-9][0-9]{0,3}$/;
        if (item.code === 'LZ_PUB_INV') {
          if (!regex.test(value)) {
            callback(new Error('请输入大写字母或下划线'));
          }
          callback();
        } else {
          if (!reg.test(value)) {
            callback(new Error('您只能输入小于9999的正整数'));
          }
          callback();
        }
      } else {
        var reg1 = /^[0-9][0-9]{0,3}$/;
        if (!reg1.test(value)) {
          callback(new Error('您只能输入小于9999的正整数'));
        }
        callback();
      }

      if (item.code === 'LZ_PRE_DROP_MSG') {
        if (20 < value * 1 < 6) {
          callback(new Error('请输入6到20整数'));
        }
      } else {
        callback();
      }
    };
    const validateVal2 = (rule, value, callback) => {
      this.validateVal(rule, value, callback, 'val2');
    };
    const validateVal3 = (rule, value, callback) => {
      this.validateVal(rule, value, callback, 'val3');
    };
    const validateVal4 = (rule, value, callback) => {
      this.validateVal(rule, value, callback, 'val4');
    };
    return {
      rules: {
        val1: [{ validator: validateVal1, trigger: 'blur' }],
        val2: [{ validator: validateVal2, trigger: 'blur' }],
        val3: [{ validator: validateVal3, trigger: 'blur' }],
        val4: [{ validator: validateVal4, trigger: 'blur' }],
      },
      loading: false,
      unitCode: [],
      libraryCode: [],
      libraryRule: [],
      staffRule: [],
      ruleList: [],
      changeForm: [],
      parma: [],
      start: '',
      end: '',
      switchboardStatus: null,
      switchCode: '',
      switchboardId: '',
      type: '',
      platformHeight: null,
    };
  },
  computed: {
    getLibraryRule() {
      return (this.ruleList || []).reduce((cur, acc) => {
        cur[acc.ruleCode] = acc;
        return cur;
      }, {});
    },
    /**
     * @description 规则列表数据
     */
    getRuleList() {
      const arr =
        (this.libraryRule || []).map((item) => {
          const { status, val1 = '', val2 = '', val3 = '', val4 = '', val5 = '', id = '' } =
            this.getLibraryRule[item.code] || {};
          return {
            status,
            val1,
            val2,
            val3,
            val4,
            val5,
            id,
            ...item,
          };
        }) || [];
      return { data1: arr };
    },
    getStaffList() {
      const arr =
        (this.staffRule || []).map((item) => {
          const { val1 = '', val2 = '', val3 = '', val4 = '', val5 = '', id = '' } =
            this.getLibraryRule[item.code] || {};
          return {
            val1,
            val2,
            val3,
            val4,
            val5,
            id,
            ...item,
          };
        }) || [];
      return { data2: arr };
    },
  },
  mounted() {
    this.getHeight();
    window.addEventListener('resize', this.getHeight);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.getHeight);
  },
  async created() {
    // 请求数据字段
    this.ruleList = (await this.getRulesPlatformLists()) || [];
    // 后台
    const dictionaryTree = (await this.getDictionary()) || {};
    // 库流转规则
    this.libraryRule =
      dictionaryTree.lz_code.map((item) => {
        return {
          name: item.name,
          code: item.code,
          description: item.description,
        };
      }) || [];
    // 规划师上限
    this.staffRule =
      dictionaryTree.sx_code.map((item) => {
        return {
          name: item.name,
          code: item.code,
          description: item.description,
        };
      }) || [];
    // 数据字典单位
    this.unitCode = dictionaryTree.rule_date_code || [];
    // 数据字典库编码
    this.libraryCode = dictionaryTree.rule_biz_db_code || [];
    // 总开关
    this.switchCode = dictionaryTree.rule_code[1].code || {};
    // 平台总开关后台数据
    this.getSwitchboard();
  },
  methods: {
    /**
     * @description
     */
    validateVal(rule, value, callback, val) {
      value = value?.trim();
      const field = rule.field;
      const indexArr = field.split('.');
      const i = indexArr[1];
      const d = indexArr[0];
      let arr, arr1;
      if (d === 'data1') {
        arr = this.getRuleList.data1[i];
        arr1 = flowRule;
      } else {
        arr = this.getStaffList.data2[i];
        arr1 = limitRule;
      }
      if (arr1[val]?.includes(arr.code)) {
        if (value === '') {
          callback('请输入内容');
        }
        callback();
      }
      callback();
    },
    /**
     * @description 获取顶部高度
     */
    getHeight() {
      const top = this.$refs.platform.getBoundingClientRect().top;
      this.platformHeight = window.innerHeight - top;
    },
    /**
     * @description 监听保存关闭时间弹窗
     */
    onSubmitHandle(val) {
      this.switchboardStatus = 2;
      this.getSwitchboard();
    },
    /**
     * @description 总开关结束时间范围内
     */
    switchboardEndDate(endDateStr) {
      var curDate = dayjs(new Date()).format('YYYY-MM-DD');
      let endDate = dayjs(new Date(endDateStr)).format('YYYY-MM-DD');
      if (curDate <= endDate) {
        return true;
      }
      return false;
    },
    /**
     * @description 总开关
     */
    changeSwitchboard(Change) {
      const obj = {
        status: Change,
        id: this.switchboardId,
        ruleCode: this.switchCode,
      };
      if (Change === 2) {
        this.$refs.closeAllRuleDialog.openModal(obj);
      }
      console.log(this.switchboardEndDate(this.end));
      if (Change === 1 && this.switchboardEndDate(this.end)) {
        this.$messageBox
          .confirm('未到设置的开启时间，请确认是否提前开启掉库？', '开启流转规则', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            customClass: 'message-box-min-height',
          })
          .then(() => {
            exe_platform_rule_switch(obj)
              .then((res) => {
                if (res.code === 200) {
                  this.$message({
                    type: 'success',
                    message: '操作成功!',
                  });
                  this.getSwitchboard();
                } else {
                  this.$message.warning(res.message);
                }
              })
              .catch(() => {
                this.$message({
                  type: 'info',
                  message: '操作失败!',
                });
              });
          })
          .catch(() => {
            this.loading = false;
          });
      }
    },
    /**
     * @description 状态的切换
     * @param {} 当前行数据
     */
    changeSwitch(index, row) {
      let flag = row.status; //保存点击之后v-modeld的值(true，false)
      row.status = row.status == 1 ? 2 : 1; //保持switch点击前的状态
      const obj = {
        status: flag,
        id: row.id,
        ruleCode: row.code,
      };
      this.$messageBox
        .confirm('请确认开启或者关闭该掉库规则？', '流转规则', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          customClass: 'message-box-min-height',
          closeOnClickModal: false,
        })
        .then(() => {
          exe_platform_rule_switch(obj)
            .then((res) => {
              row.status = row.status == 1 ? 2 : 1;
              this.$message({
                type: 'success',
                message: '操作成功!',
              });
            })
            .catch(() => {
              this.loading = false;
            });
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
      const param = {
        code: 'rule_code',
      };
      const result = await queryTreeBook(param).catch(() => {
        this.loading = false;
      });

      if (result.code === 200) {
        this.loading = false;
        return result.data;
      } else {
        this.loading = false;
        this.$message.warning(result.message);
      }
    },
    /**
     * @description 规则数据接口
     */
    async getRulesPlatformLists() {
      this.loading = true;
      const result = await query_rules().catch(() => {
        this.loading = false;
      });
      if (result.code === 200) {
        return result.data;
      } else {
        this.$message.warning(result.message);
      }
    },
    /**
     * @description 保存规则变动数据
     */
    savePlatformRule() {
      let check1 = null;
      let check2 = null;
      this.$refs.getStaffListRef.validate((valid) => {
        check2 = valid;
      });
      this.$refs.getRuleListRef.validate((valid) => {
        check1 = valid;
      });
      if (check1 && check2) {
        this.$messageBox
          .confirm('请确定保存规则, 是否继续?', '保存提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            customClass: 'message-box-min-height',
          })
          .then(() => {
            this.updatePlatformRuleList();
          })
          .catch(() => {
            this.loading = false;
          });
      } else {
        return;
      }
    },
    /**
     * @description 请求保存接口
     */
    updatePlatformRuleList() {
      const getRule = this.getRuleList.data1;
      const getStaff = this.getStaffList.data2;
      const rulesPlatform =
        [...getRule, ...getStaff].map((item) => {
          return {
            id: item.id,
            ruleCode: item.code,
            status: item.status,
            val1: item.val1.trim(),
            val2: item.val2.trim(),
            val3: item.val3.trim(),
            val4: item.val4.trim(),
            val5: item.val5.trim(),
          };
        }) || [];
      update_platform_ruleList(rulesPlatform)
        .then((res) => {
          if (res.code === 200) {
            this.$message({
              type: 'success',
              message: '保存成功!',
            });
          } else {
            this.$message.warning(res.message);
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
    /**
     * @description 获取总开关数据
     */
    async getSwitchboard() {
      const param = {
        ruleCode: this.switchCode,
      };
      await rules_switch_boarded(param)
        .then((res) => {
          if (res.code === 200) {
            this.switchboardStatus = res.data.status;
            this.start = res.data.val1;
            this.end = res.data.val2;
            this.switchboardId = res.data.id;
          } else {
            this.$message.warning(res.message);
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
