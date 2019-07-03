// ************ 会员管理 **************************************/
import Layout from '@/pages/frame';
export default {
    path: '/user',
    menuName: '会员管理',
    code: '05',
    icon: 'member',
    component: Layout,
    redirect: to => { return 'index' },
    children: [
        { path: 'index', code: '0501', menuName: '会员列表', component: require('@/pages/user/index') },
        { name: 'userview', path: 'view/:id', hidden: true, code: '050101', parent: '0501', component: require('@/pages/user/view_user.vue') },
        { path: 'realmanager', code: '0502', menuName: '实名管理', component: require('@/pages/user/real_manager') },
        { path: 'blacklist', code: '0503', menuName: '黑名单', component: require('@/pages/user/blacklist') }
    ]
}
