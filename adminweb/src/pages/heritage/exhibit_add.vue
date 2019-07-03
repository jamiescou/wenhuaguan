<template>
    <div class="edit-wrapper">
        <v-pageheader :breadcrumbs="[{ to:'index',name: '展厅管理' },{name:title}]"></v-pageheader>
        <div class="form-wrapper">
            <el-form ref="heritageForm" :model="heritageForm" :rules="rules" label-position="right" label-width="120px" class="m-form">
                <el-form-item label="展厅名称：" prop="title">
                    <el-input v-model="heritageForm.title" placeholder="展厅名称"></el-input>
                </el-form-item>
                <el-form-item label="封面图片：" prop="coverPic">
                    <v-cropper class="cover" :imgUrl="coverPic" btnTxt="点击选择封面" :upload="handleUpload" @remove="removeImg"></v-cropper>
                </el-form-item>

                <el-form-item label="地址：" prop="address">
                    <el-input v-model="heritageForm.address" placeholder="地址"></el-input>
                </el-form-item>

                <el-form-item label="电话：" prop="phone">
                    <el-input v-model="heritageForm.phone" placeholder="电话"></el-input>
                </el-form-item>

                <el-form-item label="联系人：" prop="contact">
                    <el-input v-model="heritageForm.contact" placeholder="联系人"></el-input>
                </el-form-item>

                <el-form-item label="简介：" prop="brief">
                    <el-input type="textarea" v-model="heritageForm.brief"></el-input>
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
import Api from '@/api';
import vRules from '@/config/validate_rules';
const DIALOG = {
    add: { title: '添加展厅', flag: 'Add' },
    edit: { title: '编辑展厅', flag: 'Edit' }
};
export default {
    data() {
        return {
            title: DIALOG.add.title,
            flag: DIALOG.add.flag,
            coverPic: '',
            options: [],
            heritageForm: {
                title: '',
                address: '',
                phone: '',
                contact: '',
                coverPic: '',
                brief: ''
            },
            rules: {
                'title': [vRules.required,vRules.maxLen(40)],
                'coverPic': [vRules.required]
            }
        }
    },
    methods: {
        back() {
            this.$router.go(-1);
        },
        callback() {
            this.showTip();
            this.back();
        },
        submitForm() {
            this.$refs['heritageForm'].validate((valid) => {
                if (valid) {
                    if (this.flag === DIALOG.add.flag) {
                        this.heritageForm.unitId = this.$store.getters.user.orgUnit.id;
                        this.heritageForm.dataDeptId = this.$store.getters.user.unit.id;
                        Api.heritage.addExhibit(this.heritageForm).then(this.callback);
                    } else if (this.flag === DIALOG.edit.flag) {
                        let id = this.heritageForm.id;
                        Api.heritage.modifyExhibit(id, this.heritageForm).then(this.callback);
                    }
                }
            });
        },
        /**
         * 上传封面图
         */
        handleUpload(formData) {
            Api.system.uploadFile(formData, 'pic').then((res) => {
                this.heritageForm.coverPic = res.url;
            })
        },
        // 删除图片
        removeImg() {
            this.heritageForm.coverPic = '';
        },
        // 获得详情
        getDetail() {
            Api.heritage.getExhibit(this.id).then((info) => {
                this.coverPic = Api.system.getFileUrl(info.coverPic);
                this.heritageForm = info;
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
