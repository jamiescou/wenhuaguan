<template>
    <div class="list-wrapper">
        <v-pageheader :breadcrumbs="[{name:'志愿者管理'}]"></v-pageheader>
        <div class="table-container">
            <section class="search-wrapper">
                <el-form :inline="true" :model="searchForm" label-width="0">
                    <el-form-item>
                        <el-input v-model="searchForm.name" placeholder="请输入志愿者名称"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="loadData">查询</el-button>
                    </el-form-item>
                </el-form>
            </section>
        </div>
        <div class="table-container">
            <el-table :data="dataList" border stripe v-loading.body="loading">
                <el-table-column prop="name" label="姓名">
                    <template scope="scope">
                        <router-link :to="{path:'person_detail', query: {id: scope.row.id}}" class="u-link">
                            {{scope.row.name}}
                        </router-link>
                    </template>
                </el-table-column>
                <el-table-column prop="sex" label="性别">
                    <template scope="scope">
                        {{formatSex(scope.row.sex?scope.row.sex:'')}}
                    </template>
                </el-table-column>
                <el-table-column prop="telephone" label="联系电话"></el-table-column>
                <el-table-column prop="birthDay" label="出生日期"></el-table-column>
                <el-table-column prop="education" label="学历"  :formatter="coverEdication"></el-table-column>
                <el-table-column prop="address" label="地址"></el-table-column>
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
            searchForm: { name: '' }
        };
    },
     created() {
        this.dicts.dictInit("education");
    },
    methods: {
        coverEdication(row,index,cellvalue)
        {
                return this.dicts.getValueByCode('education', cellvalue);
        },
        back() {
            this.$router.go(-1);
        },
        loadData() {           
            let name = this.searchForm.name;
            let str = '';
            let user = this.$store.getters.user;
            str += 'searchUnitId';
            if (name !== '') str += ',name~' + name;
            this.showLoading();
            // 获取成员列表
            Api.nouns.getVolunteerList(str, this.page, this.size).then((res) => {
                this.dataList = res.content;
                this.total = res.totalElements;
            }).finally(this.closeLoading);
        },
        // 查看
        detail(index, row) {
            this.$router.push({ path: 'person_detail', query: { id: row.id } })
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
