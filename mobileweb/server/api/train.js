import fetch from './http';
/**
 * 查询培训列表
 * @param {String} str 查询条件
 * @param {Number} page 页码
 * @param {Number} size 每页显示数量
 */
export async function getTrainList(str, page, size) {
    const data = await fetch({
        url: '/train/trains?search=' + str + '&page=' + page + '&size=' + size,
        method: 'get'
    });
    return data;
}

/**
 * 获取单个培训信息
 * @param {String} id
 */
export async function getTrainInfo(id) {
    const data = await fetch({
        url: '/train/trains/' + id,
        method: 'get'
    });
    return data;
}

/**
 * 创建订单
 * @param {any} id
 * @param {any} orderInfo 订单信息
 * @returns
 */
export async function addOrder(orderInfo) {
    const data = await fetch({
        url: '/train/orders',
        method: 'post',
        data: orderInfo
    });
    return data;
}

/**
 * 查询培训订单列表订单
 * @param {any} 
 * @returns
 */
export async function getOrder(search, page, size) {
    const data = await fetch({
        url: '/train/orders?search=' + search + '&page=' + page + '&size=' + size + '&sort=createTime~desc',
        method: 'get'
    });
    return data;
}

/**
 * 培训课程信息
 * @param {any} id 培训标识
 * @returns
 */
export async function trainClsInfo(id) {
    let res = await fetch({
        url: '/train/trains/' + id + '/itms',
        method: 'get',
    });
    return res;
}

/**
 * 学生培训的签到信息
 * @returns
 */
export async function getStudentSign(trainId, idNumber) {
    let res = await fetch({
        url: '/train/trains/' + trainId + '/students/' + idNumber + '/sign',
        method: 'get',
    });
    return res;
}

/**
 * 学生培训的签到信息
 * @returns
 */
export async function putStudentSign(trainId, idNumber, data) {
    let res = await fetch({
        url: '/train/trains/' + trainId + '/students/' + idNumber + '/sign',
        method: 'put',
        data: data
    });
    return res;
}

/**
 * 取消培训订单
 * @param {any} id 培训标识
 * @returns
 */
export async function cancelTrainOrder(id, reason) {
    let res = await fetch({
        url: '/train/orders/' + id + '/cancel',
        data: reason,
        method: 'put'
    });
    return res;
}
/**
 * 删除培训订单
 * @param {any} id 培训标识
 * @returns
 */
export async function delTrainOrder(id) {
    let res = await fetch({
        url: '/train/orders/' + id + '/ishidden/true',
        method: 'put',
    });
    return res;
}

/**
 * 增加资讯访问量
 *
 * @export
 * @param {any} id 资讯ID
 */
export async function addvisitTrain(id) {
    let res = await fetch({
        url: '/train/trains/' + id + '/addvisit',
        method: 'put'
    })
}