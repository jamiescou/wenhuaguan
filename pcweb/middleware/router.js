const Router = require('koa-router')
const glob = require('glob')
// const path = require('path')
// const resolve = path.resolve;
// const _ = require('lodash')

// const isArray = x => _.isArray(x) ? x : [x] // 判断是否是数组，非数组转换成数组
// const symbolPrefix = Symbol('prefix')
// const normalizePath = path => path.startsWith('/') ? path : `/${path}`
// let routersMap = new Map()

class Route {
    constructor(app, apiPath) {
        this.app = app
        this.router = new Router()
        this.routePath = apiPath
    }

    init() {
        let files = glob.sync(this.routePath);
        files.forEach((pathUrl) => {
            // console.log('pathUrlpathUrl', pathUrl)
            let pubRouter = require(pathUrl)
            this.app.use(pubRouter.routes(), pubRouter.allowedMethods())
        });
    }
}
module.exports = Route