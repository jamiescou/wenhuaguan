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
            url: '/train/trains/' + id + '/addvisit',
            method: 'put'
        })
      
    }

    async trainList(str, page, size, sort) {
        let res = await fetch({
            url: '/train/trains?' + str + '&page=' + page + '&size=' + size + "&sort=" + sort,
            method: 'get',
        });
        return res;
    }
    async trainDetail(id) {
        let res = await fetch({
            url: '/train/trains/' + id,
            method: 'get',
        });
        return res;
    }
    /**
     * 培训课程信息
     */
    async trainClsInfo(id) {
        let res = await fetch({
            url: '/train/trains/' + id + '/itms',
            method: 'get',
        });
        return res;
    }

    async trainOrder(orderInfo) {
        let res = '';
        try {
            res = await fetch({
                url: '/train/orders',
                method: 'post',
                data: orderInfo
            });
        } catch (ex) {
            res = ex.response.data;
        }
        return res;
    }

    /**
     * 获取培训订单
     * @param {*} userId 
     */
    async getOrder(search, page, size) {
        let res = await fetch({
            url: '/train/orders?search=' + search + '&page=' + page + '&size=' + size + '&sort=createTime~desc',
            method: 'get'
        });
        return res;
    }

    async postComments(user, id) {
        let res = await fetch({
            url: '/train/trains/' + id + '/comments?search=status:Pass',
            method: 'post',
            data: user
        });
        return res;
    }
    async getComments(id, page, size) {
        let res = await fetch({
            url: '/train/trains/' + id + '/comments?page=' + page + '&size=' + size + '&sort=time~desc',
            method: 'get'

        });
        return res;
    }

    /**
     * 按照培训艺术形式统计发布量
     */
    async getTrainform() {
        return fetch({
            url: '/report/train/form',
            method: 'get'
        });
    }

}
module.exports = new TaskModel()
