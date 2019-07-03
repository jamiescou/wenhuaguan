<template>
    <div class="list-wrapper">
        <v-pageheader :breadcrumbs="[{ to:'index',name: '群文学会管理' },{ name: '群文专业委员会管理' }]"></v-pageheader>
        <div class="right-opers">

        </div>
        <div class="table-container">
            <section class="search-wrapper">
                <el-form :inline="true" :model="searchForm" label-width="0">
                    <!--<el-form-item>
                        <el-input v-model="searchForm.name" placeholder="请输入委员会名称"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="loadData">查询</el-button>
                    </el-form-item>-->
                  <el-form-item>
                    <el-button type="primary" @click="handleAdd">添加专业委员会</el-button>
                    <el-button type="primary" @click="back">返回</el-button>
                  </el-form-item>
                </el-form>
            </section>
        </div>
        <div class="table-container">
            <el-table :data="dataList" border stripe v-loading.body="loading">
                <el-table-column prop="name" label="委员会名称">
                     <template scope="scope">
                        <router-link :to="{path:'divisionview', query: {id: scope.row.id,mid:$route.query.mid}}" class="u-link">
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
            mid:'',
            searchForm: { name: '' },
            dataList: []
        };
    },
    methods: {

        // 数据加载
        loadData() {
            this.mid = this.$route.query.mid;
            let name = this.searchForm.name;
            let str = '';
            if (name !== '') str += ',name:' + name;
            this.showLoading();
            Api.society.getDivisionsList(this.mid, str, this.page, this.size).then((res) => {
                if(res){
                  this.dataList = res;
                  this.total = res.totalElements;
                }
            }).finally(this.closeLoading);
        },
        // 添加
        handleAdd() {
            this.$router.push({ path: 'divisionadd', query: {mid: this.mid, flag: 'add' } });
        },
        // 编辑
        edit(index, row) {
            this.$router.push({ path: 'divisionadd', query: { mid: this.mid, id: row.id, flag: 'edit' } })
        },
        // 删除
        del(index, row) {
            let self = this;
            self.delConfirm('专业委员会', () => {
                Api.society.delDivisions(this.mid, row.id).then(self.callback);
            });
        },
        // 上下架
        publish(index, row) {
            let msg = row.isPublish ? '是否确认取消发布？' : '确认发布专业委员会？';
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
        },
        // 返回
        back() {
            this.$router.go(-1);
        },
    },
    mounted() {
        this.loadData();
//        this.getVenues();
    }
};
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">

</style>
