<template>
    <div class="list-wrapper">
        <v-pageheader :breadcrumbs="[{ name: '摄影资源管理' }]"></v-pageheader>
        <div class="right-opers">
            <el-button type="primary" @click="handleAdd" icon="plus">新增</el-button>
        </div>
        <div class="table-container">
            <section class="search-wrapper">
                <el-form :inline="true" :model="searchForm" label-width="0">
                    <el-form-item>
                        <el-input v-model="searchForm.name" placeholder="请输入资源名称"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-input v-model="searchForm.author" placeholder="请输入作者名称"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="loadData">查询</el-button>
                    </el-form-item>
                </el-form>
            </section>
        </div>
        <div class="table-container">
            <el-table :data="dataList" border stripe v-loading.body="loading">
                <el-table-column prop="name" label="资源名称">
                    <template scope="scope">
                        <router-link :to="{path:'photoview', query: {id: scope.row.id}}" class="u-link">
                            {{scope.row.name}}
                        </router-link>
                    </template>
                </el-table-column>
                <el-table-column prop="author" label="作者"></el-table-column>
                <el-table-column prop="brief" label="资源简介"></el-table-column>
                <!-- <el-table-column prop="file" label="图片"></el-table-column> -->
                <el-table-column prop="isPublish" label="状态">
                    <template scope="scope">
                        <span>{{scope.row.isPublish? '已上架':'未上架'}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="500px" align="center">
                    <template scope="scope">
                        <a class="btn-act" @click="edit(scope.$index, scope.row)" v-if="scope.row.isPublish !== true">编辑</a>
                        <a class="btn-act" @click="publish(scope.$index, scope.row)">{{scope.row.isPublish?'下架':'上架'}}</a>
                        <a class="btn-act" @click="del(scope.$index, scope.row)" v-if="scope.row.isPublish !== true">删除</a>
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
            searchForm: { name: '', author: '' },
            dataList: []
        };
    },
    methods: {
        // 数据加载
        loadData() {
            let name = this.searchForm.name;
            let author = this.searchForm.author;
            // let str = 'searchDataDeptId';
            let str = 'type:photo';
            let user = this.$store.getters.user;
            // str += 'dataDeptId:' + userunitid;
            if (name !== '') str += ',name~' + name;
            if (author !== '') str += ',author~' + author;
            str += '&sort=createTime~desc';
            this.showLoading();
            Api.screen.getScreenList(str, this.page, this.size).then((res) => {
                this.dataList = res.content;
                this.total = res.totalElements;
            }).finally(this.closeLoading);
        },
        // 添加
        handleAdd() {
            this.$router.push({ path: 'photoadd', query: { flag: 'add' } });
        },
        // 编辑
        edit(index, row) {
            this.$router.push({ path: 'photoadd', query: { id: row.id, flag: 'edit' } })
        },
        // 删除
        del(index, row) {
            let self = this;
            self.delConfirm('摄影资源', () => {
                Api.screen.delScreen(row.id).then(self.callback);
            });
        },
        // 上下架
        publish(index, row) {
            let msg = row.isPublish ? '是否确认取消发布？' : '确认发布摄影资源？';
            this.$confirm(msg, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then((res) => {
                Api.screen.publishScreen(row.id, !row.isPublish).then(this.callback);
            });
        },
        callback() {
            this.showTip();
            this.loadData();
        }
    },
    mounted() {
        this.loadData();
        //        this.getVenues();
    }
};
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
</style>
