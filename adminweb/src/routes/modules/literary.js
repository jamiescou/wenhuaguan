import Layout from '@/pages/frame';
export default {
    path: '/literary',
    menuName: '文艺人才管理',
    code: '11',
    icon: 'artist',
    component: Layout,
    redirect: to => { return 'index' },
    children: [
        { path: 'index', code: '1101', menuName: '文艺人才', component: require('@/pages/literary/index') },
        { path: 'index_zj', code: '1102', menuName: '专家', component: require('@/pages/literary/index_zj') },
        { path: 'literary_add', code: '110101', parent: '1101', hidden: true, component: require('@/pages/literary/literary_add') },
        { path: 'literary_detail', code: '110102', parent: '1101', hidden: true, component: require('@/pages/literary/literary_detail') }
    ]
}
