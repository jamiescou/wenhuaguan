<template>
    <div class="edit-wrapper">
        <v-pageheader :breadcrumbs="[{ to:'index',name:'名录管理'},{name:'数字资源'},{name:title}]"></v-pageheader>
        <div class="form-wrapper">
            <el-form ref="digitInfoForm" :model="digitInfoForm" :rules="rules" label-position="right" label-width="120px" class="m-form">
                <el-form-item label="资源类型：" prop="type">
                    <el-select v-model="digitInfoForm.type" @change="typeChange">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">{{item.label}}</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="资源名称：" prop="name">
                    <el-input v-model="digitInfoForm.name" placeholder="资源名称"></el-input>
                </el-form-item>
                <el-form-item label="封面图片：" v-show="repic">
                    <v-cropper class="cover" :imgUrl="pic" btnTxt="点击选择封面" :upload="handleUpload" @remove="removeImg"></v-cropper>
                </el-form-item>
                <el-form-item label="添加方式：" v-show="addType">
                    <template>
                        <el-radio-group v-model="radio" @change="radioChange">
                            <el-radio class="radio" label="1">添加</el-radio>
                            <el-radio class="radio" label="2">调用</el-radio>
                        </el-radio-group>
                    </template>
                </el-form-item>
                <el-tabs v-model="tabActive" type="border-card" style="margin:10px 0 22px;" v-show="callVisible">
                    <el-tab-pane label="资源文件" name="first">
                        <el-form label-position="right" label-width="120px" class="m-form">
                            <el-form-item label="调用类型：">
                                <el-radio-group v-model="radioOne" @change="radioTypeChange">
                                    <el-radio class="radio" label="activity">活动</el-radio>
                                    <el-radio class="radio" label="herit">非遗</el-radio>
                                     <el-radio class="radio" label="venue">场馆</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-form>
                        <el-table :data="dataList" v-loading.body="loading" highlight-current-row @current-change="handleCurrentChange" :max-height="300">
                            <el-table-column label=" " type="index" width="55">
                                <template scope="scope">
                                    <i class="el-icon-check" v-if="currentIndex===scope.row.name"></i>
                                </template>
                            </el-table-column>
                            <el-table-column property="vname" label="类型名称" width="150"></el-table-column>
                            <el-table-column property="name" label="资源名称" width="200"></el-table-column>
                            <el-table-column property="fileSize" label="资源大小"></el-table-column>
                        </el-table>
                    </el-tab-pane>
                </el-tabs>
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
import BaseTable from '@/mixins/base-table';
import vRules from '@/config/validate_rules';

