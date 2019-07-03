const fetch = require('./fetch')
class TaskModel {
    constructor() {
        this.result = {}
    }

    async search(search,page,size) {
        let res = await fetch({
            url: '/search/resources?' + search+ '&page=' + page + '&size=' + size,
            method: 'get',
        });
        return res;
    }

}
module.exports = new TaskModel()