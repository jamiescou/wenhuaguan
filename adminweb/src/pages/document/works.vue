<template>
    <div class="list-wrapper activity-wrapper">
        <v-pageheader :breadcrumbs="[{name: '作品管理' }]"></v-pageheader>
        <section class="search-wrapper">
            <el-form :inline="true" :model="searchForm" label-width="0">
                <el-form-item>
                    <el-input v-model="searchForm.title" placeholder="请输入作品名称"></el-input>
                </el-form-item>
                <!--<el-form-item>-->
                    <!--<el-select v-model="searchForm.status" placeholder="请选择状态" clearable>-->
                        <!--<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">-->
                        <!--</el-option>-->
                    <!--</el-select>-->
                <!--</el-form-item>-->
                <el-form-item>
                  <el-button type="primary" @click="loadData">查询</el-button>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="back">返回</el-button>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="exportWorks">导出作品</el-button>
                </el-form-item>
            </el-form>
        </section>
        <div class="table-container">
            <el-table :data="dataList" border stripe v-loading.body="loading" tooltip-effect="custom-effect">
                <el-table-column label=" " type="index" align="center"></el-table-column>
                <el-table-column label="作品标题" prop="title" width="260px">
                    <template scope="scope">
                        <router-link :to="{path:'viewworks', query: {id:id,did: scope.row.id}}" class="u-link">
                            {{scope.row.title}}
                        </router-link>
                    </template>
                </el-table-column>
                <el-table-column prop="user.nickname" label="用户名" align="center"></el-table-column>
                <el-table-column prop="user.mobile" label="手机号" align="center"></el-table-column>
                <el-table-column prop="creteTime" label="上传时间" align="center"></el-table-column>
                <el-table-column prop="vote" label="点赞数" align="center"></el-table-column>
                <el-table-column prop="isPass" label="状态" align="center" width="80px" :formatter="formatStatus">
                </el-table-column>
                <el-table-column label="操作" align="left" width="280px">
                    <template scope="scope">
                        <div v-if="scope.row.isPass === null">
                            <a class="btn-act" @click="handlePass(scope.row)">通过</a>
                            <a class="btn-act" @click="handleRegect(scope.row)">拒绝</a>
                            <a class="btn-act" @click="handleDel(scope.row)">删除</a>
                        </div>
                        <div v-else>
                            <a class="btn-act" @click="handleDel(scope.row)">删除</a>
                        </div>
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
         
            searchForm: {title: '', status: ''},
            id: '',
            flows: [],
            options: [{value: '', label: ''},
                    { value: '', label: '' }]
        }
    },
    methods: {
        loadData() {
            this.id = this.$route.query.id;
            // let user = this.$store.getters.user;
            let str = '?search=activity.id:' + this.id;
            console.log(this.searchForm.name)
            if (this.searchForm.title) {
              str += ',title~' + this.searchForm.title;
            }
            str += '&sort=creteTime~desc';
            console.log(str)
            this.showLoading();
            Api.document.worksList(str,this.page-1, this.size).then((res) => {
                this.dataList = res.content;
                this.total = res.totalElements;
            }).finally(this.closeLoading);
        },
        exportWorks() {
            Api.document.exportWorks(this.id).then(res => {
                this.downloadFile('作品集数据.xls', res)
            })
        },
        // 返回
        back() {
            this.$router.go(-1);
        },
        formatStatus(row, column, cellValue) {
            if (cellValue == null) {
              return '待审核'
            }
            return cellValue ? '已通过' : '已拒绝'
        },
        // 审核通过
        handlePass(row) {
            let msg = '是否通过审核？';
            this.$confirm(msg, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
              Api.document.worksPass(row.id).then(this.callback);
            });
        },
        // 拒绝
        handleRegect(row) {
            let msg = '是否确认拒绝该作品？';
            this.$confirm(msg, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then((res) => {
              Api.document.worksReject(row.id).then(this.callback);
            });
        },
        // 删除
        handleDel(row) {
            let self = this;
            self.delConfirm('资源', () => {
                Api.document.delWorks(row.id).then((res) => {
                    this.showTip();
                    this.loadData();
                });
            });
        },
        callback() {
            this.showTip();
            this.loadData();
        },
        // 添加
        handleAdd() {
            this.$router.push({ path: 'recordadd', query: { id: this.id, flag: 'add', title: '添加' } });
        },
        // 取最后一条拒绝信息
        getFlows(flows) {
            let operDesc = null;
            if (flows != null && flows.length > 0) {
                if (flows[flows.length - 1].fromStatus === 'false') {
                    operDesc = flows[flows.length - 1].operDesc;
                }
            }
            return operDesc;
        },
      // 格式化资源类型
        formatType(row) {
            let type = row.worksType;
            switch (type) {
                case 'pic':
                    return '图片';
                case 'video':
                    return '视频';
                case 'audio':
                    return '音频';
                case 'attach':
                  return '附件';
            }
        },
        // 格式化状态
        formatState(row) {
            let type = row.isPass;
            switch (type) {
                case true:
                    return '已通过';
                case false:
                    return '未通过';
            }
        }
    },
    mounted() {
    }
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">

</style>
