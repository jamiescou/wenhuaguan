const router = require('koa-router')()
const sys = require('../models/sys')
const volunteer = require('../models/volunteer')
const assist = require('../util/assist')
const users = require('../models/users')
const config = require('../config')
const venues = require('../models/venues')
const logUtil = require('../util/log-util')
router.prefix('/volunteer')

/**
 * 志愿者主页面
 */
router.get('/', async (ctx, next) => {
    let user = ctx.session.user || null;
    let search = 'isPublish:true';
    let page = ctx.query.page ? ctx.query.page - 1 : 0;
    search = 'search=' + search;
    let res = await volunteer.fetchVolunList(search, page, config.paging.volunrecruit.size);
    res.content.forEach(function(item) {
        item.coverPic = assist.getFileUrl(item.coverPic);
    })
    // 轮播
    let type = "pcVolunteer"
    let figure = await sys.fetchfigure(type);
        figure.forEach(function(item) {
        item.coverPic = assist.getFileUrl(item.coverPic);
    });

    await ctx.render('volunteer/index', {
        data: res,
        figure:figure
    })
})

/**
 * 志愿者团队列表
 */
router.get('/teamlist', async (ctx, next) => {
    let search = 'isPublish:true';
    let page = ctx.query.page ? ctx.query.page - 1 : 0;
    search = 'search=' + search;
    let res = await volunteer.fetchVolunteamsList(search, page, config.paging.volunrecruit.size);
    res.content.forEach(function(item) {
        item.coverPic = assist.getFileUrl(item.coverPic);
    })
    await ctx.render('volunteer/teamlist', {
        data: res,
    })
})

/**文件上传*/
router.post('/file', async (ctx, next) => {
    let imgInfo = ctx.request.body;
    let response = await sys.saveFile(imgInfo.files.avatar);
    let url = response.url;
    ctx.body = url;
})

/**
 * 志愿者活动详情
 */
router.get('/recruitdetail/:id', async (ctx, next) => {
    let commentPage = ctx.query.page ? ctx.query.page - 1 : 0;
    let res = await volunteer.fetchVolunteerDetail(ctx.params.id);
    let comments = await users.getComments('volunrecruit', ctx.params.id, commentPage, config.paging.comments.size);
    res.coverPic = assist.getFileUrl(res.coverPic);
    res.attach = assist.getFileUrl(res.attach);
    let favorited = false;
    let enrolled = "";

    if (ctx.session.user) {
        let favStatus = await users.fetchUserFavoritesStatus(ctx.session.user.id, 'VolunteerRecruit', ctx.params.id);
        favorited = favStatus.status;
        let search = 'userId:' + ctx.session.user.id + ',recruitId:' + ctx.params.id + ',isPass:null~true';
        let recruitList = await volunteer.getRecruitjoinapplys(search, 0, -1);
        recruitList.content.forEach(function(item) {
            enrolled += item.type
        })
    }
    let codetype = await sys.fetchCodeTypes('volunteerServiceType');
    for (let i = 0; i < codetype.length; i++) {
        for (let j = 0; j < res.serviceTypes.length; j++) {
            if (codetype[i].code == res.serviceTypes[j]) {
                res.serviceTypes[j] = codetype[i].value
            }
        }
    }
    if (res.digits && res.digits.length) {
        res.digits.forEach(function(file) {
            file.pic = assist.getFileUrl(file.pic);
            file.file = assist.getFileUrl(file.file);
        })
    }

    await ctx.render('volunteer/recruitdetail', {
        data: res,
        enrolled: enrolled,
        comments: comments,
        favorited: favorited
    })
})

/**
 * 是否能报名志愿者
 */
router.post('/canbook/:id', async (ctx, next) => {
    let volunteerInfo = await volunteer.volunrecruitInfo('idNumber:' + ctx.session.user.idNumber, 0, -1);
    let res = {};
    if (volunteerInfo.content.length == 0) {
        res = {
            success: false,
            message: '必须是志愿者，才能报名'
        }
        ctx.body = res;
    } else {
        let res = await volunteer.isbook(ctx.params.id)
        let status = true;
        let message = ''
        res.content.forEach(function(item) {
            if (item.volunteer.user.id == ctx.session.user.id) {
                status = false;
                message = '已经报名'
                return status;
            }
        })
        res = {
            success: status,
            message: message
        }
        ctx.body = res;
    }

})

router.get('/newvolunteerinfo', async (ctx, next) => {
    let user = ctx.session.user || null;
    if (user) {
        user = JSON.parse(JSON.stringify(user));
    }
    let res = await volunteer.volunrecruitInfo('idNumber:' + ctx.session.user.idNumber, 0, -1);
    let query = "add";
    let regions = await venues.getAllChildRegionList(config.defaultRegion.code);
    let regionObj = {};
    regions.forEach(function(item) {
        if (item.parent.code == config.defaultRegion.code && !regionObj[item.name]) //市
        {
            regionObj[item.name] = [];
        } else if (!regionObj[item.parent.name]) {
            regionObj[item.parent.name] = [];
        } else {
            regionObj[item.parent.name].push({
                name: item.name,
                value: item.code
            });
        }
    });
    let occupation = await sys.fetchCodeTypes('occupation');
    let education = await sys.fetchCodeTypes('education');
    let political = await sys.fetchCodeTypes('political');
    await ctx.render('volunteer/newvolunteerinfo', {
        regionObj: regionObj,
        data: user,
        occupation: occupation,
        education: education,
        political: political,
        query: query
    })
})

