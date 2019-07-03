const koaRouter = require('koa-router')
const sysApi = require('../api/sys')
const userApi = require('../api/user')
const { getAuthorizeURL, getUserByCode, getSignatureAsync } = require('../api/wechat')
const { getFileUrl, RELATION, IDENTIFY_STATUS, VENUE_ORDER_STATUS, TRAIN_ORDER_STATUS, ORDER_STATUS, getEncAse192 } = require('../api/util')
const activityApi = require('../api/activity')
const venueApi = require('../api/venues')
const trainApi = require('../api/train')
const vodApi = require('../api/vod')
const teamApi = require('../api/team')
const collectApi = require('../api/collect')
const volunteerApi = require('../api/volunteer')
const issueApi = require('../api/issue')
const md5 = require('md5')
const exhibitionApi = require('../api/exhibition')
const { getBirthday } = require('../../util/GetBirthdayAndSex')
import { parse as urlParse } from 'url';
import { parse as queryParse } from 'querystring';
import config from '../../config';

const moment = require('moment')
moment.locale('zh-cn');

const router = new koaRouter()

function setUserSession(ctx, user) {
    user.pic = getFileUrl(user.pic);
    user.authStatus = IDENTIFY_STATUS[user.identifyStatus];
    user.weixin = user.bindWeixin ? '已绑定' : '您还没有绑定微信～～！';
    ctx.session.user = user;
    return user;
}

// 登录
router.post('/user/login', async(ctx) => {
    let body = ctx.request.body;
    let data = {
        mobile: body.mobile,
        password: body.password
    }
    let ret = {
        success: false,
        user: null,
        msg: '用户名或密码错误'
    };
    try {
        let user = await userApi.login('mobile', data);
        if (user.id) {
            user = setUserSession(ctx, user);
            ret.success = true;
            ret.user = user;
            ret.msg = '登录成功';
        }
    } catch (ex) {}
    ctx.body = ret;
});

// 登录
router.post('/user/wxlogin', async(ctx) => {
    let body = ctx.request.body;
    let result = {
        success: true,
        user: null,
        state: null,
        msg: null
    }
    try {
        let user = await userApi.login('weixin', { uid: body.uid });
        if (user.id) {
            ctx.session.user = setUserSession(ctx, user);
            result.user = user;
        }
    } catch (error) {
        result.success = false;
        result.state = error.response.status;
        result.msg = error.response.data ? error.response.data.message || null : null;
    }
    ctx.body = result;
});
// =======================================  微信登录  ============================================
function redirect(ctx, next) {
    const target = config.SITE_ROOT_URL + '/login/oauth'
    const scope = 'snsapi_userinfo'
    const { visit, id } = ctx.query
    const params = id ? `${visit}_${id}` : visit
    const url = getAuthorizeURL(scope, target, params)
    return url;
}

async function getWxAuthorizedUser(ctx, next) {
    let url = ctx.query.url
    url = decodeURIComponent(url)

    const urlObj = urlParse(url)
    const params = queryParse(urlObj.query)
    const code = params.code
    const user = await getUserByCode(code)
    return user;
}
async function signature(ctx, next) {
    let url = ctx.query.url

    if (!url) ctx.throw(404)

    url = decodeURIComponent(url)

    const params = await getSignatureAsync(url)
    return params;
}

// 微信授权地址
router.get('/wechat/redirect', async(ctx, next) => {
    let url = redirect(ctx, next)
    ctx.body = url;
});

// 获取授权成功后的用户信息
router.get('/wechat/oauth', async(ctx, next) => {
    let wechatUser = await getWxAuthorizedUser(ctx, next)
    let result = {
        success: true,
        data: wechatUser
    }
    ctx.body = result;
});

router.get('/wechat/signature', async(ctx, next) => {
        let params = await signature(ctx, next)
        ctx.body = {
            success: true,
            data: params
        }
    })
    // =======================================  微信登录END  =========================================

