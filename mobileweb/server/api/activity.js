import fetch from './http';
/**
 * 查询活动列表
 * @param {String} str 查询条件
 * @param {Number} page 页码
 * @param {Number} size 每页显示数量
 */
export async function getActivityList(str, page, size) {
    const data = await fetch({
        url: '/activity/activitys?search=' + str + '&page=' + page + '&size=' + size + '&sort=topTime1~desc,publishTime~desc',
        method: 'get'
    });
    return data;
}
/**
 * 获取活动订单
 * @export
 * @param {String} str 查询条件
 * @param {Number} page 页码
 * @param {Number} size 每页显示数量
 * @returns 
 */
export async function activityOrder(search, page, size) {
    let res = await fetch({
        url: '/activity/orders?search=' + search + '&page=' + page + '&size=' + size + '&sort=createTime~desc',
        method: 'get'
    });
    return res;
}

/**
 * 提交活动订单
 * @export
 * @param {String} data 订单信息
 * @returns 
 */
export async function postActivityOrder(data) {
    let res = await fetch({
        url: '/activity/orders',
        method: 'post',
        data: data
    });
    return res;
}
/**
 * 取消活动订单
 * @returns 
 */
export async function cancelActivityOrder(id, info) {
    let res = await fetch({
        url: '/activity/orders/' + id + '/cancel',
        method: 'put',
        data: info
    });
    return res;
}

export async function delActivityOrder(id) {
    let res = await fetch({
        url: '/activity/orders/' + id + '/ishidden/true',
        method: 'put'
    });
    return res;
}

/**
 * 获取单个活动信息
 * @param {String} id
 */
export async function activityDetail(id) {
    const data = await fetch({
        url: '/activity/activitys/' + id,
        method: 'get'
    });

    return data;
}

/**
 * 获取活动问卷
 * @param {any} id
 * @returns
 */
export async function getResearch(id) {
    const data = await fetch({
        url: '/activity/activitys/' + id + '/research?search=isPublished:true',
        method: 'get'

    });
    return data;
}

/**
 * 提交问卷
 * @param {*} id 
 * @param {*} answer 
 */
export async function postResearchAnswer(id, answer) {
    const data = await fetch({
        url: '/activity/activitys/' + id + '/usersheets',
        method: 'post',
        data: answer
    });
    return data;

}

/**
 * 查询活动纪实
 * @param {*} id 
 * @param {*} answer 
 */
export async function getDigitinfos(id) {
    const data = await fetch({
        url: '/activity/activitys/' + id + '/digitinfos',
        method: 'get'

    });
    return data;
}

/**
 * 增加资讯访问量
 *
 * @export
 * @param {any} id 资讯ID
 */
export async function addvisitActivity(id) {
    let res = await fetch({
        url: '/activity/activitys/' + id + '/addvisit',
        method: 'put'
    })
}
