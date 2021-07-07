## 特性

- 内置多进程管理
- 高度可扩展的插件机制
- 深度框架定制
- 丰富的[插件](https://github.com/search?q=topic%3Aegg-plugin&type=Repositories)

> 支持 Node.js 8.x 及以上版本。

## 快速开始

<!-- add docs here for user -->

查看 [Egg 文档][egg] 更多细节.

### 开发环境

```bash
// 安装
$ npm i
// 开发
$ npm run dev
$ open http://localhost:7001/
```

### 测试环境部署

```bash
// 客户端编译
$ npm build

// node服务端
$ npm start
$ npm stop
```

### 预发布环境部署

```bash
// 客户端编译
$ npm build:release

// node服务端
$ npm start:release
$ npm stop
```

### 正式环境部署

```bash
// 客户端编译
$ npm build:production

// node服务端
$ npm start:production
$ npm stop
```

### npm scripts

- 使用 `npm run lint` 进行代码风格检查.
- 使用 `npm test` 进行单元测试.
- 使用 `npm run autod` 自动检测依赖项升级
                     
, 查看关于 [autod](https://www.npmjs.com/package/autod) 更多详情.


[egg]: https://eggjs.org
