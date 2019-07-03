const fetch = require('./fetch')
class TaskModel {
    constructor() {
        this.result = {}
    }
    // //激光剧幕
    // async dramaList(str, page, size) {
    //     let res = await fetch({
    //         url: '/base/dramacurtain?' + str + '&page=' + page + '&size=' + size,
    //         method: 'get'
    //     });
    //     return res;
    // }
}
module.exports = new TaskModel()
