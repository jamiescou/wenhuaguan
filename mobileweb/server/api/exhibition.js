import fetch from './http';
/**
 * 查询展览列表
 * 
 * @export
 * @param {String} search 查询调条件
 * @param {int} page 
 * @param {int} size 
 * @returns 
 */
export async function digitalList(search, page, size) {
    let res = await fetch({
        url: '/issue/exhibits?' + search + '&page=' + page + '&size=' + size,
        method: 'get'
    });
    return res;
}
/**
 * 展览详情
 * 
 * @export
 * @param {any} id 展览id
 * @returns 
 */
export async function digitalDetail(id) {
    let res = await fetch({
        url: '/issue/exhibits/' + id,
        method: 'get'
    });
    return res;
}

/**
 * 展览展品列表
 * 
 * @export
 * @param {any} exhibitionId 展览id
 * @param {any} search 查询调整
 * @param {any} page 
 * @param {any} size 
 * @returns 
 */
export async function productionsDetail(exhibitionId, page, size) {
    let res = await fetch({
        url: '/issue/exhibits/' + exhibitionId + '/products?' + 'page=' + page + '&size=' + size+'&search=isPublish:true',
        method: 'get'
    });
    return res;
}

/**
 * 增加资讯访问量
 *
 * @export
 * @param {any} id 资讯ID
 */
export async function addvisit(id) {
    let res = await fetch({
        url: '/issue/exhibits/' + id + '/addvisit',
        method: 'put'
    })
}