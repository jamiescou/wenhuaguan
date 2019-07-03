<template>
    <div class="list-wrapper">
        <v-pageheader :breadcrumbs="[{ name: '征集管理' }]"></v-pageheader>
        <div class="table-container">
            <section class="search-wrapper">
                <el-form :inline="true" :model="searchForm" label-width="0">
                    <el-form-item>
                        <el-select v-model="searchForm.name" placeholder="请选择活动" clearable>
                            <el-option v-for="item in actList" :key="item.id" :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-select v-model="searchForm.type" placeholder="请选择作品分类" clearable>
                            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="loadData">查询</el-button>
                    </el-form-item>
                </el-form>
            </section>
        </div>
        <div class="table-container">
            <el-table :data="dataList" border stripe v-loading.body="loading">
                <el-table-column prop="actName" label="活动名称"></el-table-column>
                <el-table-column prop="works.name" label="作品名称"></el-table-column>
                <el-table-column prop="works.type" label="作品类型" :formatter="typeFormat"></el-table-column>
                <el-table-column prop="userName" label="会员"></el-table-column>

                <el-table-column label="提交时间" prop="createTime" align="center">

                </el-table-column>
                <el-table-column prop="isPass" label="审批状态" :formatter="auditFormat"></el-table-column>
                <el-table-column label="操作" width="100px" align="center">
                    <template scope="scope">
                        <router-link :to="{path:'workcollect_view', query: {id: scope.row.id}}" v-if="scope.row.isPass === null" class="btn-act">审核</router-link>
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
            searchForm: { name: '', type: '' },
            dataList: [],
            actList: [],
            options: [{ label: '舞台艺术', value: 'stageArts' }, { label: '展览', value: 'exhibition' }]
        };
    },
    methods: {
        loadData() {
            let name = this.searchForm.name;
            let type = this.searchForm.type;
            let unitid = this.$store.getters.user.orgUnit.id;
            let str = 'unitId:' + unitid + ',';
            if (name !== '') str += 'activityId:' + name + ',';
            if (type !== '') str += 'works.type:' + type + ',';
            str += 'isCancel:false~null&sort=createTime~desc'
            this.showLoading();
            Api.assist.getUserSheetList(str, this.page, this.size).then((res) => {
                let content = res.content;
                if (content != null && content.length > 0) {
                    let activityIds = content.map(x => x.activityId).join('~');
                    let users = content.map(x => x.userId).join('~');
                    // 获得活动列表 取出活动名称
                    Api.assist.getActList('id:' + activityIds, 1, -1).then((res) => {
                        const acts = res.content;
                        for (var i = 0; i < content.length; i++) {
                            let actcontent = acts.find(x => x.id == content[i].activityId);
                            if (actcontent) {
                                content[i].actName = actcontent.name;
                            } else {
                                content[i].actName = '';
                            }
                        }
                        // 获得会员姓名
                        Api.user.getUserList('id:' + users, 1, -1).then((res) => {
                            const userc = res.content;
                            for (var i = 0; i < content.length; i++) {
                                let usercontent = userc.find(x => x.id == content[i].userId);
                                if (usercontent) {
                                    content[i].userName = usercontent.nickname;
                                } else {
                                    content[i].userName = '';
                                }
                            }
                            this.dataList = content;
                        });
                    });
                } else {
                    this.dataList = content;
                }
                this.total = res.totalElements;
            }).finally(this.closeLoading);
        },
        // 类型格式化
        typeFormat(row, column, cell) {
            if (cell === 'stageArts') return "舞台艺术";
            else if (cell === 'exhibition') return "展览";
            else return "";
        },
        auditFormat(row, column, cell) {
            if (cell) return "审核通过";
            else if (cell === null) return "未审核";
            else return "审核拒绝";
        },

        // 审核
        audit(index, row) {
            this.$router.push({ path: 'workcollect_view', query: { id: row.id } });
        },
        callback() {
            this.showTip();
            this.loadData();
        }
    },
    mounted() {
        Api.assist.getActList('isPublished:true&sort=createTime~desc', 1, -1).then((res) => {
            this.actList = res.content;
        });
    }
};
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
</style>
