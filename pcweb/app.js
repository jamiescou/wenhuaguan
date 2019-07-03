const Koa = require('koa')
// const onerror = require('koa-onerror')
const resolve = require('path').resolve;

const config = require('./config');
// -----------------------------  实例化  ------------------------------------------
const app = new Koa()

 
// -----------------------------  middlewares  -------------------------------------------
const commonMiddleware = require('./middleware/common')
const paths = {
  static: __dirname + '/public',
  views: __dirname + '/views'
}
commonMiddleware(app, paths) // 解析body、静态资源、页面模板、日志等中间件

const authFilterMiddleware = require('./middleware/auth')
app.use(authFilterMiddleware(config.authRouter)) // 需要登录的页面拦截

const additionalMiddleware = require('./middleware/additional')
app.use(additionalMiddleware(config)) // 页面渲染的全局数据

// ------------------------------  routes  -----------------------------------------------
const Route = require('./middleware/router');
const apiPath = resolve(__dirname, './controllers/*.js');
const Router = new Route(app, apiPath)
Router.init()

// // error-handling
// app.on('error', (err, ctx) => {
 
//   console.error('server error', err, ctx)
// });

module.exports = app