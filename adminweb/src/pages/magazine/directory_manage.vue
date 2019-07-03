<template>
    <div class="orgManage">
        <v-pageheader :breadcrumbs="[{ name: '资源文件管理' }]"></v-pageheader>
        <el-row type="flex" justify="center" :gutter="20">
            <el-col :span="6" class="tree-wrapper">
                <div class="tree-heading">
                    <div class="v-line"></div>
                    <h5 class="u-title">文件目录</h5>
                    <div class="tree-opers">
                        <el-button size="small" @click="handleEdit('managerForm')" type="primary" icon="edit" title="编辑目录"></el-button>
                        <el-button size="small" @click="handleDel" type="primary" icon="delete" title="删除目录"></el-button>
                        <el-button size="small" @click="directAdd" type="primary" icon="plus" title="添加目录"></el-button>
                    </div>
                </div>
                <div class="tree-panel">
                    <el-tree ref="treeForm" :render-content="renderContent" :data="data" :props="props1" :load="loadNode1" lazy node-key="id" @node-click="handleNodeClick" highlight-current></el-tree>
                </div>
            </el-col>
            <el-col :span="18">
                <div class="table-container">
                    <div class="tree-heading">
                        <div class="v-line"></div>
                        <h5 class="u-title">文件列表</h5>
                        <div class="tree-opers">
                            <el-button @click="handAddFile" type="primary" icon="plus">新增文件</el-button>
                        </div>
                    </div>
                    <el-table :data="dataList" border stripe v-loading.body="loading" tooltip-effect="custom-effect">
                        <el-table-column label=" " type="index" width="70" align="center"></el-table-column>
                        <el-table-column label="文件名" width="400">

                            <template scope="scope">
                                <div @click="downLoadAttach(scope.row.filename,scope.row.fileAddress)" class="download-file">
                                    <i class="sz-ico ico-download"></i>
                                    <span class="attach-name">{{scope.row.filename}}</span>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="size" label="文件大小(M)"></el-table-column>
                        <el-table-column prop="directory.name" label="文件目录"></el-table-column>
                        <el-table-column label="操作" width="300px" align="center">
                            <template scope="scope">
                                <a class="btn-act" @click="editFile(scope.row)">重命名</a>
                                <a class="btn-act" @click="replace(scope.row)">换目录</a>
                                <a class="btn-act" @click="deleteFile(scope.row)">删除</a>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="pagination-container">
                        <v-pagination @pageChange="onCurrentChange" :total="total" :isShow="showPagination"></v-pagination>
                    </div>
                </div>
                <!-- </div> -->
            </el-col>
        </el-row>
        <!-- 添加及编辑目录 -->
        <el-dialog :title="title" v-model="managerDialog" :close-on-click-modal='false'>
            <div>
                <el-form ref="managerForm" :model="managerForm" :rules="managerRules" class="m-form" label-position="right" label-width="120px">
                    <el-form-item label="目录名称：" prop="name">
                        <el-input v-model="managerForm.name"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div class="dialog-footer">
                <el-button @click="managerDialog=false">取消</el-button>
                <el-button type="primary" @click="submitManagerForm('managerForm')">保存</el-button>
            </div>
        </el-dialog>

        <!-- 添加文件 -->
        <el-dialog :title="fileTitle" v-model="fileDialog" :close-on-click-modal='false'>
            <div>
                <el-form ref="fileForm" :model="fileForm" :rules="fileRules" class="m-form" label-position="right" label-width="120px">
                    <el-form-item label="资源文件：" prop="filename">
                        <v-uploadfile :upload="handleUploadFile" @remove="handleRemoveAttach" :filename="fileForm.filename" :acceptType="acceptType"  ref="uploadfile" @cancelfunction="cancelfunctioncanback"></v-uploadfile>
                    </el-form-item>                    
                </el-form>
            </div>
            <div class="dialog-footer">
                <el-button @click="fileDialog=false">取消</el-button>
                <el-button type="primary" @click="submitFileForm('fileForm')">保存</el-button>
            </div>
        </el-dialog>

        <!-- 文件重命名 -->
        <el-dialog :title="fileTitle" v-model="renameDialog" :close-on-click-modal='false'>
            <div>
                <el-form ref="nameForm" :model="nameForm" :rules="renameRules" class="m-form" label-position="right" label-width="120px">
                    <el-form-item label="资源文件名称：" prop="filename">
                        <el-input v-model="nameForm.filename"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div class="dialog-footer">
                <el-button @click="renameDialog=false">取消</el-button>
                <el-button type="primary" @click="submitFileForm('nameForm')">保存</el-button>
            </div>
        </el-dialog>
        <el-dialog title="换目录" v-model="replaceShow" :close-on-click-modal='false'>
            <div class="tree-panel">
                <el-tree ref="replaceForm" :render-content="renderContent" :data="replaceData" :props="props1" :load="loadNode1" lazy node-key="id" @node-click="replaceNodeClick" highlight-current></el-tree>
            </div>
            <div class="dialog-footer">
                <el-button @click="replaceShow=false">取消</el-button>
                <el-button type="primary" @click="submitChange()">保存</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import Api from '@/api';
