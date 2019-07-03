<template>
    <div class="list-wrapper">
        <v-pageheader :breadcrumbs="[{ name: '我接收的通知' }]"></v-pageheader>
        <section class="search-wrapper" style="position:relative; height:40px;">
            <el-form :inline="true" :model="searchForm" label-width="0">
                <el-form-item>
                    <el-input v-model="searchForm.title" placeholder="标题"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="loadData">查询</el-button>
                </el-form-item>
            </el-form>
        </section>
        <div class="table-container" style="margin-top:20px;">
            <el-table :data="dataList" border stripe v-loading.body="loading">
                <el-table-column prop="title" label="标题">
                    <template scope="scope">
                        <router-link :to="{path:'noticeview', query: { id: scope.row.id }}" class="u-link">
                            {{ scope.row.title }}
                        </router-link>
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
                <el-table-column prop="creator.userName" label="创建者" align="center"></el-table-column>
                <!--<el-table-column label="操作" align="center">
                        <template scope="scope">
                            <a class="btn-act" @click="edit(scope.$index, scope.row)">编辑</a>
                            <a class="btn-act" @click="del(scope.$index, scope.row)">删除</a>
                        </template>
                    </el-table-column>-->
            </el-table>
            <div class="pagination-container ">
                <v-pagination @pageChange="onCurrentChange" :total="total" :isShow="showPagination"></v-pagination>
            </div>
        </div>
    </div>
</template>

<script>
import vRules from '@/config/validate_rules';
import Api from '@/api';
import BaseTable from '@/mixins/base-table';
export default {
    mixins: [BaseTable],
    data() {
        return {
            searchForm: { title: '' }
        };
    },
    methods: {
        loadData() {
            this.showLoading();
            let title = this.searchForm.title;
            let str = 'targets.unitId:' + this.$store.getters.user.orgUnit.id;
            if (title !== '') str += ',title~' + title;
            str += '&sort=createTime~desc';
            Api.notice.getNoticeList(str, this.page, this.size).then((res) => {
                this.dataList = res.content;
                this.total = res.totalElements;
            }).finally(this.closeLoading);
        }
    }
};
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">

</style>
