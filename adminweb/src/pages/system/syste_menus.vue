<template>
    <div>
        <el-row type="flex" justify="center" :gutter="20">
            <el-col :span="6" class="tree-wrapper">
                <el-tree :data="treeData" ref="tree" node-key="id" :default-expanded-keys="defaultExpanded" :expand-on-click-node="false" :current-node-key='currentNode' highlight-current :props="defaultProps" @node-click="HandNodeclick">
                </el-tree>
            </el-col>
            <el-col :span="18">
                <el-button type="primary" @click="handleAdd(false)">添加子菜单(请先选择左侧一个节点)</el-button>
                <el-button type="primary" @click="handleAdd(true)">添加一级菜单</el-button>
                
                <div class="tree-heading content-heading" style="margin-top:20px">
                    <div class="v-line"></div>
                    <h5 class="u-title">{{menuForm.name}}菜单</h5>
                </div>
                
                <div class="table-container">
                    <el-table :data="dataList" border stripe v-loading.body="loading" tooltip-effect="custom-effect" height="400">
                        <el-table-column label=" " type="index" width="60" align="center"></el-table-column>
                        <el-table-column prop="seqno" label="顺序号" width="80"></el-table-column>
                        <el-table-column prop="code" label="菜单编号" width="100"></el-table-column>
                        <el-table-column prop="name" label="菜单名称"></el-table-column>
                        <el-table-column prop="url" label="菜单url"></el-table-column>
                        <el-table-column label="操作" width="200px" align="center">
                            <template scope="scope">
                                <el-button size="small" @click="HandEdit(scope.row)">编辑</el-button>
                                <el-button size="small" :plain="true" @click="handleDelMenu(scope.row)">删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="form-wrapper" style="width:100%">
                    <div class="tree-heading content-heading">
                        <div class="v-line"></div>
                        <h5 class="u-title">{{title}}</h5>
                    </div>
                    <el-form ref="menuForm" :model="menuForm" label-position="right" label-width="100px" class="m-form">
                        <el-row :gutter="10">
                            <el-col :span="8">
                                <el-form-item label="菜单编号：" prop="code">
                                    <el-input v-model="menuForm.code"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="菜单名称：" prop="name">
                                    <el-input v-model="menuForm.name"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="icon：" prop="icon">
                                    <el-input v-model="menuForm.icon"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="10">
                            <el-col :span="8">
                                <el-form-item label="地址：" prop="url">
                                    <el-input v-model="menuForm.url"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="顺序号：" prop="seqno">
                                    <el-input v-model="menuForm.seqno"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <div class="form-opres">
                            <el-button @click="submitForm('menuForm')" type="primary" class="u-btn">保存{{title}}</el-button>
                            <el-button :plain="true" @click="handleDelMenu(menuForm)" v-if="menuForm.id">删除</el-button>
                        </div>
                    </el-form>
                </div>
            </el-col>
        </el-row>

    </div>
</template>

<script>
import Api from '@/api';
const DIALOG = {
    add: { title: '添加菜单', flag: 'Add' },
    edit: { title: '编辑菜单', flag: 'Edit' }
};

export default {
    data() {
        return {
            title: DIALOG.add.title,
            flag: DIALOG.add.flag,
            loading: false,
            dataList: [],
            treeData: [],
            defaultProps: { children: 'children', label: 'name' },
            menuForm: {},
            initForm: { code: '', name: '', url: '', icon: '', seqno: '' },
            currentMenu: {},
            defaultExpanded: [],
            currentNode: ''
        }
    },
    methods: {
        getTreeData() {
            Api.menu.getTopMenus().then((res) => {
                this.treeData = res;
                if (res && res.length) {
                    if (this.currentMenu && this.currentMenu.id) {
                        let cMenu = res.find(x => x.id === this.currentMenu.id);
                        if (cMenu) {
                            this.currentNode = cMenu.id;
                            this.menuForm = cMenu;
                            this.dataList = cMenu.children;
                        }
                        // this.currentMenu = res[0];
                    } else {
                        this.currentNode = res[0].id;
                        this.menuForm = res[0];
                        this.currentMenu = res[0];
                    }
                    // this.defaultExpanded = [res[0].id];

                }
            });
        },
        handleAdd(isFirst) {
            this.flag = DIALOG.add.flag;
            this.title = DIALOG.add.title;
            this.menuForm = this.deepClone(this.initForm);

            if (!isFirst) {
                if (this.isEmptyObject(this.currentMenu)) {
                    this.$message({
                        showClose: true,
                        message: '请先选择左侧的一个菜单项！',
                        type: 'error'
                    });
                    return;
                }
                this.menuForm.parent = { id: this.currentMenu.id };
            } else {
                this.dataList = [];
            }
        },
        HandEdit(row) {
            this.flag = DIALOG.edit.flag;
            this.title = DIALOG.edit.title;
            this.menuForm = this.deepClone(row);
        },
        handleDelMenu(row) {
            this.delConfirm(row.name + '信息', () => {
                Api.menu.delMenu(row.id).then(this.callback);
            });
        },
        HandNodeclick(data, node, self) {
            this.currentMenu = data;
            this.menuForm = this.deepClone(data);
            this.flag = DIALOG.edit.flag;
            this.title = DIALOG.edit.title;
            this.dataList = this.menuForm.children;
        },
        submitForm() {
            if (this.flag === DIALOG.add.flag) {
                Api.menu.addMenus(this.menuForm).then(this.callback);
            } else {
                Api.menu.modifyMenu(this.menuForm.id, this.menuForm).then(this.callback);
            }
        },
        callback() {
            this.$message({
                showClose: true,
                message: '操作成功',
                type: 'success'
            });
            this.menuForm = {};
            this.getTreeData();
            // this.loadData();
        }
    },
    mounted() {
        this.getTreeData();
        // this.loadData();
    }
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">

</style>