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
            url: '/venue/rooms/' + id + '/addvisit',
            method: 'put'
        })
       
    }

    /**
     * 查询直接下级区域
     * @param {String} code 代码
     */
    async getRegionList(code) {
        let res = await fetch({
            url: '/sys/regions/' + code + '/directchilds',
            method: 'get'
        });
        return res;
    }

    /**
     * 查询所有下级区域
     * @param {*} code 
     */
    async getAllChildRegionList(code) {
        let res = await fetch({
            url: '/sys/regions/' + code + '/allchilds',
            method: 'get'
        });
        return res;
    }


    async venuesList(search, page, size) {
        let res = await fetch({
            url: '/venue/venues?' + search + '&page=' + page + '&size=' + size + "&sort=isTop~desc,createTime~desc",
            method: 'get',
        });
        return res;
    }
    async venuesDetail(id) {
        let res = await fetch({
            url: '/venue/venues/' + id,
            method: 'get',
        });
        return res;
    }
    async venuesdig(id) {
        let res = await fetch({
            url: '/venue/venues/' + id + '/digitinfos',
            method: 'get',
        });
        return res;
    }
    /**
     *获取某个场馆下的活动室
     * @param {*场馆ID} id 
     */
    async roomList(id) {
        let res = await fetch({
            url: 'venue/rooms?search=venue.id:' + id + ',onlineStatus:Published&sort=isRecommend~desc,createTime~desc',
            method: 'get',
        });
        return res;
    }

    /**
     * 查询活动室列表
     * @param {*} search 
     * @param {*} page 
     * @param {*} size 
     * @param {*} sort 
     */
    async rooms(search, page, size, sort='createTime~desc') {
      
        let res = await fetch({
            url: 'venue/rooms?' + search +'&page=' + page + '&size=' + size+ '&sort='+sort,
            method: 'get',
        });
        return res;
    }

    async roomDetail(id) {
        let res = await fetch({
            url: '/venue/rooms/' + id,
            method: 'get',
        });
        return res;
    }

    async roomReserveDetail(id) {
        let res = await fetch({
            url: '/venue/rooms/' + id + '/itms',
            method: 'get',
        });
        return res;
    }

    async creatVenueOrder(order) {
        let res = await fetch({
            url: '/venue/orders',
            method: 'post',
            data: order
        });

        return res;
    }

    async getVenueOrder(orderId) {
        let res = await fetch({
            url: '/venue/orders/' + orderId,
            method: 'get'

        });
        return res;
    }



    async getVenueOrders(search, page, size) {
        let res = await fetch({
            url: '/venue/orders?search=' + search + '&page=' + page + '&size=' + size + '&sort=createTime~desc',
            method: 'get'
        });
        return res;
    }

    async postComments(user, id) {
        let res = await fetch({
            url: '/venue/venues/' + id + '/comments?search=status:Pass,',
            method: 'post',
            data: user
        });
        return res;
    }
    async getComments(id, page, size) {
        let res = await fetch({
            url: '/venue/venues/' + id + '/comments?page=' + page + '&size=' + size + '&sort=time~desc',
            method: 'get'

        });
        return res;
    }
}
module.exports = new TaskModel()