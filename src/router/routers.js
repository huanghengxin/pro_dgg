/**
 * 路由模块
 * @author chenmb
 * @since 2020/11/12
 */

const Layout = () => import(/* webpackChunkName: "layout" */ 'components/layout');
const Platform = () => import(/* webpackChunkName: "platform" */ 'views/rule/platform');
const CooperationMerchant = () =>
  import(/* webpackChunkName: "cooperation-merchant" */ 'views/rule/cooperation-merchant');
const CooperationPlatform = () =>
  import(/* webpackChunkName: "cooperation-platform" */ 'views/rule/cooperation-platform');
const Merchant = () => import(/* webpackChunkName: "merchant" */ 'views/rule/merchant');
const CloseBlackCurrentLimit = () =>
  import(
    /* webpackChunkName: "close-black-current-limit" */ 'views/rule/close-black-current-limit'
  );
const CloseBlackHandleRecord = () =>
  import(
    /* webpackChunkName: "close-black-handle-record" */ 'views/rule/close-black-handle-record'
  );
const ErrorList = () =>
  import(
    /* webpackChunkName: "error-list" */ 'views/rule/close-black-current-limit/components/error-list'
  );

const MyBusiness = () => import(/* webpackChunkName: "my-business" */ 'views/my-business');
const TeamManage = () => import(/* webpackChunkName: "team-manage" */ 'views/team-manage');

const ClueSeasLibrary = () =>
  import(/* webpackChunkName: "clue-seas-library" */ 'views/cule/clue-seas-library');
const ProspectiveCustomer = () =>
  import(/* webpackChunkName: "prospective-customer" */ 'views/cule/prospective-customer');

const PublicLibrary = () =>
  import(/* webpackChunkName: "public-library" */ 'views/cule/public-library');
const CooperationAllianceClients = () =>
  import(
    /* webpackChunkName: "cooperation-alliance-clients" */ 'views/cule/cooperation-alliance-clients'
  );
const BusinessDetails = () =>
  import(/* webpackChunkName: "business-details" */ 'views/business-details');
const AddBusiness = () =>
  import(
    /* webpackChunkName: "add-business" */ 'views/my-business/components/add-business/index.vue'
  );
const InitiateCooperationInPage = () =>
  import(
    /* webpackChunkName: "initiate-cooperation-in-page" */ 'views/cule/initiate-cooperation-in-page/index.vue'
  );
const DynamicBusiness = () =>
  import(/* webpackChunkName: "dynamic-business" */ 'views/dynamic-business');
const RceferralCustomer = () =>
  import(/* webpackChunkName: "referral-customer" */ 'views/cule/referral-customer');
const Login = () => import(/* webpackChunkName: "login" */ 'views/login');

export default [
  {
    path: '/',
    redirect: '/login',
    name: 'Layout',
    component: Layout,
    children: [
      {
        path: '/login',
        name: 'Login',
        component: Login,
      },
      {
        path: '/platform',
        name: 'Platform',
        component: Platform,
      },
      //我的商机/商机详情
      {
        path: '/my-business/business-details',
        name: 'MyBusinessBusinessDetails',
        component: BusinessDetails,
      },
      //商机/商机详情
      {
        path: '/team-manage/business-details',
        name: 'TeamManageBusinessDetails',
        component: BusinessDetails,
      },

      // 商户规则
      {
        path: '/merchant',
        name: 'Merchant',
        component: Merchant,
      },
      // 关黑限流进行中
      {
        path: '/close-black-current-limit',
        name: 'CloseBlackCurrentLimit',
        component: CloseBlackCurrentLimit,
      },
      // 关黑限流错误列表
      {
        path: '/error-list',
        name: 'ErrorList',
        component: ErrorList,
      },
      // 关黑限流操作记录
      {
        path: '/close-black-handle-record',
        name: 'CloseBlackHandleRecord',
        component: CloseBlackHandleRecord,
      },
      //我的商机
      {
        path: '/my-business',
        name: 'MyBusiness',
        component: MyBusiness,
      },
      // 经营管理
      {
        path: '/team-manage',
        name: 'TeamManage',
        component: TeamManage,
      },
      // 线索公海库
      {
        path: '/clue-seas-library',
        name: 'ClueSeasLibrary',
        component: ClueSeasLibrary,
      },
      //合作联盟客户
      {
        path: '/cooperation-alliance-clients',
        name: 'CooperationAllianceClients',
        component: CooperationAllianceClients,
      },
      // 发起合作
      {
        path: '/initiate-cooperation-in-page',
        name: 'InitiateCooperationInPage',
        component: InitiateCooperationInPage,
      },
      // 我的潜在客户
      {
        path: '/prospective-customer',
        name: 'ProspectiveCustomer',
        component: ProspectiveCustomer,
      },
      // 合作联盟规则商户
      {
        path: '/cooperation-merchant',
        name: 'CooperationMerchant',
        component: CooperationMerchant,
      },
      // 合作联盟规则平台
      {
        path: '/cooperation-platform',
        name: 'CooperationPlatform',
        component: CooperationPlatform,
      },

      // 我的转介绍
      {
        path: '/referral-customer',
        name: 'referral-customer',
        component: RceferralCustomer,
      },
      // 公共库
      {
        path: '/public-library',
        name: 'PublicLibrary',
        component: PublicLibrary,
      },
      //新增商机
      {
        path: '/add-business',
        name: 'AddBusiness',
        component: AddBusiness,
      },
      //商机动态
      {
        path: '/dynamic-business',
        name: 'DynamicBusiness',
        component: DynamicBusiness,
      },
    ],
  },
];
