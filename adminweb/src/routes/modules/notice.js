import Layout from '@/pages/frame';
export default {
    path: '/notice',
    menuName: '通知管理',
    code: '19',
    icon: 'notice',
    component: Layout,
    redirect: to => { return 'index' },
    children: [
        { path: 'index', code: '1901', icon: 'fasong', menuName: '通知管理', component: require('@/pages/notice/index') },
        { path: 'notice', code: '190101', menuName: '新增通知', hidden: true, parent: '1901', component: require('@/pages/notice/notice') },
        { path: 'noticeview', code: '190102', menuName: '查看通知详情', hidden: true, parent: '1901', component: require('@/pages/notice/notice_view') },

        { path: 'mynotice', code: '1902', icon: 'tongzhi', menuName: '消息', component: require('@/pages/notice/my_notice') }
    ]
}
