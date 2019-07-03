import fetch from './http';
/**
 * 查询场馆列表
 * @param {String} str 查询条件
 * @param {Number} page 页码
 * @param {Number} size 每页显示数量
 */

export async function getVenueList(str, page, size) {
    const data = await fetch({
        url: '/venue/venues?search=' + str + '&page=' + page + '&size=' + size,
        method: 'get'
    });
    return data;
};

/**
 *  查看场馆信息
 * @param {String} venueId 场馆id
 */
export async function getVenue(venueId) {
    const data = await fetch({
        url: '/venue/venues/' + venueId,
        method: 'get'
    });
    return data;
}

/**
 * 查询活动室列表
 * @param {String} str 查询条件
 * @param {Number} page 页码
 * @param {Number} size 每页显示数量
 */
export async function getRoomsList(str, page, size) {
    const data = await fetch({
        url: '/venue/rooms?search=' + str + '&page=' + page + '&size=' + size,
        method: 'get'
    });
    return data;
}

/**
 *  查看活动室详情
 * @param {String} roomid 活动室id
 */
export async function getRoomInfo(roomid) {
    const data = await fetch({
        url: '/venue/rooms/' + roomid,
        method: 'get'
    });
    return data;
}
/**
 * 查询活动室场次预定信息
 *
 * @param {any} roomid
 */
export async function getRoomSchedule(roomid) {
    try {
        const data = await fetch({
            url: '/venue/rooms/' + roomid + '/itms',
            method: 'get'
        });
        return data;
    } catch (error) {
        return [];
    }
}

/**
 * 获得场馆纪实
 * @param {String} id id
 * @returns
 */
export async function getDigitInfos(id) {
    const data = await fetch({
        url: '/venue/venues/' + id + '/digitinfos',
        method: 'get'
    });
    return data;
}

/**
 * 创建活动室订单
 * @param {String} id
 * @param {Object} orderData 订单信息
 * @returns
 */
export async function createOrder(orderData) {
    const data = await fetch({
        url: '/venue/orders',
        method: 'post',
        data: orderData
    });
    return data;
}

export async function getVenueOrders(search, page, size) {
    let res = await fetch({
        url: '/venue/orders?search=' + search + '&page=' + page + '&size=' + size + '&sort=createTime~desc',
        method: 'get'
    });
    return res;
}

/**
 * 取消场馆订单
 * @param {any} id
 * @returns
 */
export async function cancelRoomOrder(id, reason) {
    let res = await fetch({
        url: '/venue/orders/' + id + '/cancel',
        data: reason,
        method: 'put'
    });
    return res;
}
/**
 * 删除场馆订单
 * @param {any} id
 * @returns
 */
export async function delRoomOrder(id) {
    let res = await fetch({
        url: '/venue/orders/' + id + '/ishidden/true',
        method: 'put'
    });
    return res;
}

/**
 * 增加资讯访问量
 *
 * @export
 * @param {any} id 资讯ID
 */
export async function addvisitVenue(id) {
    let res = await fetch({
        url: '/venue/rooms/' + id + '/addvisit',
        method: 'put'
    })
}