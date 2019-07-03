import Layout from '@/pages/frame';
export default {
    path: '/magazine',
    menuName: '电子杂志管理',
    code: '13',
    icon: 'magazine',
    component: Layout,
    redirect: to => { return 'index' },
    children: [
        { path: 'index', code: '1301', menuName: '杂志管理', component: require('@/pages/magazine/index') },
        { path: 'magazineissue', code: '130101', parent: '1301', menuName: '期刊', hidden: true, component: require('@/pages/magazine/magazineissue') },
        { path: 'magazineissueadd', code: '130102', parent: '1301', menuName: '新增期刊', hidden: true, component: require('@/pages/magazine/magazineissue_add') },
        { path: 'magazineissueview', code: '130103', parent: '1301', menuName: '查看期刊', hidden: true, component: require('@/pages/magazine/magazineissue_view') },
        { path: 'directory', code: '1302', menuName: '资源文件管理', component: require('@/pages/magazine/directory_manage') },
        { path: 'magazineissueview', code: '130103', parent: '1301', menuName: '查看期刊', hidden: true, component: require('@/pages/magazine/magazineissue_view') },
        { path: 'contribute', code: '130104', parent: '1301', menuName: '稿件', hidden: true, component: require('@/pages/magazine/contribute') },
        { path: 'contributeview', code: '130105', parent: '1301', menuName: '查看稿件', hidden: true, component: require('@/pages/magazine/contribute_view') }
    ]
}
