<template>
    <div class="table-container">
        <el-table :data="dataList" border stripe v-loading.body="loading" tooltip-effect="custom-effect">
            <el-table-column label=" " type="index" align="center" width="80px"></el-table-column>
            <el-table-column label="传承人名称" align="center">
                <template scope="scope">
                    <router-link :to="{name:'viewsuccessor',params: { id: scope.row.id },query:{flag:myFlag}}" class="u-link">
                        {{scope.row.name}}
                    </router-link>
                </template>
            </el-table-column>
            <el-table-column prop="region" label="区域" align="center" :formatter="convertRegion"></el-table-column>
            <el-table-column prop="type" label="传承人类型" align="center" :formatter="convertType"></el-table-column>
            <el-table-column prop="level" label="资源级别" align="center" :formatter="convertLevel"></el-table-column>
            <el-table-column prop="batch" label="申报批次" align="center" :formatter="convertBatch"></el-table-column>
            <el-table-column label="状态" align="center">
                <template scope="scope">
                    <div>
                        {{convertStatus(scope.row)}}
                        <el-popover placement="top-start" width="200" trigger="hover" v-if="getFlows(scope.row.flowLogs)" popper-class="log-flow">
                            <h4 class="flow-title">拒绝理由</h4>
                            <p class="flow-content">{{getFlows(scope.row.flowLogs)}}</p>
                            <i class="sz-ico ico-reject"></i>
                        </el-popover>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="300px" align="center">
                <template scope="scope">
                    <div v-if="myFlag === 'index'">
                        <a class="btn-act" @click="handleEdit(scope.row)" v-if="scope.row.onlineStatus === onlineStatus.WAITCOMMIT">编辑</a>
                        <a class="btn-act" @click="handleVerify(scope.row)" v-if="hasCommitAudit(scope.row.onlineStatus)">提交审核</a>
                        <a class="btn-act" @click="handleDel(scope.row)" v-if="hasDel(scope.row.onlineStatus)">删除</a>
                    </div>
                    <div v-if="myFlag === 'verify'">
                        <a class="btn-act" @click="handleEdit(scope.row)">编辑</a>
                        <a class="btn-act" @click="handlePass(scope.row)">通过</a>
                        <a class="btn-act" @click="handleReject(scope.row)">拒绝</a>
                        <a class="btn-act" @click="handleRecycle(scope.row)" v-if="hasRecycled(scope.row.onlineStatus)">回收</a>
                    </div>
                    <div v-if="myFlag === 'pulish'">
                        <a class="btn-act" @click="handleEdit(scope.row)" v-if="scope.row.onlineStatus !== onlineStatus.PUBLISHED">编辑</a>
                        <a class="btn-act" @click="handlePub(scope.row)" v-if="hasPublish(scope.row.onlineStatus)">上架</a>
                        <a class="btn-act" @click="handleCancelPub(scope.row)" v-if="hasOffline(scope.row.onlineStatus)">下架</a>
                        <a class="btn-act" @click="handleRecommend(scope.row)" v-if="hasOffline(scope.row.onlineStatus)">{{scope.row.isTop==1?'取消置顶':'置顶'}}</a>
                        <a class="btn-act" @click="handleRecord(scope.row)">数字资源</a>
                        <a class="btn-act" @click="handleRecycle(scope.row)" v-if="hasRecycled(scope.row.onlineStatus)">回收</a>
                    </div>
                    <div v-if="myFlag === 'recycle'">
                        <a class="btn-act" @click="handleRestore(scope.row)">还原</a>
                        <a class="btn-act" @click="handleDel(scope.row)">删除</a>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination-container ">
            <v-pagination @pageChange="onCurrentChange" :total="total" :isShow="showPagination"></v-pagination>
        </div>
    </div>
</template>

