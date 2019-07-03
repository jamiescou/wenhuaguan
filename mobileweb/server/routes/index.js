const koaRouter = require('koa-router')
const sysApi = require('../api/sys')
const issueApi = require('../api/issue')
const vodApi = require('../api/vod')
const exhibitionApi = require('../api/exhibition')
const activityApi = require('../api/activity')
const venueApi = require('../api/venues')
const trainApi = require('../api/train')
const userApi = require('../api/user')
const { getFileUrl, getFullAddress } = require('../api/util')

const moment = require('moment')
moment.locale('zh-cn');

const router = new koaRouter()

/**
 * 活动信息中需要处理的信息
 *
 * @param {any} detailInfo  活动详情
 * @param {any} user 登录用户信息
 * @returns
 */
async function convertActivity(detailInfo, user) {
  detailInfo.coverPic = getFileUrl(detailInfo.coverPic); // 封面图片
  detailInfo.attach = getFileUrl(detailInfo.attach); // 附件
  detailInfo.ticketSum = 0; // 总票数
  detailInfo.remainTicket = 0; // 剩余票数
  detailInfo.reserve = 1; // 是否预定【-3、无余票：已定完；-2、不在预定时间范围；-1、活动时间已过,活动结束； 1、正常：剩票数；2、直接前往】
  detailInfo.reserveMsg = '立即报名';
  detailInfo.favorited = false; // 是否收藏
  detailInfo.favoritieId = null; // 收藏id
  let region = await sysApi.getRegion(detailInfo.region);
  detailInfo.address = getFullAddress(region, detailInfo.address)
  detailInfo.signRemain = {
    day: null,
    hour: null,
    minute: null
  };

  // 是否收藏
  if (user && user.id !== '') {
    let hasFavorite = await userApi.hasFavorite(user.id, 'Activity', detailInfo.id);
    detailInfo.favorited = hasFavorite.status;
    detailInfo.favoritieId = detailInfo.id;
  }

  let nowTime = moment().format('x'); //当前时间戳
  let holdStartDate = moment(detailInfo.holdStartDate).format('x'); // 活动开始时间戳
  let holdEndDate = moment(detailInfo.holdEndDate).format('x'); // 活动结束时间戳

  // 报名剩余时间
  if(detailInfo.signEndTime) {
    let signEndTime = moment(detailInfo.signEndTime).format('x');
    let signCha = signEndTime - nowTime;
    if(signCha > 0) {
      let day = Math.floor(signCha / (1000 * 60 * 60 * 24));
      let hour = signCha - day * (1000 * 60 * 60 * 24);
      hour = Math.floor(hour / (1000 * 60 * 60));
      let minute = signCha - day * (1000 * 60 * 60 * 24) - hour * (1000 * 60 * 60);
      minute = Math.floor(minute / (1000 * 60))
      detailInfo.signRemain.day = day;
      detailInfo.signRemain.hour = hour;
      detailInfo.signRemain.minute = minute;
    }
  }

  let endTime = new Date(detailInfo.holdEndDate);
  if (detailInfo.itms && detailInfo.itms.length) {
    endTime = new Date(detailInfo.itms[0].itmDate + ' ' + detailInfo.itms[0].startTime + ':00')
    for (var i = 0; i < detailInfo.itms.length; i++) {
      let d = new Date(detailInfo.itms[i].itmDate + ' ' + detailInfo.itms[i].startTime + ':00');
      endTime = endTime > d ? endTime : d;
    }
  }
  if (nowTime > endTime) {
    detailInfo.reserve = -1;
    detailInfo.reserveMsg = '活动已结束';
  } else {
    if (detailInfo.reserveType !== 'none') {
      let signStartTime = moment(detailInfo.signStartTime).format('x'); // 预定开始时间戳
      let signEndTime = moment(detailInfo.signEndTime).format('x'); // 预定结束时间戳
      // 预定时间范围内
      if (signEndTime > nowTime && nowTime > signStartTime) {
        let reserveCount = 0; // 总预定票数
        let outTicket = 0; // 过期票数
        for (var i = 0, len = detailInfo.itms.length; i < len; i++) {
          let itm = detailInfo.itms[i];
          itm.itmDateTime = moment(itm.itmDate).format('YYYY.MM.DD ') + itm.startTime + '-' + itm.endTime;
          itm.content = moment(itm.itmDate).format('YYYY.MM.DD (ddd)') + '    ' + itm.startTime + '-' + itm.endTime;
          itm.remainTicket = 0;
          itm.overDue = false;
          let itmStart = moment(itm.itmDate + ' ' + itm.startTime).format('x');
          if (itmStart > nowTime) {
            let count = itm.reserveSeats ? itm.reserveSeats.length : 0;
            itm.remainTicket = detailInfo.total - count;
            itm.remainTicketName = itm.remainTicket === 0 ? '已订完' : itm.remainTicket + '张';
            reserveCount += count;
          } else { // 场次过期了
            outTicket += detailInfo.total;
            itm.remainTicketName = '已结束';
            itm.overDue = true;
          }

          itm.content += '    ' + itm.remainTicketName;
        }
        detailInfo.ticketSum = detailInfo.total * detailInfo.itms.length; // 总票数
        detailInfo.remainTicket = detailInfo.ticketSum - reserveCount - outTicket; // 剩余票数
        if (detailInfo.remainTicket <= 0) {
          detailInfo.reserve = -3;
          detailInfo.reserveMsg = '已订完';
        }
      } else {
        //  不在预定时间范围
        detailInfo.reserve = -2;
        if (nowTime < signStartTime) {
          detailInfo.reserveMsg = '即将开始';
        } else {
          detailInfo.reserveMsg = '报名结束';
        }
      }
    } else {
      detailInfo.reserve = 2;
      detailInfo.reserveMsg = '直接前往';
    }
  }
  return detailInfo;
}

