const koaRouter = require('koa-router')
const sysApi = require('../api/sys')
const activityApi = require('../api/activity')
const userApi = require('../api/user')
const { getFileUrl, getFullAddress } = require('../api/util')
const router = new koaRouter()
const { trimEnd } = require('lodash')

const moment = require('moment')
moment.locale('zh-cn');

/**
 * 活动信息中需要处理的信息
 *
 * @param {any} detailInfo  活动详情
 * @param {any} user 登录用户信息
 * @returns
 */
async function convertActivity(detailInfo, user) {
    detailInfo.coverPic = getFileUrl(detailInfo.coverPic); // 封面图片
    detailInfo.attach = getFileUrl(detailInfo.attach); // 附件
    detailInfo.ticketSum = 0; // 总票数
    detailInfo.remainTicket = 0; // 剩余票数
    detailInfo.reserve = 1; // 是否预定【-3、无余票：已定完；-2、不在预定时间范围；-1、活动时间已过,活动结束； 1、正常：剩票数；2、直接前往】
    detailInfo.reserveMsg = '立即报名';
    detailInfo.favorited = false; // 是否收藏
    detailInfo.favoritieId = null; // 收藏id
    let region = await sysApi.getRegion(detailInfo.region);
    detailInfo.address = getFullAddress(region, detailInfo.address)

    // 是否收藏
    if (user && user.id !== '') {
        let hasFavorite = await userApi.hasFavorite(user.id, 'Activity', detailInfo.id);
        detailInfo.favorited = hasFavorite.status;
        detailInfo.favoritieId = detailInfo.id;
    }

    let nowTime = moment().format('x'); //当前时间戳
    let holdStartDate = moment(detailInfo.holdStartDate).format('x'); // 活动开始时间戳
    let holdEndDate = moment(detailInfo.holdEndDate).format('x'); // 活动结束时间戳

    let endTime = new Date(detailInfo.holdEndDate);
    if (detailInfo.itms && detailInfo.itms.length) {
        endTime = new Date(detailInfo.itms[0].itmDate + ' ' + detailInfo.itms[0].startTime + ':00')
        for (var i = 0; i < detailInfo.itms.length; i++) {
            let d = new Date(detailInfo.itms[i].itmDate + ' ' + detailInfo.itms[i].startTime + ':00');
            endTime = endTime > d ? endTime : d;
        }
    }
    if (nowTime > endTime) {
        detailInfo.reserve = -1;
        detailInfo.reserveMsg = '活动已结束';
    } else {
        if (detailInfo.reserveType !== 'none') {
            let signStartTime = moment(detailInfo.signStartTime).format('x'); // 预定开始时间戳
            let signEndTime = moment(detailInfo.signEndTime).format('x'); // 预定结束时间戳
            // 预定时间范围内
            if (signEndTime > nowTime && nowTime > signStartTime) {
                let reserveCount = 0; // 总预定票数
                let outTicket = 0; // 过期票数
                for (var i = 0, len = detailInfo.itms.length; i < len; i++) {
                    let itm = detailInfo.itms[i];
                    itm.itmDateTime = moment(itm.itmDate).format('YYYY.MM.DD ') + itm.startTime + '-' + itm.endTime;
                    itm.content = moment(itm.itmDate).format('YYYY.MM.DD (ddd)') + '    ' + itm.startTime + '-' + itm.endTime;
                    itm.remainTicket = 0;
                    itm.overDue = false;
                    let itmStart = moment(itm.itmDate + ' ' + itm.startTime).format('x');
                    if (itmStart > nowTime) {
                        let count = itm.reserveSeats ? itm.reserveSeats.length : 0;
                        itm.remainTicket = detailInfo.total - count;
                        itm.remainTicketName = itm.remainTicket === 0 ? '已订完' : itm.remainTicket + '张';
                        reserveCount += count;
                    } else { // 场次过期了
                        outTicket += detailInfo.total;
                        itm.remainTicketName = '已结束';
                        itm.overDue = true;
                    }

                    itm.content += '    ' + itm.remainTicketName;
                }
                detailInfo.ticketSum = detailInfo.total * detailInfo.itms.length; // 总票数
                detailInfo.remainTicket = detailInfo.ticketSum - reserveCount - outTicket; // 剩余票数
                if (detailInfo.remainTicket <= 0) {
                    detailInfo.reserve = -3;
                    detailInfo.reserveMsg = '已订完';
                }
            } else {
                //  不在预定时间范围
                detailInfo.reserve = -2;
                if (nowTime < signStartTime) {
                    detailInfo.reserveMsg = '即将开始';
                } else {
                    detailInfo.reserveMsg = '报名结束';
                }
            }
        } else {
            detailInfo.reserve = 2;
            detailInfo.reserveMsg = '直接前往';
        }
    }
    return detailInfo;
}

