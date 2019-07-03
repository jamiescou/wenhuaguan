<template>
    <div class="list-wrapper">
        <v-pageheader :breadcrumbs="[{ name: '活动抽签' }]"></v-pageheader>
        <div class="right-opers">
            <el-button type="primary" @click="publishDraw">发起抽签</el-button>
        </div>
        <div class="table-container">
            <section class="search-wrapper ">
                <el-form :inline="true" :model="searchForm" label-width="0" class="row">
                    <el-form-item>
                        <el-input v-model="searchForm.name" placeholder="活动名称"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="loadData">查询</el-button>
                    </el-form-item>
                </el-form>
            </section>
        </div>
        <div class="table-container">
            <el-table :data="dataList" border stripe v-loading.body="loading">
                <el-table-column prop="name" label="名称">
                    <template scope="scope">
                        <router-link :to="{path:'view_draw', query: {actId: scope.row.id,flag:1}}" class="u-link">
                            {{scope.row.name}}
                        </router-link>
                    </template>
                </el-table-column>
                <el-table-column prop="organizer" label="举办方"></el-table-column>
                <el-table-column prop="type" label="活动类型" :formatter="formatActType"></el-table-column>
                <el-table-column prop="draw.drawDate" label="抽签截止日期"></el-table-column>
                <el-table-column prop="status" label="抽签状态(已抽/总数)"></el-table-column>
                <el-table-column label="操作" width="500px" align="center">
                    <template scope="scope">
                        <a class="btn-act" @click="viewDraw(scope.row.id)">查看</a>
                      
                        <span class="btn-act" v-if='!scope.row.enableDraw&&scope.row.btnMsg!="无需抽签"'>{{scope.row.btnMsg}}</span>
                        <a class="btn-act" @click="submitDraw(scope.row.id)" v-else-if='scope.row.enableDraw&&scope.row.btnMsg!="无需抽签"'>{{scope.row.btnMsg}}</a>
                        <a class="btn-act" v-if='user.orgUnit.id==scope.row.unitId' @click="delDraw(scope.row)">删除</a>
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
import moment from 'moment';
export default {
    mixins: [BaseTable],
    data() {
        return {
            dictNames: ['assistProjectType'],
            searchForm: { name: '' },
            dataList: [],
            liveForm: {
                name: '',
                brief: '',
                type: [],
                unitId: ''
            },
            user: { orgUnit: {} },
            rules: {
                name: [vRules.required]
            }
        };
    },
    created() {
        this.user = this.$store.getters.user;
    },
    methods: {
        loadData() {
            let _this = this;
            let name = this.searchForm.name;
            let unitid = this.$store.getters.user.orgUnit.id;
            let str = 'worksList.unitId:' + unitid + ',~unitId:' + unitid+',draw.isUnitDraw!null,isDisabled:false,isPublished:true';
            if (name !== '') str += ',name~' + name;
            this.showLoading();
            let dnow = moment().format('x');
            Api.assist.getActList(str, this.page, this.size).then((res) => {
                this.dataList = res.content;
                this.total = res.totalElements;
                this.dataList.forEach((item) => {

                    item.enableDraw = true;
                    item.btnMsg = '抽签';
                    if (item.draw) {
                        let d = moment(item.draw.drawDate).add(1, 'days').format('x');
                        if (dnow > d) {
                            item.enableDraw = false;
                            item.btnMsg = '已过期'
                        }
                    } else {
                        item.enableDraw = false;
                        item.btnMsg = '无需抽签';
                    }
                    if (item.draw && item.draw.result) {
                        for (let i = 0; i < item.draw.result.length; i++) {
                            if (item.draw.result[i].unitId == _this.user.orgUnit.id) {
                                item.enableDraw = false;
                                item.btnMsg = '已抽签'
                            }
                        }
                    }
                    let drawCount = 0; //已抽签数
                    if (item.draw && item.draw.result) {
                        for (let i = 0; i < item.draw.result.length; i++) {
                            for (var p in item.draw.result[i].worksMap) {
                                drawCount++;
                            }
                        }
                    }
                    Api.assist.getActWorks(item.id).then((res) => {
                        if (res.length == 0) {
                            item.enableDraw = false;
                            item.btnMsg = '无需抽签'
                        }

                        item.status = drawCount + '/' + res.length;
                        this.dataList.sort();
                    }); //总作品数
                })
            }).finally(this.closeLoading);
        },

        //格式化活动类型
        formatActType(row, column, cellValue) {
            return cellValue == 'stageArts' ? '舞台剧' : '展览'
        },

        // 删除
        delDraw(row) {
            var self = this;
            self.delConfirm('确定删除此抽签？', () => {
                Api.assist.delActDraw(row.id).then(self.callback);
            });
        },

        /**
         * 发布抽签
         */
        publishDraw() {
            this.$router.push('publish_draw');
        },

        /**
         * 抽签
         */
        submitDraw(actId) {
            this.$router.push({ path: 'submit_draw', query: { actId: actId } })
        },
        /**
         查看抽签结果
         */
        viewDraw(actId) {
            this.$router.push({ path: 'view_draw', query: { actId: actId } })
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
