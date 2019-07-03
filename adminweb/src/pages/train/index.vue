<template>
    <div class="list-wrapper">
        <v-pageheader :breadcrumbs="[{ name: titleInfo.name }]"></v-pageheader>
        <div class="right-opers">
            <el-button type="primary" @click="handleAdd" icon="plus">新增</el-button>
        </div>
        <section class="search-wrapper">
            <el-form :inline="true" :model="searchForm" label-width="0">
                <el-form-item>
                    <el-input v-model="searchForm.name" placeholder="请输入培训标题"></el-input>
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
        <div class="table-container">
            <el-table :data="dataList" border stripe v-loading.body="loading" tooltip-effect="custom-effect">
                <el-table-column label=" " type="index" align="center" width="80px"></el-table-column>
                <el-table-column label="培训名称" align="center" prop="title">
                    <template scope="scope">
                        <router-link :to="{path:'viewtrain', query: {id: scope.row.id,flag:1}}" class="u-link">
                            {{scope.row.title}}
                        </router-link>
                    </template>
                </el-table-column>
                <el-table-column prop="enrolStartTime" label="报名开始时间" align="center"></el-table-column>
                <el-table-column prop="startDate" label="课程开始时间" align="center"></el-table-column>
                <el-table-column prop="creator.userName" label="创建人" align="center"></el-table-column>
                <el-table-column prop="onlineStatus" label="状态" align="center">
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
                <el-table-column label="操作" align="center" width="300px">
                    <template scope="scope">
                        <a class="btn-act" @click="handleEdit(scope.row)" v-if="hasEdit(scope.row)">编辑</a>
                        <a class="btn-act" @click="handleAudit(scope.row)" v-if="hasCommitAudit(scope.row)">提交审核</a>
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
import _status from './modules/status';

export default {
    mixins: [BaseTable],
    data() {
        return {
            searchForm: { name: '', status: '' },
            dataList: [],
            titleInfo: _status.PARENT_NAME['1'],
            optionsList: [
                { value: _status.STATUS.WaitCommit, label: '待提交' },
                { value: _status.STATUS.WaitAudit, label: '待审核' },
                { value: _status.STATUS.Audited, label: '已审核' },
                { value: _status.STATUS.Published, label: '已上架' },
                { value: _status.STATUS.Offline, label: '已下架' }
            ],
            // options: _status.STATUS_OPTION
        }
    },
    methods: {
        loadData() {
        let user = this.$store.getters.user;        
        let str = 'searchDataDeptId,' ;
        if(this.searchForm.name) {
            str += 'title~' + this.searchForm.name;
        }
            if(this.searchForm.status) {
            str += ',onlineStatus:' + this.searchForm.status;
        }
            // if (this.searchForm.status) {
            //     str += ',onlineStatus:' + this.searchForm.status;
            // }
            str += '&sort=createTime~desc';
        this.showLoading();
        Api.train.getTrainList(str, this.page, this.size).then((res) => {
            this.dataList = res.content;
            this.total = res.totalElements;
        }).finally(this.closeLoading);
    },
    // 编辑
    handleEdit(row) {
        this.$router.push({ path: 'train', query: { id: row.id, flag: 1 } });
    },
    // 添加
    handleAdd() {
        this.$router.push('train');
    },
    // 格式化状态信息
    formatterOnlineStatus(row) {
        let value = row.onlineStatus;
        return _status.statusName(value);
    },
    callback() {
        this.showTip();
        this.loadData();
    },
    // 删除培训
    handleDel(row) {
        let self = this;
        self.delConfirm('培训', () => {
            Api.train.delTrain(row.id).then(this.callback);
        });
    },
    // 提交审核
    handleAudit(row) {
        this.$confirm('是否提交审核?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then((res) => {
            let user = this.$store.getters.user;
            let dataForm = {
                fromStatus: row.onlineStatus,
                toStatus: _status.STATUS.WaitAudit,
                operatorDept: user.unit.name,
                operatorName: user.name,
                operateTime: this.formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss')
            }
            Api.train.changeTrainOnline(row.id, dataForm).then(this.callback);
        });
    },
    getFlows(flows) {
        let operDesc = null;
        if (flows != null && flows.length > 0) {
            let lastFlow = flows[flows.length - 1];
            if (lastFlow.fromStatus === _status.STATUS.WaitAudit && lastFlow.toStatus === _status.STATUS.WaitCommit) {
                operDesc = lastFlow.operDesc;
            }
        }
        return operDesc;
    },
    hasEdit(row) {
        return row.onlineStatus === _status.STATUS.WaitCommit
    },
    hasCommitAudit(row) {
        return _status.hasCommitAuditPermission(row.onlineStatus);
    },
    hasDel(row) {
        return _status.hasDelPermission(row.onlineStatus);
    }
},
mounted() {
}
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">

</style>
