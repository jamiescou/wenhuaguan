<template>
    <div class="list-wrapper">
        <v-pageheader :breadcrumbs="[{ to:'index',name: '数字展览管理' },{ name: '作品管理' }]"></v-pageheader>
        <div class="right-opers">
            <el-button type="primary" @click="handleAdd">添加作品</el-button>
        </div>
        <div class="table-container">
            <section class="search-wrapper">
                <el-form :inline="true" :model="searchForm" label-width="0">
                     <el-form-item>
                        <el-input v-model="searchForm.name" placeholder="请输入作品名称"></el-input>
                    </el-form-item>
                     <el-form-item>
                        <el-button type="primary" @click="loadData">查询</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="back">返回</el-button>
                    </el-form-item>
                </el-form>
            </section>
        </div>
        <div class="table-container">
            <el-table :data="dataList" border stripe v-loading.body="loading">
                <el-table-column prop="title" label="作品名称">
                    <template scope="scope">
                        <router-link :to="{path:'exhibitworksveiw', query: {mid:mid,id: scope.row.id,flag:1}}" class="u-link">
                            {{scope.row.title}}
                        </router-link>
                    </template>
                </el-table-column>
                 <el-table-column prop="type" label="作品类型" :formatter="formatVenuesName"></el-table-column>

                <el-table-column prop="seqno" label="顺序号"></el-table-column>
                <el-table-column prop="isPublish" label="状态">
                  <template scope="scope">
                    <span>{{scope.row.isPublish? '已上架':'未上架'}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="500px" align="center">
                    <template scope="scope">
                        <a class="btn-act" @click="edit(scope.$index, scope.row)">编辑</a>
                        <a class="btn-act" @click="publish(scope.$index, scope.row)">{{scope.row.isPublish?'下架':'上架'}}</a>
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
import Api from '@/api';
export default {
    mixins: [BaseTable],
    data() {
        return {
            dictNames: ['worksType'],
            mid: '',
            searchForm: { name: '' },
            dataList: []
        };
    },
    methods: {

        // 格式化服务类型
        formatVenuesName(row, column, cellValue) {
            return this.dicts.getValueByCode('worksType', cellValue);
        },
        // 数据加载
        loadData() {
            this.mid = this.$route.query.mid;
            let str ='heritageUnit.id:'+this.mid;
            if (this.searchForm.name) {
                str += ',title~' + this.searchForm.name;
            }
            this.showLoading();
            Api.heritage.getWorksList(str,1,-1).then((res) => {
                this.dataList = res.content;
                this.total = res.totalElements;
            }).finally(this.closeLoading);
        },
        // 添加
        handleAdd() {
            this.$router.push({ path: 'exhibitworksadd', query: { flag: 'add', mid: this.mid } });
        },

        // 编辑
        edit(index, row) {
            this.$router.push({ path: 'exhibitworksadd', query: { mid: this.mid, id: row.id, flag: 'edit' } })
        },
        // 删除
        del(index, row) {
            let self = this;
            self.delConfirm('数字展览展品', () => {
                Api.heritage.delWorks(row.id).then(self.callback);
            });
        },
        // 上下架
        publish(index, row) {
            let msg = row.isPublish ? '是否确认取消发布？' : '确认发布展览展品？';
            this.$confirm(msg, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then((res) => {
                Api.heritage.isPublishWorks( row.id, !row.isPublish).then(this.callback);
            });
        },
        // 返回
        back() {
            this.$router.go(-1);
        },
        callback() {
            this.showTip();
            this.loadData();
        }
    },
    mounted() {
        this.loadData();

    }
};
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">

</style>
