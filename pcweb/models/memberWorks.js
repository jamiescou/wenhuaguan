const fetch = require('./fetch')
class TaskModel {
    constructor() {
        this.result = {}
    }
    async memberWorksList(str,page,size,sort='createTime~desc') {
        let res = await fetch({
            url: '/photographyMember/works?'+str+'&page='+page+'&size='+size+'&sort='+sort,
            method: 'get'
        });
        return res;
    }
    async memberWorksDetail(id) {
        let res = await fetch({
            url: '/photographyMember/works/' + id,
            method: 'get',
        });
        return res; 
    }
    async postComments(user,id) {
        let res = await fetch({
            url: '/photographyMember/works/'+id+'/comments',
            method: 'post',
            data: user
        });
        return res;
    }
    async getComments(id,page,size){
        let res = await fetch({
            url: '/photographyMember/works/'+id+'/comments?page='+page+'&size='+size+'&sort=time~desc',
            method: 'get'
           
        });
        return res;
    }
}
module.exports = new TaskModel()