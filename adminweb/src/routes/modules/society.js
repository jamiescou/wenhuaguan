import Layout from '@/pages/frame';
export default {
    path: '/society',
    menuName: '群文学会',
    code: '16',
    icon: 'society',
    component: Layout,
    redirect: to => { return 'index' },
    children: [
        { path: 'index', code: '1601', menuName: '群文学会管理', component: require('@/pages/culturesociety/index') },
        { path: 'societyadd', code: '160101', hidden: true, parent: '1601', component: require('@/pages/culturesociety/society_add') },
        { path: 'societyview', code: '160102', hidden: true, parent: '1601', component: require('@/pages/culturesociety/society_view') },
        { path: 'council', code: '160103', hidden: true, parent: '1601', component: require('@/pages/culturesociety/council') },
        { path: 'divisionadd', code: '160104', hidden: true, parent: '1601', component: require('@/pages/culturesociety/division_add') },
        { path: 'divisionview', code: '160105', hidden: true, parent: '1601', component: require('@/pages/culturesociety/division_view') },
        { path: 'member', code: '160103', hidden: true, parent: '1601', component: require('@/pages/culturesociety/member') },
        { path: 'memberview', code: '160103', hidden: true, parent: '1601', component: require('@/pages/culturesociety/member_view') },
        { path: 'applymemberview', code: '160103', hidden: true, parent: '1601', component: require('@/pages/culturesociety/applymember_view') }

    ]
}
