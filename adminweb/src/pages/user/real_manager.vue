<template>
    <div class="real-user-wrapper">
        <v-pageheader :breadcrumbs="[{ name: '实名制管理' }]"></v-pageheader>
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
                <el-table-column label=" " type="index" align="center" width="80px"></el-table-column>
                <el-table-column label="手机号码" align="center">
                    <template scope="scope">
                        <!-- <router-link :to="{name:'view',params: { id: scope.row.id },query:{flag:myFlag}}" class="u-link">
                                                                        {{scope.row.mobile}}
                                                                    </router-link> -->
                        <span class="u-link" @click="hadleView(scope.row)">{{scope.row.mobile}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="realname" label="真实姓名" align="center"></el-table-column>
                <el-table-column prop="idnumber" label="证件号码" align="center"></el-table-column>
                <el-table-column prop="identifyStatus" label="实名认证" align="center" :formatter="convertStatus"></el-table-column>
                <el-table-column label="操作" width="300px" align="center">
                    <template scope="scope">
                        <a class="btn-act" @click="handlePass(scope.row)" v-if="waitIdentify(scope.row)">通过</a>
                        <a class="btn-act" @click="handleReject(scope.row)" v-if="waitIdentify(scope.row)">拒绝</a>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination-container ">
                <v-pagination @pageChange="onCurrentChange" :total="total" :isShow="showPagination"></v-pagination>
            </div>
        </div>
        <el-dialog title="用户实名制信息详情" v-model="dialogVisible" class="view-wrapper">
            <div>
                <el-row>
                    <el-col :span="12">
                        <v-detailItem label="真实姓名" :value="viewForm.realname"></v-detailItem>
                    </el-col>
                    <el-col :span="12">
                        <v-detailItem label="身份证号码" :value="viewForm.idnumber"></v-detailItem>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <v-detailItem label="昵称" :value="viewForm.nickname"></v-detailItem>
                    </el-col>
                    <el-col :span="12">
                        <v-detailItem label="手机号码" :value="viewForm.mobile"></v-detailItem>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <v-detailItem label="关系" :value="convertRelation(viewForm)"></v-detailItem>
                    </el-col>
                    <el-col :span="12">
                        <v-detailItem label="认证状态" :value="convertStatus(viewForm)"></v-detailItem>
                    </el-col>
                </el-row>
                <v-detailItem label="证件手持" type="image" :value="getUrl(viewForm.handpic)" class="coveruser"></v-detailItem>
                <el-row>
                    <el-col :span="12">
                        <v-detailItem label="申请时间" :value="viewForm.createTime"></v-detailItem>
                    </el-col>
                    <el-col :span="12">
                        <v-detailItem label="审核时间" :value="viewForm.auditTime"></v-detailItem>
                    </el-col>
                </el-row>
                <v-detailItem label="审核信息" :value="viewForm.auditComment"></v-detailItem>
            </div>
            <div class="dialog-footer">
                <el-button type="primary" @click="handlePass(viewForm)" v-if="waitIdentify(viewForm)">通过</el-button>
                <el-button type="primary" @click="handleReject(viewForm)" v-if="waitIdentify(viewForm)">拒绝</el-button>
                <el-button @click="dialogVisible = false">关闭</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import BaseTable from '@/mixins/base-table';
import Api from '@/api';
import _userStatus from './user_status'

export default {
    mixins: [BaseTable],
    data() {
        return {
            searchForm: { name: '', nickname: '', mobile: '', status: 'Wait' },
            statusOpts: _userStatus.REAL_STATUS,
            viewForm: {
                remark: '',
                mobile: '',
                idnumber: '',
                auditComment: '',
                auditUser: '',
                userId: '',
                auditTime: '',
                realname: '',
                createTime: '',
                nickname: '',
                isSelf: '',
                handpic: '',
                relation: '',
                identifyStatus: '',
            },
            dialogVisible: false
        }
    },
    methods: {
        // 实名认证
        convertStatus(row, column, cellValue) {
            let identifyStatus = row.identifyStatus;
            return _userStatus.statusName(identifyStatus);
        },
        convertRelation(row) {
            if (row.isSelf) return '本人'
            return _userStatus.relationName(row.relation)
        },
        getUrl(url) {
            return Api.system.getFileUrl(url);
        },
        // 查询
        loadData() {
             let user = this.$store.getters.user;
            let unitid = user.orgUnit.id;     
            let nickname = this.searchForm.nickname; // 昵称
            let name = this.searchForm.name; // 活动室名称
            let mobile = this.searchForm.mobile;
            let status = this.searchForm.status;
            let str = 'searchUnitId';
            // str += ',unitId:' + unitid;
            if (nickname !== '') str += ',nickname~' + nickname;
            if (name !== '') str += ',realname~' + name;
            if (mobile !== '') str += ',mobile~' + mobile;
            if (status !== '') str += ',identifyStatus:' + status;
            str += '&sort=createTime~desc';
            this.showLoading();
            Api.user.getUserIdentifys(str, this.page, this.size).then((res) => {
                this.dataList = res.content;
                this.total = res.totalElements;
            }).finally(this.closeLoading);
        },
        handlePass(row) {
            this.$confirm('确定要通过“' + row.realname + '”的实名认证吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'info'
            }).then(() => {
                Api.user.passCertification(row.id).then(this.callback);
            }).catch(() => { });
        },
        handleReject(row) {
            this.$prompt('请输入拒绝理由', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputValidator: (value) => {
                    let spacePattern = /^\s+$/;
                    let hasSpace = spacePattern.test(value);
                    if (value == null || value.length === 0 || hasSpace) {
                        return false;
                    }
                    return true
                },
                inputErrorMessage: '必须输入拒绝理由'
            }).then(({ value }) => {
                Api.user.rejectCertification(row.id, value).then(this.callback);
            }).catch(() => { });
        },
        callback() {
            this.showTip();
            this.loadData();
            this.dialogVisible = false;
        },
        waitIdentify(row) {
            return _userStatus.waitIdentify(row.identifyStatus);
        },
        hadleView(row) {
            this.viewForm = this.deepClone(row);
            this.dialogVisible = true;
        }
    },
    mounted() {
    }
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
.view-wrapper {
        .coveruser {             
            width: 70%;
            height: 356px;             
            img {
                width: 100%;
                height: 100%;
            }
            &.portrait {
                img {
                    width: 236px;
                    height: 354px;
                }
            }
            .label-content {
                border-width: 0;
                height: 100%;
            }
        }
    }
</style>
