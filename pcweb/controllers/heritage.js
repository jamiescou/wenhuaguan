const router = require('koa-router')()
const sys = require('../models/sys')
const heritage = require('../models/heritage')

const issue = require('../models/issue')

const users = require('../models/users')
const moment = require('moment')
const assist = require('../util/assist')
const config = require('../config')


let page = 0,
    str = '',
    size = 10;
router.prefix('/heritage')

/**非遗展厅 */
router.get('/', async(ctx, next) => {
    let exhibition = await heritage.fetchexhibits("search=isPublish:true", 0, 1);
    let unit = [];
    if (exhibition && exhibition.content.length > 0) {
        exhibition.content.forEach(function(item) {
            item.coverPic = assist.getFileUrl(item.coverPic);
        })

        let units = await heritage.fetchunit("heritageExhi.id:" + exhibition.content[0].id, 0, 3);
        if (units && units.content.length != 0) {
            units.content.forEach(function(item) {
                item.coverPic = assist.getFileUrl(item.coverPic);
            })
            unit = units.content;
        }
    }

    await ctx.render('heritage/heritageVenue', {
        data: exhibition.content,
        query: ctx.query,
        unit: unit
    })
})

router.get('/heritagePrj', async(ctx, next) => {
    let heritagePrj = ctx.query.heritagePrj ? ctx.query.heritagePrj : 'heritageDirectory';
    let search = 'search=onlineStatus:Published';
    if (ctx.query.region) {
        let regionstr = sys.trimRegionEnd(ctx.query.region) + '%';
        search += (search.length ? ',' : '') + 'region~' + regionstr;
    }

    search += ctx.query.type ? (search.length ? ',' : '') + 'type:' + ctx.query.type : ''; //类型
    search += ctx.query.batch ? (search.length ? ',' : '') + 'batch:' + ctx.query.batch : ''; //批次
    search += ctx.query.level ? (search.length ? ',' : '') + 'level:' + ctx.query.level : ''; //级别
    search += ctx.query.key ? (search.length ? ',' : '') + 'name~' + encodeURIComponent(ctx.query.key) : ''; //级别
    if (ctx.query.key) {
        delete ctx.query.key;
    }
    let page = ctx.query.page ? ctx.query.page - 1 : 0;
    let res = {};
    let sort = ctx.topfield + '~desc,createTime~desc';
    if (heritagePrj == 'heritageDirectory') { //项目
        res = await heritage.fetchDirectorys(search, page, config.paging.heritage.size, sort);
    } else if (heritagePrj == 'heritageSuccessor') { //传承人
        res = await heritage.fetchSuccessors(search, page, config.paging.heritage.size, sort);
    } else { //非遗保护区
        res = await heritage.fetchProtections(search, page, config.paging.heritage.size, sort);
    }
    let heritageTypes = await sys.fetchCodeTypes('heritageType');
    let batch = await sys.fetchCodeTypes('heritageBatch');
    let level = await sys.fetchCodeTypes('heritageLevel');
    let regions = await sys.getRedisRegionTree(ctx.curUnit.region);;
    res.content.forEach(function(item) {
        item.coverPic = assist.getFileUrl(item.coverPic);
        item.itemType = heritagePrj;
        // item.brief = assist.formateHtmlToText(item.brief);
        // item.brief = assist.subTextLimit34(item.brief);
    })

    await ctx.render('heritage/heritagePrj', {
        data: res,
        levels: level,
        regions: regions,
        heritageTypes: heritageTypes,
        batchs: batch,
        query: ctx.query
    })
})

function getRegionsId(regions) {
    let ids = '';
    regions.forEach(function(item) {
        ids += item.code + '~' + getRegionsId(item.children)
    })
    return ids;
}

