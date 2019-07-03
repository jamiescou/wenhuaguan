import Layout from '@/pages/frame';
export default {
    path: '/system',
    menuName: '系统管理',
    code: '01',
    icon: 'setting',
    component: Layout,
    redirect: to => { return 'cultcenter' },
    children: [
        // 部门管理
        { path: 'orgmanage', code: '0101', menuName: '部门管理', component: require('@/pages/system/organizations/org_manage') },
        { path: 'authoritymanage', code: '0102', menuName: '角色管理', component: require('@/pages/system/authoritys/authority_manage') },
        { path: 'accountmanage', code: '0103', menuName: '账号管理', component: require('@/pages/system/accounts/account_manage') }
    ]
}
