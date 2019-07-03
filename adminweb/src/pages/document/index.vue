<template>
    <div class="list-wrapper activity-wrapper">
        <v-pageheader :breadcrumbs="[{ name: '群文作品编辑' }]"></v-pageheader>
        <div class="right-opers">
            <el-button type="primary" @click="handleAdd" icon="plus">新增</el-button>
        </div>
        <section class="search-wrapper">
            <el-form :inline="true" :model="searchForm" label-width="0">
                <el-form-item>
                    <el-input v-model="searchForm.name" placeholder="请输入活动名称"></el-input>
                </el-form-item>
                <!-- <el-form-item>
                    <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>-->
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
                        <a class="btn-act" @click="handleEdit(scope.row)" v-if="hasEdit(scope.row)">编辑</a>
                        <a class="btn-act" @click="handleVerify(scope.row)" v-if="hasCommitAudit(scope.row)">提交审核</a>
                        <!--<a class="btn-act" @click="handleRecord(scope.row)">作品管理</a>-->
                        <a class="btn-act" @click="handleDel(scope.row)" v-if="hasDel(scope.row)">删除</a>
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
            searchForm: { name: '', status: 'onlineStatus!Recycled' },
            // searchForm: { name: '', status: '' },
            dataList: [],
            options: _status.STATUS_OPTION,
            dictNames: ['activityForm', 'artistClass']
        }
    },
    methods: {
        handleAdd() {
            this.$router.push('document');
        },
        loadData() {                    
            let str = 'search=searchDataDeptId';
            let user = this.$store.getters.user;
            // str += 'dataDeptId:' + userunitid;
            if (this.searchForm.name) {
                str += ',name~' + this.searchForm.name;
            }
            if (this.searchForm.status) {
                str += this.searchForm.status
            }
            str += '&sort=createTime~desc';
            this.showLoading();
            Api.document.getDocumentList(str, this.page, this.size).then((res) => {
                this.dataList = res.content;
                this.total = res.totalElements;
            }).finally(this.closeLoading);
        },
        // 编辑
        handleEdit(row) {
            this.$router.push({ path: 'document', query: { id: row.id, flag: 1 } });
        },
        hasEdit(row) {
            return row.onlineStatus === _status.STATUS.WAITCOMMIT
        },
        // 删除活动
        handleDel(row) {
            let self = this;
            self.delConfirm('征集活动', () => {
                Api.document.delDocument(row.id).then((res) => {
                    this.showTip();
                    this.loadData();
                });
            });
        },
        hasDel(row) {
            return _status.hasDelPermission(row.onlineStatus);
        },
        // 格式化状态信息
        formatterOnlineStatus(row) {
            let value = row.onlineStatus;
            console.log('value======>>', value)
            return _status.statusName(value);
        },
        // 提交审核
        handleVerify(row) {
            this.$confirm('是否提交审核?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then((res) => {
                let user = this.$store.getters.user;
                let dataForm = {
                    fromStatus: _status.STATUS.WAITCOMMIT,
                    toStatus: _status.STATUS.WAITAUDIT,
                    operatorDept: user.unit.name,
                    operatorName: user.name,
                    operateTime: this.formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss')
                }
                Api.document.changeDocumentOnline(row.id, dataForm).then((res) => {
                    this.loadData()
                });
            });
        },
        hasCommitAudit(row) {
            return _status.hasCommitAuditPermission(row.onlineStatus);
        },
        // 作品管理
        handleRecord(row) {
            this.$router.push({ path: 'works', query: { id: row.id } });
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
