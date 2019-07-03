// ================================================================

// =========================  群文作品活动管理  ============================
import Fetch, { pageInfo } from './fetch';

const eventActivitiesRequests = {
    /**
     * 查询群文作品活动列表
     * @param {String} str 查询条件
     * @param {Number} page 页码
     * @param {Number} size 每页显示数量
     */
    getEventActivitiesList(str, page, size) {
        return Fetch({
            url: '/photographyCollect/activitys?' + str + pageInfo(page, size),
            method: 'get'
        });
    },
    /**
     * 创建群文作品活动
     * @param {Object} activityData 活动信息
     */
    addDocument(data) {
        return Fetch({
            url: '/photographyCollect/activitys',
            method: 'post',
            data: data
        });
    },
    /**
     * 获取单个群文作品活动信息
     * @param {String} id
     */
    eventActivities(id) {
        return Fetch({
            url: '/photographyCollect/activitys/' + id,
            method: 'get'
        });
    },
    /**
     * 编辑
     * @param {String} id
     * @param {String} dataForm
     */
    modifyDocument(id, dataForm) {
        return Fetch({
            url: '/photographyCollect/activitys/' + id,
            method: 'put',
            data: dataForm
        });
    },
    /**
     * 删除
     * @param {String} id
     */
    delDocument(id) {
        return Fetch({
            url: '/photographyCollect/activitys/' + id,
            method: 'delete'
        });
    },
    /**
     * 获取单个群文作品活动信息
     * @param {String} id
     */
    getDocument(id) {
        return Fetch({
            url: '/photographyCollect/activitys/' + id,
            method: 'get'
        });
    },
    /**
     * 获取封面图片
     */
    getDocumentPic(id) {
        return Fetch({
            url: '/photographyCollect/activitys/' + id + '/coverPic',
            method: 'get',
            responseType: 'blob'
        });
    },
    /**
     * 删除封面图片
     * @param {String} id
     */
    delDocumentImg(id) {
        return Fetch({
            url: '/photographyCollect/activitys/' + id + '/coverPic',
            method: 'delete'
        });
    },
    /**
     * 变更状态
     * @param {String} id
     */
    changeDocumentOnline(id, dataForm) {
        return Fetch({
            url: '/photographyCollect/activitys/' + id + '/onlineStatus',
            method: 'put',
            data: dataForm
        });
    },
    /**
     * 发布 / 取消发布
     * @param {String} id 活动id
     * @param {any} isPublish 是否发布
     * @returns
     */
    DocumentPublish(id, isPublish) {
        return Fetch({
            url: '/photographyCollect/activitys/' + id + '/publish/' + isPublish,
            method: 'put'
        });
    },
    /**
     * 获得群文征集作品列表
     * @param {String} id 活动id
     * @returns
     */
    worksList(str) {
        return Fetch({
            url: '/photographyCollect/works' + str,
            method: 'get'
        });
    },
    /**
     * 获得群文征集作品详情
     * @param {String} id 活动id
     * @param {String} did 数字资源id
     * @returns
     */
    worksInfoDetail(did) {
        return Fetch({
            url: '/photographyCollect/works/' + did,
            method: 'get'
        });
    },
    /**
     * 审核通过群文征集作品
     * @param {String} id 作品id
     * @returns
     */
    worksPass(id) {
        return Fetch({
            url: '/photographyCollect/works/' + id + '/pass',
            method: 'put'
        });
    },
    /**
     * 审核拒绝群文征集作品
     * @param {String} id 作品id
     * @returns
     */
    worksReject(id) {
        return Fetch({
            url: '/photographyCollect/works/' + id + '/reject',
            method: 'put'
        });
    },
    /**
     * 删除作品
     * @param {String} id
     */
    delWorks(id) {
        return Fetch({
            url: '/photographyCollect/works/' + id,
            method: 'delete'
        });
    },
    /**
     * 导出作品
     * @param {String} id
     */
    exportWorks(id, param) {
        return Fetch({
            url: '/photographyCollect/works/' + id + '/packageDownloadWorks?worksIds='+param,
            // data: param,
            method: 'post',
            responseType: 'blob'
        });
    }
}

export default eventActivitiesRequests;
