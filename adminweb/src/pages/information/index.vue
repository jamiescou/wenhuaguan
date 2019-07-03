<template>
    <div class="list-wrapper">
        <v-pageheader :breadcrumbs="[{ name: '资讯管理' }]"></v-pageheader>
        <div class="right-opers">
            <el-button type="primary" @click="hanldAdd" icon="plus">新增资讯</el-button>
        </div>
        <section class="search-wrapper">
            <el-form :inline="true" :model="searchForm" label-width="0px">
                <el-form-item>
                    <el-input v-model="searchForm.name" placeholder="请输入资讯标题"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="searchForm.ColumnNames" placeholder="请选择栏目" clearable>
                        <el-option :key="item.name" :label="item.name" :value="item.name" v-for="item in ColumnNamesList"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="searchForm.isPublish" placeholder="请选择状态" clearable>
                        <el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in isPublishstates"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="loadData">查询</el-button>
                </el-form-item>
            </el-form>
        </section>
        <div class="table-container">
            <el-table :data="dataList" border stripe tooltip-effect="custom-effect">
                <el-table-column label=" " type="index" width="80px" align="center"></el-table-column>
                <el-table-column label="标题">
                    <template scope="scope">
                        <router-link :to="{name:'viewinfo',params: { id: scope.row.id }}" class="u-link">
                            {{scope.row.title}}
                        </router-link>
                    </template>
                </el-table-column>
                <el-table-column prop="column" label="栏目">
                    <template scope="scope">
                        {{getColumnNames(scope.row)}}
                    </template>
                </el-table-column>
                <el-table-column prop="publishTime" label="发布时间"></el-table-column>
                <el-table-column prop="source" label="来源"></el-table-column>
                <el-table-column prop="author" label="作者"></el-table-column>
                <el-table-column label="状态">
                    <template scope="scope">{{scope.row.isPublish?'已上架':'未上架'}}</template>
                </el-table-column>
                <el-table-column label="置顶状态">
                    <template scope="scope">{{scope.row.isTop?'置顶':'未置顶'}}</template>
                </el-table-column>
                <el-table-column label="操作" width="340px" align="center">
                    <template scope="scope">
                        <a class="btn-act" @click="handleEdit(scope.row)" v-if="!scope.row.isPublish">编辑</a>
                        <a class="btn-act" @click="handlePub(scope.row)">{{scope.row.isPublish?'下架':'上架'}}</a>
                        <a class="btn-act" @click="handleRecommend(scope.row)">{{scope.row.isTop?'取消置顶':'置顶'}}</a>
                        <a class="btn-act" @click="handleDel(scope.row)" v-if="!scope.row.isPublish">删除</a>
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
import Api from '@/api';
import BaseTable from '@/mixins/base-table';
export default {
    mixins: [BaseTable],
    data() {
        return {
            dataList: [],
            treeData: [],
            ColumnNamesList: [],
            isPublishstates: [{
                label: '已上架',
                value: "true"
            }, {
                label: '未上架',
                value: "false"
            }],
            defaultProps: {
                label: 'name',
                children: 'children'
            },
            currentNode: '', // 默认选中的节点
            defaultExpanded: [], // 默认展开的节点
            currentColumn: {},
            searchForm: {
                name: '',
                ColumnNames: '',
                isPublish: ''
            },
            doNotInit: true
        }
    },
    mounted() {
        this.getColumns();
        this.loadData();
        // &sort=seqno|asc
        // Api.information.getColumns('&sort=seqno~asc', 1, -1).then((res) => {
        //     let list = res.content
        //     this.treeData = this.genTree(list);
        //     if (this.treeData && this.treeData.length > 0) {
        //         let firstNode = this.treeData[0];
        //         this.currentColumn = firstNode;
        //         this.currentNode = firstNode.id;
        //         this.defaultExpanded = [this.currentNode];
        //     }
        // });
    },
    methods: {
        getColumns() {
            let str = '';
            let user = this.$store.getters.user;
            str += "";
            Api.information.getColumns(str, this.page, -1).then((res) => {
                this.ColumnNamesList = res.content;

            });
        },
        genTree(dataList) {
            let list = dataList.filter(x => x.parent === null || x.parent === undefined);
            for (let i = 0; i < list.length; i++) {
                let childrenList = dataList.filter(x => x.parent && x.parent.id === list[i].id);
                list[i].children = childrenList;
            }
            return list;
        },
        HandNodeclick(data, node, self) {
            if (!this.currentColumn || data.id !== this.currentColumn.id) {
                this.currentColumn = data;
            }
            this.loadData();
        },
        loadNode(node, resolve) {
            if (node.level === 0) {
                return resolve(this.treeData);
            }
            Api.information.getColumnsOfChildren(node.data.id).then((res) => {
                resolve(res);
            });
        },
        // 新增资讯
        hanldAdd() {
            this.$router.push('information');
        },
        loadData() {

            this.showLoading();
            let user = this.$store.getters.user;
            let search = 'searchDataDeptId';
            // let search='';
            if (this.searchForm.name) search += ',title~' + this.searchForm.name;
            if (this.searchForm.ColumnNames) search += ',column.name~' + this.searchForm.ColumnNames;
            if (this.searchForm.isPublish) search += ',isPublish:' + this.searchForm.isPublish;
            search += '&sort=publishTime~desc';
            Api.information.getInformations(search, this.page, this.size).then((res) => {
                if (res.content.length) {
                    for (const item of res.content) {
                        item.isTop = item[this.$store.getters.remandField] ? 1 : 0;
                    }
                }

                this.dataList = res.content;
                this.total = res.totalElements;
            }).finally(this.closeLoading);
        },
        getColumnNames(row) {
            if (row.column != null) {
                let column = row.column.map((item) => {
                    return item.name
                });
                return column.join('、');
            } else {
                return "";
            }

        },
        callback() {
            this.showTip();
            this.loadData();
        },
        // 预览
        handlePreview(row) { },
        // 编辑
        handleEdit(row) {
            this.$router.push({
                path: 'information',
                query: {
                    id: row.id
                }
            });
        },
        // 发布/取消发布
        handlePub(row) {
            Api.information.setPublish(row.id, !row.isPublish).then(this.callback).catch();
        },
        // 推荐/取消推荐
        handleRecommend(row) {
            Api.information.setRecommend(row.id, !row.isTop).then(this.callback).catch();
        },
        // 删除
        handleDel(row) {
            let self = this;
            self.delConfirm('资讯', () => {
                Api.information.delInformation(row.id).then(self.callback);
            });
        },
        // 推送至首页
        handlePush(row) { }
    }
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
.info-wrapper {
  .tree-wrapper {
    min-width: 240px;
  }
  .form-myss {
    margin: 5px 0;
  }
}
</style>
