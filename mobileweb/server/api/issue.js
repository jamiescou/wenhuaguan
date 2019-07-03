import fetch from './http';

/**
 * 获取资讯列表
 * @param {*} search 
 * @param {*} page 
 * @param {*} size 
 */
export async function getInformationList(search, page, size) {
    let res = await fetch({
        url: '/issue/informations?search=' + search + '&page=' + page + '&size=' + size,
        method: 'get'
    });
    return res;
}

/**
 * 资讯详情
 * 
 * @export
 * @param {any} id 
 * @returns 
 */
export async function newsDetail(id) {
    let res = await fetch({
        url: '/issue/informations/' + id,
        method: 'get'
    });
    return res;
}

/**
 * 查询栏目列表
 * @param {String} str 查询条件
 * @param {Number} page 页码
 * @param {Number} size 每页显示数量
 */
export async function getColumns(str, page, size) {
    let res = await fetch({
        url: '/issue/infocolumns?search=' + str + '&page=' + page + '&size=' + size,
        method: 'get'
    });
    return res
}
/**
 * 获取资讯顶级栏目
 */
export async function getTopColumns() {
    let res = await fetch({
        url: '/issue/infocolumns/tops',
        method: 'get'
    });
    return res
}

/**资讯栏目 */
export async function getColumnInfo(id) {
    let res = await fetch({
        url: '/issue/infocolumns/' + id,
        method: 'get'
    });
    return res
}

/**
 * 增加资讯访问量
 *
 * @export
 * @param {any} id 资讯ID
 */
export async function addvisit(id) {
    let res = await fetch({
        url: '/issue/informations/' + id + '/addvisit',
        method: 'put'
    })
}
