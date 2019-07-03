<template>
    <div class="list-wrapper">
        <v-pageheader :breadcrumbs="[{ name: '数字展览管理' }]"></v-pageheader>
        <div class="right-opers">
            <el-button type="primary" @click="handleAdd">添加展览</el-button>
        </div>
        <div class="table-container">
            <section class="search-wrapper">
                <el-form :inline="true" :model="searchForm" label-width="0">
                    <el-form-item>
                        <el-input v-model="searchForm.title" placeholder="请输入展览名称"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="loadData">查询</el-button>
                    </el-form-item>
                </el-form>
            </section>
        </div>
        <div class="table-container">
            <el-table :data="dataList" border stripe v-loading.body="loading">
                <el-table-column prop="title" label="展览名称">
                    <template scope="scope">
                        <router-link :to="{path:'digitalview', query: {id: scope.row.id,flag:1}}" class="u-link">
                            {{scope.row.title}}
                        </router-link>
                    </template>
                </el-table-column>
                <el-table-column prop="type" label="展览类型" :formatter="formatVenuesName"></el-table-column>
                <el-table-column prop="createTime" label="创建时间"></el-table-column>
                <el-table-column prop="isPublish" label="状态">
                    <template scope="scope">
                        <span>{{scope.row.isPublish? '已上架':'未上架'}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="isTop" label="置顶状态" align="center">
                    <template scope="scope">
                        <span>{{scope.row.isTop | topFormatter}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="500px" align="center">
                    <template scope="scope">
                        <a class="btn-act" @click="edit(scope.$index, scope.row)" v-if="scope.row.isPublish !== true">编辑</a>
                        <a class="btn-act" @click="handleRecomd(scope.row)">{{scope.row.isTop?'取消置顶':'置顶'}}</a>
                        <a class="btn-act" @click="publish(scope.$index, scope.row)">{{scope.row.isPublish?'下架':'上架'}}</a>
                        <a class="btn-act" @click="del(scope.$index, scope.row)" v-if="scope.row.isPublish !== true">删除</a>
                        <a class="btn-act" @click="handleRecord(scope.$index, scope.row)">展品管理</a>

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
            dictNames: ['exhibition'],
            searchForm: { title: '' }
        };
    },
    methods: {
        // 展品管理
        handleRecord(index, row) {
            this.$router.push({ path: 'exhibits', query: { mid: row.id } });
        },

        // 格式化服务类型
        formatVenuesName(row, column, cellValue) {
            return this.dicts.getValueByCode('exhibition', cellValue);
        },
        // 数据加载
        loadData() {
            let title = this.searchForm.title;
            let str = 'searchDataDeptId';
            let user = this.$store.getters.user;
            if (title !== '') str += ',title~' + title;
            str += '&sort=createTime~desc';
            this.showLoading();
            Api.digital.getDigitalList(str, this.page, this.size).then((res) => {
                if (res.content.length) {
                    for (const item of res.content) {
                        item.isTop = item[this.$store.getters.remandField] ? 1 : 0;
                    }
                }
                this.dataList = res.content;
                this.total = res.totalElements;
            }).finally(this.closeLoading);
        },
        // 添加
        handleAdd() {
            this.$router.push({ path: 'digitaladd', query: { flag: 'add' } });
        },
        // 编辑
        edit(index, row) {
            this.$router.push({ path: 'digitaladd', query: { id: row.id, flag: 'edit' } })
        },
        // 删除
        del(index, row) {
            let self = this;
            self.delConfirm('数字展览', () => {
                Api.digital.delDigital(row.id).then(self.callback);
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
        // 置顶
        handleRecomd(row) {
            let msg = row.isTop ? '确认取消置顶？' : '确认置顶该展览？';
            this.$confirm(msg, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then((res) => {
                Api.digital.topExhibits(row.id, !row.isTop).then((res) => {
                    this.loadData();
                });
            });
        },
        callback() {
            this.showTip();
            this.loadData();
        }
    }
};
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
</style>
