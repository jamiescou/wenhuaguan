# 湖南省数字文化馆--adminweb


## 项目介绍
这是管理端项目

## 软件架构
```
|-- build                            // webpack编译打包
|-- config                           // 项目开发环境配置
|   |-- publish_config                  // 发布配置
|   |-- development.js                  // 开发环境变量
|   |-- production.js                   // 生产环境变量
|   |-- test.js                         // 测试环境变量
|-- server                           // node启动入口（本地上传的服务接口）
|-- src                              // 源码目录
|   |-- api                             // api接口调用
|   |-- assets                          // 图片等资源（经过webpack编译）
|   |-- components                      // vue公共组件
|   |-- mixins                          // 公用继承对象（如base-table)
|   |-- filters                         // 过滤器
|   |-- routes                          // vue路由
|   |-- stores                          // vuex的状态管理
|   |-- styles                          // 样式
|   |-- util                            // 公用工具类，如验证规则、时间转换等
|   |-- views                           // 页面
|   |-- App.vue                         // 页面入口文件
|   |-- main.js                         // 程序入口文件，加载各种公共组件
|-- static                           // 静态资源，如图片等
|-- .babelrc                         // ES6语法编译配置
|-- .editorconfig                    // 开发编辑配置（可不用配）
|-- .eslintignore                    // 忽略eslint语法检验配置
|-- .eslintrc                        // javascript代码检测规则
|-- .gitignore                       // git上传需要忽略的文件格式
|-- .postcss.config                  // postcss编译配置
|-- .jsbeautifyrc                    // 定义代码格式（vscode、sublineText、atom等编辑器有效）
|-- pm2-production.json              // 生产环境pm2发布配置
|-- vue.config.js                    // 项目构建(webpack)相关配置，如代理
|-- README.md                        // 项目说明
|-- package.json                     // 项目基本信息
|-- README.md                        // 项目说明
```

## 安装插件
```
npm install
```

### 开发启动
```
npm run dev
```

### 本地编译访问
```
npm run build
npm run dev:server
浏览器访问：localhost:3000
```


### 生产构建与发布
```
npm run build
pm2 startOrRestart pm2-production.json
```

# 开发
## 文件命名
统一小写，单词与单词之间用“_”下划线连接

## 配置文件
1、环境配置文件，入口为config/index.js;根据不同的环境变量配置找不同的配置文件。
2、config/publish/index.js根据pm2配置的环境变量配置找不同的配置文件，配置程序中需要的授权用户、文件地址、api接口地址等

## 路由定义，参数说明
```
权限策略大致流程

登录 ——> 获取该用户权限列表 ——>权限码与本地的路由匹配过滤，生成能够访问的菜单 ——> 点击菜单，进入页面
```

****
****