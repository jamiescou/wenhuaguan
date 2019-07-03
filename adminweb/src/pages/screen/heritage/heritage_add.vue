<template>
    <div class="edit-wrapper">
        <v-pageheader :breadcrumbs="[{ to:'heritage',name: '非遗资源管理' },{name:title}]"></v-pageheader>
        <div class="form-wrapper">
            <el-form ref="digitalForm" :model="digitalForm" :rules="rules" label-position="right" label-width="100px" class="m-form">
                <el-row :gutter="20">
                    <el-form-item label="名称" prop="name">
                        <el-input v-model="digitalForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="作者" prop="author">
                        <el-input v-model="digitalForm.author"></el-input>
                    </el-form-item>
                    <!-- <el-form-item label="开放时间：" prop="openDateTime">
                         <el-date-picker v-model="digitalForm.openDateTime" type="datetime" format="yyyy-MM-dd HH:mm" placeholder="请输入开放时间" :editable="false" :picker-options="pickerOptions"></el-date-picker>
                        </el-form-item> -->
                    <!-- <el-form-item label="联系人" prop="contactPerson">
                            <el-input v-model="digitalForm.contactPerson"></el-input>
                        </el-form-item>
                        <el-form-item label="联系电话" prop="contactPhone">
                            <el-input v-model="digitalForm.contactPhone"></el-input>
                        </el-form-item> -->
                    <el-form-item label="图片" prop="file.filePath">
                        <v-cropper class="cover" btnTxt="点击选择图片" :imgUrl="coverPic" :upload="handleUpload" @remove="handleRemove"></v-cropper>

                    </el-form-item>
                </el-row>
                <el-form-item label="简介" prop="brief">
                    <el-input type="textarea" v-model="digitalForm.brief"></el-input>
                </el-form-item>
                <!-- <el-form-item label="展览详情" prop="brief">
                    <v-richeditor v-model="digitalForm.desc" ref="richEditor"></v-richeditor>
                </el-form-item> -->
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
    add: { title: '新增非遗资源', flag: 'add' },
    edit: { title: '编辑非遗资源', flag: 'edit' }
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
                type: 'heritage',
                file: { filePath: '', fileType: 'pic' }
            },
            rules: {
                name: [vRules.required],
                file: [vRules.required]
            }
        }
    },
    methods: {
        handleRemove() {
            this.digitalForm.file.filePath = '';
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
                this.digitalForm.file.filePath = res.url;
            })
        },
        // 删除图片
        removeImg() {
            this.digitalForm.file.filePath = '';
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
                this.coverPic = Api.system.getFileUrl(res.file.filePath);
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
