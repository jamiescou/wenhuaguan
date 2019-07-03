const koaRouter = require('koa-router')
const sysApi = require('../api/sys')
const issueApi = require('../api/issue')
const userApi = require('../api/user')
const { getFileUrl } = require('../api/util')
const moment = require('moment')
moment.locale('zh-cn');
const router = new koaRouter()

// 获取活动列表
router.get('/information/:page', async (ctx) => {
    let queryItems = ctx.query;
    let page = ctx.params.page || 0;

    // 资讯
    let searchConditions = 'column.channel:culture,isPublish:true';
    if (queryItems && queryItems.column && queryItems.column !== 'all') {
        searchConditions = 'isPublish:true,column.id:' + queryItems.column;
    }
    searchConditions += '&sort=' + ctx.topfield + '~desc,publishTime~desc'
    let informations = await issueApi.getInformationList(searchConditions, page, 10);
    if (informations.content) {
        informations.content.forEach(function(item) {
            item.coverPic = getFileUrl(item.coverPic);
            item.publishTime = moment(item.publishTime).fromNow()
        })
    }
    ctx.body = informations;
});

/** 资讯顶级栏目 */
router.get('/columns/tops', async (ctx) => {
    // 资讯栏目
    let infocolumns = [];
    let allColumns = await issueApi.getColumns('enable:true,channel:culture', 0, -1);
    console.log('infocolumns======================================================>', infocolumns)
    // infocolumns = infocolumns.filter(x => x.channel === 'culture' && x.enable);
    infocolumns = allColumns.content
    infocolumns.splice(0, 0, { id: 'all', name: '全部' });

    ctx.body = infocolumns;
});

/** 资讯详情 */
router.get('/information/detail/:id', async (ctx) => {
    let res = await issueApi.newsDetail(ctx.params.id);
    issueApi.addvisit(ctx.params.id)
    res.coverPic = getFileUrl(res.coverPic);
    
    let hasFavorites = false;
    if (ctx.session.user && ctx.session.user.id !== '') {
        hasFavorites = await userApi.hasFavorite(ctx.session.user.id, 'Information', ctx.params.id);
        hasFavorites = hasFavorites.status;
    }
    res.favorited = hasFavorites;
    
    if (res.picList && res.picList.length) {
        res.picList.forEach(item => { item.pictureFile = getFileUrl(item.pictureFile) })
    }
    res.publishTime = moment(res.publishTime).fromNow();
    res.attach = getFileUrl(res.attach);
    ctx.body = res;
});

module.exports = router;
