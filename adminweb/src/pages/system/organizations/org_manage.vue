<template>
    <div class="orgManage">
        <v-pageheader :breadcrumbs="[{ name: '部门管理' }]"></v-pageheader>
        <el-row type="flex" justify="center" :gutter="20">
            <el-col :span="6" class="tree-wrapper">
                <div class="tree-heading">
                    <div class="v-line"></div>
                    <h5 class="u-title">部门</h5>
                    <div class="tree-opers">
                        <el-button size="small" @click="handleEdit" type="primary" icon="edit" v-if="hasEditAndDel" title="编辑部门"></el-button>
                        <el-button size="small" @click="handleDel" type="primary" icon="delete" v-if="hasEditAndDel" title="删除部门"></el-button>
                        <el-button size="small" @click="HandAdd" type="primary" icon="plus" title="添加部门"></el-button>
                    </div>
                </div>
                <v-orgtree @orgClick="orgClick" ref="depTree" ></v-orgtree>
            </el-col>
            <el-col :span="18">
                <div class="tree-content-panel">
                    <div class="tree-heading content-heading">
                        <div class="v-line"></div>
                        <h5 class="u-title">组织详细信息</h5>
                    </div>
                    <div class="detail-panel">
                        <el-row>
                            <el-col :span="12">
                                <v-detailItem label="组织名称" :value="depInfo.name"></v-detailItem>
                            </el-col>
                            <el-col :span="12">
                                <v-detailItem label="组织类型" :value="convertType(depInfo.type)"></v-detailItem>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12">
                                <v-detailItem label="上级组织" :value="depInfo.parentName"></v-detailItem>
                            </el-col>
                            <el-col :span="12">
                                <v-detailItem label="管理组织" :value="depInfo.upperName"></v-detailItem>
                            </el-col>
                        </el-row>
                    </div>
                </div>
                <div class="table-container">
                    <div class="tree-heading">
                        <div class="v-line"></div>
                        <h5 class="u-title">人员列表</h5>
                        <div class="tree-opers">
                            <el-button @click="HandAddManager" type="primary" icon="plus">新增人员</el-button>
                        </div>
                    </div>
                    <div class="table-container">
                    <el-table :data="dataList" border stripe v-loading.body="loading" tooltip-effect="custom-effect">
                        <el-table-column label=" " type="index" width="70" align="center"></el-table-column>
                        <el-table-column prop="name" label="姓名"></el-table-column>
                        <el-table-column prop="username" label="账号" width="120"></el-table-column>
                        <el-table-column prop="sex" label="性别" width="120" :formatter="formatterSex"></el-table-column>
                        <el-table-column prop="phone" label="电话"></el-table-column>
                        <el-table-column prop="unit.name" label="部门"></el-table-column>
                        <el-table-column label="操作" width="300px" align="center">
                            <template scope="scope">
                                <a class="btn-act" @click="HandEditManager(scope.row)">编辑</a>
                                <a class="btn-act" @click="HandChangeDept(scope.row)" v-if="scope.row.username!=''">换部门</a>
                                <!--<a class="btn-act" @click="HandSetRole(scope.row)">分配角色</a>-->
                                <a class="btn-act" @click="HandEditAccount(scope.row)" v-if="scope.row.username==''">分配账号</a>
                                <a class="btn-act" @click="HandDelManager(scope.row)">删除</a>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="pagination-container">
                        <v-pagination @pageChange="onCurrentChange" :total="total" :isShow="showPagination"></v-pagination>
                    </div>
                </div>
                </div>
            </el-col>
        </el-row>
        <el-dialog :title="title" v-model="dialogVisible" :close-on-click-modal="false">
            <el-row>
                <el-col :span="18">
                    <el-form ref="depForm" :model="depForm" :rules="rules" label-position="right" label-width="100px" class="m-form">
                        <el-form-item label="名称：" prop="name">
                            <el-input v-model="depForm.name"></el-input>
                        </el-form-item>
                        <el-form-item label="上级组织：">
                            {{depForm.parent ? depForm.parent.name : ''}}
                        </el-form-item>
                        <el-form-item label="管理组织：" prop="upper" style="height: 270px; overflow-y: auto;">
                            <selectDept @deptChange="handSuperUnit" :currentDept="depForm.upper" :orgId="orgId"></selectDept>
                            <!-- <v-orgtree ref='upperTree' @orgClick="handSuperUnit"></v-orgtree> -->
                            <!-- <el-input v-model="orgForm.upper" type="hidden"></el-input> -->
                        </el-form-item>
                        <div class="form-opres">
                            <el-button @click="resetForm('depForm')">取消</el-button>
                            <el-button @click="submitForm('depForm')" type="primary">确定</el-button>
                        </div>
                    </el-form>
                </el-col>
            </el-row>
        </el-dialog>
        <!-- 人员 -->
        <el-dialog :title="title" v-model="managerDialog" :close-on-click-modal='false'>
            <div>
                <el-form ref="managerForm" :model="managerForm" :rules="managerRules" class="m-form" label-position="right" label-width="120px">
                    <!--<el-form-item label="帐号：" prop="username">
                        <el-input v-model="managerForm.username" :readonly="isEditManager" :disabled="isEditManager"></el-input>
                    </el-form-item>-->
                    <el-form-item label="姓名：" prop="name">
                        <el-input v-model="managerForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="性别" prop="sex">
                      <el-radio-group v-model="managerForm.sex">
                        <el-radio  key="male" label="male">男</el-radio>
                        <el-radio  key="female" label="female">女</el-radio>
                      </el-radio-group>
                    </el-form-item>
                    <el-form-item label="职务：" prop="occupation">
                      <el-input v-model="managerForm.occupation"></el-input>
                    </el-form-item>
                    <el-form-item label="电话：" prop="phone">
                        <el-input v-model="managerForm.phone"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱：" prop="email">
                      <el-input v-model="managerForm.email"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div class="dialog-footer">
                <el-button @click="resetForm('managerForm')">取消</el-button>
                <el-button type="primary" @click="submitManagerForm('managerForm')">保存</el-button>
            </div>
        </el-dialog>
        <!-- 分配账号 -->
        <el-dialog :title="title" v-model="accountDialog" :close-on-click-modal='false'>
            <div>
              <el-form ref="managerForm" :model="managerForm" :rules="managerRules" class="m-form" label-position="right" label-width="120px">
                <el-form-item label="帐号：" prop="username">
                  <el-input v-model="managerForm.username"></el-input>
                </el-form-item>
              </el-form>
            </div>
            <div class="dialog-footer">
              <el-button @click="resetForm('managerForm')">取消</el-button>
              <el-button type="primary" @click="submitAccountForm('managerForm')">保存</el-button>
            </div>
        </el-dialog>
        <el-dialog title="换部门" v-model="changeDeptData.show" :close-on-click-modal='false'>
            <div>
                <v-orgtree @orgClick="handleChangeDept" key="changeDep" :orgId="changeDeptData.orgUnitId" orgType="dep" :expanded="false" ref="changeDepTree"></v-orgtree>
            </div>
            <div class="dialog-footer">
                <el-button @click="resetChangeDeptData">取消</el-button>
                <el-button type="primary" @click="submitChangeDept()">保存</el-button>
            </div>
        </el-dialog>
        <el-dialog title="分配角色" v-model="rolesDialog" :close-on-click-modal='false'>
            <div>
                <el-form :model="userRole">
                    <el-form-item label-width="0">
                        <el-checkbox-group v-model="userRole.roles">
                            <el-checkbox v-for="role in rolesData" :label="role.id" :key="role.id">
                                {{role.name}}
                            </el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </el-form>
            </div>
            <div class="dialog-footer">
                <el-button @click="rolesDialog = false">取消</el-button>
                <el-button type="primary" @click="submitRoles">保存</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import BaseTable from '@/mixins/base-table';
