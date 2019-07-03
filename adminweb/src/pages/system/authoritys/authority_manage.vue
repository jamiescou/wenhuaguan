<template>
    <div class="authorityManage">
        <v-pageheader :breadcrumbs="[{ name: '角色管理' }]"></v-pageheader>

        <el-row type="flex" justify="center" :gutter="20">
            <el-col :span="6" class="tree-wrapper">
                <div class="tree-heading">
                    <div class="v-line"></div>
                    <h5 class="u-title">站点</h5>
                </div>
                <v-orgtree @orgClick="orgClick" ref="cultCenterTree" orgType="org" :expanded="true"></v-orgtree>
            </el-col>
            <el-col :span="18">
                <div class="right-opers">
                    <el-button type="primary" @click="handleAddRole"  style="margin-top:10px">添加角色</el-button>
                </div>
                <div class="table-container" style="margin-top:20px">
                    <el-table :data="dataList" border stripe v-loading.body="loading" tooltip-effect="custom-effect">
                        <el-table-column label="序号" type="index" width="80" align="center"></el-table-column>
                        <el-table-column prop="code" label="角色编码" align="center"></el-table-column>
                        <el-table-column prop="name" label="角色名称" align="center"></el-table-column>
                      <el-table-column prop="unit.name" label="站点" align="center"></el-table-column>
                        <el-table-column label="操作" width="360px" align="center">
                            <template scope="scope">
                                <a class="btn-act" @click="handleEditRole(scope.row)">编辑</a>
                                <a class="btn-act" @click="handleGrants(scope.row)">授权菜单</a>
                                <a class="btn-act" @click="handleMembers(scope.row)">角色成员</a>
                                <a class="btn-act" @click="handleDelRole(scope.row)">删除</a>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-col>
        </el-row>

        <el-dialog :title="title" :close-on-click-modal='false' v-model="dialogVisible" @close="resetForm('roleForm')">
            <el-form ref="roleForm" :model="roleForm" :rules="rules" class="m-form" label-position="right" label-width="100px">
                <el-form-item label="角色编码" prop="code">
                    <el-input v-model="roleForm.code" :readonly="isDisabled" :disabled="isDisabled"></el-input>
                </el-form-item>
                <el-form-item label="角色名称" prop="name">
                    <el-input v-model="roleForm.name"></el-input>
                </el-form-item>
                <div class="form-opres" style="text-align:center">
                    <el-button @click="resetForm('roleForm')">取消</el-button>
                    <el-button type="primary" @click="submitForm('roleForm')">保存</el-button>
                </div>
            </el-form>
        </el-dialog>
        <el-dialog title="授权菜单" v-model="menuDialog">
            <div class="grant-wrapper">
                <el-tree :data="treeData" show-checkbox ref="grantTree" node-key="code" :props="defaultProps" >
                </el-tree>
            </div>
            <!-- <el-checkbox  style="margin-top:20px;" :indeterminate="isIndeterminate">全选</el-checkbox> -->
            <div class="grant-actions">
                <el-button @click="menuDialog = false">取消</el-button>
                <el-button type="primary" @click="savemenu">保存</el-button>
            </div>
        </el-dialog>
        <el-dialog title="角色成员分配" v-model="roleMember.managerDialog" class="dialog-role-member" @close="resetRoleMember">
            <el-transfer v-model="roleMember.result" filterable :render-content="roleMember.renderFunc" :titles="['可选', '已选']" :footer-format="{noChecked: '全选',hasChecked: '全选'}" :data="roleMember.data" :props="{key: 'id',label: 'name'}">
            </el-transfer>
            <div class="dialog-footer">
                <el-button @click="resetRoleMember">取消</el-button>
                <el-button type="primary" @click="submitManagerForRole">保存</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import Api from '@/api';
import treePanel from '../organizations/org_tree_panel'
import vRules from '@/config/validate_rules';
// import BaseTable from '@/mixins/base-table';
const DIALOG = {
    add: { title: '添加角色', flag: 'Add' },
    edit: { title: '编辑角色', flag: 'Edit' }
};

