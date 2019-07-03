<template>
    <div class="list-wrapper">
        <v-pageheader :breadcrumbs="[{ name: '展厅管理' }]"></v-pageheader>
        <div class="right-opers">
            <el-button type="primary" @click="handleAdd">添加展厅</el-button>
        </div>
        <div class="table-container">
            <section class="search-wrapper">
                <el-form :inline="true" :model="searchForm" label-width="0">
                    <el-form-item>
                        <el-input v-model="searchForm.title" placeholder="请输入展厅名称"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="loadData">查询</el-button>
                    </el-form-item>
                </el-form>
            </section>
        </div>
        <div class="table-container">
            <el-table :data="dataList" border stripe v-loading.body="loading">
                <el-table-column prop="title" label="展厅名称">
                    <template scope="scope">
                        <router-link :to="{path:'exhibitview', query: {id: scope.row.id,flag:1}}" class="u-link">
                            {{scope.row.title}}
                        </router-link>
                    </template>
                </el-table-column>
                <el-table-column prop="phone" label="电话"></el-table-column>
                <el-table-column prop="contact" label="联系人"></el-table-column>
                <el-table-column prop="address" label="地址"></el-table-column>
                <el-table-column prop="isPublish" label="状态">
                    <template scope="scope">
                        <span>{{scope.row.isPublish? '已上架':'未上架'}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="500px" align="center">
                    <template scope="scope">
                        <a class="btn-act" @click="edit(scope.$index, scope.row)">编辑</a>
                        <a class="btn-act" @click="publish(scope.$index, scope.row)">{{scope.row.isPublish?'下架':'上架'}}</a>
                        <a class="btn-act" @click="del(scope.$index, scope.row)">删除</a>
                        <a class="btn-act" @click="handleunit(scope.$index, scope.row)">展厅单元管理</a>
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
            dataList: []
        }
    },
    methods: {
        // 添加
        handleAdd() {
            this.$router.push('exhibitadd');
        },
        // 编辑
        edit(index, row) {
            this.$router.push({ path: 'exhibitadd', query: { id: row.id } });
        },
        // 删除
        del(index, row) {
            let self = this;
            self.delConfirm('展厅', () => {
                Api.heritage.delExhibit(row.id).then((res) => {
                    self.loadData();
                });
            });
        },
        // 上下架
        publish(index, row) {
            let publish = true;
            if (row.isPublish) publish = false;
            Api.heritage.isPublishExhibit(row.id, publish).then((res) => {
                this.loadData()
            });
        },
        // 展厅单元
        handleunit(index, row) {
            this.$router.push({ path: 'exhibitunitindex', query: { id: row.id } });
        },
        // 查询
        loadData() {           
             let user = this.$store.getters.user;
            let unitid = user.unit.id; 
            this.showLoading();
            let str = '';            
            if (this.searchForm.title !== '') str += ',title~' + this.searchForm.title;
            Api.heritage.getExhibitList(str, this.page, this.size).then((res) => {
                this.dataList = res.content;
                this.total = res.totalElements;
            }).finally(this.closeLoading);;
        }
    },
    mounted() {
    }
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">

</style>
