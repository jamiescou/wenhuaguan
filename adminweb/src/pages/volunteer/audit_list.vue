<template>
    <div class="list-wrapper">
        <v-pageheader :breadcrumbs="[{name:'志愿者审核'}]"></v-pageheader>
        <div class="table-container">
            <section class="search-wrapper">
                <el-form :inline="true" :model="searchForm" label-width="0">
                    <el-form-item>
                        <el-input v-model="searchForm.name" placeholder="请输入志愿者名称"></el-input>
                    </el-form-item>
                    <!--<el-select v-model="searchForm.status" placeholder="类型" clearable>
                        <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>-->
                    <el-form-item>
                        <el-button type="primary" @click="loadData">查询</el-button>
                    </el-form-item>
                </el-form>
            </section>
        </div>
        <div class="table-container">
            <el-table :data="dataList" border stripe v-loading.body="loading">
                <el-table-column prop="name" label="姓名"></el-table-column>
                <el-table-column prop="type" label="类型" :formatter="formatType"></el-table-column>
                <el-table-column prop="telephone" label="联系电话"></el-table-column>
                <el-table-column prop="isPass" label="状态" :formatter="formatStatus"></el-table-column>
                <el-table-column prop="applyTime" label="申请时间"></el-table-column>
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
    </div>
</template>

<script>
import BaseTable from '@/mixins/base-table';
import Api from '@/api';

const TYPE = { 'team': '团队', 'personal': '个人' };
function typeOpts() {
    const keys = Object.keys(TYPE);
    let opts = [];
    for (const key of keys) {
        opts.push({ label: TYPE[key], value: key });
    }
    return opts;
}

export default {
    mixins: [BaseTable],
    data() {
        return {
            searchForm: { status: '', name: '' },
            dataList: [],
            typeOptions: typeOpts()
        };
    },
    methods: {
        loadData() {
            let str = [];
            let user = this.$store.getters.user;
            str.push('unitId:' + user.orgUnit.id);
            if (this.searchForm.name !== '') str.push('name~' + this.searchForm.name);
            if (this.searchForm.status !== '') str.push('type:' + this.searchForm.status);
            str = str.join(',');
            str += '&sort=applyTime~desc';
            this.showLoading();
            // 获取成员列表
            Api.nouns.getAllApplys(str, this.page, this.size).then((res) => {
                this.dataList = res.content;
                this.total = res.totalElements;
            }).finally(this.closeLoading);
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
                Api.nouns.auditApply(row.id, data).then(this.callback);
            });
        },
        // 拒绝
        handleRegect(row) {
            this.$prompt('请输入拒绝理由', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            }).then(({ value }) => {
                let data = {
                    pass: false,
                    remark: value
                };
                Api.nouns.auditApply(row.id, data).then(this.callback);
            }).catch();
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
