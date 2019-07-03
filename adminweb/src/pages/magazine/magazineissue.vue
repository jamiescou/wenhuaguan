<template>
    <div class="list-wrapper">
        <v-pageheader :breadcrumbs="[{ to:'index',name: '电子杂志管理' },{ name: '各期杂志管理' }]"></v-pageheader>
        <div class="right-opers">
            <el-button type="primary" @click="handleAdd">添加期刊</el-button>
        </div>
        <div class="table-container">
            <section class="search-wrapper">
                <el-form :inline="true" :model="searchForm" label-width="0">
                    <el-form-item>
                        <el-input v-model="searchForm.seqno" placeholder="请输入期数"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-input v-model="searchForm.year" placeholder="请输入年份"></el-input>
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
                <el-table-column prop="year" label="所属年份">
                     <template scope="scope">
                        <router-link :to="{path:'magazineissueview', query: {id: scope.row.id,mid:$route.query.mid}}" class="u-link">
                            {{scope.row.year}}
                        </router-link>
                    </template>
                </el-table-column>
                <el-table-column prop="seqno" label="期数"></el-table-column>
                <el-table-column prop="remark" label="期数备注"></el-table-column>
                <el-table-column prop="totalno" label="总期数"></el-table-column>
                <el-table-column prop="createTime" label="创建时间"></el-table-column>
                <el-table-column prop="isPublish" label="状态">
                    <template scope="scope">
                        <span>{{scope.row.isPublish? '已上架':'未上架'}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="500px" align="center">
                    <template scope="scope">
                        <a class="btn-act" @click="edit(scope.$index, scope.row)"v-if="scope.row.isPublish !== true">编辑</a>
                        <a class="btn-act" @click="publish(scope.$index, scope.row)">{{scope.row.isPublish?'下架':'上架'}}</a>
                        <a class="btn-act" @click="del(scope.$index, scope.row)"v-if="scope.row.isPublish !== true">删除</a>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination-container ">
                <v-pagination @pageChange="onCurrentChange" :total="total" :isShow="showPagination"></v-pagination>
            </div>
            <!--<el-row :gutter="20" class="uict-padtop15">
                <el-col :span="2" :offset="11">
                    <div class="grid-content bg-purple">
                        <el-button @click="back">返回</el-button>
                    </div>
                </el-col>
            </el-row>-->
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
            searchForm: { seqno: '', year: '' },
            dataList: [],
            areaOption: []
        };
    },
    methods: {
        back() {
            this.$router.go(-1);
        },
        // 加载数据
        loadData() {
            this.mid = this.$route.query.mid;
            let seqno = this.searchForm.seqno;
            let year = this.searchForm.year;
            let str = '';
            if (seqno !== '') str += ',seqno:' + seqno;
            if (year !== '') str += ',year:' + year;
            str += '&sort=createTime~desc';
            this.showLoading();
            Api.magazine.getMagazineIssueList(this.mid, str, this.page, this.size).then((res) => {
                this.dataList = res.content;
                this.total = res.totalElements;
            }).finally(this.closeLoading);
        },
        // 添加期刊
        handleAdd() {
            this.$router.push({ path: 'magazineissueadd', query: { mid: this.mid, flag: 'add' } });
        },
        detail(index, row) {
            this.$router.push({ path: 'magazineissueview', query: { mid: this.mid, id: row.id } })
        },
        // 编辑
        edit(index, row) {
            this.$router.push({ path: 'magazineissueadd', query: { mid: this.mid, id: row.id, flag: 'edit' } });
        },
        // 志愿者活动管理
        activity(index, row) {
            this.$router.push({ path: 'nouns_activity', query: { id: row.id } })
        },
        // 删除期刊
        del(index, row) {
            let self = this;
            self.delConfirm('期刊', () => {
                Api.magazine.delMagazineIssue(this.mid, row.id).then(self.callback);
            });
        },
        // 上下架期刊
        publish(index, row) {
            let self = this;
            let msg = row.isPublish ? '是否确认下架期刊？' : '确认发布期刊？';
            this.$confirm(msg, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then((res) => {
                if (row.isPublish) {
                    Api.magazine.setMagazineIssueUnPublish(this.mid, row.id).then(self.callback);
                } else {
                    Api.magazine.setMagazineIssuePublish(this.mid, row.id).then(self.callback);
                }
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
