import { get_mch_base_info, list_biz_status } from 'api/common';
import { get_source_list, find_detailed_by_id } from 'api/source-manage';
import imChatMinixs from 'utils/mixins/imChatMinixs';
import { PASSENGER_SOURCE } from 'constants/constants';
import SvgIcon from 'components/svg-icon';
import EditSource from '../components/edit-source/index.vue';
import { store, mutations } from '../await-confirm/observable';
export default {
  name: 'AddSource',
  mixins: [imChatMinixs],
  components: {
    SvgIcon,
    EditSource,
  },
  data() {
    return {
      customerContact: '', //完善客源
      saveButtonLoading: false,
      type: 'add_source',
      dialogVisible: false,
      tableDataPage: 0, //总条数
      start: 1,
      customerPhone: '',
      isTabs: false,
      loading: false,
      sourceList: [], //客源列表
    };
  },
  created() {
    this.constantsSource = Object.freeze(PASSENGER_SOURCE);
    const recordsObj = store.recordsObj;
    if (recordsObj.id) {
      this.type = 'complete_clue';
      this.$nextTick(() => {
        this.$refs.addSourceRef.openModal(recordsObj);
      });
    }
  },
  mounted() {},
  beforeDestroy() {
    mutations.clearRecordsObj();
  },
  methods: {
    update() {
      this.getSource();
      this.dialogVisible = false;
    },
    reset() {
      this.sourceList = '';
      this.tableDataPage = 0;
      this.customerPhone = '';
      this.start = 1;
    },
    /**
     * @description 去重区域
     */
    removeRepetitionArea(item) {
      if (item.bizCityName) {
        const bizCity = item.bizCityName?.split(',');
        if (Array.isArray(bizCity)) {
          return [...new Set(bizCity)].join(',');
        }
      }
      return '-';
    },
    setSourceList(phone) {
      this.isTabs = true;
      this.customerPhone = phone || '';
      this.getSource();
    },
    /**
     * @description 获取客户需求
     */
    getContent(item) {
      if (!item.requireName) return '暂无数据';
      try {
        let arr = JSON.parse(item.requireName);
        const arr1 = item.requireParentName.split(',');
        return arr
          .map((i, index) => {
            if (i.signTime) {
              return arr1[index] + '/' + i.intentionName + '（已签）';
            }
            return arr1[index] + '/' + i.intentionName;
          })
          .join('、');
      } catch (error) {
        return '暂无数据';
      }
    },

    /**
     * @description 提交事件
     */
    async submitV() {
      try {
        const addSourceRef = this.$refs.addSourceRef;
        await addSourceRef.submit(() => {
          this.saveButtonLoading = true;
        });
        addSourceRef.changeTypeEdit('add_source');
        mutations.clearRecordsObj();
        this.saveButtonLoading = false;
        this.isTabs = false;
      } catch (error) {
        this.saveButtonLoading = false;
      }
    },
    /**
     * @description 客源查询
     */
    getSource() {
      this.loading = true;
      let params = {
        customerPhone: this.customerPhone,
        limit: 3,
        start: this.start,
      };
      get_source_list(params)
        .then((res) => {
          const { code, data, message } = res;
          if (code === 200) {
            const { records = [], total = 0 } = data;
            this.sourceList = records;
            this.tableDataPage = total;
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
     * @description 操作客源的按钮
     */
    async handleSource(item) {
      this.loading = true;
      let { type, bizNo, bizId, plannerId } = item;
      if (type === 'no_allocationing') {
        this.loading = false;
        get_mch_base_info().then((res) => {
          const { code, data, message } = res || {};
          if (code !== 200) return this.$message.warning(message);
          const mchCode = data?.roleVos?.map((item) => {
            return item.code;
          });
          if (mchCode.includes('distribution')) {
            this.$router.push({ path: '/await-allocation', query: { bizNo } });
          } else {
            this.$messageBox.confirm('抱歉，您无分配客源权限，请联系平台管理员！', '提示', {
              confirmButtonText: '确定',
              showCancelButton: false,
              type: 'warning',
              closeOnClickModal: false,
            });
          }
        });
      } else if (type === 'im') {
        const result = await list_biz_status({ ids: [bizId] });
        const { code, data, message } = result || {};
        if (code !== 200) {
          this.loading = false;
          return this.$message.warning(message);
        }
        if (data[0]?.bizLibrary === 'PERSONAL') {
          await this.IMChatOpen({ userId: plannerId }, 'userId');
        } else {
          this.$message.warning('商机已不在个人库');
          if (this.sourceList?.length == 1 && this.start != 1) {
            this.start--;
          }
          this.getSource();
        }
        this.loading = false;
      } else {
        let params = {
          bizId,
        };
        const res = await find_detailed_by_id(params);
        if (res.code === 200) {
          let obj = res.data ? Object.assign(item, res.data) : item;
          this.dialogVisible = true;
          this.$nextTick(() => {
            this.$refs.editSourceRef.openModal(obj);
          });
        } else {
          this.$message.warning(res.message);
        }
        this.loading = false;
      }
    },
    /**
     * @description 分页
     * @param {Number}
     */
    //第几页
    handleCurrentChange(val) {
      this.start = val;
      this.getSource();
    },
  },
};
