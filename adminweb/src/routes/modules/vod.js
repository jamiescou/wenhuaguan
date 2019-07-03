import Layout from '@/pages/frame';
export default {
    path: '/vod',
    menuName: '文化视频管理',
    code: '17',
    icon: 'vod',
    component: Layout,
    redirect: to => { return 'live' },
    children: [
        { path: 'live', code: '1701', menuName: '直播管理', component: require('@/pages/vod/live') },
        { path: 'demand', code: '1702', menuName: '点播管理', component: require('@/pages/vod/demand') },
        { path: 'liveadd', code: '170101', menuName: '新增直播', hidden: true, parent: '1701', component: require('@/pages/vod/live_add') },
        { path: 'liveview', code: '170102', menuName: '查看直播详情', hidden: true, parent: '1701', component: require('@/pages/vod/live_view') },
        { path: 'demandadd', code: '170201', menuName: '新增点播', hidden: true, component: require('@/pages/vod/demand_add') },
        { path: 'demandview', code: '170201', menuName: '查看点播详情', hidden: true, component: require('@/pages/vod/demand_view') }
    ]
}
