<template>
    <div class="list-wrapper">
        <v-pageheader :breadcrumbs="[{ name: '志愿者团队管理' }]"></v-pageheader>
        <div class="right-opers">
            <el-button type="primary" @click="handleAdd">添加团队</el-button>
        </div>
        <div class="table-container">
            <section class="search-wrapper">
                <el-form :inline="true" :model="searchForm" label-width="0">
                    <el-form-item>
                        <el-input v-model="searchForm.name" placeholder="请输入团队名称"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="loadData">查询</el-button>
                    </el-form-item>
                </el-form>
            </section>
        </div>
        <div class="table-container">
            <el-table :data="dataList" border stripe v-loading.body="loading">
                <el-table-column label="团队名称">
                    <template scope="scope">
                        <router-link :to="{path:'team_detail', query: {id: scope.row.id}}" class="u-link">
                            {{scope.row.name}}
                        </router-link>
                    </template>
                </el-table-column>
                <el-table-column prop="region" label="所属区域" :formatter="formatRegion"></el-table-column>
                <el-table-column prop="contactPhone" label="联系电话" width="150px"></el-table-column>
                <el-table-column prop="creator.userName" label="团队负责人"></el-table-column>
                <el-table-column prop="isPublish" label="状态" width="100px">
                    <template scope="scope">
                        <span>{{scope.row.isPublish? '已上架':'未上架'}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="350px" align="center">
                    <template scope="scope">
                        <a class="btn-act" @click="edit(scope.$index, scope.row)">编辑</a>
                        <a class="btn-act" @click="person(scope.$index, scope.row)">团队成员</a>
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
            searchForm: { name: '' },
            dataList: [],
            areaOption: []
        };
    },
    methods: {
        getRegions() {
            Api.system.getRegionList(this.$store.state.user.info.unit.region).then((res) => {
                this.areaOption = res;
            });
        },
        formatRegion(item) {
            let current;
            this.areaOption.forEach((x) => {
                if (x.code === item.region) {
                    current = x.fullName;
                }
            })
            return current;
        },
        loadData() {            
                let name = this.searchForm.name;
                let str = 'searchDataDeptId';
                if (name !== '') str += ',name:' + name;
                str += '&sort=createTime~desc';
                this.showLoading();
                Api.nouns.getNounsList(str, this.page, this.size).then((res) => {
                    this.dataList = res.content;
                    this.total = res.totalElements;
                }).finally(this.closeLoading);
            },
            handleAdd() {
                this.$router.push('team');
            },
            edit(index, row) {
                this.$router.push({ path: 'team', query: { flag: row.id } })
            },
            person(index, row) {
                this.$router.push({ path: 'team_member', query: { id: row.id } })
            },
            del(index, row) {
                let self = this;
                self.delConfirm('文化团队', () => {
                    Api.nouns.delNouns(row.id).then(self.callback);
                });
            },
            publish(index, row) {
                let msg = row.isPublish ? '是否确认下架团队？' : '确认发布团队？';
                this.$confirm(msg, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then((res) => {
                    Api.nouns.publishNouns(row.id, !row.isPublish).then(this.callback);
                    this.loadData();
                });
            },
            callback() {
                this.showTip();
                this.loadData();
            }
        },
        mounted() {
            this.getRegions();
        }
    };
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">

</style>
