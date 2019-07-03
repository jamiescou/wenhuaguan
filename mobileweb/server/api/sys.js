import Qs from 'qs';
import fs from 'fs'
import path from 'path'
import config from '../../config/index';
import fetch from './http';
import { RedisStore } from './util'
const uuid = require('uuid')
const { trimEnd } = require('lodash')
let RedisObj = new RedisStore() // 实例对象

// 获取字典
export async function getDict(dictName) {
    const data = await fetch({
        url: '/sys/codetypes/' + dictName + '/codes',
        method: 'get'
    });
    return data;
}

/**
 * 获取区域列表(直接下级)
 * @param {String} code 区域code
 */
export async function getRegionList(code) {
    const data = await fetch({
        url: '/sys/regions/' + code + '/directchilds',
        method: 'get'
    })
    return data;
}
/**
 * 获取区域的所有下级区域（直接、间接下级）
 * @param {String} code 区域code
 */
export async function getAllChildRegions(code) {
    let res = await fetch({
        url: '/sys/regions/' + code + '/allchilds',
        method: 'get'
    })
    return res;
}

/**
 * 根据区域code，获取详细信息
 * 
 * @param {any} code 区域code
 * @returns 
 */
export async function getRegion(code) {
    let res = await fetch({
        url: '/sys/regions/' + code,
        method: 'get'
    })
    return res;
}

/**
 *查询区域信息
 */
export async function getRegions(search, page, size) {
    let res = await fetch({
        url: '/sys/regions?search=' + search + '&page=' + page + '&size=' + size,
        method: 'get'
    })
    return res;
}

/**
 * 获取授权token
 *
 * @param {String} auth 授权信息
 * @param {String} grant 授权类型
 * @returns
 */
export async function getToken(auth, grant) {
    const data = await fetch({
        url: '/oauth/token',
        method: 'post',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': auth },
        data: Qs.stringify({ grant_type: grant }),
        isLogin: true
    });
    return data;
}

// 创建文件路径
function mkdirsSync(dirname) {
    if (fs.existsSync(dirname)) {
        return true;
    } else {
        if (mkdirsSync(path.dirname(dirname))) {
            fs.mkdirSync(dirname);
            return true;
        }
    }
}

/**
 * 保存上传的文件
 * 
 * @param {any} file 文件内容
 * @returns 保存的文件路径
 */
export async function saveFile(file) {
    let result = {
        success: false,
        msg: '',
        url: ''
    }
    try {
        let filePath = file.path;
        let fileType = file.name.split('.')[1];
        let id = uuid.v1();
        let fileName = id + '.' + fileType;
        let pathStr = id.substr(0, 4);
        let relativePath = path.join(pathStr.charAt(0), pathStr.charAt(1), pathStr.charAt(2), pathStr.charAt(3));
        let savePath = path.join(config.cloudinary.filePath, relativePath.toString());
        let saveFile = path.join(savePath, fileName);
        mkdirsSync(savePath); // 创建路径
        fs.copyFileSync(file.path, saveFile);
        let p = path.join(relativePath, fileName).toString();
        p = p.replace(/\\/g, '/');
        result.url = p;
        result.success = true;
    } catch (ex) {
        result.msg = ex.message || '上传错误'
    }
    return result;
}

/**
 * 获取轮播图内容列表
 *
 * @param {String} type 【pcIndex, weixinIndex, weixinActivity】
 * @returns 轮播图集合
 */
export async function getLoopPics(type) {
    const data = await fetch({
        url: '/base/looppics/' + type + '/contents?enable=true',
        method: 'get'
    });
    return data;
}

export async function fetchRoot() {
    let res = await fetch({
        url: '/sys/units/root',
        method: 'get'
    });
    return res;
}

export async function unitList(search) {
    let res = await fetch({
        url: '/sys/units?search=' + search,
        method: 'get'
    });
    return res;
}

export async function getCurUnit(host) {
    let units = await unitList('type:org&page=0&size=-1'); // 获取所有的文化馆
    units = units.content;
    let curUnit = units.find(x => x.site === host);
    if (!curUnit) {
        curUnit = await fetchRoot();
    }

    return curUnit;
}

/**
 * 从redis中获取区域数据,如果不存在，获取数据存入redis;
 * @export
 * @param {int} level 区域级别
 * @param {String} regionCode 起始区域code
 * @returns
 */
