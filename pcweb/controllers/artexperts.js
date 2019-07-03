const router = require('koa-router')()
const sys = require('../models/sys')
const artexperts = require('../models/artexperts')
const assist = require('../util/assist')
const users = require('../models/users')
const config = require('../config')
const venues = require('../models/venues')

router.prefix('/artexperts')

router.get('/', async (ctx, next) => {
  let search = '';
  search += ctx.query.region ? 'region:' + ctx.query.region : '';
  search += ctx.query.artType ? (search.length ? ',' : '') + ',artType:' + ctx.query.artType : '';
  let page = ctx.query.page ? ctx.query.page - 1 : 0;
  search = 'search=isPublish:true,' + search;
  let res = await artexperts.fetchArtexperts(search, page, config.paging.artexperts.size);
  let artists = await sys.fetchCodeTypes('artistClass');
  let regions = await venues.getRegionList(config.defaultRegion.code);

  //组装艺术类型字段     
  let artTypeDic = {};
  artists.forEach(function (item) {
    artTypeDic[item.code] = item.value;
  });
  res.content.forEach(function (item) {
    item.coverPic = assist.getFileUrl(item.coverPic);
    if (item.brief.length > 50) {
      item.brief =assist.formateHtmlToText(item.brief);
      item.brief =assist.subTextLimit34(item.brief)
    }
    let artTypeStr = '';
    item.artType.forEach(function (item) {
      artTypeStr += ' ' + artTypeDic[item];
    });
    item.artTypeStr = artTypeStr;
  })
  await ctx.render('artexperts/index', {
    data: res,
    regions: regions,
    artists: artists,
    query: ctx.query
  })
})


router.get('/artexpertsdetail/:id', async (ctx, next) => {
  let commentPage = ctx.query.page ? ctx.query.page - 1 : 0;
  let [res,comments, artists] = await Promise.all([
    artexperts.fetchArtexpertDetail(ctx.params.id),
    users.getComments('artexperts',ctx.params.id,commentPage,config.paging.comments.size),
     sys.fetchCodeTypes('artistClass')
  ])
  let artTypeDic = {};
  artists.forEach(function (item) {
    artTypeDic[item.code] = item.value;
  });
  res.coverPic = assist.getFileUrl(res.coverPic);
  let artTypeStr = '';
  res.artType.forEach(function (item) {
    artTypeStr += ' ' + artTypeDic[item];
  });
  res.artTypeStr = artTypeStr;
  await ctx.render('artexperts/artexpertsdetail', {
    data: res,
    comments: comments
  })
})


// 用户评论 post
router.get("/artexperts/comments/:id", async (ctx) => {
  let id = ctx.params.id;
  let content = ctx.request.query.content;
  let user = {
    userId: ctx.session.user.id,
    nickname: ctx.session.user.nickname,
    content: content,
    status: 'Wait'
  };
  let status = await artexperts.postComments(user, id);
  ctx.body=status;
});

module.exports = router