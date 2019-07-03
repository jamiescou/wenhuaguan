import fetch from './http';

//征集活动列表
export async function collectList(str, page, size) {
    let res = await fetch({
        url: '/collect/activitys?' + str + '&page=' + page + '&size=' + size +'&sort=createTime~desc',
        method: 'get'
    });
    return res;
}

// 作品征集
export async function workList(str, page, size) {
   
    let res = await fetch({
        url: '/collect/works?' + str + '&page=' + page + '&size=' + size,
        method: 'get'
    });
    return res;
}

export async function collectDetail(id) {
    let res = await fetch({
        url: '/collect/activitys/' + id,
        method: 'get'
    });
    return res;
}

export async function workDetail(id) {
    let res = await fetch({
        url: '/collect/works/' + id,
        method: 'get'
    });
    return res;
}

// 作品投票
export async  function thumUpload(id,userid) {
    let res = await fetch({
        url: '/collect/works/'+id+'/votes/'+userid,
        method: 'post',
    });
    return res;
}

export async  function  workUpload(workInfo) {
    let res = await fetch({
        url: '/collect/works/',
        method: 'post',
        data:workInfo
    });
    return res;
}

/**
 * 增加资讯访问量
 *
 * @export
 * @param {any} id 资讯ID
 */
export async function addvisitArtWorks(id) {
    let res = await fetch({
        url: '/collect/activitys/' + id + '/addvisit',
        method: 'put'
    })
}