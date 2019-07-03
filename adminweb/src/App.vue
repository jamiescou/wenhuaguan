<template>
    <div id="app">
        <router-view @login="loginDirect"></router-view>
    </div>
</template>

 
</script> 
<script>
import { session, deepcopy } from '@/util'
import { GENERATEROUTES, USERINFO, REFRESH, REGIONS, LOGOUT, LOCAL_TOKEN, REMAND_FIELD } from '@/stores/types';
import Api from '@/api'
import routeMap, { home } from '@/routes/route_map'
const remandFields = { 1: 'topTime1', 2: 'topTime2', 3: 'topTime3' }
export default {
    name: 'app',
    data() {
        return {
            menuData: null,
            userData: null
        }
    },
    methods: {
        signIn(callback) {
            let self = this;
            // 检查登录状态
            let local = session(LOCAL_TOKEN)
            if (!local || !local.accesstoken) {
                return self.$router.push({ path: '/login', query: { from: self.$router.currentRoute.fullPath } })
            } else {
                this.$store.dispatch(REFRESH)
                this.$store.dispatch(REGIONS)
            }
            // 获取用户信息及权限数据
            this.$store.dispatch(USERINFO).then(res => {
                if (res.orgUnit) {
                    let orgRegion = this.$store.getters.regions.find(x => x.code === res.orgUnit.region);
                    if (orgRegion) {
                        this.$store.commit(REMAND_FIELD, remandFields[orgRegion.level] || 'topTime3')
                    }
                }
                this.$store.dispatch(GENERATEROUTES, { unitid: res.unit.id, username: res.username }).then((menus) => { // 生成可访问的路由表

                    menus.splice(0, 0, home)
                    self.menuData = menus;
                    // 若无可用路由限制访问
                    if (!menus || !menus.length) {
                        session(LOCAL_TOKEN, '');
                        return document.body.innerHTML = ('<h1>账号访问受限，请联系系统管理员！</h1>');
                    }
                    // 动态注入路由
                    self.extendRoutes(menus);
                    //执行回调
                    typeof callback === 'function' && callback();
                });
            });

        },
        extendRoutes(allowedRouter) {
            let vm = this;
            let actualRouter = deepcopy(allowedRouter) //.slice(0);
            actualRouter.map(e => {
                //为动态路由添加独享守卫
                return e.beforeEnter = function(to, from, next) {
                    next()
                }
            });
            let originPath = deepcopy(routeMap)// routeMap.slice(0);
            originPath[0].children = actualRouter;

            vm.$router.addRoutes(originPath.concat([{
                path: '*',
                redirect: '/404'
            }]));
        },
        // 登录重定向
        loginDirect(newPath, loginObj) {
            this.signIn(() => {
                loginObj.loading = false;
                this.$router.replace({ path: newPath || '/' });
            });
        }
    },
    created() {
        this.signIn()
    }
}
</script>
<style>
#app {
  width: 100%;
  height: 100%;
}
</style>

