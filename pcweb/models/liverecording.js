const fetch = require('./fetch')
class TaskModel {
    constructor() {
        this.result = {}
    }
    // 分类列表
    async cordList(type) {
        let res = await fetch({
            url: '/sys/codetypes/' + type,
            method: 'get',
        });
        return res;
    }
    // 点播列表
    async demandsList(search,page,size,sorttype) {
        let res = await fetch({
            url: '/vod/demands?'+ search + '&page=' + page + '&size=' + size+"&sort="+sorttype+"~desc",
            method: 'get',
        });
        return res;
    }
    // 直播列表
    async livevideosList(search,page,size,sorttype) {
        let res = await fetch({
            url: '/vod/livevideos?'+ search + '&page=' + page + '&size=' + size+"&sort="+sorttype+"~desc",
            method: 'get',
        });
        return res;
    }
    //点播列表详情
    async demandsContent(id) {
        let res = await fetch({
            url: '/vod/demands/'+ id,
            method: 'get',
        });
        return res;
    }
    // 直播列表详情
    async livevideosContent(id) {
        let res = await fetch({
            url: '/vod/livevideos/'+ id,
            method: 'get',
        });
        return res;
    }
    // 添加点播评论列表
    async demandsComments(user, id) {
        let res = await fetch({
            url: '/vod/demands/' + id + '/comments',
            method: 'post',
            data: user
        });
        return res;
    }
     // 获取点播评论列表
     async getdemandsComments(id, page, size) {
        let res = await fetch({
            url: '/vod/goodvideos/' + id + '/comments?page=' + page + '&size=' + size + '&sort=time~desc',
            method: 'get'
        });
        return res;
    }
     // 添加直播评论列表
     async liveComments(user, id) {
        let res = await fetch({
            url: '/vod/livevideos/' + id + '/comments',
            method: 'post',
            data: user
        });
        return res;
    }
    // 获取直播评论列表
    async getliveComments(id, page, size) {
        let res = await fetch({
            url: '/vod/livevideos/' + id + '/comments?page=' + page + '&size=' + size + '&sort=time~desc',
            method: 'get'
        });
        return res;
    }
}
module.exports = new TaskModel()