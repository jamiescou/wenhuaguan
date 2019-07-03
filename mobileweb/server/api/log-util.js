const moment = require('moment');

class LogUtils {
    /**
     * 格式化错误日志
     *
     * @param {any} ctx 上下文
     * @param {any} err 错误内容
     * @param {any} resTime 响应时间
     * @returns
     */
    formatError(ctx, err, resTime) {
        resTime = (resTime / 1000) + 's' // 请求花费的时间
        let method = ctx.method // 访问类型
        let url = ctx.url // 请求地址
        let headers = JSON.stringify(ctx.req.headers) // 请求头
        let params = null // 传递参数
        if (method === 'GET') {
            params = ctx.request.query
        } else if (method === 'POST') {
            params = ctx.request.body
        }

        if (ctx.params) {
            params = Object.assign({}, ctx.params, params)
        }
        let message = err.message
        let stack = err.stack
        return {
            request: {
                method,
                url,
                params,
                headers,
                resTime,
            },
            message,
            stack
        }
    }

    /**
     * 格式化接口调用错误日志
     *
     * @param {any} ctx 上下文
     * @param {any} err 错误内容
     * @param {any} resTime 响应时间
     * @returns
     */
    formatSerError(config, err) {
        let method = config.method // 访问类型
        let url = config.url // 请求地址
        let data = config.data || '' // 传递参数
        let message = err.message
        let status = '';
        if (err.response) {
            status = err.response.status;
            message = err.response.data ? err.response.data.message || message : message;
        }
        let stack = err.stack
        return {
            method,
            url,
            data,
            status,
            message,
            stack
        }
    }

    /**
     *  格式化Request日志
     * 
     * @param {any} ctx 上下文
     * @param {any} costTime 请求时间长度（单位毫秒）
     * @returns 
     */
    formatRes(ctx, costTime) {
        costTime = (costTime / 1000) + 's' // 请求花费的时间
        let method = ctx.method // 访问类型
        let url = ctx.url // 请求地址
        let clientIp = ctx.request.ip // 客户端ip
        let headers = JSON.stringify(ctx.req.headers) // 请求头
        let params = null // 传递参数
        if (method === 'GET') {
            params = ctx.request.query
        } else if (method === 'POST') {
            params = ctx.request.body
        }

        if (ctx.params) {
            params = Object.assign({}, ctx.params, params)
        }
        let size = (ctx.length / 1024) + ' KB'
        let status = ctx.status
        let type = ctx.type
        return {
            method,
            url,
            params,
            'client ip': clientIp,
            headers,
            costTime,
            size,
            status,
            type
        }
    }
}

// ===================================== 日志处理 ====================================
//
const log4js = require('koa-log4')
const logConfigs = require('../../config/log-config')
let log4Util = new LogUtils();
log4js.configure(logConfigs); // 加载配置文件

// 调用预先定义的日志
let errorLogger = log4js.getLogger('errorLogs'); // 错误日志
let resLogger = log4js.getLogger('resLogs'); // 响应日志
let busLogger = log4js.getLogger('busLogs'); // 响应日志

let logUtil = {};
// 封装错误日志
logUtil.logError = function(ctx, error, resTime) {
    if (ctx && error && resTime) {
        errorLogger.error(log4Util.formatError(ctx, error, resTime));
    } else {
        errorLogger.error(log4Util.formatSerError(ctx, error))
    }
};

// 封装响应日志
logUtil.logResponse = function(ctx, resTime) {
    if (ctx) {
        resLogger.info(log4Util.formatRes(ctx, resTime));
    }
};

// 封装业务日志
logUtil.logbusiness = function(msgobj) {
    busLogger.info(msgobj.join(','));
};

module.exports = logUtil;
