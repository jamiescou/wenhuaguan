<template>
    <div class="list-wrapper">
        <v-pageheader :breadcrumbs="[{ name: '活动辅助管理' }]"></v-pageheader>
        <div class="right-opers">
            <el-button type="primary" @click="handleAdd">添加活动</el-button>
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
                <el-table-column prop="name" label="名称">
                     <template scope="scope">
                        <router-link :to="{path:'assistview', query: {id: scope.row.id,flag:1}}" class="u-link">
                            {{scope.row.name}}
                        </router-link>
                    </template>
                </el-table-column>
                <el-table-column prop="type" label="类型" :formatter="formatActType"></el-table-column>
               
                  <el-table-column label="时间周期" align="center" >
                            <template scope="scope">
                                <div style="padding:5px 0 0;line-height:24px">{{scope.row.startDate}} ~ {{scope.row.endDate}}</div>
                            </template>
                        </el-table-column>
                <el-table-column prop="creator.userName" label="创建者" align="center"></el-table-column>
                <!--<el-table-column prop="isPublish" label="状态" >
                      <template scope="scope">
                          <span>{{scope.row.isPublish | publishFormatter}}</span>
                      </template>
                  </el-table-column>-->
                <el-table-column label="操作" width="500px" align="center">
                    <template scope="scope">
                        <a class="btn-act" @click="edit(scope.$index, scope.row)">编辑</a>
                        <!--<a class="btn-act" @click="publish(scope.$index, scope.row)">{{scope.row.isPublish?'下架':'上架'}}</a>-->
                        <a class="btn-act" @click="del(scope.$index, scope.row)">删除</a>
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
            dictNames: ['assistProjectType'],
            searchForm: { name: '' },
            dataList: [],
            liveForm: {
                name: '',
                brief: '',
                type: [],
                unitId: ''
            },
            rules: {
                name: [vRules.required]
            }
        };
    },
    methods: {
        loadData() {
            let name = this.searchForm.name;
            let str = '';
            if (name !== '') str += 'name~' + name;
            this.showLoading();
            Api.assist.getActList(str, this.page, this.size).then((res) => {
                this.dataList = res.content;
                this.total = res.totalElements;
            }).finally(this.closeLoading);
        },

        //格式化活动类型
        formatActType(row, column, cellValue) {
            return this.dicts.getValueByCode('assistProjectType', cellValue);
        },

        // 添加
        handleAdd() {
            this.$router.push('assist');
        },

        // 删除
        del(index, row) {
            let self = this;
            self.delConfirm('通知', () => {
                Api.assist.delAct(row.id).then(self.callback);
            });
        },

        // 编辑
        edit(index, row) {
            this.$router.push({ path: 'assist', query: { id: row.id } })
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
