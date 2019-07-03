const router = require('koa-router')()
const sys = require('../models/sys')
const activity = require('../models/activity')
const users = require('../models/users')
const assist = require('../util/assist')
const config = require('../config')
const moment = require('moment')
const logUtil = require('../util/log-util')
let page = 0,
    str = '',
    size = 15;
router.prefix('/activity')

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
    detailInfo.reserve = 1; // 是否预定【-3、无余票：已定完；-2、不在预定时间范围；-1、活动时间已过,活动结束； 1、正常可预订，有余票；2、直接前往】
    detailInfo.reserveMsg = '立即报名';
    detailInfo.itmDates = []; // 场次时间集合

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
            detailInfo.reserve = 2; //5
            detailInfo.reserveMsg = '直接前往';
        }
    }
    return detailInfo;
}
/**
 * 活动列表
 * 1、区域数据
 * 2、活动数据
 * 3、活动类型
 * 4、艺术类型
 * 
 */
router.get('/', async (ctx, next) => {
    let query = ctx.query;
    let activityForm = await sys.fetchCodeTypes('activityForm'); // 活动类型
    let artistClass = await sys.fetchCodeTypes('artistClass'); // 艺术类型

    let regionsTree = await sys.getRedisRegionTree(ctx.curUnit.region);
  
    // 查询条件
    let sortType = ctx.query.sortType;
    let time = ctx.query.time;
    var stime, etime;
    if (time) {
        stime = time.split('~')[0].trim();
        etime = time.split('~')[1].trim();
        stime = moment(stime).add(-1, 'days').format('YYYY-MM-DD');

        if (etime == 'Invalid date') {
            etime = moment(stime).add(2, 'days').format('YYYY-MM-DD');
        }else{
            etime = moment(etime).add(1, 'days').format('YYYY-MM-DD');
        }
     
    }
    let searchCondition = 'onlineStatus:Published'; // 已发布  
    let sort = ctx.topfield + '~desc,startDate~desc,createTime~desc';
    let dateNowFull = moment().format('YYYY-MM-DD HH:mm:ss');
    let dateNowShort = moment().format('YYYY-MM-DD');

    if (sortType == 'default' || !sortType) { //智能排序
        if (time) {
            searchCondition += ',holdStartDate>' + stime;
            searchCondition += ',holdStartDate<' + etime;
        }
    }

    if (sortType == 'canenroll') { //可报名
        searchCondition += (searchCondition.length ? ',' : '') + 'signStartTime<' + dateNowFull + ',' + 'signEndTime>' + dateNowFull;

        if (time) {
            searchCondition += ',holdStartDate>' + stime;
            searchCondition += ',holdStartDate<' + etime;
        }

        sort = ctx.topfield + '~desc,enrolStartTime~asc';
    } else if (sortType == 'notstart') { //即将开始
        searchCondition += ',holdStartDate>' + dateNowShort;
        if (time) {
            searchCondition += ',holdStartDate>' + stime;
            searchCondition += ',holdStartDate<' + etime;
        }
        sort = ctx.topfield + '~desc,enrolStartTime~asc';
    } else if (sortType == 'closure') { //已结束
        if (time) {
            searchCondition += ',holdEndDate<' + etime;
            searchCondition += ',holdStartDate>' + stime;
        }else{
            searchCondition += (searchCondition.length ? ',' : '') + 'holdEndDate<' + dateNowShort;
        }
    }
    if (query.regionType) {
      
        let regionstr = sys.trimRegionEnd(query.regionType) + '%';
        searchCondition += ',region~' + regionstr;
    }

    if (query.artType) { // 活动类型
        searchCondition += ',artType:' + query.artType;
    }
    if (query.type) { // 艺术类型
        searchCondition += ',activityType:' + query.type;
    }
    if (query.key) { // 模糊查询
        searchCondition += ',name~' + encodeURIComponent(query.key);
    }
    let page = query.page ? query.page - 1 : 0;
    let size = config.paging.activity.size;
    let activityList = await activity.activityList(searchCondition, page, size, sort);
    if (activityList.content.length) {
        activityList.content.forEach(function(item) {
            item = convertActivity(item, activityForm, artistClass);
        })
        if (sortType == 'canenroll') { //可报名,排除不可预定的活动
            activityList.content = activityList.content.filter(x => x.reserve === 1);
        }
    }

    await ctx.render('activity/index', {
        regions: regionsTree,
        data: activityList,
        activityType: activityForm,
        artistClass: artistClass,
        query: query
    })
})

