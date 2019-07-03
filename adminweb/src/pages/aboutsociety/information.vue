<template>
    <div class="inforAdd-wrapper">
        <v-pageheader :breadcrumbs="[{ to:'index',name: '资讯公告' },{name:title}]"></v-pageheader>
        <div class="form-wrapper">
            <el-form ref="infoForm" :model="infoForm" label-width="120px" :rules="rules">
                <el-form-item label="资讯标题：" prop="title">
                    <el-input v-model="infoForm.title" placeholder="请输入公告标题"></el-input>
                </el-form-item>
                <el-form-item label="资讯图片：">
                    <v-cropper class="cover" :imgUrl='coverPic' :upload="handleUpload" @remove="removeImg"></v-cropper>
                </el-form-item>
                <el-form-item label="所属栏目：" prop="column">
                    <v-treeselect :treeData="columns" :treeProps="treeProps" nodeKey="id" :multiple="true" v-model="infoForm.column" placeholder="请选择所属栏目" @errorCallback="showTreeError" @setSelectedId="setSelectedId">
                    </v-treeselect>
                    <!-- <el-select v-model="infoForm.column" multiple placeholder="请选择所属栏目">
                        <template v-for="group in columns">
                            <el-option-group :key="group.id" :label="group.name" v-if="group.children && group.children.length">
                                <el-option v-for="item in group.children" :key="item.id" :label="item.name" :value="item.id">
                                </el-option>
                            </el-option-group>
                            <el-option :key="group.id" :label="group.name" :value="group.id" v-else></el-option>
                        </template>
                    </el-select> -->
                </el-form-item>
                <el-form-item label="来  源：" prop="source">
                    <el-input v-model="infoForm.source"></el-input>
                </el-form-item>
                <el-form-item label="作  者：" prop="author">
                    <el-input v-model="infoForm.author"></el-input>
                </el-form-item>
                <el-form-item label="发布时间：" prop="publishTime">
                    <el-date-picker v-model="infoForm.publishTime" type="datetime" format="yyyy-MM-dd HH:mm" :editable="false"></el-date-picker>
                </el-form-item>
                <el-form-item label="资讯简介：" prop="brief">
                    <el-input type="textarea" v-model="infoForm.brief"></el-input>
                </el-form-item>
                <el-form-item label="类型：" prop="enablePayback">
                    <el-radio-group v-model="infoForm.type">
                        <el-radio label="article">文章</el-radio>
                        <el-radio label="atlas">图集</el-radio>
                    </el-radio-group>
                </el-form-item>
                <div v-if="infoForm.type==='article'">
                    <el-form-item label="资讯内容：" prop="content">
                        <v-richeditor v-model="infoForm.content" ref="richEditor"></v-richeditor>
                    </el-form-item>
                    <el-form-item label="上传附件：">
                        <v-uploadfile :upload="handleUploadFile" @remove="handleRemoveAttach" :filename="infoForm.attachName" ref="uploadfile" @cancelfunction="cancelfunctioncanback"></v-uploadfile>
                    </el-form-item>
                </div>
                <div v-if="infoForm.type ==='atlas'" class="atlas">
                    <div v-for="(item,index) in infoForm.picList" :key="index">
                        <el-button type="danger" @click="removeItem(index)" style="float:right;position:relative;z-index: 2;">x</el-button>
                        <el-form-item label="图片内容：" :prop="'picList.' + index + '.pictureFile'" :rules="{required: true, message: '请输入选项内容', trigger: 'blur'}">
                            <v-cropper class="cover" :index="index" :imgUrl="pictures[index]" :upload="uploadPic" @remove="removePic"></v-cropper>
                        </el-form-item>
                        <el-form-item label="图片描述：">
                            <el-input type="textarea" v-model="item.content"></el-input>
                        </el-form-item>
                    </div>
                    <el-form-item style="float: right">
                        <el-button type="primary" @click="addPicList">添加图片</el-button>
                    </el-form-item>
                </div>
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
    add: { title: '添加资讯', flag: 'Add' },
    edit: { title: '编辑资讯', flag: 'Edit' }
};

