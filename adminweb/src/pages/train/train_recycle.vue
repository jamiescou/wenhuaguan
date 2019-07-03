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
                        <router-link :to="{path:'viewtrain', query: {id: scope.row.id,flag:3}}" class="u-link">
                            {{scope.row.title}}
                        </router-link>
                    </template>
                </el-table-column>
                <el-table-column prop="enrolStartTime" label="报名开始时间" align="center"></el-table-column>
                <el-table-column prop="startDate" label="课程开始时间" align="center"></el-table-column>
                <el-table-column prop="creator.userName" label="创建人" align="center"></el-table-column>
                <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
                <el-table-column prop="onlineStatus" label="状态" align="center" :formatter="formatterOnlineStatus"></el-table-column>
                <el-table-column label="操作" align="center" width="200px">
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
import _status from './modules/status'
export default {
    mixins: [BaseTable],
    data() {
        return {
            searchForm: { name: '' },
            dataList: [],
            titleInfo: _status.PARENT_NAME['4']
        }
    },
    methods: {
        loadData() {            
            let str = 'searchDataDeptId' ;
            let user = this.$store.getters.user;
            // str += 'dataDeptId:' + userunitid;
            str +=  ',onlineStatus:' + _status.STATUS.Recycled;
            if (this.searchForm.name) {
                str += ',title~' + this.searchForm.name;
            }
            this.showLoading();
            Api.train.getTrainList(str, this.page, this.size).then((res) => {
                this.dataList = res.content;
                this.total = res.totalElements;
            }).finally(this.closeLoading);
        },
        // 格式化状态信息
        formatterOnlineStatus(row) {
            let value = row.onlineStatus;
            return _status.statusName(value);
        },
        // 删除培训
        handleDel(row) {
            let self = this;
            self.delConfirm('培训', () => {
                Api.train.delTrain(row.id).then((res) => {
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
                    toStatus: _status.STATUS.WaitCommit,
                    operatorDept: user.unit.name,
                    operatorName: user.name,
                    operateTime: this.formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss')
                };

                Api.train.changeTrainOnline(row.id, data).then((res) => {
                    this.showTip();
                    this.loadData();
                });
            });
        }
    },
    mounted() {
    }
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">

</style>
