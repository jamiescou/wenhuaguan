import Layout from '@/pages/frame';
export default {
    path: '/cultureteam',
    menuName: '文化团队管理',
    code: '09',
    icon: 'team',
    component: Layout,
    redirect: to => { return 'index' },
    children: [
        { path: 'index', code: '0901', menuName: '团队管理', component: require('@/pages/cultureteam/index') },
        { path: 'cultureteam_add', code: '090101', parent: '0901', hidden: true, component: require('@/pages/cultureteam/cultureteam_add') },
        { path: 'cultureteam_detail', code: '090102', parent: '0901', hidden: true, component: require('@/pages/cultureteam/cultureteam_detail') },
        { path: 'cultureteam_mien', code: '090103', parent: '0901', hidden: true, component: require('@/pages/cultureteam/cultureteam_mien') },
        { path: 'cultureteam_person', code: '090104', parent: '0901', hidden: true, component: require('@/pages/cultureteam/cultureteam_person') },
        { path: 'mien_add', code: '09010301', parent: '0901', hidden: true, component: require('@/pages/cultureteam/mien_add') },
        { path: 'mien_detail', code: '09010302', parent: '0901', hidden: true, component: require('@/pages/cultureteam/mien_detail') },
        { path: 'person_add', code: '09010401', parent: '0901', hidden: true, component: require('@/pages/cultureteam/person_add') },
        { path: 'person_detail', code: '09010402', parent: '0901', hidden: true, component: require('@/pages/cultureteam/person_detail') }
    ]
}
