import Layout from '@/pages/frame';
export default {
    path: '/platform',
    menuName: '平台管理',
    code: '24',
    icon: 'setting',
    component: Layout,
    children: [
        { path: 'cultcenter', code: '2401', menuName: '分馆管理', component: require('@/pages/system/organizations/cult_center') },
        { path: 'systemenus', code: '2402', menuName: '菜单管理', component: require('@/pages/system/syste_menus') },
        { path: 'systemparams', code: '2403', menuName: '系统参数管理', component: require('@/pages/system/params/system_params') },
        { path: 'dicmanage', code: '2404', menuName: '分类管理', component: require('@/pages/system/dic_manage') },
        { path: 'devices', code: '2405', menuName: '设备管理', component: require('@/pages/system/devices/index') },
        { path: 'commentaudit', code: '2406', menuName: '评论管理', component: require('@/pages/mgt/comment') },
        { path: 'columns', code: '2407', menuName: '资讯栏目', component: require('@/pages/information/columns') }
    ]
}