router.get('/editvolunteerinfo', async (ctx, next) => {
    let res = await volunteer.volunrecruitInfo('idNumber:' + ctx.session.user.idNumber, 0, -1);
    let query = ctx.query.type;
    let userinfo = res.content[0].user;
    let city = res.content[0].address;
    citys = city.split("市");
    res.content[0].city = citys[0] + "市";
    res.content[0].area = citys[1];
    let regions = await venues.getAllChildRegionList(config.defaultRegion.code);
    let regionObj = {};
    regions.forEach(function(item) {
        if (item.parent.code == config.defaultRegion.code && !regionObj[item.name]) //市
        {
            regionObj[item.name] = [];
        } else if (!regionObj[item.parent.name]) {
            regionObj[item.parent.name] = [];
        } else {
            regionObj[item.parent.name].push({
                name: item.name,
                value: item.code
            });
        }
    });
    let occupation = await sys.fetchCodeTypes('occupation');
    let education = await sys.fetchCodeTypes('education');

    let political = await sys.fetchCodeTypes('political');

    await ctx.render('volunteer/editvolunteerinfo', {
        data: res.content[0],
        userinfo: userinfo,
        regionObj: regionObj,
        occupation: occupation,
        education: education,
        political: political,
        query: query
    })

})

//编辑志愿者
router.post('/editvolunteerinfo/:id', async (ctx, next) => {
    let userInfo = ctx.request.body;
    let res = await volunteer.editVolunrecruit(ctx.params.id, userInfo);
    ctx.body = res;

})

/**
 * 报名志愿者
 */
router.post('/enroll', async (ctx, next) => {
    let userInfo = ctx.request.body;
    let user = ctx.session.user || null;

    userInfo.userId = user.id;
    userInfo.idNumber = user.idNumber;
    userInfo.serviceTypes = userInfo.serviceTypes.split(',');
    userInfo.unitId = ctx.curUnit.id;

    try {
        let res = await volunteer.volunrecruitOrder(userInfo);
        ctx.body = res;
        logUtil.logbusiness([ctx.session.user.mobile, 'volunteerEnroll', userInfo.type])
    } catch (ex) {
        ctx.body = ex.response.data;
    }

})

router.get('/enrollsuccess', async (ctx, next) => {
    await ctx.render('volunteer/enrollsuccess')
})

/**
 * 志愿者/团队
 */
router.get('/booking/:id', async (ctx, next) => {
  
    let type = ctx.params.id == "personal" ? "personal" : "team";
    let serviceTypes = await sys.fetchCodeTypes("volunteerServiceType");
    let education = await sys.fetchCodeTypes("education");
    let occupation = await sys.fetchCodeTypes("occupation");
    let politicalStatus = await sys.fetchCodeTypes("political");
    await ctx.render('volunteer/booking', {
        type: type,
        serviceTypes: serviceTypes,
        education: education,
        occupation: occupation,
        politicalStatus: politicalStatus
    })
})

/**
 * 报名志愿者活动
 * 需要考虑如下情况：
 *     1、当前志愿者的身份与志愿者活动要求的身份不符；
 *     2、志愿者和活动均允许多重身份
 *     3、志愿者已经以一种身份报名了活动
 * 
 */
