import Vue from 'vue'
import Router from 'vue-router'
import NProgress from 'nprogress' // Progress 进度条

Vue.use(Router)

let baseRoute = [{
    path: '/login',
    menuName: '登录',
    component: (resolve) => require(['@/pages/login/login.vue'], resolve)
},
{
    path: '/sendpwd',
    menuName: '忘记密码',
    component: (resolve) => require(['@/pages/login/sendpwd.vue'], resolve)
}, {
    path: '/401',
    menuName: '无权访问',
    component: (resolve) => require(['@/pages/401.vue'], resolve)
}, {
    path: '/404',
    menuName: '找不到页面',
    component: (resolve) => require(['@/pages/404.vue'], resolve)
}]

let router = new Router({
    routes: baseRoute
})

router.beforeEach((to, from, next) => {
    NProgress.start()
    next()
    NProgress.done()
})

router.afterEach(() => {
    NProgress.done() // 结束Progres
})
export default router
