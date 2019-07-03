<template>
    <div class="list-wrapper">
        <v-pageheader :breadcrumbs="[{ to:'index',name: '电子杂志管理' },{ name: '稿件管理' }]"></v-pageheader>
        <!--<div class="right-opers">
            <el-button type="primary" @click="handleAdd">添加稿件</el-button>
        </div>-->
        <div class="table-container">
            <section class="search-wrapper">
                <el-form :inline="true" :model="searchForm" label-width="0">
                    <el-form-item>
                        <el-input v-model="searchForm.title" placeholder="名称"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="loadData">查询</el-button>
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary" @click="back">返回</el-button>
                    </el-form-item>
                </el-form>
            </section>
        </div>
        <div class="table-container">
            <el-table :data="dataList" border stripe v-loading.body="loading">
                <el-table-column prop="title" label="稿件名称">
                     <!--<template scope="scope">
                        <router-link :to="{path:'', query: {id: scope.row.id,mid:$route.query.mid}}" class="u-link">
                            {{scope.row.title}}
                        </router-link>
                    </template>-->
                </el-table-column>
                <el-table-column prop="userName" label="姓名"></el-table-column>
                <el-table-column prop="mobile" label="联系电话"></el-table-column>
                <el-table-column prop="commitTime" label="提交时间"></el-table-column>
                <el-table-column label="操作" width="500px" align="center">
                    <template scope="scope">
                        <a class="btn-act" @click="detail(scope.$index, scope.row)">查看</a>
                        <a class="btn-act" @click="del(scope.$index, scope.row)">删除</a>
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
            mid: '',
            searchForm: { title: ''},
            dataList: [],
        };
    },
    methods: {
        back() {
            this.$router.go(-1);
        },
        // 加载数据
        loadData() {
            this.mid = this.$route.query.mid;
            let title = this.searchForm.title;
            let str = '';
            if (title !== '') str += ',title:' + title;
            str += '&sort=commitTime~desc';
            this.showLoading();
            Api.magazine.getContributeList(this.mid, str, this.page, this.size).then((res) => {
                this.dataList = res.content;
                this.total = res.totalElements;
            }).finally(this.closeLoading);
        },

        detail(index, row) {
            this.$router.push({ path: 'contributeview', query: { mid: this.mid, id: row.id } })
        },
        // 编辑
        edit(index, row) {
            this.$router.push({ path: 'magazineissueadd', query: { mid: this.mid, id: row.id, flag: 'edit' } });
        },
        // 删除稿件
        del(index, row) {
            let self = this;
            self.delConfirm('稿件', () => {
                Api.magazine.delContribute(this.mid, row.id).then(self.callback);
            });
        },
        callback() {
            this.showTip();
            this.loadData();
        }
    },
    mounted() {
    }
};
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">

</style>
