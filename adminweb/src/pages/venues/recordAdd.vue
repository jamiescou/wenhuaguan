<template>
    <div class="edit-wrapper">
        <v-pageheader :breadcrumbs="breadcrumbs"></v-pageheader>
        <div class="form-wrapper">
            <el-form ref="digitInfoForm" :model="digitInfoForm" :rules="rules" label-position="right" label-width="120px" class="m-form">
                <el-form-item label="资源类型：" prop="type">
                    <el-select v-model="digitInfoForm.type">
                        <el-option v-for="item in digitOpts" :key="item.value" :label="item.label" :value="item.value">{{item.label}}</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="资源名称：" prop="name">
                    <el-input v-model="digitInfoForm.name" placeholder="资源名称"></el-input>
                </el-form-item>

                <el-form-item label="封面图片：" v-show="hasPic">
                    <v-cropper class="cover" :imgUrl="pic" btnTxt="点击选择" :upload="handleUpload" @remove="removeImg"></v-cropper>
                </el-form-item>
                <div v-show="needChooseAddWay">
                    <!-- <el-form-item label="添加方式：">
                        <template>
                            <el-radio-group v-model="addWay">
                                <el-radio class="radio" label="1">添加</el-radio>
                                <el-radio class="radio" label="2">调用</el-radio>
                            </el-radio-group>
                        </template>
                    </el-form-item> -->
                    <!-- <div name="first" v-show="!addNewFile" class="link-digits">
                        <h4 class="u-title">资源文件</h4>
                        <el-form-item label="资源来源：">
                            <el-radio-group v-model="radioOne" @change="radioTypeChange">
                                <el-radio class="radio" label="activity">活动</el-radio>
                                <el-radio class="radio" label="herit">非遗</el-radio>
                                <el-radio class="radio" label="venue">场馆</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-table :data="dataList" v-loading.body="loading" highlight-current-row @current-change="handleCurrentChange" :max-height="300">
                            <el-table-column label=" " type="index" width="55">
                                <template scope="scope">
                                    <i class="el-icon-check" v-if="currentIndex===scope.row.id"></i>
                                </template>
                            </el-table-column>
                            <el-table-column property="vname" label="类型名称" width="150"></el-table-column>
                            <el-table-column property="name" label="资源名称" width="200"></el-table-column>
                            <el-table-column property="fileSize" label="资源大小"></el-table-column>
                        </el-table>
                    </div> -->
                    <el-form-item label="资源文件：" v-show="addNewFile">
                        <v-uploadfile :upload="handleUploadFile" @remove="handleRemoveAttach" :filename="digitInfoForm.fileName" :acceptType="acceptType"></v-uploadfile>
                    </el-form-item>
                    <el-dialog title="上传进度" class="dialog" v-model="progressShow" :close-on-click-modal="false" :show-close="false" style="margin-top:10%">
                    <el-progress :text-inside="true" :stroke-width="18" :percentage="Progress"></el-progress>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click=""  >取 消上传</el-button>                    
                    </span>
                </el-dialog>
                </div>
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
import BaseTable from '@/mixins/base-table';
import vRules from '@/config/validate_rules';

const DIALOG = {
    add: { title: '添加', flag: 'Add' },
    edit: { title: '编辑', flag: 'Edit' }
};

const DIGITTYPE = { pic: '图片', video: '视频', audio: '音频' }
const ACCEPTTYPE = { pic: 'image', video: 'video', audio: 'audio' }
const HASPICTYPE = ['pic', 'video']; // 有图片
const NEEDCHOISEWAY = ['video', 'audio'];   // 有调用方式：新文件、或链接调用
function digitTypeOpts() {
    const keys = Object.keys(DIGITTYPE);
    let opts = [];
    for (const key of keys) {
        opts.push({ label: DIGITTYPE[key], value: key });
    }
    return opts;
}

