/**
 * 路由权限控制
 */
import routeMap from '@/routes/route_map'
import { GENERATEROUTES } from './types';
import Api from '@/api';
import { orderBy } from 'lodash';

/**
 * 是否有权限
 * @param {Array} roles 角色集合
 * @param {Object} route 路由对象
 */
function hasPermission(roles, routeCode) {
    if (routeCode) {
        let result = roles.some(role => role.indexOf(routeCode) === 0)
        return result;
    } else {
        return true
    }
}

/**
 * menus  本地所有菜单
 * userMenus 菜单权限取得的数据
 */
const filterRouters = function(menus, userMenus) {
    let roles = userMenus.map(item => item.code);

    let recursion = function(list, parentPath) {
        let routes = [];
        list.forEach((item, index) => {
            let menu = userMenus.find(x => x.code === item.code);
            if (menu) {
                item.icon = menu.icon;
                item.menuName = menu.name;
                item.seqno = menu.seqno;
                item.meta = { menuName: menu.name }
            }
            item.fullpath = (parentPath ? parentPath + '/' : '') + item.path;
            if (item.hidden && hasPermission(roles, item.parent)) { // 有hidden属性表示非菜单路由,权限由parent决定
                if (item.children) {
                    item.children = recursion(item.children, item.fullpath);
                }
                routes.push(item);
            } else {
                if (hasPermission(roles, item.code)) {
                    if (item.children) {
                        item.children = recursion(item.children, item.fullpath);
                    }
                    routes.push(item);
                }
            }
        });
        // 排序 按顺序号
        routes = orderBy(routes, 'seqno', 'asc');

        return routes;
    };
    let result = recursion(menus);
    return result;
}
const deepClone = function(obj) {
    if (Array.isArray(obj)) {
        return obj.map(deepClone)
    } else if (obj && typeof obj === 'object') {
        var cloned = {}
        var keys = Object.keys(obj)
        for (var i = 0, l = keys.length; i < l; i++) {
            var key = keys[i]
            cloned[key] = deepClone(obj[key])
        }
        return cloned
    } else {
        return obj
    }
}

const permission = {
    actions: {
        [GENERATEROUTES]({ commit, state }, user) {
            return new Promise((resolve, reject) => {
                Api.system.getMenuOfManager(user.unitid, user.username).then((res) => {
                    let originPath = deepClone(routeMap[0].children); // routeMap[0].children.slice(0);
                    const accessedRouters = filterRouters(originPath, res); // asyncRouterMap;
                    resolve(accessedRouters);
                });
            })
        }
    }
}

export default permission;
