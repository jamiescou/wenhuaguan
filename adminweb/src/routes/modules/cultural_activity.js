import Layout from '@/pages/frame';
export default {
    path: '/activity',
    menuName: '活动预定',
    code: '03',
    icon: 'activity',
    component: Layout,
    redirect: to => { return 'index' },
    children: [
        { path: 'index', code: '0301', menuName: '活动预定', component: require('@/pages/activity/index') },
        { path: 'activity', code: '030101', parent: '03', hidden: true, component: require('@/pages/activity/activity') },
        { path: 'viewactivity', code: '030102', parent: '03', hidden: true, component: require('@/pages/activity/view_activity') },
        { path: 'activityaudit', code: '0302', menuName: '活动审核', component: require('@/pages/activity/activity_audit') },

        { path: 'activitypublish', code: '0303', menuName: '活动发布', component: require('@/pages/activity/activity_publish') },
        { path: 'activityorder', code: '030301', parent: '0303', hidden: true, component: require('@/pages/activity/activity_order') },
        { path: 'questionnaire', code: '030302', parent: '0303', hidden: true, component: require('@/pages/activity/research') },
        { path: 'statistics', code: '030303', parent: '0303', hidden: true, component: require('@/pages/activity/statistics') },
        { path: 'record_list', code: '0305', parent: '0303', hidden: true, component: require('@/pages/activity/record_list') },
        { path: 'record', code: '0306', parent: '0303', hidden: true, component: require('@/pages/activity/record') },
        { path: 'viewrecord', code: '0307', parent: '0303', hidden: true, component: require('@/pages/activity/view_record') },

        { path: 'activityrecycle', code: '0304', menuName: '回收站', component: require('@/pages/activity/activity_recycle') }
    ]
}

// import Layout from '@/pages/frame';
// // import activity from '@/pages/activity/index.vue';
// export default {
//     path: '/activity',
//     menuName: '文化活动',
//     menuCode: '02',
//     icon: 'activity',
//     component: Layout,
//     redirect: to => { return 'aaa' },
//     children: [
//         {
//             path: '/aaa',
//             menuName: '政法管理',
//             menuCode: '0201',
//             component: Layout,
//             children: [
//                 {
//                     path: '/test',
//                     menuName: '重点人员管理',
//                     menuCode: '020101',
//                     component: Layout,
//                     children: [
//                         {
//                             path: 'test11',
//                             menuName: 'test11',
//                             menuCode: '02010101',
//                             component: require('@/pages/activity/index.vue')
//                         }
//                     ]
//                 }
//             ]
//         }
//     ]
// }
