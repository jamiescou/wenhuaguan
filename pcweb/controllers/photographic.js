 const router = require('koa-router')()

 router.prefix('/photographic')
 router.get('/xhjj', async (ctx, next) => {
  await ctx.render('photographic/xhjj', {})
})
// router.get('/xhjj', async (ctx, next) => {
//   await ctx.render('photographic/xhjj', {})
// })
router.get('/gzzd', async (ctx, next) => {
  await ctx.render('photographic/gzzd', {})
})
router.get('/zzjg', async (ctx, next) => {
  await ctx.render('photographic/zzjg', {})
})
router.get('/hyfw', async (ctx, next) => {
  await ctx.render('photographic/hyfw', {})
})
router.get('/contactUs', async (ctx, next) => {
  await ctx.render('photographic/contactUs', {})
})
 module.exports = router