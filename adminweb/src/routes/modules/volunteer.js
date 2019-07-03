import Layout from '@/pages/frame';
export default {
    path: '/volunteer',
    menuName: '志愿者管理',
    code: '10',
    icon: 'volun',
    component: Layout,
    redirect: to => { return 'activity_list' },
    children: [
       /* { path: 'index', code: '1001', menuName: '志愿者团队管理', component: require('@/pages/volunteer/index') },
        { path: 'team_detail', code: '100102', parent: '1001', hidden: true, component: require('@/pages/volunteer/team_view') },
        { path: 'team', code: '100101', parent: '1001', hidden: true, component: require('@/pages/volunteer/team') },
        { path: 'team_member', code: '100103', parent: '1001', hidden: true, component: require('@/pages/volunteer/team_member') },*/

        { path: 'activity_list', code: '1002', menuName: '志愿者活动管理', component: require('@/pages/volunteer/activity_list') },
        { path: 'activity_view', code: '100201', parent: '1002', hidden: true, component: require('@/pages/volunteer/activity_view') },
        { path: 'activity', code: '100202', parent: '1002', hidden: true, component: require('@/pages/volunteer/activity') },
        { path: 'digitinfos_list', code: '100203', parent: '1002', hidden: true, component: require('@/pages/volunteer/digitinfos_list') },
        { path: 'digitinfo', code: '100204', parent: '1002', hidden: true, component: require('@/pages/volunteer/digitinfos_add') },
        { path: 'digitinfos_detail', code: '100205', parent: '1002', hidden: true, component: require('@/pages/volunteer/digitinfos_detail') },
        { path: 'activity_person', code: '100206', parent: '1002', hidden: true, component: require('@/pages/volunteer/activity_member') },
        { path: 'view_member', code: '100207', parent: '1002', hidden: true, component: require('@/pages/volunteer/view_member') },
        { path: 'person_list', code: '1003', menuName: '志愿者管理', component: require('@/pages/volunteer/nouns_person') },
        { path: 'person_detail', code: '1005', parent: '10', hidden: true, component: require('@/pages/volunteer/person_detail') },

        { path: 'auditlist', code: '1004', menuName: '志愿者审核', component: require('@/pages/volunteer/audit_list') }
    ]
}
