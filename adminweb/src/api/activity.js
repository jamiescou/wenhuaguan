// ================================================================
// 【GET】 /activity/activitys 查询活动列表
// 【POST】 /activity/activitys 创建活动
// 【GET】 /activity/activitys/{id} 查看活动详情
// 【PUT】 /activity/activitys/{id} 编辑活动
// 【DELETE】 /activity/activitys/{id} 删除活动
// 【GET】 /activity/activitys/{id}/coverPic 获取封面图片
// 【DELETE】 /activity/activitys/{id}/coverPic 删除封面图片
// 【GET】 /activity/activitys/{id}/attach 获取活动附件
// 【DELETE】 /activity/activitys/{id}/attach 删除附件
// 【PUT】 /activity/activitys/{id}/onlineStatus 变更活动在线状态
// 【PUT】 /activity/activitys/{id}/isRecommend/true 推荐活动
// 【PUT】 /activity/activitys/{id}/isRecommend/false 取消推荐
// 【GET】 /activity/activitys/{id}/stat 活动预定统计

// 【GET】 /activity/activitys/{id}/orders 查询活动订单列表
// 【PUT】 /activity/activitys/{id}/orders/{orderid}/cancel 取消订单
// 【POST】 /activity/activitys/{id}/orders 创建订单
// 【GET】 /activity/activitys/{id}/orders/{orderid} 查询活动订单详情
// 【GET】 /activity/activitys/{id}/orders/ticket/drawn/{code} 出票
// 【GET】 /activity/activitys/{id}/orders/ticket/seat/{code} 验票

// 【GET】 /activity/activitys/{id}/itms 查询活动所有场次
// 【POST】 /activity/activitys/{id}/itms 创建单个活动场次
// 【DELETE】 /activity/activitys/{id}/itms 删除所有活动场次
// 【POST】 /activity/activitys/{id}/itms/batch 批量创建活动场次
// 【GET】 /activity/activitys/{id}/itms/{itmid} 查询场次
// 【DELETE】 /activity/activitys/{id}/itms/{itmid} 删除单个活动场次

// 【GET】 /activity/activitys/{id}/research 获取活动问卷详情
// 【POST】 /activity/activitys/{id}/research 添加活动问卷
// 【PUT】 /activity/activitys/{id}/research 编辑活动问卷
// 【DELETE】 /activity/activitys/{id}/research 删除活动问卷
// 【PUT】 /activity/activitys/{id}/research/publish/true 发布活动问卷
// 【PUT】 /activity/activitys/{id}/research/publish/false 取消发布活动问卷
// =========================  文化活动管理  ============================
import Fetch, { pageInfo } from './fetch';