/**活动详情 */
router.get('/detail/:id', async (ctx, next) => {
    let commentPage = ctx.query.page ? ctx.query.page - 1 : 0;
    let [detailInfo, comments, tjres, research, report] = await Promise.all([
    activity.activityDetail(ctx.params.id), // 活动详情
    users.getComments('activity', ctx.params.id, commentPage, config.paging.comments.size),
    activity.activityList('onlineStatus:Published', 0, 4, ctx.topfield + '~desc,createTime~desc'), // 推荐
    activity.fetchResearch(ctx.params.id), // 问卷
    activity.fetchReport(ctx.params.id), // 活动纪实
  ])
    // 问卷排序
    if (research && research.isPublished) {
        let types = ['single', 'multiple', 'question'];
        research.items = research.items.sort(function(o1, o2) {
            return types.indexOf(o1.type) > types.indexOf(o2.type);
        })
        research.titles = research.items.map((x) => {
            return x.title;
        });
    }
    let activityForm = await sys.fetchCodeTypes('activityForm');
    let artistClass = await sys.fetchCodeTypes('artistClass')
    detailInfo = convertActivity(detailInfo, activityForm, artistClass);
    detailInfo.researchStatus = false; // 问卷提交状态
    detailInfo.favorited = false; // 是否已收藏
    // 是否已收藏
    if (ctx.session.user) {
        let favStatus = await users.fetchUserFavoritesStatus(ctx.session.user.id, 'Activity', ctx.params.id);
        detailInfo.favorited = favStatus.status;
    }
    // 是否有提交问卷
    if (ctx.session.user) {
        let user = JSON.parse(JSON.stringify(ctx.session.user));
        if (research && research.isPublished) {
            try {
                let answersResearch = await users.fetchanswer(ctx.params.id, user.id)
                detailInfo.researchStatus = answersResearch ? true : false;
            } catch (ex) {
                detailInfo.researchStatus = false;
            }
        }
    }

    // 活动纪实
    if (report && report.length != 0) {
        report.forEach(function(item) {
            item.pic = assist.getFileUrl(item.pic);
            item.file = assist.getFileUrl(item.file);
        })
    }

    // 推荐活动
    if (tjres.content && tjres.content.length != 0) {
        tjres.content.forEach(function(item) {
            item = convertActivity(item, activityForm, artistClass);
        })
    }



await activity.addvisit(ctx.params.id);

    await ctx.render('activity/activitydetail', {
        data: detailInfo, // 详细信息
        comments: comments, // 评论
        researchs: research, // 问卷
        report: report, // 活动纪实
        tjdata: tjres // 推荐
    })

})

/**
 * 活动订单
 */
router.post("/order/:id", async (ctx) => {
    let orderInfo = ctx.request.body;
    // let verifyStatus = await users.verifyVcodes(orderInfo.mobile, orderInfo.vcode);  //无需验证码
    let res = {
        success: false,
        message: ''
    };
    delete orderInfo.vcode;
    let user = ctx.session.user;
    Object.assign(orderInfo, {
        userId: user.id,
        nickname: user.nickname,
        cname: user.name
    });
    try {
        res = await activity.postActivityOrder(orderInfo);
        res.success = true;
        logUtil.logbusiness([ctx.session.user.mobile,'activityEnroll',orderInfo.activityId,'success'])
    } catch (error) {
        res.success = false;
        res.message = error.response.data.message || '';
        logUtil.logbusiness([ctx.session.user.mobile,'activityEnroll',orderInfo.activityId,res.message])
    }

    ctx.body = res;
});

/**活动预定 */
router.get('/booking/:id', async (ctx, next) => {
    let id = ctx.params.id;
    let res = await activity.activityDetail(id);
    res = convertActivity(res);
    let search = 'orderStatus:reserved~drawn,userId:' + ctx.session.user.id + ',activityId:' + id;
    let orders = await activity.activityOrder(search, 0, -1);
    orders = orders.content;

    if (res.itms.length) {
        res.itms.forEach(function(item) {
            let actList = orders.filter(x => x.itmId === item.id);
            let _temp_seat = 0;
            if (actList.length) {
                for (let act of actList) {
                    _temp_seat += act.reserveSum || 0;
                }
            }
            item.reserveSum = _temp_seat; // 某用户某场次已预定数量
            item.remainSum = res.perAllow - _temp_seat; // 某用户某场次剩余可预定数量
        })
    }

    await ctx.render('activity/booking', {
        data: res
    })
})

// 提交用户问卷
router.post("/research/answers/:id", async (ctx) => {
    if (ctx.session.user) {
        let id = ctx.params.id;
        let content = ctx.request.body;
        content.userId = ctx.session.user.id;
        content.nickName = ctx.session.user.nickName;
        try {
            let status = await activity.postResearch(content, id);
            ctx.body = status;
            logUtil.logbusiness([ctx.session.user.mobile,'postResearch',id])
        } catch (ex) {
            ctx.body = ex.response.data;
        }
    } else {
        ctx.body = '信息过期';
    }
})
module.exports = router