// 登出
router.post('/user/loginOut', async(ctx) => {
    ctx.session = null
    ctx.body = { success: true }
});

// 注册
router.post('/register', async(ctx, next) => {
        let type = ctx.params.type;
        let signInfo = ctx.request.body;
        signInfo.registerMode = 'mobileweb';
        signInfo.unitId = ctx.curUnit.id;
        try {
            let data = await userApi.register(signInfo);
            ctx.body = data;
        } catch (error) {
            ctx.body = error.response.data;
        }
    })
    // 修改密码
router.post('/user/editpassword', async(ctx) => {
    let content = { newPwd: ctx.request.body.newPwd };
    let mobile = ctx.request.body.mobile;
    let status = await userApi.editpassword(content, mobile);
    ctx.body = status;
})

/** 修改用户信息 */
router.post('/user/userinfo', async(ctx) => {
    let userInfo = ctx.request.body;
    let res = await userApi.modifyUserInfo(userInfo.id, userInfo);
    let user = await userApi.getUserInfo(userInfo.id);
    user = setUserSession(ctx, user);
    ctx.body = res;
});

/**
 * 修改用户头像
 */
router.post('/user/photo', async(ctx, next) => {
    let res = {
        success: false,
        message: ''
    };
    let body = ctx.request.body;
    let photo = body.files.photo;
    let result = await sysApi.saveFile(photo);
    if (!result.success) {
        res.message = result.msg;
    } else {
        try {
            await userApi.modifyUserInfo(body.fields.id, { pic: result.url });
            let user = await userApi.getUserInfo(body.fields.id);
            user = setUserSession(ctx, user);
            res.success = true;
        } catch (error) {
            res.success = false;
            res.message = error.response.data.message || '修改失败';
        }
    }
    ctx.body = res;
})

// 微信登录后，从个人中心进入绑定手机号
router.post('/user/bindmobile/:id', async(ctx) => {
    let userId = ctx.params.id;
    let mobile = ctx.request.body.mobile;
    let password = ctx.request.body.newPwd;
    let content = { newPwd: password };
    try {
        let data = await userApi.modifyUserInfo(userId, { mobile: mobile });
        let status = await userApi.editpassword(content, mobile);
        let user = await userApi.getUserInfo(id);
        user = setUserSession(ctx, user);
        ctx.body = '';
    } catch (ex) {
        ctx.body = ex.response.data;
    }
})

// 微信授权后，绑定已有帐号
router.post('/user/bindAccount', async(ctx) => {
    let mobile = ctx.request.body.mobile;
    let code = ctx.request.body.code;

    let wechartInfo = ctx.request.body.wechartInfo;
    try {
        let res = await userApi.verifyCode(mobile, code); // 验证验证码
        if (!res.success) {
            return ctx.body = {
                success: false,
                message: res.messagemessage
            }
        }
    } catch (error) {
        return ctx.body = {
            success: false,
            message: error.response.data ? error.response.data.message : '验证码错误'
        }
    }
    try {
        let userList = await userApi.users('search=mobile:' + mobile, 0, -1); // 确认帐号是否已存在
        if (userList.content.length === 0) {
            return ctx.body = {
                success: false,
                message: '帐号不存在'
            }
        } else {
            let user = userList.content[0];
            await userApi.modifyUserInfo(user.id, wechartInfo);
            user = await userApi.getUserInfo(user.id);
            user = setUserSession(ctx, user);
            return ctx.body = {
                success: true,
                user: user
            };
        }
    } catch (error) {
        return ctx.body = {
            success: false,
            message: error.response && error.response.data ? error.response.data.message : '绑定失败'
        };
    }
})

// 获取当前用户信息
router.get('/user/info/:id', async(ctx) => {
    let id = ctx.params.id;
    let user = await userApi.getUserInfo(id);
    user = setUserSession(ctx, user);
    ctx.body = user;
});

