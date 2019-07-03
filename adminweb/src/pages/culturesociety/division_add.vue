<template>
    <div class="edit-wrapper">
        <v-pageheader :breadcrumbs="[{ to:'index',name: '群文学会管理' },{name:title}]"></v-pageheader>
        <div class="form-wrapper">
            <el-form ref="societyForm" :model="societyForm" :rules="rules" label-position="right" label-width="100px" class="m-form">
                <el-row :gutter="20">
                    <el-col :span="14">
                        <el-form-item label="委员会名称" prop="name">
                            <el-input v-model="societyForm.name"></el-input>
                        </el-form-item>
                      <el-form-item label="负责人" prop="leader">
                        <el-input v-model="societyForm.leader"></el-input>
                      </el-form-item>
                      <el-form-item label="联系电话" prop="mobile">
                        <el-input v-model="societyForm.mobile"></el-input>
                      </el-form-item>
                      <el-form-item label="邮箱" prop="email">
                        <el-input v-model="societyForm.email"></el-input>
                      </el-form-item>
                    </el-col>
                   <el-col :span="10" class='pic-col'>
                     <el-form-item label-width="0" prop="coverPic" required>
                       <v-cropper class="cover" btnTxt="请选择封面图片" :imgUrl='coverPic' :upload="handleUpload" @remove="removeImg"></v-cropper>
                       <el-input v-model="societyForm.coverPic" v-show="false"></el-input>
                     </el-form-item>
                    </el-col>

                </el-row>
                        <el-form-item label="学会简介" prop="brief" style="margin-top:20px">
                            <v-richeditor v-model="societyForm.brief"  ref="richEditor"></v-richeditor>
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
    add: { title: '新增专业委员会', flag: 'add' },
    edit: { title: '编辑专业委员会', flag: 'edit' }
};
export default {
    data() {
        return {
            title: DIALOG.add.title,
            flag: DIALOG.add.flag,
            coverPic: '',
            id: '',
            mid:'',
            users: [],
            societyForm: {
              brief:''},
            rules: {
              name: [vRules.required,vRules.maxLen(40)],
              coverPic: [vRules.required_Msg('没有选择封面图片或图片上传中')],
              leader: [vRules.required],
              mobile: [vRules.required],
              brief: [vRules.required]
            }
        }
    },
    methods: {
        // 上传图片
        handleUpload(formData) {
            Api.system.uploadFile(formData, 'pic').then((res) => {
                this.societyForm.coverPic = res.url;
            })
        },
        // 删除图片
        removeImg() {
            this.societyForm.coverPic = '';
        },

        submitForm() {
            this.$refs['societyForm'].validate((valid) => {
                if (valid) {
                    let newForm = Object.assign({}, this.societyForm);
                    if (this.flag === DIALOG.add.flag) {
                        Api.society.addDivisions(this.mid, newForm).then(this.callback);
                    } else if (this.flag === DIALOG.edit.flag) {
                        Api.society.editDivisions(this.mid, this.id, newForm).then(this.callback);
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
            Api.society.getDivisions(this.mid,this.id).then((res) => {
                this.societyForm = res;
                this.coverPic = Api.system.getFileUrl(res.coverPic);
            });
        }
    },
    mounted() {
        this.mid = this.$route.query.mid;
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

<style type="text/css" lang="scss" rel="stylesheet/scss">

</style>
