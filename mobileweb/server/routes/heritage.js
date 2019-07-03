const koaRouter = require('koa-router')
const sysApi = require('../api/sys')
const heritageApi = require('../api/heritage')
const issueApi = require('../api/issue')
 
const { getFileUrl } = require('../api/util')
const moment = require('moment')
const { trimEnd } = require('lodash')
const router = new koaRouter();
const mapData = require('../../util/mapdata');
moment.locale('zh-cn');

// 非遗展厅
router.get('/heritage', async (ctx) => {
    let exhibition = await heritageApi.heritageExhibits("search=isPublish:true", 0, 1);
    exhibition = exhibition.content;
    if (exhibition.length) {
        exhibition.forEach(function(item) {
            item.coverPic = getFileUrl(item.coverPic);
        })
    }
    // 展厅单元 
    let unit = await heritageApi.heritageUnit("", 0, 3);
    if (unit && unit.content.length != 0) {
        unit.content.forEach(function(item) {
            item.coverPic = getFileUrl(item.coverPic);
        })
    }
    ctx.body = {
        exhibition: exhibition[0],
        unit: unit
    }
});

// 非遗展厅 展厅单元
router.get('/heritage/unit/:id', async (ctx) => {
    let unitInfo = await heritageApi.heritageUnitInfo(ctx.params.id);
    if (unitInfo.type.length) {
        let heritageType = await sysApi.getDict('heritageType');
        let type = [];
        unitInfo.type.forEach(element => {
            let typeCode = heritageType.find(x => x.code === element);
            if (typeCode) {
                type.push(typeCode.value);
            }
        });
        unitInfo.typeName = type.join(' ')
    }
    unitInfo.coverPic = getFileUrl(unitInfo.coverPic);

    let digitalSearch = 'search=isPublish:true,heritageUnit.id:' + ctx.params.id;
    let works = await heritageApi.heritageWorks(digitalSearch, 0, 4);
     
    if (works && works.content.length != 0) {
        works.content.forEach(function(item) {
            item.coverPic = getFileUrl(item.coverPic);
        })
    }
    unitInfo.works = works;
    ctx.body = unitInfo;
});

// 非遗展厅 展厅单元作品
router.get('/heritage/unit/products/:id/:page', async (ctx) => {
    let page = ctx.params.page || 0;
    let size = ctx.query.size || 10;
    let digitalSearch = 'search=isPublish:true,heritageUnit.id:' + ctx.params.id;
    let works = await heritageApi.heritageWorks(digitalSearch, page, size);
  
    if (works && works.content.length != 0) {
        works.content.forEach(function(item) {
            item.coverPic = getFileUrl(item.coverPic);
        })
    }
    ctx.body = works;
});

// 非遗地图
router.get('/heritageMap', async (ctx) => {
    let cityCode = ctx.query.city;
    if (!cityCode) {
        let unit = await sysApi.fetchRoot();
        cityCode = unit.region;
    }
    let project = await heritageApi.mapStatisticProject(cityCode);
    let successor = await heritageApi.mapStatisticSuccessor(cityCode);
    ctx.body = {
        project: project,
        successor: successor
    }
});

router.get('/mapdata', async (ctx) => {
    let region = ctx.query.region;
    let regionType = ctx.query.regionType;
    let res = {};
    if (regionType == 'province') {
        res = mapData['hunan'];
    } else {
        res = mapData['hunanCounty'][region]
    }
    ctx.body = {
        data: res,
        prop: mapData['mapPrp']
    }
})

// 非遗资讯
router.get('/heritageNews/:page', async (ctx) => {
    let queryItems = ctx.query;
    let page = ctx.params.page || 0;
    // 资讯
    let searchConditions = 'column.channel:heritage,isPublish:true';
    if (queryItems && queryItems.column && queryItems.column !== 'all') {
        searchConditions = 'isPublish:true,column.id:' + queryItems.column;
    }
    searchConditions += '&sort=' + ctx.topfield + '~desc,publishTime~desc'
    let informations = await issueApi.getInformationList(searchConditions, page, 10);
    if (informations.content) {
        informations.content.forEach(function(item) {
            item.coverPic = getFileUrl(item.coverPic);
            item.publishTime = moment(item.publishTime).fromNow()
        })
    }
    ctx.body = informations;
});

/** 资讯顶级栏目 */
router.get('/heritage/columns', async (ctx) => {
    // 资讯栏目
    let infocolumns = [];
    infocolumns = await issueApi.getTopColumns();
    infocolumns = infocolumns.filter(x => x.channel === 'heritage' && x.enable);
    infocolumns.splice(0, 0, { id: 'all', name: '全部' });

    ctx.body = infocolumns;
});

