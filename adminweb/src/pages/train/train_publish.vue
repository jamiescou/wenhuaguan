<template>
    <div class="list-wrapper">
        <v-pageheader :breadcrumbs="[{ name: titleInfo.name }]"></v-pageheader>
        <section class="search-wrapper">
            <el-form :inline="true" :model="searchForm" label-width="0">
                <el-form-item>
                    <el-input v-model="searchForm.title" placeholder="请输入培训名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="searchForm.onlineStatus" placeholder="请选择上架状态" clearable>
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
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
                <el-table-column label="培训名称" align="center" prop="title">
                    <template scope="scope">
                        <router-link :to="{path:'viewtrain', query: {id: scope.row.id,flag:3}}" class="u-link">
                            {{scope.row.title}}
                        </router-link>
                    </template>
                </el-table-column>
                <el-table-column prop="enrolStartTime" label="报名开始时间" align="center"></el-table-column>
                <el-table-column prop="startDate" label="课程开始时间" align="center"></el-table-column>
                <el-table-column prop="onlineStatus" label="上架状态" align="center">
                    <template scope="scope">
                        <span>{{scope.row.onlineStatus | onlineStatusFormatter}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="onlineStatus" label="置顶状态" align="center">
                    <template scope="scope">
                        <span>{{scope.row.isTop | topFormatter}}</span>
                    </template>
                </el-table-column>
                <!-- <el-table-column prop="" label="操作时间" align="center"></el-table-column> -->
                <el-table-column label="操作" width="300px" align="center">
                    <template scope="scope">
                        <template v-if="scope.row.onlineStatus === 'Published'">
                            <a class="btn-act" @click="cancelHandlePublish(scope.row)">下架</a>
                            <a class="btn-act" @click="handleRecomd(scope.row)">{{scope.row.isTop?'取消置顶':'置顶'}}</a>
                            <a class="btn-act" @click="HandleOrderd(scope.row)">报名管理</a>
                        </template>
                        <template v-else>
                            <a class="btn-act" @click="handleEdit(scope.row)">编辑</a>
                            <a class="btn-act" @click="handlePublish(scope.row)">上架</a>
                            <a class="btn-act" @click="handleRecyle(scope.row)">回收</a>
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
import _status from './modules/status'

export default {
    mixins: [BaseTable],
    data() {
        return {
            titleInfo: _status.PARENT_NAME['3'],
            searchForm: { title: '', onlineStatus: '' },
            dataList: [],
            options: [
                { value: _status.STATUS.Audited, label: _status.statusName(_status.STATUS.Audited) },
                { value: _status.STATUS.Published, label: _status.statusName(_status.STATUS.Published) },
                { value: _status.STATUS.Offline, label: _status.statusName(_status.STATUS.Offline) }
            ],
            recomandStatus: [
                { value: 1, label: '已置顶' },
                { value: 0, label: '未置顶' }
            ]
        }
    },
    methods: {
        loadData() {
            let str = 'searchDataDeptId,';
            let user = this.$store.getters.user;
            // str += 'dataDeptId:' + userunitid;
            let condition = [_status.STATUS.Audited, _status.STATUS.Published, _status.STATUS.Offline];
            str += 'onlineStatus:' + condition.join('~');
            // 培训标题
            if (this.searchForm.title) {
                str += ',title~' + this.searchForm.title;
            }
            // 上架状态
            if (this.searchForm.onlineStatus) {
                str += ',onlineStatus:' + this.searchForm.onlineStatus;
            }
            str += '&sort=createTime~desc';
            this.showLoading();
            Api.train.getTrainList(str, this.page, this.size).then((res) => {
                if (res.content.length) {
                    for (const item of res.content) {
                        item.isTop = item[this.$store.getters.remandField] ? 1 : 0;
                    }
                }
                this.dataList = res.content;
                this.total = res.totalElements;
            }).finally(this.closeLoading);
        },
        // 编辑
        handleEdit(row) {
            this.$router.push({ path: 'train', query: { id: row.id, flag: 3 } });
        },
        // 添加
        handleAdd() {
            this.$router.push('train');
        },
        // 格式化状态信息
        formatterOnlineStatus(row) {
            let value = row.onlineStatus;
            return _status.statusName(value);
        },
        // 回收
        handleRecyle(row) {
            this.commonHandle(row, _status.STATUS.Recycled, '回收');
        },
        // 发布
        handlePublish(row) {
            this.commonHandle(row, _status.STATUS.Published, '上架');
        },
        // 取消发布
        cancelHandlePublish(row) {
            this.commonHandle(row, _status.STATUS.Offline, '下架');
        },
        // 状态变更
        commonHandle(row, tostatus, msg) {
            this.$confirm('是否确认' + msg + '?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then((res) => {
                let user = this.$store.getters.user;
                let dataForm = {
                    fromStatus: row.onlineStatus,
                    toStatus: tostatus,
                    operatorDept: user.unit.name,
                    operatorName: user.name,
                    operateTime: this.formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss')
                };
                Api.train.changeTrainOnline(row.id, dataForm).then((res) => {
                    this.loadData();
                });
            });
        },
        // 推荐培训
        handleRecomd(row) {
            let msg = row.isTop ? '确认取消置顶？' : '确认置顶该培训？';
            this.$confirm(msg, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then((res) => {
                Api.train.trainRecommand(row.id, !row.isTop).then((res) => {
                    this.loadData();
                });
            });
        },
        // 报名管理
        HandleOrderd(row) {
            this.$router.push({ path: 'trainorder', query: { id: row.id, title: row.title } });
        }
    },
    mounted() {
    }
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
</style>
