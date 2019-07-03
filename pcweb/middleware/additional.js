/*************************************************************
 * 附加参数
 *************************************************************/
const assist = require('../util/assist');
const sysModel = require('../models/sys');
const config = require('../config')
// const Redis = require('ioredis');
const {
    redisObj
} = require('./redis-store')
let RedisObj = new redisObj()

const additional = function(config) {

    // 微信登录信息
    let wxLogin = {
        appID: config.wechart.appID,
        redirect_uri: 'http://' + config.wechart.domain + '/login/wechart',
        wechartBind_uri: 'http://' + config.wechart.domain + '/login/bindwechart',
        state: config.wechart.appSecret,
        test: '{a"b:c[d]e}'
    }

    return async (ctx, next) => {

        // 用户信息
        let user = ctx.session.user || null;
        if (user) {
            user = JSON.parse(JSON.stringify(user));
            const IDENTIFY_STATUS = {
                'Not': '未认证',
                'Wait': '审核中',
                'Yes': '已认证',
                'Fail': '认证失败'
            };
            user.pic = assist.getFileUrl(user.pic);
            user.identifyName = IDENTIFY_STATUS[user.identifyStatus];
            // global['user'] = ctx.session.user.name;
        }
       
        ctx.state = Object.assign(ctx.state, {
            'user': user,
            'token':ctx.session.token||null,
            'wxLogin': wxLogin,
            'curUnit': ctx.curUnit
        });
        return next();
    }
};

module.exports = additional
