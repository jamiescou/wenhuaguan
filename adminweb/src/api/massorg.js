import Fetch, { pageInfo } from './fetch';
const massorgRequests = {
    getMassorgs(str, page, size) {
        return Fetch({
            url: '/massorg/massorgs?' + str + pageInfo(page, size),
            method: 'get'
        });
    },
    /**
     * 获取单个活动信息
     * @param {String} id
     */
    getMassorg(id) {
        return Fetch({
            url: '/massorg/massorgs/' + id,
            method: 'get'
        });
    },
      /**
     * 获取单个活动信息
     * @param {String} id
     */
    getLearnannual(id) {
        return Fetch({
            url: '/massorg/learnannual/' + id,
            method: 'get'
        });
    },
    addMassorg(formData) {
        return Fetch({
            url: '/massorg/massorgs',
            method: 'post',
            data: formData
        });
    },
    /**
     * 管理团队风采
     */
    getMassorgMien(id, str, page, size) {
        return Fetch({
            url: '/massorg/massorgs/' + id + '/styles?search=' + str,
            method: 'get'
        });
    },
    /**
    * 新增风采
    */
    addMien(id, formData) {
        return Fetch({
            url: '/massorg/massorgs/' + id + '/styles',
            method: 'post',
            data: formData
        });
    },
    /**
     * 修改风采
     */
    editMien(id, sid, formData) {
        return Fetch({
            url: '/massorg/massorgs/' + id + '/styles/' + sid,
            method: 'put',
            data: formData
        });
    },
    /**
     * 风采详情
     */
    detailMien(id, sid) {
        return Fetch({
            url: '/massorg/massorgs/' + id + '/styles/' + sid,
            method: 'get'
        });
    },
    /**
     * 删除风采
     */
    dellMien(id, sid) {
        return Fetch({
            url: '/massorg/massorgs/' + id + '/styles/' + sid,
            method: 'delete'
        });
    },
    modifyMassorg(id, formData) {
        return Fetch({
            url: '/massorg/massorgs/' + id,
            method: 'put',
            data: formData
        });
    },
    delMassorg(id) {
        return Fetch({
            url: '/massorg/massorgs/' + id,
            method: 'delete'
        });
    },
    learnannual(str, page, size) {
        return Fetch({
            url: '/massorg/learnannual?search=' + str + pageInfo(page, size),
            method: 'get'
        });
    },
    delLearnannual(id) {
        return Fetch({
            url: '/massorg/learnannual/' + id,
            method: 'delete'
        });
    },
    /**
     * 变更状态
     * @param {String} id
     */
    changeMassorgPublish(id, dataForm, isPublish) {
        return Fetch({
            url: '/massorg/massorgs/' + id + '/publish/' + !isPublish,
            method: 'put',
            data: dataForm
        });
    }
}
export default massorgRequests;
