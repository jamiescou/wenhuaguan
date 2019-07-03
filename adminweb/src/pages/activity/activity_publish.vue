<template>
    <div class="list-wrapper">
        <v-pageheader :breadcrumbs="[{ name: titleInfo.name }]"></v-pageheader>
        <section class="search-wrapper">
            <el-form :inline="true" :model="searchForm" label-width="0">
                <el-form-item>
                    <el-input v-model="searchForm.name" placeholder="请输入活动名称"></el-input>
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
            <el-table :data="dataList" border stripe v-loading.body="loading">
                <el-table-column label=" " type="index" align="center" width="80px"></el-table-column>
                <el-table-column label="名称" align="center" prop="name" width="260px">
                    <template scope="scope">
                        <router-link :to="{path:'viewactivity', query: {id: scope.row.id,flag:3}}" class="u-link">
                            {{scope.row.name}}
                        </router-link>
                    </template>
                </el-table-column>
                <el-table-column prop="activityType" label="活动形式" align="center" :formatter="convertType"></el-table-column>
                <el-table-column label="活动时间" align="center">
                    <template scope="scope">
                        <div style="padding:5px 0 0;line-height:24px">{{scope.row.holdStartDate}}</div>
                        <div style="line-height:1">~</div>
                        <div style="padding:0 0 5px;line-height:24px">{{scope.row.holdEndDate}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="reserveType" label="订票方式" align="center" :formatter="convertReserveType" width="100px"></el-table-column>
                <el-table-column prop="onlineStatus" label="上架状态" align="center" width="80px">
                    <template scope="scope">
                        <span>{{scope.row.onlineStatus | onlineStatusFormatter}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="isTop" label="置顶状态" align="center" width="80px">
                    <template scope="scope">
                        <span>{{scope.row.isTop | topFormatter}}</span>
                    </template>
                </el-table-column>
                <!-- <el-table-column prop="" label="操作时间" align="center"></el-table-column> -->
                <el-table-column label="操作" width="400px" align="cente    r">
                    <template scope="scope">
                        <template v-if="scope.row.onlineStatus === 'Published'">
                            <a class="btn-act" @click="cancelHandlePublish(scope.row)">下架</a>
                            <a class="btn-act" @click="handleRecomd(scope.row)">{{scope.row.isTop?'取消置顶':'置顶'}}</a>
                            <a class="btn-act" @click="HandleOrderd(scope.row)">订单管理</a>
                        </template>
                        <template v-else>
                            <a class="btn-act" @click="handleEdit(scope.row)" v-if="scope.row.onlineStatus !== 'Published'">编辑</a>
                            <a class="btn-act" @click="handlePublish(scope.row)" v-if="scope.row.onlineStatus !== 'Published'">上架</a>
                            <a class="btn-act" @click="handleRecyle(scope.row)">回收</a>
                        </template>
                        <a class="btn-act" @click="handleRecord(scope.row)">活动纪实</a>
                        <a class="btn-act" @click="handleQuestionnaire(scope.row)">问卷管理</a>
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

export default {
    mixins: [BaseTable],
    data() {
        return {
            titleInfo: PARENT_NAME['3'],
            searchForm: { name: '', onlineStatus: '' },
            dataList: [],
            options: [
                { value: _status.STATUS.AUDITED, label: _status.STATUS.AUDITED_LABEL },
                { value: _status.STATUS.PUBLISHED, label: _status.STATUS.PUBLISHED_LABEL },
                { value: _status.STATUS.OFFLINE, label: _status.STATUS.OFFLINE_LABEL }
            ]
        }
    },
    methods: {
        loadData() {
            let user = this.$store.getters.user;
            let str = 'search=searchDataDeptId';
            if (this.searchForm.name) { str += ',name~' + this.searchForm.name; }
            // 上架状态
            if (this.searchForm.onlineStatus != null && this.searchForm.onlineStatus !== '') {
                str += ',onlineStatus:' + this.searchForm.onlineStatus;
            } else {
                str += ',onlineStatus:' + _status.STATUS.AUDITED + '~' + _status.STATUS.PUBLISHED + '~' + _status.STATUS.OFFLINE;
            }
            str += '&sort=createTime~desc';
            this.showLoading();
            Api.activity.getActivityList(str, this.page, this.size).then((res) => {
                if (res.content.length) {
                    for (const item of res.content) {
                        item.isTop = item[this.$store.getters.remandField] ? 1 : 0;
                    }
                }
                this.dataList = res.content;
                this.total = res.totalElements;
            }).finally(this.closeLoading);
        },
        // 订单管理
        HandleOrderd(row) {
            this.$router.push({ path: 'activityorder', query: { id: row.id } });
        },
        // 编辑
        handleEdit(row) {
            this.$router.push({ path: 'activity', query: { id: row.id, flag: 3 } });
        },
        callback() {
            this.showTip();
            this.loadData();
        },
        // 回收
        handleRecyle(row) {
            this.commonHandle(row, _status.STATUS.RECYCLED, '回收');
        },
        // 发布
        handlePublish(row) {
            this.commonHandle(row, _status.STATUS.PUBLISHED, '发布');
        },
        // 取消发布
        cancelHandlePublish(row) {
            this.commonHandle(row, _status.STATUS.OFFLINE, '取消发布');
        },
        // 状态变更
        commonHandle(row, tostatus, msg) {
            this.$confirm('是否确认' + msg + '?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then((res) => {
                let user = this.$store.getters.user;
                let data = {
                    fromStatus: row.onlineStatus,
                    toStatus: tostatus,
                    operatorDept: user.unit.name,
                    operatorName: user.name,
                    operateTime: this.formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss')
                };
                Api.activity.changeActivityOnline(row.id, data).then(this.callback);
            });
        },
        // 推荐活动
        handleRecomd(row) {
            let msg = row.isTop ? '是否确认取消置顶？' : '确认置顶？';
            this.$confirm(msg, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then((res) => {
                Api.activity.activityRecommend(row.id, !row.isTop).then(this.callback);
            });
        },
        handleRecord(row) {
            this.$router.push({ path: 'record_list', query: { flag: row.id } });
        },
        handleQuestionnaire(row) {
            this.$router.push({ path: 'questionnaire', query: { flag: row.id } });
        },
        convertArtType(row, column, cellValue) {
            let artType = [];
            for (let item of cellValue) {
                if (this.dicts.getValueByCode('artistClass', item))
                    artType.push(this.dicts.getValueByCode('artistClass', item));
            }
            return artType.join('、');
        },
        convertType(row, column, cellValue) {
            let activityType = [];
            for (let item of cellValue) {
                if (this.dicts.getValueByCode('activityForm', item))
                    activityType.push(this.dicts.getValueByCode('activityForm', item));
            }
            return activityType.join('、');
        },
        convertReserveType(row, column, cellValue) {
            return _status.RESERVETYPE[cellValue];
        }
    },
    mounted() {
        // this.loadData();
    }
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
</style>