async function directoryDetail(ctx) {
    let type = ctx.query.type;
    let page = ctx.query.page ? ctx.query.page : 0;
    let res = {};
    let comments = {};
    let successors = {};
    let heritageTypes = await sys.fetchCodeTypes('heritageType');
    let batch = await sys.fetchCodeTypes('heritageBatch');
    let level = await sys.fetchCodeTypes('heritageLevel');
    let favorited = false;
    let recommands = {};

    res = await heritage.fetchDirectoryDetail(ctx.params.id);
    successors = await heritage.fetchSuccessors('search=directory.id:' + ctx.params.id, 0, -1);
    successors.content.forEach(function(item) {
        item.coverPic = assist.getFileUrl(item.coverPic);
    })

    if (res.digits && res.digits.length != 0) {
        res.digits = res.digits.filter(x => x.type === 'pic'); // 非遗图片
        res.digits.forEach(function(item) {
            item.pic = assist.getFileUrl(item.pic);
        })
    }

    detail = await heritage.fetchSuccessors("search=project.id:" + ctx.params.id, page, config.paging.heritage.size);
    if (detail.content && detail.content.length != 0) {
        detail.content.forEach(function(item) {
            item.coverPic = assist.getFileUrl(item.coverPic);
        })
    }
    res.successors = successors; //名录传承人信息
    comments = await users.getComments('projects', ctx.params.id, page, config.paging.comments.size);

    let regionInfo = await sys.getRegionInfo(res.region);
    res.address = regionInfo.fullName;

    if (ctx.session.user) {
        let favStatus = await users.fetchUserFavoritesStatus(ctx.session.user.id, type, ctx.params.id);
        favorited = favStatus.status;
    }

    res.batchName = heritage.getDicNameByCode(res.batch, batch);
    res.levelName = heritage.getDicNameByCode(res.level, level);
    res.typeName = heritage.getDicNameByCode(res.type, heritageTypes);

    res.coverPic = assist.getFileUrl(res.coverPic);
    let sort = ctx.topfield + '~desc,createTime~desc';
    recommands = await heritage.fetchDirectorys('search=onlineStatus:Published', 0, 4, sort);
    recommands.content.forEach(function(item) {
        item.coverPic = assist.getFileUrl(item.coverPic);
    })

    return {
        data: res,
        comments: comments,
        recommands: recommands,
        detail: detail,
        favorited: favorited
    }

}

async function successorDetail(ctx) {

    let type = ctx.query.type;
    let page = ctx.query.page ? ctx.query.page : 0;
    let res = {};
    let comments = {};
    let successors = {};
    let heritageTypes = await sys.fetchCodeTypes('heritageType');
    let batch = await sys.fetchCodeTypes('heritageBatch');
    let level = await sys.fetchCodeTypes('heritageLevel');
    let favorited = false;
    let recommands = {};
    res = await heritage.fetchSuccessorDetail(ctx.params.id);
    res.directory = res.directory ? res.directory : [];

    if (res.digits && res.digits.length != 0) {
        res.digits.forEach(function(item) {
            item.pic = assist.getFileUrl(item.pic);
        })
    }
    if (res.project) {
        res.project.coverPic = assist.getFileUrl(res.project.coverPic);
    }

    comments = await users.getComments('successors', ctx.params.id, page, config.paging.comments.size);
    if (ctx.session.user) {
        let favStatus = await users.fetchUserFavoritesStatus(ctx.session.user.id, type, ctx.params.id);
        favorited = favStatus.status;
    }
    res.batchName = heritage.getDicNameByCode(res.batch, batch);
    res.levelName = heritage.getDicNameByCode(res.level, level);
    res.typeName = heritage.getDicNameByCode(res.type, heritageTypes);
    res.coverPic = assist.getFileUrl(res.coverPic);

    let regionInfo = await sys.getRegionInfo(res.region);
    res.address = regionInfo.fullName;
    let sort = ctx.topfield + '~desc,createTime~desc';
    recommands = await heritage.fetchSuccessors('search=onlineStatus:Published', 0, 4, sort);
    recommands.content.forEach(function(item) {
        item.coverPic = assist.getFileUrl(item.coverPic);
    })
    return {
        data: res,
        comments: comments,
        recommands: recommands,
        favorited: favorited
    }

}

async function protectionDetail(ctx) {
    let type = ctx.query.type;
    let page = ctx.query.page ? ctx.query.page : 0;
    let res = {};
    let comments = {};
    let successors = {};
    let heritageTypes = await sys.fetchCodeTypes('heritageType');
    let batch = await sys.fetchCodeTypes('heritageBatch');
    let level = await sys.fetchCodeTypes('heritageLevel');
    let favorited = false;
    let recommands = {};
    res = await heritage.fetchProtectionsDetail(ctx.params.id);
    if (ctx.session.user) {
        let favStatus = await users.fetchUserFavoritesStatus(ctx.session.user.id, type, ctx.params.id);
        favorited = favStatus.status;
    }
    res.batchName = heritage.getDicNameByCode(res.batch, batch);
    res.levelName = heritage.getDicNameByCode(res.level, level);
    res.typeName = heritage.getDicNameByCode(res.type, heritageTypes);
    res.coverPic = assist.getFileUrl(res.coverPic);

    if (res.projects && res.projects.length != 0) {
        res.projects.forEach(function(item) {
            item.coverPic = assist.getFileUrl(item.coverPic);
        })
    }
    if (res.successors && res.successors.length != 0) {
        res.successors.forEach(function(item) {
            item.coverPic = assist.getFileUrl(item.coverPic);
        })
    }
    let sort = ctx.topfield + '~desc,createTime~desc';
    comments = await users.getComments('protections', ctx.params.id, page, config.paging.comments.size);
    recommands = await heritage.fetchProtections('search=onlineStatus:Published', 0, 4, sort);
    recommands.content.forEach(function(item) {
        item.coverPic = assist.getFileUrl(item.coverPic);
    })
    return {
        data: res,
        comments: comments,
        recommands: recommands,
        favorited: favorited
    }

}