import axios from 'axios';
import vRules from '@/config/validate_rules';
import BaseTable from '@/mixins/base-table';

const DIALOG = {
    add: { title: '添加目录', flag: 'Add' },
    edit: { title: '编辑目录', flag: 'Edit' },
    fileadd: { title: '添加文件', flag: 'Add' },
    fileedit: { title: '编辑文件', flag: 'Edit' },
    nameEdit: { title: '重命名', flag: 'Edit' }
};

export default {
    mixins: [BaseTable],
    data() {
        return {
             source: null,    
            managerDialog: false,
            title: DIALOG.add.title,
            replaceShow: false,
            fileDialog: false,
            renameDialog: false,
            acceptType: 'document',
            fileFlag: '',
            replaceData: [],
            fileForm: {},
            fileTitle: DIALOG.fileadd.title,
            dataList: [],
            flag: '',
            managerForm: {},
            nameForm: {},
            data: [],
            selectNode: {},
            replaceNode: {},
            currentNode: {},
            managerRules: {
                name: [vRules.required]
            },
            fileRules: { filename: [vRules.required,vRules.maxLen(40)] },
            renameRules: { filename: [vRules.required,vRules.maxLen(40)] },
            props1: {
                label: 'name',
                children: 'zones',
                isLeaf: 'isLeaf'
            }
        }
    },
    computed: {

    },
    methods: {
        // 树形结构数据
        loadNode1(node, resolve) {
            let str = '';
            let user = this.$store.getters.user;
            str += 'unitId:' + user.orgUnit.id;
            if (node.level === 0) {
                Api.magazine.getMagazineDirectList(str + ',parent:null', 1, -1).then((res) => {
                    return resolve(res.content);
                });
            } else {
                Api.magazine.getMagazineDirectList(str + ',parent:' + node.key, 1, -1).then((res) => {
                    return resolve(res.content);
                });
            }
        },
        // 选择目录节点
        handleNodeClick(data) {
            this.selectNode = Object.assign({}, data);
            this.loadFiles(this.selectNode.id);
        },
        // 选择替换目录
        replaceNodeClick(data) {
            this.replaceNode = Object.assign({}, data);
        },
        // 添加目录节点
        directAdd() {
            if (this.selectNode === null || this.selectNode.id === undefined) {
                this.showTip('请先选择目录节点', 'warning');
                return;
            }
            this.managerForm = {};
            this.title = DIALOG.add.title;
            this.flag = DIALOG.add.flag;
            this.managerDialog = true;
        },
        callBack() {
            Api.magazine.getMagazineDirectList('parent:null', 1, -1).then((res) => {
                this.data = res.content;
            });
        },
        // 保存目录节点
        submitManagerForm(formName) {
            let unitId = this.$store.getters.user.orgUnit.id;
            this.managerForm.unitId = unitId;

            this.$refs[formName].validate((valid) => {
                if (valid) {
                    // 添加
                    if (this.flag === DIALOG.add.flag) {
                        let parentId = this.selectNode.id;
                        this.managerForm.parent = { id: parentId };
                        Api.magazine.addMagazineDirect(this.managerForm).then((res) => {
                            this.managerDialog = false;
                            this.callBack();
                        });
                    } else if (this.flag === DIALOG.edit.flag) { // 编辑
                        Api.magazine.modifyMagazineDirect(this.managerForm.id, this.managerForm).then((res) => {
                            this.managerDialog = false;
                            this.callBack();
                        });
                    }
                }
            });
        },
        // 编辑目录
        handleEdit(formName) {
            this.managerForm = this.selectNode;
            this.managerDialog = true;
            this.title = DIALOG.edit.title;
            this.flag = DIALOG.edit.flag;
        },
        // 删除目录
        handleDel() {
            let self = this;
            self.delConfirm('目录', () => {
                Api.magazine.delMagazineDirect(this.selectNode.id).then(() => {
                    this.callBack();
                });
            });
        },
         //取消上传
            cancelfunctioncanback(){
                this.source.cancel('取消上传')
                this.$refs.uploadfile.progressShow=false;
                this.$refs.uploadfile.handleRemove();        
                this.$refs.Progress=0;
                this.handleRemoveAttach();        
                this.$refs.fileList=[];
                this.btnload = false;
            }, 
        // 附件上传
        handleUploadFile(req) {
            let file = req.file;
            let fileName = file.name;
            let fileSize = (file.size / 1024 / 1024).toFixed(2) + 'M';
            var formData = new FormData();
            formData.append('file', file);
            formData.append('filename', fileName);
            this.$refs.uploadfile.progressShow=true;
            this.source = axios.CancelToken.source(); 
             return Api.system.uploadFile(formData, 'attach',this.onUploadProgress,this.source.token).then((res) => {
                this.fileForm.fileAddress = res.url;
                this.fileForm.filename = fileName;
                this.fileForm.size = parseFloat(fileSize);
            });
        },
          //上传进度显示
            onUploadProgress(value)
            {              
                    this.$refs.uploadfile.Progress=value;
                    if(value=="100")
                    {
                            this.$refs.uploadfile.progressShow=false;
                    }
            },
        // 删除附件
        handleRemoveAttach() {
            this.fileForm.fileAddress = '';
            this.fileForm.filename = '';
            this.fileForm.size = '';
        },
        // 加载文件列表
        loadFiles(id) {
            this.showLoading();
            let str = 'directory.id:' + id;
            Api.magazine.getMagazineFiles(id, str, this.page, this.size).then((res) => {
                this.dataList = res.content;
                this.total = res.totalElements;
            }).finally(this.closeLoading)
        },
        // 新增文件
        handAddFile() {
            this.fileTitle = DIALOG.fileadd.title;
            this.fileFlag = DIALOG.fileadd.flag;
            this.fileForm.fileAddress = '';
            this.fileForm.filename = '';
            this.fileForm.size = '';
            this.fileDialog = true;
        },
        // 保存文件
        submitFileForm(formName) {
            if (this.selectNode === null || this.selectNode.id === undefined) {
                this.showTip('请先选择目录节点', 'warning');
                return;
            }
            let parentId = this.selectNode.id;
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    // 添加
                    if (this.fileFlag === DIALOG.fileadd.flag) {
                        this.fileForm.directory = { id: parentId };
                        Api.magazine.addMagazineFile(parentId, this.fileForm).then(() => {
                            this.loadFiles(parentId);
                            this.fileDialog = false;
                        })
                    } else if (this.fileFlag === DIALOG.fileedit.flag) { // 编辑
                        Api.magazine.modifyMagazineFiles(parentId, this.nameForm.id, this.nameForm).then(() => {
                            this.loadFiles(parentId);
                            this.renameDialog = false;
                        })
                    }
                }
            });
        },
        // 删除文件
        deleteFile(row) {
            let self = this;
            self.delConfirm('文件', () => {
                Api.magazine.delMagazineFile(row.directory.id, row.id).then(() => {
                    this.loadFiles(row.directory.id);
                });
            });
        },
        // 编辑
        editFile(row) {
            this.fileTitle = DIALOG.nameEdit.title;
            this.fileFlag = DIALOG.nameEdit.flag;
            this.renameDialog = true;
            this.nameForm = Object.assign({}, row);
        },
        // 替换目录
        replace(row) {
            this.replaceShow = true;
            this.currentNode = Object.assign({}, row);
        },
        // 替换目录
        submitChange() {
            if (this.replaceNode === null || this.replaceNode.id === undefined) {
                this.showTip('请先选择目录节点', 'warning');
                return;
            }
            let directId = this.replaceNode.id;
            this.currentNode.directory.id = directId;
            Api.magazine.modifyMagazineFiles(directId, this.currentNode.id, this.currentNode).then(() => {
                this.callBack();
                this.dataList = [];
                this.replaceShow = false;
            })
        },
        // 节点渲染
        renderContent(h, { node, data, store }) {
            let nodeLabel = data.name;

            let icon = data.isLeaf ? 'el-icon-document' : 'el-icon-message';
            return h('div', { class: 'u-tree-node' }, [
                h('i', { class: icon }),
                h('span', nodeLabel)
            ]);
        },
        // 下载附件
        downLoadAttach(filename, address) {
            let fileUrl = Api.system.getFileUrl(address);
            this.downloadFile(filename, fileUrl);
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
