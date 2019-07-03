<template>
    <div class="list-wrapper activity-wrapper">
        <v-pageheader :breadcrumbs="breadcrumbs"></v-pageheader>
        <section class="search-wrapper">
            <el-form :inline="true" label-width="0">
                <el-button type="primary" @click="handleAdd">新增</el-button>
                <el-button type="primary" @click="back">返回</el-button>
            </el-form>
        </section>
        <div class="table-container">
            <el-table :data="dataList" border stripe v-loading.body="loading" tooltip-effect="custom-effect">
                <el-table-column label=" " type="index" align="center"></el-table-column>
                <el-table-column label="资源名称" prop="name" width="260px">
                    <template scope="scope">
                        <router-link :to="{path:'view', query: {id:id,did: scope.row.id}}" class="u-link">
                            {{scope.row.name}}
                        </router-link>
                    </template>
                </el-table-column>
                <el-table-column prop="type" label="资源类型" align="center" :formatter="formatType"></el-table-column>
                <el-table-column prop="fileSize" label="资源大小" align="center"></el-table-column>
                <el-table-column prop="seqno" label="显示顺序" align="center" width="100px"></el-table-column>
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

const DIGITTYPE = { pic: '图片', video: '视频', audio: '音频' }
const ACCEPTTYPE = { pic: 'image', video: 'video', audio: 'audio' }
const HASPICTYPE = ['pic', 'video']; // 有图片
const NEEDCHOISEWAY = ['video', 'audio'];   // 有调用方式：新文件、或链接调用
const breadcrumbObj = {
    'activity': [{ name: '活动发布', to: 'activitypublish' }, { name: '活动纪实' }],
    'venues': [{ name: '场馆管理', path: 'venues' }, { name: '场馆纪实' }],
    'volunteer': [{ name: '志愿者活动', to: 'volunteer' }, { name: '活动风采纪实' }],
    'heritage': [{ name: '名录管理', path: '/heritage/directory/pulish' }, { name: '数字资源' }],
    'heritage': [{ name: '传承人管理', path: '/heritage/successor/pulish' }, { name: '数字资源' }]
};

export default {
    mixins: [BaseTable],
    data() {
        return {
            id: '',
            doNotInit: true
        }
    },
    created() {
        this.flag = this.$route.path.split("/")[1];
        this.id = this.$route.query.id;
        this.breadcrumbs = breadcrumbObj[this.flag]
        this.loadData();
    },
    methods: {
        loadData() {
            this.showLoading();
            switch (this.flag) {
                case 'activity':
                    Api.activity.activityDigicInfos(this.id).then((res) => {
                        this.dataList = res || [];
                    }).finally(this.closeLoading);
                    break;
                case 'venues':
                    Api.venue.getDigitInfos(this.id).then((res) => {
                        this.dataList = res || [];
                    }).finally(this.closeLoading);
                    break;
                default:
                    break;
            }

        },
        // 返回
        back() {
            this.$router.go(-1);
        },
        // 编辑
        handleEdit(row) {
            this.$router.push({ path: 'record', query: { id: this.id, did: row.id, flag: this.flag } });
        },
        // 删除活动
        handleDel(row) {
            let self = this;
            self.delConfirm('资源', () => {
                Api.activity.activityDigicInfoDelete(this.id, row.id).then((res) => {
                    this.showTip();
                    this.loadData();
                });
            });
        },
        // 添加
        handleAdd() {
            this.$router.push({ path: 'recordadd', query: { id: this.id, flag: this.flag } });
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