// 获取活动列表
router.get('/activitys/:page', async (ctx) => {
    let page = ctx.params.page || 0;
    let query = ctx.query;
    let size = query.size || 10;
   
    
    // 查询条件
    let searchCondition = 'onlineStatus:Published'; // 已发布
    // 根据传入的区域，获取该区域下的文化馆(包括子级馆)
    if (query && query.regionType && query.regionType !== 'all') {
        let regionstr =sysApi.trimRegionEnd(query.regionType) + '%';
        searchCondition += ',region~' + regionstr;
    }
    if (query && query.type) { // 活动类型
        searchCondition += ',activityType:' + query.type;
    }
    if (query && query.brand) { //文化品牌
        searchCondition += ',brandId:' + query.brand;
    }
    // 排序
    let sort = '&sort=' + ctx.topfield + '~desc,startDate~desc,createTime~desc';
    let dateNowShort = moment().format('YYYY-MM-DD');
    let dateNowFull = moment().format('YYYY-MM-DD HH:mm:ss');
    if (query && query.sort && query.sort !== '0') {
        if (query.sort === '1') {// 可预约
            searchCondition += ',signStartTime<' + dateNowFull + ',' + 'signEndTime>' + dateNowFull;
            sort ='&'+ctx.topfield+ '~desc,enrolStartTime~asc';
        } else if (query.sort === '2') {  // 即将开始
            searchCondition += ',holdStartDate>' + dateNowShort;
            sort = '&'+ctx.topfield+ '~desc,enrolStartTime~asc';
        } else if (query.sort === '3') { // 已经结束
            searchCondition +=  ',holdEndDate<' + dateNowShort;
        }
    }
    let res = await activityApi.getActivityList(searchCondition + sort, page, size);
    if (res.content.length) {
        for (let i = 0; i < res.content.length; i++) {
            let actObj = await convertActivity(res.content[i], ctx.session.user);
            res.content[i] = {
                id: actObj.id,
                name: actObj.name,
                coverPic: actObj.coverPic,
                reserve: actObj.reserve,
                reserveMsg: actObj.reserveMsg,
                ticketSum: actObj.ticketSum,
                remainTicket: actObj.remainTicket,
                favorited: actObj.favorited,
                favoritieId: actObj.favoritieId,
                activityType: actObj.activityType,
                holdStartDate: actObj.holdStartDate,
                holdEndDate: actObj.holdEndDate,
                address: actObj.address
            }
        }
    }
    ctx.body = res;
});

/** 类型\区域 */
router.get('/activityDicts', async (ctx) => {
    let activityForm = [];
    activityForm = await sysApi.getDict('activityForm');
    activityForm.splice(0, 0, { code: 'all', value: '全部' });
    ctx.body = {
        activityForm: activityForm
    }
});

// 活动详情
router.get('/activity/detail/:id', async (ctx, next) => {
	
	// 浏览量+1
	await activityApi.addvisitActivity(ctx.params.id);
	
    let res = await activityApi.activityDetail(ctx.params.id);
    res = await convertActivity(res, ctx.session.user);
    let activityForm = await sysApi.getDict('activityForm');
    let artistClass = await sysApi.getDict('artistClass')
    // 活动类型
    let activityTypes = [];
    if (activityForm && activityForm.length && res.activityType.length) {
        for (var j = 0; j < res.activityType.length; j++) {
            let code = activityForm.find(x => x.code === res.activityType[j]);
            if (code) {
                activityTypes.push(`<span class="tag">${code.value}</span>`);
            }
        }
    }

    // 艺术类型
    let artists = [];
    if (artistClass && artistClass.length && res.artType.length) {
        for (var j = 0; j < res.artType.length; j++) {
            let code = artistClass.find(x => x.code === res.artType[j]);
            if (code) {
                artists.push(code.value);
            }
        }
    }
    // // 是否有提交问卷
    // res.researchStatus = false;
    // if (ctx.session.user) {
    //     let user = JSON.parse(JSON.stringify(ctx.session.user));
    //     try {
    //         let answersResearch = await userApi.fetchAnswer(ctx.params.id, user.id)
    //         res.researchStatus = answersResearch ? true : false;
    //     } catch (ex) {
    //         res.researchStatus = false;
    //     }
    // }

    res.activityTypeName = activityTypes.join(' '); // 活动类型
    res.artTypeName = artists.join(' '); // 艺术类型
    let digitinfos = await activityApi.getDigitinfos(ctx.params.id); // 活动纪实
    if (digitinfos && digitinfos.length > 0) {
        digitinfos.forEach(function(item) {
            item.pic = getFileUrl(item.pic);
            item.file = getFileUrl(item.file);
        })
    }

    res.digitinfos = digitinfos;
    ctx.body = res
})

