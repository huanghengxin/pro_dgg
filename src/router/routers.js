/**
 * 路由模块
 * @author chenmb
 * @since 2020/11/12
 */

const Layout = () => import(/* webpackChunkName: "layout" */ 'components/layout');
const Platform = () => import(/* webpackChunkName: "platform" */ 'views/rule/platform');
const Merchant = () => import(/* webpackChunkName: "merchant" */ 'views/rule/merchant');
const PushSheet = () => import(/* webpackChunkName: "push-sheet" */ 'views/push-sheet');
const MyBusiness = () => import(/* webpackChunkName: "my-business" */ 'views/my-business');
const TeamManage = () => import(/* webpackChunkName: "team-manage" */ 'views/team-manage');
const ClueSeasLibrary = () =>
  import(/* webpackChunkName: "clue-seas-library" */ 'views/cule/clue-seas-library');
const ProspectiveCustomer = () =>
  import(/* webpackChunkName: "prospective-customer" */ 'views/cule/prospective-customer');
const PublicLibrary = () =>
  import(/* webpackChunkName: "public-library" */ 'views/cule/public-library');
const BusinessDetails = () =>
  import(/* webpackChunkName: "business-details" */ 'views/business-details');
const AddBusiness = () =>
  import(
    /* webpackChunkName: "add-business" */ 'views/my-business/components/add-business/index.vue'
  );
const DynamicBusiness = () =>
  import(/* webpackChunkName: "dynamic-business" */ 'views/dynamic-business');
const OrderDetails = () => import(/* webpackChunkName: "order-details" */ 'views/order-details');
const orderLlist = () => import(/* webpackChunkName: "order-list" */ 'views/order-list');
const productionInformation = () =>
  import(/* webpackChunkName: "production-information" */ 'views/production-information');
const RceferralCustomer = () =>
  import(/* webpackChunkName: "referral-customer" */ 'views/cule/referral-customer');
const Login = () => import(/* webpackChunkName: "login" */ 'views/login');
const OutCall = () => import(/* webpackChunkName: "call" */ 'views/call');

export default [
  {
    path: '/',
    redirect: '/login',
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
      //商机详情
      {
        path: '/business-details',
        name: 'BusinessDetails',
        component: BusinessDetails,
      },
      //推单
      {
        path: '/push-sheet',
        name: 'PushSheet',
        component: PushSheet,
      },
      // 商户规则
      {
        path: '/merchant',
        name: 'Merchant',
        component: Merchant,
      },
      //我的商机
      {
        path: '/my-business',
        name: 'MyBusiness',
        meta: {
          keepAlive: true,
        },
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
      // 我的潜在客户
      {
        path: '/prospective-customer',
        name: 'ProspectiveCustomer',
        component: ProspectiveCustomer,
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
      //订单详情
      {
        path: '/order-details',
        name: 'OrderDetails',
        component: OrderDetails,
      },
      //生产信息
      {
        path: '/production-information',
        name: 'productionInformation',
        component: productionInformation,
      },
      //订单列表
      {
        path: '/order-list',
        name: 'orderLlist',
        component: orderLlist,
      },
      //打电话
      {
        path: '/out-call',
        name: 'OutCall',
        component: OutCall,
      },
    ],
  },
];