const activityRequests = {
    /**
     * 查询活动列表
     * @param {String} str 查询条件
     * @param {Number} page 页码
     * @param {Number} size 每页显示数量
     */
    getActivityList(str, page, size) {
        return Fetch({
            url: '/activity/activitys?' + str + pageInfo(page, size),
            method: 'get'
        });
    },
    /**
     * 创建活动
     * @param {Object} activityData 活动信息
     */
    addActivity(activityData) {
        return Fetch({
            url: '/activity/activitys',
            method: 'post',
            data: activityData
        });
    },
    /**
     * 获取单个活动信息
     * @param {String} id
     */
    getActivity(id) {
        return Fetch({
            url: '/activity/activitys/' + id,
            method: 'get'
        });
    },
    /**
     * 编辑
     * @param {String} id
     * @param {String} dataForm
     */
    modifyActivity(id, dataForm) {
        return Fetch({
            url: '/activity/activitys/' + id,
            method: 'put',
            data: dataForm
        });
    },
    /**
     * 删除
     * @param {String} id
     */
    delActivity(id) {
        return Fetch({
            url: '/activity/activitys/' + id,
            method: 'delete'
        });
    },
    /**
     * 获取封面图片
     */
    getActivityPic(id) {
        return Fetch({
            url: '/activity/activitys/' + id + '/coverPic',
            method: 'get',
            responseType: 'blob'
        });
    },
    /**
     * 删除活动图片
     * @param {String} id
     */
    delActivityImg(id) {
        return Fetch({
            url: '/activity/activitys/' + id + '/coverPic',
            method: 'delete'
        });
    },
    /**
     * 变更状态
     * @param {String} id
     */
    changeActivityOnline(id, dataForm) {
        return Fetch({
            url: '/activity/activitys/' + id + '/onlineStatus',
            method: 'put',
            data: dataForm
        });
    },
    /**
     * 获取活动附件
     * @param {String} id
     */
    getActivityAttach(id) {
        return Fetch({
            url: '/activity/activitys/' + id + '/attach',
            method: 'get',
            responseType: 'blob'
        });
    },
    /**
     * 删除活动附件
     * @param {String} id
     */
    delActivityAttach(id) {
        return Fetch({
            url: '/activity/activitys/' + id + '/attach',
            method: 'delete'
        });
    },
    /**
     * 推荐活动
     * @param {String} id
     */
    activityRecommandTrue(id) {
        return Fetch({
            url: '/activity/activitys/' + id + '/isRecommend/true',
            method: 'put'
        });
    },
    /**
     * 推荐活动
     * @param {String} id
     */
    activityRecommandFalse(id) {
        return Fetch({
            url: '/activity/activitys/' + id + '/isRecommend/false',
            method: 'put'
        });
    },
    /**
     * 推荐/取消推荐 活动
     * @param {String} id 活动id
     * @param {Boolean} isRecommend 是否置顶
     */
    activityRecommend(id, isRecommend) {
        return Fetch({
            url: '/activity/activitys/' + id + '/top/' + isRecommend,
            method: 'put'
        });
    },
    /**
     * 获得活动订单统计信息
     * @param {String} id
     */
    getActivityOrdersStat(id) {
        return Fetch({
            url: '/activity/activitys/' + id + '/stat',
            method: 'get'
        });
    },
    /**
     * 查询活动订单列表
     * @param {String} id
     */
    getActivityOrders(str, page, size) {
        return Fetch({
            url: '/activity/orders?search=' + str + pageInfo(page, size),
            method: 'get'
        });
    },
    /**
     * 取消订单
     * @param {String} id
     */
    activityOrdersCancel(orderId,data) {
        return Fetch({
            url: '/activity/orders/' + orderId + '/cancel',
            method: 'put',
            data:data
        });
    },
    /**
     * 重发短信
     * @param {String} id
     */
    resendSms(orderId) {
        return Fetch({
          url: '/activity/orders/' + orderId + '/resendsms',
          method: 'put'
        });
    },
    /**
     * 获得活动场次列表
     * @param {String} id
     */
    getActivityOrdersItms(id) {
        return Fetch({
            url: '/activity/activitys/' + id + '/itms',
            method: 'get'
        });
    },
    /**
     * 添加活动问卷
     * @param {String} id 活动id
     * @param {Object} data 问卷内容
     */
    addActivityResearch(id, data) {
        return Fetch({
            url: '/activity/activitys/' + id + '/research',
            method: 'post',
            data: data
        });
    },
    /**
     * 获取活动问卷详情
     * @param {String} id 活动id
     */
    getActivityResearch(id) {
        return Fetch({
            url: '/activity/activitys/' + id + '/research',
            method: 'get'
        });
    },
    /**
     * 删除活动问卷
     * @param {String} id 活动id
     */
    delActivityResearch(id) {
        return Fetch({
            url: '/activity/activitys/' + id + '/research',
            method: 'delete'
        });
    },
    /**
     * 编辑活动问卷
     * @param {String} id 活动id
     * @param {Object} data 问卷内容
     */
    modifyActivityResearch(id, data) {
        return Fetch({
            url: '/activity/activitys/' + id + '/research',
            method: 'put',
            data: data
        });
    },
    /**
     * 发布活动问卷 / 取消发布活动问卷
     * @param {String} id 活动id
     * @param {any} isPublish 是否发布
     * @returns
     */
    activityResearchPublish(id, isPublish) {
        return Fetch({
            url: '/activity/activitys/' + id + '/research/publish/' + isPublish,
            method: 'put'
        });
    },
    /**
     * 添加数字资源
     * @param {String} id 活动id
     * @param {any} formData 数字资源
     * @returns
     */
    activityAddDigicInfo(id, formData) {
        return Fetch({
            url: '/activity/activitys/' + id + '/digitinfos',
            method: 'post',
            data: formData
        });
    },
    /**
     * 获得数字资源列表
     * @param {String} id 活动id
     * @returns
     */
    activityDigicInfos(id) {
        return Fetch({
            url: '/activity/activitys/' + id + '/digitinfos',
            method: 'get'
        });
    },
    /**
     * 获得数字资源详情
     * @param {String} id 活动id
     * @param {String} did 数字资源id
     * @returns
     */
    activityDigicInfoDetail(id, did) {
        return Fetch({
            url: '/activity/activitys/' + id + '/digitinfos/' + did,
            method: 'get'
        });
    },
    /**
     * 编辑数字资源
     * @param {String} id 活动id
     * @param {String} did 数字资源id
     * @returns
     */
    activityDigicInfoModify(id, did, dataForm) {
        return Fetch({
            url: '/activity/activitys/' + id + '/digitinfos/' + did,
            method: 'put',
            data: dataForm
        });
    },
    /**
     * 删除数字资源
     * @param {String} id 活动id
     * @param {String} did 数字资源id
     * @returns
     */
    activityDigicInfoDelete(id, did) {
        return Fetch({
            url: '/activity/activitys/' + id + '/digitinfos/' + did,
            method: 'delete'
        });
    }
}

export default activityRequests;
