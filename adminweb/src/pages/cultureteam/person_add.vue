<template>
    <div class="edit-wrapper">
        <v-pageheader :breadcrumbs="[{ to:'index',name:'文化团队管理'},{name:'团队人员管理'},{name:title}]"></v-pageheader>
        <div class="form-wrapper">
            <el-form ref="cultureteamForm" :model="cultureteamForm" :rules="rules" label-position="right" label-width="100px" class="m-form">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="名称：" prop="name">
                            <el-input v-model="cultureteamForm.name"></el-input>
                        </el-form-item>
                        <el-form-item label="联系电话：" prop="contactPhone">
                            <el-input v-model="cultureteamForm.contactPhone"></el-input>
                        </el-form-item>
                        <el-form-item label="职责：" prop="duty">
                            <el-input v-model="cultureteamForm.duty"></el-input>
                        </el-form-item>
                        <el-form-item label="加入时间：" prop="joinDate">
                            <el-date-picker v-model="cultureteamForm.joinDate" type="datetime" format="yyyy-MM-dd" :editable="false"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" class='pic-col'>
                        <el-form-item label="成员照片：" prop="joinDate">
                            <v-cropper class="cover" :imgUrl="cultureteamPic" :upload="handleUpload" @remove="removeImg" ></v-cropper>
                        </el-form-item>
                    </el-col>
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
    add: { title: '新增人员', flag: 'add' },
    edit: { title: '编辑人员', flag: 'edit' }
};
export default {
    data() {
        return {
            title: DIALOG.add.title,
            flag: DIALOG.add.flag,
            cultureteamPic: '',
            cultData: [],
            culid: '',
            cultureteamForm: {
                name: '',
                coverPic: '',
                contactPhone: '',
                joinDate: '',
                duty: ''
            },
            rules: {
                name: [vRules.required,vRules.maxLen(40)],
                contactPhone: [vRules.required]
            }
        }
    },
    methods: {
        submitForm() {
            this.$refs['cultureteamForm'].validate((valid) => {
                if (valid) {
                    let newForm = Object.assign({}, this.cultureteamForm);
                    newForm.joinDate = this.formatDate(newForm.joinDate, 'yyyy-MM-dd');
                    if (this.flag === DIALOG.add.flag) {
                        Api.cultureteam.addTeamPerson(this.culid, newForm).then(this.callback);
                    } else if (this.flag === DIALOG.edit.flag) {
                        Api.cultureteam.editTeamPerson(this.culid, this.$route.query.mid, newForm).then(this.callback);
                    }
                }
            })
        },
        back() {
            this.$router.go(-1);
        },
        // 上传图片
        handleUpload(formData) {
            Api.system.uploadFile(formData, 'pic').then((res) => {
                this.cultureteamForm.coverPic = res.url;
            })
        },
        // 删除图片
        removeImg() {
            this.cultureteamForm.coverPic = '';
        },
        callback() {
            this.showTip();
            this.back();
        },
        getDetail() {
            Api.cultureteam.getTeamPerson(this.culid, this.$route.query.mid).then((res) => {
                res.joinDate = this.convertToDate(res.joinDate);
                this.cultureteamForm = res;
                this.cultureteamPic = Api.system.getFileUrl(res.coverPic);
            });
        }
    },
    mounted() {
        this.flag = this.$route.query.flag;
        this.culid = this.$route.query.id;
        if (this.flag === 'edit') {
            this.title = DIALOG.edit.title;
            this.flag = DIALOG.edit.flag;
            this.getDetail();
        }
    }
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">

</style>