// 当前订单（活动）
router.get('/user/activity/current', async(ctx) => {
    let user = ctx.session.user
    let data = []
    if (user) {
        let datestr = moment().format('YYYY-MM-DD');
        let searchCurrent = 'isHidden:false,userId:' + user.id + ',itmDate>' + datestr + '~' + datestr; //当前订单
        data = await activityApi.activityOrder(searchCurrent, 0, -1);
        data = data.content;
        if (data.length) {
            data = await activityOrders(data);
        }
    }

    ctx.body = data;
});

// 历史订单（活动）
router.get('/user/activity/history/:page', async(ctx) => {
    let page = ctx.params.page || 0;
    let user = ctx.session.user
    let data = []
    if (user) {
        let datestr = moment().format('YYYY-MM-DD');
        let searchHistory = 'isHidden:false,userId:' + user.id + ',itmDate<' + datestr; //历史订单
        data = await activityApi.activityOrder(searchHistory, page, 10);
        if (data.content.length) {
            data.content = await activityOrders(data.content);
        }
    }

    ctx.body = data;
});

// 当前订单（场馆）
router.get('/user/venue/current', async(ctx) => {
    let user = ctx.session.user
    let data = []
    if (user) {
        let datestr = moment().format('YYYY-MM-DD');
        let searchCurrent = 'isHidden:false,userId:' + user.id + ',itms.itmDate>' + datestr + '~' + datestr; //当前订单
        data = await venueApi.getVenueOrders(searchCurrent, 0, -1);
        data = data.content;
        if (data.length) {
            data = await venueOrders(data);
        }
    }

    ctx.body = data;
});

// 历史订单（场馆）
router.get('/user/venue/history/:page', async(ctx) => {
    let page = ctx.params.page || 0;
    let user = ctx.session.user
    let data = []
    if (user) {
        let datestr = moment().format('YYYY-MM-DD');
        let searchHistory = 'isHidden:false,userId:' + user.id + ',itms.itmDate<' + datestr; //历史订单
        data = await venueApi.getVenueOrders(searchHistory, page, 10);
        if (data.content.length) {
            data.content = await venueOrders(data.content);
        }
    }

    ctx.body = data;
});

// 当前订单（培训）
router.get('/user/train/current', async(ctx) => {
    let user = ctx.session.user
    let data = []
    if (user) {
        let datestr = moment().format('YYYY-MM-DD');
        let searchCurrent = 'isHidden:false,userId:' + user.id + ',trainEndTime>' + datestr + '~' + datestr; //当前订单
        data = await trainApi.getOrder(searchCurrent, 0, -1);
        data = data.content;
        if (data.length) {
            data = await trainOrders(data);
        }
    }

    ctx.body = data;
});

// 历史订单（培训）
router.get('/user/train/history/:page', async(ctx) => {
    let page = ctx.params.page || 0;
    let user = ctx.session.user
    let data = []
    if (user) {
        let datestr = moment().format('YYYY-MM-DD');
        let searchHistory = 'isHidden:false,userId:' + user.id + ',trainEndTime<' + datestr; //历史订单
        data = await trainApi.getOrder(searchHistory, page, 10);
        if (data.content.length) {
            data.content = await trainOrders(data.content);
        }
    }

    ctx.body = data;
});

// 我的作品
router.get('/user/works/:page', async(ctx) => {
    let page = ctx.params.page || 0;
    let user = ctx.session.user
    let data = []
    if (user) {
        let search = 'search=user.id:' + user.id + '&sort=creteTime~desc'; //当前订单
        data = await collectApi.workList(search, page, 5);
        if (data.content.length) {
            data.content.forEach(function(item) {
                item.files[0].filePath = getFileUrl(item.files[0].filePath);
                item.orderStatusName = item.isPass == null ? '审核中' : item.isPass ? '审核通过' : '审核拒绝';
                item.createTime = moment(item.creteTime).format('YYYY.MM.DD HH:mm')

            })
        }
    }

    ctx.body = data;
});

