<template>
    <div class="list-wrapper activity-wrapper">
        <v-pageheader :breadcrumbs="breadcrumbs"></v-pageheader>
        <section class="search-wrapper">
            <el-form :inline="true" label-width="0">
                <el-form-item>
                    <el-button type="primary" @click="handleAdd">新增</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="back">返回</el-button>
                </el-form-item>
            </el-form>
        </section>
        <div class="table-container">
            <el-table :data="dataListOne" border stripe v-loading.body="loading" tooltip-effect="custom-effect">
                <el-table-column label=" " type="index" align="center" width="80px"></el-table-column>
                <el-table-column label="资源名称" prop="name" width="260px">
                    <template scope="scope">
                        <router-link :to="{path:'viewrecord', query: {id:id,did: scope.row.id}}" class="u-link">
                            {{scope.row.name}}
                        </router-link>
                    </template>
                </el-table-column>
                <el-table-column prop="type" label="资源类型" align="center" :formatter="formatType"></el-table-column>
                <el-table-column prop="fileSize" label="资源大小" align="center"></el-table-column>
                <el-table-column prop="seqno" label="显示顺序" align="center" width="100px"></el-table-column>
                <el-table-column label="操作" align="left" width="280px">
                    <template scope="scope">
                        <a class="btn-act" @click="handleEdit(scope.row)">编辑</a>
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
import _status, { PARENT_NAME } from './activity_status'

const DIGITTYPE = { pic: '图片', video: '视频', audio: '音频' }
export default {
    mixins: [BaseTable],
    data() {
        return {
            id: '',
            dataListOne: []
        }
    },
    created() {
        let rootPath = PARENT_NAME['3'];
        this.breadcrumbs = [
            { to: rootPath.path, name: rootPath.name },
            { name: '活动纪实' }
        ]
    },
    methods: {
        loadData() {
            this.id = this.$route.query.flag;
            // let user = this.$store.getters.user;
            // let str = 'search=dataDeptId:' + user.unit.id + ',' + 'unit.id:' + user.orgUnit.id;
            // if (this.searchForm.name) { str += ',name:' + this.searchForm.name; }
            // if (this.searchForm.status) { str += ',onlineStatus:' + this.searchForm.status }

            this.showLoading();
            Api.activity.activityDigicInfos(this.id).then((res) => {
                this.dataListOne = res || [];
            }).finally(this.closeLoading);
        },
        // 返回
        back() {
            this.$router.go(-1);
        },
        // 编辑
        handleEdit(row) {
            this.$router.push({ path: 'record', query: { id: this.id, did: row.id } });
        },
        // 删除活动
        handleDel(row) {
            let self = this;
            self.delConfirm('资源', () => {
                Api.activity.activityDigicInfoDelete(this.id, row.id).then((res) => {
                    this.showTip();
                    this.loadData();
                });
            });
        },
        // 添加
        handleAdd() {
            this.$router.push({ path: 'record', query: { id: this.id } });
        },
        // 格式化资源类型
        formatType(row) {
            let type = row.type;
            return DIGITTYPE[type];
        }
    },
    mounted() {
    }
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">

</style>