export async function getRedisRegionTree(regionCode) {
    let regionsTree = await getRegionTree(regionCode)
    return regionsTree

    // let connectionResult = await RedisObj.connection()
    // if (connectionResult) {
    //     // 存储相关的地区信息
    //     let regions = [];
    //     let hasRegions = await RedisObj.exists('regions')
    //     if (!hasRegions) {
    //         let rootUnit = await RedisObj.getHashData('m-cultCenter', 'rootUnit')
    //         rootUnit = JSON.parse(rootUnit)
    //         let regionsTree = await getRegionTree(rootUnit.region)
    //         RedisObj.setData('regions', regionsTree)
    //         regions = regionsTree;
    //     } else {
    //         regions = await RedisObj.getData('regions');
    //     }

    //     let tree = [];
    //     if (level == 1) {
    //         tree = regions;
    //     } else if (level == 2) {
    //         tree = regions.find(x => x.code == regionCode);
    //         tree = tree.children;
    //     }
    //     return tree;
    // } else {
    //     return [];
    // }
}
/**
 * 获取区域树形结构
 */
export async function getRegionTree(region) {
    function generateRegionTree(oneLevels, allData) {
        for (let item of oneLevels) {
            item.children = [];
            let children = allData.filter(x => x.parentCode === item.code);
            if (children.length) {
                item.children = generateRegionTree(children, allData);
            }
        }
        return oneLevels;
    }
    let search = 'code~' + trimRegionEnd(region) + '%,level<4';
    let regions = await getRegions(search, 0, -1); // 当前文化馆的区域范围
    regions = regions.content;
    if (regions.length) {
        let regionList = regions.map((x) => { // 用于前端统一格式,code\value
            delete x.heritBrief
            x.value = x.name;
            return x;
        })
        regions = regionList;
    }
    // 区域转换成树形结构
    let directchilds = regions.filter(x => x.parentCode === region); // 当前文化馆所属区域的直接子级
    let regionsTree = generateRegionTree(directchilds, regions);
    return regionsTree;
}
/**
 * 获取区域（包括下属区域）code
 * @param {any} regionCode 当前区域code
 * @returns code字符串
 */
export async function getchildRgionsAndSelf(regionCode) {
    let allchildRegions = await getAllChildRegions(regionCode); // 所有的下级区域
    let regionCodes = [];
    if (allchildRegions.length) {
        regionCodes = allchildRegions.map(x => {
            return x.code;
        });
    }
    regionCodes.splice(0, 0, regionCode);
    return regionCodes.join('~');
}
/**
 * 获取评论
 *
 * @export
 * @param {String} type 评论对象类型；
 * @param {String} objectId 评论对象Id
 * @param {Number} page
 * @param {Number} size
 * @returns
 */
export async function getComments(type, objectId, page, size) {
    let search = 'status:Pass';
    let getUrl = '';
    switch (type) {
        case 'Activity': // 活动
            getUrl = '/activity/activitys/' + objectId + '/comments';
            break;
        case 'Train': // 培训
            getUrl = '/train/trains/' + objectId + '/comments';
            break;
        case 'Information': // 资讯
            getUrl = '/issue/informations/' + objectId + '/comments';
            break;
        case 'ArtTeam': // 文艺团队
            getUrl = '/cooperation/artteams/' + objectId + '/comments';
            break;
        case 'ArtWorks': // 作品征集
            getUrl = '/collect/activitys/' + objectId + '/comments';
            break;
        case 'ArtTalent': // 文艺人才
            getUrl = '/cooperation/artexperts/' + objectId + '/comments';
            break;
        case 'DigitalShow': // 数字展览
            getUrl = '/issue/exhibits/' + objectId + '/comments';
            break;
        case 'CultureSupply': // 文化配送
            getUrl = '/delivery/supplys/' + objectId + '/comments';
            break;
        case 'CultureBrand': // 文化品牌
            getUrl = '/issue/brands/' + objectId + '/comments';
            break;
        case 'heritageDirectory': // 非遗名录
            getUrl = '/heritage/projects/' + objectId + '/comments';
            break;
        case 'heritageSuccessor': // 非遗传承人
            getUrl = '/heritage/successors/' + objectId + '/comments';
            break;
        case 'heritageProtectArea': // 非遗保护区
            getUrl = '/heritage/protections/' + objectId + '/comments';
            break;
        case 'Venue': // 场馆
            getUrl = '/venue/venues/' + objectId + '/comments';
            break;
        case 'VenueRoom': // 场馆
            getUrl = '/venue/rooms/' + objectId + '/comments';
            break;
            // TODO: VenueRoom  场馆活动室
        case 'VolunteerRecruit': // 志愿者招募活动
            getUrl = '/volunteer/volunrecruit/' + objectId + '/comments';
            break;
        case 'LiveVideos': // 直播
            getUrl = '/vod/livevideos/' + objectId + '/comments';
            break;
        case 'Demands': // 点播
            getUrl = '/vod/goodvideos/' + objectId + '/comments';
            break;

        default:
            break
    }

    const data = await fetch({
        url: getUrl + '?search=' + search + '&page=' + page + '&size=' + size + '&sort=time~desc',
        method: 'get'
    });

    return data;
}

