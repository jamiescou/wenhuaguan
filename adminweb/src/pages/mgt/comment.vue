<template>
    <div class="list-wrapper">
        <v-pageheader :breadcrumbs="[{ name: '评论管理' }]"></v-pageheader>
        <section class="search-wrapper">
            <el-form :inline="true" :model="searchForm" label-width="0">
                <el-form-item>
                    <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
                        <el-option v-for="item in statusOpts" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="searchForm.type" placeholder="请选择评论类型" clearable>
                        <el-option v-for="item in typeOpts" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="loadData">查询</el-button>
                </el-form-item>
            </el-form>
        </section>
        <div class="table-container">
            <el-table :data="dataList" border stripe v-loading.body="loading" tooltip-effect="custom" key="index">
                <el-table-column label=" " type="index" align="center" width="80px"></el-table-column>
                <el-table-column prop="nickname" label="用户昵称" align="center"></el-table-column>
                <el-table-column prop="time" label="评论时间" align="center"></el-table-column>
                <el-table-column prop="type" label="评论类型" align="center" :formatter="convertType" width="100px"></el-table-column>
                <el-table-column prop="content" label="评论内容" align="center" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="status" label="状态" align="center" :formatter="convertStatus" width="100px"></el-table-column>
                <el-table-column label="操作" align="center">
                    <template scope="scope">
                        <a class="btn-act" @click="handlePass(scope.row)">通过</a>
                        <a class="btn-act" @click="handleRegect(scope.row)">拒绝</a>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination-container">
                <v-pagination @pageChange="onCurrentChange" ref="pagination" :total="total" :isShow="showPagination"></v-pagination>
            </div>
        </div>
    </div>
</template>

<script>
import BaseTable from '@/mixins/base-table';
import Api from '@/api';
const COMMENT_TYPE = {
    'Activity': '文化活动',
    'Train': '培训管理',
    'Venue': '场馆管理',
    'VenueRoom': '活动室管理',
    'Information': '资讯',
    'heritageDirectory': '非遗名录',
    'heritageSuccessor': '非遗继承人',
    'VolunteerRecruit': '招募活动',
    'DigitalShow': '数字展览',
    'ArtTalent': '文艺人才',
    'ArtTeam': '文化团队',
    'CultureSupply': '文化供应',
    'Demands': '点播管理',
    'LiveVideos': '直播管理',
    'ArtWorks': '征集活动',
    'CultureBrand':'文化品牌'
}
function getOpts(enums) {
    const keys = Object.keys(enums);
    let opts = [];
    for (const key of keys) {
        opts.push({ label: enums[key], value: key });
    }
    return opts;
}

const STATUS = { 'Wait': '待审核', 'Pass': '通过', 'Refuse': '拒绝' }

export default {
    mixins: [BaseTable],
    data() {
        return {
            searchForm: { type: '', status: 'Wait' },
            typeOpts: getOpts(COMMENT_TYPE),
            statusOpts: getOpts(STATUS)
        }
    },
    methods: {
        // 通过
        handlePass(row) {
            this.$confirm('是否确认通过?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'info'
            }).then((res) => {
                Api.system.auditComment(row.id, 'Pass').then(this.loadData);
            });
        },
        // 拒绝
        handleRegect(row) {
           this.$confirm('确认拒绝?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'info'
            }).then((res) => {
                Api.system.auditComment(row.id, 'Refuse').then(this.loadData);
            });
        },
        loadData() {
            let user = this.$store.getters.user;
            this.showLoading();
            // let str ="";
            let str = '' ;
            if (this.searchForm.type) { str += ',type:' + this.searchForm.type; }
            if (this.searchForm.status) { str += ',status:' + this.searchForm.status }
            str += '&sort=time~desc';

            Api.system.getComments(str, this.page, this.size).then((res) => {
                this.dataList = res.content;
                this.total = res.totalElements;
            }).finally(this.closeLoading);
        },
        convertType(row, column, cellValue) {
            return COMMENT_TYPE[cellValue];
        },
        convertStatus(row, column, cellValue) {
            return STATUS[cellValue];
        }
    },
    mounted() {

    }
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">

</style>
