import Layout from '@/pages/frame';
export default {
    path: '/supply',
    menuName: '文化配送管理',
    code: '14',
    icon: 'supply',
    component: Layout,
    redirect: to => { return 'index' },
    children: [
        { path: 'index', code: '1401', menuName: '文化配送管理', component: require('@/pages/supply/index') },
        { path: 'supplyadd', code: '140101', hidden: true, parent: '1401', component: require('@/pages/supply/supply_add') },
        { path: 'supplyview', code: '140102', hidden: true, parent: '1401', component: require('@/pages/supply/supply_view') }
    ]
}
