import Router from 'koa-router'
import path from 'path'
import conf from '../../config'
import glob from 'glob'

const r = url => path.resolve(__dirname, url)

export const router = app => {
    const router = new Router()
    const apiPath = r('../routes/*.js')
    const files = glob.sync(apiPath);

    files.forEach((pathUrl) => {
        let filename = path.basename(pathUrl)
        let pubRouter = require(`../routes/${filename}`);
        router.use(pubRouter.routes(), pubRouter.allowedMethods())
    });

    if (conf.SITE_PREFIX) {
        router.prefix(conf.SITE_PREFIX)
    }

    app.use(router.routes())
    app.use(router.allowedMethods())

}

// const Router = require('koa-router')
// const path = require('path')
// const glob = require('glob')
// // const fs = require('fs')
// const router = new Router()

// // fs.readdirSync(path.resolve(__dirname, '../routes')).filter((filename) => {
// //     return filename !== path.basename(__filename)
// // }).forEach((filename) => {
// //     let pubRouter = require(`../routes/${filename}`)
// //     router.use(pubRouter.routes(), pubRouter.allowedMethods())
// // })
// const files = glob.sync(path.resolve(__dirname, '../routes/*.js'));
// files.forEach((pathUrl) => {
//     let filename = path.basename(pathUrl)
//     let pubRouter =  require(`../routes/${filename}`);
//     // let pubRouter = require(pathUrl)
//     router.use(pubRouter.routes(), pubRouter.allowedMethods())
// });

// module.exports = function(app, prefix) {
//     if (prefix) {
//         router.prefix(prefix)
//     }
//     app.use(router.routes())
//     app.use(router.allowedMethods())
// }
