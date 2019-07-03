<template>
    <div class="list-wrapper">
        <v-pageheader :breadcrumbs="[{ to:'activity_list',name:'志愿者活动管理'},{name:'活动风采纪实'}]"></v-pageheader>
        <div class="right-opers">
            <el-button type="primary" @click="handleAdd">添加资源</el-button>
        </div>
        <div class="table-container">
            <section class="search-wrapper">
                <el-form :inline="true" :model="searchForm" label-width="0">
                    <el-form-item>
                        <el-input v-model="searchForm.fileName" placeholder="资源名称"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="loadData">查询</el-button>
                    </el-form-item>
                </el-form>
            </section>
        </div>
        <div class="table-container">
            <el-table :data="dataList" border stripe v-loading.body="loading">
                <el-table-column prop="name" label="资源名称">
                    <template scope="scope">
                        <router-link :to="{path:'digitinfos_detail', query: {id:objid,did: scope.row.id}}" class="u-link">
                            {{scope.row.name}}
                        </router-link>
                    </template>
                </el-table-column>
                <el-table-column prop="type" label="资源类型" :formatter="formatType"></el-table-column>
                <el-table-column prop="fileSize" label="资源大小"></el-table-column>
                <!-- <el-table-column prop="lastModifiedTime" label="最新操作时间"></el-table-column>
                <el-table-column prop="creator.userName" label="最新操作用户"></el-table-column> -->
                <el-table-column label="操作" align="center">
                    <template scope="scope">
                        <a class="btn-act" @click="edit(scope.$index, scope.row)">编辑</a>
                        <a class="btn-act" @click="del(scope.$index, scope.row)">删除</a>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="foot-opers">
            <el-button @click="back">返回</el-button>
        </div>
    </div>
</template>

<script>
import Api from '@/api';
const DIGITTYPE = { pic: '图片', video: '视频', audio: '音频' }
export default {
    data() {
        return {
            searchForm: { fileName: '' },
            dataList: [],
            objid: '',
            loading: false
        };
    },
    methods: {
        loadData() {
            this.loading = true;
            let fileName = this.searchForm.fileName;
            let str = '';
            if (fileName !== '') str += ',name:' + fileName;
            Api.nouns.getVolunrecruitDigitinfos(this.objid, str).then((res) => {
                this.dataList = res || [];
                this.loading = false;
            })
        },
        handleAdd() {
            this.$router.push({ path: 'digitinfo', query: { id: this.objid } })
        },
        edit(index, row) {
            this.$router.push({ path: 'digitinfo', query: { id: this.objid, did: row.id } });
        },
        del(index, row) {
            let self = this;
            self.delConfirm('活动纪实', () => {
                Api.nouns.delVolunrecruitDigitinfos(this.objid, row.id).then(self.callback);
            });
        },
        // 格式化资源类型
        formatType(row) {
            let type = row.type;
            return DIGITTYPE[type];
        },
        callback() {
            this.showTip();
            this.loadData();
        },
        back() {
            this.$router.push('activity_list');
        }
    },
    mounted() {
        this.objid = this.$route.query.id;
        this.loadData();
    }
};
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">

</style>