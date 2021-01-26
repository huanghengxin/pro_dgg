const envs = [
  {
    // 分支对应的配置，本地开发取configs第一条数据，构建时选择分支
    branch: 'dev',
    // 镜像名称
    name: 'qds-sp-crm-0',
    // folder放置当前项目分支打包后文件的目录，通过此目录可以将整个项目前后端打的包放在一个文件夹下0
    folder: 'd-chips',
    // 镜像tag
    // version: '1.0.0',
    // 前端页面访问端口
    port: '10016',
    // apiProxies是项目中调用后端API的地址，请根据项目需要修改其中的参数
    apiProxies: {
      '/api/*': 'https://dspmicrouag.shupian.cn',
    },
    hosts: {},
    // 需要额外注入的全局变量，代码中可直接通过 window.__EXTERNAL_ENVIRONMENT__.xx 使用
    externalEnvironment: {},
    baseUrl: 'https://dcrm.shupian.cn/',
    //应用运行环境如:开发环境、测试环境、生产环境
    SP_SERVER_ENV: 'development',
  },
  {
    // 分支对应的配置，本地开发取configs第一条数据，构建时选择分支
    branch: 'test',
    // 镜像名称
    name: 'qds-sp-crmweb-0',
    // folder放置当前项目分支打包后文件的目录，通过此目录可以将整个项目前后端打的包放在一个文件夹下
    folder: 'tshupian',
    // 镜像tag
    // version: '1.0.0',
    // 前端页面访问端口
    port: '30040',
    // apiProxies是项目中调用后端API的地址，请根据项目需要修改其中的参数
    apiProxies: {
      '/api/*': 'https://tspmicrouag.shupian.cn',
    },
    hosts: {},
    // 需要额外注入的全局变量，代码中可直接通过 window.__EXTERNAL_ENVIRONMENT__.xx 使用
    externalEnvironment: {},
    baseUrl: 'https://tcrm.shupian.cn/',
    //应用运行环境如:开发环境、测试环境、生产环境
    SP_SERVER_ENV: 'test',
  },
  {
    // 分支对应的配置，本地开发取configs第一条数据，构建时选择分支
    branch: 'prod',
    // 镜像名称
    name: 'qds-sp-crmweb-0',
    // folder放置当前项目分支打包后文件的目录，通过此目录可以将整个项目前后端打的包放在一个文件夹下
    folder: 'shupian',
    // 镜像tag
    // version: '1.0.0',
    // 前端页面访问端口
    port: '30040',
    // apiProxies是项目中调用后端API的地址，请根据项目需要修改其中的参数
    apiProxies: {
      '/api/*': 'https://spmicrouag.shupian.cn',
    },
    hosts: {},
    // 需要额外注入的全局变量，代码中可直接通过 window.__EXTERNAL_ENVIRONMENT__.xx 使用
    externalEnvironment: {},
    baseUrl: 'https://p.shupian.cn/',
    //应用运行环境如:开发环境、测试环境、生产环境
    SP_SERVER_ENV: 'production',
  },
];

const config = {
  // 本地开发时，根据这个值匹配envs的配置
  branch: 'prod',

  // 是否为移动端应用，为true时启用px转rem规则
  isH5: false,

  // 子应用名称，作为主应用的匹配规则
  subAppName: 'qds-crm',

  // subApps是微前端主应用加载的所有子应用的配置
  subApps: {},

  // 用于设置不同库之间的代码共享，remotes用来设置需要引用代码的库的信息，
  remotes: {},

  //用于设置不同库之间的代码共享，exposes用来暴露需要共享给其它库使用的代码
  exposes: {},
};

module.exports = {
  config,
  envs,
};
