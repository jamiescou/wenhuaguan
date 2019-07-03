import Fetch, { pageInfo } from './fetch';
const SupplyRequests = {
    /**
     * 获取文化配送列表
     */
    getSupplyList(str, page, size) {
        return Fetch({
            url: '/delivery/supplys?search=' + str + pageInfo(page, size),
            method: 'get'
        });
    },
    /**
     * 新增文化配送
     */
    addSupply(formData) {
        return Fetch({
            url: '/delivery/supplys',
            method: 'post',
            data: formData
        });
    },
    /**
     * 编辑配送信息
     */
    editSupply(id, formData) {
        return Fetch({
            url: '/delivery/supplys/' + id,
            method: 'put',
            data: formData
        });
    },
    /**
     * 删除配送
     */
    delSupply(id) {
        return Fetch({
            url: '/delivery/supplys/' + id,
            method: 'delete'
        });
    },
    /**
     * 查看配送详情
     */
    getSupply(id) {
        return Fetch({
            url: '/delivery/supplys/' + id,
            method: 'get'
        });
    },
    /**
     * 上下架配送
     */
    publishSupply(id, isPublish) {
        return Fetch({
            url: '/delivery/supplys/' + id + '/publish/' + isPublish,
            method: 'put'
        });
    }
}
export default SupplyRequests;
