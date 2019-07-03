import Layout from '@/pages/frame';
export default {
    path: '/information',
    menuName: '资讯管理',
    code: '06',
    icon: 'bulletin',
    component: Layout,
    children: [
        { path: 'index', code: '0601', menuName: '资讯公告', parent: '06', component: require('@/pages/information/index') },
        { path: 'information', hidden: true, code: '060101', parent: '0601', component: require('@/pages/information/information.vue') },
        { name: 'viewinfo', path: 'viewinformation/:id', hidden: true, code: '060102', parent: '0601', component: require('@/pages/information/view_information.vue') }
    ]
}