/**
 * 活动信息中需要处理的信息
 * 
 * @param {any} detailInfo  活动详情
 * @param {any} user 登录用户信息
 * @returns 
 */
async function convertTrain(detailInfo, user) {
    detailInfo.picture = getFileUrl(detailInfo.picture); // 封面图片
    detailInfo.attachment = getFileUrl(detailInfo.attachment); // 附件
    detailInfo.remain = 0; // 剩余名额
    detailInfo.reserve = 1; // 是否预定【-3、报名人数已满；-2、报名时间还未开始；-1报名时间已过； 1、正常：剩余报名人数】
    detailInfo.reserveMsg = '立即报名';
    detailInfo.favorited = false; // 是否收藏
    detailInfo.favoritieId = null; // 收藏id
    let region = await sysApi.getRegion(detailInfo.region);
    detailInfo.address = getFullAddress(region, detailInfo.address)
    detailInfo.signRemain = {
      day: null,
      hour: null,
      minute: null
    };

    // 是否收藏
    if (user && user.id !== '') {
        let hasFavorite = await userApi.hasFavorite(user.id, 'Train', detailInfo.id);
        detailInfo.favorited = hasFavorite.status;
        detailInfo.favoritieId = detailInfo.id;
    }

    let nowTime = moment().format('x'); //当前时间戳
    let startDate = moment(detailInfo.enrolStartTime).format('x'); // 报名开始时间戳
    let endDate = moment(detailInfo.enrolEndTime).format('x'); // 报名结束时间戳
    let trainEndDate = moment(detailInfo.endDate).format('x'); // 报名结束时间戳


    // 报名剩余时间
    if(detailInfo.enrolEndTime) {
      let signEndTime = moment(detailInfo.enrolEndTime).format('x');
      let signCha = signEndTime - nowTime;
      if(signCha > 0) {
        let day = Math.floor(signCha / (1000 * 60 * 60 * 24));
        let hour = signCha - day * (1000 * 60 * 60 * 24);
        hour = Math.floor(hour / (1000 * 60 * 60));
        let minute = signCha - day * (1000 * 60 * 60 * 24) - hour * (1000 * 60 * 60);
        minute = Math.floor(minute / (1000 * 60))
        detailInfo.signRemain.day = day;
        detailInfo.signRemain.hour = hour;
        detailInfo.signRemain.minute = minute;
      }
    }

    if(nowTime>trainEndDate){
        detailInfo.reserve = -4;
        detailInfo.reserveMsg = '培训结束';
    }
    else if (nowTime > endDate) {
        detailInfo.reserve = -1;
        detailInfo.reserveMsg = '报名结束';
    } else if (nowTime < startDate) {
        detailInfo.reserve = -2;
        detailInfo.reserveMsg = '报名未开始';
    } else if (detailInfo.allLimitPeoples <= detailInfo.enrollSum) {
        detailInfo.reserve = -3;
        detailInfo.reserveMsg = '名额已满';
    } 
    else {
        detailInfo.reserve = 1;
        detailInfo.remain = detailInfo.allLimitPeoples - detailInfo.enrollSum;
    }
    detailInfo.enrolStartTime = moment(detailInfo.enrolStartTime).format('YYYY.MM.DD HH:mm');
    detailInfo.enrolEndTime = moment(detailInfo.enrolEndTime).format('YYYY.MM.DD HH:mm');
    detailInfo.startDate = moment(detailInfo.startDate).format('YYYY.MM.DD');
    detailInfo.endDate = moment(detailInfo.endDate).format('YYYY.MM.DD');
    return detailInfo;
}

