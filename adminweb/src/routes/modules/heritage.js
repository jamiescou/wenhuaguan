import Layout from '@/pages/frame';
export default {
    path: '/heritage',
    menuName: '非遗资源管理',
    code: '07',
    icon: 'heritage',
    component: Layout,
    children: [
        { path: 'heritageRecord', code: '0703', parent: '07', hidden: true, component: require('@/pages/heritage/heritage_record_index') },
        { path: 'heritageRecordadd', code: '0704', parent: '07', hidden: true, component: require('@/pages/heritage/heritage_record') },
        { path: 'heritageViewrecord', code: '0705', parent: '07', hidden: true, component: require('@/pages/heritage/heritage_record_view') },
        { path: 'successorRecord', code: '0706', parent: '07', hidden: true, component: require('@/pages/heritage/successor_record_index') },
        { path: 'successorRecordadd', code: '0707', parent: '07', hidden: true, component: require('@/pages/heritage/successor_record') },
        { path: 'successorViewrecord', code: '0708', parent: '07', hidden: true, component: require('@/pages/heritage/successor_record_view') },
        { path: 'region', code: '0711', parent: '07', menuName: '区域概况', component: require('@/pages/heritage/region_index') },
        {
            path: 'directory',
            code: '0701',
            menuName: '非遗名录管理',
            component: Layout,
            redirect: to => { return 'index' },
            children: [
                { path: 'index', code: '070101', parent: '0701', menuName: '名录管理', component: require('@/pages/heritage/heritage_index') },
                { path: 'verify', code: '070102', parent: '0701', menuName: '名录审核', component: require('@/pages/heritage/heritage_verify') },
                { path: 'pulish', code: '070103', parent: '0701', menuName: '名录发布', component: require('@/pages/heritage/heritage_publish') },
                { path: 'recycle', code: '070104', parent: '0701', menuName: '名录回收', component: require('@/pages/heritage/heritage_recycle') },
                { path: 'heritage', hidden: true, code: '070105', parent: '0701', component: require('@/pages/heritage/heritage.vue') },
                { name: 'viewheritage', path: 'view/:id', hidden: true, code: '070106', parent: '0701', component: require('@/pages/heritage/view_heritage.vue') }
            ]
        },
        {
            path: 'successor',
            code: '0702',
            menuName: '传承人管理',
            component: Layout,
            redirect: to => { return 'index' },
            children: [
                { path: 'index', code: '070201', parent: '0702', menuName: '传承人管理', component: require('@/pages/heritage/successor_index') },
                { path: 'verify', code: '070202', parent: '0702', menuName: '传承人审核', component: require('@/pages/heritage/successor_verify') },
                { path: 'pulish', code: '070203', parent: '0702', menuName: '传承人发布', component: require('@/pages/heritage/successor_publish') },
                { path: 'recycle', code: '070204', parent: '0702', menuName: '传承人回收', component: require('@/pages/heritage/successor_recycle') },
                { path: 'successor', hidden: true, code: '070205', parent: '0702', component: require('@/pages/heritage/successor.vue') },
                { name: 'viewsuccessor', path: 'view/:id', hidden: true, code: '070206', parent: '0702', component: require('@/pages/heritage/view_successor.vue') }
            ]
        },
        {
            path: 'exhibit',
            code: '0709',
            menuName: '非遗展厅管理',
            component: Layout,
            redirect: to => { return 'index' },
            children: [
                { path: 'index', code: '070901', parent: '0709', menuName: '展厅管理', component: require('@/pages/heritage/exhibit_index') },
                { path: 'exhibitadd', code: '070902', parent: '0709', hidden: true, menuName: '添加展厅', component: require('@/pages/heritage/exhibit_add') },
                { path: 'exhibitview', code: '070903', parent: '0709', hidden: true, menuName: '展厅详情', component: require('@/pages/heritage/exhibit_view') },
                { path: 'exhibitunitindex', code: '070904', parent: '0709', hidden: true, menuName: '展厅详情', component: require('@/pages/heritage/exhibit_unitIndex') },
                { path: 'exhibitworksindex', code: '070905', parent: '0709', hidden: true, menuName: '作品管理', component: require('@/pages/heritage/exhibits_unit_works') },
                { path: 'exhibitworksadd', code: '070905', parent: '0709', hidden: true, menuName: '作品管理', component: require('@/pages/heritage/exhibits_works_add') },
                { path: 'exhibitworksveiw', code: '070905', parent: '0709', hidden: true, menuName: '作品管理', component: require('@/pages/heritage/exhibits_works_view') }
            ]
        },
        {
            path: 'area',
            code: '0710',
            menuName: '非遗保护区管理',
            component: Layout,
            redirect: to => { return 'index' },
            children: [
                { path: 'index', code: '071001', parent: '0710', menuName: '保护区编辑', component: require('@/pages/heritage/area_index') },
                { path: 'verify', code: '071002', parent: '0710', menuName: '保护区审核', component: require('@/pages/heritage/area_verify') },
                { path: 'publish', code: '071003', parent: '0710', menuName: '保护区管理', component: require('@/pages/heritage/area_publish') },
                { path: 'recycle', code: '071004', parent: '0710', menuName: '回收站', component: require('@/pages/heritage/area_recycle') },
                { path: 'areaadd', code: '071005', parent: '0710', hidden: true, menuName: '添加保护区', component: require('@/pages/heritage/area_Add') },
                { path: 'areaview', code: '071006', parent: '0710', hidden: true, menuName: '查看保护区', component: require('@/pages/heritage/area_view') }
            ]
        }
    ]
}
