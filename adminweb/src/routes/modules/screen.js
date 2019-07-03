import Layout from '@/pages/frame';
export default {
    path: '/screen',
    menuName: '大屏管理',
    code: '25',
    icon: 'big-screen',
    component: Layout,
    children: [
        { path: 'arts', code: '2501', menuName: '美术资源', component: require('@/pages/screen/arts/arts') },
        { path: 'artsadd', code: '250101', hidden: true, parent: '2501', component: require('@/pages/screen/arts/arts_add') },
        { path: 'artsview', code: '250102', hidden: true, parent: '2501', component: require('@/pages/screen/arts/arts_view') },

        { path: 'calligraphy', code: '2502', menuName: '书法资源', component: require('@/pages/screen/calligraphy/calligraphy') },
        { path: 'calligraphyadd', code: '250201', hidden: true, parent: '2502', component: require('@/pages/screen/calligraphy/calligraphy_add') },
        { path: 'calligraphyview', code: '250202', hidden: true, parent: '2502', component: require('@/pages/screen/calligraphy/calligraphy_view') },

        { path: 'photo', code: '2503', menuName: '摄影资源', component: require('@/pages/screen/photo/photo') },
        { path: 'photoadd', code: '250301', hidden: true, parent: '2503', component: require('@/pages/screen/photo/photo_add') },
        { path: 'photoview', code: '250302', hidden: true, parent: '2503', component: require('@/pages/screen/photo/photo_view') },

        { path: 'heritage', code: '2504', menuName: '非遗资源', component: require('@/pages/screen/heritage/heritage') },
        { path: 'heritageadd', code: '250401', hidden: true, parent: '2504', component: require('@/pages/screen/heritage/heritage_add') },
        { path: 'heritageview', code: '250402', hidden: true, parent: '2504', component: require('@/pages/screen/heritage/heritage_view') },

        { path: 'culturalMan', code: '2505', menuName: '文化名人', component: require('@/pages/screen/culturalMan/culturalMan') },
        { path: 'culturalManadd', code: '250501', hidden: true, parent: '2505', component: require('@/pages/screen/culturalMan/culturalMan_add') },
        { path: 'culturalManview', code: '250502', hidden: true, parent: '2505', component: require('@/pages/screen/culturalMan/culturalMan_view') }
    ]
}
