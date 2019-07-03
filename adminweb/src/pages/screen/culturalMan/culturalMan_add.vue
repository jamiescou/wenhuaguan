<template>
    <div class="edit-wrapper">
        <v-pageheader :breadcrumbs="[{ to:'culturalMan',name: '文化名人管理' },{name:title}]"></v-pageheader>
        <div class="form-wrapper">
            <el-form ref="digitalForm" :model="digitalForm" :rules="rules" label-position="right" label-width="100px" class="m-form">
                <el-row :gutter="20">
                    <el-form-item label="名称" prop="name">
                        <el-input v-model="digitalForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="图片" prop="coverPic">
                        <v-cropper class="cover" btnTxt="点击选择图片" :imgUrl="coverPic" :upload="handleUpload" @remove="handleRemove"></v-cropper>

                    </el-form-item>
                </el-row>
                <el-form-item label="简介" prop="brief">
                    <el-input type="textarea" v-model="digitalForm.brief"></el-input>
                </el-form-item>
                <el-form-item label="视频介绍：" prop="file">
                    <v-uploadfileqt :upload="handleUploadFile" @remove="handleRemoveAttach" :filename="digitalForm.file.fileName" :acceptType="acceptType" ref="uploadfile" @cancelfunction="cancelfunctioncanback"></v-uploadfileqt>
                    <el-input v-model="digitalForm.file.filePath" v-show="false"></el-input>
                </el-form-item>
                <div class="form-opres">
                    <el-button @click="back" class="u-btn">返回</el-button>
                    <el-button @click="submitForm" type="primary" class="u-btn">确定</el-button>
                </div>
            </el-form>
        </div>
        <el-dialog title="上传进度" class="dialog" v-model="progressShow" :close-on-click-modal="false" :show-close="false" style="margin-top:10%;">
            <el-progress :text-inside="true" :stroke-width="18" :percentage="Progress"></el-progress>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelfunctioncanback">取 消上传</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import Api from '@/api'
import axios from 'axios'
import vRules from '@/config/validate_rules';
const DIALOG = {
    add: { title: '新增文化名人', flag: 'add' },
    edit: { title: '编辑文化名人', flag: 'edit' }
};
export default {
    data() {
        return {
            title: DIALOG.add.title,
            flag: DIALOG.add.flag,
            coverPic: '',
            id: '',
            digitalForm: {
                name: '',
                brief: '',
                type: 'culturalMan',
                file: { filePath: '', fileType: 'video' }
            },
            progressShow: false,
            Progress: 0,
            acceptType: 'video',
            rules: {
                name: [vRules.required] 
            }
        }
    },
    methods: {
        handleRemove() {
            this.digitalForm.coverPic = '';
        },
        /**
        * 上传Logo图片
        */
        handleLogoUpload(req) {
            let file = req.file;
            var formData = new FormData();
            formData.append('file', file);
            formData.append('filename', file.name)
            return Api.system.uploadFile(formData, 'pic').then((res) => {
                this.digitalForm.coverPic = res.url;
            });
        },
        // 上传图片
        handleUpload(formData) {
            Api.system.uploadFile(formData, 'pic').then((res) => {
                this.digitalForm.coverPic = res.url;
            })
        },
        // 删除图片
        removeImg() {
            this.digitalForm.coverPic = '';
        },
        //取消上传
        cancelfunctioncanback() {
            this.source.cancel('取消上传')
            this.progressShow = false;
            this.$refs.uploadfile.handleRemove();
            this.$refs.Progress = 0;
            this.handleRemoveAttach();
            this.$refs.fileList = [];
        },
        // 附件上传
        handleUploadFile(req) {
            let file = req.file;
            let fileName = file.name;
            let fileSize = (file.size / 1024 / 1024).toFixed(2) + 'M';
            var formData = new FormData();
            formData.append('file', file);
            formData.append('filename', fileName);
            this.progressShow = true;
            this.source = axios.CancelToken.source();
            return Api.system.uploadFile(formData, 'attach', this.onUploadProgress, this.source.token).then((res) => {
                this.digitalForm.file.filePath = res.url;
                this.digitalForm.file.fileName = fileName;
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
            this.digitalForm.file.filePath = '';
            this.digitalForm.file.fileName = '';
        },
        submitForm() {
            this.$refs['digitalForm'].validate((valid) => {
                if (valid) {
                    let newForm = Object.assign({}, this.digitalForm);
                    if (this.flag === DIALOG.add.flag) {
                        newForm.unitId = this.$store.getters.user.orgUnit.id;
                        newForm.dataDeptId = this.$store.getters.user.unit.id;
                        Api.screen.addScreen(newForm).then(this.callback);
                    } else if (this.flag === DIALOG.edit.flag) {
                        Api.screen.editScreen(this.id, newForm).then(this.callback);
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
            Api.screen.getScreen(this.id).then((res) => {
                this.digitalForm = res;
                this.coverPic = Api.system.getFileUrl(res.coverPic);
            });
        }
    },
    mounted() {
        this.flag = this.$route.query.flag;
        if (this.flag === 'edit') {
            this.title = DIALOG.edit.title;
            this.flag = DIALOG.edit.flag;
            this.id = this.$route.query.id;
            this.getDetail();
        }
    }
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
</style>
