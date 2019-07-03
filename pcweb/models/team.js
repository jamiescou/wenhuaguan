const fetch = require('./fetch')
class TaskModel {
    constructor() {
        this.result = {}
    }
    async teamList(str,page,size,sort='createTime~desc') {
        let res = await fetch({
            url: '/cooperation/artteams?'+str+'&page='+page+'&size='+size+'&sort='+sort,
            method: 'get'
        });
        return res;
    }
    async teamDetail(id) {
        let res = await fetch({
            url: '/cooperation/artteams/' + id,
            method: 'get',
        });
        return res; 
    }
    async postComments(user,id) {
        let res = await fetch({
            url: '/cooperation/artteams/'+id+'/comments',
            method: 'post',
            data: user
        });
        return res;
    }
    async getComments(id,page,size){
        let res = await fetch({
            url: '/cooperation/artteams/'+id+'/comments?page='+page+'&size='+size+'&sort=time~desc',
            method: 'get'
           
        });
        return res;
    }
}
module.exports = new TaskModel()