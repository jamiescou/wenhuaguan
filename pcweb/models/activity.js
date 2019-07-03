const fetch = require('./fetch')
class TaskModel {
    constructor() {
        this.result = {}
    }

    /**
     * 增加页面访问量
     *
     */
    async addvisit(id) {
        let res = await fetch({
            url: '/activity/activitys/' + id + '/addvisit',
            method: 'put'
        })
      
    }

    async activityList(str, page, size, sort) {
        let res = await fetch({
            url: '/activity/activitys?search=' + str + '&page=' + page + '&size=' + size + "&sort=" + sort,
            method: 'get'
        });
        return res;
    }

    async activityOrder(search, page, size) {
        let res = await fetch({
            url: '/activity/orders?search=' + search + '&page=' + page + '&size=' + size + '&sort=createTime~desc',
            method: 'get'
        });
        return res;
    }

    async activityDetail(id) {
        let res = await fetch({
            url: '/activity/activitys/' + id,
            method: 'get',
        });
        return res;
    }
    async postComments(user, id) {
        let res = await fetch({
            url: '/activity/activitys/' + id + '/comments',
            method: 'post',
            data: user
        });
        return res;
    }
    async getComments(id, page, size) {
        let res = await fetch({
            url: '/activity/activitys/' + id + '/comments?search=status:Pass,page=' + page + '&size=' + size + '&sort=time~desc',
            method: 'get'

        });
        return res;
    }

    async fetchResearch(id) {
        let res = await fetch({
            url: '/activity/activitys/' + id + '/research?search=isPublished:true',
            method: 'get',
        })
        return res;
    }

    async fetchReport(id) {
        let res = await fetch({
            url: '/activity/activitys/' + id + '/digitinfos',
            method: 'get',
        })
        return res;
    }

    async postResearch(content, id) {
        let res = await fetch({
            url: '/activity/activitys/' + id + '/usersheets',
            method: 'post',
            data: content
        })
    }

    async postActivityOrder(user) {
        let res = await fetch({
            url: '/activity/orders',
            method: 'post',
            data: user
        });
        return res;
    }
    /**
     * 按照活动形式统计发布量
     */
    async getActivityform(str) {
        return fetch({
            url: '/report/activity/form',
            method: 'get'
        });
    }

}
module.exports = new TaskModel()
