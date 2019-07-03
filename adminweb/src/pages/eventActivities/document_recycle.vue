<template>
    <div class="list-wrapper activity-wrapper">
        <v-pageheader :breadcrumbs="[{ name: '回收站' }]"></v-pageheader>
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
                <el-table-column label="活动名称" prop="name" width="260px">
                    <template scope="scope">
                        <router-link :to="{path:'viewdocument', query: {id: scope.row.id,flag:1}}" class="u-link">
                            {{scope.row.name}}
                        </router-link>
                    </template>
                </el-table-column>
                <el-table-column label="活动征集时间" align="center">
                    <template scope="scope">
                        <div style="padding:5px 0 0;line-height:24px">{{scope.row.startTime}} ~ {{scope.row.endTime}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="creator.userName" label="创建人" align="center" width="250px"></el-table-column>
                <el-table-column prop="createTime" label="创建时间" align="center" width="250px"></el-table-column>
                <el-table-column prop="onlineStatus" label="状态" align="center" :formatter="formatterOnlineStatus" width="80px"></el-table-column>
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
import _status from './document_status'

export default {
    mixins: [BaseTable],
    data() {
        return {
            searchForm: { name: '' }
        }
    },
    methods: {
        handleAdd() {
            this.$router.push('document');
        },
        loadData() {            
            //                let user = this.$store.getters.user;
            //                let str = 'search=dataDeptId:' + user.unit.id + ',' + 'unit.id:' + user.orgUnit.id;
            let str = 'search=searchDataDeptId,onlineStatus:Recycled';
            let user = this.$store.getters.user;
            // str += ',dataDeptId:' + userunitid;
            if (this.searchForm.name) {
                str += ',name~' + this.searchForm.name;
            }
            this.showLoading();
            Api.eventActivities.getEventActivitiesList(str, this.page, this.size).then((res) => {
                this.dataList = res.content;
                this.total = res.totalElements;
            }).finally(this.closeLoading);
        },
        // 删除活动
        handleDel(row) {
            let self = this;
            self.delConfirm('征集活动', () => {
                Api.eventActivities.delDocument(row.id).then((res) => {
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
                Api.eventActivities.changeDocumentOnline(row.id, data).then((res) => {
                    this.showTip();
                    this.loadData();
                });
            });
        },
        hasCommitAudit(row) {
            return _status.hasCommitAuditPermission(row.onlineStatus);
        },
        // 取最后一条拒绝信息
        getFlows(flows) {
            let operDesc = null;
            if (flows != null && flows.length > 0) {
                if (flows[flows.length - 1].fromStatus === 'WaitAudit') {
                    operDesc = flows[flows.length - 1].operDesc;
                }
            }
            return operDesc;
        }
    },
    mounted() {
    }

}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">

</style>
