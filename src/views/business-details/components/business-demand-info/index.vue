<template>
  <div class="business-demand-info">
    <div class="tab-warp">
      <div class="warp-tabs" data-tid="demandTabChangeHandleClick" @click="tabChangeHandleClick">
        <div class="warp-tabs_left" :style="{ width: (width || warpWidth) - 176 + 'px' }">
          <div ref="scrollWarpRef" class="item-warp">
            <div
              ref="navWarpRef"
              class="item-nav"
              :style="{ transform: `translateX(-${moveWidth}px)` }"
            >
              <div v-for="(item, index) in demandInfoList" :key="item.id" class="warp-tabs_item">
                <span :data-index="index" :class="{ 'warp-tabs_item-active': index == tabActive }">
                  {{ item.intentionName }}
                </span>
              </div>
            </div>
          </div>
          <template v-if="scrollDisable">
            <i
              class="tab-prev el-icon-arrow-left"
              data-tid="demandPrevHandleClick"
              @click="prevHandleClick"
            ></i>
            <i
              class="tab-next el-icon-arrow-right"
              data-tid="demandNextHandleClick"
              @click="nextHandleClick"
            ></i>
          </template>
        </div>
        <div class="warp-tabs_right">
          <slot>
            <el-button
              v-if="from !== 'team-manage'"
              v-accControls:noAttention="noAttentionStatus"
              type="primary"
              icon="iconfont-qds-crm icon-plusoutline"
              size="small"
              data-tid="demandEditDemandHandleClick"
              @click="editDemandHandleClick('add')"
            >
              新增需求
            </el-button>
          </slot>
        </div>
      </div>
    </div>
    <div v-loading="loading" class="demand-content">
      <div class="warp-top">
        <div class="warp-top_left">
          <p>需求信息</p>
          <p>
            <span
              >更新时间：<em>{{ currentDemand.updateTime || '暂无数据' }}</em></span
            >
            <span
              >需求进度：<em>{{ currentDemand.requireProgress | requireProgressMap }}</em></span
            >
          </p>
        </div>
        <div
          v-show="currentDemand.requireStatus !== 'CRM_REQ_STATUS_SIGN' && !type"
          class="warp-top_right"
        >
          <span
            v-if="from !== 'team-manage'"
            v-accControls:noAttention="noAttentionStatus"
            class="button-warp_item"
            data-tid="demandEditDemandHandleClick"
            @click="editDemandHandleClick('edit')"
            >修改</span
          >
          <span
            v-show="isShowDel"
            v-if="from !== 'team-manage'"
            v-accControls:noAttention="noAttentionStatus"
            class="button-warp_item"
            data-tid="demandDelectDemandHandleClick"
            @click="delectDemandHandleClick"
            >删除</span
          >
        </div>
      </div>
      <div class="warp-bottom">
        <p v-for="item in clinetDemandInfo" :key="item.code1">
          <span>
            <em>{{ item.name1 }}</em
            ><em>{{
              currentDemand[item.code1]
                ? item.code1 === 'expectedMoney'
                  ? currentDemand[item.code1] + '元'
                  : currentDemand[item.code1]
                : '未选择'
            }}</em>
          </span>
        </p>
        <template v-if="attributeList.length">
          <p v-for="item in attributeList" :key="item.attriNameCode" class="warp-bottom_attr">
            <span>
              <em>{{ item.attriName }}：</em><em>{{ item.attriValue || '未选择' }}</em>
            </span>
          </p>
        </template>
      </div>
      <img
        v-show="currentDemand.requireStatus === 'CRM_REQ_STATUS_SIGN'"
        src="~@/assets/image/image_seal.png"
        class="warp-image"
      />
    </div>
    <edit-demand-info ref="editDemandRef" @on-submit="onSubmit" />
  </div>
</template>

