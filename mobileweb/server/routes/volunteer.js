import { getBirthday } from '../../util/GetBirthdayAndSex';
const koaRouter = require('koa-router')
const sysApi = require('../api/sys')
const volunteerApi = require('../api/volunteer')
const userApi = require('../api/user')
const { getFileUrl, getFullAddress } = require('../api/util')
const moment = require('moment')

moment.locale('zh-cn');
const router = new koaRouter()

// 获取志愿者列表
router.get('/volunteers/:page', async (ctx) => {
    let query = ctx.query;
    let page = ctx.params.page || 0;
    let size = query.size || 10;

    // 轮播图
    let looppic = await sysApi.getLoopPics('h5Volunteer');
    looppic.forEach(function(item) {
        item.coverPic = getFileUrl(item.coverPic)
    });

    // 查询条件
    let searchCondition = 'search=isPublish:true'; // 已发布
    if (query && query.regionType && query.regionType !== 'all') {
        let allchildRegions = await sysApi.getchildRgionsAndSelf(query.regionType); // 所有的下级区域
        searchCondition += ',region:' + allchildRegions;
    }
    if (query && query.type && query.type !== 'all') { // 招募活动类型
        searchCondition += ',serviceTypes:' + query.type;
    }
    if (query && query.isStop && query.isStop !== 'all') { // 是否停止招募
        searchCondition += ',isStop:' + (query.isStop !== '1');
    }

    searchCondition += '&sort=createTime~desc';
    let res = await volunteerApi.volunrecruitList(searchCondition, page, size);
    if (res.content.length) {
        for (let i = 0; i < res.content.length; i++) {
            let element = res.content[i];
            element.favorited = false; // 是否收藏
            element.favoritieId = null; // 收藏id

            // 是否收藏
            if (ctx.session.user && ctx.session.user.id !== '') {
                let hasFavorite = await userApi.hasFavorite(ctx.session.user.id, 'VolunteerRecruit', element.id);
                element.favorited = hasFavorite.status;
                element.favoritieId = element.id;
            }
            let region = await sysApi.getRegion(element.region);
            element.address = getFullAddress(region, element.address)

            res.content[i] = {
                id: element.id,
                name: element.name,
                coverPic: getFileUrl(element.coverPic),
                address: element.address,
                limitNum: element.limitNum,
                startTime: element.startTime,
                isStop: element.isStop,
                favorited: element.favorited,
                favoritieId: element.favoritieId,
                serviceTypes: element.serviceTypes
            }
        }
    }
    res.looppic = looppic;
    ctx.body = res;
});

/**
 * 志愿者活动详情
 */
router.get('/volunteer/detail/:id', async (ctx, next) => {
    let res = await volunteerApi.volunrecruitDetail(ctx.params.id);
    res.coverPic = getFileUrl(res.coverPic);
    res.attach = getFileUrl(res.attach);
    let favorited = false;
    let enrolled = "";

    if (ctx.session.user) {
        let search = 'userId:' + ctx.session.user.id + ',recruitId:' + ctx.params.id + ',isPass:null~true';
        let recruitList = await volunteerApi.volunRecruitApplys(search, 0, -1);
        recruitList.content.forEach(function(item) {
            enrolled += item.type
        })

        let hasFavorite = await userApi.hasFavorite(ctx.session.user.id, 'VolunteerRecruit', res.id);
        favorited = hasFavorite.status;
    }
    let codetype = await sysApi.getDict('volunteerServiceType');
    for (let i = 0; i < codetype.length; i++) {
        for (let j = 0; j < res.serviceTypes.length; j++) {
            if (codetype[i].code == res.serviceTypes[j]) {
                res.serviceTypes[j] = `<span class="tag">${codetype[i].value}</span>`
            }
        }
    }
    res.serviceTypes = res.serviceTypes.join(' ');
    if (res.digits && res.digits.length) {
        res.digits.forEach(function(file) {
            file.pic = getFileUrl(file.pic);
            file.file = getFileUrl(file.file);
        })
    }

    res.enrolled = enrolled;
    res.favorited = favorited;
    ctx.body = res;
})

router.get('/volunteer/voluninfo/', async (ctx, next) => {

    let type = ctx.query.type;
    let serviceTypes = await sysApi.getDict("volunteerServiceType");
    let education = await sysApi.getDict("education");
    let occupation = await sysApi.getDict("occupation");
    let politicalStatus = await sysApi.getDict("political");
    let teamInfo = {};
    let tInfo = await volunteerApi.getVolunteers('idNumber:' + ctx.session.user.idNumber + ',type:' + type, 0, -1);
    if (tInfo && tInfo.content.length) {
        teamInfo = tInfo.content[0];
        teamInfo.avatar = getFileUrl(teamInfo.avatar);
        if (politicalStatus) {
            politicalStatus.forEach(function(item) {
                if (item.code == teamInfo.politicalStatus) {
                    teamInfo.politicalStatusName = item.value;
                }
            })
        }

        if (occupation) {
            occupation.forEach(function(item) {
                if (item.code == teamInfo.occupation) {
                    teamInfo.occupationName = item.value;
                }
            })
        }

        if (education) {
            education.forEach(function(item) {
                if (item.code == teamInfo.education) {
                    teamInfo.educationName = item.value;
                }
            })
        }

        teamInfo.serviceTypesName = '';
        if (teamInfo.serviceTypes && teamInfo.serviceTypes.length > 0) {
            for (let i = 0; i < teamInfo.serviceTypes.length; i++) {
                serviceTypes.forEach(function(item) {
                    if (item.code == teamInfo.serviceTypes[i]) {
                        teamInfo.serviceTypesName += ' ' + item.value
                    }
                })
            }
        }
    }

    ctx.body = teamInfo;

})

