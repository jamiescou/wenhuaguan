<template>
    <div class="list-wrapper">
        <v-pageheader :breadcrumbs="[{ name: '文化配送管理' }]"></v-pageheader>
        <div class="right-opers">
            <el-button type="primary" @click="handleAdd">添加配送服务</el-button>
        </div>
        <div class="table-container">
            <section class="search-wrapper">
                <el-form :inline="true" :model="searchForm" label-width="0">
                    <el-form-item>
                        <el-input v-model="searchForm.title" placeholder="请输入服务名称"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="loadData">查询</el-button>
                    </el-form-item>
                </el-form>
            </section>
        </div>
        <div class="table-container">
            <el-table :data="dataList" border stripe v-loading.body="loading">
                <el-table-column prop="title" label="配送服务名称">
                    <template scope="scope">
                        <router-link :to="{path:'supplyview', query: {id: scope.row.id,flag:1}}" class="u-link">
                            {{scope.row.title}}
                        </router-link>
                    </template>
                </el-table-column>
                <el-table-column prop="type" label="服务类型" :formatter="formatVenuesName">
                </el-table-column>
                <el-table-column prop="serveTime" label="服务时长"></el-table-column>
                <el-table-column prop="teamName" label="服务团队"></el-table-column>
                <el-table-column prop="contactPerson" label="联系人"></el-table-column>
                <el-table-column prop="contactPhone" label="联系电话"></el-table-column>
                <el-table-column prop="isPublish" label="状态">
                    <template scope="scope">
                        <span>{{scope.row.isPublish? '已上架':'未上架'}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="500px" align="center">
                    <template scope="scope">
                        <a class="btn-act" @click="edit(scope.$index, scope.row)" v-if="!scope.row.isPublish">编辑</a>
                        <a class="btn-act" @click="publish(scope.$index, scope.row)">{{scope.row.isPublish?'下架':'上架'}}</a>
                        <a class="btn-act" @click="del(scope.$index, scope.row)" v-if="!scope.row.isPublish">删除</a>
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
export default {
    mixins: [BaseTable],
    data() {
        return {
            searchForm: { title: '' },
            dataList: [],
            areaOption: []
        };
    },
    methods: {
        // 格式化服务类型
        formatVenuesName(row, column, cellValue) {
            return this.dicts.getValueByCode('cultural', cellValue);
        },
        // 数据加载
        loadData() {
             
            let title = this.searchForm.title;
            let str = 'searchDataDeptId';
            let user = this.$store.getters.user;
            // str += 'dataDeptId:' + userunitid;
            if (title !== '') str += ',title~' + title;
             str += '&sort=createTime~desc';
            this.showLoading();
            Api.supply.getSupplyList(str, this.page, this.size).then((res) => {
                this.dataList = res.content;
                this.total = res.totalElements;
            }).finally(this.closeLoading);
        },
        // 添加
        handleAdd() {
            this.$router.push({ path: 'supplyadd', query: { flag: 'add' } });
        },
        // 编辑
        edit(index, row) {
            this.$router.push({ path: 'supplyadd', query: { id: row.id, flag: 'edit' } })
        },
        // 删除
        del(index, row) {
            let self = this;
            self.delConfirm('文化配送', () => {
                Api.supply.delSupply(row.id).then(self.callback);
            });
        },
        // 上下架
        publish(index, row) {
            let msg = row.isPublish ? '是否确认下架文化配送？' : '确认发布文化配送？';
            this.$confirm(msg, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then((res) => {
                Api.supply.publishSupply(row.id, !row.isPublish).then(this.callback);
            });
        },
        callback() {
            this.showTip();
            this.loadData();
        }
    },
    mounted() {
        // this.loadData();
        //        this.getVenues();
    }
};
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">

</style>
