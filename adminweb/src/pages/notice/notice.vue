<template>
    <div class="edit-wrapper">
        <v-pageheader :breadcrumbs="[{ to:'index',name: '通知管理' },{name:title}]"></v-pageheader>
        <div class="form-wrapper">
            <el-form ref="noticeForm" :model="noticeForm" :rules="rules" label-position="right" label-width="100px" class="m-form">
                <el-form-item label="通知标题：" prop="title">
                    <el-input v-model="noticeForm.title"></el-input>
                </el-form-item>
                <el-form-item label="通知内容：" prop="content">
                    <v-richeditor v-model="noticeForm.content" ref="richEditor"></v-richeditor>
                </el-form-item>
                <el-form-item label="添加附件">
                    <v-uploadfile :upload="handleUploadFile" @remove="handleRemoveAttach" :filename="noticeForm.fileName" :acceptType="acceptType"></v-uploadfile>
                </el-form-item>
                <el-dialog title="上传进度" class="dialog" v-model="progressShow" :close-on-click-modal="false" :show-close="false" style="margin-top:10%">
                    <el-progress :text-inside="true" :stroke-width="18" :percentage="Progress"></el-progress>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="">取 消上传</el-button>
                    </span>
                </el-dialog>
                <el-form-item label="是否内部通知" prop="isAuthenticate">
                    <el-radio-group v-model="noticeForm.isInner">
                        <el-radio :label="true" :key="true" :value="true">是</el-radio>
                        <el-radio :label="false" :key="false" :value="false">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="通知对象" prop="targets" v-if="!noticeForm.isInner">
                    <div class="tree-panel">
                        <el-tree ref="personTree" :props="defaultProps" check-strictly :data="dataList" node-key="id" :render-content="renderContent" :expand-on-click-node="false" show-checkbox default-expand-all>
                        </el-tree>
                    </div>
                </el-form-item>
                <div class="form-opres">
                    <el-button @click="back" class="u-btn">返回</el-button>
                    <el-button @click="submitForm" type="primary" class="u-btn">确定</el-button>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
import Api from '@/api'
import vRules from '@/config/validate_rules';
import notice from "../../routes/modules/notice";
const DIALOG = {
    add: { title: '新增通知', flag: 'add' },
    edit: { title: '编辑通知', flag: 'edit' }
};
export default {
    data() {
        return {
            Progress: "0",
            progressShow: false,
            title: DIALOG.add.title,
            flag: DIALOG.add.flag,
            id: '',
            acceptType: 'document',
            dataList: [],
            defaultProps: { children: 'children', label: 'name' },
            noticeForm: {
                title: '',
                attach: '',
                fileName: '',
                content: '',
                unitId: '',
                targets: [],
                isInner: true
            },
            rules: {
                title: [vRules.required, vRules.maxLen(40)],
                content: [vRules.required]
            }
        }
    },
    methods: {
        // 附件上传
        handleUploadFile(req) {
            let file = req.file;
            let fileName = file.name;
            var formData = new FormData();
            formData.append('file', file);
            formData.append('filename', fileName);
            this.progressShow = true;
            return Api.system.uploadFile(formData, 'attach', this.onUploadProgress).then((res) => {
                this.noticeForm.attach = res.url;
                this.noticeForm.fileName = fileName;
            });
        },
        //上传进度显示
        onUploadProgress(value) {

            this.Progress = value;
            if (value == "100") {
                this.progressShow = false;
            }
        },
        // 删除附件
        handleRemoveAttach() {
            this.noticeForm.attach = '';
            this.noticeForm.fileName = '';
        },
        // 添加
        submitForm() {
            let user = this.$store.getters.user;
            if (!this.noticeForm.isInner) {
                let nodeids = this.$refs.personTree.getCheckedKeys();
                if (nodeids.length === 0) {
                    this.showCenterTip('请选择通知对象！', 'error');
                    return;
                }
                this.noticeForm.targets = nodeids.map(x => {
                    return {
                        unitId: x
                    }
                });
            } else {
                this.noticeForm.targets = []
                this.noticeForm.targets.push({ unitId: user.orgUnit.id })
            }
            this.$refs['noticeForm'].validate((valid) => {
                if (valid) {
                    let newForm = Object.assign({}, this.noticeForm);
                    if (this.flag === DIALOG.add.flag) {
                        newForm.creator = this.$store.getters.AuditUser;
                        newForm.unitId = user.orgUnit.id;
                        Api.notice.addSysNotice(newForm).then(this.callback);
                    } else if (this.flag === DIALOG.edit.flag) {
                        newForm.lastModifier = this.$store.getters.AuditUser;
                        Api.notice.editNotice(this.id, newForm).then(this.callback);
                    }
                }
            })
        },
        callback() {
            this.showTip();
            this.back();
        },
        back() {
            this.$router.go(-1);
        },
        getDetail() {
            Api.notice.getNotice(this.id).then((res) => {
                if (res.isInner === false) {
                    let unitIds = res.targets.map(x => x.unitId);
                    this.$refs.personTree.setCheckedKeys(unitIds);
                } else if (res.isInner === null) {
                    res.isInner = true
                }
                this.noticeForm = res;
            });
        },
        // 获取机构数据
        getTreedatas() {
            let user = this.$store.getters.user;
            let id = user.roles === null ? 'root' : user.orgUnit.id;
            // 获取第一个目录的信息
            Api.system.getUnitInfo(id).then((res) => {
                this.getChildrenOrg(res);
                this.dataList = [res];
            });
        },
        // 递归获取下级机构
        getChildrenOrg(parent) {
            parent.children = [];
            return Api.system.getUnitChildrenForOrg(parent.id).then(orgs => {
                if (orgs && orgs.length) {
                    orgs.forEach(element => {
                        element.children = this.getChildrenOrg(element);
                    });
                } else {
                    // 递归完成了？
                    if (this.id) {
                        this.getDetail();
                    }
                }
                orgs = orgs || [];
                parent.children = orgs;
                return parent;
            });
            // }
        },
        // 节点渲染
        renderContent(h, { node, data, store }) {
            let nodeLabel = node.label;
            let icon = 'sz-ico ico-org';
            return h('div', { class: 'u-tree-node' }, [
                h('i', { class: icon }),
                h('span', nodeLabel)
            ]);
        }
    },
    created() {
        this.getTreedatas();
    },
    mounted() {
        this.id = this.$route.query.id;
        if (this.id) {
            this.title = DIALOG.edit.title;
            this.flag = DIALOG.edit.flag;
            // this.getDetail();
        }
    }
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
</style>
