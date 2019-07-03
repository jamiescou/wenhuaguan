import Layout from '@/pages/frame';
export default {
    path: '/trains',
    menuName: '培训报名',
    code: '04',
    icon: 'train',
    component: Layout,
    redirect: to => { return 'index' },
    children: [
        { path: 'index', code: '0401', menuName: '培训管理', component: require('@/pages/train/index') },
        { path: 'trainaudit', code: '0402', menuName: '培训审核', component: require('@/pages/train/train_audit') },
        { path: 'trainpublish', code: '0403', menuName: '培训发布', component: require('@/pages/train/train_publish') },
        { path: 'trainorder', code: '040301', parent: '0403', hidden: true, component: require('@/pages/train/train_order') },
        { path: 'trainrecycle', code: '0404', menuName: '培训回收', component: require('@/pages/train/train_recycle') },
        { path: 'train', code: '0405', parent: '04', hidden: true, component: require('@/pages/train/train') },
        { path: 'viewtrain', code: '0406', parent: '04', hidden: true, component: require('@/pages/train/view_train') }
    ]
}