<script>
import './index.scss';
import EditDemandInfo from '../edit-demand-info';
import { CLIENT_DEMAND_INFO } from 'constants/constants';
import { get_requirement_info, del_demand } from 'api/business-details';
import { REQUIRE_PROGRESS_TYPE_MAP } from 'constants/type';
import dayjs from 'dayjs';
export default {
  name: 'BusinessDemandInfo',
  components: {
    EditDemandInfo,
  },
  filters: {
    requireProgressMap(val) {
      return REQUIRE_PROGRESS_TYPE_MAP[val] || '暂无数据';
    },
  },

  props: {
    businessId: {
      type: String,
      default: '',
    },
    width: {
      type: Number,
      default: null,
    },
    type: {
      type: Boolean,
      default: false,
    },
    from: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      isShowDel: false,
      loading: false,
      demandInfoList: [],
      followDemandList: [],
      tabActive: 0,
      clinetDemandInfo: [],
      moveWidth: 0,
      scrollDisable: false,
      warpWidth: '',
      noAttentionStatus: '',
      CallEventBus: undefined,
    };
  },
  computed: {
    currentDemand() {
      const cur = this.demandInfoList[this.tabActive] || {};
      cur.expectedCompletedTime = cur.expectedCompletedTime
        ? dayjs(cur.expectedCompletedTime).format('YYYY-MM-DD')
        : '';
      return cur;
    },
    attributeList() {
      const attribute = this.currentDemand.attribute;
      if (attribute) {
        let attr = JSON.parse(attribute);
        if (Array.isArray(attr)) {
          return attr;
        } else {
          return [];
        }
      }
      return [];
    },
  },
  watch: {
    businessId(val) {
      if (this.businessId) {
        this.getDemandInfoList();
      }
    },
  },
  created() {
    this.CallEventBus = this.$createEventBus && this.$createEventBus('CALL');
    this.CallEventBus?.$on('terminated', this.getDemandInfoList);
    //监听基础信息获取数据后，打开基础信息的按钮限制
    this.$eventBus.$on('get-business-info', (value) => {
      this.noAttentionStatus = value.noAttention;
    });
    this.$eventBus.$on('update-demand-list', () => {
      this.getDemandInfoList();
    });
    this.getDemandInfoList();
  },
  mounted() {
    this.warpWidth = this.$el.offsetWidth;
    window.addEventListener('resize', this.resize);
  },
  destroyed() {
    this.CallEventBus?.$off('terminated', this.getDemandInfoList);
    this.$eventBus.$off('get-business-info');
    this.$eventBus.$off('update-demand-list');
    window.removeEventListener('resize', this.resize);
  },
  methods: {
    onSubmit() {
      this.getDemandInfoList();
    },
    /**
     * @description 监听窗口变化
     */
    resize() {
      this.warpWidth = this.$el.offsetWidth;
    },
    /**
     * @description 删除需求
     */
    delectDemandHandleClick() {
      this.$messageBox
        .confirm('是否删除需求?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          closeOnClickModal: false,
        })
        .then(() => {
          let params = {
            requireId: this.currentDemand.requireId,
          };
          del_demand(params)
            .then((res) => {
              this.loading = true;
              if (res.code === 200) {
                res = res.data;
                this.$message.success('删除成功');
                this.$eventBus.$emit('edit-on-submit_update-business-info');
                this.getDemandInfoList();
                this.tabActive = this.tabActive > 0 ? this.tabActive - 1 : 0;
              } else {
                if (res.code === 10001) {
                  this.getDemandInfoList();
                }
                this.$message.warning(res.message);
              }
              this.loading = false;
            })
            .catch(() => {
              this.loading = false;
            });
        });
    },
    /**
     * @description 点击tab上一步
     */
    prevHandleClick(e) {
      e.stopPropagation();
      const containerSize = this.$refs.scrollWarpRef.offsetWidth;
      const moveWidth = this.moveWidth;
      if (!moveWidth) return;
      let newMoveWidth = moveWidth > containerSize ? moveWidth - containerSize : 0;
      this.moveWidth = newMoveWidth;
    },
    /**
     * @description 点击tab下一步
     */
    nextHandleClick(e) {
      e.stopPropagation();
      const containerSize = this.$refs.scrollWarpRef.offsetWidth;
      const navOffset = this.$refs.navWarpRef.offsetWidth;
      const moveWidth = this.moveWidth;
      if (navOffset - moveWidth <= containerSize) return;
      let newMoveWidth =
        navOffset - moveWidth > containerSize * 2
          ? moveWidth + containerSize
          : navOffset - containerSize;
      this.moveWidth = newMoveWidth;
    },
    /**
     * @description tab切换方法
     */
    tabChangeHandleClick(e) {
      const index = e.target.dataset.index;
      if (!index) return;
      this.tabActive = index;
      const activeBound = e.target.parentNode.getBoundingClientRect();
      const containerBound = this.$refs.scrollWarpRef.getBoundingClientRect();
      const maxOffset = this.$refs.navWarpRef.offsetWidth - containerBound.width;
      const moveWidth = this.moveWidth;
      let newMoveWidth = moveWidth;
      if (activeBound.left < containerBound.left) {
        newMoveWidth = moveWidth - (containerBound.left - activeBound.left);
      }
      if (activeBound.right > containerBound.right) {
        newMoveWidth = moveWidth + activeBound.right - containerBound.right;
      }
      newMoveWidth = Math.max(newMoveWidth, 0);
      this.moveWidth = Math.min(newMoveWidth, maxOffset);
    },
    /**
     * @description 新增需求
     */
    editDemandHandleClick(type) {
      this.$refs.editDemandRef.openModal(
        type === 'edit' ? this.currentDemand : '',
        this.businessId,
        this.attributeList,
        this.followDemandList,
      );
    },
    /**
     * @description 获取客户需求列表
     */
    getDemandInfoList() {
      const params = {
        bizId: this.businessId,
      };
      this.loading = true;
      get_requirement_info(params)
        .then((res) => {
          if (res.code === 200) {
            res = res.data;
            this.clinetDemandInfo = Object.freeze(CLIENT_DEMAND_INFO);
            if (!res?.length) return;
            this.demandInfoList = res;
            this.followDemandList = this.demandInfoList.reduce((acc, cur) => {
              if (cur.requireStatus !== 'CRM_REQ_STATUS_SIGN') {
                acc.push(cur.intentionCode);
              }
              return acc;
            }, []);
            this.isShowDel = this.demandInfoList?.length > 1 ? true : false;
            this.$nextTick(() => {
              const containerSize = this.$refs.scrollWarpRef.offsetWidth;
              const navOffset = this.$refs.navWarpRef.offsetWidth;
              if (navOffset > containerSize) {
                this.scrollDisable = true;
              }
            });
          } else {
            this.$message.warning(res.message);
          }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>
