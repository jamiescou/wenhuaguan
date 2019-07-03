const koaRouter = require('koa-router')
const sysApi = require('../api/sys')
const trainApi = require('../api/train')
const userApi = require('../api/user')
const { getFileUrl, IDENTIFY_STATUS, SEX, RELATION, getFullAddress } = require('../api/util')
const { getBirthday } = require('../../util/GetBirthdayAndSex')
const { orderBy, trimEnd} = require('lodash')
 
const router = new koaRouter()

const moment = require('moment')
moment.locale('zh-cn');

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

// 获取培训列表
router.get('/trains/:page', async (ctx) => {
    let page = ctx.params.page || 0;
    let query = ctx.query;

    // 查询条件
    let searchCondition = 'onlineStatus:Published'; // 已发布
    // 根据传入的区域，获取该区域下的文化馆(包括子级馆)
    if (query && query.regionType && query.regionType !== 'all') {
        let regionstr= sysApi.trimRegionEnd(ctx.query.regionType)+'%';
        searchCondition += ',region~' +regionstr; 
    }
    if (query && query.type && query.type !== 'all') { // 培训类型
        searchCondition += ',artType:' + query.type;
    }
    // 排序
    let dateNowFull = moment().format('YYYY-MM-DD hh:mm:ss');
    let dateNowShort = moment().format('YYYY-MM-DD');
    let sort = '&sort=' + ctx.topfield + '~desc,createTime~desc';
    if (query && query.sort && query.sort !== 'all') {
        if (query.sort === '1') {
            // 可报名
            searchCondition += ',enrolEndTime>' + dateNowFull + ',' + 'enrolStartTime<' + dateNowFull;
            sort = '&sort=' + ctx.topfield + '~desc,enrolStartTime~asc';
        } else if (query.sort === '2') {
            // 即将开始
            searchCondition += ',startDate>' + dateNowShort;
            sort = '&sort=' + ctx.topfield + '~desc,startDate~asc';
        } else if (query.sort === '3') {
            // 已结束
            searchCondition += ',endDate<' + dateNowShort;
            sort = '&sort=' + ctx.topfield + '~desc,endDate~desc';
        }
    }

    let res = await trainApi.getTrainList(searchCondition + sort, page, 3);
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
                favoritieId: trainInfo.favoritieId
            }
        }
    }
    ctx.body = res;
});

/** 类型 */
router.get('/trainDicts', async (ctx) => {
    let artists = [];
    artists = await sysApi.getDict('artistClass');
    artists.splice(0, 0, { code: 'all', value: '全部' });
    ctx.body = {
        artists: artists
    }
});

// 培训详情
router.get('/train/detail/:id', async (ctx, next) => {
	
	// 浏览量+1
	await trainApi.addvisitTrain(ctx.params.id);
	
    let res = await trainApi.getTrainInfo(ctx.params.id);



    if (res) {
        res = await convertTrain(res, ctx.session.user);
        res.limitsStr = '';
        res.limits = {};
        let condition = res.condition;
        if (condition && condition.length) {
            let conditionStr = [];
            let limits = {};
            condition.forEach(item => {
                if (item.type === 'age' && item.value !== null) {
                    let age = item.value.split(',');
                    limits.maxAge = age[1] || null;
                    limits.minAge = age[0] || null;
                    if (limits.minAge && limits.maxAge) {
                        conditionStr.push('报名年龄在' + limits.minAge + '岁 - ' + limits.maxAge + '岁之间');
                    } else if (limits.minAge && !limits.maxAge) {
                        conditionStr.push('报名年龄在' + limits.maxAge + '岁及以下');
                    } else if (!limits.minAge && limits.maxAge) {
                        conditionStr.push('报名年龄在' + limits.minAge + '岁及以上');
                    }
                }

                if (item.type === 'sex' && item.value !== null) {
                    switch (item.value) {
                        case 'male':
                            conditionStr.push('性别【限男性】');
                            break;
                        case 'female':
                            conditionStr.push('性别【限女性】');
                            break;
                    }
                    limits.sex = item.value;
                }
            });
			
			let hasFavorites = false;
		    if (ctx.session.user && ctx.session.user.id !== '') {
		        hasFavorites = await userApi.hasFavorite(ctx.session.user.id, 'Train', ctx.params.id);
		        hasFavorites = hasFavorites.status;
		    }
		    res.favorited = hasFavorites;
    
            res.limitsStr = '报名要求：' + conditionStr.join('、')
            res.limits = limits
        }

        // 培训类型
        let artistsForm = await sysApi.getDict('artistClass');
        for (let i = 0; i < artistsForm.length; i++) {
            for (let j = 0; j < res.artType.length; j++) {
                if (artistsForm[i].code == res.artType[j]) {
                    res.artType[j] = `<span class="tag">${artistsForm[i].value}</span>`
                }
            }
        }
        res.artType = res.artType.join(' ');

        ctx.body = res
    } else {
        ctx.status = 404;
        ctx.body = '培训已过期不存在';
    }
})

