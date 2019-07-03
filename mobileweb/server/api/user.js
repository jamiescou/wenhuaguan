import fetch from './http';

/**
 * 会员注册
 *
 * @param {Object} info
 * @returns
 */
export async function register(info) {
    const data = await fetch({
        url: '/user/users',
        method: 'post',
        data: info
    });
    return data;
}
/**
 * 发送验证码
 *
 * @param {String} mobile;
 * @returns
 */
export async function getVCode(mobile) {
    const data = await fetch({
        url: '/user/vcodes?mobile=' + mobile,
        method: 'post'
    });
    return data;
}
/**
 * 校验验证码
 *
 * @param {String} mobile
 * @param {String} code
 * @returns
 */
export async function verifyCode(mobile, code) {
    const data = await fetch({
        url: '/user/vcodes/verify?mobile=' + mobile + '&code=' + code,
        method: 'get'
    });
    return data;
}
/**
 * 用户更改密码
 *
 * @param {any} mobile
 * @param {any} info
 * @returns
 */
export async function resetPwd(mobile, info) {
    const data = await fetch({
        url: '/user/users/' + mobile + '/pwd',
        method: 'put',
        data: info
    });
    return data;
}
/**
 * 查询用户列表
 * @param {*} search
 * @param {*} page
 * @param {*} size
 */
export async function users(search, page, size) {
    const data = await fetch({
        url: '/user/users?' + search + '&page=' + page + '&size=' + size,
        method: 'get'
    });
    return data;

}
/**
 * 修改密码
 * @param {*} pass
 * @param {*} phone
 */
export async function editpassword(psw, phone) {
    let res = await fetch({
        url: '/user/users/' + phone + '/pwd',
        method: 'put',
        data: psw
    });
    return res;
}

/**
 * 会员登录
 *
 * @param {String} type 登录类型，mobile帐号登录、weixin第三方微信登录
 * @param {Object} param {mobile,password}\{uid}
 * @returns
 */
export async function login(type, param) {
    const data = await fetch({
        url: '/user/users/login/' + type,
        method: 'post',
        data: param
    });
    // if (data) {
    //     data.pic = getFileUrl(data.pic);
    // }
    return data;
}
/**
 * 获取会员信息
 *
 * @param {String} id
 * @returns
 */
export async function getUserInfo(id) {
    const data = await fetch({
        url: '/user/users/' + id,
        method: 'get'
    });
    return data;
}

/**
 * 修改会员信息
 *
 * @param {String} id
 * @param {Object} info
 * @returns
 */
export async function modifyUserInfo(id, info) {
    const data = await fetch({
        url: '/user/users/' + id,
        method: 'put',
        data: info
    });
    return data;
}

/**
 * 微信扫码注册，直接创建账号
 * @param {*} userInfo
 */
export async function wechartRegister(userInfo) {
    userInfo.registerMode = 'mobileweb';
    const data = await fetch({
        url: '/user/users',
        method: 'post',
        data: userInfo
    });
    return data;
}

/**
 * 获取会员信息
 *
 * @param {String} id
 * @returns
 */
export async function getUserById(id) {
    let data = await fetch({
        url: '/user/users/' + id,
        method: 'get'
    });
    return data;
}

/**
 * 申请认证
 *
 * @param {Object} info
 * @returns
 */
export async function identify(info) {
    let data = await fetch({
        url: '/user/identifys',
        method: 'post',
        data: info
    });
    return data;
}
/**
 * 获取认证信息
 *
 * @param {any} userid
 * @param {any} otherConditon
 * @returns
 */
export async function getIdentifyInfo(userid, otherConditon) {
    let data = await fetch({
        url: '/user/identifys?search=userId:' + userid + (otherConditon ? ',' + otherConditon : '') + '&page=0&size=1',
        method: 'get'
    });
    return data;
}

/**
 * 获取认证信息列表
 *
 * @param {any} userid
 * @param {any} idnumber
 * @returns
 */
export async function getIdentifylst(search) {
    let data = await fetch({
        url: '/user/identifys?search=' + search,
        method: 'get'
    });
    return data;
}

// ====================================== 会员常用联系人 ===================================

/**
 * 查看常用联系人列表
 *
 * @param {any} id
 * @returns
 */
export async function getMember(id) {
    let data = await fetch({
        url: '/user/users/' + id + '/members',
        method: 'get'
    });
    return data;
}
/**
 * 创建常用联系人
 *
 * @param {any} id
 * @param {any} memberInfo
 * @returns
 */
export async function addMember(id, memberInfo) {
    let data = await fetch({
        url: '/user/users/' + id + '/members',
        method: 'post',
        data: memberInfo
    });
    return data;
}
/**
 * 删除常用联系人
 *
 * @param {any} id
 * @param {any} idnum
 * @returns
 */
export async function delMember(id, idnum) {
    let data = await fetch({
        url: '/user/users/' + id + '/members/' + idnum,
        method: 'delete'
    });
    return data;
}

// ====================================== 会员收藏 ===================================
/**
 * 增加收藏
 *
 * @param {String} id
 * @param {Object} favoriteData 收藏对象
 * @returns
 */
export async function favorites(id, favoriteData) {
    const data = await fetch({
        url: '/user/users/' + id + '/favorites',
        method: 'post',
        data: favoriteData
    });
    return data;
}

/**
 * 删除收藏
 *
 * @export
 * @param {String} id
 * @param {String} fid
 * @returns
 */
export async function delFavorites(id, fid) {
    const data = await fetch({
        url: '/user/users/' + id + '/favorites/' + fid,
        method: 'delete'
    });
    return data;
}

/**
 * 查询会员收藏
 *
 * @param {String} userId
 * @param {String} type 【Activity, Train, Information, ArtTeam, ArtWorks, heritageDirectory, heritageSuccessor, Venue】
 * @returns
 */
