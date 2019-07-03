import Layout from '@/pages/frame';
export default {
    path: '/photographyCollect',
    menuName: '湖南省艺术摄影学会',
    code: '26',
    icon: 'team',
    component: Layout,
    redirect: to => { return 'index' },
    children: [
        // { path: 'index', code: '2601', menuName: '关于学会', parent: '26', component: require('@/pages/aboutsociety/index') },
        // { path: 'newsflash', code: '2602', menuName: '资讯快报', parent: '26', component: require('@/pages/newsflash/index') },
        // { path: 'information', hidden: true, code: '260201', parent: '2602', component: require('@/pages/information/information.vue') },
        // { name: 'viewinfo', path: 'viewinformation/:id', hidden: true, code: '260202', parent: '2602', component: require('@/pages/information/view_information.vue') },
        {   path: 'eventActivities',
            code: '2603',
            parent: '26',
            menuName: '赛事活动',
            component: require('@/pages/eventActivities/index'),
            component: Layout,
            redirect: to => { return 'index' },
            children: [
                { path: 'index', code: '260301', parent: '2603',menuName: '赛事活动编辑', component: require('@/pages/eventActivities/index') },
                { path: 'document', code: '26030101', parent: '260301', hidden: true, component: require('@/pages/eventActivities/document') },
                { path: 'viewdocument', code: '26030102', parent: '260301', hidden: true, component: require('@/pages/eventActivities/view_document') },
                { path: 'documentaudit', code: '260303',parent: '2603', menuName: '赛事活动审核', component: require('@/pages/eventActivities/document_audit') },
                { path: 'documentpublish', code: '260304',parent: '2603', menuName: '赛事活动发布', component: require('@/pages/eventActivities/document_publish') },
                { path: 'documentrecycle', code: '260305', parent: '2603', menuName: '回收站', component: require('@/pages/eventActivities/document_recycle') },
                { path: 'works', code: '260306', parent: '2603', hidden: true, component: require('@/pages/eventActivities/works') },
                { path: 'viewworks', code: '260307', parent: '2603', hidden: true, component: require('@/pages/eventActivities/view_works') },
                { path: 'usereventview', code: '260308', parent: '2603', hidden: true, component: require('@/pages/eventActivities/view_user') },
            ]
        },
        { path: 'memberWorks', code: '2604', menuName: '会员作品', component: require('@/pages/memberWorks/index') },
        { path: 'cultureteam_add', code: '260401', parent: '2604', hidden: true, component: require('@/pages/memberWorks/cultureteam_add') },
        { path: 'cultureteam_detail', code: '260402', parent: '2604', hidden: true, component: require('@/pages/memberWorks/cultureteam_detail') },
        { path: 'cultureteam_mien', code: '260403', parent: '2604', hidden: true, component: require('@/pages/memberWorks/cultureteam_mien') },
        { path: 'cultureteam_person', code: '260404', parent: '2604', hidden: true, component: require('@/pages/memberWorks/cultureteam_person') },
        { path: 'mien_add', code: '26040301', parent: '2604', hidden: true, component: require('@/pages/memberWorks/mien_add') },
        { path: 'mien_detail', code: '26040302', parent: '2604', hidden: true, component: require('@/pages/memberWorks/mien_detail') },
        { path: 'person_add', code: '26040401', parent: '2604', hidden: true, component: require('@/pages/memberWorks/person_add') },
        { path: 'person_detail', code: '26040402', parent: '2604', hidden: true, component: require('@/pages/memberWorks/person_detail') }
    ]
}
