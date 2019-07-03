const koaRouter = require('koa-router')
const sysApi = require('../api/sys')
const exhibitionApi = require('../api/exhibition')
const userApi = require('../api/user')
const { getFileUrl } = require('../api/util')
const moment = require('moment')
moment.locale('zh-cn');
const router = new koaRouter()

// 获取活动列表
router.get('/exhibitions/:page', async (ctx) => {
    let queryItems = ctx.query;
    let page = ctx.params.page || 0;

    let searchConditions = 'search=isPublish:true';
    if (queryItems && queryItems.type && queryItems.type !== 'all') {
        searchConditions += ',type:' + queryItems.type;
    }
    searchConditions += '&sort=' + ctx.topfield + '~desc,createTime~desc';

    let exhibits = await exhibitionApi.digitalList(searchConditions, page, 10);
    if (exhibits.content.length) {
        exhibits.content.forEach(function(item) {
            item.coverPic = getFileUrl(item.coverPic);
        })
    }
    ctx.body = exhibits;
});

/** 展览类型 */
router.get('/exhibitionType', async (ctx) => {
    let exhibitionType = [];
    exhibitionType = await sysApi.getDict('exhibition');
    exhibitionType.splice(0, 0, { code: 'all', value: '全部' });
    ctx.body = exhibitionType;
});

// 展览详情
router.get('/exhibition/detail/:id', async (ctx, next) => {
	
	// 浏览量+1
	await exhibitionApi.addvisit(ctx.params.id);
	
    let res = await exhibitionApi.digitalDetail(ctx.params.id);
    res.coverPic = getFileUrl(res.coverPic);
    
    let hasFavorites = false;
    if (ctx.session.user && ctx.session.user.id !== '') {
        hasFavorites = await userApi.hasFavorite(ctx.session.user.id, 'DigitalShow', ctx.params.id);
        hasFavorites = hasFavorites.status;
    }
    res.favorited = hasFavorites;
    console.log(res)
    ctx.body = res
})
// 展品列表
router.get('/exhibition/products/:id/:page', async (ctx, next) => {
    let page = ctx.params.page || 0;
    let size = ctx.query.size || 10;
    let res = await exhibitionApi.productionsDetail(ctx.params.id, page, size);
    if (res.content.length) {
        res.content.forEach(function(item) {
            item.coverPic = getFileUrl(item.coverPic);
        });
    }
    ctx.body = res
})

module.exports = router;
