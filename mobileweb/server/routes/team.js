const koaRouter = require('koa-router')
const sysApi = require('../api/sys')
const teamApi = require('../api/team')
const userApi = require('../api/user')
const { getFileUrl, getFullAddress } = require('../api/util')
const router = new koaRouter()
const { trimEnd } = require('lodash')

const moment = require('moment')
moment.locale('zh-cn');

// 获取场馆列表
router.get('/teams/:page', async (ctx) => {
    let page = ctx.params.page || 0;
    let query = ctx.query;

    // 查询条件
    let searchCondition = 'isPublish:true'; // 已发布
    if (query && query.regionType && query.regionType !== 'all') {
        let regionstr =sysApi.trimRegionEnd(ctx.query.regionType) + '%';
        searchCondition += ',region~' + regionstr;
    }
    if (query && query.type && query.type !== 'all') { // 文艺团队类型
        searchCondition += ',artType:' + query.type;
    }
    let sort = '&sort=' + ctx.topfield + '~desc,createTime~desc'; // 排序

    let res = await teamApi.getTeamList(searchCondition + sort, page, 10);
    if (res.content.length) {
        for (let i = 0; i < res.content.length; i++) {
            let item = res.content[i];
            item.coverPic = getFileUrl(item.coverPic);
            item.attach = getFileUrl(item.attach);
            item.favorited = false; // 是否收藏
            item.favoritieId = null; // 收藏id
            // 是否收藏
            if (ctx.session.user && ctx.session.user.id !== '') {
                let hasFavorite = await userApi.hasFavorite(ctx.session.user.id, 'ArtTeam', item.id);
                item.favorited = hasFavorite.status;
                item.favoritieId = item.id;
            }
            let region = await sysApi.getRegion(item.region);
            item.address = getFullAddress(region, item.address)
        }
    }
    ctx.body = res;
});

/** 类型 */
router.get('/teamDicts', async (ctx) => {
    let artists = [];
    artists = await sysApi.getDict('artistClass');
    artists.splice(0, 0, { code: 'all', value: '全部' });
    ctx.body = {
        artists: artists
    }
});

// 展览详情
router.get('/team/detail/:id', async (ctx, next) => {
    let res = await teamApi.getTeamInfo(ctx.params.id);
    res.coverPic = getFileUrl(res.coverPic);
    res.attach = getFileUrl(res.attach);
    res.favorited = false; // 是否收藏
    res.favoritieId = null; // 收藏id

    // 类型
    let artists = await sysApi.getDict('artistClass');
    let types = [];
    if (artists && artists.length && res.artType.length) {
        for (var j = 0; j < res.artType.length; j++) {
            let code = artists.find(x => x.code === res.artType[j]);
            if (code) {
                types.push(`<span class="tag">${code.value}</span>`);
            }
        }
    }
    res.artTypeName = types.join(' ');

    // 是否收藏
    if (ctx.session.user && ctx.session.user.id !== '') {
        let hasFavorite = await userApi.hasFavorite(ctx.session.user.id, 'ArtTeam', res.id);
        res.favorited = hasFavorite.status;
        res.favoritieId = res.id;
    }
    let region = await sysApi.getRegion(res.region);
    res.address = getFullAddress(region, res.address)
    ctx.body = res
})
// 团队成员列表
router.get('/team/members/:id', async (ctx, next) => {
    let res = await teamApi.getTeamMembers(ctx.params.id);
    if (res.length > 0) {
        res.forEach(function(item) {
            item.coverPic = getFileUrl(item.coverPic);
        });
    }

    ctx.body = res
})
// 团队风采
router.get('/team/styles/:id', async (ctx, next) => {
    let res = await teamApi.getTeamMien(ctx.params.id);
    if (res.length > 0) {
        res.forEach(function(item) {
            item.createTime = item.createTime && moment(item.createTime).format('YYYY.MM.DD HH:mm') //.fromNow();
            if (item.files.length > 0) {
                item.files.forEach(function(i) {
                    i.filePath = getFileUrl(i.filePath);
                })
            }
        });
    }

    ctx.body = res
})
module.exports = router;
