<template>
    <div class="list-wrapper">
        <v-pageheader :breadcrumbs="[{ to:'activity',name: '活动辅助管理' },{name:title}]"></v-pageheader>
        <div class="table-container" style="margin-top:30px;">
            <el-table :data="workList" border stripe v-loading.body="workLoading">
                <el-table-column type="index" label=" " width="50"></el-table-column>
                <el-table-column prop="name" label="作品名称">
                    <template scope="scope">
                        <a href="javascript:void(0)" @click="showDetail(scope.row)" class="u-link">
                            {{scope.row.name}}
                        </a>
                    </template>
                </el-table-column>
                <el-table-column prop="type" label="作品类型" :formatter="formatType"></el-table-column>
                <el-table-column prop="arts" label="艺术门类" :formatter="formatActType"></el-table-column>
                <el-table-column prop="unitName" label="指导文化馆"></el-table-column>
                <el-table-column prop="contact" label="作品负责人"></el-table-column>
                <el-table-column prop="seqno" label="作品顺序号"></el-table-column>
                <el-table-column prop="deliverUnitName" label="上报单位"></el-table-column>
                <el-table-column label="操作" width="200px" align="center">
                    <template scope="scope">
                        <a class="btn-act" @click='workUp(scope.row)' v-if="!scope.row.deliverUnitId">上报</a>
                        <a class="btn-act" @click='delAct(scope.row)'>删除</a>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog title="查看作品" v-model="dialogVisible" custom-class="m-workDetail">
            <v-workDetail :viewForm="curWork"></v-workDetail>
            <div class="dialog-footer">
                <el-button @click="dialogVisible=false">关闭</el-button>
            </div>
        </el-dialog>
        <el-dialog title="上报作品" v-model="upperDialog" custom-class="m-workUpper">
            <el-row type="flex" justify="center" :gutter="20">
                <el-col :span="8" class="tree-wrapper">
                    <div class="tree-heading">
                        <div class="v-line"></div>
                        <h5 class="u-title">可选上报机构</h5>
                    </div>
                    <div class="tree-panel">
                        <el-tree ref="orgTree" :data="treeData" :props="defaultProps" node-key="id" :expand-on-click-node="false" :current-node-key='currentNode' highlight-current default-expand-all @node-click="HandNodeclick" :render-content="renderContent"></el-tree>
                    </div>
                </el-col>
                <el-col :span="16">
                    <div class="tree-heading">
                        <div class="v-line"></div>
                        <h5 class="u-title">可选活动</h5>
                    </div>
                    <div class="table-container">
                        <el-table :data="dataList" border highlight-current-row @current-change="handleCurrentChange" v-loading.body="loading">
                            <el-table-column type="index" label=" " width="50"></el-table-column>
                            <el-table-column prop="name" label="名称"></el-table-column>
                            <el-table-column label="活动时间" align="center">
                                <template scope="scope">
                                    {{scope.row.startDate}}~{{scope.row.endDate}}
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="pagination-container ">
                            <v-pagination @pageChange="onCurrentChange" :total="total" :isShow="showPagination"></v-pagination>
                        </div>
                    </div>
                </el-col>
            </el-row>
            <div class="tree-heading" style="margin-top:50px;" @close="closeDialog">
                <div class="v-line"></div>
                <h5 class="u-title">已选活动：{{currentRow?currentRow.name:''}}</h5>
            </div>
            <div class="dialog-footer">
                <el-button type="primary" @click="handleUpper">上报</el-button>
                <el-button @click="closeDialog">关闭</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import Api from '@/api';
