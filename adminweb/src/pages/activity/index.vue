<template>
    <div class="list-wrapper activity-wrapper">
        <v-pageheader :breadcrumbs="[{ name: titleInfo.name }]"></v-pageheader>
        <div class="right-opers">
            <el-button type="primary" @click="handleAdd" icon="plus">新增</el-button>
        </div>
        <section class="search-wrapper">
            <el-form :inline="true" :model="searchForm" label-width="0">
                <el-form-item>
                    <el-input v-model="searchForm.name" placeholder="请输入活动名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="searchForm.status" placeholder="请选择上架状态" clearable>
                        <el-option v-for="item in optionsList" :key="item.value" :label="item.label" :value="item.value">
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
                <el-table-column label="活动名称" prop="name" width="240px" align="center">
                    <template scope="scope">
                        <router-link :to="{path:'viewactivity', query: {id: scope.row.id,flag:1}}" class="u-link">
                            {{scope.row.name}}
                        </router-link>
                    </template>
                </el-table-column>
                <el-table-column prop="artType" label="活动分类" align="center" :formatter="convertArtType"></el-table-column>
                <el-table-column prop="activityType" label="活动形式" align="center" :formatter="convertType"></el-table-column>
                <el-table-column label="活动时间" align="center">
                    <template scope="scope">
                        <div style="padding:5px 0 0;line-height:24px">{{scope.row.holdStartDate}}</div>
                        <div style="line-height:1">~</div>
                        <div style="padding:0 0 5px;line-height:24px">{{scope.row.holdEndDate}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="reserveType" label="订票方式" align="center" :formatter="convertReserveType" width="100px"></el-table-column>
                <el-table-column prop="creator.userName" label="创建人" align="center" width="130px"></el-table-column>
                <el-table-column prop="createTime" label="创建时间" align="center" width="200px"></el-table-column>
                <el-table-column prop="onlineStatus" label="状态" align="center" width="80px">
                    <template scope="scope">
                        <div>
                            {{formatterOnlineStatus(scope.row)}}
                            <el-popover placement="top-start" width="200" trigger="hover" v-if="getFlows(scope.row.flowLogs)" popper-class="log-flow">
                                <h4 class="flow-title">拒绝理由</h4>
                                <p class="flow-content">{{getFlows(scope.row.flowLogs)}}</p>
                                <i class="sz-ico ico-reject" slot="reference"></i>
                            </el-popover>
                        </div>
                    </template>
                </el-table-column>
                <!-- <el-table-column prop="" label="操作时间" align="center"></el-table-column> -->
                <el-table-column label="操作" align="center" width="220px">
                    <template scope="scope">
                        <a class="btn-act" @click="handleEdit(scope.row)" v-if="hasEdit(scope.row)">编辑</a>
                        <a class="btn-act" @click="handleVerify(scope.row)" v-if="hasCommitAudit(scope.row)">提交审核</a>
                        <a class="btn-act" @click="handleDel(scope.row)" v-if="hasDel(scope.row)">删除</a>
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
            titleInfo: PARENT_NAME['1'],
            searchForm: { name: '', status: '' },
            dataList: [],
            optionsList: [
                { value: _status.STATUS.WAITCOMMIT, label: _status.STATUS.WAITCOMMIT_LABEL },
                { value: _status.STATUS.WAITAUDIT, label: _status.STATUS.WAITAUDIT_LABEL },
                { value: _status.STATUS.AUDITED, label: _status.STATUS.AUDITED_LABEL },
                { value: _status.STATUS.PUBLISHED, label: _status.STATUS.PUBLISHED_LABEL },
                { value: _status.STATUS.OFFLINE, label: _status.STATUS.OFFLINE_LABEL }

            ],
            options: _status.STATUS_OPTION,                      
        }
    },
    methods: {
        loadData() {           
            let user = this.$store.getters.user;            
            let str = 'search=searchDataDeptId' ;
            if (this.searchForm.name) { str += ',name~' + this.searchForm.name; }
            if (this.searchForm.status) { str += ',onlineStatus:' + this.searchForm.status }
            str += '&sort=createTime~desc';
            this.showLoading();
            Api.activity.getActivityList(str, this.page, this.size).then((res) => {
                this.dataList = res.content;
                this.total = res.totalElements;
            }).finally(this.closeLoading);
        },
        // 编辑
        handleEdit(row) {
            this.$router.push({ path: 'activity', query: { id: row.id, flag: 1 } });
        },
        // 删除活动
        handleDel(row) {
            let self = this;
            self.delConfirm('活动', () => {
                Api.activity.delActivity(row.id).then((res) => {
                    this.showTip();
                    this.loadData();
                });
            });
        },
        // 添加
        handleAdd() {
            this.$router.push('activity');
        },
        // 提交审核
        handleVerify(row) {
            this.$confirm('是否提交审核?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then((res) => {
                let user = this.$store.getters.user;
                let dataForm = {
                    fromStatus: _status.STATUS.WAITCOMMIT,
                    toStatus: _status.STATUS.WAITAUDIT,
                    operatorDept: user.unit.name,
                    operatorName: user.name,
                    operateTime: this.formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss')
                }
                Api.activity.changeActivityOnline(row.id, dataForm).then((res) => {
                    this.loadData()
                });
            });
        },
        // 取最后一条拒绝信息
        getFlows(flows) {
            let operDesc = null;
            if (flows != null && flows.length > 0) {
                let lastFlow = flows[flows.length - 1];
                if (lastFlow.fromStatus === _status.STATUS.WAITAUDIT && lastFlow.toStatus === _status.STATUS.WAITCOMMIT) {
                    operDesc = lastFlow.operDesc;
                }
            }
            return operDesc;
        },
        // 格式化状态信息
        formatterOnlineStatus(row) {
            let value = row.onlineStatus;
            return _status.statusName(value);
        },
        formatterMofiytime(row) {
            let value = new Date(row.lastModifiedTime);
            return this.formatDate(value, 'yyyy-MM-dd HH:mm:ss');
        },
        hasEdit(row) {
            return row.onlineStatus === _status.STATUS.WAITCOMMIT
            // return _status.hasEditPermission(row.onlineStatus);
        },
        hasCommitAudit(row) {
            return _status.hasCommitAuditPermission(row.onlineStatus);
        },
        hasDel(row) {
            return _status.hasDelPermission(row.onlineStatus);
        },
        // 活动纪实
        handleRecord(row) {
            this.$router.push({ path: 'record_list', query: { id: row.id } });
        },
        convertArtType(row, column, cellValue) {
            let artType = [];
            for (let item of cellValue) {                 
               if(this.dicts.getValueByCode('artistClass', item))           
               artType.push(this.dicts.getValueByCode('artistClass', item)); 
            }
            return artType.join('、');
        },
        convertType(row, column, cellValue) {
            let activityType = [];
            for (let item of cellValue) {    
                if(this.dicts.getValueByCode('activityForm', item))                
                activityType.push(this.dicts.getValueByCode('activityForm', item));
            }
            return activityType.join('、');
        },
        convertReserveType(row, column, cellValue) {
            return _status.RESERVETYPE[cellValue];
        }
    },
    mounted() {
    }
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">

</style>
