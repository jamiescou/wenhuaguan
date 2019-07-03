let env = process.env.NODE_ENV || "development";
let configPath = './' + env;

const config = require(configPath.trim());

let customCfg = {
    paging: {
        comments: {
            size: 5
        },
        activity: {
            size: 16
        },
        venue: {
            size: 10
        },
        train: {
            size:12
        },
        favorite: {
            size: 100
        },
        issue: {
            size: 10
        },
        team: {
            size: 10
        },
        heritage: {
            size: 16
        },
        artexperts: {
            size: 16
        },
        volunrecruit: {
            size: 16
        },
        collect: {
            size: 16
        },
        vod:{
            size:16
        },
        onlineExhibition: {
            size: 16
        },
        brand: {
            size: 16
        },
        favorite:{
            size:-1
        },
        masorg:{
            size:16
        },
        userCenter:{
            size:8
        }

    },
    defaultRegion: {
        code: '430000'
    },
    authRouter: [
        '/train/order/',
        '/train/booking/',
        '/activity/order/',
        '/activity/booking/',
        '/magazine/booking/',
        '/venues/order/',
        '/venues/booking/',
        '/collect/booking/',
        '/collect/order/',
        '/collect/offlineAct/work',
        '/eventActivities/booking',
        '/volunrecruit/voluninfo',
        '/volunrecruit/enroll',  //成为志愿者
        '/volunrecruit/booking',  //志愿者报名
        '/volunrecruit/order',// 报名志愿者活动
        '/volunteer/booking',
        '/volunteer/bookingact',
        '/user',
        '/comments'
    ],

    
    column: {
        heritage: '非遗资讯',
        academy: '群文资讯',
        citystate: "市州动态"
        //   fg:'栏目'
    },
    exhibit: {
        heritage: '非遗展厅',
    }
}

Object.assign(customCfg, config)
module.exports = customCfg;