export async function getFavorites(userId, type, page, size) {
    const data = await fetch({
        url: '/user/users/' + userId + '/favorites/' + type + '?' + 'page=' + page + '&size=' + size + '&sort=time~desc',
        method: 'get'
    });

    return data;
}

/**
 * 查询是否收藏
 *
 * @param {any} id
 * @param {any} type
 * @param {any} objectId
 * @returns
 */
export async function hasFavorite(id, type, objectId) {
    const data = await fetch({
        url: '/user/users/' + id + '/favorites/' + type + '/' + objectId,
        method: 'get'
    });
    return data;
}
// ====================================== 会员点赞 ===================================
/**
 * 点赞
 * @param {*} userId
 * @param {*} type
 * @param {*} objectId
 */
export async function thumbup(userId, type, objectId) {
    const data = await fetch({
        url: '/user/users/' + userId + '/thumbup/' + type + '/' + objectId,
        method: 'post'
    });
    return data;
}

/**
 * 取消点赞
 * @param {*} userId
 * @param {*} type
 * @param {*} objectId
 */
export async function cancelthumbup(userId, type, objectId) {
    const data = await fetch({
        url: '/user/users/' + userId + '/thumbup/' + type + '/' + objectId,
        method: 'delete'
    });
    return data;
}

/**
 * 查询是否点赞
 * @param {*} userId
 * @param {*} type
 * @param {*} objectId
 */
export async function isthumbup(userId, type, objectId) {
    const data = await fetch({
        url: '/user/users/' + userId + '/thumbup/' + type + '/' + objectId,
        method: 'get'
    });
    return data;
}

// ====================================== 会员订单 ===================================
/**
 * 会员取消订单
 *
 * @param {String} id
 * @param {String} oId
 * @param {Object} info 取消订单信息
 * @returns
 */
export async function activityOrdersCancel(id, oId, info) {
    const data = await fetch({
        url: '/activity/activitys/' + id + '/orders/' + oId + '/cancel',
        method: 'put',
        data: info
    });
    return data;
}
/**
 * 查询会员活动订单 【当前订单】
 *
 * @param {String} id
 * @param {Int} page
 * @param {Int} size
 * @param {String} str 搜索或排序
 * @returns
 */
export async function activityOrders(id, page, size, str) {
    const data = await fetch({
        url: '/user/users/' + id + '/orders/activity/current?search=' + str + '&page=' + page + '&size=' + size,
        method: 'get'
    });
    return data;
}
/**
 * 查询会员活动订单 【历史订单】
 *
 * @param {String} id
 * @param {Int} page
 * @param {Int} size
 * @param {String} str 搜索或排序
 * @returns
 */
export async function activityOrdersHistory(id, page, size, str) {
    const data = await fetch({
        url: '/user/users/' + id + '/orders/activity/history?search=' + str + '&page=' + page + '&size=' + size,
        method: 'get'
    });
    return data;
}

/**
 * 用户培训订单管理【当前订单】
 *
 * @param {String} userid
 * @param {Int} page
 * @param {Int} size
 * @param {String} str 搜索或排序
 * @returns
 */
export async function trainOrders(userid, page, size, str) {
    const data = await fetch({
        url: '/user/users/' + userid + '/orders/train/current?search=' + str + '&page=' + page + '&size=' + size,
        method: 'get'
    });
    return data;
}
/**
 * 用户培训订单管理【历史订单】
 *
 * @param {String} userid
 * @param {Int} page
 * @param {Int} size
 * @param {String} str 搜索或排序
 * @returns
 */
export async function trainOrdersHistory(userid, page, size, str) {
    const data = await fetch({
        url: '/user/users/' + userid + '/orders/train/history?search=' + str + '&page=' + page + '&size=' + size,
        method: 'get'
    });
    return data;
}

// /user/users/{id}/orders/venueroom 查询会员场馆活动室订单

/**
 * 用户活动室预定订单【当前订单】
 *
 * @param {String} userid
 * @param {Int} page
 * @param {Int} size
 * @param {String} str 搜索或排序
 * @returns
 */
export async function roomOrders(userid, page, size, str) {
    const data = await fetch({
        url: '/user/users/' + userid + '/orders/venueroom/current?search=' + str + '&page=' + page + '&size=' + size,
        method: 'get'
    });
    if (data.content && data.content.length) {
        data.content.forEach(function(item) {
            item.coverPic = getFileUrl(item.coverPic);
        })
    }
    return data;
}
/**
 * 用户活动室预定订单【历史订单】
 *
 * @param {String} userid
 * @param {Int} page
 * @param {Int} size
 * @param {String} str 搜索或排序
 * @returns
 */
export async function roomOrdersHistory(userid, page, size, str) {
    const data = await fetch({
        url: '/user/users/' + userid + '/orders/venueroom/history?search=' + str + '&page=' + page + '&size=' + size,
        method: 'get'
    });
    // if (data.content && data.content.length) {
    //     data.content.forEach(function(item) {
    //         item.coverPic = getFileUrl(item.coverPic);
    //     })
    // }
    return data;
}

/**
 * 活动问卷是否有提交
 */
export async function fetchAnswer(id, userid) {
    const data = await fetch({
        url: '/activity/activitys/' + id + '/usersheets/' + userid,
        method: 'get'
    });
    return data;
}

/**
 * 系统消息
 * @export
 * @param {String} str 查询条件
 * @param {Number} page 页码
 * @param {Number} size 每页显示数量
 * @returns
 */
export async function messageList(page, size) {
    let res = await fetch({
        ///sys/suggestions
        url: '/sys/suggestions?page=' + page + '&size=' + size + '&sort=createTime~desc',
        method: 'get'
    });
    return res;
}