export default {
    components: {
        'v-orgtree': treePanel
    },
    data() {
        return {
            dataList: [],
            checkednodes: [],
            loading: false,
            dialogVisible: false,
            menuDialog: false,
            isIndeterminate: true,
            title: DIALOG.add.title,
            flag: DIALOG.add.flag,
            initForm: { code: '', name: '', unit: {} },
            defaultProps: { children: 'children', label: 'name' },
            cultCenter: {},
            treeData: [],
            roleForm: {},
            editRole: {}, // 授权
            rules: {
                code: [vRules.required],
                name: [vRules.required,vRules.maxLen(40)]
            },
            roleMember: {
                managerDialog: false,
                renderFunc(h, option) {
                    return h('span', option.name + ' (' + option.unit.name + ')');
                },
                result: [],
                data: [],
                unitId: '',
                id: ''
            }
        }
    },
    computed: {
        isDisabled() {
            return this.flag !== DIALOG.add.flag
        }
    },
    methods: {
        handleCheckedCitiesChange(val) {
        },
        // 文化馆节点点击
        orgClick(orgInfo) {
            this.cultCenter = orgInfo;
            this.loadData();
        },

        // 加载角色
        loadData() {

            Api.system.getRoleList(this.cultCenter.id).then((res) => {
                this.dataList = res;
            }).finally();
        },
        // 添加角色
        handleAddRole() {
            this.flag = DIALOG.add.flag;
            this.title = DIALOG.add.title;
            this.roleForm = this.deepClone(this.initForm);
            this.roleForm.unit = {
                id: this.cultCenter.id,
                name: this.cultCenter.name,
                type: this.cultCenter.type
            }
            this.dialogVisible = true;
        },
        // 编辑角色
        handleEditRole(row) {
            this.flag = DIALOG.edit.flag;
            this.title = DIALOG.edit.title;
            this.roleForm = this.deepClone(row);
            this.dialogVisible = true;
        },
        // 授权
        handleGrants(row) {
            this.editRole = this.deepClone(row);
            let unitId = row.unit.id;
            let id = row.id;
            Api.system.getRoleMenuAuth(unitId, id).then((res) => {
                this.$refs.grantTree.setCheckedKeys(res);
            });
            this.menuDialog = true;
        },
        // 保存授权
        savemenu() {
            let ids = [];
            let nodeids = this.$refs.grantTree.getCheckedNodes();
            for (var i = 0; i < nodeids.length; i++) {
                ids.push(nodeids[i].code);
            }
            let id = this.editRole.id;
            let unitId = this.editRole.unit.id;
            Api.system.modifyRoleMenuAuth(unitId, id, ids).then(this.callback);
        },
        // 删除角色
        handleDelRole(row) {
            var self = this;
            let id = self.cultCenter.id;
            self.delConfirm('角色信息', function() {
                Api.system.delRole(id, row.id).then(self.callback);
            });
        },
        callback() {
            this.$message({
                showClose: true,
                message: '操作成功',
                type: 'success'
            });
            this.dialogVisible = false;
            this.menuDialog = false;
            this.loadData();
        },
        // 提交保存角色
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let id = this.cultCenter.id;
                    if (this.flag === DIALOG.add.flag) {
                        Api.system.addRoleItem(id, this.roleForm).then(this.callback);
                    } else {
                        let roleId = this.roleForm.id;
                        this.roleForm.dataDeptId = this.$store.getters.user.unit.id;
                        let user = {      
                         code: this.roleForm.code,
                         name:this.roleForm.name,
                         dataDeptId:this.$store.getters.user.unit.id
            }
                        Api.system.modifyRole(id, roleId, user).then(this.callback);
                    }
                } else {                    
                    return false;
                }
            });
        },
        // 重置表单
        resetForm(formName) {
            this.$refs[formName].resetFields();
            this.dialogVisible = false;
        },
        // 获取授权菜单
        getMenus() {
            Api.menu.getTopMenus().then((res) => {
                this.treeData = res;
            });
        },
        // 角色成员
        handleMembers(row) {
            let unitId = row.unit.id;
            let id = row.id;
            // Api.system.getAccountList(unitId, '', this.page, -1).then((res) => {
            //     this.roleMember.data = res.content;
            // }).catch();
            Api.system.getManagerForRole(unitId, id).then((res) => {
                this.roleMember.data = res.member;
                this.roleMember.result = res.selected;
            });
            this.roleMember.unitId = unitId;
            this.roleMember.id = id;
            this.roleMember.managerDialog = true;
        },
        // 重置角色成员设置
        resetRoleMember() {
            this.roleMember.managerDialog = false;
            this.roleMember.result = [];
            this.roleMember.data = [];
            this.roleMember.unitId = '';
            this.roleMember.id = '';
        },
        // 提交角色成员设置
        submitManagerForRole() {
            let member = this.roleMember;
            Api.system.setManagerForRole(member.unitId, member.id, member.result).then((res) => {
                this.$message({
                    showClose: true,
                    message: '操作成功',
                    type: 'success'
                });
                this.resetRoleMember();
            });
        }
    },
    mounted() {
        this.getMenus();
    }
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
.authorityManage {
    .table-container {
        margin-top: 40px;
    }
    .grant-wrapper {
        height: 270px;
        overflow-y: auto;
        border: 1px solid #ccc;
        box-sizing: border-box;
        .el-tree {
            margin-top: -1; // height: 100%;
            border-width: 0;
        }
    }
    .grant-actions {
        margin-top: 20px;
        text-align: center;
    }
    .dialog-role-member {
        .el-dialog {
            width: 740px;
        }
        .el-transfer-panel {
            width: 300px;
        }
    }
}
</style>