export async function getUsers(search, page, size) {
    const userData = await fetch({
        url: '/user/users?search=' + search + '&page=' + page + '&size=' + size,
        method: 'get'
    });
    return userData;
}

/**
 * 用户评论
 *
 * @export
 * @param {any} userId 用户ID
 * @param {any} comment 评论内容
 * @returns
 */
export async function postComment(userId, comment) {
    let res = await fetch({
        url: '/user/users/' + userId + '/comments',
        method: 'post',
        data: comment
    });
    return res;
}

/**
 * 意见反馈
 *
 * @export
 * @param {any} name 用户name
 * @param {any} content 反馈内容
 * @returns
 */
export async function postSuggestions(content) {
    let res = await fetch({
        url: '/sys/suggestions',
        method: 'post',
        data: content
    });
    return res;
}

// 根据名称查询系统参数
export async function fetchSysParams(type) {
    let res = await fetch({
        url: '/sys/params/' + type,
        method: 'get',
    });
    return res.value;
}

/**
 * 根据传入的区域，获取该区域的文化馆,然后获取子级馆
 *
 * @param {any} regionCode 区域Code
 * @returns 文化馆id集合字符串,不存在文化馆，返回默认值“0000”
 */
export async function getUnitIdsByRegion(regionCode) {
    let unitid = [];
    let cults = await unitList('type:org,region:' + regionCode);
    let ancestors = [];
    if (cults.content && cults.content.length > 0) {
        ancestors = cults.content.map(x => x.id);
        unitid = ancestors;
        let cultChildren = await unitList('type:org,ancestors:' + ancestors.join('~'));
        if (cultChildren.content.length > 0) {
            let cultChildrenIds = cultChildren.content.map(x => x.id);
            unitid = unitid.concat(cultChildrenIds);
        }
    }
    unitid = unitid.join('~');
    unitid = unitid ? unitid : '0000'; //如果选择的地市没有文化馆，则应查不到数据
    return unitid;
}

/**
 * 按省、市、区、街道截取编码末尾的0；除街道按3位截取外，其他两位截；
 *   43  01 00 000--》4301
 *   43  01 10 000--》430110
 * @param {*} code 区域编码
 */
export function trimRegionEnd(code) {
    if (!code) return code;
    if (code.length == 9) { //街道编码
        if (code.substr(6, 3) == '000') {
            return trimRegionEnd(code.substr(0, 6))
        } else {
            return code;
        }
    } else if (code.length < 9) {
        if (code.substr(code.length - 2, 2) == '00') {
            return trimRegionEnd(code.substr(0, code.length - 2))
        } else {
            return code
        }
    } else { return code }
}

/**
 * 获取推荐版块内容
 */
export async function getRecommands(search, page, size) {
    let res = await fetch({
        url: '/base/recommends?search=' + search + '&page=' + page + '&size=' + size,
        method: 'get'
    })
    return res;
}

//搜索列表
export async function searchList(str, page, size) {
    let res = await fetch({
        url: '/search/resources?' + str + '&page=' + page + '&size=' + size,
        method: 'get',
    });
    return res;
}

// 根据域名获取机构信息
export async function getUintByDomain(domain) {
    let res = await fetch({
        url: '/sys/units/mobile/domain/' + domain,
        method: 'get'
    });
    return res;
}
