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
            url: '/photographyCollect/activitys/' + id + '/addvisit',
            method: 'put'
        })
     
    }

 


    /**********************************************************线上作品征集******************************************************************************* */
    async collectList(str, page, size) {
        let res = await fetch({
            url: '/photographyCollect/activitys?' + str + '&page=' + page + '&size=' + size + '&sort=createTime~desc',
            method: 'get'
        });
        return res;
    }

    async workList(search, page, size) {

        let res = await fetch({
            url: '/photographyCollect/works?search=' + search + '&page=' + page + '&size=' + size + '&sort=creteTime~desc',
            method: 'get'
        });
        return res;
    }

    async collectDetail(id) {
        let res = await fetch({
            url: '/photographyCollect/activitys/' + id,
            method: 'get',
        });
        return res;
    }

    async workDetail(id) {
        let res = await fetch({
            url: '/photographyCollect/works/' + id,
            method: 'get',
        });
        return res;
    }

    async thumUpload(id, userid) {
        let res = await fetch({
            url: '/photographyCollect/works/' + id + '/votes/' + userid,
            method: 'post',
        });
        return res;
    }

    async fileUploadZip(filesInfo) {
     
        let res = await fetch({
            url: '/photographyCollect/works/uploadAndThumbnailsWorks',
            method: 'post',
            data: filesInfo
        });
        return res;
    }
    async workUpload(workInfo) {
        let res = await fetch({
            url: '/photographyCollect/works',
            method: 'post',
            data: workInfo
        });
        return res;
    }

    async postComments(user, id) {
        let res = await fetch({
            url: '/collect/activitys/' + id + '/comments',
            method: 'post',
            data: user
        });
        return res;
    }
    async getComments(id, page, size) {
        let res = await fetch({
            url: '/collect/activitys/' + id + '/comments?page=' + page + '&size=' + size + '&sort=time~desc',
            method: 'get'
        });
        return res;
    }

/**********************************************************线下活动征集******************************************************************************* */
 /***
  *活动辅助列表 
  */     
async assistActLst(search,page,size,sort) {
   
    let res = await fetch({
        url: '/assist/activitys?search='+search+'&page='+page+'&size='+size+'&sort='+sort,
        method: 'get',
    });
    return res;
}
 /***
  *活动辅助详情 
  */     
async assistActDetail(id) {
    let res = await fetch({
        url: '/assist/activitys/'+id,
        method: 'get',
    });
    return res;
}
 /***
  *添加活动作品
  */     
async subActWork(id,data) {
    let res = await fetch({
        url: '/assist/activitys/'+id+'/workss',
        data:data,
        method: 'post',
    });
    return res;
}
 /***
  *添加活动作品表
  */     
async subActWorkSheet(data) {
    let res = await fetch({
        url: '/assist/usersheets',
        data:data,
        method: 'post',
    });
    return res;
}
 /***
  *查询活动作品列表
  */     
async actWorkLst(id,search,page,size,sort) {
    let res = await fetch({
        url: '/assist/activitys/'+id+'/workss?search='+search+'&page='+page+'&size='+size+'&sort='+sort,
        method: 'get',
    });
    return res;
}
    /**********************************************************线下活动征集******************************************************************************* */
    /***
     *活动辅助列表 
     */
    async assistActLst(search, page, size, sort) {
        let res = await fetch({
            url: '/assist/activitys?search=' + search + '&page=' + page + '&size=' + size + '&sort=' + sort,
            method: 'get',
        });
        return res;
    }
    /***
     *活动辅助详情 
     */
    async assistActDetail(id) {
        let res = await fetch({
            url: '/assist/activitys/' + id,
            method: 'get',
        });
        return res;
    }
    /***
     *添加活动作品
     */
    async subActWork(id, data) {
        let res = await fetch({
            url: '/assist/activitys/' + id + '/workss',
            data: data,
            method: 'post',
        });
        return res;
    }
    /***
     *添加活动作品表
     */
    async subActWorkSheet(data) {
        let res = await fetch({
            url: '/assist/usersheets',
            data: data,
            method: 'post',
        });
        return res;
    }

    /***
     * 查看线下活动作品报名信息
     */
    async getActWorkSheet(id) {
        let res = await fetch({
            url: '/assist/usersheets/' + id,
            method: 'get'
        });
        return res;
    }
    /***
     * 取消线下活动作品报名
     */
    async cancelWorkSheet(id) {
        let res = await fetch({
            url: '/assist/usersheets/' + id + '/cancel',
            method: 'put'
        });
        return res;
    }

    /**
     * 查询线下活动报名表
     * 
     * @param {any} search 查询条件 排序
     * @param {any} page 页码
     * @param {any} size 
     * @returns 
     */
    async getWorkSheets(search, page, size) {
        let res = await fetch({
            url: '/assist/usersheets?search=' + search + '&page=' + page + '&size=' + size,
            method: 'get'
        });
        return res;
    }
    /***
     *查询活动作品列表
     */
    async actWorkLst(id, search, page, size, sort) {
        let res = await fetch({
            url: '/assist/activitys/' + id + '/workss?search=' + search + '&page=' + page + '&size=' + size + '&sort=' + sort,
            method: 'get',
        });
        return res;
    }
}
module.exports = new TaskModel()