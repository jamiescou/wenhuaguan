const fetch = require('./fetch')
class TaskModel {
    constructor() {
        this.result = {}
    }
    //品牌列表
    async brandList(str,page,size) {
        let res = await fetch({
            url: '/issue/brands?'+str+'&page='+page+'&size='+size+'&sort=createTime~desc',
            method: 'get'
        });
        return res;
    }
  

    //品牌详情
    async brandDetail(id) {
      
        let res = await fetch({
            url: '/issue/brands/' + id,
            method: 'get',
        });
        return res;
    }


    async newsList(id, page, size) {
        let res = await fetch({
            url: '/issue/brands/'+id+'/infos',
            method: 'get'
        });
        return res;
    }

    async digitalList(id, page, size) {
        let res = await fetch({
            url: '/issue/brands/'+id+'/digitals',
            method: 'get'
        });
        return res;
    }

}
module.exports = new TaskModel()