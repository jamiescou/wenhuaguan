<template>
    <div class="venueManage">
        <v-pageheader :breadcrumbs="[{ name: '场馆管理' }]"></v-pageheader>
        <div class="right-opers">
            <el-button type="primary" @click="handleAdd">添加场馆</el-button>
        </div>
        <div class="table-container">
            <section class="search-wrapper">
                <el-form :inline="true" :model="searchForm" label-width="0">
                    <el-form-item>
                        <el-input v-model="searchForm.name" placeholder="请输入场馆名称"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="loadData">查询</el-button>
                    </el-form-item>
                </el-form>
            </section>
            <el-table :data="dataList" border stripe v-loading.body="loading" tooltip-effect="custom-effect">
                <el-table-column label=" " type="index" width="80px" align="center"></el-table-column>
                <el-table-column label="场馆名称" align="center" class-name="linkCell">
                    <template scope="scope">
                        <router-link :to="{ name: 'viewVenue', params: { id: scope.row.id }}">{{scope.row.name}}</router-link>
                    </template>
                </el-table-column>
                <el-table-column prop="type" label="类型" align="center" :formatter="convertType"></el-table-column>
                <el-table-column prop="contactMobile" label="联系电话" align="center"></el-table-column>
                <el-table-column prop="contact" label="联系人" align="center"></el-table-column>
                <el-table-column prop="isPublish" label="上架状态" align="center" width="80px">
                    <template scope="scope">
                        <span>{{scope.row.isPublish | publishFormatter}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="isTop" label="置顶状态" align="center" width="80px">
                    <template scope="scope">
                        <span>{{scope.row.isTop | topFormatter}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="400px" align="center">
                    <template scope="scope">
                        <div>
                            <a class="btn-act" @click="handleEdit(scope.row)" v-if="scope.row.isPublish !== true">编辑</a>
                            <a class="btn-act" @click="handlePub(scope.row)">{{scope.row.isPublish?'下架':'上架'}}</a>
                            <a class="btn-act" @click="handleRecommend(scope.row)">{{scope.row.isTop?'取消置顶':'置顶'}}</a>
                            <a class="btn-act" @click="handleDel(scope.row)" v-if="!scope.row.isPublish">删除</a>
                            <a class="btn-act" @click="handleRecord(scope.row)">场馆纪实</a>
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
// import venuesTable from './venuesTable';
const STATUSOPTS = [{ value: '1', label: '待审核' }];
export default {
    // components: {
    //     venuesTable
    // },
    mixins: [BaseTable],
    data() {
        return {
            activeName: 'first',
            searchForm: { name: '', cultural: '', unit: '', status: '' },
            statusOpts: STATUSOPTS,
            venueType: [],
        }
    },
    methods: {
        _ShowTip(msg, type = 'success') {
            this.$message({
                message: msg,
                type: type
            });
        },
        handleClick(tab, event) {

        },
        callback() {
            this._ShowTip('操作成功');
            this.loadData();
        },
        loadData() {
            let str = '';
            if (this.searchForm.name !== null && this.searchForm.name !== '') str += ',name~' + this.searchForm.name;
            str += '&sort=createTime~desc';
            this.showLoading();
            Api.venue.getVenueList(str, this.page, this.size).then((res) => {
                if (res.content.length) {
                    for (const item of res.content) {
                        item.isTop = item[this.$store.getters.remandField] ? 1 : 0;
                    }
                }
                this.dataList = res.content;
                this.total = res.totalElements;
            }).finally(this.closeLoading);
        },
        // 添加场馆
        handleAdd() {
            this.$router.push('venue');
        },
        // 编辑场馆
        handleEdit(row) {
            this.$router.push({ path: 'venue', query: { id: row.id } });
        },
        handleDel(row) {
            let self = this;
            self.delConfirm('场馆信息', () => {
                Api.venue.delVenue(row.id).then(self.callback);
            });
        },
        convertType(row, column, cellValue) {
            return this.dicts.getValueByCode('venueType', cellValue) ? this.dicts.getValueByCode('venueType', cellValue) : "";
        },
        // 发布/取消发布
        handlePub(row) {
            Api.venue.setPublish(row.id, !row.isPublish).then(this.callback).catch();
        },
        // 推荐/取消推荐
        handleRecommend(row) {
            Api.venue.setRecommend(row.id, !row.isTop).then(this.callback).catch();
        },
        // 场馆纪实
        handleRecord(row) {
            this.$router.push({ path: 'record', query: { id: row.id } });
        }
    },
    mounted() {
    }
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
a {
  color: #333;
}
.venueManage {
  position: relative;
  .right-opers {
    position: absolute;
    z-index: 10;
    text-align: right;
    right: 0;
    margin-top: 20px;
  }
  .venue-tabs {
    margin-top: 20px;
  }
}
</style>
