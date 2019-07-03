 const router = require('koa-router')()
 const formData = require('form-data')
 const fs = require('fs')
 const path = require('path')
 const fetch = require('../models/fetch')
 const sys = require('../models/sys')
 const collect = require('../models/collect')
 const users = require('../models/users')
 const assist = require('../util/assist')
 const config = require('../config')
 const moment = require('moment')
 const logUtil = require('../util/log-util')

 router.prefix('/collect')
 /**征集活动列表 */
 router.get('/', async (ctx, next) => {
  let regionstr =sys.trimRegionEnd(ctx.curUnit.unitRegion.code) + '%';
  let searchCondition = ',region~' + regionstr;

  let allCultCenter = await sys.fetchunitlist('region~' + searchCondition); // 根据区域获取文化馆
  if (allCultCenter.content.length) {
    unitid = allCultCenter.content.map((x) => {
      return x.id;
    }).join('~');
  }
   let search = 'search=onlineStatus:Published,unitId:'+unitid;
   page = ctx.query.page ? ctx.query.page - 1 : 0;
   let res = await collect.collectList(search, page, config.paging.collect.size);
   for (let i = 0; i < res.content.length; i++) {
     let item = res.content[i];
     item.coverPic = assist.getFileUrl(item.coverPic);

     let works = await collect.workList('isPass:true,activity.id:' + item.id, 0, -1);
     item.worksCount = works.content.length;

     let dateNow = new Date();
     let startDate = new Date(item.startTime);
     let endDate = new Date(item.endTime);
     if (dateNow > endDate) {
       item.tag = '已结束'
     } else if (dateNow < startDate) {
       item.tag = '未开始'
     } else {
       item.tag = '进行中'
     }
     item.endTime = item.endTime.substr(0, 16);
   }

   await ctx.render('collect/index', {
     data: res,
     query: ctx.query
   })
 })




 /**征集活动详情 */
 router.get('/collectdetail/:id', async (ctx, next) => {
   let commentPage = ctx.query.page ? ctx.query.page - 1 : 0;
   let workPage = 0;
   let search = 'isPass:true,activity.id:' + ctx.params.id;

   let [works, comments, collects] = await Promise.all([
     collect.workList(search, 0, -1),
     users.getComments('collect', ctx.params.id, commentPage, config.paging.comments.size),
     collect.collectList('search=onlineStatus:Published', 0, -1) //将所有的征集活动取出来
   ])

   let res = collects.content.filter(item => item.id == ctx.params.id); //找到当前活动

   collects.content = collects.content.filter(item => item.type == res[0].type);

   res = res[0];
   res.coverPic = assist.getFileUrl(res.coverPic);

   works.content.forEach(function(item, index) {
     let path = item.files ? item.files[0].filePath : ""
     item.coverPic = assist.getFileUrl(path);
     item.desc = assist.replaceTxtNLine(item.desc);
     item.brief = assist.replaceTxtNLine(item.brief);
   })
   collects.content.forEach(function(item, index) {
     item.coverPic = assist.getFileUrl(item.coverPic);
   })

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
   let favorited = false;
   let thumed = false;
   if (ctx.session.user) {
     let favStatus = await users.fetchUserFavoritesStatus(ctx.session.user.id, 'ArtWorks', ctx.params.id);
     let thumStatus = await users.fetchUserThumbup(ctx.session.user.id, 'ArtWorks', ctx.params.id);
     favorited = favStatus.status;
     thumed = thumStatus.status;
   }

   let newsArr = collects.content;
   let nextPage = [{}, {}]; //上一图集，下一图集

   newsArr.map(function(item, index) {
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
           nextPage[0] = {};
           nextPage[1] = newsArr[newsArr.length - 1];
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


 await collect.addvisit(ctx.params.id);
   await ctx.render('collect/collectdetail', {
     data: res,
     favorited: favorited,
     works: works,
     nextPage: nextPage,
     comments: comments,
     biglist: works
   })
 })

 /**参加作品征集 */
 router.get('/booking/:id', async (ctx, next) => {
   let [res] = await Promise.all([
     collect.collectDetail(ctx.params.id),
   ])
   res.coverPic = assist.getFileUrl(res.coverPic);
   res.endTime = res.endTime.substr(0, 16);
   res.startTime = res.startTime.substr(0, 16);
   await ctx.render('collect/booking', {
     data: res,
     activityId: ctx.params.id
   })
 })

 /**参加作品点赞 */
 router.post('/thum/:id', async (ctx) => {
   let id = ctx.params.id
   let userid = ctx.session.user.id
   try {
     let vote = await collect.thumUpload(id, userid);
     ctx.body = vote
   } catch (ex) {
     ctx.body = ex.response.data
   }
 })

 /**作品上传 */
 router.post('/order/:id', async (ctx, next) => {
   let activityId = ctx.params.id;
   let workInfo = ctx.request.body;

   let url = ctx.request.body.fields.inputfile;
   let workObj = {
     "title": workInfo.fields.title,
     "activity": {
       "id": activityId,
     },
     "user": {
       "id": ctx.session.user.id
     },
     "brief": workInfo.fields.content,
     "files": [{
       "fileType": "pic",
       "filePath": url
     }],
     "isPass": ""
   }
   try {
     let resupload = await collect.workUpload(workObj);
     logUtil.logbusiness([ctx.session.user.mobile,'uploadWorks',activityId]);
     ctx.redirect('/collect/success/' + ctx.params.id);
   } catch (ex) {

   }
 })
 /**
  * 参赛成功
  */
 router.get('/success/:id', async (ctx) => {
   let res = await collect.collectDetail(ctx.params.id);
   res.coverPic = assist.getFileUrl(res.coverPic);

   await ctx.render('collect/success', {
     data: res,
     activityId: ctx.params.id
   })

 })


 /*********************************线下征集活动相关接口****************************************************** */

 /**
  * 线下活动作品征集
  */
 router.get('/offlineAct', async (ctx, next) => {

   // 根据传入的区域，获取该区域下的文化馆
   let regionstr = sys.trimRegionEnd(ctx.curUnit.unitRegion.code) + '%';
   let searchCondition = ',region~' + regionstr;

   let allCultCenter = await sys.fetchunitlist('region~' + searchCondition); // 根据区域获取文化馆
   if (allCultCenter.content.length) {
     unitid = allCultCenter.content.map((x) => {
       return x.id;
     }).join('~');
   }

   let search = 'isPublished:true,isDisabled:false,unitId:' + unitid;
   let page = ctx.query.page ? ctx.query.page - 1 : 0;
   let res = await collect.assistActLst(search, page, config.paging.collect.size, 'createTime~desc');

   for (let i = 0; i < res.content.length; i++) {
     let item = res.content[i];
     item.coverPic = assist.getFileUrl(item.coverPic);
     let works = await collect.actWorkLst(item.id, '', 0, -1, 'createDate~desc');
     item.worksCount = works.length;
     let dateNow = new Date();
     let startDate = new Date(item.startDate);
     let endDate = new Date(item.endDate);
     if (dateNow > endDate) {
       item.tag = '已结束'
     } else if (dateNow < startDate) {
       item.tag = '未开始'
     } else {
       item.tag = '进行中'
     }
     item.endTime = item.endDate.substr(0, 16);
   }
   await ctx.render('collect/offlineAct', {
     data: res,
     query: ctx.query
   })
 })

 /**线下征集活动详情 */
 router.get('/offlineActDetail/:id', async (ctx, next) => {
     await collect.addvisitOl(ctx.params.id);

   let res = await collect.assistActDetail(ctx.params.id);
   res.coverPic = assist.getFileUrl(res.coverPic);
   let types = await sys.fetchCodeTypes('assistProjectType');
   types.forEach((item) => {
     if (item.code == res.type) {
       res.typeName = item.value;
     }
   })
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


   await ctx.render('collect/offlineAct_detail', {
     data: res
   })
 })

 /**
  * 线下活动作品上报
  */
 router.get('/offlineAct/work/:id', async (ctx, next) => {
   let res = await collect.assistActDetail(ctx.params.id);
   res.coverPic = assist.getFileUrl(res.coverPic);
   let artcategory = await sys.fetchCodeTypes('artcategory');
   let renderUrl = res.type == 'stageArts' ? 'collect/stage_work' : 'collect/exhibition_work';
   await ctx.render(renderUrl, {
     data: res,
     actId: ctx.params.id,
     artcategory: artcategory
   })

 })
 /**
  * 线下活动作品上传
  */
 router.post('/offlineAct/work', async (ctx, next) => {
   let worksObj = ctx.request.body;
   Object.assign(worksObj, {
     unitId: ctx.curUnit.id,
     userId: ctx.session.user.id,
     createTime: moment().format('YYYY-MM-DD HH:mm:ss')
   });
   let res = await collect.subActWorkSheet(worksObj);
   logUtil.logbusiness([ctx.session.user.mobile,'uploadOfflineWorks',worksObj.activityId]);
   ctx.body = res;

 })


 module.exports = router