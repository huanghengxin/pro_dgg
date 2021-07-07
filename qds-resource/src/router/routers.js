const Layout = () => import(/* webpackChunkName: "layout" */ 'components/layout');
const Login = () => import(/* webpackChunkName: "login" */ 'views/login');
const AddSource = () =>
  import(/* webpackChunkName: "add-source" */ 'views/source-manage/add-source/index.vue');
const AddRecord = () =>
  import(/* webpackChunkName: "add-record" */ 'views/source-manage/add-record');
const AwaitConfirm = () =>
  import(/* webpackChunkName: "await-confirm" */ 'views/source-manage/await-confirm');
const AwaitAllocation = () =>
  import(/* webpackChunkName: "await-allocation" */ 'views/source-manage/await-allocation');
const AllocationRecord = () =>
  import(
    /* webpackChunkName: "allocation-record" */ 'views/source-manage/allocation-record/index.vue'
  );
const SourceDetails = () =>
  import(/* webpackChunkName: "source-details" */ 'views/source-manage/source-details/index.vue');
const TestSource = () =>
  import(/* webpackChunkName: "test-source" */ 'views/source-manage/test-source');
const SetAllocationWay = () =>
  import(
    /* webpackChunkName: "set-allocation-way" */ 'views/source-manage/set-allocation-way/index.vue'
  );
const Platform = () => import(/* webpackChunkName: "platform" */ 'views/source-rule/platform');
const Merchant = () => import(/* webpackChunkName: "merchant" */ 'views/source-rule/merchant');

const routers = [
  {
    path: '/',
    name: 'Layout',
    redirect: '/login',
    component: Layout,
    children: [
      {
        path: '/login',
        name: 'Login',
        component: Login,
      },
      {
        path: '/add-source',
        name: 'AddSource',
        component: AddSource,
      },
      {
        path: '/add-record',
        name: 'AddRecord',
        component: AddRecord,
      },
      {
        path: '/await-confirm',
        name: 'AwaitConfirm',
        component: AwaitConfirm,
      },
      {
        path: '/await-allocation',
        name: 'AwaitAllocation',
        component: AwaitAllocation,
      },
      {
        path: '/allocation-record',
        name: 'AllocationRecord',
        component: AllocationRecord,
      },
      {
        path: '/source-details',
        name: 'SourceDetails',
        component: SourceDetails,
      },
      {
        path: '/test-source',
        name: 'TestSource',
        component: TestSource,
      },
      {
        path: '/set-allocation-way',
        name: 'SetAllocationWay',
        component: SetAllocationWay,
      },
      {
        path: '/platform',
        name: 'Platform',
        component: Platform,
      },
      {
        path: '/Merchant',
        name: 'Merchant',
        component: Merchant,
      },
    ],
  },
];

export default routers;
