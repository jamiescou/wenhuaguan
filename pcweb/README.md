# 湖南省数字文化馆--pcweb

## 项目介绍
> 这是PC端项目

## 软件架构
### 一、总目录结构
```
├── pcweb                           # 项目名称（湖南省pcweb）
│   ├── bin                         # 项目启动入口
│   ├── config                      # 配置项（入口index.js，根据业务需要配置不同内容）
│   ├── controller                  # 业务处理（按模块划分）
│   ├── middleware                  # nodejs中间件（全局变量等）
│   ├── model                       # 数据内容（按模块划分）
│   ├── public                      # 静态资源
│   │   ├── javascripts/            
│   │   ├── styles/                 
│   │   ├── images/                 
│   │   ├── fonts/                  
│   ├── view                        # 页面
│   ├── util                        # 公用函数
│   ├── app.js                      # 项目入口文件
│   ├── gulpfile.js                 # 样式编译
│   ├── readme.md                    

```
### 1.1  javascripts目录
```
├──javascripts/                        
│   ├── libs/                       # 第三方插件库
│   │   ├── jquery.js 
│   │   ├── swiper.js 
│   │   ├── video.js 
│   │   ├── validate.js(表单验证) 
│   │   ├── moment.js(时间)
│   │   ├── lodash.js(工具库)
│   │   ├── cropper.js(截图)
│   ├── xxx.js                      # 项目js文件
```
### 1.2  styles目录
```
├──styles/                        
│   ├── base/                      # 存放项目中的基础文件，如重置、排版规范、全局变量、函数、混合宏和占位符
│   │   ├── _normalize.css 
│   │   ├── _iconfont.css 
│   │   ├──  _variables.scss
│   │   ├──  _functions.scss
│   │   ├──  _mixins.scss
│   ...
|
│   ├── components/                # 存放组件/部件,方便移植
│   │   ├── _buttons.scss 
│   │   ├── _carousel.scss 
|   ...
|                                  # 页面有特定的样式（如列表页面list、详情页面detail）
│   ├──  home.scss
│   ├──  login.scss
│   ├──  inex.scss                   

字体图标，使用iconfont
```
### 1.3  view目录
```
├──views/                        
│   ├── commons/                      # 公用局部页面
│   │   ├── head.ejs
│   │   ├── header.ejs
│   │   ├── footer.ejs
│   ├── index.ejs                     # 首页
│   ├── xxx/                          # 按模块划分。例：activitys/、trian/

```
## 安装插件
```
npm install
```

### 开发启动
```
npm run dev
```

### 生产构建
```
npm run style:dist
pm2 startOrRestart pm2-production.json
```