// 我的志愿者服务（当前)
router.get('/user/volunteer/current', async(ctx) => {
    let user = ctx.session.user
    let data = []
    if (user) {
        let datestr = moment().format('YYYY-MM-DD HH:mm:ss');
        let searchCurrent = 'userId:' + user.id + ',endTime>' + datestr + '&sort=applyTime~desc'; //当前订单
        data = await volunteerApi.volunRecruitApplys(searchCurrent, 0, -1);
        data = data.content;
        if (data.length) {
            data = await volunteerOrders(data);
        }
    }

    ctx.body = data;
});

// 我的志愿者服务（历史)
router.get('/user/volunteer/history/:page', async(ctx) => {
    let page = ctx.params.page || 0;
    let user = ctx.session.user
    let data = []
    if (user) {
        let datestr = moment().format('YYYY-MM-DD HH:mm:ss');
        let searchHistory = 'userId:' + user.id + ',endTime<' + datestr + '&sort=applyTime~desc'; //历史订单
        data = await volunteerApi.volunRecruitApplys(searchHistory, page, 10);
        if (data.content.length) {
            data.content = await volunteerOrders(data.content);
        }
    }

    ctx.body = data;
});

// 活动订单数据处理
async function activityOrders(orders) {
    let activityIds = [];
    activityIds = orders.map((x) => {
        return x.activityId;
    })
    let activityList = await activityApi.getActivityList('id:' + activityIds.join('~'), 0, -1);
    activityList = activityList.content;

    let orderList = [];
    orders.map((x) => {
        let usedSeats = x.seats.filter(item => item.used == true);
        x.usedSeats = usedSeats.length;
        let dateNow = new Date();
        let actStart = new Date(x.itmDate + ' ' + x.itmStarttime);
        x.isoverdue = dateNow > actStart; // 過期
        x.orderStatusName = ORDER_STATUS[x.orderStatus];
        if (usedSeats.length === x.seats.length) {
            x.orderStatusName = '已验票';
        } else if (x.isoverdue) {
            x.orderStatusName = '已结束'
        }

        let activityInfo = activityList.find(item => item.id === x.activityId);
        if (activityInfo) {
            activityInfo.coverPic = getFileUrl(activityInfo.coverPic);
            x.activityInfo = activityInfo;
            x.createTime = moment(x.createTime).format('YYYY.MM.DD HH:mm')
            x.itmDateTime = moment(x.itmDate).format('YYYY.MM.DD ') + x.itmStarttime + '-' + x.itmEndtime;
            orderList.push(x);
        }
        return x;
    })
    return orderList;
}

// 我的预定的场馆，数据处理
async function venueOrders(orders) {
    let ids = [];
    ids = orders.map((x) => {
        return x.roomId;
    })
    let roomList = await venueApi.getRoomsList('id:' + ids.join('~'), 0, -1);
    roomList = roomList.content;

    let orderList = [];
    orderList = orders.map((x) => {
        x.orderStatusName = VENUE_ORDER_STATUS[x.status]; // 订单状态
        let roomInfo = roomList.find(item => item.id === x.roomId); // 场馆信息
        roomInfo.coverPic = getFileUrl(roomInfo.coverPic); // 图片
        x.roomInfo = roomInfo;
        return x;
    })
    return orderList;
}

