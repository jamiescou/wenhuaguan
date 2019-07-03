<template>
    <div class="list-wrapper">
        <v-pageheader :breadcrumbs="[{ name: titleInfo.name }]"></v-pageheader>
        <section class="search-wrapper">
            <el-form :inline="true" :model="searchForm" label-width="0">
                <el-form-item>
                    <el-input v-model="searchForm.name" placeholder="请输入活动名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="loadData">查询</el-button>
                </el-form-item>
            </el-form>
        </section>
        <div class="table-container">
            <el-table :data="dataList" border stripe v-loading.body="loading" tooltip-effect="custom-effect">
                <el-table-column label=" " type="index" align="center" width="80px"></el-table-column>
                <el-table-column label="名称" align="center" prop="name" width="260px">
                    <template scope="scope">
                        <router-link :to="{path:'viewactivity', query: {id: scope.row.id,flag:4}}" class="u-link">
                            {{scope.row.name}}
                        </router-link>
                    </template>
                </el-table-column>
                <el-table-column prop="artType" label="活动分类" align="center" :formatter="convertArtType"></el-table-column>
                <el-table-column prop="activityType" label="活动形式" align="center" :formatter="convertType"></el-table-column>
                <el-table-column label="活动时间" align="center">
                    <template scope="scope">
                        <div style="padding:5px 0 0;line-height:24px">{{scope.row.holdStartDate}}</div>
                        <div style="line-height:1">~</div>
                        <div style="padding:0 0 5px;line-height:24px">{{scope.row.holdEndDate}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="reserveType" label="订票方式" align="center" :formatter="convertReserveType" width="100px"></el-table-column>
                <el-table-column prop="creator.userName" label="创建人" align="center" width="100px"></el-table-column>
                <el-table-column prop="onlineStatus" label="状态" align="center" :formatter="formatterOnlineStatus" width="80px"></el-table-column>
                <!-- <el-table-column prop="" label="操作时间" align="center"></el-table-column> -->
                <el-table-column label="操作" align="center">
                    <template scope="scope">
                        <!--<a class="btn-act" @click="handleRestore(scope.row)">还原</a>-->
                        <a class="btn-act" @click="handleDel(scope.row)">删除</a>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination-container ">
                <v-pagination @pageChange="onCurrentChange" :total="total" :isShow="showPagination"></v-pagination>
            </div>
        </div>
    </div>
</template>
<script>
import BaseTable from '@/mixins/base-table';
import Api from '@/api';
import _status, { PARENT_NAME } from './activity_status'

export default {
    mixins: [BaseTable],
    data() {
        return {
            titleInfo: PARENT_NAME['4'],
            searchForm: { name: '' },          
        }
    },
    methods: {
        loadData() {           
            let user = this.$store.getters.user;
            let str = 'search=searchDataDeptId,onlineStatus:' + _status.STATUS.RECYCLED;
            if (this.searchForm.name) {
                str += ',name~' + this.searchForm.name;
            }
            this.showLoading();
            Api.activity.getActivityList(str, this.page, this.size).then((res) => {
                this.dataList = res.content;
                this.total = res.totalElements;
            }).finally(this.closeLoading);
        },
        // 删除活动
        handleDel(row) {
            let self = this;
            self.delConfirm('活动', () => {
                Api.activity.delActivity(row.id).then((res) => {
                    self.showTip();
                    self.loadData();
                });
            });
        },
        // 还原
        handleRestore(row) {
            this.$confirm('是否确认还原?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then((res) => {
                let user = this.$store.getters.user;
                let data = {
                    fromStatus: row.onlineStatus,
                    toStatus: _status.STATUS.WAITCOMMIT,
                    operatorDept: user.unit.name,
                    operatorName: user.name,
                    operateTime: this.formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss')
                };
                Api.activity.changeActivityOnline(row.id, data).then((res) => {
                    this.showTip();
                    this.loadData();
                });
            });
        },
        // 格式化状态信息
        formatterOnlineStatus(row) {
            let value = row.onlineStatus;
            return _status.statusName(value);
        },
        convertArtType(row, column, cellValue) {
            let artType = [];
            for (let item of cellValue) {
                if(this.dicts.getValueByCode('artistClass', item))  
                artType.push(this.dicts.getValueByCode('artistClass', item));
            }
            return artType.join('、');
        },
        convertType(row, column, cellValue) {
            let activityType = [];
            for (let item of cellValue) {
                if(this.dicts.getValueByCode('activityForm', item))  
                activityType.push(this.dicts.getValueByCode('activityForm', item));
            }
            return activityType.join('、');
        },
        convertReserveType(row, column, cellValue) {
            return _status.RESERVETYPE[cellValue];
        }
    },
    mounted() {
        // this.loadData();
    }
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">

</style>
