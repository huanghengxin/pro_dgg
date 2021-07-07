'use strict';
const path = require('path');
// 获取本机IP
function getIPAdress() {
  const interfaces = require('os').networkInterfaces();
  for (const devName in interfaces) {
    if (!devName.includes('Npcap')) {
      const iface = interfaces[devName];
      for (let i = 0; i < iface.length; i++) {
        const alias = iface[i];
        if (
          alias.family === 'IPv4' &&
          alias.address !== '127.0.0.1' &&
          !alias.internal
        ) {
          return alias.address;
        }
      }
    }
  }
}
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = (exports = {});

  // 用于cookie签名密钥，应更改为您自己的密钥并保持安全
  config.keys = appInfo.name + '_1599699446500_2481';
  config.cluster = {
    listen: {
      host: '0.0.0.0',
      port: 7001,
    },
  };
  // 在此处添加中间件配置
  config.middleware = ['gzip', 'errFilter', 'eureka', 'dggCache'];
  config.gzip = {
    threshold: 1024, // 小于 1k 的响应体不压缩
  };
  // 只针对/sercice开头的API进行body处理
  config.bodyParser = {
    match: '/api',
  };
  // 开发环境日志写入路径
  config.logger = {
    level: 'INFO',
    dir: path.join(__dirname, '../../logs/local'), // 保存路径为工程路径下`logs/local`
  };
  // redis集群配置
  config.redis = {
    // redis集群配置
    client: {
      cluster: true, // 是否启动集群
      nodes: [
        {
          // 可以配置多Redis节点
          host: '192.168.254.110', // IP地址
          port: '7002', // 端口号
          family: 'root', // 用户名
          password: '', // 用户密码
          db: '0', // 数据库名称,redis默认16个数据库0-16
          weakDependent: true,
        },
        {
          // 可以配置多Redis节点
          host: '192.168.254.111', // IP地址
          port: '7003', // 端口号
          family: 'root', // 用户名
          password: '', // 用户密码
          db: '0', // 数据库名称,redis默认16个数据库0-16
          weakDependent: true,
        },
        {
          host: '192.168.254.110', // IP地址
          port: '7001', // 端口号
          family: 'root', // 用户名
          password: '', // 用户密码
          db: '0', // 数据库名称,redis默认16个数据库0-16
          weakDependent: true,
        },
        {
          host: '192.168.254.112', // IP地址
          port: '7006', // 端口号
          family: 'root', // 用户名
          password: '', // 用户密码
          db: '0', // 数据库名称,redis默认16个数据库0-16
          weakDependent: true,
        },
        {
          host: '192.168.254.111', // IP地址
          port: '7004', // 端口号
          family: 'root', // 用户名
          password: '', // 用户密码
          db: '0', // 数据库名称,redis默认16个数据库0-16
          weakDependent: true,
        },
        {
          host: '192.168.254.112', // IP地址
          port: '7005', // 端口号
          family: 'root', // 用户名
          password: '', // 用户密码
          db: '0', // 数据库名称,redis默认16个数据库0-16
          weakDependent: true,
        },
      ],
    },
  };

  // eureka相关配置
  config.eureka = {
    instance: {
      app: 'crisps-resource-middle-pc',
      instanceId: `${getIPAdress()}:7001`, // 本地IP和端口
      hostName: getIPAdress(),
      ipAddr: getIPAdress(),
      port: {
        $: 7001,
        '@enabled': 'true',
      },
      homePageUrl: null,
      statusPageUrl: `http://${getIPAdress()}:7001/`, // 状态页面(判断心跳),
      healthCheckUrl: null,
      vipAddress: 'crisps-resource-middle-pc',
      dataCenterInfo: {
        '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
        name: 'MyOwn',
      },
      metadata: {
        version: '2.2',
      },
    },
    requestMiddleware: (requestOpts, done) => {
      requestOpts.auth = {
        user: 'crisps-cloud',
        password: 'TXGSP0F8983269210B8AB880ZYZLF156179',
      };
      done(requestOpts);
    },
    eureka: {
      servicePath: '/eureka/apps/',
      host: '172.16.20.197',
      port: 30001,
    },
  };
  // 配置定时器的日志
  config.customLogger = {
    scheduleLogger: {
      consoleLevel: 'NONE',
      file: 'egg-schedule.log',
    },
  };
  config.validate = {
    // 配置参数校验器，基于parameter
    convert: true, // 对参数可以使用convertType规则进行类型转换
  };
  // 应用监控
  config.xtransit = {
    server: 'ws://192.168.254.210:9090/',
    appId: 6,
    appSecret: '4b1c2053deef0b1ca43ee9ae67100dd5',
    errors: [
      path.join(appInfo.root, 'logs/local/common-error.log'),
      path.join(appInfo.root, 'logs/unittest/common-error.log'),
      path.join(appInfo.root, 'logs/prod/common-error.log'),
    ],
  };
  // 在此处添加个人配置
  const userConfig = {
    // redis默认缓存数据的时长(S秒),产线环境24小时,开发环境1小时
    redisCacheTime: 60 * 5,
    baseUrl: '',
  };
  return {
    config,
    userConfig,
  };
};
