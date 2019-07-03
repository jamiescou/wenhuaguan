const router = require('koa-router')()
const liverecording = require('../models/liverecording')
const users = require('../models/users')
const config = require('../config')
const test = require('../util/filter')
const assist = require('../util/assist')
const venues = require('../models/venues')
router.prefix('/liverecording')

//直录播列表
router.get('/', async (ctx, next) => {
  let type = 'videoType';
  let cordList = await liverecording.cordList(type);
  let liverecordingdetail = ctx.query.liverecordingdetail ? ctx.query.liverecordingdetail : 'demands';
  let search = 'search=isPublish:true';
  search += ctx.query.type ? (search.length ? ',' : '') + ',type:' + ctx.query.type : '';
  let page = ctx.query.page ? ctx.query.page - 1 : 0;
  let res = {};
  let flag = ctx.query.sorttime?ctx.query.sorttime:"";
  let sorttype = "isTop"
  if(flag=="new"){
    sorttype = "createTime"
  }
  if (liverecordingdetail == 'demands') {
    res = await liverecording.demandsList(search, page,10,sorttype);
  }
  else {
    res = await liverecording. livevideosList(search, page,10,sorttype);
  }
  if(res&&res.content.length!=0){
    res.content.forEach(function (item) {
      item.coverPic =assist.getFileUrl(item.coverPic);
      item.itemType= liverecordingdetail;
    })
  }
 
  await ctx.render('liverecording/index', {
     data:cordList,
     direct:res,
     query: ctx.query
  })
  })
 // 视频详情
 router.get('/directcontent/:id', async (ctx, next) => {
  let type = ctx.query.type ? ctx.query.type : 'demands';
  let commentPage = ctx.query.page ? ctx.query.page - 1 : 0;
  let codetype = 'videoType';
  let cordList = await liverecording.cordList(codetype);
  let res = {};
  let comments = {}
  if (type == 'demands') {
    res = await liverecording.demandsContent(ctx.params.id);
    comments =await users.getComments('goodvideos',ctx.params.id,commentPage,config.paging.comments.size);
    if(res.dramas){
      res.dramas.forEach(function(item){
        item.file=assist.getFileUrl(item.file);
      })
    }
    res.path = res.dramas ? res.dramas[0].file:'';
    // res.path=assist.getFileUrl(res.path);
    favorited = false;
    if (ctx.session.user) {
      let favStatus = await users.fetchUserFavoritesStatus(ctx.session.user.id, 'Demands', ctx.params.id);
      favorited = favStatus.status;
    }
  }
  else {
    res = await liverecording.livevideosContent(ctx.params.id);
    comments =await users.getComments('livevideos',ctx.params.id,commentPage,config.paging.comments.size);
    res.dramas = [];
    favorited = false;
    if (ctx.session.user) {
      let favStatus = await users.fetchUserFavoritesStatus(ctx.session.user.id, 'LiveVideos', ctx.params.id);
      favorited = favStatus.status;
    }
  }
  cordList.forEach(function (item) {
    if(res.type==item.code){
        res.type= item.value;
    }
  })
  await ctx.render('liverecording/directcontent', {
    data:res,
    comments:comments,
    query: ctx.query,
    favorited: favorited,
  })
})

module.exports = router