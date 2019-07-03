<template>
    <div class="list-wrapper">
        <!--<v-pageheader :breadcrumbs="[{ to:'index',name: '群文学会管理' },{ name: '成员管理' }]"></v-pageheader>-->
        <el-tabs v-model="activeName" type="card" >
            <el-tab-pane label="审核管理" name="first">
                <div class="table-container">
                    <section class="search-wrapper">
                        <el-form :inline="true" :model="searchForm" label-width="0">
                          <!--<el-form-item>
                            <el-input v-model="searchForm.name" placeholder="请输入姓名"></el-input>
                          </el-form-item>
                          <el-form-item>
                            <el-button type="primary" @click="loadCheckData">查询</el-button>
                          </el-form-item>-->
                          <el-form-item>
                            <el-button type="primary" @click="back">返回</el-button>
                          </el-form-item>
                        </el-form>
                    </section>
                </div>
                <div class="table-container">
                    <el-table :data="dataCheckList" border stripe v-loading.body="loading">
                        <el-table-column prop="userInfo.name" label="姓名">
                            <template scope="scope">
                                <router-link :to="{path:'applymemberview', query: {id: scope.row.id,mid:$route.query.mid}}" class="u-link">
                                    {{scope.row.name}}
                                </router-link>
                            </template>
                        </el-table-column>
                        <el-table-column prop="userInfo.sex" label="性别">
                          <template scope="scope">
                            {{formatSex(scope.row.userInfo.sex)}}
                          </template>
                        </el-table-column>
                        <el-table-column prop="job" label="职业"></el-table-column>
                        <el-table-column prop="education" label="学历"></el-table-column>
                        <el-table-column prop="isPass" label="状态">
                          <template scope="scope">
                            <span>{{scope.row.isPass? '审核通过':'未审核'}}</span>
                          </template>
                        </el-table-column>
                        <el-table-column label="操作" width="500px" align="center">
                          <template scope="scope">
                            <a class="btn-act" @click="publish(scope.$index, scope.row)">审核</a>
                            <!--<a class="btn-act" @click="del(scope.$index, scope.row)">删除</a>-->
                          </template>
                        </el-table-column>
                    </el-table>
                    <div class="pagination-container ">
                        <v-pagination @pageChange="onCurrentChange" :total="total" :isShow="showPagination"></v-pagination>
                    </div>
                </div>
            </el-tab-pane>

            <el-tab-pane label="成员管理" name="second">
                <div class="table-container">
                    <section class="search-wrapper">
                        <el-form :inline="true" :model="searchForm" label-width="0">
                         <!-- <el-form-item>
                            <el-input v-model="searchForm.name" placeholder="请输入姓名"></el-input>
                          </el-form-item>
                          <el-form-item>
                            <el-button type="primary" @click="loadData">查询</el-button>
                          </el-form-item>-->
                          <el-form-item>
                            <el-button type="primary" @click="back">返回</el-button>
                          </el-form-item>
                        </el-form>
                    </section>
                </div>
                <div class="table-container">
                    <el-table :data="dataList" border stripe v-loading.body="loading">
                        <el-table-column prop="user.name" label="姓名"></el-table-column>
                        <el-table-column prop="user.sex" label="性别">
                            <template scope="scope">
                              {{formatSex(scope.row.user.sex)}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="job" label="职业"></el-table-column>
                        <el-table-column prop="education" label="学历"></el-table-column>
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
            </el-tab-pane>
        </el-tabs>

    </div>
</template>

<script>
import BaseTable from '@/mixins/base-table';
import Api from '@/api';
export default {
    mixins: [BaseTable],
    data() {
        return {
            activeName: 'first',
            mid:'',
            searchForm: { name: '' },
            dataList: [],
            dataCheckList:[]
        };
    },
    methods: {
        // 审核成员数据加载
        loadCheckData() {
            this.mid = this.$route.query.mid;
            let name = this.searchForm.name;
            let str = '';
            if (name !== '') str += ',name:' + name;
            this.showLoading();
            Api.society.getMemberCheckList(this.mid, str, this.page, this.size).then((res) => {
              if (res) {
                this.dataCheckList = res;
              }
              this.total = res.totalElements;
            }).finally(this.closeLoading);
        },
        // 数据加载
        loadData() {
            this.mid = this.$route.query.mid;
            let name = this.searchForm.name;
            let str = '';
            if (name !== '') str += ',name:' + name;
            this.showLoading();
            Api.society.getMemberList(this.mid, str, this.page, this.size).then((res) => {
                if(res){
                  this.dataList = res;
                }
                this.total = res.totalElements;
            }).finally(this.closeLoading);
        },


        // 查看成员详情
        detail(index, row) {
            this.$router.push({ path: 'memberview', query: {mid: this.mid, id: row.id } })
        },

        // 删除
        del(index, row) {
            let self = this;
            self.delConfirm('成员', () => {
                Api.society.delMember(this.mid, row.id).then(self.callback);
            });
        },
        // 审核成员
        publish(index, row) {
//            let msg = row.isPass ? '是否确认取消审核？' : '确认审核通过？';
            let msg = '确认审核通过？';
            this.$confirm(msg, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then((res) => {
                Api.society.doMember(this.mid, row.id, !row.isPass).then(this.callback);
            });
        },
        callback() {
            this.loadCheckData();
            this.showTip();
            this.loadData();
        },
        // 返回
        back() {
            this.$router.go(-1);
        },
    },
    mounted() {
        this.loadCheckData();
        this.loadData();
    }
};
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">

</style>
