const koaRouter = require('koa-router')
const sysApi = require('../api/sys')
const vodApi = require('../api/vod')
const userApi = require('../api/user')
const { getFileUrl } = require('../api/util')
const { trimEnd } = require('lodash')
const moment = require('moment')
moment.locale('zh-cn');
const router = new koaRouter()

// 获取视频列表
router.get('/vods/:page', async (ctx) => {
    let queryItems = ctx.query;
    let page = ctx.params.page || 0;

    let searchConditions = 'isPublish:true';
    if (queryItems && queryItems.type && queryItems.type !== 'all') {
        searchConditions = 'isPublish:true,artistTypes:' + queryItems.type;
    }
    searchConditions += '&sort=' + ctx.topfield + '~desc,createTime~desc'; // 排序
    let vods = { content: [], totalPages: 0 };
    if (queryItems && queryItems.vodClass === 'live') {
        // 直播
        vods = await vodApi.livevideosList(searchConditions, page, 10);
    } else {
        // 点播
        vods = await vodApi.demandsList(searchConditions, page, 10);
    }

    if (vods.content.length) {
        vods.content.forEach(function(item) {
            item.coverPic = getFileUrl(item.coverPic);
        })
    }
    ctx.body = vods;
});

/** 视频类型 */
router.get('/videoType', async (ctx) => {
    let videoType = [];
    videoType = await sysApi.getDict('videoType');
    videoType.splice(0, 0, { code: 'all', value: '全部' });

    ctx.body = videoType;
});

// 点播视频详情
router.get('/demand/detail/:id', async (ctx, next) => {
	
	// 浏览量+1
	await vodApi.addvisitDemands(ctx.params.id);
	
    let res = {};
    res = await vodApi.demandsContent(ctx.params.id);
    res.coverPic = getFileUrl(res.coverPic);
    
    let hasFavorites = false;
    if (ctx.session.user && ctx.session.user.id !== '') {
        hasFavorites = await userApi.hasFavorite(ctx.session.user.id, 'Demands', ctx.params.id);
        hasFavorites = hasFavorites.status;
    }
    res.favorited = hasFavorites;
    
    res.curDrama = null;
    if (res.dramas && res.dramas.length) {
        res.dramas.forEach(function(item) {
            item.file = getFileUrl(item.file);
            item.pic = getFileUrl(item.pic);
            item.createTime = moment(item.createTime).format('YYYY.MM.DD HH:mm');
        })
        res.curDrama = res.dramas[0]; //默认第一集，便于获取
    }

    if (res.artistTypes && res.artistTypes.length) {
        let videoType = await sysApi.getDict('videoType');
        let artistTypeNames = [];
        res.artistTypes.forEach(function(item) {
            let type = videoType.find(x => x.code === item);
            if (type) {
                artistTypeNames.push(type.value);
            }
        })
        res.artistTypeNames = artistTypeNames.join('、');
    }

    ctx.body = res
})

// 直播视频详情
router.get('/live/detail/:id', async (ctx, next) => {
	await vodApi.addvisitLiveVideos(ctx.params.id);
	
    let res = await vodApi.livevideosContent(ctx.params.id);
    res.coverPic = getFileUrl(res.coverPic);
    
    let hasFavorites = false;
    if (ctx.session.user && ctx.session.user.id !== '') {
        hasFavorites = await userApi.hasFavorite(ctx.session.user.id, 'LiveVideos', ctx.params.id);
        hasFavorites = hasFavorites.status;
    }
    res.favorited = hasFavorites;
    
    if (res.dramas && res.dramas.length) {
        res.dramas.forEach(function(item) {
            item.file = getFileUrl(item.file);
            item.pic = getFileUrl(item.pic);
            item.createTime = moment(item.createTime).format('YYYY.MM.DD HH:mm');
        })
        res.curDrama = res.dramas[0]; //默认第一集，便于获取
    }
    if (res.artistTypes && res.artistTypes.length) {
        let videoType = await sysApi.getDict('videoType');
        let artistTypeNames = [];
        res.artistTypes.forEach(function(item) {
            let type = videoType.find(x => x.code === item);
            if (type) {
                artistTypeNames.push(type.value);
            }
        })
        res.artistTypeNames = artistTypeNames.join('、');
    }
    ctx.body = {
        data: res
    }
})
module.exports = router;
