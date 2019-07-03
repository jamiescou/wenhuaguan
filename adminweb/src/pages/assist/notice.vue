<template>
    <div class="edit-wrapper">
        <v-pageheader :breadcrumbs="[{ to:'index',name: '通知管理' },{name:title}]"></v-pageheader>
        <div class="form-wrapper">
            <el-form ref="noticeForm" :model="noticeForm" :rules="rules" label-position="right" label-width="100px" class="m-form">
                <el-form-item label="通知标题：" prop="title">
                    <el-input v-model="noticeForm.title"></el-input>
                </el-form-item>
                <el-form-item label="时间周期：" required>
                    <el-col :span="10">
                        <el-form-item prop="startDate">
                            <el-date-picker v-model="noticeForm.startDate" type="date" format="yyyy-MM-dd" placeholder="开始日期" :editable="false"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4" class="line"> &sim;</el-col>
                    <el-col :span="10">
                        <el-form-item prop="endDate">
                            <el-date-picker v-model="noticeForm.endDate" type="date" format="yyyy-MM-dd" placeholder="结束日期" :editable="false"></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-form-item>
                <el-form-item label="通知内容：" prop="content">
                    <v-richeditor v-model="noticeForm.content" ref="richEditor"></v-richeditor>
                </el-form-item>
                <el-form-item label="添加附件">
                    <v-uploadfile :upload="handleUploadFile" @remove="handleRemoveAttach" :filename="noticeForm.fileName" :acceptType="acceptType" ref="uploadfile" @cancelfunction="cancelfunctioncanback"></v-uploadfile>
                </el-form-item>
                <el-form-item label="通知对象" required prop="persons">
                    <div class="tree-panel">
                        <el-tree ref="personTree" :props="defaultProps" :data="personsData" node-key="uniqueId" :render-content="renderContent" :expand-on-click-node="false" show-checkbox default-expand-all>
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
import axios from 'axios';
import vRules from '@/config/validate_rules';
const DIALOG = {
    add: { title: '新增通知', flag: 'add' },
    edit: { title: '编辑通知', flag: 'edit' }
};
export default {
    data() {
            /**
         * 日期比较
         *  只比较日期，不比较时间
         * @param {any} rule 规则定义
         * @param {any} value 值
         * @param {any} callback 回调函数
         */
        const dateCompare = (rule, value, callback) => {
            let oneDate = this.noticeForm[rule.type];
            let twoDate = value;
            if (oneDate && twoDate) {
                let compareResult = true;
                if ((oneDate instanceof Date) && (twoDate instanceof Date)) {
                    oneDate = oneDate.getTime();
                    twoDate = twoDate.getTime();
                    if (rule.type === 'endDate') {
                        compareResult = oneDate >= twoDate;
                        this.$refs.noticeForm.validateField(rule.type);
                    } else {
                        compareResult = oneDate <= twoDate;
                    }
                }
                if (!compareResult) {
                    return callback(new Error('报名开始日期不能大于报名结束日期'));
                }
            }
            callback();
        };
        return {
            source: null,
            title: DIALOG.add.title,
            flag: DIALOG.add.flag,
            id: '',
            acceptType: 'document',
            personsData: [],
            defaultProps: { children: 'children', label: 'name' },
            noticeForm: {
                title: '',
                startDate: '',
                endDate: '',
                attach: '',
                fileName: '',
                content: '',
                persons: []
            },
            rules: {
                title: [vRules.required,vRules.maxLen(40)],
                startDate:[vRules.datarequired, { validator: dateCompare, type: 'endDate', trigger: 'change' }],
                endDate: [vRules.datarequired, { validator: dateCompare, type: 'startDate', trigger: 'change' }],
                content: [vRules.required],
                persons: [vRules.requiredCbx]
            }
        }
    },
    methods: {
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
            var formData = new FormData();
            formData.append('file', file);
            formData.append('filename', fileName);
            this.$refs.uploadfile.progressShow=true;
            this.source = axios.CancelToken.source();
            return Api.system.uploadFile(formData, 'attach',this.onUploadProgress,this.source.token).then((res) => {
                this.noticeForm.attach = res.url;
                this.noticeForm.fileName = fileName;
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
            this.noticeForm.fileAddress = '';
            this.noticeForm.fileName = '';
        },
        // 添加
        submitForm() {
            let user = this.$store.getters.user;
            let nodeids = this.$refs.personTree.getCheckedNodes();
            this.noticeForm.persons = nodeids.filter(x => x.oprType === 'person');

            this.$refs['noticeForm'].validate((valid) => {
                if (valid) {
                    let newForm = Object.assign({}, this.noticeForm);
                    newForm.startDate = this.formatDate(newForm.startDate, 'yyyy-MM-dd');
                    newForm.endDate = this.formatDate(newForm.endDate, 'yyyy-MM-dd');

                    let noticePersons = newForm.persons.map((x) => {
                        return {
                            managerId: x.id,
                            managerName: x.name,
                            unitName: x.orgUnit.name,
                            depName: x.unit.name,
                            hasRead: !!x.hasRead
                        }
                    });
                    newForm.persons = noticePersons;
                    if (this.flag === DIALOG.add.flag) {
                        newForm.creator = this.$store.getters.AuditUser;
                        newForm.dataDeptId = user.unit.id;
                        Api.assist.addNotice(newForm).then(this.callback);
                    } else if (this.flag === DIALOG.edit.flag) {
                        newForm.lastModifier = this.$store.getters.AuditUser;
                        Api.assist.editNotice(this.id, newForm).then(this.callback);
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
            Api.assist.getNotice(this.id).then((res) => {
                res.startDate = this.convertToDate(res.startDate);
                res.endDate = this.convertToDate(res.endDate);
                this.noticeForm = res;

                if (res.persons && res.persons.length) {
                    let ids = res.persons.map((x) => {
                        return 'person_' + x.managerId;
                    })
                    this.$refs.personTree.setCheckedKeys(ids);
                }
            });
        },
        // 获取机构数据
        getTreedatas() {
            let user = this.$store.getters.user;
            let id = user.roles === null ? 'root' : user.orgUnit.id;
            // 获取第一个目录的信息
            Api.system.getUnitInfo(id).then((res) => {
                res.oprType = 'org';
                res.uniqueId = 'org_' + res.id;
                this.getChildrenOrg(res);
                this.personsData = [res];
            });
        },
        // 递归获取下级机构和人员
        getChildrenOrg(parent) {
            // if (parent.hasOrgChildren) {
            parent.children = [];

            return Api.system.getUnitOrgAndPerson(parent.id).then(([orgs, managers]) => {
                if (orgs && orgs.length) {
                    orgs = orgs.map((x) => {
                        x.oprType = 'org';
                        x.uniqueId = 'org_' + x.id;
                        return x;
                    })
                    orgs.forEach(element => {
                        element.children = this.getChildrenOrg(element);
                    });
                } else {
                    // 递归完成了？
                    if (this.id) {
                        this.getDetail();
                    }
                }

                let accounts = managers.content;
                if (accounts && accounts.length) {
                    accounts = accounts.map((x) => {
                        x.oprType = 'person';
                        x.uniqueId = 'person_' + x.id;
                        return x;
                    })
                }
                orgs = orgs || [];
                parent.children = orgs.concat(accounts);
                return parent;
            });
            // }
        },
        // 节点渲染
        renderContent(h, { node, data, store }) {
            let nodeLabel = node.label;
            if (data.oprType === 'person') {
                nodeLabel += ' (' + data.unit.name + ')';
            }

            let icon = data.oprType === 'org' ? 'sz-ico ico-org' : 'sz-ico ico-manager';
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
