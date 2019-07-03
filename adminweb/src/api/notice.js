import Fetch, { pageInfo } from './fetch';
const VodRequests = {
    /**
     * 获取通知列表
     */
    getNoticeList(str, page, size) {
        return Fetch({
            url: '/base/notices?search=' + str + pageInfo(page, size),
            method: 'get'
        });
    },
    /**
     * 新增通知
     */
    addSysNotice(formData) {
        return Fetch({
            url: '/base/notices',
            method: 'post',
            data: formData
        });
    },
    /**
     * 编辑通知
     */
    editNotice(id, formData) {
        return Fetch({
            url: '/base/notices/' + id,
            method: 'put',
            data: formData
        });
    },
    /**
     * 删除通知
     */
    delNotice(id) {
        return Fetch({
            url: '/base/notices/' + id,
            method: 'delete'
        });
    },
    /**
     * 查看通知详情
     */
    getNotice(id) {
        return Fetch({
            url: '/base/notices/' + id,
            method: 'get'
        });
    },

    /**
     * 签收通知
     * @param {any} id 通知ID
     * @param {any} data 签收信息
     * @returns
     */
    noticeSign(id,data) {
        return Fetch({
            url: '/base/notices/' + id + '/sign',
            data:data,
            method: 'put'
        })
    },
    /**
     * 待办事项
     */
    getGtask(username) {
        return Fetch({
            url: '/gtask/' + username,
            method: 'get'
        });
    }
}
export default VodRequests;
