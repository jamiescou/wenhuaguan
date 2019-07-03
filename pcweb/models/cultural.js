const fetch = require('./fetch')
class TaskModel {
    constructor() {
        this.result = {}
    }
   //文化信息列表
   async culturalList(str,page,size,sort) {
        let res = await fetch({
            url: '/delivery/supplys?'+str+'&page='+page+'&size='+size+'&sort='+sort,
            method: 'get'
        });
        return res;
    }
   //文化信息详情
   async culturalDetail(id) {
    let res = await fetch({
        url: '/delivery/supplys/'+id,
        method: 'get'
    });
    return res;
    } 
  // 添加点播评论列表
  async culturalComments(user, id) {
    let res = await fetch({
        url: '/delivery/supplys/' + id + '/comments',
        method: 'post',
        data: user
    });
    return res;
}
 // 获取点播评论列表
 async getculturalComments(id, page, size) {
    let res = await fetch({
        url: '/delivery/supplys/' + id + '/comments?page=' + page + '&size=' + size + '&sort=time~desc',
        method: 'get'
    });
    return res;
}
}
module.exports = new TaskModel()