const fetch = require('./fetch')
class TaskModel {
    constructor() {
        this.result = {}
    }


    //获取文艺人才列表
    async fetchArtexperts(search, page, size) {
        let res = await fetch({
            url: '/cooperation/artexperts?' + search + '&page=' + page + '&size=' + size,
            method: 'get'
        });
        return res;
    }


  

    //获取文艺人才详情
    async fetchArtexpertDetail(id) {
        let res = await fetch({
            url: '/cooperation/artexperts/' + id,
            method: 'get'
        });
        return res;
    }



    async postComments(user, id) {
        let res = await fetch({
            url: '/cooperation/artexperts/' + id + '/comments',
            method: 'post',
            data: user
        });
        return res;
    }
    async getComments(id, page, size) {
        let res = await fetch({
            url: '/cooperation/artexperts/' + id + '/comments?page=' + page + '&size=' + size + '&sort=time~desc',
            method: 'get'

        });
        return res;
    }
    getDicNameByCode(code, dic) {
        let codeName = '';
        let dicFilter = dic.filter(function (item) {
            return item.code == code
        })
        if (dicFilter.length > 0) {
            codeName = dicFilter[0].value
        }
        return codeName;
    }

}
module.exports = new TaskModel()