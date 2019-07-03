<template>
    <div class="list-wrapper activity-wrapper">
        <v-pageheader :breadcrumbs="[{name: '名录管理' },{name: '数字资源' }]"></v-pageheader>
        <section class="search-wrapper">
            <el-form :inline="true" label-width="0">
                <el-form-item>
                    <el-button type="primary" @click="handleAdd">新增</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="back">返回</el-button>
                </el-form-item>
            </el-form>
        </section>
        <div class="table-container">
            <el-table :data="dataListOne" border stripe v-loading.body="loading" tooltip-effect="custom-effect">
                <el-table-column label=" " type="index" align="center"></el-table-column>
                <el-table-column label="资源名称" prop="name" width="260px">
                    <template scope="scope">
                        <router-link :to="{path:'heritageViewrecord', query: {id:id,did: scope.row.id}}" class="u-link">
                            {{scope.row.name}}
                        </router-link>
                    </template>
                </el-table-column>
                <el-table-column prop="type" label="资源类型" align="center" :formatter="formatType"></el-table-column>
                <el-table-column prop="fileSize" label="资源大小" align="center"></el-table-column>                
                <el-table-column label="操作" align="left" width="280px">
                    <template scope="scope">
                        <a class="btn-act" @click="handleEdit(scope.row)">编辑</a>
                        <a class="btn-act" @click="handleDel(scope.row)">删除</a>
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
            id: '',
            dataListOne: []
        }
    },
    methods: {
        loadData() {
            this.id = this.$route.query.id;
            // let user = this.$store.getters.user;
            // let str = 'search=dataDeptId:' + user.unit.id + ',' + 'unit.id:' + user.orgUnit.id;
            // if (this.searchForm.name) { str += ',name:' + this.searchForm.name; }
            // if (this.searchForm.status) { str += ',onlineStatus:' + this.searchForm.status }

            this.showLoading();
            Api.heritage.directoryDigicInfos(this.id).then((res) => {
                this.dataListOne = res;
            }).finally(this.closeLoading);
        },
        // 返回
        back() {
            this.$router.go(-1);
        },
        // 编辑
        handleEdit(row) {
            this.$router.push({ path: 'heritageRecordadd', query: { id: this.id, did: row.id, flag: 'edit', title: '编辑' } });
        },
        // 删除数字资源
        handleDel(row) {
            let self = this;
            self.delConfirm('资源', () => {
                Api.heritage.directoryDigicInfoDelete(this.id, row.id).then((res) => {
                    this.showTip();
                    this.loadData();
                });
            });
        },
        // 添加
        handleAdd() {
            this.$router.push({ path: 'heritageRecordadd', query: { id: this.id, flag: 'add', title: '添加' } });
        },
        // 格式化资源类型
        formatType(row) {
            let type = row.type;
            switch (type) {
                case 'pic':
                    return '图片';

                case 'video':
                    return '视频';

                case 'audio':
                    return '音频';

            }
        }
    },
    mounted() {
    }
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">

</style>