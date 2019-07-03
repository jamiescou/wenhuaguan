<template>
    <div class="edit-wrapper">
        <v-pageheader :breadcrumbs="[{ to:'index',name: '电子杂志管理' },{name:title}]"></v-pageheader>
        <div class="form-wrapper">
            <el-form ref="issueForm" :model="issueForm" :rules="rules" label-position="right" label-width="100px" class="m-form">
                <el-row :gutter="20">
                    <el-col :span="14">
                        <el-form-item label="杂志名称">
                            <el-input v-model="name" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="封面图片" prop="coverPic">
                            <v-cropper class="coverPic" btnTxt="请选择封面图片" :imgUrl='coverPic' :upload="handleUpload" @remove="removeImg" :aspectRatio="14/19"></v-cropper>
                            <el-input v-model="issueForm.coverPic" v-show="false"></el-input>
                        </el-form-item>
                        <el-form-item label="所属年份" prop="year">
                            <el-date-picker v-model="issueForm.year" align="right" type="year" placeholder="选择年">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="当前期数" prop="seqno">
                            <el-input v-model="issueForm.seqno" placeholder="请输入数字,例如：1"></el-input>
                        </el-form-item>
                        <el-form-item label="总期数" prop="totalno">
                            <el-input v-model="issueForm.totalno" placeholder="请输入数字,例如：1"></el-input>
                        </el-form-item>
                        <el-form-item label="期数备注" prop="remark">
                            <el-input v-model="issueForm.remark"></el-input>
                        </el-form-item>
                        <el-form-item label="可否在线阅读" label-width="120px" prop="isOnline">
                            <el-radio-group v-model="issueForm.isOnline">
                                <el-radio :label="true" :key="true" :value="true">是</el-radio>
                                <el-radio :label="false" :key="false" :value="false">否</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="杂志电子版" prop="fileAddress" v-if="this.issueForm.isOnline===true">
                            <v-uploadfile :upload="handleUploadFile" @remove="handleRemoveAttach" :filename="issueForm.fileName" :acceptType="acceptType" ref="uploadfile" @cancelfunction="cancelfunctioncanback"></v-uploadfile>
                        </el-form-item>

                        <el-form-item label="阅读链接" prop="url" v-if="this.issueForm.isOnline===false">
                            <el-input v-model="issueForm.url" placeholder="如：http://www.baidu.com"></el-input>
                        </el-form-item>
                    </el-col>
                    <!-- <el-col :span="10" class='pic-col'>
                          <el-form-item label-width="0" prop="coverPic" required>
                            <v-cropper class="coverPic" btnTxt="请选择封面图片" :imgUrl='coverPic' :upload="handleUpload" @remove="removeImg" :aspectRatio="14/19"></v-cropper>
                            <el-input v-model="issueForm.coverPic" v-show="false"></el-input>
                          </el-form-item>
                    </el-col>-->
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
import axios from 'axios'
const DIALOG = {
    add: { title: '新增电子杂志', flag: 'add' },
    edit: { title: '编辑电子杂志', flag: 'edit' }
};
export default {
    data() {
        return {
            source: null,
            title: DIALOG.add.title,
            flag: DIALOG.add.flag,
            mid: '',
            id: '',
            name: '',
            acceptType: 'pdf',
            coverPic: '',
            culid: '',
            cultData: [],
            options: [],
            users: [],
            issueForm: {
                magazine: { id: '' },
                coverPic: '',
                year: '',
                seqno: '',
                totalno: '',
                fileAddress: '',
                isOnline: '',
                fileName: ''
            },
            rules: {
                coverPic: [vRules.required],
                isOnline: [vRules.required],
                seqno: [vRules.required, vRules.number_Msg('请输入数字')],
                totalno: [vRules.number_Msg('请输入数字')],
                url: [vRules.required],
                year: [vRules.required],
                fileAddress: [vRules.required],
            }
        }
    },
    methods: {
        //取消上传
        cancelfunctioncanback() {
            this.source.cancel('取消上传')
            this.$refs.uploadfile.progressShow = false;
            this.$refs.uploadfile.handleRemove();
            this.$refs.Progress = 0;
            this.handleRemoveAttach();
            this.$refs.fileList = [];
        },
        // 附件上传
        handleUploadFile(req) {
            let file = req.file;
            let fileName = file.name;
            var formData = new FormData();
            formData.append('file', file);
            formData.append('filename', fileName);
            this.$refs.uploadfile.progressShow = true;
            this.source = axios.CancelToken.source();
            return Api.system.uploadFile(formData, 'attach', this.onUploadProgress, this.source.token).then((res) => {
                this.issueForm.fileAddress = res.url;
                this.issueForm.fileName = fileName;
            });
        },
        //上传进度显示
        onUploadProgress(value) {
            this.$refs.uploadfile.Progress = value;
            if (value == "100") {
                this.$refs.uploadfile.progressShow = false;
            }
        },
        // 删除附件
        handleRemoveAttach() {
            this.issueForm.fileAddress = '';
            this.issueForm.fileName = '';
        },
        // 上传图片
        handleUpload(formData) {
            Api.system.uploadFile(formData, 'pic').then((res) => {
                this.issueForm.coverPic = res.url;
            })
        },
        // 删除图片
        removeImg() {
            this.issueForm.coverPic = '';
        },
        // 添加
        submitForm() {
            this.$refs['issueForm'].validate((valid) => {
                if (valid) {
                    let newForm = Object.assign({}, this.issueForm);
                    newForm.year = this.formatDate(newForm.year, 'yyyy');
                    if (this.flag === DIALOG.add.flag) {
                        Api.magazine.creatMagazineIssue(this.mid, newForm).then(this.callback);
                    } else if (this.flag === DIALOG.edit.flag) {
                        Api.magazine.modifyMagazineIssue(this.mid, this.id, newForm).then(this.callback);
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
            Api.magazine.getMagazineIssue(this.mid, this.id).then((res) => {
                res.year = this.convertToDate(res.year);
                this.coverPic = Api.system.getFileUrl(res.coverPic);
                this.issueForm = res;
            });
        }
    },
    mounted() {
        this.flag = this.$route.query.flag;
        this.mid = this.$route.query.mid;
        this.id = this.$route.query.id;
        this.issueForm.magazine.id = this.mid;
        if (this.flag === 'edit') {
            this.title = DIALOG.edit.title;
            this.flag = DIALOG.edit.flag;
            this.culid = this.$route.query.id;
            this.getDetail();
        }
        // 获取所属杂志名称
        Api.magazine.getMagazine(this.mid).then((res) => {
            this.name = res.name;
        });
    }
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
.coverPic {
  width: 221px;
  height: 300px;
}
</style>
