/*************************************************************
 * 静态资源等公用的中间件
 *************************************************************/
const koaBody = require('koa-body')
const session = require('koa-session2')
var staticServe = require('koa-static')
const views = require('koa-views')
const _ = require('lodash')
const sysModel = require('../models/sys')
const logUtil = require('../util/log-util')
const config = require('../config')
const assist = require('../util/assist');
const { RedisStore } = require('./redis-store')

const isArray = x => _.isArray(x) ? x : [x] // 判断是否是数组，非数组转换成数组

// ctx.body解析
const addBody = app => {
    app.use(koaBody({
        multipart: true,
        json: true,
        form: true,
        text: true,
        formidable: {
            maxFileSize: 500 * 1024 * 1024
        }
    }))
}

const addSession = app => {
    app.keys = ['sz']
    const CONFIG = {
        maxAge: 30 * 60 * 1000, // 半小时有效期
        store: new RedisStore(config.redis),
        // domain: config.pcweb.domain
    }
    app.use(session(CONFIG, app));
}

async function getToken() {
    basicAuth = new Buffer('pcweb-client:123').toString('base64');
    let token = {
        "auth": "Basic " + basicAuth,
        "grant": "client_credentials"
    };
    let res = await sysModel.getToken(token.auth, token.grant);

    let expiresDate = new Date();
    expiresDate.setMinutes(expiresDate.getMinutes() + 4); // 过期时间,5分钟
    let resobj = {
        accesstoken: res.access_token,
        tokenType: res.token_type,
        scope: res.scope,
        expires_in: expiresDate.getTime()
    }
    // console.log('token to session:', resobj);
    global.szwhg_token = resobj;
};

const generalToken = app => {
    app.use(async (ctx, next) => {
        if (!global['szwhg_token']) {
            await getToken();
        } else {
            let token = global['szwhg_token'];
            const expiresIn = token.expires_in;
            const now = (new Date().getTime())

            //过期过期
            if (now > expiresIn) {
                global['szwhg_token'] = null;
                await getToken();
            }
        }
        await next();
    })
}

// 添加静态资源
const AddStaticResource = (app, paths) => {
    const pathList = isArray(paths);
    pathList.forEach(x => {
        app.use(staticServe(x))
    })
}

// 设置模板目录
const AddViews = (app, path) => {
    app.use(views(path, {
        extension: 'ejs'
    }))
}

// 外层处理 负责所有中间件的错误处理
async function errorRender(ctx, status, message) {
    switch (status) {
        case 401:
            await ctx.redirect('back')
            break;
        case 400:
            await ctx.render('500', {
                message: ''
            });
            break;
        case 404:
            await ctx.render('404');
            break;
        case 500:
            await ctx.render('500', {
                data: message
            });
            break;
    }
}
const handlerError = (app) => {
    app.use(async (ctx, next) => {
        const start = new Date(); // 响应开始时间
        var ms; // 响应间隔时间
        try {
            await next()
            ms = new Date() - start;
            logUtil.logResponse(ctx, ms); //记录响应日志
        } catch (error) {
            
            ms = new Date() - start;
            logUtil.logError(ctx, error, ms); // 记录异常日志
            let status = error.status || 500;
            let message = error.message || '服务器错误';
            ctx.status = status;
            await errorRender(ctx, ctx.status, message);
            // ctx.app.emit('error', error, ctx) // 手动释放error事件，让监听函数生效
        }
    })
}

const remandFields = { 1: 'topTime1', 2: 'topTime2', 3: 'topTime3' }

// 处理文化馆信息
async function unitInfo(unit) {
    delete unit.parent
    let region = await sysModel.getRegionInfo(unit.region) // 文化馆的区域信息
    unit.unitRegion = region
    unit.logoPic = assist.getFileUrl(unit.logoPic);
    unit.coverPic = assist.getFileUrl(unit.coverPic);
    return unit;
}

// 当前文化馆
const addUnit = (app) => {
    app.use(async (ctx, next) => {
        let host = ctx.req.headers.host;
        let curUnit = await sysModel.getUintByDomain(host)
        curUnit = await unitInfo(curUnit)
        ctx.curUnit = curUnit
        ctx.topfield = remandFields[curUnit.unitRegion.level] || 'topTime3'

        // let host = ctx.req.headers.host;
        // let curUnit = null
        // let connectionResult = await RedisObj.connection()
        // if (connectionResult) {
        //     let hasCult = await RedisObj.exists('pc-cultCenter')
        //     if (hasCult) {
        //         curUnit = await RedisObj.getHashData('pc-cultCenter', host)
        //         if (!curUnit) {
        //             curUnit = await RedisObj.getHashData('pc-cultCenter', 'rootUnit')
        //         }
        //         curUnit = JSON.parse(curUnit)
        //     } else {
        //         let unitsDtList = await sysModel.fetchunitlist('type:org&page=0&size=-1&sort=seqno~desc') // 获取所有的文化馆
        //         unitsDtList = unitsDtList.content;
        //         let rootUnit = await unitInfo(await sysModel.fetchroot());
        //         let data = {};
        //         if (unitsDtList.length) {
        //             for (let i = 0; i < unitsDtList.length; i++) {
        //                 let element = unitsDtList[i];
        //                 if (element.site && element.site !== '') {
        //                     element = await unitInfo(element)
        //                     data[element.site] = JSON.stringify(element)
        //                     if (host === element.site) {
        //                         curUnit = element;
        //                     }
        //                 }
        //             }
        //         }
        //         data['rootUnit'] = JSON.stringify(rootUnit);
        //         let setResult = await RedisObj.setHashData('pc-cultCenter', data, 60 * 60) // 一小时过期
        //         if (!curUnit) {
        //             curUnit = rootUnit;
        //         }
        //     }

        //     let topfield = curUnit.unitRegion.level == 1 ? 'topTime1' : curUnit.unitRegion.level == 2 ? 'topTime2' : 'topTime3';
        //     ctx.topfield = topfield;
        //     ctx.curUnit = curUnit;
        // }
        await next();
    })
}

// koa中间件以"先进后出"（first-in-last-out）的顺序执行。
module.exports = function(app, paths) {
    addSession(app)
    addBody(app)
    AddStaticResource(app, paths.static)
    AddViews(app, paths.views)
    handlerError(app)
    generalToken(app)
    addUnit(app)
}