router.get('/heritagedetail/:id', async(ctx, next) => {
    let type = ctx.query.type;
    if (type == 'heritageDirectory') {
        let obj = await directoryDetail(ctx);
        await ctx.render('heritage/heritage-prjdetail', obj)
    } else if (type == 'heritageSuccessor') { //传承人
        let obj = await successorDetail(ctx);
        await ctx.render('heritage/heritage-susordetail', obj)
    } else { //保护区
        let obj = await protectionDetail(ctx);
        await ctx.render('heritage/heritage-prodetail', obj)
    }
})

/**
 * 非遗地图
 */
router.get('/heritageMap', async(ctx, next) => {
    // 
    let unit = await sys.fetchroot();
    let project = await heritage.fetchHeritageStatisticProject(unit.region);
    let successor = await heritage.fetchHeritageStatisticSuccessor(unit.region);

    await ctx.render('heritage/heritageMap', {
        project: project,
        successor: successor
    })
})

router.get('/mapData', async(ctx, next) => {
    ctx.body = 'map';
})


/**
 * 非遗地图市级
 */
router.post('/city/:id', async(ctx, next) => {
    let project = await heritage.fetchHeritageStatisticProject(ctx.params.id);
    let successor = await heritage.fetchHeritageStatisticSuccessor(ctx.params.id);
    let cityInfo = await sys.regiondetail(ctx.params.id);
    ctx.body = {
        project: project,
        successor: successor,
        cityInfo: cityInfo
    };
})

router.get('/mapData', async(ctx, next) => {
    ctx.body = 'map';
})


/**非遗资讯 */
router.get('/heritageNews', async(ctx, next) => {
    let queryItems = ctx.query;
    let topid;
    let childid;
    let topColumns = [];
    let childColumns = [];
    let columnId = queryItems.column;
    let allColumn = await issue.getColumns('enable:true,channel:heritage', 0, -1);
    allColumn = allColumn.content;
    if (!allColumn.length) {
        return ctx.render('heritage/heritageNews', {
            data: {},
            query: ctx.query,
            topColumns: topColumns,
            childColumns: childColumns
        });
    }
    topColumns = allColumn.filter(x => x.parent === null);

    let searchConditions = 'search=column.channel:heritage,isPublish:true'; // 默认搜索
    if (columnId) {
        searchConditions = 'search=isPublish:true,column.id:' + columnId;
        // 当前的一级栏目，二级栏目
        let column = allColumn.find(x => x.id === columnId);
        if (column) {
            if (column.parent) { // 当前搜索的是二级栏目
                topid = column.parent.id;
                childid = columnId;
            } else {
                topid = columnId; // 当前搜索的是一级栏目
            }
            childColumns = allColumn.filter(x => x.parent && x.parent.id === topid); // 一级栏目下的二级栏目
        }
    }

    let page = queryItems.page ? queryItems.page - 1 : 0;
    let size = queryItems.size ? queryItems.size : 10;
    let sort = ctx.topfield + '~desc,publishTime~desc';
    let res = await issue.newslist(searchConditions, page, size, sort);
    res.content.forEach(function(item) {
        item.coverPic2 = item.coverPic && item.coverPic !== '' ? assist.getFileUrl(item.coverPic) : null;
        item.date = moment(item.publishTime).format('YYYY-MM-DD');
    })

    await ctx.render('heritage/heritageNews', {
        data: res,
        topColumns: topColumns,
        childColumns: childColumns,
        query: queryItems,
        topid: topid,
        childid: childid
    })
})



//单元详情
router.get("/unitdetail/:id", async(ctx) => {

    let type = ctx.query.type ? ',type:' + ctx.query.type : '';
    let page = ctx.query.page ? ctx.query.page - 1 : 0;
    let digitalSearch = 'search=isPublish:true,heritageUnit.id:' + ctx.params.id + type;

    let works = await heritage.fetchworks(digitalSearch, page, 16);

    let workstype = await sys.fetchCodeTypes('worksType');
    if (works && works.content.length != 0) {
        works.content.forEach(function(item) {
            item.coverPic = assist.getFileUrl(item.coverPic);
            item.typeName = workstype[item.type - 1].value
        })
    }

    await ctx.render('heritage/unit-detail', {
        query: ctx.query,
        works: works,
        workstype: workstype,
        id: ctx.params.id
    })
});


module.exports = router