export default {
    mixins: [BaseTable],
    data() {
        return {
            Progress:"0",
            progressShow:false,
            addWay: '1',
            pic: '',
            digitOpts: digitTypeOpts(),
            radioOne: '',
            dataList: [],
            btnload: false,
            currentIndex: '',
            digitInfoForm: {
                name: '',
                type: 'pic',
                pic: '',
                fileSize: '',
                file: '',
                fileName: ''
            },
            rules: {
                name: [vRules.required,vRules.maxLen(40)],
                type: [vRules.requiredSelect]
            }
        }
    },
    created() {
        this.id = this.$route.query.id;
        this.did = this.$route.query.did;
        if (this.did) {
            this.title = DIALOG.edit.title;
            this.flag = DIALOG.edit.flag;
            this.getDetail();
        }
        else {
            this.title = DIALOG.add.title;
            this.flag = DIALOG.add.flag;
        }

        this.breadcrumbs = [
            { to: 'venuesmanage', name: '场馆预定' },
            { to: { path: 'record', query: { id: this.id } }, name: '场馆纪实' },
            { name: this.title }
        ]
    },
    computed: {
        acceptType() {
            return ACCEPTTYPE[this.digitInfoForm.type];
        },
        hasPic() {
            return HASPICTYPE.some(x => x === this.digitInfoForm.type);
        },
        needChooseAddWay() {
            return NEEDCHOISEWAY.some(x => x === this.digitInfoForm.type);
        },
        addNewFile() {
            return this.addWay === '1';
        }
    },
    methods: {
        back() {
            this.$router.push({ path: 'record', query: { id: this.id } });
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
        // 删除图片
        removeImg() {
            this.digitInfoForm.pic = '';
        },
        // 选择一个资源
        handleCurrentChange(val) {
            if (val) {
                this.currentIndex = val.id;
                this.digitInfoForm.file = val.file;
                this.digitInfoForm.fileName = val.fileName;
                this.digitInfoForm.fileSize = val.fileSize;
            }
        },
        // 上传附件
        handleUploadFile(req) {
            this.btnload = true;
            let file = req.file;
            let fileName = file.name;
            let fileSize = (file.size / 1024 / 1024).toFixed(2) + 'M';
            var formData = new FormData();
            formData.append('file', file);
            formData.append('filename', fileName);
            this.progressShow=true;
            return Api.system.uploadFile(formData, 'attach',this.onUploadProgress).then((res) => {
                this.digitInfoForm.file = res.url;
                this.digitInfoForm.fileName = fileName;
                this.digitInfoForm.fileSize = fileSize;
                this.btnload = false;
            });
        },
         //上传进度显示
            onUploadProgress(value)
            {
                    
                    this.Progress=value;
                    if(value=="100")
                    {
                            this.progressShow=false;
                    }
            },
        // 删除附件
        handleRemoveAttach() {
            this.digitInfoForm.file = '';
            this.digitInfoForm.fileName = '';
            this.digitInfoForm.fileSize = '';
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
        callback() {
            this.showTip();
            this.back();
        },
        submitForm() {
            this.$refs['digitInfoForm'].validate((valid) => {
                if (valid) {
                    if (this.flag === DIALOG.add.flag) {
                       /* this.digitInfoForm.creator = {
                            userId: this.$store.getters.user.id,
                            userName: this.$store.getters.user.name
                        }
                        this.digitInfoForm.createTime = this.formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss');*/
                        Api.venue.addDigitInfo(this.id, this.digitInfoForm).then(this.callback);
                    } else {
                        /*this.digitInfoForm.lastModifier = {
                            userId: this.$store.getters.user.id,
                            userName: this.$store.getters.user.name
                        }
                        this.digitInfoForm.lastModifiedTime = this.formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss');*/
                        Api.venue.digicInfoModify(this.id, this.did, this.digitInfoForm).then(this.callback);
                    }
                }
            });
        },
        getDetail() {
            this.btnload = true;
            Api.venue.getDigitInfoDetail(this.id, this.did).then((info) => {
                this.pic = Api.system.getFileUrl(info.pic);
                this.digitInfoForm = info;
                this.btnload = false;
            });
        }
    }
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
.link-digits {
  margin-bottom: 20px;
  margin-top: -10px;
  box-shadow: inset 0 5px 4px -4px rgba(49, 49, 64, 0.1);
  border: 1px solid #ccc;

  .u-title {
    font-weight: 700;
    font-size: 14px;
    margin: 0;
    padding: 20px 30px 10px;
  }
}
</style>
