const fs = require('fs')
const path = require('path')
const router = require('koa-router')()
const users = require('../models/users')
const activity = require('../models/activity')
const train = require('../models/train')

const team = require('../models/team')
const collect = require('../models/collect')
const eventActivities = require('../models/eventActivities')
const sys = require('../models/sys')
const heritage = require('../models/heritage')
const volunrecruit = require('../models/volunteer')
const venues = require('../models/venues')
const vod = require('../models/vod')
var filter = require('../util/filter');
var assist = require('../util/assist');
const config = require('../config')
const formData = require('form-data')
const getBirthdayAndSex = require('../util/GetBirthdayAndSex');
const logUtil = require('../util/log-util')
const moment = require('moment')

const issue = require('../models/issue')
const exhibition = require('../models/exhibition')

router.prefix('/user')
const RELATION = {
    'children': '子女',
    'parent': '父母',
    'mate': '夫妻',
    'friend': '朋友'
};
const IDENTIFY_STATUS = {
    'Not': '未认证',
    'Wait': '审核中',
    'Yes': '已认证',
    'Fail': '认证失败'
};
const ORDER_STATUS = {
    'reserved': '未验票',
    'drawn': '已出票',
    'canceled': '已取消'
}

const VENUE_ORDER_STATUS = {
    'created': '待审核',
    'success': '预定成功',
    'reject': '审核不通过',
    'cancel': '已取消'
}
const TRAIN_ORDER_STATUS = {
    'WaitAudit': '待审核',
    'Success': '审核通过',
    'Rejected': '审核不通过',
    'Canceled': '已取消'
}

