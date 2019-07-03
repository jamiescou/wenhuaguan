const fetch = require('./fetch')
class TaskModel {
    constructor() {
        this.result = {}
    }
    async academyList(str, page, size) {
        let res = await fetch({
            url: '/cooperation/cultruesocitys?search=' + str + '&page=' + page + '&size=' + size,
            method: 'get'
        });
        return res;
    }
    async academyDetail(id) {
        let res = await fetch({
            url: '/cooperation/cultruesocitys/'+id,
            method: 'get'
        });
        return res;
    }
    
    async academyDivisionsList(id) {
        let res = await fetch({
            url: '/cooperation/cultruesocitys/'+id+'/divisions',
            method: 'get'
        });
        return res;
    }
    async academyDivisionsDetail(academyId,divisonId) {
        let res = await fetch({
            url: '/cooperation/cultruesocitys/'+academyId+'/divisions/'+divisonId,
            method: 'get'
        });
        return res;
    }
}
module.exports = new TaskModel()