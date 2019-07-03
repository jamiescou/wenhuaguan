<template>
    <div class="list-wrapper">
        <v-pageheader :breadcrumbs="[{ name: '我发布的通知' }]"></v-pageheader>
        <section class="search-wrapper" style="position:relative; height:40px;">
            <el-form :inline="true" :model="searchForm" label-width="0">
                <el-form-item>
                    <el-input v-model="searchForm.title" placeholder="标题"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="loadData">查询</el-button>
                </el-form-item>
            </el-form>
            <div class="right-opers" style="margin-top:-36px;">
                <el-button type="primary" @click="handleAdd">添加通知</el-button>
            </div>
        </section>
        <div class="table-container" style="margin-top:20px;">
            <el-table :data="dataList" border stripe v-loading.body="loading">
                <el-table-column prop="title" label="标题">
                    <template scope="scope">
                        <router-link :to="{path:'noticeview', query: { id: scope.row.id }}" class="u-link">
                            {{ scope.row.title }}
                        </router-link>
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
                <el-table-column prop="creator.userName" label="创建者" align="center"></el-table-column>
                <el-table-column label="操作" align="center">
                    <template scope="scope">
                        <a class="btn-act" @click="edit(scope.$index, scope.row)">编辑</a>
                        <a class="btn-act" @click="del(scope.$index, scope.row)">删除</a>
                        <a class="btn-act" @click="showTagets(scope.row)" v-if="!scope.row.isInner && scope.row.targets && scope.row.targets.length ">签收状态</a>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination-container ">
                <v-pagination @pageChange="onCurrentChange" :total="total" :isShow="showPagination"></v-pagination>
            </div>
        </div>
        <el-dialog title="签收情况" v-model="dialogVisible">
            <div>
                <el-table :data="targets" style="width: 100%" border highlight-current-row>
                    <el-table-column prop="unitName" label="签收机构"></el-table-column>
                    <el-table-column prop="managerName" label="签收人"></el-table-column>
                    <el-table-column prop="readTime" label="签收时间"></el-table-column>
                    <el-table-column label="是否签收">
                        <template scope="scope">{{scope.row.hasRead?'已签收':''}}</template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="dialog-footer">
                <el-button @click="dialogVisible = false">关闭</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import Api from '@/api';
import vRules from '@/config/validate_rules';
import BaseTable from '@/mixins/base-table';
export default {
    mixins: [BaseTable],
    data() {
        return {
            searchForm: { title: '' },
            dialogVisible: false,
            targets: [],
            units: {}
        };
    },
    methods: {
        loadData() {
            this.showLoading();
            let title = this.searchForm.title;
            let str = 'creator.userId:' + this.$store.getters.user.username;
            if (title !== '') str += ',title~' + title;
            str += '&sort=createTime~desc'
            Api.notice.getNoticeList(str, this.page, this.size).then((res) => {
                this.dataList = res.content;
                this.total = res.totalElements;
            }).finally(this.closeLoading);
        },
        showTagets(row) {
            // 当前缓存中不存在的机构
            let unitIds = [];
            this.targets = row.targets.slice(0);
            for (const target of this.targets) {
                let unitName = this.units[target.unitId];
                if (unitName) {
                    target.unitName = unitName;
                } else {
                    target.unitName = '';
                    unitIds.push(target.unitId)
                }
            }
            if (unitIds.length > 0) {
                Api.system.getUnits('id:' + unitIds.join('~'), 1, -1).then((res) => {
                    if (res.content.length > 0) {
                        for (let i = 0; i < res.content.length; i++) {
                            const element = res.content[i];
                            this.units[element.id] = element.name;
                            let target = this.targets.find(x => x.unitId === element.id);
                            target.unitName = element.name;
                        }
                    }
                }).finally(() => {
                    this.dialogVisible = true;
                });
            } else {
                this.dialogVisible = true;
            }
        },
        // 添加
        handleAdd() {
            this.$router.push('notice');
        },

        // 删除
        del(index, row) {
            let self = this;
            self.delConfirm('通知', () => {
                Api.notice.delNotice(row.id).then(self.callback);
            });
        },

        // 编辑
        edit(index, row) {
            this.$router.push({ path: 'notice', query: { id: row.id } })
        },
        callback() {
            this.showTip();
            this.loadData();
        }
    }
};
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">

</style>
