# 湖南省数字文化馆--mobileweb

## 项目介绍
> 这是移动端项目，使用了Vue的服务端框架[Nuxt.js docs](https://github.com/nuxt/nuxt.js). nodejs（koa）中间转调用java后台服务端

## 软件架构
```
|-- .nuxt                            // build后生成的部署文件
|-- build                            // backpack对server目录编译后生成的文件
|-- components                       // 公共组件
|-- config                           // 配置文件（api调用地址等）
|-- layouts                          // 个性化布局文件
|-- middleware                       // 页面或一组页面渲染之前的中间件
|-- pages                            // 组织应用的路由及视图
|-- plugins                          // 第三方插件
|-- server                           // node服务
|   |-- api                             // api接口调用
|   |-- middlewares                     // node端中间件
|   |-- routes                          // 路由
|   |-- wechat_lib                      // 微信相关库
|   |-- index                        
|-- static                           // 静态资源（样式、脚本等）
|-- store                            // vuex的状态管理
|-- util                             // 公用工具库，如验证规则、时间转换等
|-- .babelrc                         // ES6语法编译配置
|-- .eslintrc                        // javascript代码检测规则
|-- .postcss.config                  // postcss编译配置
|-- .jsbeautifyrc                    // 定义代码格式
|-- .gitignore                       // git上传需要忽略的文件格式
|-- backpack.config.js               // node端打包配置
|-- start.js                         // node端启动入口
|-- nuxt.config.js                   // 项目构建(webpack)相关配置，如代理
|-- README.md                        // 项目说明
|-- package.json                     // 项目基本信息
```

## 构建与启动

``` bash
# 安装依赖
npm install # Or yarn install

# 开发启动 热更新 localhost:3000
npm run dev

# 生产构建与发布
npm run build
npm start
pm2 startOrRestart pm2-production.json

```