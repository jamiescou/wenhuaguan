// ================================================================
// 【GET】/base/storeitems/{id} 获取单个题库
// 【PUT】/base/storeitems/{id} 更新题库
// 【DELETE】/base/storeitems/{id} 删除题库
// 【GET】/base/storeitems 获取题库列表
// 【POST】/base/storeitems 创建题库
// =========================  题库管理  ============================
import Fetch, { pageInfo } from '../fetch';
const storeRequests = {
    /**
     * 获取题库列表
     * @param {String} str 查询条件
     * @param {Number} page 页码
     * @param {Number} size 每页显示数量
     */
    getStoreitems(str, page, size) {
        return Fetch({
            url: '/base/storeitems?search=' + str + pageInfo(page, size),
            method: 'get'
        });
    },
    /**
     *  创建题库
     * @param {Object} data 题库信息
     */
    addStoreitem(data) {
        return Fetch({
            url: '/base/storeitems',
            method: 'post',
            data: data
        });
    },
    /**
     *  获取单个题库
     * @param {String} id 题库id
     */
    getStoreitem(id) {
        return Fetch({
            url: '/base/storeitems/' + id,
            method: 'get'
        });
    },
    /**
     *  更新题库
     * @param {String} id 题库id
     * @param {Object} data 题库信息
     */
    modifyStoreitem(id, data) {
        return Fetch({
            url: '/base/storeitems/' + id,
            method: 'put',
            data: data
        });
    },
    /**
     *  删除题库
     * @param {String} id 题库id
     */
    delStoreitem(id, data) {
        return Fetch({
            url: '/base/storeitems/' + id,
            method: 'delete'
        });
    }
};

export default storeRequests;