import { uniqBy, concat, uniq } from 'lodash';
import view from './work_view'
import treePanel from '../../system/organizations/org_tree_panel'
import BaseTable from '@/mixins/base-table';
const TYPE = { stageArts: '舞台艺术类', exhibition: '展览艺术类' }
export default {
    mixins: [BaseTable],
    components: {
        'v-workDetail': view,
        'v-orgtree': treePanel
    },
    data() {
        return {
            title: '作品管理',
            workList: [],
            workLoading: false,
            dialogVisible: false,
            curWork: {},
            upperDialog: false,
            search: '',
            currentRow: null,
            upperWork: null,
            treeData: [],
            defaultProps: { children: 'children', label: 'name' },
            currentNode: ''
        };
    },
    created() {
        this.dicts.dictInit('artcategory')
        this.id = this.$route.query.id;
        this.uId = this.$route.query.uId;
        this.title = this.$route.query.name
        this.loadData();
        this.getTreedatas();
    },
    methods: {
        loadData() {
            this.workLoading = true;
            Api.assist.getActWorks(this.id).then((res) => {
                if (res && res.length > 0) {
                    let units = uniqBy(res, 'unitId');
                    let srcUnitIds = uniqBy(res, 'srcUnitId');
                    let deliverUnitIds = uniqBy(res, 'deliverUnitId');
                    let unitIds = units.map(x => x.unitId)
                    unitIds = concat(unitIds, srcUnitIds.map(x => x.srcUnitId))
                    unitIds = concat(unitIds, deliverUnitIds.map(x => x.deliverUnitId))
                    unitIds = uniq(unitIds)

                    Api.system.getUnits('id:' + unitIds.join('~'), 1, -1).then((unitList) => {
                        if (unitList.content.length > 0) {
                            for (let i = 0; i < res.length; i++) {
                                const element = res[i];
                                let unitInfo = unitList.content.find(x => x.id == element.unitId);
                                element.unitName = unitInfo ? unitInfo.name : '';

                                let srcUnit = unitList.content.find(x => x.id == element.srcUnitId);
                                element.srcUnitName = srcUnit ? srcUnit.name : '';

                                let deliverUnit = unitList.content.find(x => x.id == element.deliverUnitId);
                                element.deliverUnitName = deliverUnit ? deliverUnit.name : '';
                            }
                        }
                        this.workList = res;
                    })
                } else {
                    this.workList = [];
                }

            }).finally(() => { this.workLoading = false });
        },
        // 左边组织树节点点击处理
        HandNodeclick(orgInfo) {
            // if (orgInfo.id === this.uId) return;
            this.showLoading();
            let str = this.search + ',unitId:' + orgInfo.id;
            Api.assist.getActList(str, this.page, this.size).then((res) => {
                this.dataList = res.content;
                this.total = res.totalElements;
            }).finally(this.closeLoading);
        },
        handleCurrentChange(val) {
            this.currentRow = val;
        },
        //格式化艺术类型
        formatActType(row, column, cellValue) {
            return this.dicts.getValueByCode('artcategory', cellValue);
        },
        //格式化类型
        formatType(row, column, cellValue) {
            return TYPE[cellValue] || '';
        },
        showDetail(item) {
            this.curWork = {};
            this.curWork = item;
            this.dialogVisible = true;
        },
        // 上报
        workUp(row) {
            this.search = 'isDisabled:false,type:' + row.type;
            this.upperWork = row;
            this.upperDialog = true
            if (this.treeData.length) {
                this.currentNode = this.treeData[0].id;
                this.HandNodeclick(this.treeData[0])
            }
        },
        closeDialog() {
            this.search = '';
            this.upperWork = null;
            this.currentRow = null;
            this.upperDialog = false;
            this.dataList = [];
            this.total = 0;
            this.currentNode = ''
        },
        handleUpper() {
            if (!this.currentRow || !this.currentRow.id || !this.upperWork) {
                this.showTip('请选择需要上报到的活动', 'error')
                return
            }

            if (this.id === this.currentRow.id) {
                this.showTip('不可以上报给自己，请选择其他活动', 'error')
                return;
            }
            Api.assist.upperWork(this.id, this.upperWork.code, this.currentRow.id).then(() => {
                this.closeDialog();
                this.callback();
            });
        },
        // 删除
        delAct(row) {
            var self = this;
            self.delConfirm('活动作品', () => {
                Api.assist.delActWork(this.id, row.code).then(self.callback);
            });
        },
        callback() {
            this.loadData();
        },
        // 获取组织树数据
        getTreedatas() {
            Api.system.getUnits('type:org&sort=seqno~desc', 1, -1).then((res) => {
                let dataList = res.content;
                if (dataList.length > 0) {
                    let rootUnit = dataList.filter(x => x.parentId === null);
                    let childrenFn = function(curUnit, allUnit) {
                        // let columnsData = [];
                        for (let item of curUnit) {
                            item.children = [];
                            let children = allUnit.filter(x => x.parentId === item.id);
                            if (children.length) {
                                item.children = childrenFn(children, allUnit);
                            }
                        }
                        return curUnit;
                    }
                    let result = childrenFn(rootUnit, dataList);

                    this.treeData = result;
                }
            });
        },
        // 节点渲染
        renderContent(h, { node, data, store }) {
            let icon = data.type === 'org' ? 'sz-ico ico-org' : 'sz-ico ico-dep';
            return h('span', { class: 'u-tree-node' }, [
                h('i', { class: icon }),
                h('span', node.label)
            ]);
        }
    }
};
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
.m-workDetail {
  $dialog-h: 700px;
  width: 800px;
}
.m-workUpper {
  width: 800px;
  min-height: 400px;
  .el-table__body tr.current-row > td {
    background: #20a0ff;
    color: #fff;
  }
}
</style>
