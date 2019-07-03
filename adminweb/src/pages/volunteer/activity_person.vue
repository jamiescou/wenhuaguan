<template>
    <div class="list-wrapper">
        <v-pageheader :breadcrumbs="[{ to:'activity_list',name:'志愿者活动管理'},{name:'招募管理'}]"></v-pageheader>
        <div class="table-container" style="margin-top:20px;">
            <el-table :data="dataList" border stripe v-loading.body="loading">
                <el-table-column prop="name" label="志愿者姓名">
                    <template scope="scope">
                        <router-link :to="{path:'person_detail', query: {id: scope.row.id,did:objid,flag:'activity'}}" class="u-link">
                            {{scope.row.name}}
                        </router-link>
                    </template>
                </el-table-column>
                <el-table-column label="性别">
                    <template scope="scope">
                        {{formatSex(scope.row.user.sex)}}
                    </template>
                </el-table-column>
                <el-table-column prop="user.mobile" label="联系电话"></el-table-column>
                <el-table-column prop="user.birthday" label="出生年月"></el-table-column>
                <el-table-column prop="education" label="学历"></el-table-column>
                <el-table-column prop="holdAddress" label="籍贯"></el-table-column>
                <el-table-column label="操作" width="200px" align="center">
                    <template scope="scope">
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
export default {
    data() {
        return {
            searchForm: { name: '', contactPhone: '' },
            dataList: [],
            objid: '',
            loading: false
        };
    },
    methods: {
        loadData() {
            this.loading = true;
            Api.nouns.getRecruitMembers(this.objid).then((res) => {
                this.dataList = res || [];
                this.loading = false;
            }).catch(() => { this.loading = false });
        },
        del(index, row) {
            let self = this;
            self.delConfirm('团队成员', () => {
                Api.nouns.delRecruitMember(this.objid, row.id).then(self.callback);
            });
        },
        back() {
            this.$router.replace('activity_list');
        },
        callback() {
            this.showTip();
            this.loadData();
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
