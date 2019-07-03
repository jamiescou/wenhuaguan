<template>
    <div class="edit-wrapper">
        <v-pageheader :breadcrumbs="breadcrumbs"></v-pageheader>
        <div class="form-wrapper">
            <el-form ref="digitInfoForm" :model="digitInfoForm" :rules="rules" label-position="right" label-width="120px" class="m-form">
                <el-form-item label="资源类型：" prop="type">
                    <el-select v-model="digitInfoForm.type" @change="cultChange">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">{{item.label}}</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="资源名称：" prop="name">
                    <el-input v-model="digitInfoForm.name" placeholder="资源名称"></el-input>
                </el-form-item>
                <el-form-item label="封面图片：" v-show="repic">
                    <v-cropper class="cover" :imgUrl="pic" btnTxt="点击选择封面" :upload="handleUpload" @remove="removeImg"></v-cropper>
                </el-form-item>
                <el-form-item label="资源文件：" v-show="refile">
                    <v-uploadfile :upload="handleUploadFile" @remove="handleRemoveAttach" :filename="digitInfoForm.fileName" :acceptType="acceptType" ref="uploadfile" @cancelfunction="cancelfunctioncanback"></v-uploadfile>
                </el-form-item>                
                <div class="form-opres">
                    <el-button @click="back" class="u-btn">返回</el-button>
                    <el-button @click="submitForm" type="primary" :loading="btnload" class="u-btn">确定</el-button>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
    import Api from '@/api';
    import axios from 'axios';
    import vRules from '@/config/validate_rules';
    import {
        PARENT_NAME
    } from './activity_status'
    const DIALOG = {
        add: {
            title: '添加',
            flag: 'Add'
        },
        edit: {
            title: '编辑',
            flag: 'Edit'
        }
    };
    const DIGITTYPE = {
        pic: '图片',
        video: '视频',
        audio: '音频'
    }
    const ACCEPTTYPE = {
        pic: 'image',
        video: 'video',
        audio: 'audio'
    }
    function digitTypeOpts() {
        const keys = Object.keys(DIGITTYPE);
        let opts = [];
        for (const key of keys) {
            opts.push({
                label: DIGITTYPE[key],
                value: key
            });
        }
        return opts;
    }
    export default {
        data() {
            return {
                source: null,                  
                id: '',
                did: '',
                pic: '',
                title: DIALOG.add.title,
                flag: DIALOG.add.flag,
                btnload: false,
                digitInfoForm: {
                    name: '',
                    type: 'pic',
                    pic: '',
                    fileSize: '',
                    file: '',
                    fileName: ''
                },
                options: digitTypeOpts(),
                rules: {
                    name: [vRules.required, vRules.maxLen(40)],
                    type: [vRules.requiredSelect]
                }
            }
        },
        computed: {
            acceptType() {
                return ACCEPTTYPE[this.digitInfoForm.type];
            },
            repic() {
                this.handleRemoveAttach();
                return (this.digitInfoForm.type === 'pic' || this.digitInfoForm.type === 'video');
            },
            refile() {
                this.handleRemoveAttach();
                return (this.digitInfoForm.type === 'audio' || this.digitInfoForm.type === 'video');
            }
        },
        created() {
            this.id = this.$route.query.id;
            this.did = this.$route.query.did;
            let rootPath = PARENT_NAME['3'];
            this.breadcrumbs = [{
                    to: rootPath.path,
                    name: rootPath.name
                },
                {
                    to: {
                        path: 'record_list',
                        query: {
                            flag: this.id
                        }
                    },
                    name: '活动纪实'
                },
                {
                    name: this.title
                }
            ]
            if (this.did) {
                this.title = DIALOG.edit.title;
                this.flag = DIALOG.edit.flag;
                this.getDetail();
            } else {
                this.title = DIALOG.add.title;
                this.flag = DIALOG.add.flag;
            }
        },
        methods: {
             cultChange(value)
            {
                    this.digitInfoForm.fileName = "";
            },
            back() {
                this.$router.go(-1);
            },
            callback() {
                this.showTip();
                this.back();
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
                this.btnload = true;
                let file = req.file;
                let fileName = file.name;
                let fileSize = (file.size / 1024 / 1024).toFixed(2) + 'M';
                var formData = new FormData();
                formData.append('file', file);
                formData.append('filename', fileName);
                 this.$refs.uploadfile.progressShow=true;
                 this.source = axios.CancelToken.source(); 
                return Api.system.uploadFile(formData, 'attach',this.onUploadProgress,this.source.token).then((res) => {
                    this.digitInfoForm.file = res.url;
                    this.digitInfoForm.fileName = fileName;
                    this.digitInfoForm.fileSize = fileSize;
                    this.btnload = false;
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
                this.digitInfoForm.file = '';
                this.digitInfoForm.fileName = '';
                this.digitInfoForm.fileSize = '';
            },
            // 删除图片
            removeImg() {
                this.digitInfoForm.pic = '';
            },
            submitForm() {
                this.$refs['digitInfoForm'].validate((valid) => {
                    if (valid) {
                        if (this.flag === DIALOG.add.flag) {
                            //                        this.digitInfoForm.createTime = this.formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss');
                            Api.activity.activityAddDigicInfo(this.id, this.digitInfoForm).then(this.callback);
                        } else {
                            //                        this.digitInfoForm.lastModifier = {
                            //                            userId: this.$store.getters.user.id,
                            //                            userName: this.$store.getters.user.name
                            //                        }
                            //                        this.digitInfoForm.lastModifiedTime = this.formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss');
                            Api.activity.activityDigicInfoModify(this.id, this.did, this.digitInfoForm).then(this.callback);
                        }
                    }
                });
            },
            /**
             * 上传封面图
             */
            handleUpload(formData) {
                let fileSize = (formData.get('filesize') / 1024 / 1024).toFixed(2) + 'M';
                this.btnload = true;
                let fileName = formData.get('filename');
                Api.system.uploadFile(formData, 'pic').then((res) => {
                    this.digitInfoForm.pic = res.url;
                    this.digitInfoForm.fileSize = fileSize;
                    this.btnload = false;
                    if (this.digitInfoForm.type === 'pic') {
                        this.digitInfoForm.fileName = fileName;
                    }
                });
            },
            getDetail() {
                this.btnload = true;
                Api.activity.activityDigicInfoDetail(this.id, this.did).then((info) => {
                    this.pic = Api.system.getFileUrl(info.pic);
                    this.digitInfoForm = info;
                    if (this.digitInfoForm.type !== 'pic') {
                        this.refile = true;
                    }
                    this.btnload = false;
                });
            }
        },
        mounted() {
        }
    }
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">

</style>
