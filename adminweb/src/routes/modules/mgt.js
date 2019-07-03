import Layout from '@/pages/frame';
export default {
    path: '/mgt',
    menuName: '系统运维',
    code: '08',
    icon: 'mgt',
    component: Layout,
    redirect: to => { return 'index' },
    children: [
        { path: 'index', code: '0801', menuName: '问卷题库', component: require('@/pages/mgt/store_items') },
        { path: 'tagmanage', code: '0803', menuName: '标签管理', component: require('@/pages/mgt/tag_manage') },
        { path: 'looppic', code: '0804', menuName: '轮播图管理', component: require('@/pages/mgt/looppic_manage') },
        { path: 'brand', code: '0805', menuName: '文化品牌管理', component: require('@/pages/mgt/brand') },

        { path: 'advert', code: '0809', menuName: '漂浮广告管理', component: require('@/pages/mgt/advert') },

        { path: 'suggestions', code: '0807', menuName: '意见反馈管理', component: require('@/pages/mgt/suggestionsIndex') },
        { path: 'recommends', code: '0808', menuName: '推荐板块管理', component: require('@/pages/mgt/recommends') },
        { path: 'brandadd', code: '080501', parent: '0805', menuName: '添加文化品牌', hidden: true, component: require('@/pages/mgt/brand_add') },
      { path: 'advert_add', code: '080901', parent: '0809', menuName: '添加广告', hidden: true, component: require('@/pages/mgt/advert_add') },
        { path: 'brandview', code: '080502', parent: '0805', menuName: '查看文化品牌', hidden: true, component: require('@/pages/mgt/brand_view') },
        { path: 'digitinfos_list', code: '080503', parent: '0805', menuName: '品牌资源', hidden: true, component: require('@/pages/mgt/digitinfos_list') },
        { path: 'digitinfo', code: '080504', parent: '0805', menuName: '添加品牌资源', hidden: true, component: require('@/pages/mgt/digitinfos_add') },
        { path: 'digitinfos_detail', code: '080505', parent: '0805', menuName: '添加品牌资源', hidden: true, component: require('@/pages/mgt/digitinfos_detail') },
        { path: 'viewSuggestion', code: '080701', parent: '0807', hidden: true, menuName: '意见反馈管理', component: require('@/pages/mgt/viewSuggestion') }
        // { path: 'recommends', code: '0808', menuName: '推荐板块管理', component: require('@/pages/mgt/recommends') }
    ]
}
