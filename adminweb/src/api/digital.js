import Fetch, { pageInfo } from './fetch';
const SupplyRequests = {
    /**
     * 获取数字展览列表
     */
    getDigitalList(str, page, size) {
        return Fetch({
            url: '/issue/exhibits?search=' + str + pageInfo(page, size),
            method: 'get'
        });
    },
    /**
     * 新增展览
     */
    addDigital(formData) {
        return Fetch({
            url: '/issue/exhibits',
            method: 'post',
            data: formData
        });
    },
    /**
     * 编辑展览
     */
    editDigital(id, formData) {
        return Fetch({
            url: '/issue/exhibits/' + id,
            method: 'put',
            data: formData
        });
    },
    /**
     * 删除展览
     */
    delDigital(id) {
        return Fetch({
            url: '/issue/exhibits/' + id,
            method: 'delete'
        });
    },
    /**
     * 查看详情
     */
    getDigital(id) {
        return Fetch({
            url: '/issue/exhibits/' + id,
            method: 'get'
        });
    },

    /**
     * 发布/取消发布
     */
    publishDigital(id, isPublish) {
        return Fetch({
            url: '/issue/exhibits/' + id + '/publish/' + isPublish,
            method: 'put'
        });
    },

    /**
     * 获取展品列表
     */
    getExhibitsList(id,page,size) {
        return Fetch({
            url: '/issue/exhibits/' + id + '/products?search='+ pageInfo(page, size),
            method: 'get'
        });
    },

    /**
     * 新增展览展品
     */
    addExhibits(id, formData) {
        return Fetch({
            url: '/issue/exhibits/' + id + '/products',
            method: 'post',
            data: formData
        });
    },
    /**
     * 编辑展览展品
     */
    editExhibits(id, productid, formData) {
        return Fetch({
            url: '/issue/exhibits/' + id + '/products/' + productid,
            method: 'put',
            data: formData
        });
    },

    /**
     * 删除展览作品
     */
    delExhibits(id, productid) {
        return Fetch({
            url: '/issue/exhibits/' + id + '/products/' + productid,
            method: 'delete'
        });
    },

    /**
     * 查看作品详情
     */
    getExhibits(id, productid) {
        return Fetch({
            url: '/issue/exhibits/' + id + '/products/' + productid,
            method: 'get'
        });
    },

    /**
     * 发布/取消发布展品
     */
    publishExhibits(id, productid, isPublish) {
        return Fetch({
            url: '/issue/exhibits/' + id + '/products/' + productid + '/publish/' + isPublish,
            method: 'put'
        });
    },

    /**
     * 是否置顶
     */
    topExhibits(id, status) {
        return Fetch({
            url: '/issue/exhibits/' + id + '/top/' + status,
            method: 'put'
        });
    }
}
export default SupplyRequests;
