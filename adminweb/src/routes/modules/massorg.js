import Layout from '@/pages/frame';
export default {
    path: '/massorgmanage',
    menuName: '群团组织管理',
    code: '20',
    icon: 'heritage',
    component: Layout,
    children: [
        { path: 'index', code: '2001', parent: '20', menuName: '群团组织', component: require('@/pages/massorg/massorg_manage') },
        { path: 'massorg', code: '200101', parent: '20', menuName: '编辑', hidden: true, component: require('@/pages/massorg/massorg') },
        { path: 'viewmassorg', code: '200104', parent: '20', menuName: '查看', hidden: true, component: require('@/pages/massorg/view_massorg') },
        { path: 'learnannual', code: '2002', parent: '20', menuName: '学会年审', component: require('@/pages/massorg/massorg_learnannual') },
        { path: 'massorg_mien', code: '200102', parent: '2001', hidden: true, component: require('@/pages/massorg/massorg_mien') },
        { path: 'mien_add', code: '200103', parent: '2001', hidden: true, component: require('@/pages/massorg/mien_add') },
        { path: 'miendetail', code: '200105', parent: '2001', hidden: true, component: require('@/pages/massorg/mien_detail') },
        { path: 'viewmassorglearnannual', code: '200105', parent: '2001', hidden: true, component: require('@/pages/massorg/view_massorg_learnannual') }
    ]
}
