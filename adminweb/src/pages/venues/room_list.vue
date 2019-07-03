<template>
    <div class="activityRoomManage">
        <v-pageheader :breadcrumbs="[{ name: '活动室编辑' }]"></v-pageheader>
        <div class="right-opers">
            <el-button type="primary" @click="handleAdd">添加活动室</el-button>
        </div>
        <section class="search-wrapper">
            <el-form :inline="true" :model="searchForm" label-width="0">
                <el-form-item>
                    <el-input v-model="searchForm.name" placeholder="请输入活动室名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="searchForm.venue.id" placeholder="请选择所属场馆" clearable>
                        <v-venueOpts></v-venueOpts>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="searchForm.status" placeholder="请选择上架状态" clearable>
                        <el-option v-for="item in optionsList" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="loadData">查询</el-button>
                </el-form-item>
            </el-form>
        </section>
        <roomsTable :flag="1" :search="searchStr" key="WAITCOMMIT"></roomsTable>
    </div>
</template>

<script>
import roomsTable from './modules/roomsTable';
import roomStatus, { PARENT_NAME } from './modules/status'
import venueOpts from './modules/venue_opts'
export default {
    components: {
        roomsTable,
        'v-venueOpts': venueOpts
    },
    data() {
        return {
            pageName: PARENT_NAME['1'].name,
            searchForm: { venue: { id: '' }, name: '', unit: '', status: '' },
            statusOpts: roomStatus.STATUS_OPTION,
            defaultSearch:"",
            searchStr: 'searchUnitId,',
            optionsList: [
                { value: roomStatus.STATUS.WAITCOMMIT, label:  '待提交' },
                { value: roomStatus.STATUS.WAITAUDIT, label: '待审核'},
                { value: roomStatus.STATUS.AUDITED, label: '已审核' },
                { value: roomStatus.STATUS.PUBLISHED, label: '已上架'},
                { value: roomStatus.STATUS.OFFLINE, label: '已下架' }               
            ],
        }
    },
    methods: {
        handleAdd() {
            this.$router.push('room');
        },
        // 查询
        loadData() {           
            let str = 'searchUnitId,';            
            let venue = this.searchForm.venue; // 场馆
            let name = this.searchForm.name; // 活动室名称
            let status = this.searchForm.status; // 状态
            if (venue && venue.id !== '') str += 'venue.id:' + venue.id;
            if (name !== '') str += ',name~' + name;
            if (status !== '') str += ',onlineStatus:' + status;
            this.searchStr = str;
        }
    },
    mounted() {
    }
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
.activityRoomManage {
  position: relative;
  .right-opers {
    position: absolute;
    z-index: 10;
    text-align: right;
    right: 0;
    margin-top: 20px;
  }
  .venue-tabs {
    margin-top: 20px;
  }
}
</style>