// 我报名的培训，数据处理
async function trainOrders(orders) {
    let ids = [];
    ids = orders.map((x) => {
        return x.trainId;
    })
    let trainList = await trainApi.getTrainList('id:' + ids.join('~'), 0, -1);
    trainList = trainList.content;

    let orderList = [];
    let nowTime = moment().format('x'); //当前时间戳

    for (let i = 0; i < orders.length; i++) {
        let order = orders[i];
        order.hasCancel = false; // 是否可以退订
        order.hasDel = (order.orderStatus === 'Rejected' || order.orderStatus === 'Canceled'); // 是否可以删除
        order.orderStatusName = TRAIN_ORDER_STATUS[order.orderStatus]; // 订单状态
        order.picture = null;
        order.coordinate = null;

        let trainInfo = trainList.find(item => item.id === order.trainId); // 培训信息
        if (trainInfo) {
            order.picture = getFileUrl(trainInfo.picture); // 图片
            order.coordinate = trainInfo.coordinate;
            if ((order.orderStatus === 'WaitAudit' || order.orderStatus === 'Success') && nowTime <= moment(trainInfo.enrolEndTime).format('x')) {
                order.hasCancel = true;
            }
            if (order.orderStatus === 'WaitAudit' && nowTime > moment(trainInfo.enrolEndTime).format('x')) {
                order.hasDel = true;
            }
        }
        orderList.push(order);
    }
    return orderList;
}

// 我的报名的志愿者，数据处理
async function volunteerOrders(orders) {
    let ids = [];
    ids = orders.map(x => x.recruitId)
    let volunteerLst = await volunteerApi.volunrecruitList('search=id:' + ids.join('~'), 0, -1)
    volunteerLst = volunteerLst.content;

    let orderList = [];
    orderList = orders.map((x) => {
        let volInfo = volunteerLst.find(item => item.id === x.recruitId);
        x.coverPic = getFileUrl(volInfo.coverPic);
        x.applyTime = moment(x.applyTime).format('YYYY.MM.DD HH:mm')
        x.volInfo = volInfo;
        x.startTime = moment(x.startTime).format('YYYY-MM-DD HH:mm')
        x.endTime = moment(x.endTime).format('YYYY-MM-DD HH:mm')
        x.orderStatusName = x.isPass == null ? '审核中' : x.isPass ? '已通过' : '审核不通过';
        return x;
    })
    return orderList;
}

// 取消用户收藏
router.post('/favorite/cancel', async(ctx, next) => {
    let favoritesId = ctx.request.body.objectId;
    let res = '';
    try {
        res = await userApi.delFavorites(ctx.session.user.id, favoritesId);
    } catch (ex) {
        res = ex.response.data;
    }
    ctx.body = res;
})

// 增加用户收藏
router.post('/favorite/add', async(ctx, next) => {
    let favoriteObj = ctx.request.body;
    let uid = ctx.session.user.id;
    Object.assign(favoriteObj, { userId: uid });
    let res = '';
    try {
        res = await userApi.favorites(uid, favoriteObj);
    } catch (ex) {
        res = ex.response.data;
    }

    ctx.body = res
})