export default {
    mixins: [BaseTable],
    data() {
        return {
            source: null,  
            id: '',
            did: '',
            pic: '',
            title: '',
            acceptType: 'image',
            btnload: false,
            addType: false,
            refile: false,
            repic: true,
            currentIndex: '',
            tabActive: 'first',
            callVisible: false,
            digitInfoForm: {
                name: '',
                type: 'pic',
                pic: '',
                fileSize: '',
                file: '',
                fileName: ''
            },
            radio: '1',
            options: [{
                label: '图片',
                value: 'pic'
            }, {
                label: '视频',
                value: 'video'
            }, {
                label: '音频',
                value: 'audio'
            }],
            radioOne: '',
            dialogFormVisible: false,
            dataList: [],
            rules: {
                name: [vRules.required,vRules.maxLen(40)],
                type: [vRules.requiredSelect]
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
        // 调用选择触发
        handleCurrentChange(val) {
            if (val) {
                this.currentIndex = val.name;
                this.digitInfoForm.file = val.file;
                this.digitInfoForm.fileName = val.fileName;
                this.digitInfoForm.fileSize = val.fileSize;
            }
        },
        /**
         * 类型改变
         */
        typeChange(val) {
            switch (val) {
                case 'pic':
                    this.addType = false;
                    this.repic = true;
                    this.refile = false;
                    this.acceptType = 'image';
                    break;
                case 'video':
                    this.addType = true;
                    this.repic = true;
                    this.refile = true;
                    this.acceptType = 'video';
                    break;
                case 'audio':
                    this.addType = true;
                    this.repic = false;
                    this.refile = true;
                    this.acceptType = 'audio';
                    break;
            }
            this.callVisible = false;
            this.radio = '1';
            // this.digitInfoForm = {
            //     name: '',
            //     type: val,
            //     pic: '',
            //     fileSize: '',
            //     file: '',
            //     fileName: ''
            // }
        },
        /**
        * 添加方式改变
        */
        radioChange(val) {
            switch (val) {
                case '1':
                    this.refile = true;
                    this.callVisible = false;
                    break;
                case '2':
                    this.refile = false;
                    this.callVisible = true;
                    break;
            }
        },
        /**
        * 调用类型改变
        */
        radioTypeChange(val) {
            this.dataList = [];
            // 活动
            if (val === 'activity') {
                this.showLoading();
                Api.activity.getActivityList('search=', this.page, -1).then((res) => {
                    let list = res.content;
                    if (list != null && list.length > 0) {
                        for (var i = 0; i < list.length; i++) {
                            let digits = list[i].digits;
                            if (digits != null && digits.length > 0) {
                                let vname = list[i].name;
                                for (var j = 0; j < digits.length; j++) {
                                    if (digits[j].type === this.digitInfoForm.type) {
                                        let data = {
                                            vname: vname,
                                            name: digits[j].name,
                                            fileSize: digits[j].fileSize,
                                            type: digits[j].type,
                                            file: digits[j].file,
                                            fileName: digits[j].fileName
                                        }
                                        this.dataList.push(data);
                                    }
                                }
                            }
                        }
                    }
                }).finally(this.closeLoading);
            }
            // 非遗
            if (val === 'herit') {
                Api.heritage.getHeritageList('search=', this.page, -1).then((res) => {
                    let list = res.content;
                    if (list != null && list.length > 0) {
                        for (var i = 0; i < list.length; i++) {
                            let digits = list[i].digits;
                            if (digits != null && digits.length > 0) {
                                let vname = list[i].name;
                                for (var j = 0; j < digits.length; j++) {
                                    if (digits[j].type === this.digitInfoForm.type) {
                                        let data = {
                                            vname: vname,
                                            name: digits[j].name,
                                            fileSize: digits[j].fileSize,
                                            type: digits[j].type,
                                            file: digits[j].file,
                                            fileName: digits[j].fileName
                                        }
                                        this.dataList.push(data);
                                    }
                                }
                            }
                        }
                    }
                }).finally(this.closeLoading);
            }
            // 场馆
            if (val === 'venue') {
                Api.venue.getVenueList('search=', this.page, -1).then((res) => {
                    let list = res.content;
                    if (list != null && list.length > 0) {
                        for (var i = 0; i < list.length; i++) {
                            let digits = list[i].digitInfos;
                            if (digits != null && digits.length > 0) {
                                let vname = list[i].name;
                                for (var j = 0; j < digits.length; j++) {
                                    if (digits[j].type === this.digitInfoForm.type) {
                                        let data = {
                                            vname: vname,
                                            name: digits[j].name,
                                            fileSize: digits[j].fileSize,
                                            type: digits[j].type,
                                            file: digits[j].file,
                                            fileName: digits[j].fileName
                                        }
                                        this.dataList.push(data);
                                    }
                                }
                            }
                        }
                    }
                }).finally(this.closeLoading);
            }
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
                    if (this.flag === 'add') {
                        Api.heritage.directoryAddDigicInfo(this.id, this.digitInfoForm).then(this.callback);
                    } else {
                        Api.heritage.directoryDigicInfoModify(this.id, this.did, this.digitInfoForm).then(this.callback);
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
            Api.heritage.directoryDigicInfoDetail(this.id, this.did).then((info) => {
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
        this.id = this.$route.query.id;
        this.did = this.$route.query.did;
        this.flag = this.$route.query.flag;
        this.title = this.$route.query.title;
        if (this.flag === 'edit') {
            this.getDetail();
        }
    }
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
</style>