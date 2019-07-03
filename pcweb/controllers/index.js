const router = require('koa-router')()
const sys = require('../models/sys')
const exhibition = require('../models/exhibition');
const config = require('../config')
const issue = require('../models/issue')
const test = require('../util/filter')
const vod = require('../models/vod')
const assist = require('../util/assist')
const moment = require('moment')
const adver = require('../models/adver')
const users = require('../models/users')
const activity = require('../models/activity')
const venue = require('../models/venues')
const train = require('../models/train')
const cultural = require('../models/cultural')
// const passport = require('../core/passport_config.js')
/**
 * 活动信息中需要处理的信息
 * 
 * @param {any} detailInfo  活动详情
 * @param {any} activityForm 活动类型
 * @param {any} artistClass 艺术类型
 * @returns 
 */
function convertActivity(detailInfo, activityForm, artistClass) {
    // 活动类型
    let activityTypes = [];
    if (activityForm && activityForm.length) {
        for (var j = 0; j < detailInfo.activityType.length; j++) {
            let code = activityForm.find(x => x.code === detailInfo.activityType[j]);
            if (code) {
                activityTypes.push(code.value);
            }
        }
    }

    // 艺术类型
    let artists = [];
    if (artistClass && artistClass.length) {
        for (var j = 0; j < detailInfo.artType.length; j++) {
            let code = artistClass.find(x => x.code === detailInfo.artType[j]);
            if (code) {
                artists.push(code.value);
            }
        }
    }

    detailInfo.activityType = activityTypes.join(' '); // 活动类型
    detailInfo.artType = artists.join(' '); // 艺术类型
    detailInfo.coverPic = assist.getFileUrl(detailInfo.coverPic); // 封面图片
    detailInfo.attach = assist.getFileUrl(detailInfo.attach); // 附件
    detailInfo.ticketSum = 0; // 总票数
    detailInfo.remainTicket = 0; // 剩余票数
    detailInfo.reserve = 1; // 是否预定【-3、无余票：已定完；-2、不在预定时间范围；-1、活动时间已过,活动结束； 1、正常可预订，有余票；2、直接前往】
    detailInfo.reserveMsg = '立即报名';
    detailInfo.itmDates = []; // 场次时间集合

    let nowTime = moment().format('x'); //当前时间戳
    let holdStartDate = moment(detailInfo.holdStartDate).format('x'); // 活动开始时间戳
    let holdEndDate = moment(detailInfo.holdEndDate).format('x'); // 活动结束时间戳

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
                let reserveCount = 0;
                let outTicket = 0;
                let validItms = [];
                let validDates = [];
                for (var i = 0, len = detailInfo.itms.length; i < len; i++) {
                    let itm = detailInfo.itms[i];
                    itm.remainTicket = 0;
                    let itmStart = moment(itm.itmDate + ' ' + itm.startTime).format('x');
                    if (itmStart > nowTime) {
                        let count = itm.reserveSeats ? itm.reserveSeats.length : 0;
                        itm.remainTicket = detailInfo.total - count;
                        reserveCount += count;
                        validItms.push(itm);
                        if (!validDates.some(d => d === itm.itmDate)) {
                            validDates.push(itm.itmDate); // 取出场次时间
                        }
                    } else { // 过期了的票数
                        outTicket += detailInfo.total;
                    }
                }
                detailInfo.ticketSum = detailInfo.total * detailInfo.itms.length; // 总票数
                detailInfo.remainTicket = detailInfo.ticketSum - reserveCount - outTicket; // 剩余票数
                detailInfo.itms = validItms; // 有效场次
                detailInfo.itmDates = validDates; // 场次时间
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
            detailInfo.reserve = 2; //5
            detailInfo.reserveMsg = '直接前往';
        }
    }
    return detailInfo;
}
router.get('/', async (ctx, next) => {
  let commandSearch = 'channel:home,unitId:' + ctx.curUnit.id;
  let recommands = await sys.getRecommands(commandSearch, 0, -1);
  let demand = [],
    digitalRes = [],
    news = [],
    szdtNews = [],
    columName, Notice = [];
  let actList = [];
  let venueRoom = [] ;
  let pxList = [];
  let psList = [];
  let newsSwipter = [];
  // 广告位
  let adverList = [];
  let favoritesCount = [];
  adverList = await adver.adverList();
  adverList = adverList.content;
  adverList.forEach(function(item) {
    item.coverPic = assist.getFileUrl(item.coverPic);
  })
  let activityForm = await sys.fetchCodeTypes('activityForm');
  let artistClass = await sys.fetchCodeTypes('artistClass');
  let sortType = ctx.query.sortType;
 
  for (var i = 0; i < recommands.content.length; i++) {
    let ids = recommands.content[i].ids.join('~');
    if (recommands.content[i].ids.length == 0) {
      ids = '0000'
    }
    let sort = ctx.topfield + '~desc,publishTime~desc';
    switch (recommands.content[i].code) {
      case 'PublicStage':
        {
          demand = await vod.demandsList("search=id:" + ids, 0, 3);
          demand.content.sort(function(a, b) {
            return recommands.content[i].ids.indexOf(a.id) > recommands.content[i].ids.indexOf(b.id)
          })
          demand.content.forEach(function(item) {
            item.coverPic = assist.getFileUrl(item.coverPic);
            item.path = item.dramas && item.dramas.length != 0 ? assist.getFileUrl(item.dramas[0].file) : ""
          })
          demand = demand.content;
          break;
        }
      case 'Notice':
        {
          columName = recommands.content[i].name;
          // 市州动态资讯
          Notice = await issue.newslist("search=id:" + ids, 0, -1, sort);
          Notice.content.sort(function(a, b) {
            return recommands.content[i].ids.indexOf(a.id) > recommands.content[i].ids.indexOf(b.id)
          })
          Notice = Notice.content;
          if (Notice.length) {
            Notice.forEach(function(item) {
              item.publishTime = moment(item.publishTime).format('YYYY.MM.DD');
            })
          }
          break;
        }
      case 'OnlineExhibition':
        {
          // 数字展览
          digitalRes = await exhibition.digitalList("search=id:" + ids, 0, -1);

          digitalRes.content.sort(function(a, b) {
            return recommands.content[i].ids.indexOf(a.id) > recommands.content[i].ids.indexOf(b.id)
          })

          for(let item of digitalRes.content){
            item.coverPic = assist.getFileUrl(item.coverPic);
            item.favoriteCount = (await users.favoritesCount('DigitalShow',item.id)).favoriteCount;
          }
          digitalRes = digitalRes.content;

          if (digitalRes.length>6) {
            digitalRes = digitalRes.slice(0,7);
          }else{
             digitalRes = digitalRes;
          }
         
          break;
        }
      case 'CityDynamic':
        {
          // 资讯
          news = await issue.newslist("search=id:" + ids, 0, -1, sort);
          news.content.sort(function(a, b) {
            return recommands.content[i].ids.indexOf(a.id) > recommands.content[i].ids.indexOf(b.id)
          })
          news = news.content;
          if (news.length) {
            news.forEach(function(item) {
              item.coverPic = assist.getFileUrl(item.coverPic);
              item.publishTime = moment(item.publishTime).format('YYYY.MM.DD');
            })
          }
          // if (news.length > 4) {
          //   newsSwipter = news.slice(0, 4);
          //   news = news.slice(4);
          // } else {
          //   newsSwipter = news;
          // }
          newsSwipter = news;
         
          break;
        }
      case 'Activity':
        {
          //活动预约
          actList = await activity.activityList("onlineStatus:Published,id:" + ids, 0, -1, sort);
          
          actList.content.sort(function(a, b) {
            return recommands.content[i].ids.indexOf(a.id) > recommands.content[i].ids.indexOf(b.id)
          })
           if (actList.content.length) {
            actList.content.forEach(function(item) {
                item = convertActivity(item, activityForm, artistClass);
                item.coverPic = assist.getFileUrl(item.coverPic);
            })
            if (sortType == 'canenroll') { //可报名,排除不可预定的活动
                actList.content = actList.content.filter(x => x.reserve === 1);
            }
          }
          actList = actList.content;
          if (actList.length>6) {
           actList = actList.slice(0,7);
          }else{
             actList = actList;
          }
          break;
        }
      case 'Venue':
        {
          //场馆预订
          let venueList = await venue.venuesList("search=isPublish:true,id:" + ids, 0, -1);
          let venueIds=[];
          venueList.content.sort(function(a, b) {
            return recommands.content[i].ids.indexOf(a.id) > recommands.content[i].ids.indexOf(b.id)
          })
          venueList.content.forEach((item)=>venueIds.push(item.id));
          venueRoom = await venue.rooms("search=venue.id:" +  ids, 0, -1, sort);

          venueRoom.content.forEach(function(item) {
            item.coverPic = assist.getFileUrl(item.coverPic);
            item.enableName = item.itmDef.isEnable ? '可预订' : '不可预订';
            item.desc = assist.formateHtmlToText(item.desc);
          })
          if (venueRoom.content.length>6) {
           venueRoom = venueRoom.content.slice(0,7);
          }else{
             venueRoom = venueRoom.content;
          }
          break;
        }
      case 'Train':
        {
          //培训报名
          pxList = await train.trainList("search=onlineStatus:Published,id:" + ids, 0, -1, sort);
          pxList.content.sort(function(a, b) {
            return recommands.content[i].ids.indexOf(a.id) > recommands.content[i].ids.indexOf(b.id)
          })
          pxList.content.forEach(function(item) {
            item.coverPic = assist.getFileUrl(item.picture);
            let dateNow = new Date();
            let startDate = new Date(item.enrolStartTime);
            let endDate = new Date(item.enrolEndTime);
            if (dateNow > endDate) {
              item.canEnroll = false;
              item.tag = '报名结束'
            } else if (dateNow < startDate) {
              item.canEnroll = false;
              item.tag = '报名未开始'
            } else if (item.allLimitPeoples == item.enrollSum) {
              item.canEnroll = false;
              item.tag = '名额已满'
            } else {
              item.canEnroll = true;
              item.tag = '名额余' + (item.allLimitPeoples - item.enrollSum) + '人'
            }
          })
          if (pxList.content.length>6) {
           pxList = pxList.content.slice(0,7);
          }else{
             pxList = pxList.content;
          }
          break;
        }
      case 'CultureSupply':
      {
        //文化配送
        psList = await cultural.culturalList("search=isPublish:true,id:" + ids, 0, -1, sort);
        psList.content.sort(function(a, b) {
          return recommands.content[i].ids.indexOf(a.id) > recommands.content[i].ids.indexOf(b.id)
        })
        psList.content.forEach(function (item) {
          item.coverPic = assist.getFileUrl(item.coverPic);
        })
        if (psList.content.length>6) {
         psList = psList.content.slice(0,7);
        }else{
           psList = psList.content;
        }
      }
    }
  }
  // 轮播
  let type = "pcIndex"
  let figure = await sys.fetchfigure(type);
  figure.forEach(function(item) {
    item.coverPic = assist.getFileUrl(item.coverPic);
  })
  await ctx.render('index', {
    demand: demand,
    digitalRes: digitalRes,
    figure: figure,
    news: news,
    Notice: Notice,
    columName: columName,
    szdtNews: szdtNews,
    newsSwipter: newsSwipter,
    adverList: adverList,
    data: actList,
    activityType: activityForm,
    artistClass: artistClass,
    venueRoom: venueRoom,
    pxList: pxList,
    psList: psList,
  })
})

router.get('/example', async (ctx) => {
  await ctx.render('example', {})
})

router.get('/text', async (ctx) => {
  await ctx.render('text', {})
})

router.get('/gjs', async (ctx) => {
  await ctx.render('gjs', {})
})
/**
 * 上传文件
 */
router.post('/uploadfile', async (ctx, next) => {

  let fileInfo = ctx.request.body;
  let response;
  try {
    response = await sys.saveFile(fileInfo.files.file);
    let filePath = assist.getFileUrl(response.url);

    ctx.body = {
      "code": "0",
      "res": response.url, //文件相对地址
      filePath: filePath, //文件全路径，图片可能需要预览
      fileName: fileInfo.files.file.name //文件名称
    }
  } catch (error) {
    response = error.response ? error.response : "文件上传失败";
    ctx.body = {
      "code": "1",
      "res": response
    }
  }
})





module.exports = router