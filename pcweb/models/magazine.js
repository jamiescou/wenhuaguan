const fetch = require('./fetch')
class TaskModel {
    constructor() {
        this.result = {}
    }
    /**
     * 杂志列表
     * @param {*} str 
     * @param {*} page 
     * @param {*} size 
     */
async magazineList(page, size) {
    let res = await fetch({
        url: '/magazine/magazines?search=isPublish:true&page=' + page + '&size=' + size+'&sort=createTime~desc',
        method: 'get'
    });
    return res;
}

/**
 * 查询杂志详情
 */
async magazineDetail(id) {
    let res = await fetch({
        url: '/magazine/magazines/' + id,
        method: 'get',
    });
    return res;
}


/**
 * 查询期刊列表
 */
async magazineIssues(id, search, _page, _size) {
    let page = _page || 0;
    let size = _size || -1;
    let res = await fetch({
        url: '/magazine/magazines/' + id + '/issues?search=' + search + '&page=' + page + '&size=' + size+'&sort=year~desc,seqno~desc',
        method: 'get',
    });
    return res;
}

/**
 * 查询期刊详情
 */
async magazineIssuesDetail(magazineId, issuesId) {
    let res = await fetch({
        url: '/magazine/magazines/' + magazineId + '/issues/' + issuesId,
        method: 'get',
    });
    return res;
}

/**
 * 查询期刊内容
 */
async magazineIssuesContent(magazineId, issuesId) {
    let res = await fetch({
        url: '/magazine/magazines/' + magazineId + '/issues/' + issuesId + '/picList',
        method: 'get',
    });
    return res;
}

/**
 * 创建稿件
 */
async addContribution(_params) {
    let res = await fetch({
        url: '/magazine/magazines/' + _params.magazineId + '/contributions',
        method: 'post',
        data: _params
    });
    return res;
}


async postComments(user, id) {
    let res = await fetch({
        url: '/magazine/magazines/' + id + '/comments',
        method: 'post',
        data: user
    });
    return res;
}
async getComments(id, page, size) {
    let res = await fetch({
        url: '/magazine/magazines/' + id + '/comments?page=' + page + '&size=' + size + '&sort=time~desc',
        method: 'get'

    });
    return res;
}

}
module.exports = new TaskModel()