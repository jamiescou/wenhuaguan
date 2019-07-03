import Fetch, { pageInfo } from './fetch';
const VodRequests = {
    /**
     * 获取直播列表
     */
    getLiveList(str, page, size) {
        return Fetch({
            url: '/vod/livevideos?search=' + str + pageInfo(page, size),
            method: 'get'
        });
    },
    /**
     * 新增直播
     */
    addLive(formData) {
        return Fetch({
            url: '/vod/livevideos',
            method: 'post',
            data: formData
        });
    },
    /**
     * 编辑直播
     */
    editLive(id, formData) {
        return Fetch({
            url: '/vod/livevideos/' + id,
            method: 'put',
            data: formData
        });
    },
    /**
     * 删除直播
     */
    delLive(id) {
        return Fetch({
            url: '/vod/livevideos/' + id,
            method: 'delete'
        });
    },
    /**
     * 查看直播详情
     */
    getLive(id) {
        return Fetch({
            url: '/vod/livevideos/' + id,
            method: 'get'
        });
    },
    /**
     * 上下架
     */
    publish(id, isPublish) {
        return Fetch({
            url: '/vod/livevideos/' + id + '/publish/' + isPublish,
            method: 'put'
        });
    },
    /**
     * 置顶
     */
    toTopLive(id, isTop) {
        return Fetch({
            url: '/vod/livevideos/' + id + '/top/' + isTop,
            method: 'put'
        });
    },
    /**
     * 获取点播列表
     */
    getDemandList(str, page, size) {
        return Fetch({
            url: '/vod/goodvideos?search=' + str + pageInfo(page, size),
            method: 'get'
        });
    },
    /**
     * 新增点播
     */
    addDemand(formData) {
        return Fetch({
            url: '/vod/goodvideos',
            method: 'post',
            data: formData
        });
    },
    /**
     * 编辑点播
     */
    editDemand(id, formData) {
        return Fetch({
            url: '/vod/goodvideos/' + id,
            method: 'put',
            data: formData
        });
    },
    /**
     * 删除点播
     */
    delDemand(id) {
        return Fetch({
            url: '/vod/goodvideos/' + id,
            method: 'delete'
        });
    },
    /**
     * 查看点播详情
     */
    getDemand(id) {
        return Fetch({
            url: '/vod/goodvideos/' + id,
            method: 'get'
        });
    },
    /**
     * 上下架
     */
    publishDemand(id, isPublish) {
        return Fetch({
            url: '/vod/goodvideos/' + id + '/publish/' + isPublish,
            method: 'put'
        });
    },
    /**
     * 置顶
     */
    toTop(id, isTop) {
        return Fetch({
            url: '/vod/goodvideos/' + id + '/top/' + isTop,
            method: 'put'
        });
    }
}
export default VodRequests;
