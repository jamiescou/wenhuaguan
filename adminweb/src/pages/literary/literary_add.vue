<template>
    <div class="edit-wrapper">
        <v-pageheader v-if="type==1" :breadcrumbs="[{ to:'index',name: '文艺人才管理' },{name:title}]"></v-pageheader>

        <v-pageheader v-if="type==2" :breadcrumbs="[{ to:'index',name: '专家管理' },{name:title}]"></v-pageheader>
        <div class="form-wrapper">
            <el-form ref="literaryForm" :model="literaryForm" :rules="rules" label-position="right" label-width="100px" class="m-form">
                <el-row :gutter="20">
                    <el-col :span="14">
                        <el-form-item label="姓名" prop="name">
                            <el-input v-model="literaryForm.name"></el-input>
                        </el-form-item>

                        <el-form-item label="出生日期" prop="birthDate">
                            <el-date-picker v-model="literaryForm.birthDate" type="date" format="yyyy-MM-dd" :editable="false"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="手机号码" prop="mobilePhone">
                            <el-input v-model="literaryForm.mobilePhone"></el-input>
                        </el-form-item>
                         <el-form-item label="身份证号码" prop="idnumber">
                            <el-input v-model="literaryForm.idNumber"></el-input>
                        </el-form-item>

                      <el-form-item label="头衔" prop="honor">
                        <el-select v-model="literaryForm.honor">
                          <v-option typeName="honorType"></v-option>
                        </el-select>
                      </el-form-item>
                        <el-form-item label="性别" prop="sex">
                          <el-radio-group v-model="literaryForm.sex">
                            <el-radio v-for="item in sexoptions" :label="item.value" :value="item.value" v-bind:key="item.value">{{item.label}}
                            </el-radio>
                          </el-radio-group>
                        </el-form-item>
                    </el-col>

                    <el-col :span="10" class='pic-col'>
                            <v-cropper class="cover portrait" :imgUrl="literaryPic" :aspectRatio="2/3" :upload="handleUpload" @remove="removeImg"></v-cropper>
                    </el-col>
                </el-row>
                <el-form-item label="所属区域" prop="region" class="cooperation">
                  <v-cooperation v-model="literaryForm.region" :code="literaryForm.region"></v-cooperation>
                </el-form-item>
                <el-form-item label="艺术分类" filterable prop="artType">
                    <el-checkbox-group v-model="literaryForm.artType">
                        <v-checkbox typeName="artistClass"></v-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="最高学历" prop="edu">
                            <el-input v-model="literaryForm.edu"></el-input>
                        </el-form-item>
                <el-form-item label="毕业院校" prop="school">
                    <el-input v-model="literaryForm.school"></el-input>
                </el-form-item>
                <el-form-item label="人才简介" prop="brief">
                    <v-richeditor v-model="literaryForm.brief" ref="richEditor"></v-richeditor>
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
    add: { title: '新增人才', flag: 'add' },
    edit: { title: '编辑人才', flag: 'edit' }
};
export default {
    created(){
       this.type=this.$route.query.type;
       if(this.type==1){
          if(this.flag=='add'){
            this.title='新增人才'
           }else{
            this.title='编辑人才'
           }
       }else{
          if(this.flag=='add'){
           this.title='新增专家'
          }else{
           this.title='编辑专家'
          }
       }
    },
    data() {
        return {
            type:'',
            title: DIALOG.add.title,
            flag: DIALOG.add.flag,
            literaryPic: '',
            culid: '',
            sexoptions: [],
            literaryForm: {
                name: '',
                coverPic: '',
                brief: '',
                artType: [],
                school: '',
                region: '',
                edu: '',
                sex: '',
                honor: '',
                mobilePhone: '',
                birthDate: '',
                unitId:'',
                idNumber:'',
                type:'',
            },
            rules: {
                name: [vRules.required,vRules.maxLen(40)],
                sex: [vRules.required],
                artType: [vRules.required],
                brief: [vRules.required],
                honor: [vRules.requiredSelect],
                region: [vRules.required],
                school: [vRules.required],
            }
        }
    },
    methods: {
        // 上传图片
        handleUpload(formData) {
            Api.system.uploadFile(formData, 'pic').then((res) => {
                this.literaryForm.coverPic = res.url;
            })
        },
        // 删除图片
        removeImg() {
            this.literaryForm.coverPic = '';
        },
        submitForm() {
        //console.log(this.$route.query.type)
            this.$refs['literaryForm'].validate((valid) => {
                if (valid) {
                    let newForm = Object.assign({}, this.literaryForm);
                    newForm.type=this.$route.query.type;
                    newForm.birthDate = this.formatDate(newForm.birthDate, 'yyyy-MM-dd');
                    if (this.flag === DIALOG.add.flag) {
                        newForm.unitId = this.$store.getters.user.orgUnit.id;
                        newForm.dataDeptId = this.$store.getters.user.unit.id;
                        Api.literary.addLiterary(newForm).then(this.callback);
                    } else if (this.flag === DIALOG.edit.flag) {
                        Api.literary.editLiterary(this.culid, newForm).then(this.callback);
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
            Api.literary.getLiterary(this.culid).then((res) => {
                res.birthDate = this.convertToDate(res.birthDate);
                this.literaryForm = res;
                this.literaryPic = Api.system.getFileUrl(res.coverPic);
            });
        }
    },
    mounted() {
        this.sexoptions = [{ label: '男', value: 'male' }, { label: '女', value: 'female' }, { label: '未知', value: 'unkown' }];
        this.flag = this.$route.query.flag;
        if (this.flag === 'edit') {
            this.title = DIALOG.edit.title;
            this.flag = DIALOG.edit.flag;
            this.culid = this.$route.query.id;
            this.getDetail();
        }
    }
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">

</style>
