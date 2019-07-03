// ================================================================
// 【GET】/venue/venues 查询场馆列表
// 【POST】/venue/venues 创建场馆
// 【GET】/venue/venues/{id} 查看场馆信息
// 【PUT】/venue/venues/{id} 修改场馆
// 【DELETE】/venue/venues/{id} 删除场馆
// 【GET】/venue/venues/{id}/pic 获取封面图片
// 【GET】/venue/venues/{id}/attach 获得场馆附件

// 【PUT】/venue/venues/{id}/publish/false 取消发布
// 【PUT】/venue/venues/{id}/publish/true 场馆发布
// 【PUT】/venue/venues/{id}/top/true 场馆置顶
// 【PUT】/venue/venues/{id}/top/false 取消置顶

// 【GET】 /venue/rooms 查询活动室列表
// 【POST】 /venue/rooms 创建活动室
// 【GET】 /venue/rooms/{roomid} 查看活动室详情
// 【PUT】 /venue/rooms/{roomid} 修改活动室
// 【DELETE】 /venue/rooms/{roomid} 删除活动室
// 【PUT】 /venue/rooms/{roomid}/itmDef
// 【PUT】 /venue/rooms/{roomid}/onlineStatus 变更活动室在线状态
// 【GET】 /venue/rooms/{roomid}/coverPic 获取封面图片

