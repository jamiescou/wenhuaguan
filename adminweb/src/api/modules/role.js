// ==============================================================
// 【POST】/sys/units/{id}/roles/{roleid}/managers/{managerId} 增加角色的管理员
// 【DELETE】/sys/units/{id}/roles/{roleid}/managers/{managerId} 删除角色的管理员
// 【GET】/sys/units/{id}/roles/{roleid}/grants 查询角色菜单权限
// 【PUT】/sys/units/{id}/roles/{roleid}/grants 修改角色菜单权限
// 【POST】/sys/units/{id}/roles 创建角色
// 【DELETE】/sys/units/{id}/roles/{roleid} 删除角色
// 【PUT】/sys/units/{id}/roles/{roleid} 修改角色基本信息
// 【GET】/sys/units/{id}/roles/{roleid} 获取角色详情
// 【GET】/sys/units/{id}/roles 查询所有角色
// 【GET】/sys/units/{id}/roles/{roleid}/managers 查询角色的管理员列表
// 【PUT】/sys/units/{id}/roles/{roleid}/managers 重新设置角色的管理员
// =========================  角色管理  ============================
import Fetch from '../fetch';
export default {
    /**
     * 查询所有角色
     * @param {String} id 组织id
     */
    getRoleList(id) {
        return Fetch({
            url: '/sys/units/' + id + '/roles',
            method: 'get'
        });
    },
    /**
     * 获取角色详情
     * @param {String} id 组织id
     * @param {String} roleid 角色id
     */
    getRoleInfo(id, roleid) {
        return Fetch({
            url: '/sys/units/' + id + '/roles/' + roleid,
            method: 'get'
        });
    },
    /**
     *  创建角色
     * @param {String} id 组织id
     * @param {*} data 角色信息
     */
    addRoleItem(id, data) {
        return Fetch({
            url: '/sys/units/' + id + '/roles',
            method: 'post',
            data: data
        });
    },
    /**
     *  修改角色基本信息
     * @param {String} id 组织id
     * @param {*} roleid 角色id
     * @param {*} data 角色信息
     */
    modifyRole(id, roleid, data) {
        return Fetch({
            url: '/sys/units/' + id + '/roles/' + roleid,
            method: 'put',
            data: data
        });
    },
    /**
     *  删除角色
     * @param {String} id 组织id
     * @param {*} roleid 角色id
     */
    delRole(id, roleid) {
        return Fetch({
            url: '/sys/units/' + id + '/roles/' + roleid,
            method: 'delete'
        });
    },
    /**
     * 查询角色菜单权限
     * @param {String} id 组织id
     * @param {*} roleid 角色id
     */
    getRoleMenuAuth(id, roleid) {
        return Fetch({
            url: '/sys/units/' + id + '/roles/' + roleid + '/grants',
            method: 'get'
        });
    },
    /**
     * 修改角色菜单权限
     * @param {String} id 组织id
     * @param {*} roleid 角色id
     * @param {*} data 权限内容
     */
    modifyRoleMenuAuth(id, roleid, data) {
        return Fetch({
            url: '/sys/units/' + id + '/roles/' + roleid + '/grants',
            method: 'put',
            data: data
        });
    },
    /**
     * 增加角色的管理员
     * @param {String} id 组织id
     * @param {String} roleid 角色id
     * @param {String} mid 管理员id
     */
    addManagerForRole(id, roleid, mid) {
        return Fetch({
            url: '/sys/units/' + id + '/roles/' + roleid + '/managers/' + mid,
            method: 'post'
        });
    },
    /**
     * 删除角色的管理员
     * @param {String} id 组织id
     * @param {String} roleid 角色id
     * @param {String} mid 管理员id
     */
    delManagerForRole(id, roleid, mid) {
        return Fetch({
            url: '/sys/units/' + id + '/roles/' + roleid + '/managers/' + mid,
            method: 'delete'
        });
    },
    /**
     * 查询角色的管理员列表
     * @param {String} id 组织id
     * @param {String} roleid 角色id
     */
    getManagerForRole(id, roleid) {
        return this.getAccountList(id, '', 1, -1).then((res) => {
            return res;
        }).then((self) => {
            return Fetch({
                url: '/sys/units/' + id + '/roles/' + roleid + '/managers',
                method: 'get'
            }).then((res) => {
                let selected = [];
                if (res && res.length > 0) {
                    for (let m of res) {
                        selected.push(m.id);
                    }
                }
                return {
                    member: self.content, // 组织下的全部管理员
                    selected: selected // 已选角色成员
                }
            });
        })
    },
    /**
     * 重新设置角色的管理员
     * @param {String} id 组织id
     * @param {String} roleid 角色id
     * @param {Array} managers 角色成员
     */
    setManagerForRole(id, roleid, managers) {
        return Fetch({
            url: '/sys/units/' + id + '/roles/' + roleid + '/managers',
            method: 'put',
            data: managers
        });
    }
}
