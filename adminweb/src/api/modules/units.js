// ================================================================
// 【GET】 /sys/units 查询组织机构列表
// 【POST】 /sys/units 创建组织
// 【GET】 /sys/units/{id} 获取组织信息
// 【PUT】 /sys/units/{id} 修改组织信息
// 【DELETE】 /sys/units/{id} 删除组织
// 【GET】 /sys/units/{id}/children 获取直接下级组织列表

// 【POST】 /sys/regions 创建区域
// 【GET】 /sys/regions/{code}/directchilds 查询直接下级区域
// 【GET】 /sys/regions/{code}/allchilds 查询所有下级区域
// 【GET】 /sys/regions/{code} 查询区域详情
// =========================  组织管理  ============================
import Fetch, { pageInfo } from '../fetch';
export const picRequests = {
    /**
     * 获取LOGO图片
     * @param {String} id
     */
    getLogoPic(id) {
        return Fetch({
            url: '/sys/units/' + id + '/logoPic',
            method: 'get',
            responseType: 'blob'
        });
    },
    /**
     * 获取封面图片
     * @param {String} id
     */
    getCoverPic(id) {
        return Fetch({
            url: '/sys/units/' + id + '/coverPic',
            method: 'get',
            responseType: 'blob'
        });
    }
}

export const unitRequests = {
    /**
     * 查询组织列表
     * @param {String} str 查询条件
     * @param {Number} page 页码
     * @param {Number} size 每页显示数量
     */
    getUnits(str, page, size) {
        return Fetch({
            url: '/sys/units?search=' + str + pageInfo(page, size),
            method: 'get'
        });
    },
    /**
     * 获取组织信息
     * @param {String} id 组织id
     */
    getUnitInfo(id) {
        return Fetch({
            url: '/sys/units/' + id,
            method: 'get'
        });
    },
    /**
     * 获取下级组织列表（包括部门、机构）
     * @param {String} id 组织id
     */
    getUnitAllchildren(id) {
        return Fetch({
            url: '/sys/units/' + id + '/allchildren',
            method: 'get'
        });
    },
     /**
     * 获取下级组织列表（包括部门、机构）
     * @param {String} id 组织id
     */
    getUnitChildren(id) {
        return Fetch({
            url: '/sys/units/' + id + '/children',
            method: 'get'
        });
    },
    /**
     * 获取下级机构列表
     * @param {String} id 组织id
     */
    getUnitChildrenForOrg(id) {
        return Fetch({
            url: '/sys/units/' + id + '/children?type=org',
            method: 'get'
        });
    },

    /**
     * 获取下级机构和下级机构的人员
     *
     * @param {any} id 机构id
     * @returns
     */
    getUnitOrgAndPerson(id) {
        let orgs = this.getUnitChildrenForOrg(id);
        let managers = this.getAccountList(id, '', 1, -1);
        var result = Promise.all([orgs, managers]);
        return result;
    },
    /**
     * 获取下级部门列表
     * @param {String} id 组织id
     */
    getUnitChildrenForDep(id) {
        return Fetch({
            url: '/sys/units/' + id + '/children?type=dep',
            method: 'get'
        });
    },
    /**
     * 查询指定组织下级机构列表包括自己
     * @param {String} id 组织id
     */
    getOrgUnitsAndSelf(id) {
        return this.getUnitInfo(id).then((res) => {
            return res;
        }).then((self) => {
            return this.getUnitChildrenForOrg(self.id).then((orgs) => {
                self.children = orgs;
                return [self];
            });
        });
    },
    /**
     * 创建组织
     * @param {Object} formData 组织信息
     */
    addUnit(formData) {
        return Fetch({
            url: '/sys/units',
            method: 'post',
            data: formData
        });
    },
    /**
     * 修改组织信息
     * @param {String} id 组织id
     * @param {Object} formData 组织信息
     */
    modifyUnitInfo(id, formData) {
        return Fetch({
            url: '/sys/units/' + id,
            method: 'put',
            data: formData
        });
    },
    /**
     * 删除组织
     * @param {String} id 组织id
     */
    delUnit(id) {
        return Fetch({
            url: '/sys/units/' + id,
            method: 'delete'
        })
    },

    /**
     * 获取区域的直接下级区域
     * @param {String} code 区域code
     */
    getRegionList(code) {
        return Fetch({
            url: '/sys/regions/' + code + '/directchilds',
            method: 'get'
        })
    },

    /**
     * 获取区域的所有下级区域（直接、间接下级）
     * @param {String} code 区域code
     */
    getAllRegion(code) {
        return Fetch({
            url: '/sys/regions/' + code + '/allchilds',
            method: 'get'
        })
    },

    /**
     * 获取区域详情
     * @param {String} code 区域code
     */
    getRegion(code) {
        return Fetch({
            url: '/sys/regions/' + code,
            method: 'get'
        })
    }
}

// module.exports = unitRequests;
