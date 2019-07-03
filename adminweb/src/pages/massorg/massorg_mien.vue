<template>
    <div class="list-wrapper">
        <v-pageheader :breadcrumbs="[{ to:'index',name: ' 群团组织管理' },{name:'管理团队风采'}]"></v-pageheader>
        <div class="right-opers">
            <el-button type="primary" @click="handleAdd">添加风采</el-button>
        </div>
        <div class="table-container">
            <section class="search-wrapper">
                <el-form :inline="true" :model="searchForm" label-width="0">
                    <el-form-item>
                        <el-input v-model="searchForm.title" placeholder="请输入风采标题"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="loadData">查询</el-button>
                    </el-form-item>
                </el-form>
            </section>
        </div>
        <div class="table-container">
            <el-table :data="dataList" border stripe v-loading.body="loading">
                <el-table-column prop="title" label="风采标题">
                    <template scope="scope">
                        <router-link :to="{path:'miendetail', query: {id: $route.query.id,mid:scope.row.id}}" class="u-link">
                            {{scope.row.title}}
                        </router-link>
                    </template>
                </el-table-column>
                <el-table-column prop="content" label="风采内容"></el-table-column>
                <el-table-column prop="createTime" label="风采创建时间"></el-table-column>
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
            searchForm: { title: '' },
            dataList: [],
            objid: '',
            loading: false
        }
    },

    methods: {
        back() {
            this.$router.push("index");
        },
        callback() {
            this.showTip();
            this.loadData();
        },
        handleAdd() {
            this.$router.push({ path: 'mien_add', query: { flag: 'add', id: this.$route.query.id } })
        },
       loadData() {
            this.loading = true;
            let title = this.searchForm.title;             
            let str='';
            str += '&sort=createTime~desc';         
            Api.massorg.getMassorgMien(this.objid,str, this.page, this.size).then((res) => {
                if (title !== '')
                {
                        this.dataList = res.filter(function(item) {
                          return item.title.indexOf(title) !== -1;
                          });  
                 }else
                {
                     this.dataList = res
                }                          
               
                this.loading = false;
            });
        },
        edit(index, row) {
            this.$router.push({ path: 'mien_add', query: { flag: 'edit', id: this.objid, mid: row.id } })
        },
        del(index, row) {
            let self = this;
            self.delConfirm('团队风采', () => {
                Api.massorg.dellMien(this.objid, row.id).then(self.callback);
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