const router = require('koa-router')()
const activity = require('../models/activity')
const issue = require('../models/issue')
const users = require('../models/users')
const assist = require('../util/assist')
const moment = require('moment')
const config = require('../config')

router.prefix('/issue')

/**资讯列表 */
router.get('/', async (ctx, next) => {
    console.log('用户信息----->',ctx.session.user);
    let queryItems = ctx.query;
    let topid;
    let childid='';
    let topColumns = [];
    let childColumns = [];
    let searchId = queryItems.column;
    let newPhotoGraphic = queryItems.flag

    let allColumn = await issue.getColumns('enable:true,channel:culture', 0, -1);
    allColumn = allColumn.content;
    if (!allColumn.length) {
        return ctx.render('issue/index', {
            data: {},
            query: ctx.query,
            topColumns: topColumns,
            childColumns: childColumns
        });
    }
    topColumns = allColumn.filter(x => x.parent === null); //获取一级栏目
    if (!searchId) { //判断首次加载（没有指定样式）
        topid = topColumns[0].id;
        searchId = topid;
    } else {
        let column = topColumns.find(x => x.id === searchId); //判断是否是一级栏目
        if (column) {
            topid = searchId; 
            childid='';
        } else {
            let column = allColumn.find(x => x.parent !== null && x.id === searchId);
            if (column) {
                topid = column.parent.id;
                childid = column.id;
            } else { //二级栏目不存在，取一级栏目中第一个
                topid = topColumns[0].id;
                searchId = topid;
            }
        }
    }
    if (newPhotoGraphic === 'news') {
        let codeName = encodeURIComponent('湖南省艺术摄影学会')
        let curColumn = await issue.getColumns('name:'+codeName, 0, -1);
        searchId = curColumn.content[0].id
        topid = searchId
    }
    
    childColumns = allColumn.filter(x => x.parent && x.parent.id === topid);
    let str = 'search=column.id:' + searchId + ',isPublish:true';
    let page = queryItems.page ? queryItems.page - 1 : 0;
  
    let sort=ctx.topfield+'~desc,publishTime~desc';
    let res = await issue.newslist(str, page,config.paging.issue.size,sort);
    res.content.forEach(function(item) {
        item.coverPic2 = item.coverPic && item.coverPic !== '' ? assist.getFileUrl(item.coverPic) : null;
        item.date = moment(item.publishTime).format('YYYY-MM-DD');
    })
   
    await ctx.render('issue/index', {
        data: res,
        topColumns: topColumns,
        childColumns: childColumns,
        query: queryItems,
        topid: topid,
        childid: childid
    })
})

/**资讯详情 */
router.get('/detail/:id', async (ctx, next) => {
    let commentPage = ctx.query.page ? ctx.query.page - 1 : 0;
    let res = await issue.newsDetail(ctx.params.id);
    await issue.addvisit(ctx.params.id);
    res.date = moment(res.publishTime).format('YYYY-MM-DD');
    let channels = res.column.map(x => x.channel);
    let sort=ctx.topfield+'~desc,publishTime~desc';
    let tjres = await issue.newslist('search=isPublish:true,column.channel:' + channels.join('~'), 0, 4,sort);
    comments = await users.getComments('information', ctx.params.id, commentPage, config.paging.comments.size);
	
	res.favorited = false; // 是否已收藏
    // 是否已收藏
    if (ctx.session.user) {
        let favStatus = await users.fetchUserFavoritesStatus(ctx.session.user.id, 'Information', ctx.params.id);
        res.favorited = favStatus.status;
    }
    
    // res.content = assist.formateHtmlToText(res.content);
    //推荐过滤本身
    let arr = tjres.content;
    let tjarr = arr.filter(function(item) {
        return item.id != ctx.params.id
    });

    tjres.content = tjarr;
    tjres.content.forEach(function(item) {
        item.coverPic = assist.getFileUrl(item.coverPic);
        item.date = moment(item.publishTime).format('YYYY-MM-DD');
    })

    if(res.attachName&&res.attach){
        res.attach = assist.getFileUrl(res.attach);
    }

    let url = 'issue/issue_atlas';
    if (res.type == 'atlas') {
        res.picList.forEach(item => item.pictureFile = assist.getFileUrl(item.pictureFile));
        url = 'issue/issue_atlas';
    } else {
        url = 'issue/detail';
    }
    await ctx.render(url, {
        data: res,
        tjres: tjres,
        comments: comments
    })

})


module.exports = router