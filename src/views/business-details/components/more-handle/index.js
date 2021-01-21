import './index.scss';
import {
  MORE_HANDLE, //全部
  MORE_HANDLE_COMPONENT, //全部组件名
  NO_ATTENTION_MORE_HANDLE_COMPONENT, //暂不关注
  NO_ATTENTION_MORE_HANDLE, //暂不关注组件名
  SIGNED_BUSINESS, //已签状态
} from 'constants/constants';
import InviteInterview from 'views/my-business/components/invite-interview';
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
  },
  inject: ['reload'],
  data() {
    return {
      isShow: false,
      businessInfo: {},
    };
  },
  created() {
    //监听基础信息获取数据后，打开基础信息的按钮限制
    this.$eventBus.$on('get-business-info', (value) => {
      if (Object.keys(value).length > 0) {
        this.isShow = true;
        this.businessInfo = value;
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
      let moreHandleComponent =
        this.businessInfo.noAttention == 1
          ? NO_ATTENTION_MORE_HANDLE_COMPONENT
          : MORE_HANDLE_COMPONENT;
      return (
        <div>
          {moreHandleComponent.map((item) => {
            return <item ref={item} is-place="business-details" />;
          })}
        </div>
      );
    },
    genRenderNode() {
      let moreHandle =
        this.businessInfo.bizStatus == 'CRM_BIZ_STATUS_ORDER'
          ? SIGNED_BUSINESS
          : this.businessInfo.noAttention == 1
          ? NO_ATTENTION_MORE_HANDLE
          : MORE_HANDLE;
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
    const node = this.isShow ? (
      <div class="more-handle">
        <div class="title">更多操作</div>
        <div class="button-warp" onClick={this.openModalHandleClick}>
          {this.genRenderNode()}
        </div>
        {this.genRenderNodeComponent()}
      </div>
    ) : (
      ''
    );
    return node;
  },
};
