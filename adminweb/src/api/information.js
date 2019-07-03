// ================================================================
// 【GET】 /sys/columns 查询栏目列表
// 【POST】 /sys/columns 创建栏目
// 【GET】 /sys/columns/{id} 获取栏目信息
// 【PUT】 /sys/columns/{id} 修改栏目信息
// 【DELETE】 /sys/columns/{id} 删除栏目
// 【GET】 /sys/columns/tops 获取上级栏目列表
// 【PUT】 /sys/columns/{id}/enable/false 关闭栏目
// 【PUT】 /sys/columns/{id}/enable/true 启用栏目

// 【GET】/sys/information 查询资讯列表
// 【POST】/sys/information 创建资讯
// 【DELETE】/sys/information/{id} 删除资讯
// 【PUT】/sys/information/{id} 修改资讯信息
// 【GET】/sys/information/{id}/coverPic 获取资讯封面图片
// 【GET】/sys/information/{id}/attach 获取资讯附件

// 【PUT】/sys/information/{id}/publish/true 发布资讯
// 【PUT】/sys/information/{id}/publish/false 取消发布
// 【PUT】/sys/information/{id}/top/true 置顶资讯
// 【PUT】/sys/information/{id}/top/false 取消置顶
// =========================  栏目、资讯管理  ==========================
import Fetch, { pageInfo } from './fetch';

const infoRequests = {
    /**
     * 查询栏目列表
     * @param {String} str 查询条件
     * @param {Number} page 页码
     * @param {Number} size 每页显示数量
     */
    getColumns(str, page, size) {
        return Fetch({
            url: '/issue/infocolumns?search=' + str + pageInfo(page, size),
            method: 'get'
        });
    },
    /**
     *  创建栏目
     * @param {Object} columnData 栏目信息
     */
    addColumn(columnData) {
        return Fetch({
            url: '/issue/infocolumns',
            method: 'post',
            data: columnData
        });
    },
    /**
     *  获取栏目信息
     * @param {String} columnId 栏目id
     */
    getColumn(venueId) {
        return Fetch({
            url: '/issue/infocolumns/' + venueId,
            method: 'get'
        });
    },
    /**
     *  修改栏目信息
     * @param {String} columnId 栏目id
     * @param {Object} columnData 栏目信息
     */
    modifyColumn(columnId, columnData) {
        return Fetch({
            url: '/issue/infocolumns/' + columnId,
            method: 'put',
            data: columnData
        });
    },
    /**
     *  删除栏目
     * @param {String} columnId 栏目id
     */
    delColumn(columnId) {
        return Fetch({
            url: '/issue/infocolumns/' + columnId,
            method: 'delete'
        });
    },
    /**
     *  获取频道列表
     */
    getChannels(columnId) {
        return Fetch({
            url: '/issue/channels/',
            method: 'get'
        });
    },

    /**
     * 获取上级栏目列表
     */
    getColumnsOfTop() {
        return Fetch({
            url: '/issue/infocolumns/tops',
            method: 'get'
        });
    },
    /**
     * 关闭栏目/启用栏目
     * @param {String} columnId  栏目id
     * @param {Bolean} enable  true启用 false关闭
     */
    setColumnEnable(columnId, enable) {
        return Fetch({
            url: '/issue/infocolumns/' + columnId + '/enable/' + enable,
            method: 'put'
        });
    },

    /**
     * 查询资讯列表
     * @param {String} str 查询条件
     * @param {Number} page 页码
     * @param {Number} size 每页显示数量
     */
    getInformations(str, page, size) {
        return Fetch({
            url: '/issue/informations?search=' + str + pageInfo(page, size),
            method: 'get'
        });
    },
    /**
     *  创建资讯
     * @param {Object} data 资讯信息
     */
    addInformation(data) {
        return Fetch({
            url: '/issue/informations',
            method: 'post',
            data: data
        });
    },
    /**
     *  查看资讯信息
     * @param {String} id 资讯id
     */
    getInformation(id) {
        return Fetch({
            url: '/issue/informations/' + id,
            method: 'get'
        });
    },
    /**
     *  修改资讯信息
     * @param {String} id 资讯id
     * @param {Object} data 资讯信息
     */
    modifyInformation(id, data) {
        return Fetch({
            url: '/issue/informations/' + id,
            method: 'put',
            data: data
        });
    },
    /**
     *  删除资讯
     * @param {String} id 资讯id
     */
    delInformation(id) {
        return Fetch({
            url: '/issue/informations/' + id,
            method: 'delete'
        });
    },
    /**
     * 获取资讯封面图片
     * @param {String} id 资讯id
     */
    getInformationCover(id) {
        return Fetch({
            url: '/issue/informations/' + id + '/coverPic',
            method: 'get',
            responseType: 'blob'
        });
    },
    /**
     * 获取资讯附件
     * @param {String} id 资讯id
     */
    getInformationAttach(id) {
        return Fetch({
            url: '/issue/informations/' + id + '/attach',
            method: 'get',
            responseType: 'blob'
        });
    },

    /**
     *  查看资讯详情包括图片、附件
     * @param {String} id 资讯id
     */
    getInformationDetail(id) {
        let self = this;
        let info = self.getInformation(id);
        let cover = self.getInformationCover(id);
        // let attach = self.getInformationAttach(id);
        var result = Promise.all([info, cover]);
        return result;
        // return result.then(([info, cover, attach]) => {
        //     info.uploadFiles = { coverPic: '', attach: '' };
        //     info.coverPic = !cover || cover.size === 0 ? '' : cover;
        //     info.attach = !attach || attach.size === 0 ? '' : attach;
        //     return info;
        // });
    },

    /**
     * 发布资讯/取消发布
     * @param {String} id  资讯id
     * @param {Bolean} publish  true发布 false取消
     */
    setPublish(id, publish) {
        return Fetch({
            url: '/issue/informations/' + id + '/publish/' + publish,
            method: 'put'
        });
    },
    /**
     * 推荐资讯/取消推荐
     * @param {String} id  资讯id
     * @param {Bolean} recommend  true发布 false取消
     */
    setRecommend(id, recommend) {
        return Fetch({
            url: '/issue/informations/' + id + '/top/' + recommend,
            method: 'put'
        });
    }

}

export default infoRequests;
