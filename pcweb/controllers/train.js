const router = require('koa-router')()
const moment = require('moment')
const sys = require('../models/sys')
const train = require('../models/train')
const assist = require('../util/assist')
const users = require('../models/users')
const config = require('../config')
const logUtil = require('../util/log-util')
router.prefix('/train')

let page = 0,
  str = '',
  size = 15;

router.get('/', async (ctx, next) => {
  let str = 'search=onlineStatus:Published';
  if (ctx.query.regionType) {
    let regionstr=sys.trimRegionEnd(ctx.query.regionType)+'%';
    str += ',region~' +regionstr; // 所属文化馆
  }

  str += ctx.query.artType ? (str.length ? ',' : '') + 'artType:' + ctx.query.artType : '';
  str += ctx.query.traType ? (str.length ? ',' : '') + 'traType:' + ctx.query.traType : '';
  str += ctx.query.key ? (str.length ? ',' : '') + 'title~' + encodeURIComponent(ctx.query.key) : '';
  let page = ctx.query.page ? ctx.query.page - 1 : 0;
  let dateNowFull = moment().format('YYYY-MM-DD HH:mm:ss');
  let dateNowShort = moment().format('YYYY-MM-DD');
  let sortType = ctx.query.sortType ? ctx.query.sortType : 'default';
  let sort =  ctx.topfield+'~desc,createTime~desc';
  
  let time = ctx.query.time;
  var stime, etime;
  if (time) {
      stime = time.split('~')[0].trim();
      etime = time.split('~')[1].trim();
      stime = moment(stime).add(-1, 'days').format('YYYY-MM-DD');

      if (etime == 'Invalid date') {
          etime = moment(stime).add(2, 'days').format('YYYY-MM-DD');
      }else{
          etime = moment(etime).add(1, 'days').format('YYYY-MM-DD');
      }
     
  }
  if (sortType == 'default' || !sortType) { //智能排序
    if (time) {
        str += ',startDate>' + stime;
        str += ',startDate<' + etime;
    }
  } else if (sortType == 'canenroll') { //可报名
    str += (str.length ? ',' : '') + 'enrolEndTime>' + dateNowFull + ',' + 'enrolStartTime<' + dateNowFull;
    if (time) {
        str += ',startDate>' + stime;
        str += ',startDate<' + etime;
    }
    sort = ctx.topfield+'~desc,enrolStartTime~asc';
  } else if (sortType == 'notstart') { //即将开始
    str += (str.length ? ',' : '') + 'startDate>' + dateNowShort;
    if (time) {
        str += ',startDate>' + stime;
        str += ',startDate<' + etime;
    }
    sort = ctx.topfield+'~desc,enrolStartTime~asc';
  } else if (sortType == 'closure') { //已结束
    if (time) {
        str += ',endDate<' + stime;
        str += ',startDate>' + etime;
    }else{
        str += (str.length ? ',' : '') + 'endDate<' + dateNowShort;
    }
  }
  let res = await train.trainList(str, page, config.paging.train.size, sort);
  let artists = await sys.fetchCodeTypes('artistClass');
  let regionTree = await sys.getRedisRegionTree(ctx.curUnit.region);;
  res.content.forEach(function(item) {
    item.picture = assist.getFileUrl(item.picture);
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
  if (sortType == 'canenroll') {
    res.content = res.content.filter(item => {
      return item.canEnroll;
    })
  }
  await ctx.render('train/index', {
    data: res,
    artists: artists,
    rootchildren: regionTree,
    query: ctx.query
  })
})

router.get('/detail/:id', async (ctx, next) => {
  let user = ctx.session.user || null
  if (user) {
    user = JSON.parse(JSON.stringify(user));
  }
  let commentPage = ctx.query.page ? ctx.query.page - 1 : 0;
  let sort = 'isTop~desc,startDate~desc';
  let str = 'search=onlineStatus:Published,isTop:1';
  let [res, comments, clsinfo, tjres] = await Promise.all([
    train.trainDetail(ctx.params.id),
    users.getComments('train', ctx.params.id, commentPage, config.paging.comments.size),
    train.trainClsInfo(ctx.params.id),
    train.trainList(str, 0, 4, sort)
  ])
  res.picture = assist.getFileUrl(res.picture);
  res.attachment = assist.getFileUrl(res.attachment);
  if (tjres.content && tjres.content.length != 0) {
    tjres.content.forEach(function(item) {
      item.picture = assist.getFileUrl(item.picture);
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
  }
  let clsObj = {};
  clsinfo.forEach(function(item) {
    if (!clsObj[item.itmDate]) {
      clsObj[item.itmDate] = [];
    }
    clsObj[item.itmDate].push(item.startTime + '--' + item.endTime);
  })
  let favorited = false;
  if (ctx.session.user) {
    let favStatus = await users.fetchUserFavoritesStatus(ctx.session.user.id, 'Train', ctx.params.id);
    favorited = favStatus.status;
  }

  /**
   * 是否可以预定
   */
  let dateNow = new Date();
  let startDate = new Date(res.enrolStartTime);
  let endDate = new Date(res.enrolEndTime);
  if (dateNow > endDate) {
    res.canbooking = false;
    res.tag = '报名结束'
  } else if (dateNow < startDate) {
    res.canbooking = false;
    res.tag = '报名未开始'
  } else if (res.allLimitPeoples == res.enrollSum) {
    res.canbooking = false;
    res.tag = '名额已满'
  } else {
    res.canbooking = true;
    res.tag = '名额余' + (res.allLimitPeoples - res.enrollSum) + '人'
  }
  let conditions = [];
  if (res.condition !== null && res.condition.length > 0) {
    for (var i = 0; i < res.condition.length; i++) {
      let condition = res.condition[i];
      if (condition.type === 'age' && condition.value !== null) {
        conditions.push('年龄【' + condition.value.replace(',', '岁 - ') + '岁】');
      }
      if (condition.type === 'sex' && condition.value !== null) {
        let sex = condition.value;
        switch (sex) {
          case 'male':
            sex = '限男性';
            break;
          case 'female':
            sex = '限女性';
            break;
          default:
            sex = '不限';
            break;
        }
        conditions.push('性别【' + sex + '】');
      }
    }
    res.condition = conditions;
  } else {
    res.condition = null;
  }
await train.addvisit(ctx.params.id);

  await ctx.render('train/detail', {
    data: res,
    comments: comments,
    clsObj: clsObj,
    tjdata: tjres,
    favorited: favorited
  })
})

/**
 * 培训报名
 */
router.get('/booking/:id', async (ctx, next) => {
  let [res, clsinfo] = await Promise.all([
    train.trainDetail(ctx.params.id),
    train.trainClsInfo(ctx.params.id)
  ])

  let clsObj = {};
  clsinfo.forEach(function(item) {
    if (!clsObj[item.itmDate]) {
      clsObj[item.itmDate] = [];
    }
    clsObj[item.itmDate].push(item.startTime + '--' + item.endTime);
  })
  let user = ctx.session.user || null
  if (user) {
    user = JSON.parse(JSON.stringify(user));
  }
  //获取当前用户的培训订单
  let search ='trainId:' + ctx.params.id + ',orderStatus:Success~WaitAudit';
  let orders = await train.getOrder(search, 0, -1);
  let enrolledMember = [];
  for(let i=0;i<orders.content.length;i++){
     enrolledMember= enrolledMember.concat(orders.content[i].enrolUsers);
     
  }
  
  let limits = {
    sex: 'Unlimited',
    maxAge: 200,
    minAge: 0,
  }

  let conditions = [];
  if (res.condition !== null && res.condition.length > 0) {
    for (var i = 0; i < res.condition.length; i++) {
      let condition = res.condition[i];
      if (condition.type === 'age' && condition.value !== null) {
        conditions.push('年龄【' + condition.value.replace(',', '岁 - ') + '岁】');
        limits.maxAge = condition.value.split(',')[1];
        limits.minAge = condition.value.split(',')[0];
      }
      if (condition.type === 'sex' && condition.value !== null) {
        let sex = condition.value;
        limits.sex = sex;
        switch (sex) {
          case 'male':
            sex = '限男性';
            break;
          case 'female':
            sex = '限女性';
            break;
          default:
            sex = '不限';
            break;
        }
        conditions.push('性别【' + sex + '】');
      }
    }
    res.condition = conditions;
  }

  let members = await users.fetchcontact(user.id);
  let relations = {
    'parent': '父母',
    'friend': '朋友',
    'children': '子女',
    'mate': '夫妻',
    'self': '本人'
  }
  members = members ? members : [];
  members.push({
    "name": user.name,
    "idNumber": user.idNumber,
    "sex": user.sex,
    "birthday": user.birthday,
    "identifyStatus": user.identifyStatus,
    "mobile": user.mobile,
    "relation": "self",

  })
 
  let enrolledIds = enrolledMember.map(x => x.idnumber);

  if (members && members.length) {
    members = members.map((x) => {

      x.relation = relations[x.relation];
      x.limited = true;
      x.msg = '';

      let baseInfo = assist.getBirthday(x.idNumber);
      if ((enrolledIds.indexOf(x.idNumber) < 0) && (limits.sex == 'Unlimited' || baseInfo.sexstr == limits.sex) && (baseInfo.age > limits.minAge && baseInfo.age < limits.maxAge)) {
        x.limited = false;
      } else {
        if (limits.sex != 'Unlimited' && baseInfo.sexstr != limits.sex) {
          x.msg += ' 性别不符'
        }
        if (baseInfo.age < limits.minAge || baseInfo.age > limits.maxAge) {
          x.msg += ' 年龄不符'
        }
        if (enrolledIds.indexOf(x.idNumber) >= 0) {
          x.msg += '已报名'
        }
      }

      // let IDNum =sys.getDecAse192(x.idNumber, 'szwhg');
      // x.idNumber = IDNum.replace(/^(.{4})(.*)(.{4})$/, "$1********$3");
      return x;
    })
  }
  res.picture = assist.getFileUrl(res.picture);
  res.attachment = assist.getFileUrl(res.attachment);
  await ctx.render('train/booking', {
    data: res,
    clsObj: clsObj,
    contact: members || [],
    userinfo: user
  })
})

/**
 * 培训订单提交
 */
router.post('/order', async (ctx, next) => {
  var data = ctx.request.body;
  let res = '';
  try {
    res = await train.trainOrder(data);
    logUtil.logbusiness([ctx.session.user.mobile,'trainEnroll',data.trainId])
  } catch (ex) {
   
  }
  ctx.body = {
    data: res
  }
})

module.exports = router