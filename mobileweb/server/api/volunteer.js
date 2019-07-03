import fetch from './http';

/**
 * 查询招募活动列表
 */
export async function volunrecruitList(search, page, size) {
    let res = await fetch({
        url: '/volunteer/volunrecruit?' + search + '&page=' + page + '&size=' + size,
        method: 'get'
    });
    return res;
}

/**
 * 志愿者招募活动详情
 */
export async function volunrecruitDetail(id) {
    let res = await fetch({
        url: '/volunteer/volunrecruit/' + id,
        method: 'get'
    });
    return res;
}

/**
 *申请成为活动志愿者、志愿者团队成员
 * @param {*} applyInfo 
 */
export async function volunteerApply(applyInfo) {
    let res = await fetch({
        url: '/volunteer/regapplys',
        method: 'post',
        data: applyInfo
    });
    return res;
}
   //加入活动
   export async function joinactivity(userInfo) {
    const data = await fetch({
        url: '/volunteer/recruitjoinapplys',
        method: 'post',
        data: userInfo
    });
    return data;
}



/**
 *　获取志愿者详情
 * @param {*} id 
 */
export async function getVolunteerInfo(userId) {
    let res = await fetch({
        url: '/cooperation/volunteers?search=user.id:' + userId,
        method: 'get'
    });
    return res;
}
 
   //查询志愿者
 export async function getVolunteers(search,page,size) {
    
    const data = await fetch({
        url: '/volunteer/volunteers?search='+search+'&page='+page+'&size='+size,
        method: 'get',
    });
    return data;
}

/**
 * 查询志愿者活动风采列表
 */
export async function getVolunteerCruitDigitinfos(volunrecruitId, search, page, size) {
    let res = await fetch({
        url: '/cooperation/volunrecruit/' + volunrecruitId + '/digitinfos?' + search + '&page=' + page + '&size=' + size,
        method: 'get'
    });
    return res;
}

/**
 * 查询志愿者团队风采列表
 */
export async function getVolunteerteamSpirits(volunreteamId, search, page, size) {
    let res = await fetch({
        url: '/cooperation/volunteams/' + volunreteamId + '/spirits?' + search + '&page=' + page + '&size=' + size,
        method: 'get'
    });
    return res;
}

/**
 * 查询志愿者活动加入申请
 */
export async function volunRecruitApplys(search, page, size) {
    let res = await fetch({
        url: '/volunteer/recruitjoinapplys?search=' + search + '&page=' + page + '&size=' + size,
        method: 'get'
    });
    return res;
}
