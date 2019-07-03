<template>
    <div class="edit-wrapper">
        <v-pageheader :breadcrumbs="[{ to:'index',name: '数字展览管理' },{name:title}]"></v-pageheader>
        <div class="form-wrapper">
            <el-form ref="exhibitForm" :model="exhibitForm" :rules="rules" label-position="right" label-width="100px" class="m-form">
                <el-row :gutter="20">
                    <el-form-item label="展品名称" prop="title">
                        <el-input v-model="exhibitForm.title"></el-input>
                    </el-form-item>
                    <!-- <el-form-item label="展品类型" prop="type">
                            <el-select v-model="exhibitForm.type" placeholder="请选择类型">
                                <v-option typeName="worksType"></v-option>
                            </el-select>
                        </el-form-item> -->

                    <el-form-item label="封面图片" prop="coverPic">
                        <v-uploadimg class="cover" :imgUrl="coverPic" :upload="handleLogoUpload"  @remove="handleRemove"></v-uploadimg>                       
                    </el-form-item>
                    <el-form-item label="顺序号" prop="seqno">
                        <el-input v-model="exhibitForm.seqno"></el-input>
                    </el-form-item>
                    <el-form-item label="展品简介" prop="brief" style="margin-top:20px;">
                        <!--<v-richeditor v-model="exhibitForm.brief" ref="richEditor"></v-richeditor>-->
                            <el-input type="textarea" v-model="exhibitForm.brief"></el-input>
                    </el-form-item>
                </el-row>
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
    add: { title: '新增数字展览展品', flag: 'add' },
    edit: { title: '编辑数字展览展品', flag: 'edit' }
};
export default {
    data() {
        return {
            title: DIALOG.add.title,
            flag: DIALOG.add.flag,
            coverPic: '',
            id: '',
            mid: '',
            options: [],
            users: [],
            exhibitForm: {
                brief: '',
                coverPic: '',
                title: ''
            },
            rules: {
                title: [vRules.required,vRules.maxLen(40)],
                coverPic: [vRules.required],
                seqno: [vRules.required, vRules.numberFloat],
                //   type: [vRules.requiredSelect],
                brief: [vRules.required]
            }
        }
    },
    methods: {
         handleRemove() {
            this.exhibitForm.coverPic = '';            
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
                this.exhibitForm.coverPic = res.url;
            });
        },
        // 上传图片
        handleUpload(formData) {
            Api.system.uploadFile(formData, 'pic').then((res) => {
                this.exhibitForm.coverPic = res.url;
            })
        },
        // 删除图片
        removeImg() {
            this.exhibitForm.coverPic = '';
        },

        submitForm() {
            this.$refs['exhibitForm'].validate((valid) => {
                if (valid) {
                    let newForm = Object.assign({}, this.exhibitForm);
                    if (this.flag === DIALOG.add.flag) {
                        Api.digital.addExhibits(this.mid, newForm).then(this.callback);
                    } else if (this.flag === DIALOG.edit.flag) {
                        Api.digital.editExhibits(this.mid, this.id, newForm).then(this.callback);
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
            Api.digital.getExhibits(this.mid, this.id).then((res) => {
                this.exhibitForm = res;
                this.coverPic = Api.system.getFileUrl(res.coverPic);
            });
        }
    },
    mounted() {
        this.flag = this.$route.query.flag;
        this.mid = this.$route.query.mid;

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