// 非遗资源
router.get('/heritagePrj/:page', async (ctx) => {
    let query = ctx.query;
    let page = ctx.params.page || 0;

    // 查询条件
    let searchCondition = 'onlineStatus:Published'; // 已发布
    if (query && query.type && query.type !== 'all') {
        searchCondition += ',type:' + query.type; // 非遗类型
    }
    if (query && query.level && query.level !== 'all') {
        searchCondition += ',level:' + query.level; // 级别
    }
    if (query && query.regionType && query.regionType !== 'all') { // 区域
        let regionstr =sysApi.trimRegionEnd(query.regionType) + '%';
        searchCondition += ',region~' + regionstr;
    }

    searchCondition += '&sort=' + ctx.topfield + '~desc,createTime~desc';

    let res;
    let heritagePrj = query.heritagePrj || 1;
    if (heritagePrj == 'successor') { //传承人
        res = await heritageApi.heritageSuccessors(searchCondition, page, 10);
    } else if (heritagePrj == 'protection') { //非遗保护区
        res = await heritageApi.heritageProtections(searchCondition, page, 10);
    } else { //项目
        res = await heritageApi.heritageProjects(searchCondition, page, 10);
    }

    if (res.content.length) {
        res.content.forEach(function(item) {
            item.coverPic = getFileUrl(item.coverPic);
        })
    }
    ctx.body = res;
});
// 非遗字典（分类、批次、级别等）
router.get('/heritageDicts', async (ctx) => {
    // 非遗级别
    let heritageLevel = [];
    heritageLevel = await sysApi.getDict('heritageLevel');
    heritageLevel.splice(0, 0, { code: 'all', value: '全部' });

    // 非遗批次
    let heritageBatch = [];
    heritageBatch = await sysApi.getDict('heritageBatch');
    heritageBatch.splice(0, 0, { code: 'all', value: '全部' });

    // 非遗类型
    let heritageType = [];
    heritageType = await sysApi.getDict('heritageType');
    heritageType.splice(0, 0, { code: 'all', value: '全部' });

    ctx.body = {
        heritageLevel: heritageLevel,
        heritageBatch: heritageBatch,
        heritageType: heritageType
    }
});

// 非遗名录详情
router.get('/project/detail/:id', async (ctx) => {
    let id = ctx.params.id;
    let heritageBatch = await sysApi.getDict('heritageBatch');
    let heritageLevel = await sysApi.getDict('heritageLevel');
    // 详细信息
    let res = await heritageApi.projectsDetail(id);
    res.coverPic = getFileUrl(res.coverPic);
    let levelCode = heritageLevel.find(item => item.code === res.level);
    res.levelName = levelCode ? levelCode.value : null;
    let batchCode = heritageBatch.find(item => item.code === res.batch);
    res.batchName = batchCode ? batchCode.value : null;

    if (res.digits && res.digits.length) {
        res.digits = res.digits.filter(x => x.type === 'pic');
        res.digits.forEach(function(item) {
            item.pic = getFileUrl(item.pic);
        })
    }

    // 相关传承人
    let successors = await heritageApi.heritageSuccessors('onlineStatus:Published,project.id:' + id, 0, -1);
    res.successors = successors.content;
    if (res.successors) {
        res.successors.forEach(function(item) {
            item.coverPic = getFileUrl(item.coverPic);
        })
    }

    ctx.body = res
});

// 非遗传承人详情
router.get('/successor/detail/:id', async (ctx) => {
    let id = ctx.params.id;
    let heritageBatch = await sysApi.getDict('heritageBatch');
    let heritageLevel = await sysApi.getDict('heritageLevel');

    // 详细信息
    let res = await heritageApi.successorsDetail(id);
    res.coverPic = getFileUrl(res.coverPic);
    let levelCode = heritageLevel.find(item => item.code === res.level);
    res.levelName = levelCode ? levelCode.value : null;
    if (res.digits && res.digits.length) {
        res.digits.forEach(function(item) {
            item.pic = getFileUrl(item.pic);
        })
    }
    ctx.body = res
});
// 非遗保护区详情
router.get('/protection/detail/:id', async (ctx) => {
    let id = ctx.params.id;
    let heritageBatch = await sysApi.getDict('heritageBatch');
    let heritageLevel = await sysApi.getDict('heritageLevel');
    // 详细信息
    let res = await heritageApi.protectionDetail(id);
    res.coverPic = getFileUrl(res.coverPic);
    if (res.projects && res.projects.length) {
        res.projects.forEach(function(item) {
            item.coverPic = getFileUrl(item.coverPic);
            let levelCode = heritageLevel.find(x => x.code === item.level);
            item.levelName = levelCode ? levelCode.value : null;
            let batchCode = heritageBatch.find(x => x.code === item.batch);
            item.batchName = batchCode ? batchCode.value : null;
        })
    }
    if (res.successors && res.successors.length != 0) {
        res.successors.forEach(function(item) {
            item.coverPic = getFileUrl(item.coverPic);
        })
    }
    ctx.body = res
});
module.exports = router;
