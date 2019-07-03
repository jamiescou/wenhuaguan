const router = require('koa-router')()
const vod = require('../models/vod')
const users = require('../models/users')
const config = require('../config')
const test = require('../util/filter')
const assist = require('../util/assist')
const venues = require('../models/venues')
const sys = require('../models/sys')


router.prefix('/vod')

//直录播列表
router.get('/', async (ctx, next) => {
  let type = 'videoType';
  let cordList = await sys.fetchCodeTypes(type);
  let liverecordingdetail = ctx.query.liverecordingdetail ? ctx.query.liverecordingdetail : 'demands';
  let search = 'search=isPublish:true';
  search += ctx.query.type ? (search.length ? ',' : '') + ',artistTypes:' + ctx.query.type : '';
  search += ctx.query.key ? (search.length ? ',' : '') + ',name~' + encodeURIComponent(ctx.query.key) : '';
  let page = ctx.query.page ? ctx.query.page - 1 : 0;
  let res = {};
  let flag = ctx.query.sorttime ? ctx.query.sorttime : "";
  let sort=ctx.topfield+'~desc,createTime~desc';

 
  if (liverecordingdetail == 'demands') {
    res = await vod.demandsList(search, page, config.paging.vod.size, sort);
  } else {
    res = await vod.livevideosList(search, page, config.paging.vod.size, sort);
  }
  if (res && res.content.length != 0) {
    res.content.forEach(function(item) {
      item.coverPic = assist.getFileUrl(item.coverPic);
      item.itemType = liverecordingdetail;
    })
  }

  await ctx.render('vod/index', {
    data: cordList,
    direct: res,
    query: ctx.query

  })
})
// 视频详情
router.get('/detail/:id', async (ctx, next) => {
  let type = ctx.query.type ? ctx.query.type : 'demands';
  let commentPage = ctx.query.page ? ctx.query.page - 1 : 0;
  let codetype = 'videoType';
  let cordList = await vod.cordList(codetype);
  let res = {};
  let comments = {};
  let list = {};

  let url = '';
  let sort=ctx.topfield+'~desc,createTime~desc';
  if (type == 'demands') {
    url = 'vod/demand'
    res = await vod.demandsContent(ctx.params.id);
    res.dramas = (res.dramas && res.dramas.length != 0) ? res.dramas : [];
    comments = await users.getComments('goodvideos', ctx.params.id, commentPage, config.paging.comments.size);
    list = await vod.demandsList('search=isPublish:true', commentPage, 4,sort);
    favorited = false;
    if (ctx.session.user) {
      let favStatus = await users.fetchUserFavoritesStatus(ctx.session.user.id, 'Demands', ctx.params.id);
      favorited = favStatus.status;
    }
      await vod.addvisit(ctx.params.id);
  } else { //直播
    url = 'vod/live'
    res = await vod.livevideosContent(ctx.params.id);
    comments = await users.getComments('livevideos', ctx.params.id, commentPage, config.paging.comments.size),
      list = await vod.livevideosList('search=isPublish:true', commentPage, 4, sort);
    favorited = false;
    if (ctx.session.user) {
      let favStatus = await users.fetchUserFavoritesStatus(ctx.session.user.id, 'LiveVideos', ctx.params.id);
      favorited = favStatus.status;
    }
    await vod.addvisitZb(ctx.params.id);
  }
  if (res.dramas && res.dramas.length != 0) {
    res.dramas.forEach(function(item) {
      item.file = assist.getFileUrl(item.file);
      item.pic = assist.getFileUrl(item.pic);
    })
    res.curPath = res.dramas ? res.dramas[0].file : ''; //默认第一集，便于获取
  }
  res.brief = assist.replaceTxtNLine(res.brief);
  res.brief = assist.formateHtmlToText(res.brief);
  res.content = assist.replaceTxtNLine(res.content);
  res.content = assist.formateHtmlToText(res.content);
  if (res.artistTypes != undefined) {
    for (var i = 0; i < cordList.length; i++) {
      for (var j = 0; j < res.artistTypes.length; j++) {
        if (cordList[i].code == res.artistTypes[j]) {
          res.artistTypes[j] = cordList[i].value;
        }
      }
    }
  } else {
    res.artistTypes = [];
  }
  if (list && list.content.length != 0) {
    list.content.forEach(function(item) {
      item.coverPic = assist.getFileUrl(item.coverPic);
    })
  }
  res.coverPic = assist.getFileUrl(res.coverPic);
  res.desc = '';

await ctx.render(url, {
    data: res,
    comments: comments,
    query: ctx.query,
    favorited: favorited,
    list: list
  })
})

// 视频详情
router.get('/live/:id', async (ctx, next) => {
  let res = await vod.livevideosContent(ctx.params.id);
  ctx.body = res;
})

module.exports = router