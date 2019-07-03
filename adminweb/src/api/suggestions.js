import Fetch, { pageInfo } from './fetch';
const literaryRequests = {
    /**
     * 获取意见反馈列表
     */
    getSuggestionsList(str, page, size) {
        return Fetch({
            url: '/sys/suggestions?' + str + pageInfo(page, size),
            method: 'get'
        });
    },
    modifySuggestion(id, formData) {
        return Fetch({
            url: '/sys/suggestions/' + id,
            method: 'put',
            data: formData
        });
    },
     /**
     * 删除
     * @param {String} id
     */
    delSuggestion(id) {
        return Fetch({
            url: '/sys/suggestions/' + id,
            method: 'delete'
        });
    },
    getSuggestions(id) {
        return Fetch({
            url: '/sys/suggestions/' + id,
            method: 'get'
        });
    }
}
export default literaryRequests;
