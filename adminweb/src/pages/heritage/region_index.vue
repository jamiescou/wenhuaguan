<template>
    <div class="list-wrapper">
        <v-pageheader :breadcrumbs="[{ name: '非遗区域概况管理' }]"></v-pageheader>
        <div class="table-container">
            <section class="search-wrapper">
                <el-form :inline="true" :model="searchForm" label-width="0">
                    <el-form-item>
                        <el-input v-model="searchForm.name" placeholder="城市名称">
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="loadData">查询</el-button>
                    </el-form-item>
                </el-form>
            </section>
        </div>
        <div class="table-container">
            <el-table :data="dataList" border stripe v-loading.body="loading">
                <el-table-column prop="code" label="行政代码">
                </el-table-column>
                <el-table-column prop="name" label="名称"></el-table-column>
                <el-table-column prop="fullName" label="全称"></el-table-column>
                <el-table-column prop="heritBrief" label="地区概况" width="500px"></el-table-column>
                <el-table-column label="操作" width="100px" align="center">
                    <template scope="scope">
                        <a class="btn-act" @click="edit(scope.$index, scope.row)">编辑</a>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <el-dialog :title="title" :visible.sync="dialogFormVisible">
            <el-form ref="regionForm" :model="regionForm" :rules="rules" label-position="right" label-width="100px" class="m-form" v-if="dialogFormVisible">
                <el-form-item label="区域概况" prop="heritBrief">
                    <v-richeditor v-model="regionForm.heritBrief" ref="heritBrief"></v-richeditor>
                </el-form-item>
                <div class="form-opres" style="text-align:center">
                    <el-button @click="dialogFormVisible=false" class="u-btn">取消</el-button>
                    <el-button @click="submitForm" type="primary" class="u-btn">确定</el-button>
                </div>
            </el-form>
        </el-dialog>

        <el-dialog title="查看" :visible.sync="viewFormShow">
            <el-form ref="viewForm" :model="viewForm" label-position="right" label-width="100px" class="m-form">
                <v-detailItem label="杂志名称" :value="viewForm.name"></v-detailItem>
                <v-detailItem label="杂志简介" :value="viewForm.brief"></v-detailItem>
                <v-detailItem label="出版周期" :value="viewForm.type"></v-detailItem>
                <div class="form-opres" style="text-align:center">
                    <el-button @click="viewFormShow=false" class="u-btn">关闭</el-button>
                </div>
            </el-form>
        </el-dialog>

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
            searchForm: { name: '' },
            title: '',
            dialogFormVisible: false,
            viewFormShow: false,
            dataList: [],
            areaOption: [],
            flag: '',
            viewForm: {},
            regionForm: {
                heritBrief: ''
            },
            rules: {
                heritBrief: [vRules.required]
            }
        };
    },
    methods: {
        loadData() {
            this.showLoading();
            Api.heritage.getDirectChilds(this.$store.getters.user.orgUnit.region).then((res) => {
                this.dataList = res;
            }).finally(this.closeLoading);
            // Api.heritage.getRegionCode(this.$store.getters.user.orgUnit.region).then((res) => {

            // });
        },
        // 提交
        submitForm() {
            this.$refs['regionForm'].validate((valid) => {
                if (valid) {
                    Api.heritage.editRegion(this.regionForm.id, this.regionForm).then(this.callback, this.dialogFormVisible = false);
                }
            });
        },
        // 编辑
        edit(index, row) {
            this.regionForm.heritBrief = row.heritBrief === null ? '' : row.heritBrief;
            this.regionForm.id = row.id;
            this.dialogFormVisible = true;
            this.flag = 'edit';
            this.title = '编辑';
        },
        // 查看详情
        detail(index, row) {
            this.viewForm = Object.assign({}, row);
            let type = this.dicts.getValueByCode('magazineType', this.viewForm.type);
            this.viewForm.type = type;
            this.viewFormShow = true;
        },
        callback() {
            this.showTip();
            this.loadData();
        }
    },
    mounted() {
        // this.loadData();
    }
};
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">

</style>
