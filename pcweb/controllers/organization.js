const router = require('koa-router')()
const organization = require('../models/organization')
const team = require('../models/team')
const sys = require('../models/sys')
const moment = require('moment')
const issue = require('../models/issue')
const assist = require('../util/assist')
const config = require('../config')
router.prefix('/organization')

/**群团列表 */
router.get('/', async (ctx, next) => {
  
  let search = 'isPublish:true';
  let query = ctx.query;
  if (query.key) {
    search += ',name~' + encodeURIComponent(query.key); // 所属文化馆
  }
  if (query.region) {
    let regionstr=sys.trimRegionEnd(query.region)+'%';
    search += ',region~' + regionstr;  
  }
  let page = query.page ? query.page - 1 : 0;
  let sort='createTime~desc';
  let res = await organization.massorgList(search, page, config.paging.masorg.size,sort);
  if (res.content.length > 0) {
    res.content.forEach(function(item) {
      item.coverPic = assist.getFileUrl(item.coverPic);
    })
  }
  let regionsTree =await sys.getRedisRegionTree(ctx.curUnit.region);;
  await ctx.render('organization/index', {
    data: res,
    regions: regionsTree,
    query: query
  })
})

/**群团详情 */
router.get('/detail/:id', async (ctx, next) => { 
  let commentPage = ctx.query.page ? ctx.query.page - 1 : 0;
  let sort =ctx.topfield+'~desc,createTime~desc';
  let [res,styles, recommandsTeam] = await Promise.all([
    organization.massorgDetail(ctx.params.id),
    organization.massorgStyles(ctx.params.id,'isPublish:true',0,-1,'createTime~desc'),
    team.teamList('search=isPublish:true', 0, 4,sort)
  ])
  res.coverPic =assist.getFileUrl(res.coverPic);
  for(let i=0;i<styles.length;i++){
      let style=styles[i];
      style.files.forEach(item=>{item.filePath=assist.getFileUrl(item.filePath)})
  }
  recommandsTeam.content.forEach(function (item) {
    item.coverPic =assist.getFileUrl(item.coverPic); 
  })
  await ctx.render('organization/masorgdetail', {
    data: res,
    recommandsTeam:recommandsTeam,
    styles:styles
  })
 
})
//年审
router.get('/learnannual',async(ctx,next)=>{
  let sort='createTime~desc';
  let res = await organization.massorgList('', 0, -1,sort);
  await ctx.render('organization/learnannual', {
    data: res,
  })
})

//上传年审
 router.post('/learnannual',async(ctx,nex)=>{
   try{
  let info=ctx.request.body;
  Object.assign(info,{
    unitId:ctx.curUnit.id
  })
  let res='';
   //先判断重复年审
  let year=(new Date()).getFullYear();
  let d1=year+'-01-01 '+'00:00:00';
  let d2=(year+1)+'-01-01 '+'00:00:00';
  let search='masOrgId:'+info.masOrgId+',createTime>'+d1+',createTime<'+d2;
  let learnannualLst=await organization.masorglearnannuallst(search,0,-1);
  if(learnannualLst.totalElements>0){
    let rep=await organization.modifymasorglearnannual(learnannualLst.content[0].id,info);
    if(rep==''){
      res={
        success:true
      }
    }
  }else{
     res=await organization.masorglearnannual(info);
     if(res.id){
      res={
        success:true
      }
     }
  }
  ctx.body=res;
}catch(ex){

}
 })

/**群团资讯 */
router.get('/masorgNews', async (ctx, next) => { 
  let queryItems = ctx.query;
  let topid;
  let childid;
  let topColumns = [];
  let childColumns = [];
  let columnId = queryItems.column;
  let allColumn = await issue.getColumns('enable:true,channel:orgdynamic', 0, -1);
  allColumn = allColumn.content;
  if (!allColumn.length) {
    return ctx.render('organization/masorgNews', {
      data: {},
      query: ctx.query,
      topColumns: topColumns,
      childColumns: childColumns
    });
  }
  topColumns = allColumn.filter(x => x.parent === null);

  let searchConditions = 'search=column.channel:orgdynamic,isPublish:true'; // 默认搜索
  if (columnId) {
    searchConditions = 'search=isPublish:true,column.id:' + columnId;
    // 当前的一级栏目，二级栏目
    let column = allColumn.find(x => x.id === columnId);
    if (column) {
      if (column.parent) { // 当前搜索的是二级栏目
        topid = column.parent.id;
        childid = columnId;
      } else {
        topid = columnId; // 当前搜索的是一级栏目
      }
      childColumns = allColumn.filter(x => x.parent && x.parent.id === topid); // 一级栏目下的二级栏目
    }
  }

  let page = queryItems.page ? queryItems.page - 1 : 0;
  let size = queryItems.size ? queryItems.size : 10;
  let sort=ctx.topfield+'~desc,publishTime~desc';
  let res = await issue.newslist(searchConditions, page, size,sort);
  res.content.forEach(function(item) {
    item.coverPic2 = item.coverPic && item.coverPic !== '' ? assist.getFileUrl(item.coverPic) : null;
    item.date = moment(item.publishTime).format('YYYY-MM-DD');
  })

  await ctx.render('organization/masorgNews', {
    data: res,
    topColumns: topColumns,
    childColumns: childColumns,
    query: queryItems,
    topid: topid,
    childid: childid
  })
})



module.exports = router