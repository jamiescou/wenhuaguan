<template>
    <div class="list-wrapper">
        <v-pageheader :breadcrumbs="[{ to:'index',name: '文化团队管理' },{name:'管理团队人员'}]"></v-pageheader>
        <div class="right-opers">
            <el-button type="primary" @click="handleAdd">添加团队人员</el-button>
        </div>
        <div class="table-container">
            <section class="search-wrapper">
                <el-form :inline="true" :model="searchForm" label-width="0">
                    <el-form-item>
                        <el-input v-model="searchForm.name" placeholder="请输入人员姓名"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="loadData">查询</el-button>
                    </el-form-item>
                </el-form>
            </section>
        </div>
        <div class="table-container">
            <el-table :data="dataList" border stripe v-loading.body="loading">
                <el-table-column prop="name" label="人员姓名">
                    <template scope="scope">
                        <router-link :to="{path:'person_detail', query: {id:$route.query.id, mid:scope.row.id}}" class="u-link">
                            {{scope.row.name}}
                        </router-link>
                    </template>
                </el-table-column>
                <el-table-column prop="contactPhone" label="联系方式"></el-table-column>
                <el-table-column prop="duty" label="团队职责"></el-table-column>
                <el-table-column prop="joinDate" label="加入团队时间"></el-table-column>
                <el-table-column label="操作" width="340px" align="center">
                    <template scope="scope">
                        <a class="btn-act" @click="edit(scope.$index, scope.row)">编辑</a>
                        <a class="btn-act" @click="del(scope.$index, scope.row)">删除</a>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-row :gutter="20" class="uict-padtop15">
            <el-col :span="2" :offset="11">
                <div class="grid-content bg-purple">
                    <el-button @click="back">返回</el-button>
                </div>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import Api from '@/api';
export default {
    data() {
        return {
            searchForm: { name: '' },
            dataList: [],
            objid: '',
            loading: false
        }
    },
    created() {
    },
    methods: {
        back() {
            this.$router.go(-1);
        },
        handleAdd() {
            this.$router.push({ path: 'person_add', query: { flag: 'add', id: this.$route.query.id } })
        },
        callback() {
            this.showTip();
            this.loadData();
        },
        loadData() {
          console.log('name------',this.searchForm.name)
            this.loading = true;
            let name = this.searchForm.name;
            let str = '';
            if (name !== '') str += ',name~' + name;
            if(this.searchForm.name){
              Api.cultureteam.searchTeamPersonList(this.objid, this.searchForm.name).then((res) => {
                this.dataList = res;
                this.loading = false;
              });
            }else{
              Api.cultureteam.getTeamPersonList(this.objid).then((res) => {
                this.dataList = res;
                this.loading = false;
              });
            }

        },
        edit(index, row) {
            this.$router.push({ path: 'person_add', query: { flag: 'edit', id: this.$route.query.id, mid: row.id } });
        },
        del(index, row) {
            let self = this;
            self.delConfirm('团队成员', () => {
                Api.cultureteam.delTeamPerson(this.objid, row.id).then(self.callback);
            });
        }
    },
    mounted() {
        this.objid = this.$route.query.id;
        this.loadData();
    }
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">

</style>