export default {
    data() {
        return {
            source: null,
            searchType: "",
            addrAllName: '',
            pictures: [],
            item: '',
            title: DIALOG.add.title,
            flag: DIALOG.add.flag,
            columns: [],
            selectedColumns: ['5a5ff7e4ad1beb2902dbbe74'],
            coverPic: '', // 资讯封面图（非表单）
            pictureFile: '', // 资讯封面图（非表单）
            attach: '', // 资讯附件（非表单）
            treeProps: {
                label: "name",
                children: "children"
            },
            type: {},
            infoForm: {
                picList: [{ pictureFile: '', content: '' }],
                title: '',
                type: 'article',
                column: [],
                source: '',
                author: '',
                publishTime: new Date(),
                content: '',
                attachName: '',
                isPublish: '',
                coverPic: '',
                attach: '',
                brief: '',
                unitId: ""
            },
            rules: {
                title: [vRules.required, vRules.maxLen(100)],
                column: [vRules.requiredCbx],
                content: [vRules.required],
                pictures: [vRules.required_Msg('没有选择封面图片或图片上传中')],
                source: [vRules.required],
                author: [vRules.required]
            }
        }
    },
    methods: {
        addPicList() {
            this.infoForm.picList.push({ pictureFile: '', content: '' });
        },
        uploadPic(formData, index) {
            Api.system.uploadFile(formData, 'pic').then((res) => {
                this.$nextTick(() => {
                    this.infoForm.picList[index].pictureFile = res.url;
                    let pic = Api.system.getFileUrl(res.url);
                    this.$set(this.pictures, index, pic)
                })
            })
        },
        removeItem(index) {
            this.pictures.splice(index, 1);
            this.infoForm.picList.splice(index, 1);
        },
        removePic(index) {
            this.infoForm.picList[index].pictureFile = '';
            // this.pictures.splice(index, 1);
        },
        setSelectedId(val) {
            if (val instanceof Array) {
                this.infoForm.column = val;
            }
        },
        showTreeError(error) {
            this.showTip(error.message, 'info')
        },
        back() {
            this.$router.go(-1);
        },
        // 图片上传
        handleUpload(formData) {
            Api.system.uploadFile(formData, 'pic').then((res) => {
                this.infoForm.coverPic = res.url;
            })
        },
        //取消上传
        cancelfunctioncanback() {
            this.source.cancel('取消上传')
            this.$refs.uploadfile.progressShow = false;
            this.$refs.uploadfile.handleRemove();
            this.$refs.Progress = 0;
            this.handleRemoveAttach();
            this.$refs.fileList = [];
            this.btnload = false;
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
                this.infoForm.attach = res.url;
                this.infoForm.attachName = fileName;
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
            this.infoForm.attachName = '';
            this.infoForm.attach = '';
        },
        // 删除图片
        removeImg() {
            this.infoForm.coverPic = '';
        },
        callback() {
            this.showTip();
            this.back();
        },
        submitForm() {
            let _this=this;
            this.$refs['infoForm'].validate((valid) => {
             debugger;
                if (valid) {
                    let newForm = Object.assign({}, this.infoForm);
                    newForm.publishTime = this.formatDate(newForm.publishTime, 'yyyy-MM-dd HH:mm:ss');
                    newForm.column = newForm.column.map((item) => { return { id: item } });
                    if (newForm.type === 'article') {
                        
                        newForm.picList = [{ pictureFile: '', content: '' }];
                         if (!newForm.brief) {
                            let content= _this.$refs.richEditor.editor.getContentTxt();
                            newForm.brief =  content.length > 130 ?  content.substr(0, 130) :  content;
                        }
                    } else {
                        newForm.content = '';
                        newForm.attach = '';
                        newForm.attachName = '';
                        if (!newForm.brief) {
                            let content=newForm.picList[0].content;
                            newForm.brief = content.length > 130 ? content.substr(0, 130)+'...' : content;
                        }
                    }
                    if (this.flag === DIALOG.add.flag) {
                        newForm.unitId = this.$store.getters.user.orgUnit.id;
                        newForm.dataDeptId = this.$store.getters.user.unit.id;
                        Api.information.addInformation(newForm).then(this.callback);
                    } else if (this.flag === DIALOG.edit.flag) {
                        let id = this.infoForm.id;
                        Api.information.modifyInformation(id, newForm).then(this.callback);
                    }
                }
            });
        },
        getDetail() {
            Api.information.getInformation(this.id).then((info) => {
                let arr = info.picList || [];
                let arr1 = [];
                arr.forEach(c => arr1.push(c.pictureFile));
                for (let i = 0; i < arr1.length; i++) {
                    this.pictures[i] = Api.system.getFileUrl(arr1[i])
                }
                this.coverPic = Api.system.getFileUrl(info.coverPic);
                info.publishTime = this.convertToDate(info.publishTime);
                info.column = info.column.map((item) => { return item.id });
                this.infoForm = info;
            });
        },
        getColumns() {
            Api.information.getColumns('&sort=seqno~asc', 1, -1).then((res) => {
                let topcolumns = res.content.filter(x => x.parent === null);
                let childrenColumns = function(levelColumns, allColumns) {
                    // let columnsData = [];
                    for (let item of levelColumns) {
                        item.children = [];
                        let children = allColumns.filter(x => x.parent && x.parent.id === item.id);
                        if (children.length) {
                            item.children = childrenColumns(children, allColumns);
                        }
                        // columnsData.push({
                        //     id: item.id,
                        //     name: item.name,
                        //     channel: item.channel,
                        //     children: item.children
                        // })
                    }
                    return levelColumns;
                }
                let result = childrenColumns(topcolumns, res.content);

                let channels = [];

                Api.information.getChannels().then((Channelsres) => {
                    channels = Channelsres;
                    let channelColumns = [];
                    channels.forEach(element => {
                        let children = result.filter(i => i.channel === element.value);
                        if (children.length) {
                            channelColumns.push({
                                id: element.value,
                                name: element.label,
                                channel: null,
                                children: children
                            })
                        }
                    });
                    this.columns = channelColumns;
                });

            });
        }
    },
    created() {
        this.getColumns();
    },
    mounted() {
        this.id = this.$route.query.id;
        if (this.id) {
            this.title = DIALOG.edit.title;
            this.flag = DIALOG.edit.flag;
            this.getDetail();
        } else {
            this.infoForm.source = this.$store.getters.user.orgUnit.name;
            // this.infoForm.author = this.$store.getters.user.name;
        }
    }
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
.inforAdd-wrapper {
  .cover {
    width: 375px;
    height: 250px;
  }
  .column-wrapper {
    position: relative;
    height: 200px;
    overflow: auto;
  }
}

/*.atlas {
  padding: 20px 0;
  margin-bottom: 20px;
  margin-top: -10px;
  box-shadow: inset 0 5px 4px -4px rgba(49, 49, 64, 0.1);
  border: 1px solid #ccc;
  .el-form-item:last-child {
    margin-bottom: 0;
  }
}*/
</style>