// 获取用户收藏
router.get('/favorite/:type', async(ctx, next) => {
    let type = ctx.params.type;
    let uid = ctx.session.user.id;
    let page = ctx.query.page ? ctx.query.page : 0;
    let res = [];
    try {
        res = await userApi.getFavorites(uid, type, page, 10);
        if (res.content && res.content.length) {
            let objectIds = res.content.map(x => x.objectId);

            switch (type) {
                case 'Activity':
                    let activityList = await activityApi.getActivityList('id:' + objectIds.join('~'), 0, -1);
                    activityList = activityList.content;
                    res.content.forEach(element => {
                        let detail = activityList.find(item => item.id === element.objectId);
                        if (detail) {
                            detail.coverPic = getFileUrl(detail.coverPic);
                            element.picAddress = getFileUrl(detail.coverPic);
                            element.title = detail.name;
                            element.object = detail;
                        }
                    });
                    break;
                case 'Train':
                    let trainList = await trainApi.getTrainList('id:' + objectIds.join('~'), 0, -1);
                    trainList = trainList.content;
                    res.content.forEach(element => {
                        let detail = trainList.find(item => item.id === element.objectId);
                        if (detail) {
                            detail.picture = getFileUrl(detail.picture);
                            element.picAddress = getFileUrl(detail.picture);
                            element.title = detail.title;
                            element.object = detail;
                        }
                    });
                    break;
                case 'VenueRoom':
                    let roomList = await venueApi.getRoomsList('id:' + objectIds.join('~'), 0, -1);
                    roomList = roomList.content;
                    res.content.forEach(element => {
                        let detail = roomList.find(item => item.id === element.objectId);
                        if (detail) {
                            detail.coverPic = getFileUrl(detail.coverPic);
                            element.picAddress = getFileUrl(detail.coverPic);
                            element.title = detail.name;
                            element.object = detail;
                        }
                    });
                    break;
                case 'ArtTeam': // 文艺团队
                    let teamList = await teamApi.getTeamList('id:' + objectIds.join('~'), 0, -1);
                    teamList = teamList.content;
                    res.content.forEach(element => {
                        let detail = teamList.find(item => item.id === element.objectId);
                        if (detail) {
                            detail.coverPic = getFileUrl(detail.coverPic);
                            element.picAddress = getFileUrl(detail.coverPic);
                            element.title = detail.name;
                            element.object = detail;
                        }
                    });
                    break;
                case 'ArtWorks': // 作品征集
                    let collectList = await collectApi.collectList('id:' + objectIds.join('~'), 0, -1);
                    collectList = collectList.content;
                    res.content.forEach(element => {
                        let detail = collectList.find(item => item.id === element.objectId);
                        if (detail) {
                            detail.coverPic = getFileUrl(detail.coverPic);
                            element.picAddress = getFileUrl(detail.coverPic);
                            element.title = detail.name;
                            element.object = detail;
                        }
                    });
                    break;
                case 'Demands': // 点播
                    let demandsList = await vodApi.demandsList('id:' + objectIds.join('~'), 0, -1);
                    demandsList = demandsList.content;
                    res.content.forEach(element => {
                        let detail = demandsList.find(item => item.id === element.objectId);
                        if (detail) {
                            detail.coverPic = getFileUrl(detail.coverPic);
                            element.picAddress = getFileUrl(detail.coverPic);
                            element.title = detail.name;
                            element.object = detail;
                        }
                    });
                    break;
                case 'VolunteerRecruit': // 志愿者招募活动
                    let volunActivitys = await volunteerApi.volunrecruitList('search=id:' + objectIds.join('~'), 0, -1);
                    volunActivitys = volunActivitys.content;
                    res.content.forEach(element => {
                        let detail = volunActivitys.find(item => item.id === element.objectId);
                        if (detail) {
                            detail.coverPic = getFileUrl(detail.coverPic);
                            element.picAddress = detail.coverPic;
                            element.title = detail.name;
                            element.object = detail;
                        }
                    });

                    break;
                case 'Information': // 资讯
                    let informationList = await issueApi.getInformationList('id:' + objectIds.join('~'), 0, -1);
                    console.log(informationList);
                    informationList = informationList.content;
                    res.content.forEach(element => {
                        let detail = informationList.find(item => item.id === element.objectId);
                        if (detail) {
                            detail.coverPic = getFileUrl(detail.coverPic);
                            element.picAddress = detail.coverPic;
                            element.title = detail.title;
                            element.type = detail.type;
                            element.object = detail;
                        }
                    });

                    break;
                case 'DigitalShow': // 数字展览
                    let exhibitionList = await exhibitionApi.digitalList('search=id:' + objectIds.join('~'), 0, -1);
                    exhibitionList = exhibitionList.content;
                    res.content.forEach(element => {
                        let detail = exhibitionList.find(item => item.id === element.objectId);
                        if (detail) {
                            detail.coverPic = getFileUrl(detail.coverPic);
                            element.picAddress = detail.coverPic;
                            element.title = detail.title;
                            element.object = detail;
                        }
                    });

                    break;
            }
            res.content = res.content.filter(x => x.object)
        }
    } catch (ex) {
        res = { content: [], totalPages: 0 };
    }

    ctx.body = res
})

