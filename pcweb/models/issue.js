const fetch = require('./fetch')
class TaskModel {
    constructor() {
        this.result = {}
    }

    async newsDetail(id) {
        let res = await fetch({
            url: '/issue/informations/' + id,
            method: 'get',
        });
        return res;
    }

    /**
     * 增加资讯访问量
     *
     * @export
     * @param {any} id 资讯ID
     */
    async addvisit(id) {
        let res = await fetch({
            url: '/issue/informations/' + id + '/addvisit',
            method: 'put'
        })
    }

    /**
     * 查询栏目列表
     * @param {String} str 查询条件
     * @param {Number} page 页码
     * @param {Number} size 每页显示数量
     */
    async getColumns(str, page, size) {
        let res = await fetch({
            url: '/issue/infocolumns?search=' + str + '&page=' + page + '&size=' + size,
            method: 'get'
        });
        return res
    }
    /**资讯顶级栏目 */
    async getTopColumns(search) {
        let res = await fetch({
            url: '/issue/infocolumns/tops?search=' + search,
            method: 'get',
        });
        return res

    }
    /**资讯栏目 */
    async getColumnsInfo(id) {
        let res = await fetch({
            url: '/issue/infocolumns/' + id,
            method: 'get',
        });
        return res
    }

    async newslist(search, page, size,sort) {
        let res = await fetch({
            url: '/issue/informations?' + search + '&page=' + page + '&size=' + size + "&sort="+sort,
            method: 'get',
        });
        return res
    }
    async postComments(user, id) {
        let res = await fetch({
            url: '/issue/informations/' + id + '/comments',
            method: 'post',
            data: user
        });
        return res;
    }
    async getComments(id, page, size) {
        let res = await fetch({
            url: '/issue/informations/' + id + '/comments?page=' + page + '&size=' + size + '&sort=time~desc',
            method: 'get'

        });
        return res;
    }

}
module.exports = new TaskModel()