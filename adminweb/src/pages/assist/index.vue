<template>
    <div class="list-wrapper">
        <v-pageheader :breadcrumbs="[{ name: '活动通知管理' }]"></v-pageheader>

        <el-tabs>
            <el-tab-pane>
                <span slot="label">
                    <i class="sz-ico ico-tongzhi"></i> 我接收的通知</span>
                <div class="table-container">
                    <section class="search-wrapper">
                        <el-form :inline="true" :model="receive.searchForm" label-width="0">
                            <el-form-item>
                                <el-input v-model="receive.searchForm.title" placeholder="标题"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="loadReceive">查询</el-button>
                            </el-form-item>
                        </el-form>
                    </section>

                    <el-table :data="receive.list" border stripe v-loading.body="receive.loading">
                        <el-table-column prop="title" label="标题">
                            <template scope="scope">
                                <router-link :to="{path:'noticeview', query: { id: scope.row.id }}" class="u-link">
                                    {{ scope.row.title }}
                                </router-link>
                            </template>
                        </el-table-column>
                        <el-table-column label="时间周期" align="center">
                            <template scope="scope">
                                <div style="padding:5px 0 0;line-height:24px">{{ scope.row.startDate }}</div>
                                <div style="line-height:1">~</div>
                                <div style="padding:0 0 5px;line-height:24px">{{ scope.row.endDate }}</div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="creator.userName" label="创建者" align="center"></el-table-column>
                        <el-table-column label="操作" align="center">
                            <template scope="scope">
                                <a class="btn-act" @click="edit(scope.$index, scope.row)">编辑</a>
                                <a class="btn-act" @click="del(scope.$index, scope.row)">删除</a>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="pagination-container ">
                        <v-pagination @pageChange="onReceiveCurrentChange" :total="receive.total" :isShow="showReceivePagination"></v-pagination>
                    </div>
                </div>
            </el-tab-pane>
            <el-tab-pane>
                <span slot="label">
                    <i class="sz-ico ico-fasong"></i> 我发布的通知</span>
                <section class="search-wrapper" style="position:relative; height:40px;">
                    <el-form :inline="true" :model="issue.searchForm" label-width="0">
                        <el-form-item>
                            <el-input v-model="issue.searchForm.title" placeholder="标题"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="loadIssue">查询</el-button>
                        </el-form-item>
                    </el-form>
                    <div class="right-opers" style="margin-top:-36px;">
                        <el-button type="primary" @click="handleAdd">添加通知</el-button>
                    </div>
                </section>
                <div class="table-container" style="margin-top:20px;">
                    <el-table :data="issue.list" border stripe v-loading.body="issue.loading">
                        <el-table-column prop="title" label="标题">
                            <template scope="scope">
                                <router-link :to="{path:'noticeview', query: { id: scope.row.id }}" class="u-link">
                                    {{ scope.row.title }}
                                </router-link>
                            </template>
                        </el-table-column>
                        <el-table-column label="时间周期" align="center" >
                            <template scope="scope">
                                <div style="padding:5px 0 0;line-height:24px">{{scope.row.startDate}} ~ {{scope.row.endDate}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="creator.userName" label="创建者" align="center"></el-table-column>
                        <el-table-column label="操作" align="center">
                            <template scope="scope">
                                <a class="btn-act" @click="edit(scope.$index, scope.row)">编辑</a>
                                <a class="btn-act" @click="del(scope.$index, scope.row)">删除</a>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="pagination-container ">
                        <v-pagination @pageChange="onIssueCurrentChange" :total="issue.total" :isShow="showIssuePagination"></v-pagination>
                    </div>
                </div>
            </el-tab-pane>
        </el-tabs>

    </div>
</template>

<script>
import vRules from '@/config/validate_rules';
import Api from '@/api';
export default {
    data() {
        return {
            issue: {
                searchForm: { title: '' },
                list: [], // 发布列表
                page: 1,
                size: 15,
                total: 0,
                loading: false
            },
            receive: {
                searchForm: { title: '' },
                list: [],    // 接收列表
                page: 1,
                size: 15,
                total: 0,
                loading: false // 加载标识
            }
        };
    },
    watch: {
        'issue.page': 'loadIssue', // 监控page的变化，page发生变化调用loadData
        'receive.page': 'loadReceive'
    },
    computed: {
        showReceivePagination() {
            return !this.receive.loading && this.receive.total > this.receive.size;
        },
        showIssuePagination() {
            return !this.issue.loading && this.issue.total > this.issue.size;
        }
    },
    methods: {
        /**
         * 我发送的通知 -- 跳转页面
         */
        onIssueCurrentChange(page) {
            this.issue.page = page;
        },
        /**
         * 我接收的通知 -- 跳转页面
         */
        onReceiveCurrentChange(page) {
            this.receive.page = page;
        },
        // 我接收的消息
        loadIssue() {
            let title = this.issue.searchForm.title;
            let str = '';
            if (title !== '') str += 'title~' + title;
            str += ',persons.managerId:' + this.$store.getters.user.id + '&sort=createTime~desc';;
            this.issue.loading = true;
            Api.assist.getNoticeList(str, this.issue.page, this.issue.size).then((res) => {
                this.issue.list = res.content;
                this.issue.total = res.totalElements;
                this.issue.loading = false;
            }).catch(() => {
                this.issue.loading = false;
            })
        },
        loadReceive() {
            let title = this.receive.searchForm.title;
            let str = '';
            if (title !== '') str += 'title~' + title;
            str += ',creator.userId:' + this.$store.getters.user.id + '&sort=createTime~desc';;
            this.receive.loading = true;
            Api.assist.getNoticeList(str, this.receive.page, this.receive.size).then((res) => {
                this.receive.list = res.content;
                this.receive.total = res.totalElements;
                this.receive.loading = false;
            }).catch(() => {
                this.receive.loading = false;
            })
        },
        // 添加
        handleAdd() {
            this.$router.push('notice');
        },

        // 删除
        del(index, row) {
            let self = this;
            self.delConfirm('通知', () => {
                Api.assist.delNotice(row.id).then(self.callback);
            });
        },

        // 编辑
        edit(index, row) {
            this.$router.push({ path: 'notice', query: { id: row.id } })
        },
        callback() {
            this.showTip();
            this.loadIssue();
            this.loadReceive();
        }
    },
    mounted() {
        this.loadIssue();
        this.loadReceive();
    }
};
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">

</style>