// 发送验证码
// newMobile:用户注册/修改手机号，必须是未注册手机号；
// registedMobile:忘记密码/绑定账号，必须是已经注册的手机号码;
// mobile:可以是任意手机号码
router.post('/vcodes', async(ctx, next) => {
    let mobile = ctx.request.body.mobile;
    let state = ctx.request.body.state; //newMobile ;registedMobile; mobile
    let res = {
        success: false,
        message: ''
    };
    let signStrs = `mobile=${mobile}&flag=register`
    let signStrMd5 = ctx.request.body.signStr;
    // let res = {};
    if (signStrMd5 !== md5(signStrs)) {
        res.message = '非法操作！';
        ctx.body = res;
        return;
    }
    try {
        if (state === 'registedMobile' || state === 'newMobile') {
            let userList = await userApi.users('search=mobile:' + mobile, 0, -1);
            if (state === 'newMobile') {
                res.success = userList.content.length === 0;
                res.message = userList.content.length === 0 ? await userApi.getVCode(mobile) : '手机号' + mobile + '已注册';
            } else {
                res.success = userList.content.length !== 0;
                res.message = userList.content.length !== 0 ? await userApi.getVCode(mobile) : '手机号' + mobile + '未注册';
            }
        } else {
            res.success = true;
            res.message = await userApi.getVCode(mobile);
        }

    } catch (ex) {
        res.success = false;
        res.message = ex.response.data.message || '';
    }
    ctx.body = res;
})

// 校验验证码
router.post('/verifyVcodes', async(ctx, next) => {
    let mobile = ctx.request.body.mobile;
    let code = ctx.request.body.code;
    try {
        let res = await userApi.verifyCode(mobile, code);
        ctx.body = res;
    } catch (error) {
        ctx.body = error.response.data || { message: '验证码错误' };
    }
})

// 系统消息
router.get('/user/message/current/:page', async(ctx) => {
    let page = ctx.params.page || 0;
    let user = ctx.session.user
    let data = []
    if (user) {
        data = await userApi.messageList(page, 10);
    }
    ctx.body = data;
});

// 意见反馈
router.post('/sys/Suggestions', async(ctx, next) => {
    let name = ctx.session.user.name || ctx.session.user.nickname;
    let content = ctx.request.body;
    try {
        let res = await sysApi.postSuggestions(content);
        ctx.body = res;
    } catch (error) {
        ctx.body = error.response.data || { message: '提交失败' };
    }
})

// 获取认证信息
router.get('/user/identify', async(ctx) => {
    let user = ctx.session.user;
    let search = ctx.query.search;
    let data = await userApi.getIdentifyInfo(user.id, search);
    if (data.content && data.content.length) {
        ctx.body = data.content[0];
    } else {
        ctx.body = null;
    }
})

//实名认证
router.post('/user/auth', async(ctx, next) => {
    let res = {
        success: false,
        message: ''
    };
    let body = ctx.request.body;
    let result = await sysApi.saveFile(body.files.handpic);
    if (!result.success) {
        res.message = result.msg;
    } else {
        try {
            let authInfo = body.fields;
            authInfo.handpic = result.url;
            authInfo.unitId = ctx.curUnit.id;
            let resupload = await userApi.identify(authInfo);
            let user = await userApi.getUserInfo(authInfo.userId);
            user = setUserSession(ctx, user);
            res.success = true;
        } catch (error) {
            res.success = false;
            res.message = error.response.data.message || '提交失败';
        }
    }
    ctx.body = res;
})

