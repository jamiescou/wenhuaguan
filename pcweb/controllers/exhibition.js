const router = require('koa-router')();
const sys = require('../models/sys');
const exhibition = require('../models/exhibition');
const activity = require('../models/activity')
const users = require('../models/users');
const assist = require('../util/assist');
const config = require('../config');

router.prefix('/exhibition');
/**近期展览 */
router.get('/', async (ctx, next) => {
    // let search ='search=onlineStatus:published,activityType:01,sort=holdStartDate~desc';
    let search = 'activityType:01,onlineStatus:Published';
    let sort = ctx.topfield + '~desc,startDate~desc,createTime~desc';
    let res = await activity.activityList(search, 0, 4,sort);
  
    let type = ctx.query.type ? ',type:' + ctx.query.type : '';
    let page = ctx.query.page ? ctx.query.page - 1 : 0;
    let digitalSearch = 'search=isPublish:true' + type;
    let digittalSort=ctx.topfield + '~desc,createTime~desc';
    let digitalRes = await exhibition.digitalList(digitalSearch, page, config.paging.onlineExhibition.size,digittalSort);
    let codetype = await sys.fetchCodeTypes('exhibition');
    res.content.forEach(function (item) {
        item.coverPic =assist.getFileUrl(item.coverPic);
    });  
    digitalRes.content.forEach(function (item) {
        item.coverPic =assist.getFileUrl(item.coverPic);
        // item.brief = assist.subTextLimit34(item.brief);
    });
    let type1 = "pcdigitalshow"
    // 
    let figure = await sys.fetchfigure(type1);
    figure.forEach(function (item) {
      item.coverPic =assist.getFileUrl(item.coverPic);
    })
    await ctx.render('exhibition/index', {
        digital: digitalRes,
        data: res,
        codetype: codetype,
        query: ctx.query,
        figure:figure
    })
});

 
router.get('/detail/:id', async (ctx, next) => {
    let commentPage = ctx.query.page ? ctx.query.page - 1 : 0;
    let zpPage = ctx.query.pagezp ? ctx.query.pagezp - 1 : 0;
    let res = await exhibition.digitalDetail(ctx.params.id);
    let exhibitionProductions=await exhibition.productionsDetail(ctx.params.id,'isPublish=true',zpPage, config.paging.onlineExhibition.size);
    let digitalSearch = 'search=isPublish:true';
    let digittalSort=ctx.topfield + '~desc,createTime~desc';
    let recommends = await exhibition.digitalList(digitalSearch, 0, 4,digittalSort);
    let resList = await exhibition.digitalList('search=isPublish:true', 0, -1,digittalSort); //所有数字展览
    let codetype = await sys.fetchCodeTypes('exhibition');
    
    res.favorited = false; // 是否已收藏
    // 是否已收藏
    if (ctx.session.user) {
        let favStatus = await users.fetchUserFavoritesStatus(ctx.session.user.id, 'DigitalShow', ctx.params.id);
        res.favorited = favStatus.status;
    }
    
    
    codetype.forEach(function(item){
        if(item.code==res.type){
            res.type=item.value;
        }
    })
    let comments =await users.getComments('exhibit',ctx.params.id,commentPage,config.paging.comments.size);
    if(exhibitionProductions.content.length ){
        exhibitionProductions.content.forEach(function (item) {
            item.coverPic =assist.getFileUrl(item.coverPic);
        });
    }
    recommends.content.forEach(function (item) {
        item.coverPic =assist.getFileUrl(item.coverPic);
        item.brief=assist.formateHtmlToText(item.brief);
    });
    resList.content.forEach(function (item) {
        item.coverPic =assist.getFileUrl(item.coverPic);
    });
    res.coverPic =assist.getFileUrl(res.coverPic);
    //获取上一篇
    let newsArr = resList.content;
    let nextPage = []; //上一图集，下一图集
    
    newsArr.filter(function(item, index) {
        if (newsArr.length > 2) {
            if (item.id === ctx.params.id) {
                if (index === 0) {
                    nextPage[0] = newsArr[newsArr.length - 1];
                    nextPage[1] = newsArr[index + 1];
                } else if (index === newsArr.length - 1) {
                    nextPage[0] = newsArr[index - 1];
                    nextPage[1] = newsArr[0];
                } else {
                    nextPage[0] = newsArr[index - 1];
                    nextPage[1] = newsArr[index + 1];
                }
            }
        } else {
            if (item.id === ctx.params.id && newsArr.length > 1) {
                if (index === 0) {
                    nextPage[0] = newsArr[newsArr.length - 1];
                    nextPage[1] = {};
                } else if (index === newsArr.length - 1) {
                    nextPage[0] = newsArr[index - 1];
                    nextPage[1] = {};
                } else {
                    nextPage[0] = newsArr[index - 1];
                    nextPage[1] = {};
                }
            }
        }
    });
    //获取上一篇
    await ctx.render('exhibition/detail', {
        data: res,
        digitalRes: recommends, //推荐
        nextPage: nextPage,
        exhibitionProductions:exhibitionProductions,
        // exhibitionProductions2:exhibitionProductions2,
        comments:comments
    })
});



module.exports = router;