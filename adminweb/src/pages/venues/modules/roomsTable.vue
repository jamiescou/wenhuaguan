<template>
    <div class="table-container">
        <el-table :data="dataList" border stripe v-loading.body="loading" tooltip-effect="custom-effect">
            <el-table-column label=" " type="index" align="center" width="80px"></el-table-column>
            <el-table-column label="名称" align="center">
                <template scope="scope">
                    <router-link :to="{name:'view',params: { id: scope.row.id },query:{flag:flag}}" class="u-link">
                        {{scope.row.name}}
                    </router-link>
                </template>
            </el-table-column>
            <el-table-column prop="type" label="类型" align="center" :formatter="convertType"></el-table-column>
            <el-table-column prop="venue.name" label="所属场馆" align="center"></el-table-column>
            <el-table-column prop="area" label="面积大小" align="center"></el-table-column>
            <el-table-column prop="totalPeoples" label="可容人数" align="center"></el-table-column>
            <el-table-column prop="telephone" label="联系电话" align="center"></el-table-column>
            <el-table-column prop="creator.userName" label="创建人" align="center"></el-table-column>
            <el-table-column prop="onlineStatus" label="状态" align="center">
                <template scope="scope">
                    <div>
                        {{convertStatus(scope.row)}}
                        <el-popover placement="top-start" width="200" trigger="hover" v-if="getFlows(scope.row.flowLogs)" popper-class="log-flow">
                            <h4 class="flow-title">拒绝理由</h4>
                            <p class="flow-content">{{getFlows(scope.row.flowLogs)}}</p>
                            <i class="sz-ico ico-reject" slot="reference"></i>
                        </el-popover>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="300px" align="center">
                <template scope="scope">
                    <div v-if="flag === 1">
                        <a class="btn-act" @click="handleEdit(scope.row)" v-if="hasEdit(scope.row.onlineStatus)">编辑</a>
                        <a class="btn-act" @click="handleVerify(scope.row)" v-if="hasCommitAudit(scope.row.onlineStatus)">提交审核</a>
                        <a class="btn-act" @click="handleDel(scope.row)" v-if="hasDel(scope.row.onlineStatus)">删除</a>
                    </div>
                    <div v-if="flag === 2  && scope.row.onlineStatus === 'WaitAudit'">
                        <a class="btn-act" @click="handleEdit(scope.row)" v-if="hasEdit(scope.row.onlineStatus)">编辑</a>
                        <a class="btn-act" @click="handlePass(scope.row)">通过</a>
                        <a class="btn-act" @click="handleReject(scope.row)">拒绝</a>
                        <a class="btn-act" @click="handleRecycle(scope.row)" v-if="hasRecycled(scope.row.onlineStatus)">回收</a>
                    </div>
                    <div v-if="flag === 3">
                        <a class="btn-act" @click="handleEdit(scope.row)" v-if="hasEdit(scope.row.onlineStatus)">编辑</a>
                        <a class="btn-act" @click="handlePub(scope.row)" v-if="hasPublish(scope.row.onlineStatus)">上架</a>
                        <a class="btn-act" @click="handleCancelPub(scope.row)" v-if="hasOffline(scope.row.onlineStatus)">下架</a>
                        <a class="btn-act" @click="handleRecommend(scope.row)">{{scope.row.isTop?'取消置顶':'置顶'}}</a>
                        <a class="btn-act" @click="handleRoomOrders(scope.row)">订单管理</a>
                        <a class="btn-act" @click="handleRecycle(scope.row)" v-if="hasRecycled(scope.row.onlineStatus)">回收</a>
                    </div>
                    <div v-if="flag === 4">
                        <!--<a class="btn-act" @click="handleRestore(scope.row)">还原</a>-->
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
import roomStatus from './status'
import { assignIn } from 'lodash';
export default {
    mixins: [BaseTable],
    props: {
        search: {
            type: String,
            default: ''
        },
        flag: {
            type: Number,
            default: 1
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
            dictNames: ['venueRoomType']
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
            let searchStr = this.search + '&sort=createTime~desc';
            Api.venue.getVenueRoomsList(searchStr, this.page, this.size).then((res) => {
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
            this.$router.push({ path: 'room', query: { id: row.id, flag: this.flag } });
        },
        // 改变状态
        changeStatus(id, data) {
            let user = this.$store.getters.user;
            let result = assignIn({
                'operatorDept': user.unit.name,
                'operatorName': user.name,
                'operatorDesc': '',
                'operateTime': this.formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss')
            }, data);

            Api.venue.modifyRoomStatus(id, result).then(this.callback).catch();
        },
        // 提交审核
        handleVerify(row) {
            if (row.onlineStatus === roomStatus.STATUS.WAITAUDIT) return;
            let data = {
                'fromStatus': row.onlineStatus,
                'toStatus': roomStatus.STATUS.WAITAUDIT,
                'operDesc': '提交审核'
            };
            this.changeStatus(row.id, data);
        },
        // 回收
        handleRecycle(row) {
            this.$confirm('是否确认回收?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                if (row.onlineStatus === roomStatus.STATUS.RECYCLED) return;
                let data = {
                    'fromStatus': row.onlineStatus,
                    'toStatus': roomStatus.STATUS.RECYCLED,
                    'operDesc': '已回收'
                };
                this.changeStatus(row.id, data);
            });
        },
        // 审核通过
        handlePass(row) {
            if (row.onlineStatus === roomStatus.STATUS.AUDITED) return;
            let data = {
                'fromStatus': row.onlineStatus,
                'toStatus': roomStatus.STATUS.AUDITED,
                'operDesc': '审核通过'
            };
            this.changeStatus(row.id, data);
        },
        // 审核不通过
        handleReject(row) {
            if (row.onlineStatus === roomStatus.STATUS.WAITCOMMIT) return;
            this.$prompt('请输入拒绝理由', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            }).then(({ value }) => {
                let data = {
                    'fromStatus': row.onlineStatus,
                    'toStatus': roomStatus.STATUS.WAITCOMMIT,
                    'operDesc': value
                };
                this.changeStatus(row.id, data);
            });
        },
        // 发布
        handlePub(row) {
            if (row.onlineStatus === roomStatus.STATUS.PUBLISHED) return;
            let data = {
                'fromStatus': row.onlineStatus,
                'toStatus': roomStatus.STATUS.PUBLISHED,
                'operDesc': '发布'
            };
            this.changeStatus(row.id, data);
        },
        // 取消发布
        handleCancelPub(row) {
            if (row.onlineStatus === roomStatus.STATUS.OFFLINE) return;
            let data = {
                'fromStatus': row.onlineStatus,
                'toStatus': roomStatus.STATUS.OFFLINE,
                'operDesc': '取消发布'
            };
            this.changeStatus(row.id, data);
        },
        // 还原
        handleRestore(row) {
            if (row.onlineStatus === roomStatus.STATUS.WAITCOMMIT) return;
            let data = {
                'fromStatus': row.onlineStatus,
                'toStatus': roomStatus.STATUS.WAITCOMMIT,
                'operDesc': '还原'
            };
            this.changeStatus(row.id, data);
        },
        // 删除
        handleDel(row) {
            let self = this;
            self.delConfirm('活动室信息', () => {
                Api.venue.delVenueRoom(row.id).then(self.callback);
            });
        },
        // 活动室订单
        handleRoomOrders(row) {
            this.$router.push({ path: 'roomorders', query: { id: row.id, flag: this.flag } });
        },
        // 推荐/ 取消推荐
        handleRecommend(row) {
            Api.venue.roomRecommend(row.id, !row.isTop).then(this.callback).catch();
        },
        // 活动室类型名称
        convertType(row, column, cellValue) {
            return this.dicts.getValueByCode('venueRoomType', cellValue);
        },
        // 活动室状态
        convertStatus(row) {
            return roomStatus.statusName(row.onlineStatus);
        },
        // 是否能提交审核（待提交状态）
        hasCommitAudit(status) {
            return roomStatus.hasCommitAuditPermission(status);
        },
        // 是否是'已回收'
        hasRecycled(status) {
            // 已经是“回收”状态或“发布”状态的活动室，不能回收
            return roomStatus.hasRecycledPermission(status);
        },
        // 是否能'编辑'
        hasEdit(status) {
            switch (this.flag) {
                case 1:
                    return status === roomStatus.STATUS.WAITCOMMIT;
                case 2:
                    return status === roomStatus.STATUS.WAITAUDIT;
                case 3:
                    return status === roomStatus.STATUS.AUDITED || status === roomStatus.STATUS.OFFLINE;
                default:
                    return false;
                    break;
            }
            // return roomStatus.hasEditPermission(status);
        },
        // 是否能'发布'
        hasPublish(status) {
            return roomStatus.hasPublishPermission(status);
        },
        // 是否能'删除'
        hasDel(status) {
            return roomStatus.hasDelPermission(status);
        },
        // 是否能'下架'
        hasOffline(status) {
            return roomStatus.hasOfflinePermission(status);
        },
        // 显示拒绝理由，从“审核”打回到“待审核” 才有拒绝理由
        getFlows(flows) {
            let operDesc = null;
            if (flows != null && flows.length > 0) {
                let lastFlow = flows[flows.length - 1];
                if (lastFlow.fromStatus === roomStatus.STATUS.WAITAUDIT && lastFlow.toStatus === roomStatus.STATUS.WAITCOMMIT) {
                    operDesc = lastFlow.operDesc;
                }
            }
            return operDesc;
        }
    }
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
</style>
