const fetch = require('./fetch')
class TaskModel {
    constructor() {
        this.result = {}
    }
    async digitalList(search,page,size,sort='createTime~desc') {
        let res = await fetch({
            url: '/issue/exhibits?'+search+'&page='+page+'&size='+size+'&sort='+sort,
            method: 'get'
        });
        return res;
    }
    async digitalDetail(id) {
        let res = await fetch({
            url: '/issue/exhibits/'+id,
            method: 'get'
        });
        return res;
    }
    async productionsDetail(exhibitionId,search,page,size) {
     
        let res = await fetch({
            url: '/issue/exhibits/'+exhibitionId+'/products?'+search+'&page='+page+'&size='+size,
            method: 'get'
        });
        return res;
    }
    async postComments(user,id) {
        let res = await fetch({
            url: '/issue/exhibits/'+id+'/comments',
            method: 'post',
            data: user
        });
        return res;
    }
    async getComments(id,page,size){
        let res = await fetch({
            url: '/issue/exhibits/'+id+'/comments?page='+page+'&size='+size+'&sort=time~desc',
            method: 'get'
           
        });
        return res;
    }
}
module.exports = new TaskModel()