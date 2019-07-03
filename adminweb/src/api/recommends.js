import Fetch, { pageInfo } from './fetch';
const literaryRequests = {
    /**
     * 查询推荐版块
     */
    getRecommendsList(str) {
        return Fetch({
            url: '/base/recommends?' + str,
            method: 'get'
        });
    },
    getRecommendsListByCode(code) {
        return Fetch({
            url: '/base/recommends/' + code,
            method: 'get'
        });
    },
    /**
     * 编辑
     *
     */
    modifyRecommendByCode(code, dataForm) {
        return Fetch({
            url: '/base/recommends/' + code,
            method: 'put',
            data: dataForm
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
