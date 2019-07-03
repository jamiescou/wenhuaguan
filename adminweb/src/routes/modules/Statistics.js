import Layout from '@/pages/frame';
export default {
    path: '/Statistics',
    menuName: '大数据统计',
    code: '23',
    icon: 'digital',
    component: Layout,
    redirect: to => { return 'index' },
    children: [
        { path: 'memberStatistics', code: '2301', menuName: '会员统计', component: require('@/pages/statistics/memberStatistics') },
        { path: 'activityStatistics', code: '2302', menuName: '活动统计', component: require('@/pages/statistics/activityStatistics') },
        // { path: 'venuesStatistics', code: '2303', menuName: '场馆统计', component: require('@/pages/statistics/venuesStatistics') },
        { path: 'trainStatistics', code: '2304', menuName: '培训统计', component: require('@/pages/statistics/trainStatistics') },
        { path: 'informationStatistics', code: '2305', menuName: '资讯统计', component: require('@/pages/statistics/informationStatistics') }
        // { path: 'exhibitsadd', code: '150104', hidden: true, parent: '1501', component: require('@/pages/digital/exhibits_add') },
        // { path: 'exhibitsview', code: '150105', hidden: true, parent: '1501', component: require('@/pages/digital/exhibits_view') }
    ]
}
