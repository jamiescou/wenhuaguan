const router = require('koa-router')()
const activity = require('../models/activity')
const news = require('../models/issue')
const users = require('../models/users')
const search = require('../models/search')
const assist = require('../util/assist')
const config = require('../config')
let page = 0,
  str = '',
  size = 15;
router.prefix('/search')
//首页搜索
router.get('/', async (ctx, next) => {
   
        let searchInfo = encodeURIComponent(ctx.query.srchkey);
        searchInfo = searchInfo? searchInfo:'';
        let page = ctx.query.page ? ctx.query.page - 1 : 0;
        let res = await search.search('search='+searchInfo+'&unitId='+ctx.curUnit.id,page,5); 
        await ctx.render('search/index', {
                data:res,
                searchInfo:ctx.query.srchkey,
                query: ctx.query
        })   
})
module.exports = router  