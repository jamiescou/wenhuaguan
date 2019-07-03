const fetch = require('./fetch')
class TaskModel {
    constructor() {
        this.result = {}
    }


    //获取非遗展厅列表
    async fetchexhibits(search, page, size) {
        let res = await fetch({
            url: '/heritage/exhibits?' + search + '&page=' + page + '&size=' + size,
            method: 'get'
        });
        return res;
    }

        //获取非遗展厅单元列表
        async fetchunit(search, page, size) {
           
            let res = await fetch({
                url: '/heritage/units?search=' + search + '&page=' + page + '&size=' + size,
                method: 'get'
            });
            return res;
        }

//获取非遗展厅单元作品列表
async fetchworks(search, page, size) {
    let res = await fetch({
        url: '/heritage/works?' + search + '&page=' + page + '&size=' + size,
        method: 'get'
    });
    return res;
}

    //获取名录列表
    async fetchDirectorys(search, page, size,sort='createTime~desc') {
        let res = await fetch({
            url: '/heritage/projects?' + search + '&page=' + page + '&size=' + size+"&sort="+sort,
            method: 'get'
        });
        return res;
    }


    //获取传承人列表
    async fetchSuccessors(search, page, size,sort='createTime~desc') {
        let res = await fetch({
            url: '/heritage/successors?' + search + '&page=' + page + '&size=' + size+"&sort="+sort,
            method: 'get'
        });
        return res;
    }

    //非遗保护区
    async fetchProtections(search, page, size,sort='createTime~desc') {
        let res = await fetch({
            url: '/heritage/protections?' + search + '&page=' + page + '&size=' + size+"&sort="+sort,
            method: 'get'
        });
        return res;
    }



    //获取名录详情
    async fetchDirectoryDetail(id) {
        let res = await fetch({
            url: '/heritage/projects/' + id,
            method: 'get'
        });
        return res;
    }


    //获取传承人详情
    async fetchSuccessorDetail(id) {
        let res = await fetch({
            url: '/heritage/successors/' + id,
            method: 'get'
        });
        return res;

    }
    //获取传承人详情
    async fetchProtectionsDetail(id) {
        let res = await fetch({
            url: '/heritage/protections/' + id,
            method: 'get'
        });
        return res;

    }

      //获取非遗地图统计项目
      async fetchHeritageStatisticProject(code) {
          
        let res = await fetch({
            url: '/heritage/stat/project?region=' + code,
            method: 'get'
        });
        return res;
    }

    //获取非遗地图统计传承人
    async fetchHeritageStatisticSuccessor(code) {
        let res = await fetch({
            url: '/heritage/stat/successor?region=' + code,
            method: 'get'
        });
        return res;
    }

    // 获取非遗展览列表
    async fetchHeritageList(type) {
        let res = await fetch({
            url: '/issue/exhibits/' +type,
            method: 'get'
        });
        return res;
    }

    //  // 获取非遗展品列表
    //  async fetchHeritageProduct(search,page,size) {
        
    //     let res = await fetch({
    //         url: '/exhibit/productions?'+search+ '&page=' + page+'&size='+size,
    //         method: 'get'
    //     });
    //     return res;
    // }

    async postDirectoryComments(user, id) {
        let res = await fetch({
            url: '/heritage/projects/' + id + '/comments',
            method: 'post',
            data: user
        });
        return res;
    }
    async getDirectoryComments(id, page, size) {
        let res = await fetch({
            url: '/heritage/projects/' + id + '/comments?page=' + page + '&size=' + size + '&sort=time~desc',
            method: 'get'

        });
        return res;
    }

 
    
    async postSuccessorsComments(user, id) {
        let res = await fetch({
            url: '/heritage/successors/' + id + '/comments',
            method: 'post',
            data: user
        });
        return res;
    }
    async getSuccessorsComments(id, page, size) {
        let res = await fetch({
            url: '/heritage/successors/' + id + '/comments?page=' + page + '&size=' + size + '&sort=time~desc',
            method: 'get'

        });
        return res;
    }
    /**
     *  非遗保护区
     */
    async getProtectionsComments(id, page, size) {
        let res = await fetch({
            url: '/heritage/protections/' + id + '/comments?page=' + page + '&size=' + size + '&sort=time~desc',
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