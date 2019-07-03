import Fetch, { pageInfo } from './fetch';
const literaryRequests = {
    /**
     * 获取文艺人才列表
     */
    getLiteraryList(str, page, size) {
        return Fetch({
            url: '/issue/experts?search=' + str + pageInfo(page, size),
            method: 'get'
        });
    },
    /**
     * 新增文艺人才
     */
    addLiterary(formData) {
        return Fetch({
            url: '/issue/experts',
            method: 'post',
            data: formData
        });
    },
    /**
     * 修改文艺人才
     */
    editLiterary(id, formData) {
        return Fetch({
            url: '/issue/experts/' + id,
            method: 'put',
            data: formData
        });
    },
    /**
     * 获取文艺人才详情
     */
    getLiterary(id, formData) {
        return Fetch({
            url: '/issue/experts/' + id,
            method: 'get'
        });
    },
    /**
     * 删除文艺人才
     */
    delLiterary(id) {
        return Fetch({
            url: '/issue/experts/' + id,
            method: 'delete'
        });
    },
    /**
     * 上架或下架人才
     */
    publishLiterary(id, isPublish) {
        return Fetch({
            url: '/issue/experts/' + id + '/publish/' + isPublish,
            method: 'put'
        });
    }
}
export default literaryRequests;
