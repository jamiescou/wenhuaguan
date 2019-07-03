<template>
    <div class="list-wrapper">
        <v-pageheader :breadcrumbs="[{name:'志愿者活动管理'}]"></v-pageheader>
        <div class="right-opers">
            <el-button type="primary" @click="handleAdd">添加志愿者活动</el-button>
        </div>
        <div class="table-container">
            <section class="search-wrapper">
                <el-form :inline="true" :model="searchForm" label-width="0">
                    <el-form-item>
                        <el-input v-model="searchForm.name" placeholder="请输入活动名称"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="loadData">查询</el-button>
                    </el-form-item>
                </el-form>
            </section>
        </div>
        <div class="table-container">
            <el-table :data="dataList" border stripe v-loading.body="loading">
                <el-table-column label="活动名称">
                    <template scope="scope">
                        <router-link :to="{path:'activity_view', query: {id: scope.row.id}}" class="u-link">
                            {{scope.row.name}}
                        </router-link>
                    </template>
                </el-table-column>
                <el-table-column prop="startTime" label="活动开始时间"></el-table-column>
                <el-table-column prop="serviceHour" label="服务时长"></el-table-column>
                <el-table-column prop="contactPhone" label="联系电话"></el-table-column>
                <el-table-column prop="limitNum" label="允许报名人数" width="120px"></el-table-column>
                <el-table-column prop="isStop" label="招募状态">
                    <template scope="scope">
                        <span>{{scope.row.isStop? '停止招募':'招募中'}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="isPublish" label="状态" width="100px">
                    <template scope="scope">
                        <span>{{scope.row.isPublish? '已上架':'未上架'}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="450px" align="center">
                    <template scope="scope">
                        <a class="btn-act" @click="edit(scope.$index, scope.row)" v-if="scope.row.isPublish !== true">编辑</a>
                        <a class="btn-act" @click="digitinfos(scope.$index, scope.row)">活动纪实</a>
                        <a class="btn-act" @click="person(scope.$index, scope.row)">招募成员管理</a>
                        <a class="btn-act" @click="publish(scope.$index, scope.row)">{{scope.row.isPublish?'下架':'上架'}}</a>
                        <a class="btn-act" @click="isStop(scope.$index, scope.row)">{{scope.row.isStop?'启用招募':'停止招募'}}</a>
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
            dataList: []
        };
    },
    methods: {
        back() {
            this.$router.go(-1);
        },
        loadData() {            
            let name = this.searchForm.name;
            let str = '';
            let user = this.$store.getters.user;
            str += 'searchDataDeptId';
            if (name !== '') str += ',name~' + name;
            str += '&sort=createTime~desc';
            this.showLoading();
            Api.nouns.getCooperationList(str, this.page, this.size).then((res) => {
                this.dataList = res.content;                
                this.total = res.totalElements;
            }).finally(this.closeLoading);
        },
        // 添加志愿者活动
        handleAdd() {
            this.$router.push('activity');
        },
        edit(index, row) {
            this.$router.push({ path: 'activity', query: { id: row.id } })
        },
        person(index, row) {
            this.$router.push({ path: 'activity_person', query: { id: row.id } })
        },
        digitinfos(index, row) {
            this.$router.push({ path: 'digitinfos_list', query: { id: row.id } })
        },
        del(index, row) {
            let self = this;
            self.delConfirm('活动', () => {
                Api.nouns.delCooperation(row.id).then(self.callback);
            });
        },
        publish(index, row) {
            let msg = row.isPublish ? '是否确认下架该活动？' : '确认发布该活动？';
            this.$confirm(msg, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then((res) => {
                Api.nouns.publishCooperation(row.id, !row.isPublish).then(this.callback);
                this.loadData();
            });
        },
        isStop(index, row) {
            let msg = row.isStop ? '是否确认启用招募？' : '确认停止招募？';
            this.$confirm(msg, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then((res) => {
                Api.nouns.recruitCooperation(row.id, !row.isStop).then(this.callback);
                this.loadData();
            });
        },
        callback() {
            this.showTip();
            this.loadData();
        }
    },
    mounted() {
        // this.objid = this.$route.query.id;
        // this.loadData();
    }
};
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">

</style>