<script>
import BaseTable from '@/mixins/base-table';
import Api from '@/api';
import _status from './heritage_status'
import _ from 'lodash';
export default {
    mixins: [BaseTable],
    props: {
        search: {
            type: String,
            default: ''
        },
        flag: {
            type: String,
            default: 'index'
        },
        notInit: {
            type: Boolean,
            default: true
        }
    },
    watch: {
        search() {
            this.loadData();
        }
    },
    data() {
        return {
            options: [],
            myFlag: this.flag,
            dictNames: ['heritageLevel', 'heritageType', 'heritageBatch'],
            onlineStatus: _status.STATUS
        }
    },
    methods: {
        callback() {
            this.showTip();
            this.loadData();
        },
        // 加载数据
        loadData() {
            this.showLoading();
            let user = this.$store.getters.user;
            let str = '';
            str += '&sort=createTime~desc';
            Api.heritage.getSuccessorList(this.search + str, this.page, this.size).then((res) => {
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
            this.$router.push({ path: 'successor', query: { id: row.id, flag: this.myFlag } });
        },
        // 改变状态
        changeStatus(id, data) {
            let user = this.$store.getters.user;
            let result = _.assignIn({
                'operatorDept': user.unit.name,
                'operatorName': user.name,
                'operatorDesc': '',
                'operateTime': this.formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss')
            }, data);

            Api.heritage.modifySuccessorStatus(id, result).then(this.callback).catch();
        },
        // 提交审核
        handleVerify(row) {
            if (row.onlineStatus === _status.STATUS.WAITAUDIT) return;
            let data = {
                'fromStatus': row.onlineStatus,
                'toStatus': _status.STATUS.WAITAUDIT,
                'operDesc': '提交审核'
            };
            this.changeStatus(row.id, data);
        },
        // 回收
        handleRecycle(row) {
            if (row.onlineStatus === _status.STATUS.RECYCLED) return;
            let data = {
                'fromStatus': row.onlineStatus,
                'toStatus': _status.STATUS.RECYCLED,
                'operDesc': '已回收'
            };
            this.changeStatus(row.id, data);
        },
        // 审核通过
        handlePass(row) {
            if (row.onlineStatus === _status.STATUS.AUDITED) return;
            let data = {
                'fromStatus': row.onlineStatus,
                'toStatus': _status.STATUS.AUDITED,
                'operDesc': '审核通过'
            };
            this.changeStatus(row.id, data);
        },
        // 审核不通过
        handleReject(row) {
            if (row.onlineStatus === _status.STATUS.WAITCOMMIT) return;
            this.$prompt('请输入拒绝理由', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            }).then(({ value }) => {
                let data = {
                    'fromStatus': row.onlineStatus,
                    'toStatus': _status.STATUS.WAITCOMMIT,
                    'operDesc': value
                };
                this.changeStatus(row.id, data);
            });
        },
        // 发布
        handlePub(row) {
            if (row.onlineStatus === _status.STATUS.PUBLISHED) return;
            let data = {
                'fromStatus': row.onlineStatus,
                'toStatus': _status.STATUS.PUBLISHED,
                'operDesc': '发布'
            };
            this.changeStatus(row.id, data);
        },
        // 取消发布
        handleCancelPub(row) {
            if (row.onlineStatus === _status.STATUS.OFFLINE) return;
            let data = {
                'fromStatus': row.onlineStatus,
                'toStatus': _status.STATUS.OFFLINE,
                'operDesc': '取消发布'
            };
            this.changeStatus(row.id, data);
        },
        // 还原
        handleRestore(row) {
            if (row.onlineStatus === _status.STATUS.WAITCOMMIT) return;
            let data = {
                'fromStatus': row.onlineStatus,
                'toStatus': _status.STATUS.WAITCOMMIT,
                'operDesc': '还原'
            };
            this.changeStatus(row.id, data);
        },
        // 删除
        handleDel(row) {
            let self = this;
            self.delConfirm('名录信息', () => {
                Api.heritage.delSuccessor(row.id).then(self.callback);
            });
        },
        // 推荐/ 取消推荐
        handleRecommend(row) {
            Api.heritage.setSuccessorTop(row.id, !row.isTop).then(this.callback).catch();
        },
        getRegion() {
            let unit = this.$store.getters.user.unit;
            Api.system.getAllRegion(unit.region).then((res) => {
                this.options = res;
            });
        },
        //格式化区域
        convertRegion(row, column, cellValue) {
            return this.dicts.regionName(cellValue);
        },

        // 状态格式化
        convertStatus(row) {
            return _status.statusName(row.onlineStatus);
        },
        // 格式化“ 非遗类型 ”
        convertType(row, column, cellValue) {
            return this.dicts.getValueByCode('heritageType', cellValue);
        },
        // 格式化“ 非遗级别 ”
        convertLevel(row, column, cellValue) {
            return this.dicts.getValueByCode('heritageLevel', cellValue);
        },
        // 格式化“ 非遗申报批次 ”
        convertBatch(row, column, cellValue) {
            return this.dicts.getValueByCode('heritageBatch', cellValue);
        },
        // 是否能提交审核（待提交状态）
        hasCommitAudit(status) {
            return _status.hasCommitAuditPermission(status);
        },
        // 是否是'已回收'
        hasRecycled(status) {
            // 已经是“回收”状态或“发布”状态的活动室，不能回收
            return _status.hasRecycledPermission(status);
        },
        // 是否能'编辑'
        hasEdit(status) {
            return _status.hasEditPermission(status);
        },
        // 是否能'发布'
        hasPublish(status) {
            return _status.hasPublishPermission(status);
        },
        // 是否能'下线'
        hasOffline(status) {
            return _status.hasOfflinePermission(status);
        },
        // 是否能'删除'
        hasDel(status) {
            return _status.hasDelPermission(status);
        },
        // 数字资源
        handleRecord(row) {
            this.$router.push({ path: '../successorRecord', query: { id: row.id } });
        },
        getFlows(flows) {
            let operDesc = null;
            if (flows != null && flows.length > 0) {
                let lastFlow = flows[flows.length - 1];
                if (lastFlow.fromStatus === _status.STATUS.WAITAUDIT && lastFlow.toStatus === _status.STATUS.WAITCOMMIT) {
                    operDesc = lastFlow.operDesc;
                }
            }
            return operDesc;
        }
    },
    mounted() {
        this.getRegion()
    }
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
</style>
