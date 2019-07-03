<template>
    <div class="list-wrapper">
        <v-pageheader :breadcrumbs="[{ name: '活动管理' }]"></v-pageheader>

        <div class="right-opers">
            <el-button type="primary" @click="handleAdd">创建活动</el-button>
        </div>

        <div class="table-container">
            <section class="search-wrapper">
                <el-form :inline="true" :model="searchForm" label-width="0">
                    <el-form-item>
                        <el-input v-model="searchForm.name" placeholder="活动名称"></el-input>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" @click="loadData">查询</el-button>
                    </el-form-item>
                </el-form>
            </section>
        </div>

        <div class="table-container">
            <el-table :data="dataList" border stripe v-loading.body="loading">
                <el-table-column prop="name" label="名称">
                    <template scope="scope">
                        <router-link :to="{path:'assistview', query: {id: scope.row.id}}" class="u-link">
                            {{scope.row.name}}
                        </router-link>
                    </template>
                </el-table-column>
                <el-table-column prop="type" label="活动类型" :formatter="formatActType"></el-table-column>
                <el-table-column label="活动时间" align="center">
                    <template scope="scope">
                        <div>{{scope.row.startDate}}</div>
                        ~
                        <div>{{scope.row.endDate}}</div>
                    </template>
                </el-table-column>

                <el-table-column prop="creator.userName" label="创建人"></el-table-column>
                <el-table-column prop="createTime" label="创建时间"></el-table-column>
                <el-table-column label="可用状态">
                    <template scope="scope">
                        {{scope.row.isDisabled==true?'禁用':'正常'}}
                    </template>
                </el-table-column>
                <el-table-column label="上架状态">
                    <template scope="scope">
                        {{scope.row.isPublished==true?'上架':'下架'}}
                    </template>
                </el-table-column>

                <el-table-column label="操作" width="300px" align="center">
                    <template scope="scope">
                        <div v-show="username===scope.row.creator.userId">
                            <router-link :to="{path:'assist', query: {id: scope.row.id}}" class="btn-act">编辑</router-link>
                            <a class="btn-act" @click='actEnable(scope.row)'>{{scope.row.isDisabled?'启用':'停用'}}</a>
                            <a class="btn-act" v-if="!scope.row.isDisabled" @click='actPublish(scope.row)'>{{scope.row.isPublished?'下架':'上架'}}</a>
                            <a class="btn-act" @click='delAct(scope.row)'>删除</a>
                            <router-link :to="{path:'workss', query: {id: scope.row.id,name:scope.row.name,uId:scope.row.unitId}}" class="btn-act">作品管理</router-link>
                        </div>
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
import vRules from '@/config/validate_rules';
import Api from '@/api';
// 获取详情
const TYPE = { stageArts: '舞台艺术类', exhibition: '展览艺术类' };
export default {
    mixins: [BaseTable],
    data() {
        return {
            dictNames: ['assistProjectType'],
            searchForm: { name: '' },
            username: '',
            dataList: [],
            liveForm: {
                name: '',
                brief: '',
                type: [],
                unitId: ''
            },
            user: { orgUnit: {} },
            rules: {
                name: [vRules.required]
            }
        };
    },
    methods: {
        loadData() {
            let user = this.$store.getters.user;
            this.username = user.username;
            let name = this.searchForm.name;
            let str = 'unitId:' + this.$store.getters.user.orgUnit.id;
            if (name !== '') str += ',name~' + name;
            this.showLoading();
            Api.assist.getActList(str, this.page, this.size).then((res) => {
                this.dataList = res.content;
                this.total = res.totalElements;
            }).finally(this.closeLoading);
        },

        //格式化活动类型
        formatActType(row, column, cellValue) {
            return TYPE[cellValue] || ''
        },

        // 删除
        delAct(row) {
            var self = this;
            self.delConfirm('确定删除此活动', () => {
                Api.assist.delAct(row.id).then(self.callback);
            });
        },

        //禁用活动
        actEnable(row) {
            let enable = row.isDisabled;
            let tip = enable ? '启用' : '停用';
            var self = this;
            self.$confirm('确定' + tip + '此活动', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'info'
            }).then((res) => {
                Api.assist.actDisable(row.id, !enable).then(self.callback);
            });
        },
        //活动上下架
        actPublish(row) {
            let enable = row.isPublished;
            let tip = !enable ? '上架' : '下架';
            var self = this;
            self.$confirm('确定' + tip + '此活动', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'info'
            }).then(() => {
                Api.assist.actPublish(row.id, !enable).then(self.callback);
            });
        },
        callback() {
            // this.showTip();
            this.loadData();
        },
        // 添加
        handleAdd() {
            this.$router.push('assist');
        }
    }
};
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
</style>
