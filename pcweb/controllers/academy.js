const router = require('koa-router')()
const academy = require('../models/academy')
const users = require('../models/users')
const assist = require('../util/assist')
const venues=require('../models/venues')
const config = require('../config')
const news=require('../models/issue')
 
router.prefix('/academy')
/**学会列表 */
router.get('/', async (ctx, next) => {
  let academyInfo = await academy.academyList('',0,1);

  
  let queryItems = ctx.query;
  let topid;
  let childColumns;
  let childid = ctx.query.column;
  // enable:true
  let allColumn = await news.getColumns('', 0, -1);
  allColumn.content.forEach(function (item) {
    if(item.name==config.column.academy){
      topid = item.id;
    }
  })
  if(topid){
      childColumns = await news.getColumns('parent.id:'+topid, 0, -1);
      childid = !childid && childColumns.content.length ? childColumns.content[0].id : childid;
  }else{
      childColumns = [];
  }
  if (ctx.query.column==undefined && childColumns.length!=0) {
    queryItems.column =  childColumns.content[0].id;
  }
  let str = queryItems.column ? 'search=column.id:' + queryItems.column+',isPublish:true'  : '';
  let page = queryItems.page ? queryItems.page - 1 : 0;
  let size = queryItems.size ? queryItems.size : 5;
  let sort=ctx.topfield+'~desc,publishTime~desc';
  let res = await news.newslist(str, page, size,sort)

  res.content.forEach(function (item) {
    item.coverPic2 = item.coverPic && item.coverPic !== '' ?  assist.getFileUrl(item.coverPic) : null;
  })

  
  await ctx.render('academy/index', {
    data: res,
    childColumns: childColumns.content,
    query: queryItems,
    childid:childid,
    academy:academyInfo.content[0]
  })

})


/**学会下所有专业委员会 */
router.get('/divisions/:id', async (ctx, next) => { 
  let academyId=ctx.params.id;
  let academyInfo=await academy.academyDetail(academyId);
  academyInfo.coverPic =  assist.getFileUrl(academyInfo.coverPic);
  let  divisions=await academy.academyDivisionsList(academyId);
  divisions.forEach(function (item) {
    item.coverPic =  assist.getFileUrl(item.coverPic);
  })

  await ctx.render('academy/divisions', {
    data:academyInfo,
    divisions:divisions
  })

})
/**专业委员会详情 */
router.get('/divisionsdetail/:academyId/:divisionId', async (ctx, next) => {
  let academyId=ctx.params.academyId;
  let divisionId=ctx.params.divisionId;
  let res= await academy.academyDivisionsDetail(academyId,divisionId); 
  res.coverPic =  assist.getFileUrl(res.coverPic);
  await ctx.render('academy/divisionsdetail', {
      data:res
  })
})


/**
 * 学会章程
 */
router.get('/regulations',async(ctx,next)=>{
  await ctx.render('academy/regulations', { 
  })
})


/**
 * 学会简介
 */
router.get('/brief',async(ctx,next)=>{
  await ctx.render('academy/brief', { 
  })
})

 
/**
 * 理事会成员
 */
router.get('/board',async(ctx,next)=>{
  await ctx.render('academy/board', { 
  })
})


module.exports = router