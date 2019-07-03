<template>
    <div class="list-wrapper">
        <v-pageheader :breadcrumbs="[{ name: '栏目管理' }]"></v-pageheader>
        <div class="right-opers">
            <el-button type="primary" @click="handleAdd" icon="plus">添加</el-button>
        </div>
        <section class="search-wrapper">
            <el-form :inline="true" :model="searchForm" label-width="0">
                <el-form-item>
                    <el-input v-model="searchForm.name" placeholder="请输入栏目名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="searchForm.channel" placeholder="请选择频道" clearable>
                        <el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in chanels"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="loadData">查询</el-button>
                </el-form-item>
            </el-form>
        </section>
        <div class="table-container">
            <el-table :data="dataList" border stripe v-loading.body="loading" tooltip-effect="custom-effect">
                <el-table-column label=" " type="index" width="80px" align="center"></el-table-column>
                <el-table-column prop="name" label="栏目标题" align="center"></el-table-column>
                <el-table-column prop="parent.name" label="上级栏目" align="center"></el-table-column>
                <el-table-column prop="chanel" label="所属频道" align="center" :formatter="chanelFormatter"></el-table-column>
                <el-table-column label="栏目级别" align="center">
                    <template scope="scope">
                        {{scope.row.parent?'2级':'1级'}}
                    </template>
                </el-table-column>
                <el-table-column prop="seqno" label="排序" align="center"></el-table-column>
                <el-table-column prop="enable" width="150px" label="状态" align="center">
                    <template scope="scope">
                        <el-switch v-model="scope.row.enable" on-text="启用" off-text="停用" :on-value="true" :off-value="false" @change="handleEnable(scope.row)"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="180px">
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
        <!-- 添加资讯弹框 -->
        <el-dialog title="添加资讯" v-model="dialogVisible" :close-on-click-modal="false" @close="resetForm('columnForm')">
            <el-form ref="columnForm" :model="columnForm" label-width="80px" :rules="rules" class="">
                <el-form-item label="栏目标题" prop="name">
                    <el-input v-model="columnForm.name" placeholder="请输入栏目标题"></el-input>
                </el-form-item>
                <el-form-item label="所属频道" prop="channel">
                    <el-select v-model="columnForm.channel" placeholder="请选择频道" clearable @change="chanelChange">
                        <el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in chanels"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="上级栏目" prop="parent.id">
                    <el-select v-model="columnForm.parent.id" placeholder="请选择上级栏目" clearable>
                        <el-option :key="item.id" :label="item.name" :value="item.id" v-for="item in level1Columns"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="栏目排序" prop="seqno">
                    <el-input v-model="columnForm.seqno" placeholder="请输入栏目序号"></el-input>
                </el-form-item>
                <el-form-item label="栏目状态">
                    <el-switch v-model="columnForm.enable" on-text="启用" off-text="停用" :on-value="true" :off-value="false"></el-switch>
                </el-form-item>
                <el-form-item>
                    <el-button @click="resetForm('columnForm')">取消</el-button>
                    <el-button type="primary" @click="submitForm('columnForm')">提交</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
import BaseTable from '@/mixins/base-table';
import Api from '@/api';
import vRules from '@/config/validate_rules'

