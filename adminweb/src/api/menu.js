// ===============================================================
// 【GET】/sys/menus 获取所有菜单
// 【POST】/sys/menus 创建菜单
// 【GET】/sys/menus/{id} 获取单个菜单
// 【PUT】/sys/menus/{id} 修改菜单
// 【DELETE】/sys/menus/{id} 删除菜单
// 【GET】/sys/menus/topmenus/tree 获取顶级菜单树
// =========================  菜单管理  ============================
import Fetch from './fetch';

const menusRequests = {
    /**
     * 获取所有菜单
     */
    getMenus() {
        return Fetch({
            url: '/sys/menus',
            method: 'get'
        });
    },
    /**
     *  创建菜单
     * @param {Object} menuData 场馆信息
     */
    addMenus(menuData) {
        return Fetch({
            url: '/sys/menus',
            method: 'post',
            data: menuData
        });
    },
    /**
     * 获取单个菜单
     * @param {String} id 菜单id
     */
    getMenu(id) {
        return Fetch({
            url: '/sys/menus/' + id,
            method: 'get'
        });
    },
    /**
     * 修改菜单
     * @param {String} id 菜单id
     * @param {Object} menuData 场馆信息
     */
    modifyMenu(id, menuData) {
        return Fetch({
            url: '/sys/menus/' + id,
            method: 'put',
            data: menuData
        });
    },
    /**
     * 删除菜单
     * @param {String} id 菜单id
     */
    delMenu(id) {
        return Fetch({
            url: '/sys/menus/' + id,
            method: 'delete'
        });
    },
    /**
     * 获取顶级菜单树
     */
    getTopMenus() {
        return Fetch({
            url: '/sys/menus/topmenus/tree',
            method: 'get'
        });
    }
}
export default menusRequests;
