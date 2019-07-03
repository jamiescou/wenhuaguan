const router = require('koa-router')()
const index = require('../models/sys')
const activity = require('../models/activity')
const train = require('../models/train')
const vod = require('../models/vod')
const exhibition = require('../models/exhibition')
const issue = require('../models/issue')
const bigScreen = require('../models/big_screen')
const _ = require('lodash')
const assist = require('../util/assist')
const moment = require('moment')
moment.locale('zh-cn');
router.prefix('/bigScreen')

/** 大数据 */
router.get('/', async (ctx, next) => {
    let res = {}
    let [actList, traList, recentExhibition, vodList] = await Promise.all([
        activity.activityList('onlineStatus:Published', 0, 18, 'isTop~desc,createTime~desc'),
        train.trainList('search=onlineStatus:Published', 0, 18, 'isTop~desc,createTime~desc'),
        activity.activityList('activityType:01,onlineStatus:Published', 0, 18, 'isTop~desc,createTime~desc'),
        vod.demandsList('search=isPublish:true', 0, 18, 'createTime~desc')
    ])
    if (actList && actList.content.length > 0) {
        actList.content.forEach(function(item) {
            item.pic = assist.getFileUrl(item.coverPic);
        })
    }
    if (traList && traList.content.length > 0) {
        traList.content.forEach(function(item) {
            item.pic = assist.getFileUrl(item.picture);
        })
    }
    if (recentExhibition && recentExhibition.content.length > 0) {
        recentExhibition.content.forEach(function(item) {
            item.pic = assist.getFileUrl(item.coverPic);
        })
    }

    if (vodList && vodList.content.length > 0) {
        vodList.content.forEach(function(item) {
            item.pic = assist.getFileUrl(item.coverPic);
        })
    }
    res.actList = _.chunk(actList.content, 4);
    res.traList = _.chunk(traList.content, 4);
    res.recentExhibition = _.chunk(recentExhibition.content, 4);
    res.vodList = _.chunk(vodList.content, 4);
    await ctx.render('big_screen/index', {
        data: res,
        time: moment().format('HH:mm'),
        date: moment().format('YYYY/MM/DD'),
        week: moment().format('dddd')
    })
})
/** 大屏 */
router.get('/show', async (ctx, next) => {
    let res = {}
    let digitalRes = await exhibition.digitalList('search=isPublish:true', 0, 24);
    if (digitalRes && digitalRes.content.length > 0) {
        digitalRes.content.forEach(function(item) {
            item.pic = assist.getFileUrl(item.coverPic);
        })
    }
    let newslist = await issue.newslist('search=isPublish:true', 0, 16, 'publishTime~desc');
    if (newslist && newslist.content.length > 0) {
        newslist.content.forEach(function(item) {
            item.pic = assist.getFileUrl(item.coverPic);
            item.date = moment(item.publishTime).format('YYYY.MM.DD');
        })
    }

    let vodList = await vod.demandsList('search=isPublish:true', 0, 24, 'createTime~desc')
    if (vodList && vodList.content.length > 0) {
        vodList.content.forEach(function(item) {
            item.pic = assist.getFileUrl(item.coverPic);
        })
    }

    res.digitalRes = _.chunk(digitalRes.content, 8);
    res.vodList = _.chunk(vodList.content, 8);
    res.atlasList = _.chunk(newslist.content, 4);
    await ctx.render('big_screen/show', {
        data: res,
        time: moment().format('HH:mm'),
        date: moment().format('YYYY/MM/DD'),
        week: moment().format('dddd')
    })
})

router.get('/initData', async (ctx, next) => {
    let res = {}
    let statis = {
        userTotal: 28688, // 累计用户量
        yesterDayUser: 188, // 昨日新增用户
        TotalBrowsing: 325880, // 浏览总量
        visitors: 3588, // 访客数
        actNum: 208, // 活动总量
        actOrderNum: 20300, // 活动订单
        venueItems: 350, // 场馆开放场次
        venueOrderNum: 8688, // 场馆订单
        trainNum: 312, // 培训总量
        trainOrderNum: 12000, // 培训学位
        distributionNum: 132, // 文化配送
        exhibitionNum: 20 // 艺术展览次数
    }
    res.statis = statis
    res.activityForm = await index.fetchCodeTypes('activityForm'); // 活动类型
    res.activityReport = []
    let actData = await activity.getActivityform()

    if (res.activityForm.length > 0) {
        for (var j = 0; j < res.activityForm.length; j++) {
            let item = actData.find(x => x.name === res.activityForm[j].code);
            if (item) {
                res.activityReport.push(item);
            }
        }
    }

    res.trainReport = []
    res.artistClass = await index.fetchCodeTypes('artistClass');
    let trainData = await train.getTrainform()
    if (res.artistClass.length > 0) {
        for (var j = 0; j < res.artistClass.length; j++) {
            let item = trainData.find(x => x.name === res.artistClass[j].code);
            if (item) {
                res.trainReport.push(item);
            }
        }
    }

    // res.arrivedDay = await index.arrivedOfDay(moment().format('YYYY-MM-DD'))
    // res.arrivedMonth = await index.arrivedOfMonth(moment().format('YYYYMM'))
    // res.arrivedYear = await index.arrivedOfYear(moment().format('YYYY'))
    // res.statisUser = await index.statisOfUser();
    // let baidu = await index.baiduData();
    //  res.viewsNum = baidu.pv_count;
    //  res.usersNum = baidu.ip_count;
    // res.viewsNum = isNaN(baidu.pv_count) ? 0 : baidu.pv_count;
    // res.usersNum = isNaN(baidu.ip_count) ? 0 : baidu.ip_count;
    ctx.body = res;
})

module.exports = router