router.get('/bookingact/:id', async (ctx, next) => {
    let user = ctx.session.user || null;
    let itemId = ctx.params.id;
    let userInfo = await volunteer.volunrecruitInfo('idNumber:' + ctx.session.user.idNumber, 0, -1);
    let res = await volunteer.fetchVolunteerDetail(itemId);
    if (res) {
        res.coverPic = assist.getFileUrl(res.coverPic);
    }

    let canEnroll = false;

    var flag = false; //是否可以报名
    var msg = '您尚未成为志愿者';
    let volunteerInfo = {};
    let search = 'userId:' + ctx.session.user.id + ',recruitId:' + ctx.params.id + ',isPass:null~true';
    let recruitList = await volunteer.getRecruitjoinapplys(search, 0, -1); //已报名的列表
    if (res.permitSubject.length == 2 && user.roles.length == 2) {
        flag = true;

        // if (recruitList.content.filter(item => item.type == 'team').length == 0) //没有以团队身份报名
        // {
        volunteerInfo.team = userInfo.content[0].type == 'team' ? userInfo.content[0] : userInfo.content[1]
        // }
        // if (recruitList.content.filter(item => item.type == 'personal').length == 0) //没有以个人身份报名
        // {
        volunteerInfo.personal = userInfo.content[0].type == 'personal' ? userInfo.content[0] : userInfo.content[1]
        // }

    } else if (res.permitSubject.length == 2 && user.roles.length == 1) { //此情况，肯定可以报名(不能报名的情况在上一个页面已经过滤掉了)
        flag = true;
        volunteerInfo = userInfo.content[0]
    } else if (res.permitSubject.length == 1 && user.roles.length == 1) { //个人和团队均只有一种身份，需要每个情况考虑
        var userRole = user.roles[0];
        if (res.permitSubject[0] == 'team' && userRole == 'volunteerTeam') {
            flag = true;
            volunteerInfo = userInfo.content[0]

        } else if (res.permitSubject[0] == 'personal' && userRole == 'volunteerPersonal') {
            flag = true;
            volunteerInfo = userInfo.content[0]

        } else if (res.permitSubject[0] == 'team' && userRole == 'volunteerPersonal') {
            flag = false;
            msg = '团队志愿者方可报名'
        } else if (res.permitSubject[0] == 'personal' && userRole == 'volunteerTeam') {
            flag = false;
            msg = '个人志愿者方可报名'
        }
    } else if (res.permitSubject.length == 1 && user.roles.length == 2) {
        flag = true;
        volunteerInfo = userInfo.content.filter(item => item.type == res.permitSubject[0])
        volunteerInfo = volunteerInfo[0]
    }

    await ctx.render('volunteer/bookingact', {
        data: res,
        volunteerInfo: {
            volunteerInfo: volunteerInfo,
            flag: flag,
            msg: msg
        },
        userinfo: userInfo
    })
})

/**
 * 报名志愿者活动流程
 */
router.get('/bookingact/:id/:type', async (ctx, next) => {

    let user = ctx.session.user || null;
    let itemId = ctx.params.id;
    let type = ctx.params.type;

    let serviceTypes = await sys.fetchCodeTypes("volunteerServiceType");
    let education = await sys.fetchCodeTypes("education");
    let occupation = await sys.fetchCodeTypes("occupation");
    let politicalStatus = await sys.fetchCodeTypes("political");

    if (user) {
        user = JSON.parse(JSON.stringify(user));
    }
    let userInfo = await volunteer.volunrecruitInfo('idNumber:' + ctx.session.user.idNumber + ',type:' + type, 0, -1);
    if (userInfo && userInfo.content.length) {
        userInfo = userInfo.content[0];
        userInfo.serviceTypesStr = '';
        if (userInfo.serviceTypes) {
            for (var i = 0; i < userInfo.serviceTypes.length; i++) {
                serviceTypes.forEach(function(itm) {
                    if (itm.code == userInfo.serviceTypes[i]) {
                        userInfo.serviceTypesStr += itm.value
                    }
                })
            }
        }
    }
    let res = await volunteer.fetchVolunteerDetail(itemId);
    if (res) {
        res.coverPic = assist.getFileUrl(res.coverPic);
    }

    res.desc = '';
    await ctx.render('volunteer/bookingact', {
        serviceTypes: serviceTypes,
        education: education,
        occupation: occupation,
        politicalStatus: politicalStatus,
        data: res,
        userInfo: userInfo,
        type: type
    })
})

/**
 * 活动报名
 */
router.post('/actOrder', async (ctx, next) => {
    let userInfo = ctx.request.body;
    let user = ctx.session.user || {};

    let volInfo = await volunteer.volunrecruitInfo('idNumber:' + user.idNumber + ',type:' + userInfo.type, 0, -1);
    if (volInfo && volInfo.content.length) {
        volInfo = volInfo.content[0];
    }
    userInfo.volunteerName = volInfo.name;
    userInfo.userId = user.id;
    userInfo.idNumber = user.idNumber;
    try {
        let res = await volunteer.joinactivity(userInfo);
        ctx.body = res;
        logUtil.logbusiness([ctx.session.user.mobile,'volunteerActEnroll',userInfo.recruitId])
    } catch (ex) {

        ctx.body = ex.response.data
    }
})

//报名参加志愿者活动
router.post('/order/:id', async (ctx, next) => {
    let userInfo = ctx.request.body;
    let user = ctx.session.user || null;
    if (user) {
        user = JSON.parse(JSON.stringify(user));
    }
    userInfo.userId = user.id;
    userInfo.idNumber = user.idNumber;

    try {
        let res = await volunteer.joinactivity(userInfo);
        ctx.body = res;
    } catch (ex) {

        ctx.body = ex.response.data
    }
})

router.get("/ordersuccess/:id", async (ctx) => {
    let type = ctx.query.type;
    let res = {}
    if (type == 'recruit') {
        res = await volunteer.fetchVolunrecruitDetail(ctx.params.id);
        res.coverPic = assist.getFileUrl(res.coverPic);
    } else {
        res = await volunteer.fetchVolunteamsDetail(ctx.params.id);
        res.coverPic = assist.getFileUrl(res.coverPic);
    }
    await ctx.render('volunteer/ordersuccess', {
        data: res,
    })
});
module.exports = router