router.get('/', async (ctx) => {
    let result = {
        looppic: [],
        informations: [],
        demands: [],
        exhibits: [],
        activityForm: [],
        activitys: [],
        RoomTypes: [],
        venues: [],
        artists: [],
        trains: []
    }
    // 轮播图
    result.looppic = await sysApi.getLoopPics('weixinIndex');
    result.looppic.forEach(function(item) {
        item.coverPic = getFileUrl(item.coverPic)
    })

    let commandSearch = 'channel:home,unitId:' + ctx.curUnit.id;
    let recommands = await sysApi.getRecommands(commandSearch, 0, -1);
    recommands = recommands.content;
    // 文化资讯
    let CulturalHeadlines = recommands.find(x => x.code === 'CityDynamic')
    if (CulturalHeadlines && CulturalHeadlines.ids.length) {
        let ids = CulturalHeadlines.ids.join('~');
        let informations = await issueApi.getInformationList('id:' + ids + '&sort=publishTime~desc', 0, 3);
        informations = informations.content;
        informations.sort(function(a, b) { return CulturalHeadlines.ids.indexOf(a.id) > CulturalHeadlines.ids.indexOf(b.id) })
        if (informations && informations.length) {
            informations.forEach(function(item) {
                item.coverPic = getFileUrl(item.coverPic);
                item.publishTime = moment(item.publishTime).fromNow()
            })
            result.informations = informations;
        }
    }

    // 百姓舞台（点播）
    let PublicStage = recommands.find(x => x.code === 'PublicStage')
    if (PublicStage && PublicStage.ids.length) {
        let ids = PublicStage.ids.join('~');
        let demands = await vodApi.demandsList('id:' + ids, 0, -1);
        console.log('demandsdemandsdemands===========================================>>>', PublicStage)
        demands = demands.content;
        demands.sort(function(a, b) { return PublicStage.ids.indexOf(a.id) > PublicStage.ids.indexOf(b.id) });
        if (demands && demands.length) {
            demands.forEach(function(item) {
                item.coverPic = getFileUrl(item.coverPic);
                item.createTime = moment(item.createTime).format('YYYY-MM-DD');
            })
            result.demands = demands;
        }
    }
    
    
    // 数字展览
    let OnlineExhibition = recommands.find(x => x.code === 'OnlineExhibition')
    if (OnlineExhibition && OnlineExhibition.ids.length) {
        let ids = OnlineExhibition.ids.join('~');
        let exhibits = await exhibitionApi.digitalList('search=id:' + ids, 0, 2);
        exhibits = exhibits.content;
        exhibits.sort(function(a, b) { return OnlineExhibition.ids.indexOf(a.id) > OnlineExhibition.ids.indexOf(b.id) })
        if (exhibits.length) {
            exhibits.forEach(function(item) {
                item.coverPic = getFileUrl(item.coverPic);
            })
            result.exhibits = exhibits;
        }
    }

    /** 活动 类型\区域 */
    let activityForm = await sysApi.getDict('activityForm');
    activityForm.splice(0, 0, { code: 'all', value: '全部' });
    result.activityForm = activityForm;
    
    //活动预约
    let Activity = recommands.find(x => x.code === 'Activity')
    if (Activity && Activity.ids.length) {
      let ids = Activity.ids.join('~');
      // sort = ctx.topfield + '~desc,publishTime~desc';

      let res = await activityApi.getActivityList('onlineStatus:Published,id:' + ids, 0, 4);
      console.log('re====================================================>>>>', res)
      res.content.sort(function(a, b) { return Activity.ids.indexOf(a.id) > Activity.ids.indexOf(b.id) })
      if (res.content.length) {
        for (let i = 0; i < res.content.length; i++) {
          let actObj = await convertActivity(res.content[i], ctx.session.user);
          res.content[i] = {
            id: actObj.id,
            name: actObj.name,
            coverPic: actObj.coverPic,
            reserve: actObj.reserve,
            reserveMsg: actObj.reserveMsg,
            ticketSum: actObj.ticketSum,
            remainTicket: actObj.remainTicket,
            activityType: actObj.activityType,
            holdStartDate: actObj.holdStartDate,
            holdEndDate: actObj.holdEndDate,
            address: actObj.address,
            signRemain: actObj.signRemain
          }
        }
        result.activitys = res.content;
      }

    }

    /** 场馆 类型\区域 */
    let RoomTypes = [];
    RoomTypes = await sysApi.getDict('venueRoomType');
    RoomTypes.splice(0, 0, { code: 'all', value: '全部' });
    result.RoomTypes = RoomTypes;
    //文化场馆
    let venue = recommands.find(x => x.code === 'Venue')
    if (venue && venue.ids.length) {
      let ids = venue.ids.join('~');
      let venueLst = await venueApi.getVenueList('isPublish:true,id:' + ids, 0, -1);
      if(venueLst.content.length > 0) {
        let venueIds = [];
        venueLst.content.forEach((item) => venueIds.push(item.id));
        let res = await venueApi.getRoomsList('venue.id:' + venueIds.join('~'), 0, 4);
        if (res.content.length) {
          for (let i = 0; i < res.content.length; i++) {
              let item = res.content[i];
              item.coverPic = getFileUrl(item.coverPic);
              item.enableName = item.itmDef.isEnable ? '可预订' : '不可预订';
          }
          result.venues = res.content;
        }
      }
      
    }

    /** 培训 类型\区域 */
    let artists = [];
    artists = await sysApi.getDict('artistClass');
    artists.splice(0, 0, { code: 'all', value: '全部' });
    result.artists = artists;
    //培训报名
    let Train = recommands.find(x => x.code === 'Train')
    if (Train && Train.ids.length) {
      let ids = Train.ids.join('~');
      let res = await trainApi.getTrainList('onlineStatus:Published,id:' + ids, 0, 4);
      res.content.sort(function (a, b) {
        return Train.ids.indexOf(a.id) > Train.ids.indexOf(b.id)
      });
      if (res.content.length) {
        for (let i = 0; i < res.content.length; i++) {
            let trainInfo = await convertTrain(res.content[i], ctx.session.user);
            res.content[i] = {
                id: trainInfo.id,
                title: trainInfo.title,
                picture: trainInfo.picture,
                artType: trainInfo.artType,
                address: trainInfo.address,
                enrolStartTime: trainInfo.enrolStartTime,
                enrolEndTime: trainInfo.enrolEndTime,
                allLimitPeoples: trainInfo.allLimitPeoples,
                userLimitPeoples: trainInfo.userLimitPeoples,
                remain: trainInfo.remain,
                reserveMsg: trainInfo.reserveMsg,
                reserve: trainInfo.reserve,
                favorited: trainInfo.favorited,
                favoritieId: trainInfo.favoritieId,
                signRemain: trainInfo.signRemain
            }
        }
        result.trains = res.content;
      }
    }

    //文化配送
    // let CultureSupply = recommands.find(x => x.code === 'CultureSupply')

    ctx.body = result

})

