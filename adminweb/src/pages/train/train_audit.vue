<template>
    <div class="list-wrapper">
        <v-pageheader :breadcrumbs="[{ name: titleInfo.name }]"></v-pageheader>
        <section class="search-wrapper">
            <el-form :inline="true" :model="searchForm" label-width="0">
                <el-form-item>
                    <el-input v-model="searchForm.name" placeholder="请输入培训标题"></el-input>
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
                        <router-link :to="{path:'viewtrain', query: {id: scope.row.id,flag:2}}" class="u-link">
                            {{scope.row.title}}
                        </router-link>
                    </template>
                </el-table-column>
                <el-table-column prop="enrolStartTime" label="报名开始时间" align="center"></el-table-column>
                <el-table-column prop="startDate" label="课程开始时间" align="center"></el-table-column>
                <el-table-column prop="creator.userName" label="创建人" align="center"></el-table-column>
                <el-table-column prop="onlineStatus" label="状态" align="center" :formatter="formatterOnlineStatus"></el-table-column>
                <el-table-column label="操作" align="center" width="300px">
                    <template scope="scope">
                        <a class="btn-act" @click="handleEdit(scope.row)">编辑</a>
                        <a class="btn-act" @click="handlePass(scope.row)">通过</a>
                        <a class="btn-act" @click="handleRegect(scope.row)">拒绝</a>
                        <a class="btn-act" @click="handleRecyle(scope.row)">回收</a>
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
import _status from './modules/status'

export default {
    mixins: [BaseTable],
    data() {
        return {
            searchForm: { name: '' },
            dataList: [],
            titleInfo: _status.PARENT_NAME['2']
        }
    },
    methods: {
        loadData() {           
            let user = this.$store.getters.user;
            // let str = 'dataDeptId:' + userunitid;     
            let str = 'searchDataDeptId,' ;  
            str += 'onlineStatus:' + _status.STATUS.WaitAudit;
            if (this.searchForm.name) {
                str += ',title~' + this.searchForm.name;
            }
            str += '&sort=createTime~desc';
            this.showLoading();
            Api.train.getTrainList(str, this.page, this.size).then((res) => {
                this.dataList = res.content;
                this.total = res.totalElements;
            }).finally(this.closeLoading);
        },
        // 编辑
        handleEdit(row) {
            this.$router.push({ path: 'train', query: { id: row.id, flag: 2 } });
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
        // 拒绝
        handleRegect(row) {
            this.$prompt('请输入拒绝理由', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            }).then(({ value }) => {
                let user = this.$store.getters.user;
                let dataForm = {
                    fromStatus: row.onlineStatus,
                    toStatus: _status.STATUS.WaitCommit,
                    operatorDept: user.unit.name,
                    operatorName: user.name,
                    operateTime: this.formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss'),
                    operDesc: value
                };
                Api.train.changeTrainOnline(row.id, dataForm).then(this.callback);
            }).catch();
        },
        // 通过
        handlePass(row) {
            this.commonHandle(row, _status.STATUS.Audited, '通过');
        },
        // 回收
        handleRecyle(row) {
            this.commonHandle(row, _status.STATUS.Recycled, '回收');
        },
        // 状态变更
        commonHandle(row, tostatus, msg) {
            this.$confirm('是否确认' + msg + '?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then((res) => {
                let user = this.$store.getters.user;
                let dataForm = {
                    fromStatus: row.onlineStatus,
                    toStatus: tostatus,
                    operatorDept: user.unit.name,
                    operatorName: user.name,
                    operateTime: this.formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss')
                };
                Api.train.changeTrainOnline(row.id, dataForm).then(this.callback);
            });
        }
    },
    mounted() {
    }
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">

</style>
