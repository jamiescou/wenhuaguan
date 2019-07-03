const koaRouter = require('koa-router')
const sysApi = require('../api/sys')
const collectApi = require('../api/collect')
const userApi = require('../api/user')
const { getFileUrl } = require('../api/util')
const moment = require('moment')
moment.locale('zh-cn');
const router = new koaRouter()

// 获取作品征集
router.get('/collects/:page', async (ctx) => {
    let query = ctx.query;
    let page = ctx.params.page || 0;
    // 查询条件
    let searchCondition = 'search=onlineStatus:Published,'; // 已发布
    searchCondition += query.type ? 'type:' + query.type : 'type:activity';

    let res = await collectApi.collectList(searchCondition, page, 10);
    if (res.content.length) {
        let dateNow = moment().format('x'); //当前时间戳
        for (const item of res.content) {
            item.coverPic = getFileUrl(item.coverPic);
            let startDate = moment(item.startTime).format('x'); // 活动开始时间戳
            let endDate = moment(item.endTime).format('x'); // 活动结束时间戳
            if (dateNow > endDate) {
                item.tag = '已结束'
            } else if (dateNow < startDate) {
                item.tag = '未开始'
            } else {
                item.tag = '进行中'
            }
            item.favorited = false; // 是否收藏
            item.favoritieId = null; // 收藏id
            // 是否收藏
            if (ctx.session.user && ctx.session.user.id !== '') {
                let hasFavorite = await userApi.hasFavorite(ctx.session.user.id, 'ArtWorks', item.id);
                item.favorited = hasFavorite.status;
                item.favoritieId = item.id;
            }
        }
    }
    ctx.body = res;
});
// 作品征集详情
router.get('/collect/detail/:id', async (ctx, next) => {
	
	// 浏览量+1
	await collectApi.addvisitArtWorks(ctx.params.id);
	
    let res = await collectApi.collectDetail(ctx.params.id);
    res.coverPic = getFileUrl(res.coverPic);
    res.favorited = false; // 是否收藏
    res.favoritieId = null; // 收藏id

    // 是否收藏
    if (ctx.session.user && ctx.session.user.id !== '') {
        let hasFavorite = await userApi.hasFavorite(ctx.session.user.id, 'ArtWorks', res.id);
        res.favorited = hasFavorite.status;
        res.favoritieId = res.id;
    }
    
    let dateNow = new Date();
    let startDate = new Date(res.startTime);
    let endDate = new Date(res.endTime);
    if (dateNow > endDate) {
        res.tag = '已结束'
    } else if (dateNow < startDate) {
        res.tag = '未开始'
    } else {
        res.tag = '进行中'
    }
    res.startTime = moment(res.startTime).format('YYYY.MM.DD HH:mm');
    res.endTime = moment(res.endTime).format('YYYY.MM.DD HH:mm');
    ctx.body = res
})

/**
 * 作品列表
 */
router.get('/collect/works/lst/:page', async (ctx) => {
    let page = ctx.params.page || 0;
    let size = ctx.query.size || 10;
    let id = ctx.query.id;
    let search = 'search=isPass:true,activity.id:' + id + '&sort=vote~desc,creteTime~desc';
    let res = await collectApi.workList(search, page, size);
    res.content.forEach(function(item) {
        item.files[0].filePath = getFileUrl(item.files[0].filePath);
    })
    ctx.body = res

})

/**参加作品点赞 */
router.get('/collect/thum/:id', async (ctx) => {
    let id = ctx.params.id
    let userid = ctx.session.user.id
    try {
        let vote = await collectApi.thumUpload(id, userid);
        ctx.body = vote
    } catch (ex) {
        ctx.body = ex.response.data
    }
})

router.post('/collect/workupload', async (ctx, next) => {

    let workInfo = ctx.request.body;
    try {
        let picres = await sysApi.saveFile(workInfo.files.file);
        if (picres.success) {
            let url = picres.url;
            
            let workObj = {
                "title": workInfo.fields.title,
                "activity": { "id": workInfo.fields.activityId },
                "user": { "id": ctx.session.user.id },
                "brief": workInfo.fields.brief,
                "files": [
                    { "fileType": "pic", "filePath": url }],
                "isPass": ''
            }

            let resupload = await collectApi.workUpload(workObj);
            ctx.body = {
                success: true,
                msg: resupload
            }
        } else {
            ctx.body = {
                success: false,
                msg: "上传失败"
            }
        }

    } catch (ex) {
        ctx.body = {
            success: true,
            msg: ex.response.data
        }
    }

    // ctx.redirect('/collect/success/' + ctx.params.id);

})

module.exports = router;
