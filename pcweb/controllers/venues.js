const router = require('koa-router')()
const moment = require('moment')
const sys = require('../models/sys')
const users = require('../models/users')
const assist = require('../util/assist')
const venues = require('../models/venues')
const config = require('../config')
const logUtil = require('../util/log-util')



router.prefix('/venues')

/**
 * 场馆默认首页
 */
router.get('/', async (ctx, next) => {
    
  let search = 'search=onlineStatus:Published';

  if (ctx.query.regionType) {
    let regionstr=sys.trimRegionEnd(ctx.query.regionType)+'%';
 
    let venueSearch='search=isPublish:true,region~'+regionstr;
    
     let venueLst=await venues.venuesList(venueSearch,0,-1);
    
     let venueIds=[];
     venueLst.content.forEach((item)=>venueIds.push(item.id));
       if(venueIds.length==0){venueIds=['000']}
    search += ',venue.id:' + venueIds.join('~'); // 所属文化馆
  } else {
    let regionstr=sys.trimRegionEnd(4301)+'%';
    let venueSearch='search=isPublish:true,region~' + regionstr;
   
     let venueLst=await venues.venuesList(venueSearch,0,-1);
    
     let venueIds=[];
     venueLst.content.forEach((item)=>venueIds.push(item.id));
       if(venueIds.length==0){venueIds=['000']}
    search += ',venue.id:' + venueIds.join('~'); // 所属文化馆
  }

  search += ctx.query.enable ? (search.length ? ',' : '') + 'itmDef.isEnable:true' : '';
  search += ctx.query.type ? (search.length ? ',' : '') + 'type:' + ctx.query.type : '';
  search += ctx.query.key ? (search.length ? ',' : '') + 'name~' + encodeURIComponent(ctx.query.key) : '';
  let page = ctx.query.page ? ctx.query.page - 1 : 0;
  let roomSort=ctx.topfield+'~desc,createTime~desc';
  let res = await venues.rooms(search, page, config.paging.venue.size,roomSort);
  let codetype = await sys.fetchCodeTypes('venueRoomType');
  if (res.content && res.content.length && codetype.length) {
    let content = res.content.map((item) => {
      let type = codetype.find(x => x.code === item.type);
      item.typeName = type ? type.value : '';
      return item;
    })
    res.content = content;
  }
  res.content.forEach(function(item) {
    item.coverPic = assist.getFileUrl(item.coverPic);
    item.desc = assist.formateHtmlToText(item.desc);
  })
  let regionTree = await sys.getRedisRegionTree(ctx.curUnit.region);
  await ctx.render('venues/index', {
    data: res,
    rootchildren: regionTree,
    code: codetype,
    query: ctx.query
  })
})

/**
 * 场馆订单详情
 */
router.get('/success/:id', async (ctx, next) => {
  let roomId = ctx.params.id;
  let res = await venues.roomDetail(roomId);
  let roomTypes = await sys.fetchCodeTypes('venueRoomType');
  roomTypes.forEach(function(item, index) {
    if (item.code == res.type) {
      res.type = item.value;
    }
  })
  await ctx.render('venues/success', {
    data: res,

  })
})


/**
 * 场馆类型、地域、分页过滤
 */
router.get('/:page/:size/:search', async (ctx, next) => {
  let query = {
    page: ctx.params.page,
    size: ctx.params.size,
    search: ctx.params.search
  }
  let res = await venues.venuesList(query);
  res.content.forEach(function(item) {
    item.pic = assist.getFileUrl(item.pic);
    item.desc = assist.formateHtmlToText(item.desc);
  })
  ctx.body = res;

})

/**
 * 场馆详情
 */
router.get('/venuesdetail/:id', async (ctx, next) => {
  let commentPage = ctx.query.page ? ctx.query.page - 1 : 0;
  let res = await venues.venuesDetail(ctx.params.id)
  let roomlist = await venues.roomList(ctx.params.id);
  let comments = await venues.getComments(ctx.params.id, commentPage, config.paging.comments.size);
  let report = await venues.venuesdig(ctx.params.id)
  if (report && report.length != 0) {
    report.forEach(function(item) {
      item.pic = assist.getFileUrl(item.pic);
    })
  }
  res.pic = assist.getFileUrl(res.pic);
  roomlist.content.forEach(function(item) {
    item.coverPic = assist.getFileUrl(item.coverPic);
  })

  let codetype = await sys.fetchCodeTypes('venueType');
  let codetypeDic = {};
  codetype.map(function(item) {
    codetypeDic[item.code] = item.value
  })

  res.coverPic2 = assist.getFileUrl(res.coverPic);
  res.typeName = codetypeDic[res.type];

  res.desc = assist.formateHtmlToText(res.desc);
  await ctx.render('venues/venuesdetail', {
    data: res,
    room: roomlist,
    issave: false,
    comments: comments,
    report: report
  })
})


/**
 * 活动室下单页面
 */