// 区域信息
router.get('/regions', async (ctx) => {
    let regionsTree = [];
    regionsTree = await sysApi.getRedisRegionTree(ctx.curUnit.region); //  当前文化馆的区域范围
    regionsTree.splice(0, 0, { code: 'all', value: '全部' });
    ctx.body = regionsTree
});

// 评论类型
const COMMENT_TYPE = {
    'activity': 'Activity', // 活动
    'train': 'Train', // 培训
    'information': 'Information', // 资讯
    'team': 'ArtTeam', // 文化团队
    'collect': 'ArtWorks', // 征集作品
    'talent': 'ArtTalent', // 文艺人才
    'exhibition': 'DigitalShow', // 数字展览
    'supply': 'CultureSupply', // 文化配送
    'brand': 'CultureBrand', // 文化品牌
    'project': 'heritageDirectory', // 非遗名录
    'successor': 'heritageSuccessor', // 传承人
    'protection': 'heritageProtectArea', // 非遗保护区
    'venue': 'Venue', // 场馆
    'venueroom': 'VenueRoom', // 场馆活动室
    'volunteer': 'VolunteerRecruit', // 招募活动
    'live': 'LiveVideos', // 直播
    'demand': 'Demands', // 录播
    'opus': 'ArtOpus ' // 艺术作品
};

