const koaRouter = require('koa-router')
const sysApi = require('../api/sys')
const venueApi = require('../api/venues')
const userApi = require('../api/user')
const { getFileUrl, getFullAddress } = require('../api/util')
const { groupBy, trimEnd } = require('lodash')
const router = new koaRouter()

const moment = require('moment')
moment.locale('zh-cn');

// 获取场馆列表
router.get('/venues/:page', async (ctx) => {
    let page = ctx.params.page || 0;
    let query = ctx.query;
    console.log(query);

    // 查询条件
    let searchCondition = 'onlineStatus:Published'; // 已发布
    if (query && query.regionType && query.regionType !== 'all') {
        let regionstr = sysApi.trimRegionEnd(ctx.query.regionType) + '%';
        let venueSearch = 'isPublish:true,region~' + regionstr;

        let venueLst = await venueApi.getVenueList(venueSearch, 0, -1);
        let venueIds = [];
        venueLst.content.forEach((item) => venueIds.push(item.id));
        if (venueIds.length == 0) { venueIds = ['000'] }
        searchCondition += ',venue.id:' + venueIds.join('~'); // 所属文化馆
    }
    if (query && query.type && query.type !== 'all') { // 活动室类型
        searchCondition += ',type:' + query.type;
    }
    if (query && query.enable && query.enable !== 'all') { // 是否可预定
        searchCondition += ',itmDef.isEnable:' + (query.enable === '1');
    }
    let sort = '&sort=' + ctx.topfield + '~desc,createTime~desc'; // 排序

    let res = await venueApi.getRoomsList(searchCondition + sort, page, 10);
    if (res.content.length) {
        for (let i = 0; i < res.content.length; i++) {
            let item = res.content[i];
            item.coverPic = getFileUrl(item.coverPic);
            item.enableName = item.itmDef.isEnable ? '可预订' : '不可预订';
            item.favorited = false; // 是否收藏
            item.favoritieId = null; // 收藏id
            // 是否收藏
            if (ctx.session.user && ctx.session.user.id !== '') {
                let hasFavorite = await userApi.hasFavorite(ctx.session.user.id, 'VenueRoom', item.id);
                item.favorited = hasFavorite.status;
                item.favoritieId = item.id;
            }
        }
    }

    ctx.body = res;
});

/** 类型 */
router.get('/venueDicts', async (ctx) => {
    let RoomTypes = [];
    RoomTypes = await sysApi.getDict('venueRoomType');
    RoomTypes.splice(0, 0, { code: 'all', value: '全部' });
    ctx.body = {
        RoomTypes: RoomTypes
    }
});

// 活动室详情
router.get('/venueroom/detail/:id', async (ctx, next) => {
	
	// 浏览量+1
	await venueApi.addvisitVenue(ctx.params.id);
	
    let res = await venueApi.getRoomInfo(ctx.params.id);
    let RoomTypes = await sysApi.getDict('venueRoomType');
    res.typeName = '';
    if (RoomTypes.length && res.type) {
        let type = RoomTypes.find(item => item.code === res.type);
        if (type) {
            res.typeName = type.value;
        }
    }
    res.coverPic = getFileUrl(res.coverPic);
    res.enableName = res.itmDef.isEnable ? '可预订' : '不可预订';
    res.favorited = false; // 是否收藏
    res.favoritieId = null; // 收藏id
    let region = await sysApi.getRegion(res.venue.region);
    res.venue.address = getFullAddress(region, res.venue.address)
    // 是否收藏
    if (ctx.session.user && ctx.session.user.id !== '') {
        let hasFavorite = await userApi.hasFavorite(ctx.session.user.id, 'VenueRoom', res.id);
        res.favorited = hasFavorite.status;
        res.favoritieId = res.id;
    }

    // 场次
    let schedule = await venueApi.getRoomSchedule(ctx.params.id);

    let scheduleList = [];
    if (schedule && schedule.length > 0) {
        let minAdvancedDay = await sysApi.fetchSysParams('reserveStartDays'); // 提前预定天数
        let maxAdvancedDay = await sysApi.fetchSysParams('limitDays'); // 可预约范围
        let curDate = moment().format('YYYY-MM-DD');
        let minDate = moment(curDate).add(minAdvancedDay, 'd');
        let maxDate = moment(curDate).add(maxAdvancedDay, 'd');
        let validSchedule = schedule.filter(x => moment(x.itmDate) >= minDate && moment(x.itmDate) <= maxDate);

        let itmsOfDay = groupBy(validSchedule, 'itmDate'); // 按天分组
        let now = moment().format('x');
        for (var key in itmsOfDay) {
            let dayData = itmsOfDay[key].map((x) => {
                x.checked = false;
                let itemStart = moment(key + ' ' + x.itmStarttime).format('x');
                x.isReserve = x.isReserve;
                if (now > itemStart) {
                    x.isReserve = true;
                }
                return x;
            });
            let oneDaySchedule = {
                month: moment(key).format('YYYY年MM月'),
                day: moment(key).format('DD'),
                week: moment(key).format('dd'),
                date: key,
                data: dayData
            }
            scheduleList.push(oneDaySchedule);
        }
    }

    res.schedule = scheduleList;
    ctx.body = res
})

// 提交场馆订单
router.post("/venue/orders", async (ctx) => {
    let order = ctx.request.body;
    let user = ctx.session.user;
    Object.assign(order, {
        userId: user.id,
        nickname: user.nickname,
        cname: user.name,
        idNumber: user.idNumber,
        mobile: user.mobile,
    })
    let res = {
        success: false,
        message: ''
    };
    try {
        res = await venueApi.createOrder(order);
        res.success = true;
    } catch (error) {
        res.success = false;
        res.message = error.response.data.message || '';
    }

    ctx.body = res;
});

// 取消订单
router.post('/venue/cancel', async (ctx, next) => {
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
        await venueApi.cancelRoomOrder(body.orderid, info);
        res.success = true;
    } catch (error) {
        res.message = error.response.data.message || '退订失败';
    }
    ctx.body = res;
})

// 删除订单
router.post('/venue/del/:id', async (ctx, next) => {
    let orderid = ctx.params.id;
    let res = {
        success: false,
        message: ''
    };
    try {
        await venueApi.delRoomOrder(orderid);
        res.success = true;
    } catch (error) {
        res.message = error.response.data.message || '删除失败';
    }
    ctx.body = res;
})
module.exports = router;
