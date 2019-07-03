<template>
    <div class="user-wrapper">
        <v-pageheader :breadcrumbs="[{ name: '黑名单管理' }]"></v-pageheader>
        <section class="search-wrapper">
            <el-form :inline="true" :model="searchForm" label-width="0">
                <el-form-item>
                    <el-input v-model="searchForm.nickname" placeholder="请输入昵称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="searchForm.mobile" placeholder="请输入手机"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="loadData">查询</el-button>
                </el-form-item>
            </el-form>
        </section>
        <div class="table-container">
            <el-table :data="dataList" border stripe v-loading.body="loading" tooltip-effect="custom">
                <el-table-column label=" " type="index" align="center" width="80px"></el-table-column>
                <el-table-column prop="nickname" label="会员昵称" align="center"></el-table-column>
                <el-table-column prop="mobile" label="手机号码" align="center"></el-table-column>
                <el-table-column prop="limitType" label="限制类型" align="center" :formatter="convertLimitType"></el-table-column>
                <el-table-column prop="limitDays" label="限制天数" align="center"></el-table-column>
                <el-table-column prop="reasonType" label="加入黑名单原因" align="center" :formatter="convertReasonType"></el-table-column>
                <el-table-column prop="happenTime" label="发生时间" align="center"></el-table-column>
                  <el-table-column label="操作" width="300px" align="center">
                    <template scope="scope">
                        <a class="btn-act"  v-if="!scope.row.isCancel" @click="handlecancel(scope.row)">取消</a>
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
const REASON_TYPE = { 'activityNotSign': '活动未参加', 'trainNotSign': '培训未参加', 'venueNotSign': '场馆未使用' }
const LIMIT_TYPE = { 'notReserve': '限制预定' }
export default {
    mixins: [BaseTable],
    data() {
        return {
            searchForm: { mobile: '', nickname: '' },
        }
    },
    methods: {
        callback() {
            this.showTip();
            this.loadData();
        },
        // 查询
        loadData() {
            let user = this.$store.getters.user;
            let unitid = user.unit.id;     
            let nickname = this.searchForm.nickname; // 昵称
            let mobile = this.searchForm.mobile; // 活动室名称
            let str = [];
            // str.push('unitId:' + unitid);
            if (nickname !== '') str.push('nickname~' + nickname);
            if (mobile !== '') str.push('mobile~' + mobile);
            str = str.join(",");
            str += '&sort=happenTime~desc';
            this.showLoading();
            Api.user.getBlockLogs(str, this.page, this.size).then((res) => {
                this.dataList = res.content;
                this.total = res.totalElements;
            }).finally(this.closeLoading);
        },
        convertReasonType(row, column, cellValue) {
            return REASON_TYPE[cellValue];
        },
        convertLimitType(row, column, cellValue) {
            return LIMIT_TYPE[cellValue];
        },
        // 取消
        handlecancel(row){
        Api.user.cancel(row.id).then((res)=>{
            this.loadData();
        });
        }
    },
    mounted() {
    }
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">

</style>