const DIALOG = {
    add: { title: '添加栏目', flag: 'Add' },
    edit: { title: '编辑栏目', flag: 'Edit' }
};
export default {
    mixins: [BaseTable],
    data() {
        return {
            thiseditid:'',
            chanelShow: true,
            searchForm: { name: '', channel: '' },
            initForm: {
                name: '',
                enable: true,
                seqno: '',
                brief: '',
                unitId: '',
                channel: '',
                parent: { id: '' }
            },
            columnForm: {
                name: '',
                enable: true,
                seqno: '',
                channel: '',
                parent: { id: '' }
            },
            chanels: [],
            level1Columns: [],
            dialogVisible: false,
            rules: {
                name: [vRules.required,vRules.maxLen(40)],
                channel: [vRules.required],
                seqno: [vRules.required, vRules.numberPattern]
            }
        }
    },
    methods: {
        loadData() {
            this.showLoading();
            let str = '';
            let user = this.$store.getters.user;
            str += 'unitId:' + user.orgUnit.id;
            if (this.searchForm.name !== null && this.searchForm.name !== '') str += ',name~' + this.searchForm.name;
            if (this.searchForm.channel !== null && this.searchForm.channel !== '') str += ',channel:' + this.searchForm.channel;
            Api.information.getColumns(str, this.page, this.size).then((res) => {
                this.dataList = res.content;
                this.total = res.totalElements;
            }).finally(this.closeLoading);
        },
        handleAdd(row) {
            this.flag = DIALOG.add.flag;
            this.title = DIALOG.add.title;
            this.columnForm = this.deepClone(this.initForm);
            this.dialogVisible = true;
        },
        handleEdit(row) {
            this.thiseditid=row.id;
            this.flag = DIALOG.edit.flag;
            this.title = DIALOG.edit.title;
            this.columnForm = this.deepClone(row);
            this.columnForm.parent = this.columnForm.parent?this.columnForm.parent : { id: '' };
            this.dialogVisible = true;
            if (row.channel) {                 
                let level1Columns=[];
                Api.information.getColumns('channel:' + row.channel, 1, -1).then((res) => {                                                 
                    if (res) {
                        for (var i = 0; i < res.content.length; i++) {
                            if (res.content[i].parent === null && res.content[i].id !== row.id) {
                                level1Columns.push(res.content[i]);
                            }
                        }
                        this.level1Columns=level1Columns;
                    }
                });
            }
        },
        handleDel(row) {
            let self = this;
            self.delConfirm('栏目信息', () => {
                Api.information.delColumn(row.id).then(self.callback);
            });
        },
        handleEnable(row) {
            Api.information.setColumnEnable(row.id, row.enable).then((res) => {
                this.showTip();
            });
        },
        resetForm(formName) {
            if (this.$refs[formName]) {
                this.$refs[formName].resetFields();
            }
            this.dialogVisible = false;
        },
        callback() {
            this.showTip();
            this.loadData();
            this.columnForm.parent = {};
            this.resetForm('columnForm');
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (!valid) return;
                let parent = this.columnForm.parent;
                // this.columnForm.parent = parent && parent.id === '0' ? null : parent;
                if (parent && parent.id === '') delete this.columnForm.parent;
                if (this.flag === DIALOG.add.flag) {
                    this.columnForm.unitId = this.$store.getters.user.orgUnit.id;
                    this.columnForm.dataDeptId = this.$store.getters.user.unit.id;
                    Api.information.addColumn(this.columnForm).then(this.callback);
                } else if (this.flag === DIALOG.edit.flag) {
                    Api.information.modifyColumn(this.columnForm.id, this.columnForm).then(this.callback);
                }
            });
        },       
        chanelChange(value) {
            this.columnForm.parent.id = '';
            let  level1Columns = [];
            if (value) {
                Api.information.getColumns('channel:' + value, 1, -1).then((res) => {
                    if (res) {
                        for (var i = 0; i < res.content.length; i++) {
                            if (res.content[i].parent === null&& res.content[i].id !== this.thiseditid) {
                                level1Columns.push(res.content[i]);
                            }
                        }
                        this.level1Columns=level1Columns;
                    }
                });
            }
        },
        chanelFormatter(row, column, cellvalue) {                    
           let chanels=[];
           chanels=this.chanels.filter((res)=>   res.value==row.channel  );  
                    
           return chanels[0].label;
        },
       getChanel()
        {
            Api.information.getChannels().then((Channelsres) => {         
                this.chanels = Channelsres;
               });
        }
    },
    mounted() {
        this.getChanel();
    }
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">

</style>
