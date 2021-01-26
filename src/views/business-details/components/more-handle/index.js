import './index.scss';
import {
  MORE_HANDLE, //全部
  MORE_HANDLE_COMPONENT, //全部组件名
  NO_ATTENTION_MORE_HANDLE_COMPONENT, //暂不关注
  NO_ATTENTION_MORE_HANDLE, //暂不关注组件名
  SIGNED_BUSINESS, //已签状态
  SIGNED_BUSINESS_COMPONENT, //已签状态组件
  MORE_TEAM_MANAGE, //经理
  MORE_TEAM_MANAGE_COMPONENT, //经理
} from 'constants/permission';
import InviteInterview from 'views/my-business/components/invite-interview/index.vue';
import SetGroup from 'views/my-business/components/set-group';
import NoAttention from 'views/my-business/components/no-attention';
import CuleMoveDialog from 'views/team-manage/components/cule-move-dialog';
import HandleLog from '../handle-log';
import EditBaseInfo from '../edit-base-info';
import SetNextFollowTime from '../set-next-follow-time';
import { recoverInattention } from 'api/common';
export default {
  name: 'MoreHandle',
  components: {
    InviteInterview,
    SetGroup,
    NoAttention,
    EditBaseInfo,
    HandleLog,
    SetNextFollowTime,
    CuleMoveDialog,
  },
  props: {
    businessId: { type: String, default: '' },
    from: { type: String, default: '' },
  },
  inject: ['reload'],
  data() {
    return {
      isShow: false,
      businessInfo: {},
    };
  },
  mounted() {
    //监听基础信息获取数据后，打开基础信息的按钮限制
    this.$eventBus.$on('get-business-info', (value) => {
      if (Object.keys(value).length > 0) {
        this.isShow = true;
        this.businessInfo = value;
        console.log('sdfsdfasasd', this.isShow);
      }
    });
  },
  beforeDestroy() {
    this.$eventBus.$off('get-business-info');
  },
  methods: {
    openModalHandleClick(e) {
      const dataset = e.target.dataset;
      const component = dataset.component;
      if (component) {
        const code = dataset.code;
        switch (component) {
          case 'push-sheet':
            this.$router.push('/push-sheet');
            break;
          case 'reset-attention':
            this.resetAttention();
            break;
          case 'no-attention':
            this.$refs[component].openModal({ code, busId: this.businessId });
            break;
          default:
            this.$refs[component].openModal(this.businessInfo);
            break;
        }
      }
    },

    resetAttention() {
      this.$messageBox
        .confirm('请确认是否恢复暂不关注？', '恢复关注', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          customClass: 'message-box-min-height',
          closeOnClickModal: false,
        })
        .then(() => {
          const obj = {
            bizId: this.businessId,
          };
          recoverInattention(obj)
            .then((res) => {
              if (res.code === 200) {
                this.reload();
                this.$message.success('操作成功');
              } else {
                this.$message.warning(res.message);
              }
            })
            .catch(() => {
              this.loading = false;
            });
        })
        .catch(() => {
          this.loading = false;
        });
    },
    genRenderNodeComponent() {
      let moreHandleComponent;
      if (this.from === 'team-manage') {
        moreHandleComponent = MORE_TEAM_MANAGE_COMPONENT;
      } else if (this.businessInfo.noAttention == 1) {
        moreHandleComponent = NO_ATTENTION_MORE_HANDLE_COMPONENT;
      } else if (this.businessInfo.bizStatus == 'CRM_BIZ_STATUS_ORDER') {
        moreHandleComponent = SIGNED_BUSINESS_COMPONENT;
      } else {
        moreHandleComponent = MORE_HANDLE_COMPONENT;
      }
      return (
        <div>
          {moreHandleComponent.map((item) => {
            return <item ref={item} is-place="business-details" />;
          })}
        </div>
      );
    },
    genRenderNode() {
      let moreHandle;
      if (this.from === 'team-manage') {
        moreHandle = MORE_TEAM_MANAGE;
      } else if (this.businessInfo.noAttention == 1) {
        moreHandle = NO_ATTENTION_MORE_HANDLE;
      } else if (this.businessInfo.bizStatus == 'CRM_BIZ_STATUS_ORDER') {
        moreHandle = SIGNED_BUSINESS;
      } else {
        moreHandle = MORE_HANDLE;
      }
      return (
        <div>
          {moreHandle.map((item) => {
            return (
              <span
                class={{
                  'button-warp_more': true,
                  'button-warp_item': true,
                }}
                data-component={item.openModal}
                data-code={item.code || ''}>
                {item.name}
              </span>
            );
          })}
        </div>
      );
    },
  },
  render() {
    const node = (
      <div class="more-handle">
        <div class="title">更多操作</div>
        <div class="button-warp" onClick={this.openModalHandleClick}>
          {this.genRenderNode()}
        </div>
        {this.genRenderNodeComponent()}
      </div>
    );
    return this.isShow ? node : '';
  },
};
