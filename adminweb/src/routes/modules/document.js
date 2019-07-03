import Layout from '@/pages/frame';
export default {
    path: '/document',
    menuName: '群文作品管理',
    code: '12',
    icon: 'artwork',
    component: Layout,
    redirect: to => { return 'index' },
    children: [
        { path: 'index', code: '1201', menuName: '群文作品编辑', component: require('@/pages/document/index') },
        { path: 'document', code: '120101', parent: '1201', hidden: true, component: require('@/pages/document/document') },
        { path: 'viewdocument', code: '120102', parent: '12', hidden: true, component: require('@/pages/document/view_document') },
        { path: 'documentaudit', code: '1202', menuName: '群文作品审核', component: require('@/pages/document/document_audit') },
        { path: 'documentpublish', code: '1203', menuName: '群文作品发布', component: require('@/pages/document/document_publish') },
        { path: 'documentrecycle', code: '1204', menuName: '回收站', component: require('@/pages/document/document_recycle') },
        { path: 'works', code: '1205', parent: '12', hidden: true, component: require('@/pages/document/works') },
        { path: 'viewworks', code: '1206', parent: '12', hidden: true, component: require('@/pages/document/view_works') }

    ]
}