// 获取当前用户的常用联系人
router.get('/user/contacts', async(ctx) => {
    let user = ctx.session.user;
    let members = await userApi.getMember(user.id);
    if (members && members.length) {
        let identifies = await userApi.getIdentifylst('userId:' + user.id + ',isSelf:false,identifyStatus:Fail&sort=auditTime~desc&size=-1')
        members = members.map((x) => {
            x.authStatus = IDENTIFY_STATUS[x.identifyStatus];
            x.relationName = RELATION[x.relation];
            if (x.identifyStatus == 'Fail') {
                let audit = identifies.content.filter((item) => item.idnumber == x.idNumber);
                if (audit.length) {
                    x.auditComment = audit[0].auditComment;
                    x.handpic = audit[0].handpic
                    x.handpic2 = getFileUrl(audit[0].handpic)
                }
            }
            delete x.birthday;
            delete x.sex;
            x.idNumber = getEncAse192(x.idNumber, 'szwhg');
            return x;
        });

        let sortStr = ['Fail', 'Not', 'Wait', 'Yes'];
        members.sort(function(a, b) { return sortStr.indexOf(a.identifyStatus) > sortStr.indexOf(b.identifyStatus) })
    }
    ctx.body = members || [];
})

// 删除常用联系人
router.delete('/user/contact/:id', async(ctx, next) => {
    let res = {
        success: false,
        message: ''
    };
    try {
        let members = await userApi.getMember(ctx.session.user.id);
        let id;
        if (members && members.length) {
            members.forEach((x) => {
                if (ctx.params.id === x.idNumber.replace(/^(.{4})(.*)(.{4})$/, "$1********$3")) {
                    id = x.idNumber;
                }
            })
        }
        await userApi.delMember(ctx.session.user.id, id);
        res.success = true;
    } catch (ex) {
        res.success = false;
        res.message = error.response.data.message || '删除联系人失败';
    }
    ctx.body = res;
})

// 添加常用联系人
router.post('/user/contact', async(ctx, next) => {
    let res = {
        success: false,
        message: ''
    };
    let body = ctx.request.body;
    let authInfo = body.fields;

    if (authInfo.isEdit) {
        await userApi.delMember(ctx.session.user.id, authInfo.idnumber);
    }

    // 常用联系人信息
    let contactData = {
        'name': authInfo.realname,
        'idNumber': authInfo.idnumber,
        'mobile': authInfo.mobile,
        'relation': authInfo.relation
    }

    // 常用联系人认证信息
    let identifyInfo = {
        userId: authInfo.userId,
        realname: authInfo.realname,
        idnumber: authInfo.idnumber,
        mobile: authInfo.mobile,
        identifyStatus: 'Wait',
        isSelf: false,
        nickname: authInfo.nickname,
        unitId: ctx.curUnit.id,
        relation: authInfo.relation
    };

    let birthData = getBirthday(authInfo.idnumber);
    if (birthData.error) {
        res.message = '证件号错误';
        return ctx.body = res;
    }

    contactData.sex = birthData.sex
    contactData.birthday = moment(birthData.birthday).format('YYYY-MM-DD')
    try {
        await userApi.addMember(authInfo.userId, contactData); // 添加联系人
    } catch (ex) {
        res.success = false;
        res.message = ex.response.data.message || '添加联系人失败';
        return ctx.body = res;
    }
    // 申请实名认证
    let url = '';
    let certifyImage = body.files.handpic;
    if (!authInfo.handpic && certifyImage) {
        let result = await sysApi.saveFile(certifyImage); // 保存认证图片
        if (!result.success) {
            res.success = false
            res.message = result.msg
            return ctx.body = res;
        }
        url = result.url;
    } else {
        url = authInfo.handpic;
    }

    identifyInfo.handpic = url;

    try {
        let resupload = await userApi.identify(identifyInfo); // 添加认证申请
    } catch (ex) {
        res.success = false;
        res.message = ex.response.data.message || '添加联系人失败';
    }
    let user = await userApi.getUserInfo(authInfo.userId);
    user = setUserSession(ctx, user);
    res.success = true;

    ctx.body = res;
})

module.exports = router;