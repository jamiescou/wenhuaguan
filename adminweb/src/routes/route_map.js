import SystemRouter from './modules/system' // 01 系统管理
import venues from './modules/venues' // 02 场馆
import culturalActivity from './modules/cultural_activity' // 03 文化活动
import trains from './modules/trains' // 04 培训
import user from './modules/user' // 05 会员
import info from './modules/information' // 06 咨询
import heritage from './modules/heritage' // 07 非遗（名录、继承人）
import mgt from './modules/mgt' // 08 系统运维
import cultureTeam from './modules/culture_team' // 09 文化团队
import nouns from './modules/volunteer' // 10 志愿者管理
import literary from './modules/literary' // 11 文艺人才
import document from './modules/document' // 12 群文征集
import magazine from './modules/magazine' // 13 电子杂志
import supply from './modules/supply' // 14 文化配送
import digital from './modules/digital' // 15 数字展览
import society from './modules/society' // 16 群文学会
import vod from './modules/vod' // 17 文化视频
import assist from './modules/assist' // 18 活动辅助
import notice from './modules/notice' // 19 通知管理
import massorg from './modules/massorg' // 20 群团组织管理
import Statistics from './modules/Statistics' // 23 大数据统计
import platform from './modules/platform' // 24 平台管理
import screen from './modules/screen' // 25 大屏管理
import photographyCollect from './modules/photographyCollect' // 26 湖南省艺术摄影学会

export const home = {
    path: '/home',
    menuName: '首页',
    icon: 'home',
    code: '-1',
    seqno: -1,
    component: require('@/pages/home/index')
}

let ResetPwdRouter = {
    hidden: true,
    path: 'resetpwd',
    menuName: '重置密码',
    icon: 'setting',
    code: '-1',
    component: require('@/pages/resetpwd')
}

export default [{
    path: '/',
    seqenceNum: -1,
    redirect: to => { return '/home' },
    component: (resolve) => require(['@/pages/index.vue'], resolve),
    children: [
        ResetPwdRouter,
        SystemRouter,
        culturalActivity,
        venues,
        trains,
        user,
        info,
        heritage,
        mgt,
        cultureTeam,
        nouns,
        literary,
        document,
        magazine,
        supply,
        digital,
        vod,
        society,
        assist,
        notice,
        massorg,
        Statistics,
        platform,
        screen,
        photographyCollect
    ]
}]
