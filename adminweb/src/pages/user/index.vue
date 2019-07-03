<template>
    <div class="user-wrapper">
        <v-pageheader :breadcrumbs="[{ name: '会员列表' }]"></v-pageheader>
        <section class="search-wrapper">
            <el-form :inline="true" :model="searchForm" label-width="0">
                <el-form-item>
                    <el-input v-model="searchForm.name" placeholder=" 请输入姓名"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="searchForm.nickname" placeholder="请输入昵称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="searchForm.mobile" placeholder="请输入手机"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
                        <el-option v-for="item in statusOpts" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="loadData">查询</el-button>
                </el-form-item>
            </el-form>
        </section>
        <div class="table-container">
            <el-table :data="dataList" border stripe v-loading.body="loading" tooltip-effect="custom-effect">
                <el-table-column label=" " type="index" align="center" width="80px" ></el-table-column>
                <el-table-column label="手机号" align="center" class-name="link-cell">
                    <template scope="scope">
                        <router-link :to="{ name: 'userview', params: { id: scope.row.id }}" class="u-link">{{scope.row.mobile}}</router-link>
                    </template>
                </el-table-column>
                <el-table-column prop="nickname" label="昵称" align="center"></el-table-column>
                <el-table-column prop="name" label="真实姓名" align="center"></el-table-column>
                <el-table-column prop="identifyStatus" label="实名认证" align="center" :formatter="convertStatus"></el-table-column>
                <el-table-column prop="locked" label="是否锁定" align="center">
                    <template scope="scope">{{scope.row.locked?'冻结':'正常'}}</template>
                </el-table-column>
                <el-table-column prop="limits" label="限制" align="center" :formatter="convertLimits"></el-table-column>
                <el-table-column label="操作" width="300px" align="center">
                    <template scope="scope">
                        <a class="btn-act" @click="handleLocked(scope.row)">{{scope.row.locked?'激活':'冻结'}}</a>
                        <a class="btn-act" @click="handleDel(scope.row)">删除</a>
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
import _userStatus from './user_status';
export default {
    mixins: [BaseTable],
    data() {
        return {
            searchForm: { name: '', nickname: '', mobile: '', status: '' },
            statusOpts: _userStatus.STATUS_OPTION,
            memberDialog: false,
            editForm: {}
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
            let name = this.searchForm.name; // 活动室名称
            let mobile = this.searchForm.mobile; // 状态
            let status = this.searchForm.status; // 状态
            let str = '';
            // str += ',unitId:' + unitid;
            if (nickname !== '') str += ',nickname~' + nickname;
            if (name !== '') str += ',name~' + name;
            if (mobile !== '') str += ',mobile~' + mobile;
            if (status !== '') str += ',identifyStatus:' + status;
            str += '&sort=registTime~desc';
            this.showLoading();
            Api.user.getUserList(str, this.page, this.size).then((res) => {
                this.dataList = res.content;
                this.total = res.totalElements;
            }).finally(this.closeLoading);
        },
        handleLocked(row) {
            let msg = '';
            if (row.locked) {
                msg = '确定要激活“' + (row.name || row.nickname) + '”吗？';
            } else {
                msg = '确定要冻结“' + (row.name || row.nickname) + '”吗？';
            }
            this.$confirm(msg, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'info'
            }).then(() => {
                if (row.locked) {
                    Api.user.unlockAccount(row.id).then(this.callback);
                } else {
                    Api.user.lockAccount(row.id).then(this.callback);
                }
            }).catch(() => { });
        },
        handleDel(row) {
            let self = this;
            self.delConfirm('会员信息', () => {
                Api.user.delUser(row.id).then(self.callback);
            });
        },
        resetForm() {
            this.memberDialog = false;
            this.editForm = {};
        },
        submitForm() {
            let id = this.editForm.id;
            Api.user.modifyUser(id, this.editForm).then(this.callback);
            this.resetForm();
        },
        convertStatus(row, column, cellValue) {
            if (cellValue) {
                return _userStatus.statusName(cellValue);
            }
            return '未认证';
        },
        convertLimits(row, column, cellValue) {
            if (!cellValue || cellValue.length) {
                return ''
            }

            return '限制'
        }
    },
    mounted() {
    }
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">

</style>
