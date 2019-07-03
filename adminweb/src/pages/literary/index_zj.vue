<template>
    <div class="list-wrapper">
        <v-pageheader :breadcrumbs="[{ name: '专家管理' }]"></v-pageheader>
        <div class="right-opers">
            <el-button type="primary" @click="handleAdd">添加专家</el-button>
        </div>
        <div class="table-container">
            <section class="search-wrapper">
                <el-form :inline="true" :model="searchForm" label-width="0">
                    <el-form-item>
                        <el-input v-model="searchForm.mobilePhone" placeholder="请输入手机号"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-input v-model="searchForm.name" placeholder="请输入真实姓名"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-select v-model="searchForm.artType">
                            <v-option typeName="artistClass"></v-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="loadData">查询</el-button>
                    </el-form-item>
                </el-form>
            </section>
        </div>
        <div class="table-container">
            <el-table :data="dataList" border stripe v-loading.body="loading">
                <el-table-column prop="name" label="文艺人才姓名">
                    <template scope="scope">
                        <router-link :to="{path:'literary_detail', query: {id: scope.row.id,flag:1,type:2}}" class="u-link">
                            {{scope.row.name}}
                        </router-link>
                    </template>
                </el-table-column>
                <el-table-column prop="artType" label="艺术分类" :formatter="convertType"></el-table-column>
                <el-table-column prop="sex" label="性别" align="center">
                    <template scope="scope">
                        {{formatSex(scope.row.sex)}}
                    </template>
                </el-table-column>
                <el-table-column prop="birthDate" label="出生年月"></el-table-column>
                <el-table-column prop="mobilePhone" label="联系电话"></el-table-column>
                <el-table-column prop="edu" label="学历"></el-table-column>
                <!--<el-table-column prop="detailAddr" label="地址"></el-table-column>-->
                <el-table-column prop="isPublish" label="状态">
                    <template scope="scope">
                        <span>{{scope.row.isPublish? '已上架':'未上架'}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="340px" align="center">
                    <template scope="scope">
                        <a class="btn-act" @click="edit(scope.$index, scope.row)">编辑</a>
                        <a class="btn-act" @click="publish(scope.$index, scope.row)">{{scope.row.isPublish?'下架':'上架'}}</a>
                        <a class="btn-act" @click="del(scope.$index, scope.row)">删除</a>
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
            searchForm: {
                mobilePhone: '',
                name: '',
                artType: ''
            },
            dataList: [],
        }
    },
    methods: {
        loadData() {

            let mobilePhone = this.searchForm.mobilePhone;
            let artType = this.searchForm.artType;
            let name = this.searchForm.name;
            let str = 'searchDataDeptId';
            let user = this.$store.getters.user;
            // str += 'dataDeptId:' + userunitid;
            str += 'type:' + 2;
            if (mobilePhone !== '') str += ',mobilePhone~' + mobilePhone;
            if (name !== '') str += ',name~' + name;
            if (artType !== '') str += ',artType:' + artType;
            this.showLoading();
            console.log(str)
            Api.literary.getLiteraryList(str, this.page, this.size).then((res) => {
                this.dataList = res.content;
                this.total = res.totalElements;
            }).finally(this.closeLoading);
        },
        convertType(row, column, cellValue) {
            if (cellValue && cellValue.length) {
                let artType = [];
                for (let item of cellValue) {
                    if (item) {
                        if(this.dicts.getValueByCode('artistClass', item))
                        artType.push(this.dicts.getValueByCode('artistClass', item));
                    }
                }
                return artType.join('、');
            }
        },
        handleAdd() {
            this.$router.push({ path: 'literary_add', query: { flag: 'add',type:'2' } })
        },
        edit(index, row) {
            this.$router.push({ path: 'literary_add', query: { id: row.id, flag: 'edit',type:'2' } })
        },
        del(index, row) {
            let self = this;
            self.delConfirm('文艺人才信息', () => {
                Api.literary.delLiterary(row.id).then(self.callback);
            });
        },
        publish(index, row) {
            let msg = row.isPublish ? '是否确认取消上架？' : '确认上架该文艺人才？';
            this.$confirm(msg, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then((res) => {
                Api.literary.publishLiterary(row.id, !row.isPublish).then(this.callback);
                this.loadData();
            });
        },
        callback() {
            this.showTip();
            this.loadData();
        }
    },
    mounted() {
        // this.loadData();
    }
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">

</style>
