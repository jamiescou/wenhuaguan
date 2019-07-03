const router = require('koa-router')()
const abouts = require('../models/about')


router.prefix('/about')



router.get('/gwgk', async (ctx, next) => {
  await ctx.render('about/gwgk', {})
})

router.get('/bzjs', async (ctx, next) => {
  await ctx.render('about/bzjs', {})
})
router.get('/contactUs', async (ctx, next) => {
  await ctx.render('about/contactUs', {})
})

router.get('/yjfk', async (ctx, next) => {

  let search = 'isReply:true';
  let page = ctx.query.page ? ctx.query.page - 1 : 0;
  let size = 5;
  let sort = 'lastModifiedTime~desc';
  let res = await abouts.getSuggestion(search, page, size, sort);
  await ctx.render('about/yjfk', {
    data: res
  })
})

router.post('/suggestions', async (ctx, next) => {
  let res = {
    success: false,
    msg: ''
  }
  try {
    let data = ctx.request.body;
    //Object.assign(data, ctx.curUnit.id);

    let rep = abouts.postSuggestion(data);
    res = {
      success: true,
      msg: '提交成功'
    }
  } catch (ex) {
    res = {
      success: false,
      msg: '提交失败'
    }
  }

  ctx.body = res;
})


router.get('/wzdt', async (ctx, next) => {
  await ctx.render('about/wzdt', {})
})

router.get('/whgjq', async (ctx, next) => {
  await ctx.render('about/whgjq', {})
})

router.get('/zzjg', async (ctx, next) => {
  await ctx.render('about/zzjg', {})
})



module.exports = router