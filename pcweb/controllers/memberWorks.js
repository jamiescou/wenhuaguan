const router = require('koa-router')()
const sys = require('../models/sys')
const memberWorks = require('../models/memberWorks')
const venues = require('../models/venues')
const users = require('../models/users')
const assist = require('../util/assist')
const config = require('../config')

let page = 0,
  str = '',
  size = 15;
router.prefix('/memberWorks')
/**团队列表 */
router.get('/', async (ctx, next) => {
  let page = 0,
  str = 'search=isPublish:true',
  size = 15;
  if(ctx.query.region){
    let regionstr=sys.trimRegionEnd(ctx.query.region)+'%';
    str += ',region~' +regionstr; // 所属文化馆
  }

str += ctx.query.type ? (str.length ? ',' : '') + 'artType:' + ctx.query.type : '';
str += ctx.query.key ? (str.length ? ',' : '') + 'name~' +encodeURIComponent(ctx.query.key) : '';
page = ctx.query.page ? ctx.query.page - 1 : 0;

let sort =ctx.topfield+'~desc,createTime~desc';
let res = await memberWorks.memberWorksList(str, page, config.paging.team.size,sort);
let codetypeclass = await sys.fetchCodeTypes('artistClass');
let regionsTree =await sys.getRedisRegionTree(ctx.curUnit.region);;

res.content.forEach(function (item) {
  item.coverPic =assist.getFileUrl(item.coverPic); 
})
await ctx.render('memberWorks/index', {
  data: res,
  code: codetypeclass,
  regions: regionsTree,
  query: ctx.query
})
})
/**团队详情 */
router.get('/teamdetail/:id', async (ctx, next) => {
  let user = ctx.session.user || null
  if (user) {
    user=JSON.parse(JSON.stringify(user));
  }
  let commentPage = ctx.query.page ? ctx.query.page - 1 : 0;
  let sort =ctx.topfield+'~desc,createTime~desc';
  let [res, comments,teams] = await Promise.all([
    memberWorks.memberWorksDetail(ctx.params.id),
    users.getComments('PhotographyMemberWorks',ctx.params.id,commentPage,config.paging.comments.size),
    memberWorks.memberWorksList('search=isPublish:true', 0, 4,sort),
  ])
  teams.content.forEach(function (item) {
    item.coverPic = assist.getFileUrl(item.coverPic); 
  })

  // let codetypeclass =  await sys.fetchCodeTypes('artistClass');
  // for(var i=0;i<codetypeclass.length;i++){
  //   for(var j=0;j<res.artType.length;j++){
  //     if(codetypeclass[i].code==res.artType[j]){
  //       res.artType[j] = codetypeclass[i].value;
  //     }
  //   }
  // }
  res.coverPic =assist.getFileUrl(res.coverPic);   
  if(res.memberWorksList&&res.memberWorksList.length!=0){
    res.memberWorksList.forEach(function (item) {
      item.coverPic =assist.getFileUrl(item.coverPic); 
    })
  }
 
  if(res.memberWorksList&&res.memberWorksList.length!=0){
    for(var i=0;i<res.memberWorksList.length;i++){
      for(var j=0;j<res.memberWorksList[i].files.length;j++){
        res.memberWorksList[i].files[j].filePath =assist.getFileUrl(res.memberWorksList[i].files[j].filePath); 
      }
    }
  }
 
  let favorited = false;
  if (ctx.session.user) {
    let favStatus = await users.fetchUserFavoritesStatus(user.id, 'PhotographyMemberWorks', ctx.params.id);
    favorited = favStatus.status;
  }
  await ctx.render('memberWorks/teamdetail', {
    data: res,
    comments: comments,
    favorited: favorited,
    teams:teams
  })
})

module.exports = router