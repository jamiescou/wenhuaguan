<template>
    <div class="list-wrapper">
        <v-pageheader :breadcrumbs="[{ name: titleInfo.name }]"></v-pageheader>
        <div class="right-opers">
            <el-button type="primary" @click="handleAdd" icon="plus">新增</el-button>
        </div>
        <section class="search-wrapper">
            <el-form :inline="true" :model="searchForm" label-width="0">
                <el-form-item>
                    <el-input v-model="searchForm.name" placeholder="请输入群团组织名称"></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="loadData">查询</el-button>
                </el-form-item>
            </el-form>
        </section>
        <div class="table-container">
            <el-table :data="dataList" border stripe v-loading.body="loading">
                <el-table-column label=" " type="index" align="center" width="80px"></el-table-column>
                <el-table-column label="群团组织名称" align="center" prop="name" width="260px">
                    <template scope="scope">
                        <router-link :to="{path:'viewmassorg', query: {id: scope.row.id,flag:3}}" class="u-link">
                            {{scope.row.name}}
                        </router-link>
                    </template>
                </el-table-column>
                <el-table-column prop="region" label="所属区域" align="center" :formatter="convertRegion"></el-table-column>
                <el-table-column prop="contactPhone" label="联系电话" align="center"></el-table-column>
                <el-table-column prop="contact" label="负责人" align="center"></el-table-column>
                <el-table-column prop="isPublish" label="上架状态" align="center" :formatter="isPublish"></el-table-column>
                <el-table-column label="群团组织创建时间" align="center">
                    <template scope="scope">
                        <div style="padding:5px 0 0;line-height:24px">{{scope.row.createTime}}</div>
                    </template>
                </el-table-column>

                <el-table-column label="操作" width="400px" align="center">
                    <template scope="scope">
                        <a class="btn-act" @click="handleEdit(scope.row)" v-if="!scope.row.isPublish">编辑</a>
                        <a class="btn-act" @click="handlePublish(scope.row)" v-if="!scope.row.isPublish">上架</a>
                        <a class="btn-act" @click="handlePublish(scope.row)" v-if="scope.row.isPublish">下架</a>
                        <a class="btn-act" @click="mien(scope.row)">管理风采</a>
                        <a class="btn-act" @click="handleDel(scope.row)" v-if="!scope.row.isPublish">删除</a>
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
import _status, { PARENT_NAME } from './massorg_status'

export default {
    mixins: [BaseTable],
    data() {
        return {
            titleInfo: PARENT_NAME['1'],
            searchForm: { name: '' },
            dataList: []

        }
    },
    methods: {
        isPublish(row, index, value) {
            return value ? "上架" : "下架"
        },
        handlePublish(row) {
            let isPublish = row.isPublish;
            let isPublishtext = isPublish ? "下架" : "上架";
            this.$confirm('是否' + isPublishtext + '?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then((res) => {
                Api.massorg.changeMassorgPublish(row.id, row, isPublish).then((res) => {
                    this.showTip();
                    this.loadData();
                });
            });
        },
        handleEdit(row) {
            this.$router.push({ path: 'massorg', query: { id: row.id, flag: 1 } });
        },
        //格式化区域
        convertRegion(row, column, cellValue) {
            return this.dicts.regionName(cellValue);
        },
        loadData() {
            let user = this.$store.getters.user;
            let str = 'search=searchDataDeptId';
            if (this.searchForm.name) { str += ',name~' + this.searchForm.name; }
            str += '&sort=createTime~desc';
            this.showLoading();
            Api.massorg.getMassorgs(str, this.page, this.size).then((res) => {
                this.dataList = res.content;
                // this.total = res.totalElements;
            }).finally(this.closeLoading);
        },
        mien(row) {
            this.$router.push({ path: 'massorg_mien', query: { id: row.id } })
        },
        // 删除活动
        handleDel(row) {
            let self = this;
            self.delConfirm('组织', () => {
                Api.massorg.delMassorg(row.id).then((res) => {
                    this.showTip();
                    this.loadData();
                });
            });
        },
        handleAdd() {
            this.$router.push('massorg');
        },
    }

}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
</style>