// 提交活动订单
router.post("/activity/order", async (ctx) => {
    let orderInfo = ctx.request.body;
    let res = {
        success: false,
        message: ''
    };
    let user = ctx.session.user;
    Object.assign(orderInfo, {
        userId: user.id,
        nickname: user.nickname,
        cname: user.name
    });
    try {
        res = await activityApi.postActivityOrder(orderInfo);
        res.success = true;
    } catch (error) {
        res.success = false;
        res.message = error.response.data.message || '';
    }

    ctx.body = res;
});

// 取消活动订单
router.post('/activity/cancel', async (ctx, next) => {
    let body = ctx.request.body;
    let info = {
        type: 'user',
        reason: body.reason,
        time: moment().format('YYYY-MM-DD HH:mm:ss')
    };

    let res = {
        success: false,
        message: ''
    };
    try {
        await activityApi.cancelActivityOrder(body.orderid, info);
        res.success = true;
    } catch (error) {
        res.message = error.response.data.message || '退订失败';
    }
    ctx.body = res;
})

// 删除活动订单
router.post('/activity/del/:id', async (ctx, next) => {
    let orderid = ctx.params.id;
    let res = {
        success: false,
        message: ''
    };
    try {
        await activityApi.delActivityOrder(orderid);
        res.success = true;
    } catch (error) {
        res.message = error.response.data.message || '删除失败';
    }
    ctx.body = res;
})

//查询用户剩余票数
router.get('/activity/reserved', async (ctx, next) => {
    let params = ctx.query;
    let userId = ctx.session.user.id;
    let itmId = params.itmId;
    let id = params.id;
    let search = 'orderStatus:reserved~drawn,userId:' + userId + ',activityId:' + id + ',itmId:' + itmId;
    let res = await activityApi.activityOrder(search, 0, -1);
    res = res.content;
    let reservedCount = 0;
    if (res && res.length) {
        res.forEach(function(item) {
            reservedCount += item.reserveSum || 0;
        })
    }
    ctx.body = reservedCount;
})

// 获取活动的调查问卷
router.get('/activity/research/:id', async (ctx, next) => {
    let actId = ctx.params.id;
    let data = await activityApi.getResearch(actId) || {};

    // 问卷排序
    if (data && data.isPublished) {
        let types = ['single', 'multiple', 'question'];
        data.items = data.items.sort(function(o1, o2) {
            return types.indexOf(o1.type) > types.indexOf(o2.type);
        })
    }

    // 是否有提交问卷
    data.status = false;
    if (ctx.session.user) {
        let user = JSON.parse(JSON.stringify(ctx.session.user));
        try {
            let answersResearch = await userApi.fetchAnswer(actId, user.id)
            data.status = answersResearch ? true : false;
            data.answersResearch = answersResearch;
        } catch (ex) {
            data.status = false;
        }
    }
    ctx.body = data;
})

// 提交活动的调查问卷
router.post('/activity/research/:id', async (ctx, next) => {
    let res = {
        success: false,
        message: '信息过期'
    };

    if (ctx.session.user) {
        let id = ctx.params.id;
        let content = ctx.request.body;
        content.userId = ctx.session.user.id;
        content.nickName = ctx.session.user.nickName || ctx.session.user.name;
        try {
            let status = await activityApi.postResearchAnswer(id, content);
            res.success = true;
            res.message = status;
        } catch (ex) {
            res.message = ex.response.data;
        }
    }
    ctx.body = res;
})
module.exports = router;
