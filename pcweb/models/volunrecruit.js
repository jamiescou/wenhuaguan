const fetch = require('./fetch')
class TaskModel {
    constructor() {
        this.result = {}
    }


    //获取志愿者招募列表
    async fetchVolunrecruitList(search, page, size) {
        let res = await fetch({
            url: '/cooperation/volunrecruit?' + search + '&page=' + page + '&size=' + size,
            method: 'get'
        });
        return res;
    }

     //获取志愿者团队列表
     async fetchVolunteamsList(search, page, size) {
        let res = await fetch({
            url: '/cooperation/volunteams?' + search + '&page=' + page + '&size=' + size,
            method: 'get'
        });
        return res;
    }

    //获取志愿者团队详情
    async fetchVolunteamsDetail(id) {
        let res = await fetch({
            url: '/cooperation/volunteams/' + id,
            method: 'get'
        });
        return res;
    }

      //获取志愿者团队成员
      async teammember(id) {
        let res = await fetch({
            url: '/cooperation/volunteams/' + id+'/members',
            method: 'get'
        });
        return res;
    }

      //获取志愿者团队风采
      async teammien(id) {
        let res = await fetch({
            url: '/cooperation/volunteams/' + id+'/spirits',
            method: 'get'
        });
        return res;
    }

    //获取志愿者招募详情
    async fetchVolunrecruitDetail(id) {
        let res = await fetch({
            url: '/cooperation/volunrecruit/' + id,
            method: 'get'
        });
        return res;
    }



    //申请成为志愿者
    async volunrecruitOrder(userInfo) {
        const data = await fetch({
            url: '/volunteer/regapplys',
            method: 'post',
            data: userInfo
        });
        return data;
    }

    //查询志愿者
    async volunrecruitlist() {
        const data = await fetch({
            url: '/cooperation/volunteers',
            method: 'get',
        });
        return data;  
    }

 

    //判断是否报名过
    async isbook(id,userid) {
        const data = await fetch({
            url: '/cooperation/volunapplys?search=objId:'+id,
            method: 'get',
        });
        return data;  
    }
    async postActivitySave(id, info) {
        let res = await fetch({
            url: '/user/users/' + id + '/favorites',
            method: 'post',
            data: info
        });
        return res;
    }
     //编辑志愿者
     async editVolunrecruit(id,userinfo) {
        const data = await fetch({
            url: '/cooperation/volunteers/'+id,
            method: 'put',
            data:userinfo
        });
        return data;  
    }

     //加入活动
     async joinactivity(userInfo) {
        const data = await fetch({
            url: '/cooperation/volunapplys',
            method: 'post',
            data: userInfo
        });
        return data;
    }

    //查询活动
    async joinactivity(userInfo) {
    const data = await fetch({
            url: '/cooperation/volunapplys',
            method: 'post',
            data: userInfo
        });
        return data;
    }

    async fetchdigitinfos(id) {
        let res = await fetch({
                url: '/cooperation/volunrecruit/'+id+'/digitinfos',
                method: 'get',
            });
            return res;
 }

    async postComments(user, id) {
        let res = await fetch({
            url: '/cooperation/volunrecruit/' + id + '/comments',
            method: 'post',
            data: user
        });
        return res;
    }
    async getComments(id, page, size) {
        let res = await fetch({
            url: '/cooperation/volunrecruit/' + id + '/comments?page=' + page + '&size=' + size + '&sort=time~desc',
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