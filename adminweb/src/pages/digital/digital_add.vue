<template>
    <div class="edit-wrapper">
        <v-pageheader :breadcrumbs="[{ to:'index',name: '数字展览管理' },{name:title}]"></v-pageheader>
        <div class="form-wrapper">
            <el-form ref="digitalForm" :model="digitalForm" :rules="rules" label-position="right" label-width="100px" class="m-form">
                <el-row :gutter="20">
                    <el-form-item label="展览名称" prop="title">
                        <el-input v-model="digitalForm.title"></el-input>
                    </el-form-item>
                    <el-form-item label="展览类型" prop="type">
                        <el-select v-model="digitalForm.type" placeholder="请选择类型">
                            <v-option typeName="exhibition"></v-option>
                        </el-select>
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
                    <el-form-item label="展览图片" prop="coverPic">
                        <v-cropper class="cover" btnTxt="点击选择展品图片" :imgUrl="coverPic" :upload="handleUpload" @remove="handleRemove"></v-cropper>      
                                       
                    </el-form-item>
                </el-row>
                <el-form-item label="展览简介" prop="brief">
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
    add: { title: '新增数字展览', flag: 'add' },
    edit: { title: '编辑数字展览', flag: 'edit' }
};
export default {
    data() {
        return {
            title: DIALOG.add.title,
            flag: DIALOG.add.flag,
            coverPic: '',
            id: '',
            cultData: [],
            options: [],
            users: [],
            digitalForm: {
                brief: '',
                type: '',
                coverPic:""
            },
            rules: {
                title: [vRules.required,vRules.maxLen(40)],
                contactPhone: vRules.mobilePhone,
                openDateTime: [vRules.required],
                contactPerson: [vRules.required],
                coverPic: [vRules.required],
                type: [vRules.requiredSelect],
                brief: [vRules.required]
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
        submitForm() {
            this.$refs['digitalForm'].validate((valid) => {
                if (valid) {
                    let newForm = Object.assign({}, this.digitalForm);
                    if (this.flag === DIALOG.add.flag) {
                        newForm.unitId = this.$store.getters.user.orgUnit.id;
                        newForm.dataDeptId = this.$store.getters.user.unit.id;
                        Api.digital.addDigital(newForm).then(this.callback);
                    } else if (this.flag === DIALOG.edit.flag) {
                        Api.digital.editDigital(this.id, newForm).then(this.callback);
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
            Api.digital.getDigital(this.id).then((res) => {
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