// 活动订单数据处理
async function activityOrders(orders) {
    let activityIds = [];
    activityIds = orders.map((x) => {
        return x.activityId;
    })
    let sort = 'createTime~desc';
    let activityList = await activity.activityList('id:' + activityIds.join('~'), 0, -1, sort);
    activityList = activityList.content;

    let orderList = [];
    orderList = orders.map((x) => {

        // x.statusName = '未验票';
        let usedSeats = x.seats.filter(item => item.used == true);
        // if (usedSeats.length == x.seats.length) {
        //   x.statusName = '已验票'
        // }
        x.usedSeats = usedSeats.length;

        let dateNow = new Date();
        let actStart = new Date(x.itmDate + ' ' + x.itmStarttime);

        x.isoverdue = dateNow > actStart;

        let activityInfo = activityList.find(item => item.id === x.activityId);
        activityInfo.coverPic = assist.getFileUrl(activityInfo.coverPic);
        x.activityInfo = activityInfo;
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
    let sort = 'createTime~desc';
    let roomList = await venues.rooms('search=id:' + ids.join('~'), 0, -1, sort);
    roomList = roomList.content;

    let orderList = [];
    orderList = orders.map((x) => {
        x.statusName = VENUE_ORDER_STATUS[x.status]; // 订单状态
        let roomInfo = roomList.find(item => item.id === x.roomId); // 场馆信息
        roomInfo.coverPic = assist.getFileUrl(roomInfo.coverPic); // 图片
        x.roomInfo = roomInfo;
        let dnow = new Date();
        x.isoverdue = false;
        x.itms.forEach(function(itm) {
            if (dnow > new Date(itm.itmDate + ' ' + itm.itmStarttime + ':00')) {
                x.isoverdue = true;
            }
        })

        return x;
    })
    return orderList;
}

// 我的报名的培训，数据处理
async function trainOrders(orders) {
    let ids = [];
    ids = orders.map((x) => {
        return x.trainId;
    })
    let trainList = await train.trainList('search=id:' + ids.join('~'), 0, -1, 'isTop~desc,startDate~desc');
    trainList = trainList.content;

    let orderList = [];
    orderList = orders.map((x) => {
        x.statusName = TRAIN_ORDER_STATUS[x.orderStatus]; // 订单状态
        let trainInfo = trainList.find(item => item.id === x.trainId); // 培训信息
        trainInfo.picture = assist.getFileUrl(trainInfo.picture); // 图片
        x.trainInfo = trainInfo;
        return x;
    })
    return orderList;
}

// 我的报名的志愿者，数据处理
async function volunteerOrders(orders) {
    let ids = [];
    ids = orders.map((x) => {
        return x.recruitId;
    })
    let volunteerLst = await volunrecruit.fetchVolunrecruitList('search=id:' + ids.join('~'), 0, -1)

    volunteerLst = volunteerLst.content;

    let orderList = [];
    orderList = orders.map((x) => {
        let volInfo = volunteerLst.find(item => item.id === x.recruitId); // 培训信息
        x.coverPic = assist.getFileUrl(volInfo.coverPic); // 订单状态
        x.serviceHour = volInfo.serviceHour;
        x.contactPhone = volInfo.contactPhone;
        return x;
    })
    return orderList;
}

// 个人中心首页,我参加的活动
router.get('/', async (ctx, next) => {
    let user = ctx.session.user || null;
    if (user) {
        user = JSON.parse(JSON.stringify(user));
    }
    let datestr = moment().format('YYYY-MM-DD');
    let searchCurrent = 'isHidden:false,userId:' + user.id + ',itmDate>' + datestr + '~' + datestr; //当前订单
    let searchHistory = 'isHidden:false,userId:' + user.id + ',itmDate<' + datestr; //历史订单

    // 当前订单
    let currentA = await activity.activityOrder(searchCurrent, 0, -1);
    currentA = currentA.content;
    if (currentA.length) {
        currentA = await activityOrders(currentA);
    }

    // 历史订单
    let page = ctx.query.page ? ctx.query.page - 1 : 0
    let size = config.paging.userCenter.size;
    let historyA = await activity.activityOrder(searchHistory, page, size);
    if (historyA.content.length) {
        historyA.content = await activityOrders(historyA.content);
    }
    await ctx.render('user/index', {
        current: currentA, // 当前订单
        history: historyA, // 历史订单
        query: ctx.query // 查询条件
    })
})

// 个人中心，个人信息设置
router.get('/setprofile', async (ctx, next) => {
    let user = ctx.session.user || null;
    if (user) {
        user = JSON.parse(JSON.stringify(user));
    }

    // 用户信息
    let userinfo = await users.fetchUserInfo(user.id);
    if (userinfo.pic != "") {
        userinfo.pic = assist.getFileUrl(userinfo.pic);
        userinfo.identifyName = IDENTIFY_STATUS[userinfo.identifyStatus];
        userinfo.weixin = userinfo.bindWeixin ? '已绑定' : '您还没有绑定微信～～！';
    }

    // 常用联系人
    let members = await users.fetchcontact(user.id);
    let identifies = await users.fetchIdentifys('search=userId:' + user.id + ',identifyStatus:Fail&sort=auditTime~DESC&size=-1');
    if (members && members.length) {
        members = members.map((x) => {
            x.relationName = RELATION[x.relation];
            x.identifyName = IDENTIFY_STATUS[x.identifyStatus];
            if (x.identifyStatus == 'Fail') {
                let audit = identifies.content.filter((item) => item.idnumber == x.idNumber);
                if (audit.length) {
                    x.auditComment = audit[0].auditComment;
                }
            }

            // let IDNum = sys.getDecAse192(x.idNumber, 'szwhg');
            // x.idNumber = IDNum.replace(/^(.{4})(.*)(.{4})$/, "$1********$3")
            return x;
        });
    }

    await ctx.render('user/setprofile', {
        data: userinfo, // 用户基本信息
        contact: members, // 常用联系人
        query: ctx.query, // 查询条件
        bind: ctx.query.bind //绑定微信账号时的返回信息，0：失败；-1：微信账号已绑定；1：绑定成功
    })
});

// 个人中心，我的场馆
router.get('/myvenues', async (ctx, next) => {
    let user = ctx.session.user || null;

    let datestr = moment().format('YYYY-MM-DD');
    let searchCurrent = 'isHidden:false,userId:' + user.id + ',itms.itmDate>' + datestr + '~' + datestr; //当前订单
    let searchHistory = 'isHidden:false,userId:' + user.id + ',itms.itmDate<' + datestr; //历史订单

    // 当前订单
    let currentA = await venues.getVenueOrders(searchCurrent, 0, -1);
    currentA = currentA.content;
    if (currentA.length) {
        currentA = await venueOrders(currentA);
    }

    // 历史订单
    let page = ctx.query.page ? ctx.query.page - 1 : 0;
    let size = config.paging.userCenter.size;
    let historyA = await venues.getVenueOrders(searchHistory, page, size);
    if (historyA.content.length) {
        historyA.content = await venueOrders(historyA.content);
    }
    await ctx.render('user/myvenues', {
        current: currentA, // 当前订单
        history: historyA, // 历史订单
        query: ctx.query // 查询条件
    })
})

const TYPE = {
    stageArts: '舞台艺术类',
    exhibition: '展览艺术类'
}
// 个人中心，我的作品
router.get('/myworks', async (ctx, next) => {
    let user = ctx.session.user || null;
    let search = 'user.id:' + user.id;
    // 线上作品
    let myworks = await collect.workList(search, 0, -1);
    myworks.content.forEach(function(item) {
        item.files[0].filePath = assist.getFileUrl(item.files[0].filePath);
        item.state = item.isPass == null ? '审核中' : item.isPass ? '审核通过' : '审核拒绝';
    })

    // 线下报名
    let search2 = 'userId:' + user.id + '&sort=createTime~desc'
    let usersheets = await collect.getWorkSheets(search2, 0, -1);
    if (usersheets.content && usersheets.content.length) {
        // let ids = usersheets.content.map(x => x.activityId);
        // let acts = await collect.assistActLst(ids.join('~'), 0, -1, 'createTime~desc')
        // acts = acts.content;
        // if (acts.length) {
        usersheets.content.forEach(item => {
            //     let act = acts.find(x => x.id === item.activityId);
            //     if (act) {
            //       item.actCoverPic = assist.getFileUrl(act.coverPic);
            //       item.actName = act.name;
            //       item.actTypeName = TYPE[act.type] || ''
            //     }
            item.works.typeName = TYPE[item.works.type] || ''
            item.createTime = moment(item.createTime).format('YYYY.MM.DD HH:mm:ss')
            item.statuName = item.isPass === null ? '未审核' : (item.isPass ? '已通过' : '已拒绝')
            if (item.isCancel) {
                item.statuName = '用户已取消'
            }
        })
        // }
    }
    // 赛事活动作品
    let eventActivitList= await eventActivities.workList(search, 0, -1);
    
    eventActivitList.content.forEach(function(item) {
        item.files[0].filePath = assist.getFileUrl(item.files[0].filePath);
        item.state = item.isPass == null ? '审核中' : item.isPass ? '审核通过' : '审核拒绝';
    })

    await ctx.render('user/myworks', {
        data: myworks,
        eventActivitList: eventActivitList,
        usersheets: usersheets.content,
        query: ctx.query // 查询条件
    })
})

router.get('/workdetail/:id', async (ctx, next) => {
    let id = ctx.params.id;
    let info = await collect.getActWorkSheet(id);
    if (info) {
        let act = await collect.assistActDetail(info.activityId);
        info.actCoverPic = assist.getFileUrl(act.coverPic);
        info.actName = act.name;
        info.actTypeName = TYPE[act.type] || ''
        info.actDt = moment(act.startDate).format('YYYY.MM.DD') + ' - ' + moment(act.endDate).format('YYYY.MM.DD')
        info.works.typeName = TYPE[info.works.type] || ''
        info.createTime = moment(info.createTime).format('YYYY.MM.DD HH:mm:ss')
        info.statuName = info.isPass === null ? '未审核' : (info.isPass ? '已通过' : '已拒绝')
        if (info.isCancel) {
            info.statuName = '用户已取消'
        }
    }

    await ctx.render('user/workdetail', {
        data: info
    })
})

// 取消活动订单
router.post('/mywork/cancel', async (ctx, next) => {
    let orderid = ctx.request.body.orderid;
    let res = await collect.cancelWorkSheet(orderid);
    ctx.body = res;
})
// 个人中心，我的培训
router.get('/mytrain', async (ctx, next) => {
    let user = ctx.session.user || null;
    let datestr = moment().format('YYYY-MM-DD');
    let searchCurrent = 'isHidden:false,userId:' + user.id + ',trainEndTime>' + datestr + '~' + datestr; //当前订单
    let searchHistory = 'isHidden:false,userId:' + user.id + ',trainEndTime<' + datestr; //历史订单

    // 当前订单
    let currentA = await train.getOrder(searchCurrent, 0, -1);
    currentA = currentA.content;
    if (currentA.length) {
        currentA = await trainOrders(currentA);
    }

    // 历史订单
    let page = ctx.query.page ? ctx.query.page - 1 : 0;
    let size = config.paging.train.size;
    let historyA = await train.getOrder(searchHistory, page, size);
    if (historyA.content.length) {
        historyA.content = await trainOrders(historyA.content);
    }
    await ctx.render('user/mytrain', {
        current: currentA, // 当前订单
        history: historyA, // 历史订单
        query: ctx.query // 查询条件
    })
})
// 个人中心，我的志愿活动
router.get('/myvolunteer', async (ctx, next) => {
    let user = ctx.session.user || null;
    let datestr = moment().format('YYYY-MM-DD HH:mm:ss');
    let searchCurrent = 'userId:' + user.id + ',endTime>' + datestr; //当前订单
    let searchHistory = 'userId:' + user.id + ',endTime<' + datestr; //历史订单
    // 当前志愿活动
    let currentA = await volunrecruit.getRecruitjoinapplys(searchCurrent, 0, -1);
    currentA = currentA.content;
    if (currentA.length) {
        currentA = await volunteerOrders(currentA);
    }
    // 历史志愿活动
    let page = ctx.query.page ? ctx.query.page - 1 : 0;
    let size = config.paging.userCenter.size;
    let historyA = await volunrecruit.getRecruitjoinapplys(searchHistory, page, size);
   
    if (historyA.content.length) {
        historyA.content = await volunteerOrders(historyA.content);
    }

    await ctx.render('user/myvolunteer', {
        current: currentA, // 当前订单
        history: historyA, // 历史订单
        query: ctx.query // 查询条件
    })
})

const FAVORITE_TYPE = {
    Activity: '活动',
    Train: '培训',
    VenueRoom: '场馆',
    ArtTeam: '文艺团队',
    ArtWorks: '作品征集',
    Demands: '点播',
    LiveVideos: '直播',
    VolunteerRecruit: '志愿者活动',
    Information: '资讯',
    DigitalShow: '数字展览'
}
// 个人中心，我的收藏
router.get('/myfavorite', async (ctx, next) => {
    let type = ctx.query.type = ctx.query.type ? ctx.query.type : 'Activity';
    let typeName = FAVORITE_TYPE[type];
    let page = ctx.query.page ? ctx.query.page - 1 : 0;
    let user = ctx.session.user || null;
    if (user) {
        user = JSON.parse(JSON.stringify(user));
    }
    let res = await users.fetchUserFavorites(user.id, type, page, config.paging.favorite.size);
    let objectIds = res.content.map(function(item) {
        return item.objectId
    })

    let favoriteList = [];
    res = res.content;
    if (res.length) {
        switch (type) {
            case 'Activity':
                let sort = 'createTime~desc';
                let activityList = await activity.activityList('id:' + objectIds.join('~'), 0, -1, sort);
                activityList = activityList.content;
                for (let i = 0; i < res.length; i++) {
                    const fItem = res[i];
                    let detail = activityList.find(item => item.id === fItem.objectId);
                    if (!detail) continue;
                    fItem.url = '/activity/detail/' + fItem.objectId;
                    fItem.picAddress = assist.getFileUrl(detail.coverPic);
                    fItem.title = detail.name;
                    fItem.objectTime = detail.holdStartDate + ' 至 ' + detail.holdEndDate;
                    fItem.contact = detail.contactNumber;
                    fItem.objectAddress = detail.address;
                    favoriteList.push(fItem);
                }
                break;
            case 'Train':
                let trainList = await train.trainList('search=id:' + objectIds.join('~'), 0, -1, 'isTop~desc,startDate~desc');
                trainList = trainList.content;
                for (let i = 0; i < res.length; i++) {
                    const fItem = res[i];
                    let detail = trainList.find(item => item.id === fItem.objectId);
                    if (!detail) continue;

                    fItem.url = '/train/detail/' + fItem.objectId;
                    fItem.picAddress = assist.getFileUrl(detail.picture);
                    fItem.title = detail.title;
                    fItem.objectTime = detail.startDate + ' 至 ' + detail.endDate;
                    fItem.contact = detail.contactNumber;
                    fItem.objectAddress = detail.address;
                    favoriteList.push(fItem);
                }
                break;
            case 'VenueRoom': // 场馆
                let roomList = await venues.rooms('search=id:' + objectIds.join('~'), 0, -1);
                roomList = roomList.content;
                for (let i = 0; i < res.length; i++) {
                    const fItem = res[i];
                    let detail = roomList.find(item => item.id === fItem.objectId);
                    if (!detail) continue;
                    fItem.url = '/venues/roomdetail/' + fItem.objectId;
                    fItem.picAddress = assist.getFileUrl(detail.coverPic);
                    fItem.title = detail.name;
                    fItem.contact = detail.telephone;
                    fItem.objectAddress = detail.venue.address;
                    favoriteList.push(fItem);
                }
                break;
            case 'ArtTeam': // 文艺团队
                let teamList = await team.teamList('search=id:' + objectIds.join('~'), 0, -1);
                teamList = teamList.content;
                for (let i = 0; i < res.length; i++) {
                    const fItem = res[i];
                    let detail = teamList.find(item => item.id === fItem.objectId);
                    if (!detail) continue;
                    fItem.url = '/team/teamdetail/' + fItem.objectId;
                    fItem.picAddress = assist.getFileUrl(detail.coverPic);
                    fItem.title = detail.name;
                    fItem.contact = detail.contactPhone;
                    fItem.objectAddress = detail.address;
                    favoriteList.push(fItem);
                }
                break;
            case 'ArtWorks': // 作品征集
                let collectList = await collect.collectList('search=id:' + objectIds.join('~'), 0, -1);
                collectList = collectList.content;
                for (let i = 0; i < res.length; i++) {
                    const fItem = res[i];
                    let detail = collectList.find(item => item.id === fItem.objectId);
                    if (!detail) continue;
                    fItem.url = '/collect/collectdetail/' + fItem.objectId;
                    fItem.picAddress = assist.getFileUrl(detail.coverPic);
                    fItem.contact = detail.contactPhone;
                    fItem.title = detail.name;
                    favoriteList.push(fItem);
                }
                break;
            case 'Demands': //点播
                let demandsList = await vod.demandsList('search=id:' + objectIds.join('~'), 0, -1, 'createTime~desc');
                demandsList = demandsList.content;
                for (let i = 0; i < res.length; i++) {
                    const fItem = res[i];
                    let detail = demandsList.find(item => item.id === fItem.objectId);
                    if (!detail) continue;
                    fItem.objectTime = fItem.createTime;
                    fItem.url = '/vod/detail/' + fItem.objectId + '?type=demands';
                    fItem.picAddress = assist.getFileUrl(detail.coverPic);
                    fItem.title = detail.name;
                    favoriteList.push(fItem);
                }
                break;
            case 'LiveVideos': //直播
                let LiveVideosList = await vod.livevideosList('search=id:' + objectIds.join('~'), 0, -1, 'createTime~desc');
                LiveVideosList = LiveVideosList.content;
                for (let i = 0; i < res.length; i++) {
                    const fItem = res[i];
                    let detail = LiveVideosList.find(item => item.id === fItem.objectId);
                    if (!detail) continue;
                    fItem.objectTime = fItem.createTime;
                    fItem.url = '/vod/detail/' + fItem.objectId + '?type=LiveVideos';
                    fItem.picAddress = assist.getFileUrl(detail.coverPic);
                    fItem.title = detail.name;
                    favoriteList.push(fItem);
                }
                break;
            case 'VolunteerRecruit': //志愿者活动
                let itemList = await volunrecruit.fetchVolunList('search=id:' + objectIds.join('~'), 0, -1);

                itemList = itemList.content;
                for (let i = 0; i < res.length; i++) {
                    const fItem = res[i];
                    let detail = itemList.find(item => item.id === fItem.objectId);
                    if (!detail) continue;
                    fItem.objectTime = detail.startTime + '至' + detail.endTime;
                    fItem.url = '/volunteer/recruitdetail/' + fItem.objectId;
                    fItem.picAddress = assist.getFileUrl(detail.coverPic);
                    fItem.objectAddress = detail.address;
                    fItem.title = detail.name;
                    favoriteList.push(fItem);
                }
                break;
            case 'Information': // 文化资讯
                let infoList = await issue.newslist('id:' + objectIds.join('~'), 0, -1, 'createTime~desc');
                infoList = infoList.content;
                for (let i = 0; i < res.length; i++) {
                    const fItem = res[i];
                    let detail = infoList.find(item => item.id === fItem.objectId);
                    if (!detail) continue;
                    fItem.url = '/issue/detail/' + fItem.objectId;
                    fItem.picAddress = assist.getFileUrl(detail.coverPic);
                    fItem.contact = detail.contactPhone;
                    fItem.title = detail.title;
                    fItem.objectTime = detail.publishTime;
                    favoriteList.push(fItem);
                }
                break;
            case 'DigitalShow': // 数字展览
                let exhibitionList = await exhibition.digitalList('id:' + objectIds.join('~'), 0, -1, 'createTime~desc');
                exhibitionList = exhibitionList.content;
                for (let i = 0; i < res.length; i++) {
                    const fItem = res[i];
                    let detail = exhibitionList.find(item => item.id === fItem.objectId);
                    if (!detail) continue;
                    fItem.url = '/exhibition/detail/' + fItem.objectId;
                    fItem.picAddress = assist.getFileUrl(detail.coverPic);
                    fItem.contact = detail.contactPhone;
                    fItem.title = detail.title;
                    fItem.objectTime = detail.publishTime;
                    favoriteList.push(fItem);
                }
                break;
        }
    }
    await ctx.render('user/myfavorite', {
        data: favoriteList,
        query: ctx.query,
        typeName: typeName
    })

})

//修改密码
router.post("/password", async (ctx) => {
    if (ctx.session.user) {
        let user = ctx.session.user;
        let content = {
            // 'oldPwd': ctx.request.body.oriPwd,
            'newPwd': ctx.request.body.newPwd
        }
        let status = await users.editpassword(content, user.mobile);
        ctx.body = {
            success: status === '',
            msg: status === '' ? '修改成功' : '修改失败，请重试'
        }
        logUtil.logbusiness([ data.mobile + 'modifyPassword', status === '' ? '修改成功' : '修改失败']);
    } else {
        ctx.body = {
            success: false,
            msg: '信息过期，不可修改'
        }
    }
});

// 解绑微信
router.post('/unbindWx', async (ctx) => {
    if (ctx.session.user) {
        if (!ctx.session.user.bindWeixin) {
            ctx.body = {
                success: false,
                msg: '您没有绑定微信'
            }
        } else {
            let binds = ctx.session.user.binds.filter(x => x.type !== 'weixin');
            let userInfo = JSON.parse(JSON.stringify(ctx.session.user));
            userInfo.binds = binds;
            userInfo.bindWeixin = false;
            let res = await users.updateUserInfo(ctx.session.user.id, userInfo);
            let userinfo = await users.fetchUserInfo(ctx.session.user.id);
            ctx.session.user = userinfo;
            ctx.body = {
                success: true,
                msg: '解绑成功'
            }
            logUtil.logbusiness([ data.mobile, 'unbindWechat']);
        }
    } else {
        ctx.body = {
            success: false,
            msg: '信息过期，不可修改'
        }
    }
});

//查询用户当前培训订单
router.post('/getUserOrder', async (ctx, next) => {
    let params = ctx.request.body;

    let res = await users.getUserOrder(params.userId);
    ctx.body = res;
})

//查询用户当前培训订单
router.post('/userOrderReplace', async (ctx, next) => {
    let params = ctx.request.body;
    let mebers = params.users;
    let id = params.trainid;

    // let res = await users.getUserOrder(params.userId);

    let dateNowStr = assist.dateFormat(new Date(), 'yyyy-MM-dd');
    let search = 'isHidden:false,userId:' + params.userId + ',trainEndTime>' + dateNowStr + '~' + dateNowStr;
    let res = await train.getOrder(search, 0, -1);

    let hasReplace = [];
    if (res && res.length) {
        // 1提取相同的培训订单
        let trainList = res.filter(x => x.trainId === id && x.orderStatus != 'Canceled');

        if (trainList && trainList.length) {
            // 2提取相同培训订单中的用户信息
            let enrolUsers = [];
            for (const train of trainList) {
                enrolUsers = enrolUsers.concat(train.enrolUsers);
            }
            // 3循环所选用户，与已有订单中的用户信息匹配
            for (const user of mebers) {
                let unsuccessful = enrolUsers.find(x => x.idnumber === user.idNumber);
                if (unsuccessful) {
                    hasReplace.push(unsuccessful);
                }
            }
        }
    }
    ctx.body = hasReplace;
})

//查询用户剩余票数
router.post('/fetchUserActivityOrder', async (ctx, next) => {
    let params = ctx.request.body;
    let userId = params.userId;
    let itmId = params.itmId;
    let id = params.id;
    // let res = await users.fetchUserActivityOrder(userId);
    let search = 'orderStatus:reserved~drawn,userId:' + userId + ',activityId:' + id;
    let res = await activity.activityOrder(search, 0, -1);
    res = res.content;
    let _temp_seat = 0;
    if (res && res.length) {
        let actList = res.filter(x => x.activityId === id && x.itmId === itmId);
        if (actList && actList.length) {
            for (let act of actList) {
                _temp_seat += act.reserveSum || 0;
            }
        }
    }
    ctx.body = _temp_seat

})

// 取消活动订单
router.post('/myactivity/cancel', async (ctx, next) => {
    let orderid = ctx.request.body;
    let reason = {
        "type": "user",
        "reason": "用户取消"
    }
    let res = await users.cancelActivityOrder(orderid.orderid, reason);
    ctx.body = res;
    logUtil.logbusiness([ctx.session.user.mobile, 'cancelActOrder' , orderid.orderid]);
})

// 删除活动订单
router.post('/myactivity/delorder', async (ctx, next) => {
    let orderid = ctx.request.body;
    let res = await users.delActivityOrder(orderid.orderid);
    ctx.body = res;
    logUtil.logbusiness([ctx.session.user.mobile, 'delActOrder' , orderid.orderid]);
})

// 取消培训订单
router.post('/mytrain/cancel', async (ctx, next) => {
    let orderid = ctx.request.body;
    let reason = {"type": "user","reason": "用户取消"}
    let res = await users.cancelTrainOrder(orderid.orderid, reason);
    logUtil.logbusiness([ctx.session.user.mobile, 'cancelTrainOrder' , orderid.orderid]);
    ctx.body = res;
})

// 删除培训订单
router.post('/mytrain/del', async (ctx, next) => {
    let orderid = ctx.request.body;
    let res = await users.delTrainOrder(orderid.orderid);
    logUtil.logbusiness([ctx.session.user.mobile, 'delTrainOrder' ,orderid.orderid]);
    ctx.body = res;
})

// 取消场馆订单
router.post('/myvenues/cancel', async (ctx, next) => {
    try {
        let orderid = ctx.request.body;
        let reason = {"type": "user","reason": "用户取消"}
        let res = await users.cancelRoomOrder(orderid.orderid, reason);
        ctx.body = res;
        logUtil.logbusiness([ctx.session.user.mobile, 'cancelVenueOrder' , orderid.orderid]);
    } catch (ex) {
        ctx.body = ex.response.data;
    }

})
// 删除场馆订单
router.post('/myvenues/del', async (ctx, next) => {
    let orderid = ctx.request.body;
    let res = await users.delRoomOrder(orderid.orderid);
    logUtil.logbusiness([ ctx.session.user.mobile, 'delVenueOrder' , orderid.orderid]);
    ctx.body = res;
})

router.get('/mycomment', async (ctx, next) => {
    let user = ctx.session.user || null;
    if (user) {
        user = JSON.parse(JSON.stringify(user));
    }
    await ctx.render('user/mycomment', {})
})

router.get('/mymail', async (ctx, next) => {
    let user = ctx.session.user || null;
    if (user) {
        user = JSON.parse(JSON.stringify(user));
    }
    await ctx.render('user/mymail', {})
})

router.get('/feedback', async (ctx, next) => {
    let user = ctx.session.user || null;
    if (user) {
        user = JSON.parse(JSON.stringify(user));
    }
    await ctx.render('user/feedback', {})
})

/**
 * 取消点赞
 */
router.get('/cancelthumbup/:type/:id', async (ctx, next) => {
    let res = await users.cancelUserThumbup(ctx.session.user.id, ctx.params.type, ctx.params.id);
    ctx.body = {
        data: res
    }
})

/**增加用户点赞 */
router.get('/addthumbup/:type/:id', async (ctx, next) => {
    let res = await users.addUserThumbup(ctx.session.user.id, ctx.params.type, ctx.params.id)
    ctx.body = {
        data: res
    }
})

//实名认证
router.post('/smrz', async (ctx, next) => {
    let user = ctx.session.user || null
    if (user) {
        user = JSON.parse(JSON.stringify(user));
        let workInfo = ctx.request.body;
        // let certifyImage = workInfo.files.certifyImage;
        // let response = await sys.saveFile(certifyImage);
        // let url = response.url;
        let url = ctx.request.body.fields.certifyImage;

        let workObj = {
            'userId': user.id,
            "isSelf": true,
            "realname": workInfo.fields.realname,
            "idnumber": workInfo.fields.idcard,
            "nickname": user.nickname,
            "mobile": user.mobile,
            "handpic": url,
            "unitId": ctx.curUnit.id
        }
      
        let resupload = await users.smrzload(workObj);
        
        let userinfo = await users.fetchUserInfo(user.id);
        ctx.session.user = userinfo;
        logUtil.logbusiness([ ctx.session.user.mobile, 'verify']);
    }
    ctx.redirect('/user');
})

/**
 * 修改用户头像
 */
router.post('/userphoto', async (ctx, next) => {
    let user = ctx.session.user || null
    if (user) {
        user = JSON.parse(JSON.stringify(user));
        // let avatorImage = ctx.request.body.files.avatorImage;
        // let response = await sys.saveFile(avatorImage);
        // let url = response.url;
        let userInfo = {
            'pic': ctx.request.body.fields.userImg
        }
        await users.updateUserInfo(user.id, userInfo);
        let userinfo = await users.fetchUserInfo(user.id);
        ctx.session.user = userinfo;
        logUtil.logbusiness([ ctx.session.user.mobile, 'modifyPortrait']);
    }
    ctx.redirect('/user');
})

//联系人实名认证
router.post('/contactsmrz', async (ctx, next) => {
    let user = ctx.session.user || null
    if (user) {
        user = JSON.parse(JSON.stringify(user));
    }
    let userId = ctx.params.id;
    let workInfo = ctx.request.body;
    let response = await sys.saveFile(workInfo.files.file);
    let url = response.url;
    let workObj = {
        'userId': user.id,
        "isSelf": false,
        "realname": workInfo.fields.name,
        "idnumber": workInfo.fields.idcard,
        "nickname": user.nickname,
        "mobile": workInfo.fields.telphone,
        "handpic": url
    }
    logUtil.logbusiness([ ctx.session.user.mobile, 'verify']);
    let resupload = await users.smrzload(workObj);
    ctx.redirect('/users')
})

//重新实名认证
router.post('/conrz', async (ctx, next) => {
    let user = ctx.session.user || null
    if (user) {
        user = JSON.parse(JSON.stringify(user));
    }
    let workInfo = ctx.request.body;
    let response = await sys.saveFile(workInfo.files.file);
    let url = response.url;
    let contact = await users.fetchcontact(user.id);
    let workObj = {
        'userId': user.id,
        "isSelf": false,
        "realname": workInfo.fields.name,
        "idnumber": workInfo.fields.idcard,
        "nickname": user.nickname,
        "mobile": workInfo.fields.telphone,
        "relation": workInfo.fields.relation,
        "handpic": url
    }
    let resupload = await users.smrzload(workObj);
    logUtil.logbusiness([ctx.session.user.mobile, 'verifyAgain']);
    ctx.redirect('/users')
})

/**
 * 发送验证码
 */
router.post('/vcodes', async (ctx, next) => {
    let mobile = ctx.request.body.mobile;
    let res = {
        success: false,
        message: ''
    };
    try {
        await users.sendVcodes(mobile);
        res = {
            success: true,
            message: ''
        }
    } catch (error) {
        console.log(error);
    }
    ctx.body = res;
})

/**
 * 校验验证码
 */
router.post('/verifyVcodes', async (ctx, next) => {
    let mobile = ctx.request.body.mobile;
    let code = ctx.request.body.code;
    let res = await users.verifyVcodes(mobile, code);
    ctx.body = res;
})

/**
 * 修改手机号码
 */
router.post('/mobilephone', async (ctx, next) => {
    let mobileNum = ctx.request.body.mobileNum;
    let recode = ctx.request.body.recode;
    if (recode && mobileNum) {
        if (!ctx.session.user) {
            ctx.body = {
                success: false,
                msg: '信息过期，不可修改'
            }
        } else {
            // 验证验证码
            let verifyStatus = await users.verifyVcodes(mobileNum, recode);
            if (!verifyStatus.success) {
                ctx.body = {
                    success: false,
                    msg: '您输入的验证码不正确'
                }
            } else {
                let userInfo = {
                    "mobile": mobileNum
                }
                let res = await users.updateUserInfo(ctx.session.user.id, userInfo);
                let userinfo = await users.fetchUserInfo(ctx.session.user.id);
                ctx.session.user = userinfo;
                ctx.body = {
                    success: true,
                    msg: '手机号码修改成功'
                }
                logUtil.logbusiness([ctx.session.user.mobile, 'modifyMobile',mobileNum]);
            }
        }
    } else {
        ctx.body = {
            success: false,
            msg: recode ? '请输入手机号码' : '请输入验证码'
        }
    }
})

/**
 * 绑定手机号码，设置登录密码
 */
router.post('/bindMobile', async (ctx, next) => {
    let mobile = ctx.request.body.mobile;
    let password = ctx.request.body.password;
    if (!ctx.session.user) {
        ctx.body = {
            success: false,
            msg: '信息过期，不可修改'
        }
    } else {
        let userId = ctx.session.user.id;
        try {
            let data = await users.updateUserInfo(userId, {
                mobile: mobile
            });
            let status = await users.editpassword({
                newPwd: password
            }, mobile);
            let userinfo = await users.fetchUserInfo(ctx.session.user.id);
            ctx.session.user = userinfo;

            ctx.body = {
                success: true,
                msg: '手机号码绑定成功'
            }
            logUtil.logbusiness([ctx.session.user.mobile, 'bindMobile']);
        } catch (ex) {
            ctx.body = {
                success: false,
                msg: ex.response.data
            }
        }
    }

})

/**
 * 添加常用联系人
 * 1、判断联系人是否已存在
 * 2、添加联系人
 * 3、申请实名认证
 */
router.post('/contact', async (ctx, next) => {
    let user = ctx.session.user || null
    if (!user) {
        return ctx.redirect('back');
    }

    user = JSON.parse(JSON.stringify(user));
    let userId = user.id;

    let info = {
        'name': ctx.request.body.crealname,
        'idNumber': ctx.request.body.idNumber,
        'mobile': ctx.request.body.cmobile,
        'relation': ctx.request.body.relation
    }

    let result = getBirthdayAndSex(info.idNumber);
    if (result.error) { // 证件号错误
        ctx.body = {
            success: false,
            msg: result.tipMsg
        };
        return ctx.redirect('back');
    } else {
        info.sex = result.sex;
        info.birthday = moment(result.birthday).format('YYYY-MM-DD')
        let allMembers = await users.fetchcontact(userId); // 查询所有联系人
        let index = -1;
        if (allMembers) {
            index = allMembers.findIndex(x => x.idNumber === info.idNumber);
        }
        if (index !== -1) { // 联系人已存在
            ctx.body = {
                success: false,
                msg: '联系人已存在'
            };

        }

        try {
            info.idNumber = info.idNumber;
            let photoUrl = ctx.request.body.userPhoto;
            let res = await users.addcontact(userId, info); // 添加联系人
            // let response = await sys.saveFile(certifyImage); // 照片保存
            let identifyInfo = {
                userId: userId,
                realname: info.name,
                idnumber: info.idNumber,
                mobile: info.mobile,
                identifyStatus: 'Wait',
                relation: info.relation,
                isSelf: false,
                handpic: photoUrl,
                nickname: user.nickname,
                unitId: ctx.curUnit.id
            };
            let applyIdentify = await users.smrzload(identifyInfo);
            let userinfo = await users.fetchUserInfo(user.id);
            ctx.session.user = userinfo;
            ctx.body = {
                success: true,
                msg: '添加成功'
            }
            logUtil.logbusiness([ctx.session.user.mobile, 'addContactor',info.name]);
        } catch (error) {

            ctx.body = {
                success: false,
                msg: error.data.message
            };

        }
    }
});

/**
 * 删除常用联系人
 */
router.get('/delmember/:id', async (ctx, next) => {
    let user = ctx.session.user || null
    if (user) {
        user = JSON.parse(JSON.stringify(user));
        let res = await users.delcontact(user.id, ctx.params.id);
        logUtil.logbusiness([ctx.session.user.mobile, 'delContactor', ctx.params.id]);
        if (res == "") {
            ctx.redirect('/user/setprofile?type=auth');
        }
    }
})

/**
 * 修改昵称
 */
router.post('/nickname', async (ctx, next) => {
    let nickname = ctx.request.body.nickname;
    if (!nickname) {
        ctx.body = {
            success: false,
            msg: '请输入昵称'
        }
    } else if (!ctx.session.user) {
        ctx.body = {
            success: false,
            msg: '信息过期，不可修改'
        }
    } else {
        let userInfo = {
            'nickname': nickname
        }
        let res = await users.updateUserInfo(ctx.session.user.id, userInfo);
        let userinfo = await users.fetchUserInfo(ctx.session.user.id);
        ctx.session.user = userinfo;
        logUtil.logbusiness([ctx.session.user.mobile, 'modify-nickName', nickname]);
        ctx.body = {
            success: true,
            msg: '昵称修改成功'
        }
    }
})

/**
 * 评论
 */
router.post('/comments', async (ctx, next) => {

    let content = ctx.request.body;
    let userId = ctx.session.user.id;
    Object.assign(content, {
        userId: userId,
        nickname: ctx.session.user.nickname,
        unitId: ctx.curUnit.id,
    })

    let status = await users.postComments(userId, content);
    logUtil.logbusiness([ctx.session.user.mobile, 'postComments',content.type+'--'+content.objectId]);
    ctx.body = status;
})

/**
 * 取消用户收藏
 */
router.get('/cancelfavorite/:objectId', async (ctx, next) => {
    let favoritesId = ctx.params.objectId;
    let res = '';
    try {
        res = await users.cancelUserFavorites(ctx.session.user.id, favoritesId);
        logUtil.logbusiness([ctx.session.user.mobile, 'cancelFavorite',favoritesId]);
    } catch (ex) {
        res = ex.response.data;
    }

    ctx.body = res;
})

/**增加用户收藏 */
router.post('/addfavorite', async (ctx, next) => {
    let favoriteObj = ctx.request.body;
    Object.assign(favoriteObj, {
        userId: ctx.session.user.id
    });
    let res = '';
    try {
        res = await users.addUserFavorites(ctx.session.user.id, favoriteObj);
        logUtil.logbusiness([ctx.session.user.mobile, 'addFavorite',favoriteObj.objectId]);
    } catch (ex) {
        res = ex.response.data;
    }

    ctx.body = {
        data: res
    }
})

/**
 * 上传文件
 */
router.post('/uploadfile', async (ctx, next) => {
    let fileInfo = ctx.request.body;
    let response;
    try {
        response = await sys.saveFile(fileInfo.files.file);
        let filePath = assist.getFileUrl(response.url);

        ctx.body = {
            "code": "0",
            "res": response.url, //文件相对地址
            filePath: filePath, //文件全路径，图片可能需要预览
            fileName: fileInfo.files.file.name //文件名称
        }
        logUtil.logbusiness([ctx.session.user.mobile, 'uploadFile', fileInfo.files.file.name ]);
    } catch (error) {
        response = error.response ? error.response : "文件上传失败";
        ctx.body = {
            "code": "1",
            "res": response
        }
    }
})

module.exports = router
