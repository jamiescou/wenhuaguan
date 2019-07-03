<template>
    <div class="edit-wrapper">
        <v-pageheader :breadcrumbs="[{ to:'index',name: '文化团队管理' },{name:title}]"></v-pageheader>
        <div class="form-wrapper">
            <el-form ref="cultureteamForm" :model="cultureteamForm" :rules="rules" label-position="right" label-width="100px" class="m-form">
                <el-row :gutter="20">
                    <el-col :span="14">
                        <el-form-item label="团队名称" prop="name">
                            <el-input v-model="cultureteamForm.name"></el-input>
                        </el-form-item>
                        <el-form-item label="联系电话" prop="contactPhone">
                            <el-input v-model="cultureteamForm.contactPhone"></el-input>
                        </el-form-item>
                        <el-form-item label="团队负责人" prop="contactName">
                            <el-input v-model="cultureteamForm.contactName"></el-input>
                        </el-form-item>
                        <el-form-item label="所属区域" prop="region">
                            <el-select v-model="cultureteamForm.region" placeholder="请选择管理区域">
                                <el-option v-for="item in options" :key="item.code" :label="item.name" :value="item.code">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10" class='pic-col'>
                      <el-form-item label-width="0" prop="coverPic">
                        <v-cropper class="cover" btnTxt="请选择封面图片" :imgUrl='coverPic' :upload="handleUpload" @remove="removeImg"></v-cropper>
                        <el-input v-model="cultureteamForm.coverPic" v-show="false"></el-input>
                      </el-form-item>
                      <!--<v-cropper class="cover" :imgUrl="cultureteamPic" :upload="handleUpload" @remove="removeImg"></v-cropper>-->
                    </el-col>
                </el-row>
                <el-form-item label="艺术分类" filterable prop="artType">
                    <el-checkbox-group v-model="cultureteamForm.artType">
                        <v-checkbox typeName="artistClass"></v-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="详细地址" prop="address">
                    <el-input v-model="cultureteamForm.address"></el-input>
                </el-form-item>
                <el-form-item label="简介" prop="brief">
                    <el-input v-model="cultureteamForm.brief"></el-input>
                </el-form-item>
                <el-form-item label="团队描述" prop="desc">
                    <v-richeditor v-model="cultureteamForm.desc" ref="richEditor"></v-richeditor>
                </el-form-item>
                <el-form-item label="上传附件">
                    <v-uploadfile :upload="handleUploadFile" @remove="handleRemoveAttach" :filename="cultureteamForm.attachName" ref="uploadfile" @cancelfunction="cancelfunctioncanback"></v-uploadfile>
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
import axios from 'axios'
import vRules from '@/config/validate_rules';
const DIALOG = {
    add: { title: '新增团队', flag: 'Add' },
    edit: { title: '编辑团队', flag: 'Edit' }
};
export default {
    data() {
        return {
            source: null,
            title: DIALOG.add.title,
            flag: DIALOG.add.flag,
            coverPic: '',
            culid: '',
            type: '',
            options: [],
            cultureteamForm: {
                name: '',
                coverPic: '',
                address: '',
                contactPhone: '',
                contactName: '',
                brief: '',
                desc: '',
                region: '',
                attach: '',
                attachName: '',
                artType: []
            },
            rules: {
                name: [vRules.required,vRules.maxLen(40)],
                coverPic: [vRules.required_Msg('没有选择封面图片或图片上传中')],
                region: [vRules.requiredSelect],
                artType: [vRules.required],
                address: [vRules.required],
                contactPhone: [vRules.required],
                brief: [vRules.required],
                desc: [vRules.required],
                contactName: [vRules.required]
            }
        }
    },
    methods: {
        submitForm() {
            this.$refs['cultureteamForm'].validate((valid) => {
                if (valid) {
                    let newForm = Object.assign(this.cultureteamForm);
                    if (this.flag === DIALOG.add.flag) {
                        newForm.dataDeptId = this.$store.getters.user.unit.id;
                        Api.cultureteam.addCultureTeam(newForm).then(this.callback);
                    } else if (this.flag === DIALOG.edit.flag) {
                        newForm.id = this.cultureteamForm.id;
                        Api.cultureteam.modifyCultureTeam(newForm.id, newForm).then(this.callback);
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
                this.cultureteamForm.attach = res.url;
                this.cultureteamForm.attachName = fileName;
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
            this.cultureteamForm.attach = '';
            this.cultureteamForm.attachName = '';
        },
        callback() {
            this.showTip();
            this.back();
        },
        getDetail() {
            Api.cultureteam.getCultureTeamDetail(this.culid).then((res) => {
                this.cultureteamForm = res;
                this.coverPic = Api.system.getFileUrl(this.cultureteamForm.coverPic);
            });
        },
        getRegions() {
            Api.system.getRegionList(this.$store.state.user.info.unit.region).then((res) => {
                this.options = res;
            });
        }
    },
    mounted() {
        this.type = this.$route.query.type;
        if (this.type === 'edit') {
            this.title = DIALOG.edit.title;
            this.flag = DIALOG.edit.flag;
            this.culid = this.$route.query.id;
            this.getDetail();
        } else {
            let unitId = this.$store.getters.user.orgUnit.id;
            this.cultureteamForm.unitId = unitId;
        }
        this.getRegions();
    }
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">

</style>
