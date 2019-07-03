const koaRouter = require('koa-router')
const sysApi = require('../api/sys')
const brandApi = require('../api/brand')
const userApi = require('../api/user')
const { getFileUrl } = require('../api/util')
const { groupBy, trimEnd } = require('lodash')
 
const moment = require('moment')
moment.locale('zh-cn');
const router = new koaRouter()

// 获取品牌列表
router.get('/brands/:page', async (ctx) => {
    let query = ctx.query;
    let page = ctx.params.page || 0;

    // 根据传入的区域，获取该区域下的文化馆(包括子级馆)
    let searchCondition = 'search=isPublish:true'; // 已发布

    if (query && query.regionType && query.regionType !== 'all') {
        // let unitid = await sysApi.getUnitIdsByRegion(query.regionType);
       
        // searchCondition += ',unitId:' + unitid; // 所属文化馆

        let regionstr=sysApi.trimEnd(query.regionType)+'%';

        searchCondition += ',region~' + regionstr; 
    }

    searchCondition += '&sort=createTime~desc';
    let res = await brandApi.brandList(searchCondition, page, 10);
    if (res.content.length) {
        res.content.forEach(function(item) {
            item.coverPic = getFileUrl(item.coverPic);
        })
    }
    ctx.body = res;
});

// 品牌详情
router.get('/brand/detail/:id', async (ctx, next) => {
    let res = await brandApi.brandDetail(ctx.params.id);
    res.coverPic = getFileUrl(res.coverPic);

    ctx.body = res
})
// 品牌数字资源列表
router.get('/brand/digitals/:id', async (ctx, next) => {
    let page = ctx.query.page || 0;
    let size = ctx.query.size || 3;

    let res = await brandApi.digitalList(ctx.params.id);
    if (res.length) {
        res.forEach(function(item) {
            item.pic = getFileUrl(item.pic);
            item.file = getFileUrl(item.file);
        });
    }

    let digitalList = groupBy(res, 'type');
    ctx.body = digitalList
})
router.get('/brand/news/:id', async (ctx, next) => {
    let res = await brandApi.newsList(ctx.params.id);
    if (res.length) {
        res.forEach(function(item) {
            item.coverPic = getFileUrl(item.coverPic);
        });
    }

    ctx.body = res
})
module.exports = router;
