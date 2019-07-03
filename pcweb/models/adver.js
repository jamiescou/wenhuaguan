const fetch = require('./fetch')
class TaskModel {
	constructor() {
		this.result = {}
	}
	//广告位
	async adverList() {
		let res = await fetch({
			url: '/base/floatAdvert?search=state:true&sort=createTime~desc&page=0&size=2',
			method: 'get'
		});
		return res;
	}
}
module.exports = new TaskModel()