// 培训课程表
router.get('/train/schedule/:id', async (ctx, next) => {
    let res = await trainApi.trainClsInfo(ctx.params.id);
    let clsObj = {};
    let nowDate = moment().format('YYYY-MM-DD'); //当前时间
    if (res && res.length) {
        res = orderBy(res, ['itmDate', 'startTime']);
        res.forEach(function(item) {
            let month = moment(item.itmDate).format('YYYY年MM月');
            item.itmDateStr = moment(item.itmDate).format('MM月DD日  (ddd)');
            item.itmTimeStr = item.startTime + '-' + item.endTime
            if (!clsObj[month]) {
                clsObj[month] = {
                    year: moment(item.itmDate).format('YYYY'),
                    month: moment(item.itmDate).format('M月'),
                    items: []
                };
            }

            item.overdue = moment().format('x') > moment(item.itmDate + ' ' + item.endTime).format('x');
            item.enableSign = nowDate == moment(item.itmDate).format('YYYY-MM-DD'); // 当天的课程都可以签到
            clsObj[month].items.push(item);
        })
    }

    ctx.body = clsObj
})

// 培训要求
router.get('/train/require/:id', async (ctx, next) => {
    let trainId = ctx.params.id
    let user = ctx.session.user
    let members = await userApi.getMember(user.id);
    members = members ? members : [];
    members.splice(0, 0, {
        'name': user.name || user.nickname,
        'idNumber': user.idNumber,
        'sex': user.sex,
        'birthday': user.birthday,
        'identifyStatus': user.identifyStatus,
        'mobile': user.mobile,
        'relation': 'self'
    })

    if (members && members.length) {
        members = members.map((x) => {
            let info = getBirthday(x.idNumber);
            x.relationName = RELATION[x.relation];
            x.sexName = SEX[x.sex];
            x.birthday = info.birthday;
            x.identifyStatusName = IDENTIFY_STATUS[x.identifyStatus];
            return x;
        })
    }

    //获取当前用户已报名人员
    let enrolledMember = [];
    let search = 'userId:' + user.id + ',' + 'trainId:' + trainId + ',orderStatus:Success~WaitAudit';
    let orders = await trainApi.getOrder(search, 0, -1);
    for (let i = 0; i < orders.content.length; i++) {
        enrolledMember = enrolledMember.concat(orders.content[i].enrolUsers);
    }

    ctx.body = {
        members,
        enrolledMember
    }
})

// 提交培训订单
router.post("/train/order", async (ctx) => {
    let orderInfo = ctx.request.body;
    let res = {
        success: false,
        message: ''
    };
    if (!orderInfo.enrolUsers.length) {
        res.success = false;
        res.message = '没有报名人员';
    } else {
        try {
            res = await trainApi.addOrder(orderInfo);
            res.success = true;
        } catch (error) {
            res.success = false;
            res.message = error.response.data.message || '';
        }
    }

    ctx.body = res;
});

// 取消订单
router.post('/train/cancel', async (ctx, next) => {
    let body = ctx.request.body;
    let info = {
        type: 'user',
        reason: body.reason,
        time: moment().format('YYYY-MM-DD HH:mm:ss')
    };

    let res = {
        success: false,
        message: ''
    };
    try {
        await trainApi.cancelTrainOrder(body.orderid, info);
        res.success = true;
    } catch (error) {
        res.message = error.response.data.message || '退订失败';
    }
    ctx.body = res;
})

// 删除活动订单
router.post('/train/del/:id', async (ctx, next) => {
    let orderid = ctx.params.id;
    let res = {
        success: false,
        message: ''
    };
    try {
        await trainApi.delTrainOrder(orderid);
        res.success = true;
    } catch (error) {
        res.message = error.response.data.message || '删除失败';
    }
    ctx.body = res;
})

// 获取学生签到信息
router.post('/train/student', async (ctx, next) => {
    let body = ctx.request.body;
    let signs = await trainApi.getStudentSign(body.id, body.idNumber);
    signs = signs || [];
    ctx.body = signs;
})
// 提交学生签到信息
router.post('/train/sign/:id', async (ctx, next) => {
    let body = ctx.request.body;
    let signInfo = {
        "itmDate": body.itmDate,
        "startTime": body.startTime,
        "endTime": body.endTime
    };
    let res = {
        success: false,
        message: ''
    };

    try {
        await body.students.forEach(async student => {
            await trainApi.putStudentSign(ctx.params.id, student.idnumber, signInfo);
        });
        res.success = true;
    } catch (error) {
        res.success = false;
        res.message = error.response.data.message || '签到失败';
    }
    ctx.body = res;
})

module.exports = router;
