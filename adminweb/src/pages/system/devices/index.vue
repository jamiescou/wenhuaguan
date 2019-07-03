<template>
    <div class="accountManage">
        <v-pageheader :breadcrumbs="[{ name: '设备管理' }]"></v-pageheader>
        <el-row type="flex" justify="center" :gutter="20">
            <el-col :span="6" class="tree-wrapper">
                <div class="tree-heading">
                    <div class="v-line"></div>
                    <h5 class="u-title">站点</h5>
                </div>
                <v-orgtree @orgClick="orgClick" ref="cultCenterTree" orgType="org" :expanded="true"></v-orgtree>
            </el-col>
            <el-col :span="18" style="margin-top:10px">
                <div class="right-opers">
                    <el-button type="primary" @click="handleAdd">添加设备</el-button>
                </div>
                <div class="table-container" style="margin-top:20px">
                    <el-table :data="dataList" border stripe v-loading.body="loading" tooltip-effect="custom-effect">
                        <el-table-column label="序号" type="index" width="100" align="center"></el-table-column>
                        <el-table-column prop="name" label="设备名称" align="center"></el-table-column>
                        <el-table-column prop="clinetId" label="客户端" align="center"></el-table-column>
                        <el-table-column prop="unit.name" label="部门" align="center"></el-table-column>
                        <el-table-column label="操作" align="center">
                            <template scope="scope">
                                <a class="btn-act" @click="handleEdit(scope.row)">编辑</a>
                                <a class="btn-act" @click="handleDel(scope.row)">删除</a>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-col>
        </el-row>

        <el-dialog :title="title" v-model="dialogVisible" :close-on-click-modal="false" @close="resetForm('deviceForm')">
            <el-form ref="deviceForm" :model="deviceForm" :rules="rules" label-position="right" label-width="100px" class="m-form">
                <el-row :gutter="10">
                    <el-col :span="12">
                        <el-form-item label="设备名称：" prop="name">
                            <el-input v-model="deviceForm.name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="客户端：" prop="clinetId">
                            <el-input v-model="deviceForm.clinetId"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="密码：" prop="secret">
                    <el-input v-model="deviceForm.secret" type="password"></el-input>
                </el-form-item>
                <div class="dialog-footer">
                    <el-button @click="resetForm('deviceForm')">取消</el-button>
                    <el-button @click="submitForm('deviceForm')" type="primary">确定</el-button>
                </div>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
import Api from '@/api';
import treePanel from '../organizations/org_tree_panel'
import vRules from '@/config/validate_rules';

const DIALOG = {
    add: { title: '新增设备', flag: 'add' },
    edit: { title: '编辑设备', flag: 'edit' }
};

export default {
    components: {
        'v-orgtree': treePanel
    },
    data() {
        return {
            dataList: [],
            loading: false,
            title: DIALOG.add.title,
            flag: DIALOG.add.flag,
            dialogVisible: false,
            deviceForm: {},
            cultCenter: {},
            initForm: {
                name: '',
                clinetId: '',
                secret: '',
                unit: {}
            },
            rules: {
                name: [vRules.required,vRules.maxLen(40)],
                secret: [vRules.required]
            }
        }
    },
    methods: {
        orgClick(orgInfo) {
            this.cultCenter = orgInfo;
            this.loadData();
        },
        loadData() {
            this.loading = true;
            let str = '';
            Api.system.getDevicesList(str, this.page, this.size).then((res) => {
                this.dataList = res;
            }).finally(() => { this.loading = false; });
        },
        handleAdd() {
            this.flag = DIALOG.add.flag;
            this.title = DIALOG.add.title;
            this.deviceForm = Object.assign({}, this.initForm);
            this.deviceForm.unit = { id: this.cultCenter.id }
            this.dialogVisible = true;
        },
        handleEdit(row) {
            this.flag = DIALOG.edit.flag;
            this.title = DIALOG.edit.title;
            this.deviceForm = Object.assign({}, row);
            this.dialogVisible = true;
        },
        handleDel(row) {
            this.delConfirm('“' + row.name + '”设备', () => {
                Api.system.delDevice(row.id).then(this.callback);
            });
        },
        resetForm(FormName) {
            if (this.$refs[FormName]) this.$refs[FormName].resetFields();
            this.dialogVisible = false;
        },
        callback() {
            this.showTip();
            this.resetForm('deviceForm');
            this.dialogVisible = false;
            this.loadData();
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (!valid) return;
                if (this.flag === DIALOG.add.flag) {
                    this.deviceForm.dataDeptId = this.$store.getters.user.unit.id;
                    Api.system.addDevice(this.deviceForm).then(this.callback);
                } else if (this.flag === DIALOG.edit.flag) {
                    Api.system.modifyUnit(this.deviceForm.id, this.deviceForm).then(this.callback);
                }
            });
        }
    },
    mounted() {
        this.loadData()
    }
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">

</style>
