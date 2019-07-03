/*************************************************************
 * 拦截需要登录的页面
 *************************************************************/
const url = require('url')
const _ = require('lodash')
const users = require('../models/users')
const isArray = x => _.isArray(x) ? x : [x] // 判断是否是数组，非数组转换成数组
  function filter(authRouters) {
    return async (ctx, next) => {
        let parseUrl = url.parse(ctx.req.url)
        authRouters = isArray(authRouters);
        if (parseUrl.pathname.indexOf('fonts') < 0&&parseUrl.pathname.indexOf('login') < 0&&parseUrl.pathname.indexOf('styles')<0&&parseUrl.pathname.indexOf('javascripts')<0&&parseUrl.pathname.indexOf('images')<0) { //主要用于系统扫码登录和弹框扫码登录后页面跳转
            ctx.session.previousUrl = ctx.url; 
        }
        let refreshSessionPage=['train','venue','activity','user','volunteer'];
        for (const router of refreshSessionPage) {  
            if (parseUrl.pathname.indexOf(router)>=0 && ctx.session.user != undefined) {
               let userId= ctx.session.user.id;
               ctx.session.user=await users.fetchUserInfo(userId);
            }
        }

        for (const router of authRouters) {
            let regexp = new RegExp('^' + router, 'gi');
            //让匹配的路由并且没有用户信息的页面，跳转到登录页
            if (parseUrl.pathname.match(regexp) && ctx.session.user == undefined) {
                // console.log('要登录哦')
                return ctx.redirect('/login/')
            }
        }

        return next();
    }
}
module.exports = filter