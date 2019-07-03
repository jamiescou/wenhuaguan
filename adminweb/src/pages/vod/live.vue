<template>
    <div class="list-wrapper">
        <v-pageheader :breadcrumbs="[{ name: '直播管理' }]"></v-pageheader>
        <div class="right-opers">
            <el-button type="primary" @click="handleAdd">添加直播</el-button>
        </div>
        <div class="table-container">
            <section class="search-wrapper">
                <el-form :inline="true" :model="searchForm" label-width="0">
                    <el-form-item>
                        <el-input v-model="searchForm.name" placeholder="标题"></el-input>
                    </el-form-item>
                    <!--<el-form-item>-->
                    <!--<el-select v-model="searchForm.type" placeholder="请选择分类" clearable>-->
                    <!--<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">-->
                    <!--</el-option>-->
                    <!--</el-select>-->
                    <!--</el-form-item>-->
                    <el-form-item>
                        <el-button type="primary" @click="loadData">查询</el-button>
                    </el-form-item>
                </el-form>
            </section>
        </div>
        <div class="table-container">
            <el-table :data="dataList" border stripe v-loading.body="loading">
                <el-table-column prop="name" label="标题">
                    <template scope="scope">
                        <router-link :to="{ path: 'liveview', query: { id:scope.row.id ,flag:1} }" class="u-link">
                            {{scope.row.name}}
                        </router-link>
                    </template>
                </el-table-column>
                <el-table-column prop="artistTypes" label="直播分类" :formatter="formatVideoType"></el-table-column>
                <el-table-column prop="startTime" label="直播时间"></el-table-column>
                <el-table-column prop="enablePayback" label="允许回放">
                    <template scope="scope">
                        <span>{{scope.row.enablePayback?'是':'否'}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="isPublish" label="上架状态">
                    <template scope="scope">
                        <span>{{scope.row.isPublish | publishFormatter}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="400px" align="center">
                    <template scope="scope">
                        <a class="btn-act" @click="edit(scope.$index, scope.row)" v-if="!scope.row.isPublish">编辑</a>
                        <a class="btn-act" @click="publish(scope.$index, scope.row)">{{scope.row.isPublish?'下架':'上架'}}</a>
                        <a class="btn-act" @click="toTop(scope.$index, scope.row)">{{scope.row.isTop?'取消置顶':'置顶'}}</a>
                        <a class="btn-act" @click="del(scope.$index, scope.row)" v-if="!scope.row.isPublish">删除</a>
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
import vRules from '@/config/validate_rules';
import Api from '@/api';
export default {
    mixins: [BaseTable],
    data() {
        return {
            searchForm: { name: '' },
            title: '',
            dialogFormVisible: false,
            viewFormShow: false,
            dataList: [],
            flag: '',
            viewForm: {},
            liveForm: {
                name: '',
                brief: '',
                type: [],
                unitId: ''
            },
            videoType: {},
            rules: {
                name: [vRules.required, vRules.maxLen(40)]
            }
        };
    },
    methods: {
        loadData() {
            let name = this.searchForm.name;
            let str = 'searchDataDeptId';
            let user = this.$store.getters.user;
            if (name !== '') str += ',name~' + name;
            str += '&sort=createTime~desc';
            this.showLoading();
            Api.vod.getLiveList(str, this.page, this.size).then((res) => {
                if (res.content.length) {
                    for (const item of res.content) {
                        item.isTop = item[this.$store.getters.remandField] ? 1 : 0;
                    }
                }
                this.dataList = res.content;
                this.total = res.totalElements;
            }).finally(this.closeLoading);
        },
        // 添加
        handleAdd() {
            this.$router.push({ path: 'liveadd', query: { flag: 'add' } });
        },

        // 删除直播
        del(index, row) {
            let self = this;
            self.delConfirm('直播', () => {
                Api.vod.delLive(row.id).then(self.callback);
            });
        },

        // 格式化直播类型
        formatVideoType(row, column, cellValue) {
            let type = [];
            for (var i = 0; i < cellValue.length; i++) {
                if (this.dicts.getValueByCode('videoType', cellValue[i]))
                    type.push(this.dicts.getValueByCode('videoType', cellValue[i]));
            }
            return type.join("、");
        },
        // 编辑直播
        edit(index, row) {
            this.$router.push({ path: 'liveadd', query: { id: row.id, flag: 'edit' } })
        },

        // 上下架
        publish(index, row) {
            let msg = row.isPublish ? '是否确认下架？' : '确认上架？';
            this.$confirm(msg, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then((res) => {
                if (row.isPublish) {
                    Api.vod.publish(row.id, false).then(this.callback);
                } else {
                    Api.vod.publish(row.id, true).then(this.callback);
                }
            });
        },
        // 置顶
        toTop(index, row) {
            let msg = row.isTop ? '是否确认取消置顶？' : '确认置顶？';
            this.$confirm(msg, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then((res) => {
                if (row.isTop) {
                    Api.vod.toTopLive(row.id, false).then(this.callback);
                } else {
                    Api.vod.toTopLive(row.id, true).then(this.callback);
                }
            });
        },
        callback() {
            this.showTip();
            this.loadData();
        }
    },
    mounted() {
        //         this.loadData();
    }
};
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
</style>
