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
            url: '/vod/goodvideos/' + id + '/addvisit',
            method: 'put'
        })
       
    }
    async addvisitZb(id) {
        let res = await fetch({
            url: '/vod/livevideos/' + id + '/addvisit',
            method: 'put'
        })
        
    }


    // 分类列表
    async cordList(type) {
        let res = await fetch({
            url: '/sys/codetypes/' + type+'/codes',
            method: 'get',
        });
        return res;
    }
    // 精品视频列表
    async demandsList(search,page,size,sort='createTime~desc') {
      
        let res = await fetch({
            url: '/vod/goodvideos?'+ search + '&page=' + page + '&size=' + size+"&sort="+sort,
            method: 'get',
        });
        return res;
    }
    // 直播列表
    async livevideosList(search,page,size,sort='createTime~desc') {
        let res = await fetch({
            url: '/vod/livevideos?'+ search + '&page=' + page + '&size=' + size+"&sort="+sort,
            method: 'get',
        });
        return res;
    }

    //精品视频列表详情
    async demandsContent(id) {
        let res = await fetch({
            url: '/vod/goodvideos/'+ id,
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
   
   
}
module.exports = new TaskModel()