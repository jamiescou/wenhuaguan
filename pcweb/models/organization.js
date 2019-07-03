const fetch = require('./fetch')
class TaskModel {
    constructor() {
        this.result = {}
    }
    //群团列表
    async massorgList(search,page,size,sort) {
      
        let res = await fetch({
            url: '/massorg/massorgs?search='+search+'&page='+page+'&size='+size+'&sort='+sort,
            method: 'get'
        });
        return res;
    }
  

    //群团详情
    async massorgDetail(id) {
        let res = await fetch({
            url: '/massorg/massorgs/' + id,
            method: 'get',
        });
        return res;
    }
    //群团风采列表
    async massorgStyles(orgid,search,page,size,sort) {
        
        let res = await fetch({
            url: '/massorg/massorgs/'+orgid+'/styles?search='+search+'&page='+page+'&size='+size+'&sort='+sort,
            method: 'get'
        });
        return res;
    }
    //群团风采详情
    async massorgStyleDetail(orgid,styleid) {
        let res = await fetch({
            url: '/massorg/massorgs/'+orgid+'/styles/' + styleid,
            method: 'get',
        });
        return res;
    }

    //上传学会年审
    async masorglearnannual(data) {
        let res = await fetch({
            url: '/massorg/learnannual',
            method: 'post',
            data:data
        });
        return res;
    }
    //修改学会年审
    async modifymasorglearnannual(learnanualId,data) {
        let res = await fetch({
            url: '/massorg/learnannual/'+learnanualId,
            method: 'put',
            data:data
        });
        return res;
    }
    //查询学会年审
    async masorglearnannuallst(search,page,size,sort='createTime~desc') {
     
        let res = await fetch({
            url: '/massorg/learnannual?search='+search+'&page='+page+'&size='+size+'&sort='+sort,
            method: 'get'
        });
        return res;
    }

    
}
module.exports = new TaskModel()