router.get('/booking/:id', async (ctx, next) => {
  let [res, roomItems, roomtype] = await Promise.all([
    venues.roomDetail(ctx.params.id),
    venues.roomReserveDetail(ctx.params.id),
    sys.fetchCodeTypes('venueRoomType')
  ])
  roomtype.forEach(function(item, index) {
    if (item.code == res.type) {
      res.type = item.value;
    }
  })
  res.coverPic2 = assist.getFileUrl(res.coverPic);

  let minAdvancedDay = await sys.fetchSysParams('reserveStartDays');// 提前预定天数
  let maxAdvancedDay = await sys.fetchSysParams('limitDays');  //可预订天数
  minAdvancedDay=Number.parseInt(minAdvancedDay);
  maxAdvancedDay=Number.parseInt(maxAdvancedDay);

  var weekends = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  let reserveObj = [];
  let maxItem = 4;
  for (var i =minAdvancedDay; i < maxAdvancedDay; i++) {
    let d = new Date(moment().add(i, 'd'));
    let datestr = d.getFullYear() + '-' + assist.formateDateNumber((d.getMonth() + 1)) + '-' + assist.formateDateNumber(d.getDate());
    let itm = [];
    let dnow = new Date();
    roomItems.forEach(item => {
      if (item.itmDate == datestr) {
        let itemStart = new Date(item.itmDate + ' ' + item.itmStarttime + ':00');
        let canReserve = !item.isReserve;
        if (dnow > itemStart) {
          canReserve = false;
        }
        itm.push({
          time: item.itmStarttime + '--' + item.itmEndtime,
          isReserve: !canReserve,
          date: item.itmDate
        })
      }
    })
    maxItem = itm.length > maxItem ? itm.length : maxItem;
    reserveObj.push({
      date: assist.formateDateNumber(d.getMonth() + 1) + '月' + assist.formateDateNumber(d.getDate()) + '日(' + weekends[d.getDay()] + ')',
      datestr: datestr,
      item: itm
    })
  }

  /**补全7天的整数倍 */
  let sup=maxAdvancedDay-minAdvancedDay-7>0?(7-(maxAdvancedDay-minAdvancedDay)%7):7-maxAdvancedDay+minAdvancedDay;
  
  for(let i=0;i<sup;i++){
    let d = new Date(moment().add( Number.parseInt(maxAdvancedDay+i), 'd'));
    let datestr = d.getFullYear() + '-' + assist.formateDateNumber((d.getMonth() + 1)) + '-' + assist.formateDateNumber(d.getDate());
    let itm = [];
    reserveObj.push({
      date: assist.formateDateNumber(d.getMonth() + 1) + '月' + assist.formateDateNumber(d.getDate()) + '日(' + weekends[d.getDay()] + ')',
      datestr: datestr,
      item: []
    })
  }
 
/**补全每一天的表格为maxItem行 */
  for (let j = 0; j < reserveObj.length; j++) {
    let obj = reserveObj[j];
    let count = maxItem - obj.item.length;
    if (count != 0) {
      for (let k = 0; k < count; k++) {
        obj.item.push({
          time: '--',
          isReserve: true, //已预订
          date: '--'
        })
      }
    }
  }
 
  await ctx.render('venues/booking', {
    data: res,
    reserveObj: reserveObj,
    weeks:Number.parseInt(reserveObj.length/7)
    // reservedTime: reservedTime
  })
})

/**
 * 活动室详情页面
 */
router.get('/roomdetail/:id', async (ctx, next) => {

  let commentPage = ctx.query.page ? ctx.query.page - 1 : 0;
  let [res, roomtype, comments] = await Promise.all([
    venues.roomDetail(ctx.params.id),
    sys.fetchCodeTypes('venueRoomType'),
    users.getComments('room', ctx.params.id, commentPage, config.paging.comments.size)
  ])

  roomtype.forEach(function(item, index) {
    if (item.code == res.type) {
      res.type = item.value;
    }
  })
  res.coverPic2 = assist.getFileUrl(res.coverPic);

  let favorited = false;
  if (ctx.session.user) {
    let favStatus = await users.fetchUserFavoritesStatus(ctx.session.user.id, 'VenueRoom', ctx.params.id);
    favorited = favStatus.status;
  }

await venues.addvisit(ctx.params.id);

  await ctx.render('venues/roomdetail', {
    data: res,
    favorited: favorited,
    comments: comments,
  })

})

//创建活动室订单 
router.post("/orders", async (ctx) => {
  let order = ctx.request.body;
  let user = ctx.session.user;
  Object.assign(order, {
    userId: user.id,
    nickname: user.nickname,
    cname: user.name,
    idNumber: user.idNumber,
    mobile: user.mobile,
  })
  try {
    let res = await venues.creatVenueOrder(order);
    logUtil.logbusiness([ctx.session.user.mobile,'venueOrder',order.roomId])
    ctx.body = res
  } catch (ex) {
    ctx.body = ex.response.data
  }
});

module.exports = router