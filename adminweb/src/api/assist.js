import Fetch, { pageInfo } from './fetch';
const VodRequests = {
    /**
     * 获取通知列表
     */
    getNoticeList(str, page, size) {
        return Fetch({
            url: '/assist/notices?search=' + str + pageInfo(page, size),
            method: 'get'
        });
    },
    /**
     * 新增通知
     */
    addNotice(formData) {
        return Fetch({
            url: '/assist/notices',
            method: 'post',
            data: formData
        });
    },
    /**
     * 编辑通知
     */
    editNotice(id, formData) {
        return Fetch({
            url: '/assist/notices/' + id,
            method: 'put',
            data: formData
        });
    },
    /**
     * 删除通知
     */
    delNotice(id) {
        return Fetch({
            url: '/assist/notices/' + id,
            method: 'delete'
        });
    },
    /**
     * 查看通知详情
     */
    getNotice(id) {
        return Fetch({
            url: '/assist/notices/' + id,
            method: 'get'
        });
    },
    /**
     * 上下架
     */
    publish(id, isPublish) {
        return Fetch({
            url: '/assist/notices/' + id + '/publish/' + isPublish,
            method: 'put'
        });
    },

    /**
     * 获取活动列表
     */
    getActList(str, page, size) {
        return Fetch({
            url: '/assist/activitys?search=' + str + pageInfo(page, size),
            method: 'get'
        });
    },

    /**
     * 新增活动
     */
    addAct(formData) {
        return Fetch({
            url: '/assist/activitys',
            method: 'post',
            data: formData
        });
    },

    /**
     * 编辑活动
     */
    editAct(id, formData) {
        return Fetch({
            url: '/assist/activitys/' + id,
            method: 'put',
            data: formData
        });
    },

    /**
     * 删除活动
     */
    delAct(id) {
        return Fetch({
            url: '/assist/activitys/' + id,
            method: 'delete'
        });
    },

    /**
     * 查看活动详情
     */
    getAct(id) {
        return Fetch({
            url: '/assist/activitys/' + id,
            method: 'get'
        });
    },

    /**
     * 上下架
     */
    actPublish(id, isPublish) {
        return Fetch({
            url: '/assist/activitys/' + id + '/isPublished/' + isPublish,
            method: 'put'
        });
    },
    /**
     * 设置活动禁用状态
     */
    actDisable(id, isDisable) {
        return Fetch({
            url: '/assist/activitys/' + id + '/isDisabled/' + isDisable,
            method: 'put'
        });
    },

    /**
     * 查看活动作品
     */
    getActWorks(id) {
        return Fetch({
            url: '/assist/activitys/' + id + '/workss',
            method: 'get'
        });
    },

    /**
     * 删除活动作品
     * @param {any} id 活动Id
     * @param {any} code 作品code
     */
    delActWork(id, code) {
        return Fetch({
            url: '/assist/activitys/' + id + '/workss/' + code,
            method: 'delete'
        });
    },
    /**
     * 上报活动作品，上报后，作品出现在上级馆的活动作品集中
     *
     * @param {any} id 活动Id
     * @param {any} code 作品code
     * @param {any} actId 向上上报到的活动id
     * @returns
     */
    upperWork(id, code, actId) {
        return Fetch({
            url: '/assist/activitys/' + id + '/workss/' + code + '/deliver/' + actId,
            method: 'put'
        });
    },
    /**
     * 新增抽签
     */
    addActDraw(actId, formData) {
        return Fetch({
            url: '/assist/activitys/' + actId + '/draw',
            method: 'post',
            data: formData
        });
    },

    /**
     * 上传抽签结果(安文化馆抽签)
     */
    uploadActDraw(id, data) {
        return Fetch({
            url: '/assist/activitys/' + id + '/draw',
            data: data,
            method: 'put'
        });
    },

    /**
     * 删除活动抽签
     */
    delActDraw(actId) {
        return Fetch({
            url: '/assist/activitys/' + actId + '/draw',
            method: 'delete'
        });
    },

    /**
     * 查看抽签结果
     */
    getActDraw(id) {
        return Fetch({
            url: '/assist/activitys/' + id + '/draw',
            method: 'get'
        });
    },
    /**
     * 审核活动作品
     */
    auditActWorks(id, status, remark) {
        return Fetch({
            url: '/assist/usersheets/' + id + '/audit/' + status + '?auditRemark=' + remark,
            method: 'put'
        });
    },
    /**
     * 抽签
     */
    actdraw(id, unitId) {
        return Fetch({
            url: '/assist/activitys/' + id + '/draw/' + unitId,
            method: 'put'
        });
    },
    /**
     * 查询用户作品列表
     */
    getUserSheetList(str, page, size) {
        return Fetch({
            url: '/assist/usersheets?search=' + str + pageInfo(page, size),
            method: 'get'
        });
    },
    /**
     * 查询作品详情
     */
    getUserSheet(id) {
        return Fetch({
            url: '/assist/usersheets/' + id,
            method: 'get'
        });
    },
    /**
     * 审核作品
     */
    auditUserSheet(id, status) {
        return Fetch({
            url: '/assist/usersheets/' + id + '/' + status,
            method: 'put'
        });
    }

}
export default VodRequests;
