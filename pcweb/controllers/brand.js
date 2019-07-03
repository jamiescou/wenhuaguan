const router = require('koa-router')()
const brand = require('../models/brand')
const sys = require('../models/sys')
const activity = require('../models/activity')
const users = require('../models/users')
const assist = require('../util/assist')
const config = require('../config')
router.prefix('/brand')

/**品牌列表 */
router.get('/', async (ctx, next) => {
  let search = 'search=isPublish:true';
  let unitsstr = '';
  let regionsTree = await await sys.getRedisRegionTree(ctx.curUnit.region);;
  let query = ctx.query;
  if (query.key) {
    search += ',name~' + encodeURIComponent(query.key); // 所属文化馆
  }
  if (query.regionType) {
    let regionstr=sys.trimRegionEnd(query.regionType)+'%';
    search += ',region~' + regionstr;  
  }

  page = query.page ? query.page - 1 : 0;
  let res = await brand.brandList(search, page, config.paging.brand.size);
  if (res.content.length > 0) {
    res.content.forEach(function(item) {
      item.coverPic = assist.getFileUrl(item.coverPic);
    })
  }
  await ctx.render('brand/index', {
    data: res,
    regions: regionsTree,
    query: query
  })
})

/**品牌详情 */
router.get('/branddetail/:id', async (ctx, next) => {
  let resType = ctx.query.type ? ctx.query.type : ''; //资源类型 ''、全部 1、图片 2、视频 3、音频 4、文件

  let commentPage = ctx.query.page ? ctx.query.page - 1 : 0;
  let sort=ctx.topfield+'~desc,publishTime~desc';
  let [res, activitylist, newslist, digitals, comments] = await Promise.all([
    brand.brandDetail(ctx.params.id),
    //train.trainList('brandId:' + ctx.params.id, 0, 1),
    activity.activityList('onlineStatus:Published,brandId:' + ctx.params.id, 0, -1,'createTime~desc'),
    brand.newsList(ctx.params.id, 0, -1,sort),
    brand.digitalList(ctx.params.id, 0, -1),
    users.getComments('CultrueBrand', ctx.params.id, commentPage, config.paging.comments.size),
  ])
	
	res.favorited = false; // 是否已收藏
	// 是否已收藏
	if (ctx.session.user) {
	    let favStatus = await users.fetchUserFavoritesStatus(ctx.session.user.id, 'CultureBrand', ctx.params.id);
	    res.favorited = favStatus.status;
	}
    
  res.coverPic =assist.getFileUrl(res.coverPic);
   
  activitylist.content.forEach(function(item) {
    item.coverPic = assist.getFileUrl(item.coverPic);
    item.type = 'activity'
  })

  let fileArray = [];
  let videos=[];
  let pics=[];
  let audio=[];
  digitals.forEach(function(file) {
    file.pic = assist.getFileUrl(file.pic);
    file.file = assist.getFileUrl(file.file);
    if (file.type === 'video') videos.push(file);
    if (file.type === 'pic') pics.push(file);
    else if(file.type=='audio') audio.push(file);
  });
  activitylist.content;
  await ctx.render('brand/branddetail', {
    data: res,
    activitylist:activitylist.content,
    videos:videos,
    pics:pics,
    news: newslist,
    digital: fileArray,
    query: ctx.query,
    comments: comments
  })
})


module.exports = router