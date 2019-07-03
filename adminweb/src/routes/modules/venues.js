import Layout from '@/pages/frame';
export default {
    path: '/venues',
    menuName: '场馆预定',
    code: '02',
    icon: 'org',
    component: Layout,
    redirect: to => { return 'venuesmanage' },
    children: [
        { path: 'venuesmanage', code: '0201', menuName: '场馆预定', parent: '02', component: require('@/pages/venues/venue_manage') },
        { path: 'venue', hidden: true, code: '020101', parent: '0201', component: require('@/pages/venues/venue.vue') },
        { name: 'viewVenue', path: 'viewVenue/:id', hidden: true, code: '020102', parent: '0201', component: require('@/pages/venues/view_venue.vue') },
        { path: 'record', code: '020103', parent: '0201', hidden: true, component: require('@/pages/venues/record') },
        { path: 'recordadd', code: '020104', parent: '0201', hidden: true, component: require('@/pages/venues/recordAdd') },
        { path: 'viewrecord', code: '020105', parent: '0201', hidden: true, component: require('@/pages/venues/view_record') },
        {
            path: 'activityroom',
            code: '0202',
            menuName: '活动室管理',
            component: Layout,
            redirect: to => { return 'eidtList' },
            children: [
                { path: 'list', code: '020201', parent: '0202', menuName: '活动室编辑', component: require('@/pages/venues/room_list') },
                { path: 'verify', code: '020202', parent: '0202', menuName: '活动室审核', component: require('@/pages/venues/room_verify') },
                { path: 'pulish', code: '020203', parent: '0202', menuName: '活动室发布', component: require('@/pages/venues/room_publish') },
                { path: 'recycle', code: '020204', parent: '0202', menuName: '活动室回收', component: require('@/pages/venues/room_recycle') },
                { path: 'room', hidden: true, code: '020205', parent: '0202', component: require('@/pages/venues/room.vue') },
                { name: 'view', path: 'view/:id', hidden: true, code: '020206', parent: '0202', component: require('@/pages/venues/view_room.vue') },
                { path: 'roomorders', hidden: true, code: '020207', parent: '0202', component: require('@/pages/venues/roomorders.vue') }
            ]
        }
    ]
}
