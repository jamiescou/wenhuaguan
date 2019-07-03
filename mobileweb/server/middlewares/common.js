import session from 'koa-session2'
// import bodyParser from 'koa-bodyparser'
import koaBody from 'koa-body'
import conf from '../../config'
import { getToken, unitList, fetchRoot, getRegion, getUintByDomain } from '../api/sys'
import { getFileUrl } from '../api/util'
// import { getFileUrl, RedisStore } from '../api/util'
const logUtil = require('../api/log-util')
const Store = require('./redis-store')
// let RedisObj = new RedisStore() // 实例对象

export const addBody = app => {
    app.use(koaBody({ multipart: true, json: true, form: true, text: true }));
}

/**
 * 缓存
 * @param {Object} app koa示例对象
 */
export const addSession = app => {
    app.keys = ['hn']
    const CONFIG = {
        maxAge: 86400000, // 1天
        store: new Store(conf.redis),
        // overwrite: true,
        // signed: true,
        // rolling: false
    }
    app.use(session(CONFIG))
}

// 排序字段
const remandFields = { 1: 'topTime1', 2: 'topTime2', 3: 'topTime3' }

/**
 * 文化馆信息处理
 * @param {Object} unit 文化馆
 */
async function unitInfo(unit) {
    delete unit.parent
    let region = await getRegion(unit.region) // 文化馆的区域信息
    unit.unitRegion = region
    unit.logoPic = getFileUrl(unit.logoPic);
    unit.coverPic = getFileUrl(unit.coverPic);
    return unit;
}
/**
 * 根据域名取得所属文化馆
 */
export const addUnit = app => {
    app.use(async (ctx, next) => {
        let host = ctx.req.headers.host;
        let curUnit = await getUintByDomain(host)
        curUnit = await unitInfo(curUnit)
        ctx.curUnit = curUnit
        ctx.topfield = remandFields[curUnit.unitRegion.level] || 'topTime3'
        // let connectionResult = await RedisObj.connection()
        // if (connectionResult) {
        //     let curUnit = null;
        //     let hasCult = await RedisObj.exists('m-cultCenter')
        //     if (hasCult) {
        //         curUnit = await RedisObj.getHashData('m-cultCenter', host)
        //         if (!curUnit) {
        //             curUnit = await RedisObj.getHashData('m-cultCenter', 'rootUnit')
        //         }
        //         curUnit = JSON.parse(curUnit)
        //     } else {
        //         let unitsDtList = await unitList('type:org&page=0&size=-1&sort=seqno~desc') // 获取所有的文化馆
        //         let rootUnit = await unitInfo(await fetchRoot());
        //         unitsDtList = unitsDtList.content;
        //         let data = {};
        //         if (unitsDtList.length) {
        //             for (let i = 0; i < unitsDtList.length; i++) {
        //                 let element = unitsDtList[i];
        //                 if (element.mobileSite && element.mobileSite !== '') {
        //                     element = await unitInfo(element)
        //                     data[element.mobileSite] = JSON.stringify(element)
        //                     if (host === element.mobileSite) {
        //                         curUnit = element;
        //                     }
        //                 }
        //             }
        //         }
        //         data['rootUnit'] = JSON.stringify(rootUnit);
        //         await RedisObj.setHashData('m-cultCenter', data, 60 * 60) // 一小时过期
        //         if (!curUnit) {
        //             curUnit = rootUnit;
        //         }
        //     }

        //     ctx.curUnit = curUnit
        //     ctx.topfield = remandFields[curUnit.unitRegion.level] || 'topTime3'
        // }
        await next();
    })
}

/**
 * 获取接口的Token信息
 */
async function getTokenFun() {
    let basicAuth = new Buffer(conf.token.username + ':' + conf.token.pwd).toString('base64');
    basicAuth = 'Basic ' + basicAuth;
    let res = await getToken(basicAuth, conf.token.grant);
    let expiresDate = new Date();
    expiresDate.setMinutes(expiresDate.getMinutes() + 4); // 过期时间,5分钟
    let token = {
        accesstoken: res.access_token,
        tokenType: res.token_type,
        scope: res.scope,
        expires_in: expiresDate.getTime()
    }

    global['szwhg_token'] = token;
};

/**
 * 添加全局Token
 * @param {Object} app koa实例对象
 */
export const addToken = app => {
    app.use(async (ctx, next) => {

        if (!global['szwhg_token']) {
            await getTokenFun();
        } else {
            let token = global['szwhg_token'];
            const expiresIn = token.expires_in;
            const now = (new Date().getTime())

            //过期过期
            if (now > expiresIn) {
                global['szwhg_token'] = null;
                await getTokenFun();
            }
        }
        await next();
    })
}

/**
 * 记录日志
 * @param {Object} app koa实例
 */
export const handlerError = (app) => {
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
            let status = error.statusCode || error.status || 500;
            let message = error.message || '服务器错误';
            ctx.status = status;
            ctx.body = message;

            // ctx.status = status;
            // ctx.throw(status, message)
            // ctx.app.emit('error', error, ctx) // 手动释放error事件，让监听函数生效
        }
    })
}
