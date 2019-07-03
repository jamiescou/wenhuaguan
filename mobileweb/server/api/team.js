import fetch from './http';

/**
 * 查询文化团队列表
 * @param {String} str 查询条件
 * @param {Number} page 页码
 * @param {Number} size 每页显示数量
 */
export async function getTeamList(str, page, size) {
    const data = await fetch({
        url: '/cooperation/artteams?search=' + str + '&page=' + page + '&size=' + size,
        method: 'get'
    });
    return data;
}

/**
 * 查询文化团队详情
 * @param {String} id
 */
export async function getTeamInfo(id) {
    const data = await fetch({
        url: '/cooperation/artteams/' + id,
        method: 'get'
    });
    return data;
}

/**
 * 获取团队成员列表
 *
 * @param {any} id
 * @returns
 */
export async function getTeamMembers(id) {
    const data = await fetch({
        url: '/cooperation/artteams/' + id + '/members',
        method: 'get'
    });
    return data;
}
/**
 * 查看团队成员详情
 *
 * @param {any} id
 * @param {any} mid 团队成员ID
 * @returns
 */
export async function getTeamMember(id, mid) {
    const data = await fetch({
        url: '/cooperation/artteams/' + id + '/member/' + mid,
        method: 'get'
    });
    return data;
}

/**
 * 查询团队风采列表
 *
 * @param {any} id
 * @returns
 */
export async function getTeamMien(id) {
    const data = await fetch({
        url: '/cooperation/artteams/' + id + '/styles?search=isPublish:true',
        method: 'get'
    });
    return data;
}
