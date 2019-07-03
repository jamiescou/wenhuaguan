import Layout from '@/pages/frame';
export default {
    path: '/assist',
    menuName: '活动辅助',
    code: '18',
    icon: 'assist',
    component: Layout,
    children: [
        { path: 'activity', code: '1801', menuName: '活动辅助管理', component: require('@/pages/assist/activity/activity_list') },
        { path: 'assist', code: '180101', menuName: '添加活动辅助', hidden: true, parent: '1801', component: require('@/pages/assist/activity/assist') },
        { path: 'assistview', code: '180102', menuName: '查看活动详情', hidden: true, parent: '1801', component: require('@/pages/assist/activity/assist_view') },
        { path: 'workss', code: '180103', menuName: '查看活动详情', hidden: true, parent: '1801', component: require('@/pages/assist/activity/workss') },

        { path: 'activity_draw', code: '1803', parent: '18', menuName: '抽签管理', component: require('@/pages/assist/draw/activity_draw') },
        { path: 'publish_draw', code: '180301', parent: '1803', hidden: true, menuName: '发起抽签', component: require('@/pages/assist/draw/publish_draw') },
        { path: 'submit_draw', code: '180302', parent: '1803', hidden: true, menuNamey: '提交抽签', component: require('@/pages/assist/draw/submit_draw') },
        { path: 'view_draw', code: '180303', parent: '1803', hidden: true, menuNamey: '查看抽签', component: require('@/pages/assist/draw/view_draw') },

        { path: 'workcollect', code: '1802', menuName: '征集管理', component: require('@/pages/assist/workcollect') },
        { path: 'workcollect_view', code: '180201', menuName: '作品审核', parent: '1802', hidden: true, component: require('@/pages/assist/workcollect_view') }
    ]
}
