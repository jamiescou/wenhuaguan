<template>
    <div class="venueManage">
        <v-pageheader :breadcrumbs="[{ name: pageName }]"></v-pageheader>
        <section class="search-wrapper">
            <el-form :inline="true" :model="searchForm" label-width="0">
                <el-form-item>
                    <el-input v-model="searchForm.name" placeholder="请输入活动室名称"></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="loadData">查询</el-button>
                </el-form-item>
            </el-form>
        </section>
        <roomsTable :flag="2" :search="searchStr" key="WAITAUDIT"></roomsTable>
    </div>
</template>

<script>
import roomsTable from './modules/roomsTable';
import venueOpts from './modules/venue_opts';
import roomStatus, { PARENT_NAME } from './modules/status';
export default {
    components: {
        roomsTable,
        'v-venueOpts': venueOpts
    },
    data() {
        return {
             pageName: PARENT_NAME['2'].name,
            searchForm: { venue: { id: '' }, name: '', unit: '', status: '' },
            searchStr: 'searchUnitId,onlineStatus:' + roomStatus.STATUS.WAITAUDIT
        }
    },
    methods: {
        // 查询
        loadData() {
            let str = 'searchUnitId,';     
            let venue = this.searchForm.venue; // 场馆
            let name = this.searchForm.name; // 活动室名称
            str += 'onlineStatus:' + roomStatus.STATUS.WAITAUDIT+ '~' + roomStatus.STATUS.AUDITED;

            if (venue && venue.id !== '') str += ',venue.id:' + venue.id;
            if (name !== '') str += ',name~' + name;
            this.searchStr = str;
        }
    },
    mounted() {
    }
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">

</style>