// 评论
router.get('/comments/:type/:objId/:page', async (ctx) => {
    let type = COMMENT_TYPE[ctx.params.type];
    let objId = ctx.params.objId;
    let query = ctx.query;
    let page = ctx.params.page || 0;
    let size = query.size || 10;
    let res = await sysApi.getComments(type, objId, page, size);

    // 评论用户头像
    if (res.content.length) {
        let userIds = [];
        let ids = res.content.map(x => x.userId);
        // 同一个人多次评论减少请求次数
        userIds = ids.filter(function(item, index, self) {
            return self.indexOf(item) === index;
        });
        let userData = await sysApi.getUsers('id:' + userIds.join('~'), 0, -1);
        userData = userData.content;
        res.content.forEach(function(item) {
            item.pic = '';
            let user = userData.find(x => x.id === item.userId);
            if (user) {
                item.pic = getFileUrl(user.pic);
            }

            item.time = moment(item.time).format('YYYY.MM.DD HH:mm');
        })
    }

    ctx.body = res;
});

// 用户评论  
router.post("/comment", async (ctx) => {
    let content = ctx.request.body;
    let user = ctx.session.user;
    if (user) {
        let userId = user.id;
        Object.assign(content, {
            userId: userId,
            nickname: user.nickname,
            unitId: ctx.curUnit.id
        })

        content.type = COMMENT_TYPE[content.type];
        let status = await sysApi.postComment(userId, content);
        ctx.body = status;
    } else {
        ctx.body = { error: '用户信息已过期，请重新登录' }
    }
});

/**全站搜索 */
router.get('/searchlist/:page', async (ctx, next) => {
    let page = ctx.params.page || 0;
    let searchInfo = encodeURIComponent(ctx.query.srchkey);
    searchInfo = searchInfo ? searchInfo : '';
    let res = await sysApi.searchList('search=' + searchInfo + '&unitId=' + ctx.curUnit.id, page, 10);
    ctx.body = res;
})

module.exports = router;
