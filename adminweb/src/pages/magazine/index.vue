<template>
    <div class="list-wrapper">
        <v-pageheader :breadcrumbs="[{ name: '电子杂志管理' }]"></v-pageheader>
        <div class="right-opers">
            <el-button type="primary" @click="handleAdd">添加杂志</el-button>
        </div>
        <div class="table-container">
            <section class="search-wrapper">
                <el-form :inline="true" :model="searchForm" label-width="0">
                    <el-form-item>
                        <el-input v-model="searchForm.name" placeholder="杂志名称">

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
                <el-table-column prop="name" label="杂志名称">
                    <template scope="scope">
                        <a class="u-link" @click="detail(scope.$index, scope.row)"> {{scope.row.name}}</a>
                    </template>
                </el-table-column>
                <el-table-column prop="type" label="出版周期" :formatter="formatMagazineType"></el-table-column>
                <el-table-column prop="isPublish" label="状态">
                    <template scope="scope">
                        <span>{{scope.row.isPublish? '已上架':'未上架'}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="500px" align="center">
                    <template scope="scope">
                        <a class="btn-act" @click="edit(scope.$index, scope.row)" v-if="scope.row.isPublish !== true">编辑</a>
                        <a class="btn-act" @click="publish(scope.$index, scope.row)">{{scope.row.isPublish?'下架':'上架'}}</a>
                        <a class="btn-act" @click="issues(scope.$index, scope.row)">各期杂志</a>
                        <a class="btn-act" @click="contribute(scope.$index, scope.row)">稿件</a>
                        <a class="btn-act" @click="del(scope.$index, scope.row )" v-if="scope.row.isPublish !== true">删除</a>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination-container ">
                <v-pagination @pageChange="onCurrentChange" :total="total" :isShow="showPagination"></v-pagination>
            </div>
        </div>

        <el-dialog :title="title" :visible.sync="dialogFormVisible">
            <el-form ref="magazineForm" :model="magazineForm" :rules="rules" label-position="right" label-width="100px" class="m-form">
                <el-row :gutter="20">
                    <el-form-item label="杂志名称" prop="name">
                        <el-input v-model="magazineForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="杂志简介" prop="brief">
                        <el-input type="textarea" v-model="magazineForm.brief"></el-input>
                    </el-form-item>
                    <el-form-item label="出版周期" prop="type">
                        <el-radio-group v-model="magazineForm.type">
                            <v-option typeName="magazineType" optType="radio"></v-option>
                        </el-radio-group>
                    </el-form-item>
                </el-row>
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
            magazineForm: {
                name: '',
                brief: '',
                type: '',
                unitId: ''
            },
            dictNames: ['magazineType'],
            rules: {
                name: [vRules.required],
                brief: [vRules.required],
                type: [vRules.required]
            }
        };
    },
    methods: {
        loadData() {
            let name = this.searchForm.name;
            let str = 'searchUnitId';
            let user = this.$store.getters.user;
        //    str += "unitId:" + user.orgUnit.id;
            if (name !== '') str += ',name~' + name;
            str += '&sort=createTime~desc';
            this.showLoading();
            Api.magazine.getMagazineList(str, this.page, this.size).then((res) => {
                this.dataList = res.content;
                this.total = res.totalElements;
            }).finally(this.closeLoading);
        },
        // 添加杂志
        handleAdd() {
            this.dialogFormVisible = true;
            this.magazineForm = {
                name: '',
                brief: '',
                type: '',
                unitId: ''
            };
            this.flag = 'add';
            this.title = '新增'
        },
        // 提交
        submitForm() {
            let user = this.$store.getters.user;
            this.$refs['magazineForm'].validate((valid) => {
                if (valid) {
                    let newForm = Object.assign({}, this.magazineForm);
                    if (this.flag === 'add') {
                        newForm.unitId = user.orgUnit.id;
                        newForm.dataDeptId = user.unit.id;
                        Api.magazine.creatMagazine(newForm).then(this.callback, this.dialogFormVisible = false);
                    } else if (this.flag === 'edit') {
                        Api.magazine.modifyMagazine(newForm.id, newForm).then(this.callback, this.dialogFormVisible = false);
                    }
                }
            });
        },
        // 删除杂志
        del(index, row) {
            let self = this;
            self.delConfirm('杂志', () => {
                Api.magazine.delMagazine(row.id).then(self.callback);
            });
        },
        // 编辑杂志
        edit(index, row) {
            this.magazineForm = Object.assign({}, row);
            this.dialogFormVisible = true;
            this.flag = 'edit';
            this.title = '编辑';
        },
        // 格式化期刊
        formatMagazineType(row, column, cellValue) {
            return this.dicts.getValueByCode('magazineType', cellValue);
        },
        // 查看详情
        detail(index, row) {
            this.viewForm = Object.assign({}, row);
            let type = this.dicts.getValueByCode('magazineType', this.viewForm.type);
            this.viewForm.type = type;
            this.viewFormShow = true;
        },
        // 志愿者活动管理
        activity(index, row) {
            this.$router.push({ path: 'nouns_activity', query: { id: row.id } })
        },
        // 上下架
        publish(index, row) {
            let msg = row.isPublish ? '是否确认下架？' : '确认上架？';
            this.$confirm(msg, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then((res) => {
                if (row.isPublish) {
                    Api.magazine.setMagazineUnPublish(row.id).then(this.callback);
                } else {
                    Api.magazine.setMagazinePublish(row.id).then(this.callback);
                }
            });
        },
        // 各期杂志
        issues(index, row) {
            this.$router.push({ path: 'magazineissue', query: { mid: row.id } })
        },
        // 各期杂志
        contribute(index, row) {
            this.$router.push({ path: 'contribute', query: { mid: row.id } })
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
