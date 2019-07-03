<template>
    <div class="list-wrapper">
        <v-pageheader :breadcrumbs="[{ name: '群文学会管理' }]"></v-pageheader>
        <div class="right-opers">
            <el-button type="primary" @click="handleAdd">添加群文学会</el-button>
        </div>
        <div class="table-container">
            <section class="search-wrapper">
                <el-form :inline="true" :model="searchForm" label-width="0">
                    <el-form-item>
                        <el-input v-model="searchForm.name" placeholder="请输入学会名称"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="loadData">查询</el-button>
                    </el-form-item>
                </el-form>
            </section>
        </div>
        <div class="table-container">
            <el-table :data="dataList" border stripe v-loading.body="loading">
                <el-table-column prop="name" label="学会名称">
                    <template scope="scope">
                        <router-link :to="{path:'societyview', query: {id: scope.row.id,flag:1}}" class="u-link">
                            {{scope.row.name}}
                        </router-link>
                    </template>
                </el-table-column>
                <el-table-column prop="leader" label="负责人"></el-table-column>
                <el-table-column prop="mobile" label="联系电话"></el-table-column>
                <el-table-column prop="email" label="邮箱"></el-table-column>
                <!--<el-table-column prop="isPublish" label="状态">
                    <template scope="scope">
                        <span>{{scope.row.isPublish? '已上架':'未上架'}}</span>
                    </template>
                </el-table-column>-->
                <el-table-column label="操作" width="500px" align="center">
                    <template scope="scope">
                        <a class="btn-act" @click="edit(scope.$index, scope.row)">编辑</a>
                        <!--<a class="btn-act" @click="publish(scope.$index, scope.row)">{{scope.row.isPublish?'取消发布':'发布'}}</a>-->
                        <a class="btn-act" @click="del(scope.$index, scope.row)">删除</a>
                        <a class="btn-act" @click="handleRecord(scope.$index, scope.row)">委员会管理</a>
                        <a class="btn-act" @click="handleMember(scope.$index, scope.row)">成员管理</a>
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
            dictName: ['cultural'],
            searchForm: { name: '' },
            dataList: []
        };
    },
    methods: {
        // 委员会管理
        handleRecord(index, row) {            
            this.$router.push({ path: 'council', query: { mid: row.id } });
        },

        handleMember(index, row) {
            this.$router.push({ path: 'member', query: { mid: row.id } });
        },
        // 数据加载
        loadData() {            
            let name = this.searchForm.name;
            let str = '';
            let user = this.$store.getters.user;           
            if (name !== '') str += ',name~' + name;
            this.showLoading();
            Api.society.getSocietyList(str, this.page, this.size).then((res) => {
                this.dataList = res.content;
                this.total = res.totalElements;
            }).finally(this.closeLoading);
        },
        // 添加
        handleAdd() {
            this.$router.push({ path: 'societyadd', query: { flag: 'add' } });
        },
        // 编辑
        edit(index, row) {
            this.$router.push({ path: 'societyadd', query: { id: row.id, flag: 'edit' } })
        },
        // 删除
        del(index, row) {
            let self = this;
            self.delConfirm('群文学会', () => {
                Api.society.delSociety(row.id).then(self.callback);
            });
        },
        // 上下架
        publish(index, row) {
            let msg = row.isPublish ? '是否确认取消发布？' : '确认发布数字展览？';
            this.$confirm(msg, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then((res) => {
                Api.digital.publishDigital(row.id, !row.isPublish).then(this.callback);
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
