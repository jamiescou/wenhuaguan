const router = require('koa-router')()
const formData = require('form-data')
const fs = require('fs')
const path = require('path')
const fetch = require('../models/fetch')
const sys = require('../models/sys')
const cultural = require('../models/cultural')
const users = require('../models/users')
const assist = require('../util/assist')
const config = require('../config')
router.prefix('/cultural')

/**文化列表 */
router.get('/', async (ctx, next) => {
  let page = 0,
  str = 'search=isPublish:true,';
  str += ctx.query.type ? 'type:' + ctx.query.type : ''; 
  page = ctx.query.page ? ctx.query.page - 1 : 0;
  size = ctx.query.size ? ctx.query.size : 16;
  let type = "cultural"
  let res = await cultural.culturalList(str,page, size,'createTime~desc');  
  let codeType = await sys.fetchCodeTypes(type);
  res.content.forEach(function (item) {
    item.coverPic = assist.getFileUrl(item.coverPic);
    codeType.forEach(function (item1) {
      if(item.type==item1.code){
          item.type= item1.value;
      }
    })
  })
  await ctx.render('cultural/index', {
       data:res,
       code:codeType,
       query: ctx.query
  })
})
/**文化详情 */
router.get('/detail/:id', async (ctx, next) => {
   let type = "cultural"
   let commentPage = ctx.query.page ? ctx.query.page - 1 : 0;
   let detail = await cultural.culturalDetail(ctx.params.id);
   let comments =await users.getComments('supplys',ctx.params.id,commentPage,config.paging.comments.size);
   let codeType =   await sys.fetchCodeTypes(type);

  detail.favorited = false; // 是否已收藏
  // 是否已收藏
  if (ctx.session.user) {
      let favStatus = await users.fetchUserFavoritesStatus(ctx.session.user.id, 'CultureSupply', ctx.params.id);
      detail.favorited = favStatus.status;
  }
   codeType.forEach(function (item) {
      if(detail.type==item.code){
        detail.type= item.value;
      }
  })
   detail.coverPic = assist.getFileUrl(detail.coverPic); 
      await ctx.render('cultural/detail', {
            data:detail,
            comments:comments,
            query: ctx.query
      })
})


module.exports = router