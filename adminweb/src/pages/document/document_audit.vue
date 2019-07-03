<template>
    <div class="list-wrapper activity-wrapper">
        <v-pageheader :breadcrumbs="[{ name: '群文作品审核' }]"></v-pageheader>
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
                        <!--<div style="line-height:1">~</div>
                        <div style="padding:0 0 5px;line-height:24px">{{scope.row.endTime}}</div>-->
                    </template>
                </el-table-column>
                <el-table-column prop="creator.userName" label="创建人" align="center" width="250px"></el-table-column>
                <el-table-column prop="createTime" label="创建时间" align="center" width="250px"></el-table-column>
                <el-table-column prop="onlineStatus" label="状态" align="center" width="80px">
                    <template scope="scope">
                        <div>
                            {{formatterOnlineStatus(scope.row)}}
                            <el-popover placement="top-start" width="200" trigger="hover" v-if="getFlows(scope.row.flowLogs)" popper-class="log-flow">
                                <h4 class="flow-title">拒绝理由</h4>
                                <p class="flow-content">{{getFlows(scope.row.flowLogs)}}</p>
                                <i class="sz-ico ico-reject" slot="reference"></i>
                            </el-popover>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="left">
                    <template scope="scope">
                      <div v-if="scope.row.onlineStatus==='WaitAudit'">
                        <a class="btn-act" @click="handleEdit(scope.row)">编辑</a>
                        <a class="btn-act" @click="handlePass(scope.row)">通过</a>
                        <a class="btn-act" @click="handleRegect(scope.row)">拒绝</a>
                        <!--<a class="btn-act" @click="handleRecord(scope.row)">作品管理</a>-->
                        <a class="btn-act" @click="handleRecyle(scope.row)">回收</a>
                      </div>
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
            searchForm: { name: '', onlineStatus: '' },
            dataList: [],
            dictNames: ['activityForm', 'artistClass']
        }
    },
    methods: {
        handleAdd() {
            this.$router.push('document');
        },
        loadData() {            
            let str = 'search=searchDataDeptId,onlineStatus:WaitAudit~Audited';
            let user = this.$store.getters.user;
            // str += ',dataDeptId:' + userunitid;
            if (this.searchForm.name) {
                str += ',name~' + this.searchForm.name;
            }
            str += '&sort=createTime~desc';
            this.showLoading();
            Api.document.getDocumentList(str, this.page, this.size).then((res) => {
                this.dataList = res.content;
                this.total = res.totalElements;
            }).finally(this.closeLoading);
        },
        // 作品管理
        handleRecord(row) {
            this.$router.push({ path: 'works', query: { id: row.id } });
        },
        // 编辑
        handleEdit(row) {
            this.$router.push({ path: 'document', query: { id: row.id, flag: 2 } });
        },
        callback() {
            this.showTip();
            this.loadData();
        },
        // 通过
        handlePass(row) {
            this.$confirm('是否确认通过?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'info'
            }).then((res) => {
                let user = this.$store.getters.user;
                let data = {
                    fromStatus: row.onlineStatus,
                    toStatus: _status.STATUS.AUDITED,
                    operatorDept: user.unit.name,
                    operatorName: user.name,
                    operateTime: this.formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss')
                };
                Api.document.changeDocumentOnline(row.id, data).then(this.callback);
            });
        },
        // 拒绝
        handleRegect(row) {
            this.$prompt('请输入拒绝理由', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            }).then(({ value }) => {
                let user = this.$store.getters.user;
                let data = {
                    fromStatus: row.onlineStatus,
                    toStatus: _status.STATUS.WAITCOMMIT,
                    operatorDept: user.unit.name,
                    operatorName: user.name,
                    operateTime: this.formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss'),
                    operDesc: value
                };
                Api.document.changeDocumentOnline(row.id, data).then(this.callback);
            }).catch();
        },
        // 回收
        handleRecyle(row) {
            this.$confirm('是否确认回收?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then((res) => {
                let user = this.$store.getters.user;
                let data = {
                    fromStatus: row.onlineStatus,
                    toStatus: _status.STATUS.RECYCLED,
                    operatorDept: user.unit.name,
                    operatorName: user.name,
                    operateTime: this.formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss')
                };
                Api.document.changeDocumentOnline(row.id, data).then(this.callback);
            });
        },
        // 格式化状态信息
        formatterOnlineStatus(row) {
            let value = row.onlineStatus;
            return _status.statusName(value);
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
        // this.loadData();
    }

}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">

</style>
