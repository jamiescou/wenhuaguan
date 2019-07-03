import fetch from './http';
// 精品视频列表
export async function demandsList(search, page, size) {
    let res = await fetch({
        url: '/vod/goodvideos?search=' + search + '&page=' + page + '&size=' + size,
        method: 'get'
    });
    return res;
}
/**
 * 精品视频列表详情
 * 
 * @export
 * @param {any} id 
 * @returns 
 */
export async function demandsContent(id) {
    let res = await fetch({
        url: '/vod/goodvideos/' + id,
        method: 'get',
    });
    return res;
}

// 直播列表
export async function livevideosList(search, page, size) {
    let res = await fetch({
        url: '/vod/livevideos?search=' + search + '&page=' + page + '&size=' + size,
        method: 'get',
    });
    return res;
}

// 直播列表详情
export async function livevideosContent(id) {
    let res = await fetch({
        url: '/vod/livevideos/' + id,
        method: 'get',
    });
    return res;
}

/**
 * 增加资讯访问量（点播）
 *
 * @export
 * @param {any} id 资讯ID
 */
export async function addvisitDemands(id) {
    let res = await fetch({
        url: '/vod/goodvideos/' + id + '/addvisit',
        method: 'put'
    })
}

/**
 * 增加资讯访问量（直播）
 *
 * @export
 * @param {any} id 资讯ID
 */
export async function addvisitLiveVideos(id) {
    let res = await fetch({
        url: '/vod/livevideos/' + id + '/addvisit',
        method: 'put'
    })
}