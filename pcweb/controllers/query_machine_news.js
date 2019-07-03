const router = require('koa-router')()
const index = require('../models/sys')
const activity = require('../models/activity')
const news = require('../models/issue')
const users = require('../models/users')
const assist = require('../util/assist')
const venues = require('../models/venues')
const train = require('../models/train')
const sys = require('../models/sys')
const moment = require('moment')
const config = require('../config')
let page = 0,
    str = '',
    size = 15;
router.prefix('/screen')
/**
 * 活动信息中需要处理的信息
 *
 * @param {any} detailInfo  活动详情
 * @param {any} activityForm 活动类型
 * @param {any} artistClass 艺术类型
 * @returns
 */
function convertActivity(detailInfo, activityForm, artistClass) {
    // 活动类型
    let activityTypes = [];
    if (activityForm && activityForm.length) {
        for (var j = 0; j < detailInfo.activityType.length; j++) {
            let code = activityForm.find(x => x.code === detailInfo.activityType[j]);
            if (code) {
                activityTypes.push(code.value);
            }
        }
    }

    // 艺术类型
    let artists = [];
    if (artistClass && artistClass.length) {
        for (var j = 0; j < detailInfo.artType.length; j++) {
            let code = artistClass.find(x => x.code === detailInfo.artType[j]);
            if (code) {
                artists.push(code.value);
            }
        }
    }

    detailInfo.activityType = activityTypes.join(' '); // 活动类型
    detailInfo.artType = artists.join(' '); // 艺术类型
    detailInfo.coverPic = assist.getFileUrl(detailInfo.coverPic); // 封面图片
    detailInfo.attach = assist.getFileUrl(detailInfo.attach); // 附件
    detailInfo.ticketSum = 0; // 总票数
    detailInfo.remainTicket = 0; // 剩余票数
    detailInfo.reserve = 1; // 是否预定【-3、无余票：已定完；-2、不在预定时间范围；-1、活动时间已过,活动结束； 1、正常：剩票数；2、直接前往】
    detailInfo.reserveMsg = '立即报名';
    detailInfo.itmDates = []; // 场次时间集合
    detailInfo._time =  assist.dateFormat(detailInfo.holdStartDate?detailInfo.holdStartDate:'','yyyy-MM-dd HH:mm:ss') + ' 至 ' +assist.dateFormat(detailInfo.holdEndDate?detailInfo.holdEndDate:'','yyyy-MM-dd HH:mm:ss');
    detailInfo.startTime =  assist.dateFormat(detailInfo.holdStartDate?detailInfo.holdStartDate:'','yyyy-MM-dd HH:mm:ss')
    detailInfo.endTime =  assist.dateFormat(detailInfo.holdEndDate?detailInfo.holdEndDate:'','yyyy-MM-dd HH:mm:ss');
    //活动描述
    detailInfo.desc =  assist.formateHtmlToText(detailInfo.desc);
    //活动简介
    detailInfo.brief =  assist.formateHtmlToText(detailInfo.brief);

    let nowTime = moment().format('x'); //当前时间戳
    let holdStartDate = moment(detailInfo.holdStartDate).format('x'); // 活动开始时间戳
    let holdEndDate = moment(detailInfo.holdEndDate).format('x'); // 活动结束时间戳

    if (nowTime > holdEndDate) {
        detailInfo.reserve = -1;
        detailInfo.reserveMsg = '活动已结束';
    } else {
        if (detailInfo.reserveType !== 'none') {
            let signStartTime = moment(detailInfo.signStartTime).format('x'); // 预定开始时间戳
            let signEndTime = moment(detailInfo.signEndTime).format('x'); // 预定结束时间戳
            // 预定时间范围内
            if (signEndTime > nowTime && nowTime > signStartTime) {
                let reserveCount = 0;
                let outTicket = 0;
                let validItms = [];
                let validDates = [];
                for (var i = 0, len = detailInfo.itms.length; i < len; i++) {
                    let itm = detailInfo.itms[i];
                    itm.remainTicket = 0;
                    let itmStart = moment(itm.itmDate + ' ' + itm.startTime).format('x');
                    if (itmStart > nowTime) {
                        let count = itm.reserveSeats ? itm.reserveSeats.length : 0;
                        itm.remainTicket = detailInfo.total - count;
                        reserveCount += count;
                        validItms.push(itm);
                        if (!validDates.some(d => d === itm.itmDate)) {
                            validDates.push(itm.itmDate); // 取出场次时间
                        }
                    } else { // 过期了的票数
                        outTicket += detailInfo.total;
                    }
                }
                detailInfo.ticketSum = detailInfo.total * detailInfo.itms.length; // 总票数
                detailInfo.remainTicket = detailInfo.ticketSum - reserveCount - outTicket; // 剩余票数
                detailInfo.itms = validItms; // 有效场次
                detailInfo.itmDates = validDates; // 场次时间
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
            detailInfo.reserve = 5;
            detailInfo.reserveMsg = '直接前往';
        }
    }
    return detailInfo;
}
/**资讯列表 */
router.get('/news', async (ctx, next) => {
    let sort=ctx.topfield+'~desc,publishTime~desc';
    let res = await news.newslist("search=column.channel:culture,isPublish:true", 0, 8,sort)
    res.content.forEach(function (item) {
        item.coverPic2 = item.coverPic && item.coverPic !== '' ? assist.getFileUrl(item.coverPic) : null;
    })
    await ctx.render('querymachine/qmnews', {
        data: res
    })
})

/**资讯详情 */
router.get('/newsdetail/:id', async (ctx, next) => {
    let commentPage = ctx.query.page ? ctx.query.page - 1 : 0;
    let res = await news.newsDetail(ctx.params.id);
    let comments = await news.getComments(ctx.params.id, commentPage, config.paging.comments.size);
    await ctx.render('querymachine/qmnewsdetail', {
        data: res,
        comments: comments
    })
})


/**查询机首页 */
router.get('/index', async (ctx, next) => {
    await ctx.render('querymachine/qmindex', {})
})

/**查询机列表 */
router.get('/list/:id', async (ctx, next) => {
    var res = '';
    if (ctx.params.id == 1) {
        let page = 0,
            str = '',
            size = 15;
        str += ctx.query.type ? 'activityType:' + ctx.query.type : '';
        str += ctx.query.artType ? ',artType:' + ctx.query.artType : '';
        page = ctx.query.page ? ctx.query.page - 1 : 0;
        size = ctx.query.size ? ctx.query.size : 16;
        res = await activity.activityList(str, page, config.paging.activity.size);

        let activityForm = await sys.fetchCodeTypes('activityForm'); // 活动类型
        let artistClass = await sys.fetchCodeTypes('artistClass'); // 艺术类型
        res.content.forEach(function (item) {
            item = convertActivity(item,activityForm,artistClass);
            item.etype = ctx.params.id;
        })
    }
    if (ctx.params.id == 2) {
        let str = '';
        let page = ctx.query.page ? ctx.query.page - 1 : 0;
        let size = ctx.query.size ? ctx.query.size : 16;
        let sort = 'isTop~desc,startDate~desc';
        res = await train.trainList(str, page, size, sort);
        res.content.forEach(function (item) {
            item.etype = ctx.params.id;
            item.coverPic =assist.getFileUrl(item.picture);
            item._time = assist.dateFormat(item.enrolStartTime?item.enrolStartTime:'','yyyy-MM-dd HH:mm:ss') + ' 至 ' +assist.dateFormat(item.enrolEndTime?item.enrolEndTime:'','yyyy-MM-dd HH:mm:ss');
            item.startTime =  assist.dateFormat(item.enrolStartTime?item.enrolStartTime:'','yyyy-MM-dd HH:mm:ss');
            item.endTime =  assist.dateFormat(item.enrolEndTime?item.enrolEndTime:'','yyyy-MM-dd HH:mm:ss');
            item.contactPhone =  item.contactNumber;
            //培训简介
            item.brief =  assist.formateHtmlToText(item.brief);
            //培训介绍
            item.desc =  assist.formateHtmlToText(item.introduce);
            item.perAllow =  item.allLimitPeoples;

            item.picture = assist.getFileUrl(item.picture);
            let dateNow = new Date();
            let startDate = new Date(item.enrolStartTime);
            let endDate = new Date(item.enrolEndTime);
            if (dateNow > endDate) {
                item.canEnroll = false;
                item.reserveMsg = '报名结束'
            } else if (dateNow < startDate) {
                item.canEnroll = false;
                item.reserveMsg = '报名未开始'
            } else if (item.allLimitPeoples == item.enrollSum) {
                item.canEnroll = false;
                item.reserveMsg = '名额已满'
            } else {
                item.canEnroll = true;
                item.reserveMsg = '名额余' + (item.allLimitPeoples - item.enrollSum) + '人'
            }
        })
    }
    if (ctx.params.id == 3) {
        let page = ctx.query.page ? ctx.query.page - 1 : 0;
        size = ctx.query.size ? ctx.query.size : 10;
        let search = 'search=onlineStatus:Published';
        res = await venues.rooms(search, page, size);
        let codetype = await index.fetchCodeTypes('venueType');
        if (res.content && res.content.length && codetype.length) {
            let content = res.content.map((item) => {
                let type = codetype.find(x => x.code === item.type);
                item.typeName = type ? type.value : '';
                return item;
            })
            res.content = content;
        }
        res.content.forEach(function (item) {
            item.etype = ctx.params.id;
            item.coverPic =assist.getFileUrl( item.coverPic);
            item.contactPhone =  item.telephone;
            item.address =  item.venue.address;
            // item._time = assist.dateFormat(item.holdStartDate?item.holdStartDate:'','yyyy-MM-dd HH:mm:ss') + ' 至 ' +assist.dateFormat(item.holdEndDate?item.holdEndDate:'','yyyy-MM-dd HH:mm:ss');
            // item.startTime =  assist.dateFormat(item.holdStartDate?item.holdStartDate:'','yyyy-MM-dd HH:mm:ss');
            // item.endTime =  assist.dateFormat(item.holdEndDate?item.holdEndDate:'','yyyy-MM-dd HH:mm:ss');
            //场馆简介
            item.desc =  assist.formateHtmlToText(item.desc);
            //场馆简介
            item.brief =  assist.formateHtmlToText(item.desc);
            item.reserveMsg = null;
        })
    }
    await ctx.render('querymachine/qmlist', {
        data: res,
        query: ctx.query
    })
})
module.exports = router  