/**
 * 志愿者活动报名
 */
router.post('/volunteer/actOrder', async (ctx, next) => {
    let userInfo = ctx.request.body;

    try {
        let res = await volunteerApi.joinactivity(userInfo);
        ctx.body = { success: true, msg: res };
    } catch (ex) {

        ctx.body = { success: false, msg: ex.response.data };
    }
})

/**
 * 报名志愿者
 */
router.post('/volunteer/enroll', async (ctx, next) => {

    let res = {
        success: false,
        msg: ''
    }
    let userInfo = ctx.request.body.fields;
    try {
        let result = await sysApi.saveFile(ctx.request.body.files.avatar);
        if (result.success) {
            userInfo.avatar = result.url;
            let user = ctx.session.user;
            userInfo.userId = user.id;
            userInfo.serviceTypes = JSON.parse(userInfo.serviceTypes);
            userInfo.idNumber = user.idNumber;

            let idInfo = getBirthday(user.idNumber);

            userInfo.sex = idInfo.sex;
            userInfo.birthDay = moment(idInfo.birthday).format('YYYY-MM-DD');
            userInfo.unitId = ctx.curUnit.id;
            let rlt = await volunteerApi.volunteerApply(userInfo);
            if (rlt.id) {
                res = {
                    success: true,
                    msg: '报名成功'
                }
            } else {
                res = {
                    success: false,
                    msg: '报名失败'
                }
            }

        } else {
            res = result;
        }
    } catch (ex) {
        res = {
            success: false,
            msg: '报名失败'
        }
    }
    ctx.body = res;

})

/** 类型 */
router.get('/volunDicts', async (ctx) => {
    let ActTypes = [];
    ActTypes = await sysApi.getDict('volunteerServiceType');
    ActTypes.splice(0, 0, { code: 'all', value: '全部' });
    ctx.body = {
        ActTypes: ActTypes
    }
});

/**
 * 志愿者/团队
 */
router.get('/volunteer/enroll', async (ctx, next) => {
    let serviceTypes = await sysApi.getDict("volunteerServiceType");
    let education = await sysApi.getDict("education");
    let occupation = await sysApi.getDict("occupation");
    let politicalStatus = await sysApi.getDict("political");
    let user = ctx.session.user;
    let teamInfo = false;
    let personalInfo = false;
    if (user.roles && user.roles.indexOf('volunteerTeam') >= 0) {
        let tInfo = await volunteerApi.getVolunteers('idNumber:' + ctx.session.user.idNumber + ',type:team', 0, -1);
        if (tInfo && tInfo.content.length) {
            teamInfo = tInfo.content[0];
            teamInfo.avatar = getFileUrl(teamInfo.avatar);
            teamInfo.serviceTypeNames = [];
            if (teamInfo.serviceTypes && teamInfo.serviceTypes.length && serviceTypes.length) {
                for (var j = 0; j < teamInfo.serviceTypes.length; j++) {
                    let code = serviceTypes.find(x => x.code === teamInfo.serviceTypes[j]);
                    if (code) {
                        teamInfo.serviceTypeNames.push(code.value);
                    }
                }
            }
            politicalStatus.forEach(function(item) {
                if (item.code == teamInfo.politicalStatus) {
                    teamInfo.politicalName = item.value;
                }
            })
            occupation.forEach(function(item) {
                if (item.code == teamInfo.occupation) {
                    teamInfo.occupationName = item.value;
                }
            })
            education.forEach(function(item) {
                if (item.code == teamInfo.education) {
                    teamInfo.educationName = item.value;
                }
            })
        }
    }
    if (user.roles && user.roles.indexOf('volunteerPersonal') >= 0) {

        let pInfo = await volunteerApi.getVolunteers('idNumber:' + ctx.session.user.idNumber + ',type:personal', 0, -1);
        if (pInfo && pInfo.content.length) {
            personalInfo = pInfo.content[0];
            personalInfo.avatar = getFileUrl(personalInfo.avatar);
            personalInfo.serviceTypeNames = [];
            if (personalInfo.serviceTypes && personalInfo.serviceTypes.length && serviceTypes.length) {
                for (var j = 0; j < personalInfo.serviceTypes.length; j++) {
                    let code = serviceTypes.find(x => x.code === personalInfo.serviceTypes[j]);
                    if (code) {
                        personalInfo.serviceTypeNames.push(code.value);
                    }
                }
            }
            politicalStatus.forEach(function(item) {
                if (item.code == personalInfo.politicalStatus) {
                    personalInfo.politicalName = item.value;
                }
            })
            occupation.forEach(function(item) {
                if (item.code == personalInfo.occupation) {
                    personalInfo.occupationName = item.value;
                }
            })
            education.forEach(function(item) {
                if (item.code == personalInfo.education) {
                    personalInfo.educationName = item.value;
                }
            })

        }
    }
    ctx.body = {
        teamInfo: teamInfo,
        personalInfo: personalInfo,
        serviceTypes: serviceTypes,
        education: education,
        occupation: occupation,
        politicalStatus: politicalStatus
    }
})

module.exports = router;
