<template>
    <div class="list-wrapper">
        <!--<v-pageheader :breadcrumbs="[{ to:'index',name: '志愿者管理' },{ name: '成员管理' }]"></v-pageheader>-->
        <el-tabs v-model="activeName" type="card">
            <el-tab-pane label="成员审核管理" name="first">
                <div class="table-container">
                    <section class="search-wrapper">
                        <el-form :inline="true" :model="searchForm" label-width="0">
                            <el-form-item>
                                <el-input v-model="searchForm.name" placeholder="请输入姓名"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="loadCheckData">查询</el-button>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="back">返回</el-button>
                            </el-form-item>
                        </el-form>
                    </section>
                </div>
                <div class="table-container">
                    <el-table :data="dataCheckList" border stripe v-loading.body="loading">
                        <el-table-column prop="volunteerName" label="姓名">
                            <template scope="scope">
                                <router-link :to="{path:'view_member', query: {id: scope.row.idNumber,type:scope.row.type}}" class="u-link">
                                    {{scope.row.volunteerName}}
                                </router-link>
                            </template>
                        </el-table-column>
                        <el-table-column prop="idNumber" label="身份证号"></el-table-column>
                        <el-table-column prop="applyTime" label="申请时间"></el-table-column>
                        <el-table-column prop="isPass" label="状态" :formatter="formatStatus"></el-table-column>
                        <el-table-column label="操作" width="200px" align="center">
                            <template scope="scope">
                                <template v-if="scope.row.isPass === null">
                                    <a class="btn-act" @click="handlePass(scope.row)">通过</a>
                                    <a class="btn-act" @click="handleRegect(scope.row)">拒绝</a>
                                </template>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="pagination-container ">
                        <v-pagination @pageChange="onCurrentChange" :total="total" :isShow="showPagination"></v-pagination>
                    </div>
                </div>
            </el-tab-pane>
            <el-dialog title="提示" v-model="RegectDialog" :close-on-click-modal='false' width="50%">
                <div>
                    <el-form ref="RegectForm" :model="RegectForm"  :rules="rules">
                        <el-form-item label-width="0">
                            <el-form-item label="请输入拒绝理由" prop="Regect">
                                <el-input v-model="RegectForm.Regect"></el-input>
                            </el-form-item>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="dialog-footer">
                    <el-button @click="RegectDialog = false">取消</el-button>
                    <el-button type="primary" @click="submitRegect(rowid)" >保存</el-button>
                </div>
            </el-dialog>
            <el-tab-pane label="成员管理" name="second">
                <div class="table-container">
                    <section class="search-wrapper">
                        <el-form :inline="true" :model="searchForm" label-width="0">
                            <el-form-item>
                                <el-button type="primary" @click="back">返回</el-button>
                            </el-form-item>
                        </el-form>
                    </section>
                </div>
                <div class="table-container">
                    <el-table :data="dataList" border stripe v-loading.body="loading">
                        <el-table-column prop="name" label="姓名"></el-table-column>
                        <el-table-column prop="type" label="志愿者类型" :formatter="formatType"></el-table-column>
                        <el-table-column prop="idNumber" label="身份证号"></el-table-column>
                        <el-table-column prop="telephone" label="联系电话"></el-table-column>
                        <el-table-column label="操作" width="500px" align="center">
                            <template scope="scope">
                                <!--<a class="btn-act" @click="detail(scope.$index, scope.row)">查看</a>-->
                                <a class="btn-act" @click="del(scope.$index, scope.row)">删除</a>
                            </template>
                        </el-table-column>
                    </el-table>
                    <!--<div class="pagination-container ">
                        <v-pagination @pageChange="onCurrentChange" :total="total" :isShow="showPagination"></v-pagination>
                    </div>-->
                </div>
            </el-tab-pane>
        </el-tabs>

    </div>
</template>

<script>
import BaseTable from '@/mixins/base-table';
import Api from '@/api';
import vRules from '@/config/validate_rules';
const TYPE = { 'team': '团队', 'personal': '个人' };
export default {
    mixins: [BaseTable],
    data() {
        return {
            rowid:"",
            RegectForm:{
                 Regect:"",
            },            
            RegectDialog: false,
            activeName: 'first',
            mid: '',
            id: '',
            searchForm: { name: '' },
            dataList: [],
            dataCheckList: [],
            rules: {
                Regect: [vRules.required],
            }
        };
    },
    methods: {
        // 审核成员数据加载
        loadCheckData() {
            this.mid = this.$route.query.id;
            let name = this.searchForm.name;
            let str = 'recruitId:' + this.mid;
            if (name !== '') str += ',volunteerName~' + name;
            str += '&sort=applyTime~desc';

            Api.nouns.getRecruitApply(str, this.page, this.size).then((res) => {

                this.dataCheckList = res.content || [];

                this.total = res.totalElements;
            }).finally();
        },
        // 数据加载
        loadData() {
            this.mid = this.$route.query.id;

            Api.nouns.getRecruitMembers(this.mid).then((res) => {
                this.dataList = res || [];
            }).finally();
        },

        // 查看成员详情
        detail(index, row) {
            this.$router.push({ path: '', query: { mid: this.mid, id: row.id } })
        },

        // 删除
        del(index, row) {
            let self = this;
            self.delConfirm('成员', () => {
                Api.nouns.delRecruitMember(this.mid, row.idNumber).then(self.callback);
            });
        },

        formatType(row, column, cellValue) {
            return TYPE[cellValue];
        },

        formatStatus(row, column, cellValue) {
            if (cellValue == null) {
                return '待审核'
            }
            return cellValue ? '已通过' : '已拒绝'
        },
        //通过
        handlePass(row) {
            this.$confirm('是否确认通过?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'info'
            }).then((res) => {
                let data = {
                    pass: true
                };
                Api.nouns.auditRecruitApply(row.id, data).then(this.callback);
            });
        },
        // 拒绝
        handleRegect(row) {
     
            this.RegectDialog = true;
            this.RegectForm.Regect="";
            this.rowid=row.id;
            
        },
        submitRegect(id)
        {
           
            this.$refs['RegectForm'].validate((valid) => {
                if (valid) {
              let data = {
                    pass: false,
                    remark:  this.RegectForm.Regect
                };
                Api.nouns.auditRecruitApply(id, data).then(this.callback);
                 this.RegectDialog = false;
                }
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