import Api from '@/api';
import treePanel from './org_tree_panel'
import vRules from '@/config/validate_rules';
import selectDept from './designate_dept';

const ORG_TYPE = { 'org': '机构', 'dep': '部门' }
const ORGDIALOG = {
    add: { title: '添加部门', flag: 'Add' },
    edit: { title: '编辑部门', flag: 'Edit' },
    mAdd: { title: '添加人员', flag: 'AddManager' },
    mEdit: { title: '编辑人员', flag: 'EditManager' },
    eEdit: { title: '分配账号', flag: 'EditAccount' }
};

export default {
    mixins: [BaseTable],
    components: {
        'v-orgtree': treePanel,
        'selectDept': selectDept
    },
    data() {
        return {
            orgId:"",
            dialogVisible: false,
            managerDialog: false,
            accountDialog: false,
            rolesDialog: false,
            title: ORGDIALOG.add.title,
            flag: ORGDIALOG.add.flag,
            initForm: {
                'name': '',
                'contactName': '',
                'contactPhone': '',
                'region': '',
                'address': '',
                'site': '',
                'remark': '',
                'parent': '', // 物理上的上级部门
                'upper': '', // 管理上的上级部门
                'seqno': ''
                // 'hasOrgChildren': '',
                // 'hasDepChildren': ''
            },
            initMForm: {
                username: '',
                password: '',
                name: '',
                sex: 'unkown',
                phone: '',
                unit: {},
                // orgUnit: {},
                roles: [],
                isLocked: ''
            },
            first:false,
            rolesData: [],
            depForm: {},
            depInfo: {},
            sexoptions: [{ label: '男', value: 'male' }, { label: '女', value: 'female' }],
            managerForm: {sex:''  },
            userRole: { unitid: '', username: '', roles: [] },
            rules: {
                name: [vRules.required]
            },
            managerRules: {
                // username: [vRules.required,vRules.maxLen(40)],
                name: [vRules.required,vRules.maxLen(40)],
                phone:vRules.mobilePhone
            },
            changeDeptData: {
                user: {},
                unitId: '',
                orgUnitId: '',
                show: false
            }
        }
    },
    computed: {
        // 计算是否是部门？部门有“编辑、删除”操作，机构（文化馆）没有。
        hasEditAndDel() {
            return this.depInfo.type === 'dep'
        },
        // 计算是否是人员编辑
        isEditManager() {
            return this.flag === ORGDIALOG.mEdit.flag;
        }
    },
    methods: {
        // 机构类型转换
        convertType(type) {
            return ORG_TYPE[type];
        },
        // 获取上级机构名称
        // getParent(parent) {
        //     if (parent !== undefined && parent !== null) {
        //         return parent.name;
        //     }
        // },
        // // 获取管理上层机构名称
        // getUpper(upper) {
        //     if (upper !== undefined && upper !== null) {
        //         return upper.name;
        //     }
        // },
        // 左边组织树节点点击处理
        orgClick(orgInfo) {  
            this.first=true;         
            this.depInfo = orgInfo;            
            this.orgId=this.depInfo.parentId;
            this.loadData();         
           
        },
        formatterSex(row){
            if(row.sex ===null||row.sex ==='') return null;
            if(row.sex === 'male'){
                return '男';
            }else if(row.sex === 'female'){
                return '女';
            }
        },
        // 添加部门管理上层机构选择处理事件。
        handSuperUnit(orgInfo) {            
            if (orgInfo.id === this.depForm.id) {
                this.showTip('不能选择本部门', 'error');
                return;
            }
            this.depForm.upper = orgInfo;
        },
        // 更换部门
        handleChangeDept(orgInfo) {
            if (orgInfo.id === this.changeDeptData.user.unit.id) {
                this.showTip('您选择了原部门', 'error');
                return;
            }
            this.changeDeptData.user.unit = orgInfo;
        },
        // 添加部门
        HandAdd() {
            if (this.isEmptyObject(this.depInfo)) {
                this.showTip('请先选择组织机构', 'warning');
                return;
            }
            this.flag = ORGDIALOG.add.flag;
            this.title = ORGDIALOG.add.title;
            this.depForm = Object.assign({}, this.initForm);
            this.depForm.type = 'dep';
            this.depForm.parent = this.depInfo;
            this.depForm.upper = this.depInfo;
            this.dialogVisible = true;
        },
        // 编辑部门
        handleEdit() {            
            if (this.isEmptyObject(this.depInfo)) {
                this.showTip('请先选择组织机构', 'warning');
                return;
            }
            this.flag = ORGDIALOG.edit.flag;
            this.title = ORGDIALOG.edit.title;            
            this.depForm = JSON.parse(JSON.stringify(this.depInfo));            
            this.dialogVisible = true;
        },
        // 删除部门
        handleDel() {
            let dep = this.depInfo;
            let self = this;
            // if ((!dep.hasOrgChildren && dep.hasOrgChildren.length > 0) || (!dep.hasDepChildren && dep.hasDepChildren.length > 0)) {
            //     this._ShowTip('请先删除下级管理部门！', 'error');
            //     return;
            // }
            self.delConfirm(dep.name + '信息', () => {
                Api.system.delUnit(dep.id).then(self.callback);
            });
        },
        // 回调函数
        callback() {
            this.showTip();
            this.resetForm('depForm');
            this.$refs.depTree.getTreedatas();
//            this.$refs.upperTree.getTreedatas();
        },
        // 重置表单
        resetForm(FormName) {
            if (this.$refs[FormName]) {
                this.$refs[FormName].resetFields();
            }
            this.dialogVisible = false;
            this.managerDialog = false;
        },
        // 部门“添加、编辑”数据提交
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let newForm = {
                        name: this.depForm.name,
                        parent: { id: this.depForm.parent.id },
                        upper: { id: this.depForm.upper.id },
                        type: this.depForm.type
                    }
                    if (this.flag === ORGDIALOG.add.flag) {
                        Api.system.addUnit(newForm).then(this.callback);
                    } else if (this.flag === ORGDIALOG.edit.flag) {
                        newForm.id = this.depForm.id;
                        Api.system.modifyUnit(newForm.id, newForm).then(this.callback);
                    }
                }
            });
        },
        // 根据组织id获取组织下的人员       
        loadData()
        {
           if(this.first)
           {          
             if (this.isEmptyObject(this.depInfo)) {
                this.showTip('请先选择组织机构', 'warning');
                return;
            }
            this.loading = true;
            this.dataList = [];
            var str = 'search=';
            let id = this.depInfo.id;
            Api.system.getAccountList(id, str, this.page, this.size).then((res) => {
                this.dataList = res.content;
                this.total = res.totalElements;
            }).finally(() => { this.loading = false });
            }
        },
        // 添加人员
        HandAddManager() {
            this.flag = ORGDIALOG.mAdd.flag;
            this.title = ORGDIALOG.mAdd.title;
            this.managerForm = this.deepClone(this.initMForm);
            this.managerForm.unit = {
                id: this.depInfo.id,
                name: this.depInfo.name,
                type: this.depInfo.type
            };
            this.managerDialog = true;
        },
        // 编辑人员
        HandEditManager(row) {
            this.flag = ORGDIALOG.mEdit.flag;
            this.title = ORGDIALOG.mEdit.title;
            this.managerForm = this.deepClone(row);
            this.managerDialog = true;
        },
        // 分配账号
        HandEditAccount(row) {
          this.flag = ORGDIALOG.eEdit.flag;
          this.title = ORGDIALOG.eEdit.title;
          this.managerForm = this.deepClone(row);
          this.accountDialog = true;
        },
        // 换部门点击处理
        HandChangeDept(row) {
            this.changeDeptData = {
                user: row,
                unitId: row.unit.id,
                orgUnitId: row.orgUnit.id,
                show: true
            };
        },
        // 提交换部门数据
        submitChangeDept() {

            let user = {
                username:this.changeDeptData.user.username,
                unit:{"id":this.changeDeptData.user.unit.id}
            }
            if (this.isEmptyObject(user.unit)) {
                this.showTip('请先选择组织机构', 'warning');
                return;
            }
            let unitid = this.changeDeptData.unitId;            
            Api.system.modifyAccount(unitid, user).then(this.callbackManager);
        },
        // 分配角色
        HandSetRole(row) {
            this.userRole.unitid = row.unit.id;
            this.userRole.username = row.username;
            this.userRole.roles = [];
            if (row.roles && row.roles.length > 0) {
                for (let r of row.roles) {
                    if (r === null || r === undefined) continue;
                    this.userRole.roles.push(r.id);
                }
            }
            let unitid = row.orgUnit.id;
            Api.system.getRoleList(unitid).then((res) => {
                if (!res || !res.length) {
                    this.showTip('该用户的所属文化馆还没有角色，请先联系管理员创建角色！', 'error');
                } else {
                    this.rolesDialog = true;
                    this.rolesData = res;
                }
            });
        },
        // 提交角色分配
        submitRoles() {
            let unitid = this.userRole.unitid;
            let username = this.userRole.username;
            let roles = this.userRole.roles;
            Api.system.changeAccountRole(unitid, username, roles).then(this.callbackManager);
        },
        // 删除人员
        HandDelManager(row) {
            let self = this;
            let unitId = row.unit.id;
            let userName = row.username;
            self.delConfirm('人员信息', () => {
                Api.system.delAccount(unitId, row.id).then(this.callbackManager);
            });
        },
        // 重置换部门数据
        resetChangeDeptData() {
            this.changeDeptData = {
                user: {},
                unitId: '',
                orgUnitId: '',
                show: false
            }
        },
        // 人员操作回调函数
        callbackManager() {
            this.showTip();
            this.resetForm('managerForm');
            this.loadData();
            this.resetChangeDeptData();
            this.rolesDialog = false;
            this.accountDialog = false;
        },
        // 管理人员“新增、编辑”数据提交
        submitManagerForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    // delete this.managerForm.unit.parent;
                    // delete this.managerForm.unit.upper;
                    let newForm = {
                        id:this.managerForm.id,
                        username: this.managerForm.username,
                        name: this.managerForm.name,
                        sex: this.managerForm.sex,
                        email: this.managerForm.email,
                        occupation: this.managerForm.occupation,
                        phone: this.managerForm.phone,
                        unit: {"id": this.managerForm.unit.id}
                    };
                    let depId = this.depInfo.id;                    
                    if (this.flag === ORGDIALOG.mAdd.flag) {
                        Api.system.addAccount(depId, newForm).then(this.callbackManager);
                    } else if (this.flag === ORGDIALOG.mEdit.flag) {
                        Api.system.modifyManage(depId, newForm).then(this.callbackManager);
                    }
                }
            });
        },
        //分配账号
        submitAccountForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let newForm = {
                        id:this.managerForm.id,
                        username: this.managerForm.username,
                        name: this.managerForm.name,
                        phone: this.managerForm.phone,
                        isAccount: true,
                        unit: {"id": this.managerForm.unit.id}
                    };
                    let depId = this.depInfo.id;
                    if (this.flag === ORGDIALOG.eEdit.flag) {
                        Api.system.modifyManage(depId, newForm).then(this.callbackManager);
                    }
                }
            });
        }
    }
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
.orgManage {
  .tree-wrapper {
    min-width: 240px;
  }
  .actions {
    margin-top: 20px;
    text-align: center;
  }
  .table-container {
    margin-top: 30px;
  }
}
</style>
