<template>
    <div class="list-wrapper">
        <v-pageheader :breadcrumbs="[{ name: '文化团队管理' }]"></v-pageheader>
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
                <el-table-column prop="name" label="团队名称">
                    <template scope="scope">
                        <router-link :to="{path:'cultureteam_detail', query: {id: scope.row.id,flag:1}}" class="u-link">
                            {{scope.row.name}}
                        </router-link>
                    </template>
                </el-table-column>
                <!--<el-table-column prop="region" label="所属场馆" :formatter="formatVenuesName"></el-table-column>-->
                <el-table-column prop="contactPhone" label="联系电话"></el-table-column>
                <el-table-column prop="artType" label="分类" :formatter="formatVideoType"></el-table-column>
                <el-table-column prop="contactName" label="团队负责人"></el-table-column>
                <el-table-column prop="createTime" label="团队创建时间"></el-table-column>
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
                <el-table-column label="操作" width="400px" align="center">
                    <template scope="scope">
                        <a class="btn-act" @click="edit(scope.$index, scope.row)" v-if="scope.row.isPublish !== true">编辑</a>
                        <a class="btn-act" @click="handleRecomd(scope.row)">{{scope.row.isTop?'取消置顶':'置顶'}}</a>
                        <a class="btn-act" @click="mien(scope.$index, scope.row)">管理风采</a>
                        <a class="btn-act" @click="person(scope.$index, scope.row)">团队成员</a>
                        <a class="btn-act" @click="publish(scope.$index, scope.row)">{{scope.row.isPublish?'下架':'上架'}}</a>
                        <a class="btn-act" @click="del(scope.$index, scope.row)" v-if="scope.row.isPublish !== true">删除</a>
                    </template>
                </el-table-column>
            </el-table>
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
    created() {
        this.dicts.dictInit('artistClass');
    },
    methods: {
        getVenues() {
            Api.system.getRegionList(this.$store.state.user.info.unit.region).then((res) => {
                this.areaOption = res;
            });
        },
        formatVenuesName(item) {
            // let current;
            // this.areaOption.forEach((x) => {
            //     if (x.code === item.region) {
            //         current = x.parent.fullName;
            //     }
            // })
            // return current;
        },
        // 格式化点播类型
        formatVideoType(row, column, cellValue) {
            let type = [];
            for (var i = 0; i < cellValue.length; i++) {
                type.push(this.dicts.getValueByCode('artistClass', cellValue[i]));
            }
            return type.join("、");
        },
        loadData() {
            let name = this.searchForm.name;
            let str = 'searchDataDeptId';
            let user = this.$store.getters.user;
            if (name !== '') str += ',name~' + name;
            this.showLoading();
            str += '&sort=createTime~desc';
            Api.cultureteam.getCultureTeamList(str, this.page, this.size).then((res) => {
                if (res.content.length) {
                    for (const item of res.content) {
                        item.isTop = item[this.$store.getters.remandField] ? 1 : 0;
                    }
                }
                this.dataList = res.content;
                this.total = res.totalElements;
            }).finally(this.closeLoading);
        },
        handleAdd() {
            this.$router.push({ path: 'cultureteam_add', query: { type: 'add' } });
        },
        edit(index, row) {
            this.$router.push({ path: 'cultureteam_add', query: { id: row.id, type: 'edit' } })
        },
        mien(index, row) {
            this.$router.push({ path: 'cultureteam_mien', query: { id: row.id } })
        },
        person(index, row) {
            this.$router.push({ path: 'cultureteam_person', query: { id: row.id } })
        },
        del(index, row) {
            let self = this;
            self.delConfirm('文化团队', () => {
                Api.cultureteam.delCultureTeam(row.id).then(self.callback);
            });
        },
        publish(index, row) {
            let msg = row.isPublish ? '是否确认取消上架？' : '确认上架该团队？';
            this.$confirm(msg, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then((res) => {
                Api.cultureteam.publishCultureTeam(row.id, !row.isPublish).then(this.callback);
                this.loadData();
            });
        },
        callback() {
            this.showTip();
            this.loadData();
        },
        // 置顶
        handleRecomd(row) {
            let msg = row.isTop ? '确认取消置顶？' : '确认置顶该文艺团队？';
            this.$confirm(msg, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then((res) => {
                Api.cultureteam.topCultureTeam(row.id, !row.isTop).then((res) => {
                    this.loadData();
                });
            });
        },
    },
    mounted() {
        // this.loadData();
        this.getVenues();
    }
};
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
</style>
