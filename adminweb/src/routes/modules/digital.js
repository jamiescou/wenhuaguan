import Layout from '@/pages/frame';
export default {
    path: '/digital',
    menuName: '数字展览管理',
    code: '15',
    icon: 'digital',
    component: Layout,
    redirect: to => { return 'index' },
    children: [
        { path: 'index', code: '1501', menuName: '数字展览管理', component: require('@/pages/digital/index') },
        { path: 'digitaladd', code: '150101', hidden: true, parent: '1501', component: require('@/pages/digital/digital_add') },
        { path: 'digitalview', code: '150102', hidden: true, parent: '1501', component: require('@/pages/digital/digital_view') },
        { path: 'exhibits', code: '150103', hidden: true, parent: '1501', component: require('@/pages/digital/exhibits') },
        { path: 'exhibitsadd', code: '150104', hidden: true, parent: '1501', component: require('@/pages/digital/exhibits_add') },
        { path: 'exhibitsview', code: '150105', hidden: true, parent: '1501', component: require('@/pages/digital/exhibits_view') }
    ]
}