// 【PUT】 /venue/rooms/{roomid}/top/false 取消置顶
// 【PUT】 /venue/rooms/{roomid}/top/true 置顶活动室
// 【GET】 /venue/rooms/{roomid}/orders 查询订单列表
// 【GET】 /venue/rooms/{roomid}/orders/{orderid} 查询订单详情
// 【POST】 /venue/rooms/{roomid}/orders 创建活动室订单
// 【PUT】 /venue/rooms/{roomid}/orders/{orderid}/cancel 取消订单
// 【PUT】 /venue/rooms/{roomid}/orders/{orderid}/pass 通过订单
// 【PUT】 /venue/rooms/{roomid}/orders/{orderid}/reject 拒绝订单
// =========================  场馆管理  ============================
import Fetch, { pageInfo } from './fetch';
const venuesRequests = {
    /**
     * 查询场馆列表
     * @param {String} str 查询条件
     * @param {Number} page 页码
     * @param {Number} size 每页显示数量
     */
    getVenueList(str, page, size) {
        return Fetch({
            url: '/venue/venues?search=' + str + pageInfo(page, size),
            method: 'get'
        });
    },
    /**
     *  创建场馆
     * @param {Object} venueData 场馆信息
     */
    addVenue(venueData) {
        return Fetch({
            url: '/venue/venues',
            method: 'post',
            data: venueData
        });
    },
    /**
     *  查看场馆信息
     * @param {String} venueId 场馆id
     */
    getVenue(venueId) {
        return Fetch({
            url: '/venue/venues/' + venueId,
            method: 'get'
        });
    },
    /**
     *  查看场馆信息包括图片
     * @param {String} venueId 场馆id
     */
    getVenueDetail(venueId) {
        let self = this;
        return self.getVenue(venueId).then((venue) => {
            return self.getVenuePic(venueId).then((pic) => {
                venue.pic = pic.size === 0 ? '' : pic;
                // venue.hasPic = pic !== null && pic !== undefined && pic !== '';
                if (!venue.uploadFiles) {
                    venue.uploadFiles = { pic: '' };
                }
                return venue;
            });
        });
    },
    /**
     * 获取场馆图片
     * @param {String} venueId 场馆id
     */
    getVenuePic(venueId) {
        return Fetch({
            url: '/venue/venues/' + venueId + '/pic',
            method: 'get',
            responseType: 'blob'
        });
    },
    /**
     *  修改场馆
     * @param {String} venueId 场馆id
     * @param {Object} venueData 场馆信息
     */
    modifyVenue(venueId, venueData) {
        return Fetch({
            url: '/venue/venues/' + venueId,
            method: 'put',
            data: venueData
        });
    },
    /**
     *  删除场馆
     * @param {String} venueId 场馆id
     */
    delVenue(venueId) {
        return Fetch({
            url: '/venue/venues/' + venueId,
            method: 'delete'
        });
    },
    /**
     * 场馆发布/取消发布
     * @param {String} id  场馆id
     * @param {Bolean} publish  true发布 false取消
     */
    setPublish(id, publish) {
        return Fetch({
            url: '/venue/venues/' + id + '/publish/' + publish,
            method: 'put'
        });
    },
    /**
     * 场馆推荐/取消推荐
     * @param {String} id  场馆id
     * @param {Bolean} recommend  true发布 false取消
     */
    setRecommend(id, recommend) {
        return Fetch({
            url: '/venue/venues/' + id + '/top/' + recommend,
            method: 'put'
        });
    },

    /**
     * 查询活动室列表
     * @param {String} str 查询条件
     * @param {Number} page 页码
     * @param {Number} size 每页显示数量
     */
    getVenueRoomsList(str, page, size) {
        return Fetch({
            url: '/venue/rooms?search=' + str + pageInfo(page, size),
            method: 'get'
        });
    },
    /**
     *  创建活动室
     * @param {Object} roomData 活动室信息
     */
    addVenueRoom(roomData) {
        return Fetch({
            url: '/venue/rooms',
            method: 'post',
            data: roomData
        });
    },
    /**
     *  查看活动室详情
     * @param {String} roomid 活动室id
     */
    getVenueRoom(roomid) {
        return Fetch({
            url: '/venue/rooms/' + roomid,
            method: 'get'
        });
    },
    /**
     * 获取封面图片
     * @param {String} roomid 活动室id
     */
    getRoomCoverPic(roomid) {
        return Fetch({
            url: '/venue/rooms/' + roomid + '/coverPic',
            method: 'get',
            responseType: 'blob'
        });
    },
    /**
     *  查看活动室详情包括图片
     * @param {String} roomid 活动室id
     */
    getRoomDetail(roomid) {
        let self = this;
        return self.getVenueRoom(roomid).then((room) => {
            return self.getRoomCoverPic(roomid).then((pic) => {
                room.coverPic = pic.size === 0 ? '' : pic;
                if (!room.uploadFiles) {
                    room.uploadFiles = { coverPic: '' };
                }
                return room;
            });
        });
    },
    /**
     *  修改活动室
     * @param {String} roomid 活动室id
     * @param {Object} roomData 活动室信息
     */
    modifyVenueRoom(roomid, roomData) {
        return Fetch({
            url: '/venue/rooms/' + roomid,
            method: 'put',
            data: roomData
        });
    },
    /**
     *  删除活动室
     * @param {String} roomid 活动室id
     */
    delVenueRoom(roomid) {
        return Fetch({
            url: '/venue/rooms/' + roomid,
            method: 'delete'
        });
    },
    /**
     *  变更活动室在线状态
     * @param {String} roomid 活动室id
     * @param {Object} data 状态信息
     */
    modifyRoomStatus(roomid, data) {
        return Fetch({
            url: '/venue/rooms/' + roomid + '/onlineStatus',
            method: 'put',
            data: data
        });
    },
    /**
     * 推荐/取消推荐 活动室
     * @param {Boolean} isRecommend 是否推荐
     * @param {String} roomid 活动室id
     */
    roomRecommend(roomid, isRecommend) {
        return Fetch({
            url: '/venue/rooms/' + roomid + '/top/' + isRecommend,
            method: 'put'
        });
    },
    /**
     *  查询订单列表
     * @param {String} str 查询条件
     * @param {Number} page 页码
     * @param {Number} size 每页显示数量
     */
    getOrdersForRoom( str, page, size) {
        return Fetch({
            url: '/venue//orders?search=' + str + pageInfo(page, size),
            method: 'get'
        });
    },
    /**
     *  查询订单详情
     * @param {String} orderid 订单id
     */
    getOrderInfo(orderid) {
        return Fetch({
            url: '/venue/orders/' + orderid,
            method: 'get'
        });
    },
    /**
     *  活动室订单取消
     * @param {String} orderid 订单id
     * @param {Object} data 状态信息
     */
    orderCancel(orderid, data) {
        return Fetch({
            url: '/venue/orders/' + orderid + '/cancel',
            method: 'put',
            data: data
        });
    },
    /**
     *  活动室订单审核通过
     * @param {String} orderid 订单id
     */
    orderPass(orderid) {
        return Fetch({
            url: '/venue/orders/' + orderid + '/pass',
            method: 'put'
        });
    },
    /**
     *  活动室订单审核拒绝
     * @param {String} orderid 订单id
     */
    orderReject(orderid) {
        return Fetch({
            url: '/venue/orders/' + orderid + '/reject',
            method: 'put'
        });
    },
    /**
     * 添加数字资源
     * @param {String} id id
     * @param {any} formData 数字资源
     * @returns
     */
    addDigitInfo(id, formData) {
        return Fetch({
            url: '/venue/venues/' + id + '/digitinfos',
            method: 'post',
            data: formData
        });
    },
    /**
     * 获得数字资源列表
     * @param {String} id id
     * @returns
     */
    getDigitInfos(id) {
        return Fetch({
            url: '/venue/venues/' + id + '/digitinfos',
            method: 'get'
        });
    },
    /**
     * 获得数字资源详情
     * @param {String} id id
     * @param {String} did 数字资源id
     * @returns
     */
    getDigitInfoDetail(id, did) {
        return Fetch({
            url: '/venue/venues/' + id + '/digitinfos/' + did,
            method: 'get'
        });
    },
    /**
     * 编辑数字资源
     * @param {String} id id
     * @param {String} did 数字资源id
     * @returns
     */
    digicInfoModify(id, did, dataForm) {
        return Fetch({
            url: '/venue/venues/' + id + '/digitinfos/' + did,
            method: 'put',
            data: dataForm
        });
    },
    /**
     * 删除数字资源
     * @param {String} id id
     * @param {String} did 数字资源id
     * @returns
     */
    digicInfoDelete(id, did) {
        return Fetch({
            url: '/venue/venues/' + id + '/digitinfos/' + did,
            method: 'delete'
        });
    }
}
export default venuesRequests;
