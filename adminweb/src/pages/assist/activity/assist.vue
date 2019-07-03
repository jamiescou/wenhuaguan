<template>
    <div class="edit-wrapper">
        <v-pageheader :breadcrumbs="[{ to:'activity',name: '活动辅助管理' },{name:title}]"></v-pageheader>
        <div class="form-wrapper">
            <el-form ref="assistForm" :model="assistForm" :rules="rules" label-position="right" label-width="120px" class="m-form">
                <el-row :gutter="20">
                    <el-col :span="14">
                        <el-form-item label="活动名称：" prop="name">
                            <el-input v-model="assistForm.name"></el-input>
                        </el-form-item>
                        <el-form-item label="活动类型：" prop="type">
                            <el-radio-group v-model="assistForm.type">
                                <el-radio label="stageArts" value="stageArts" key="1">舞台艺术类</el-radio>
                                <el-radio label="exhibition" value="exhibition" key="2">展览艺术类</el-radio>
                            </el-radio-group>
                        </el-form-item>

                        <el-form-item label="组织机构：" prop="organizer">
                            <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 2}" v-model="assistForm.organizer"></el-input>
                        </el-form-item>
                        <el-form-item label="活动对象：" prop="actObject">
                            <el-input v-model="assistForm.actObject"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10" class='pic-col'>
                        <!-- 封面图片 -->
                        <el-form-item label-width="0" prop="coverPic">
                            <v-cropper class="cover" btnTxt="请选择活动封面图片" :imgUrl='coverPic' :upload="handleUpload" @remove="removeImg"></v-cropper>
                            <el-input v-model="assistForm.coverPic" v-show="false"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="活动时间：" required>
                    <el-col :span="11">
                        <el-form-item prop="startDate">
                            <el-date-picker v-model="assistForm.startDate" type="date" format="yyyy-MM-dd" placeholder="开始日期" :editable="false"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="2" class="line"> &sim;</el-col>
                    <el-col :span="11">
                        <el-form-item prop="endDate">
                            <el-date-picker v-model="assistForm.endDate" type="date" format="yyyy-MM-dd" placeholder="结束日期" :editable="false"></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-form-item>
                <el-form-item label="报名时间：" required>
                    <el-col :span="11">
                        <el-form-item prop="signStartTime">
                            <el-date-picker v-model="assistForm.signStartTime" type="datetime" format="yyyy-MM-dd HH:mm" placeholder="开始日期" :editable="false"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="2" class="line"> &sim;</el-col>
                    <el-col :span="11">
                        <el-form-item prop="signEndTime">
                            <el-date-picker v-model="assistForm.signEndTime" type="datetime" format="yyyy-MM-dd HH:mm" placeholder="结束日期" :editable="false"></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-form-item>
                <el-form-item label="报名详情：" prop="enrollDesc">
                    <v-richeditor v-model="assistForm.enrollDesc" ref="richEditor"></v-richeditor>
                </el-form-item>
                <el-form-item label="活动目的：" prop="purpose">
                    <v-richeditor v-model="assistForm.purpose" ref="richEditor"></v-richeditor>
                </el-form-item>
                <el-form-item label="活动内容：" prop="description">
                    <v-richeditor v-model="assistForm.description" ref="richEditor"></v-richeditor>
                </el-form-item>
                <el-form-item label="实施安排：" prop="actPlan">
                    <v-richeditor v-model="assistForm.actPlan" ref="richEditor"></v-richeditor>
                </el-form-item>
                <el-form-item label="宣传推广：" prop="actPublicity">
                    <v-richeditor v-model="assistForm.actPublicity" ref="richEditor"></v-richeditor>
                </el-form-item>
                <el-form-item label="经费预算：" prop="actBudget">
                    <v-richeditor v-model="assistForm.actBudget" ref="richEditor"></v-richeditor>
                </el-form-item>
                <el-form-item label="添加附件">
                    <el-upload ref="upload" action="/base/files" multiple :file-list="fileList" :on-change="handleChange">
                        <el-button slot="trigger" size="small" type="primary">选择文件</el-button>
                        <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
                    </el-upload>
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
const DIALOG = {
    add: { title: '新增活动', flag: 'add' },
    edit: { title: '编辑活动', flag: 'edit' }
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
            let oneDate = this.assistForm[rule.type];
            let twoDate = value;
            if (oneDate && twoDate) {
                let compareResult = true;
                if ((oneDate instanceof Date) && (twoDate instanceof Date)) {
                    oneDate = oneDate.getTime();
                    twoDate = twoDate.getTime();
                    if (rule.type === 'endDate') {
                        compareResult = oneDate >= twoDate;
                        this.$refs.assistForm.validateField(rule.type);
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
            title: DIALOG.add.title,
            flag: DIALOG.add.flag,
            id: '',
            name: '',
            options: [],
            coverPic: '',
            fileList: [],
            assistForm: {
                name: '',
                type: '',
                startDate: '',
                endDate: '',
                description: '',
                coverPic: '',
                signStartTime: '',
                signEndTime: '',
                enrollDesc: '',
                purpose: '',
                organizer: '',
                actObject: '',
                actPlan: '',
                actPublicity: '',
                actBudget: '',
                fileList: [],
                dataDeptId: '',
                isDisabled:false
            },
            rules: {
                name: [vRules.required, vRules.maxLen(40)],
                type: [vRules.requiredSelect],
                organizer: [vRules.required],
                actObject: [vRules.required],
                enrollDesc: [vRules.required],
                description: [vRules.required],
                purpose: [vRules.required],
                actPlan: [vRules.required],
                endDate: [vRules.datarequired, { validator: dateCompare, type: 'startDate', trigger: 'change' }],
                startDate: [vRules.datarequired, { validator: dateCompare, type: 'endDate', trigger: 'change' }],
            }
        }
    },
    methods: {
        handleChange(file, fileList) {
            this.fileList = fileList;
        },
        // 图片上传
        handleUpload(formData) {
            Api.system.uploadFile(formData, 'pic').then((res) => {
                this.assistForm.coverPic = res.url;
            })
        },
        // 删除图片
        removeImg() {
            this.assistForm.coverPic = '';
        },
        // 添加
        submitForm() {
            if (this.fileList.length > 0) {
                if (this.fileList.findIndex(x => x.status === 'uploading') > -1) {
                    this.showTip('文件上传中，请稍等...');
                    return;
                } else {
                    let files = this.fileList.filter(x => x.status === 'success');
                    this.assistForm.fileList = files.map(x => {
                        return {
                            filePath: x.response.url,
                            fileName: x.name
                        }
                    })
                }
            }
            let user = this.$store.getters.user;
            this.$refs['assistForm'].validate((valid) => {
                if (valid) {
                    let newForm = Object.assign({}, this.assistForm);
                    newForm.startDate = this.formatDate(newForm.startDate, 'yyyy-MM-dd');
                    newForm.endDate = this.formatDate(newForm.endDate, 'yyyy-MM-dd');
                    newForm.signStartTime = this.formatDate(newForm.signStartTime, 'yyyy-MM-dd HH:mm:ss');
                    newForm.signEndTime = this.formatDate(newForm.signEndTime, 'yyyy-MM-dd HH:mm:ss');
                    if (this.flag === DIALOG.add.flag) {
                        newForm.dataDeptId = user.unit.id;
                        newForm.unitId = user.orgUnit.id;
                        newForm.creator = this.$store.getters.AuditUser;
                        Api.assist.addAct(newForm).then(this.callback);
                    } else if (this.flag === DIALOG.edit.flag) {
                        newForm.lastModifier = this.$store.getters.AuditUser;
                        Api.assist.editAct(this.id, newForm).then(this.callback);
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
            Api.assist.getAct(this.id).then((res) => {
                if (res.startDate) {
                    res.startDate = this.convertToDate(res.startDate);
                }
                if (res.endDate) {
                    res.endDate = this.convertToDate(res.endDate);
                }
                if (res.signStartTime) {
                    res.signStartTime = this.convertToDate(res.signStartTime);
                }
                if (res.signEndTime) {
                    res.signEndTime = this.convertToDate(res.signEndTime);
                }
                if (res.fileList && res.fileList.length > 0) {
                    this.fileList = res.fileList.map(x => {
                        return {
                            name: x.fileName,
                            response: { url: x.filePath },
                            status: 'success'
                        }
                    })
                }
                this.coverPic = Api.system.getFileUrl(res.coverPic);
                this.assistForm = res;
            });
        }
    },
    mounted() {
        this.id = this.$route.query.id;
        if (this.id) {
            this.title = DIALOG.edit.title;
            this.flag = DIALOG.edit.flag;
            this.getDetail();
        }

    }
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
</style>
