const router = require('koa-router')()
const magazine = require('../models/magazine')
const users = require('../models/users')
const assist = require('../util/assist')
const moment = require('moment')
const index = require('../models/sys')
const config = require('../config')

router.prefix('/magazine')


/**杂志列表 */
router.get('/', async (ctx, next) => {

  let res = await magazine.magazineList(0, -1);
  let issues=[]
  for (let i = 0; i < res.content.length; i++) {
     issues = await magazine.magazineIssues(res.content[i].id);
    issues.content.forEach(function (item) {
      item.coverPic = assist.getFileUrl(item.coverPic);
    })
    res.content[i].issues = issues.length > 3 ? issues.slice(0, 3) : issues
  }
  await ctx.render('magazine/index', {
    data: res,
    issues:issues
  })
})


/**查看期刊内容 */
router.get('/issueview/:magazineId/:issuesId', async (ctx, next) => {
    let magazineId = ctx.params.magazineId;
    let issuesId = ctx.params.issuesId;
    let _magazine = await magazine.magazineDetail(magazineId);
    let res;
    try {
        res = await magazine.magazineIssuesContent(magazineId, issuesId);
        res = res.map(function (item) {
            return assist.getFileUrl(item);
        })
    } catch (error) {
        ctx.status = 200;
        res = error.response.data;
    }
   
  await ctx.render('magazine/issueview', {
    data: res,
    magazine: _magazine
  })

})

/**期刊列表 */
router.get('/issueslist/:id', async (ctx, next) => {
  let magazineId = ctx.params.id;
  let year = new Date().getFullYear();
  let years = [];
  for (let i = 0; i < 5; i++) { //需要修改
    years.push({
      value: (year - i) + '年',
      code: year - i
    })
  }
  let syear = ctx.query.year || year;
  let search = 'year:' + syear;
  let res = await magazine.magazineIssues(magazineId, search);
  res.content.forEach(function (item) {
    item.coverPic =assist.getFileUrl(item.coverPic);
  })
  await ctx.render('magazine/issueslist', {
    years: years,
    data: res,
    magazineId: magazineId,
    query: ctx.request.query
  })

})
/**用户投稿流程 */
router.get("/booking/:id", async(ctx) => {
    let magazineId = ctx.params.id;
    let res = await magazine.magazineDetail(magazineId);
    await ctx.render('magazine/booking',{
        data:res
    })
});

/**用户投稿 */
router.post("/order", async(ctx) => {
    let orderInfo = ctx.request.body;
    let user = ctx.session.user;
    var activeTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss'); //'YYYY-MM-DD'
    Object.assign(orderInfo, { userId: user.id, commitTime: activeTime });
    let res;
    try {
        res = await magazine.addContribution(orderInfo);
    } catch (error) {
        ctx.status = 200;
        res = error.response.data;
    }
    ctx.body = res;
});

/**文件上传*/
router.post('/file', async(ctx, next) => {
    let imgInfo = ctx.request.body;
    let response = await index.saveFile(imgInfo.files.fileAddress);
    let url = response.url;
    ctx.body = url;
})

module.exports = router