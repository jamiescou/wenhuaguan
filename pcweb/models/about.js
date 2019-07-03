const fetch = require('./fetch')
class TaskModel {
    constructor() {
        this.result = {}
    }

    async postSuggestion(data) {
        let res = await fetch({
            url: '/sys/suggestions',
            data: data,
            method: 'post'
        });
        return res;
    }
    async getSuggestion(search,page,size,sort) {
        let res = await fetch({
            url: '/sys/suggestions?search='+search+'&page='+page+'&size='+size+'&sort='+sort,
            method: 'get'
        });
        return res;
    }
}
module.exports = new TaskModel()