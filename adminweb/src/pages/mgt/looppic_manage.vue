<template>
    <div class="tag-wrapper">
        <v-pageheader :breadcrumbs="[{ name: '轮播图管理' }]"></v-pageheader>
        <div class="main-body">
            <div class="center-content table-container">
                <div class="opts">
                    <el-button type="primary" size="small" @click="handleAdd" icon="edit">添加</el-button>
                </div>
                <h5 class="tag_title" style="margin: 0;height: 40px;line-height: 40px;background: #eef1f6;padding-left: 15px;">轮播图内容</h5>
                <el-table :data="currentTag.contents" border stripe v-loading.body="loading" tooltip-effect="custom-effect" key="index">
                    <el-table-column label="序号" type="index" width="80" align="center"></el-table-column>
                    <el-table-column prop="title" label="标题" align="center"></el-table-column>
                    <el-table-column prop="url" label="连接地址URl" align="center"></el-table-column>
                    <el-table-column prop="seqno" label="显示顺序" align="center" width="100px"></el-table-column>
                    <el-table-column label="状态" align="center">
                        <template scope="scope">
                            <el-switch v-model="scope.row.enable" on-text="启用" off-text="停用" :on-value="true" :off-value="false" @change="handleLock(scope.row)"></el-switch>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="340px" align="center">
                        <template scope="scope">
                            <a class="btn-act" @click="handleEdit(scope.row)">编辑</a>
                            <a class="btn-act" @click="handleDel(scope.row)">删除</a>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <div class="tag_list">
            <h5 class="tag_title">轮播图配置</h5>
            <v-scrollbar class="scroll-wrapper" :settings="{useSelectionScroll: true}">
                <ul>
                    <li v-for="(item,index) in dataList" class="tag-item" :class="{'current':currentIndex===index}" :key="item.id" @click="selectTag(index,item)">{{item.name}}</li>
                </ul>
            </v-scrollbar>
        </div>
        <el-dialog :title="title" v-model="dialogVisible" key="1" :close-on-click-modal='false' @close="resetForm('dictForm')">
            <el-form :model="dictForm" ref="dictForm" label-position="top" :rules="rules" class="m-form">
                <el-form-item prop="title" label="标题：">
                    <el-input v-model="dictForm.title"></el-input>
                </el-form-item>
                <el-form-item prop="url" label="URL：">
                    <el-input v-model="dictForm.url"></el-input>
                </el-form-item>
                <el-form-item prop="seqno" label="显示顺序：">
                    <el-input v-model="dictForm.seqno" ></el-input>
                </el-form-item>
                <el-form-item label="图片：" prop="coverPic">
                    <v-uploadimg class="cover" btnTxt="点击选择图片" :imgUrl="coverPic" :upload="handleUpload" @remove="removeImg" :sizecode="sizeCode"></v-uploadimg>
                    <!-- <v-cropper class="cover" :imgUrl="coverPic" btnTxt="点击选择图片" :aspectRatio="3/1" :upload="handleUpload" @remove="removeImg"></v-cropper> -->
                </el-form-item>
                <div class="dialog-footer">
                    <el-button type="primary" @click="submitForm('dictForm')">提交</el-button>
                    <el-button @click="resetForm('dictForm')">取消</el-button>
                    <!-- <el-button @click="resetForm('dictForm')">重置</el-button> -->
                </div>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
import Api from '@/api';
import vRules from '@/config/validate_rules'
import perfectScrollbar from '@/components/scrollbar/perfect-scrollbar'
import _valid from '@/config/validate_rules'
export default {
    components: {
        'v-scrollbar': perfectScrollbar
    },
    data() {
        return {
            loading: false,
            dialogVisible: false,
            title: '',
            flag: '',
            dataList: [],
            type: '',
            coverPic: '',
            sizeCode:'750*500',
            currentIndex: -1,
            currentTag: [],
            dictForm: {
                title: '',
                coverPic: '',
                url: '',
                seqno: '',
                enable: true,
                unitId: "",
            },
            rules: {
                title: [vRules.required, vRules.maxLen(40)],
                seqno: [vRules.required,vRules.numberPattern],
                coverPic: [vRules.required_Msg('没有选择封面图片或图片上传中')],
            }
        }
    },
    methods: {
        showLoading() { this.loading = true; },
        closeLoading() { this.loading = false; },
        loadData() {
            this.showLoading();
            let orgchildren = sessionStorage.getItem('orgchildren');
            Api.system.getLoopPics().then((res) => {
                this.dataList = res.filter((x) => x.name != "微信网站活动预定轮播图");
                if (res && res.length) {
                    this.currentTag = this.dataList[0];
                    this.type = this.dataList[0].type;
                    this.currentIndex = 0;
                    this.selectTag(0, this.dataList[0]);
                }
            }).finally(this.closeLoading);
        },
        // 添加
        handleAdd() {
            this.title = '添加';
            this.dictForm = {
                title: '',
                coverPic: '',
                url: 'http://',
                seqno: '',
                enable: true,
                unitId: sessionStorage.getItem('orgchildren')
            };
            this.dialogVisible = true;
            this.flag = 'add';
        },
        /**
         *  选择触发
         */
        selectTag(index, item) {
            this.currentIndex = index;
            this.type = item.type;
             if(this.type=='h5Volunteer'){
                this.sizeCode='750*375'
             }else{
                this.sizeCode='750*500'
             }
            this.showLoading();
            let orgchildren = sessionStorage.getItem('orgchildren');
            Api.system.getLoopContents(this.type, orgchildren).then((res) => {
                this.currentTag.contents = res;
            }).finally(this.closeLoading);
        },
        /**
        * 上传封面图
        */
        handleUpload(req) {
            // Api.system.uploadFile(formData, 'pic').then((res) => {
            //     this.dictForm.coverPic = res.url;
            // })
            let file = req.file;
            let fileName = file.name;
            var formData = new FormData();
            formData.append('file', file);
            formData.append('filename', fileName)
            return Api.system.uploadFile(formData, 'pic').then((res) => {
                this.dictForm.coverPic = res.url;
                this.coverPic = res.url;
            });
        },
        // 删除图片
        removeImg() {
            this.dictForm.coverPic = '';
        },
        // 重置表单
        resetForm(FormName) {
            if (this.$refs[FormName]) {
                this.$refs[FormName].resetFields();
            }
            this.dictForm = {};
            this.coverPic = '';
            this.dialogVisible = false;
        },
        // 提交
        submitForm(formName) {
            let orgchildren = sessionStorage.getItem('orgchildren');
            this.$refs[formName].validate((valid) => {
                if (this.dictForm.url == "http://") this.dictForm.url = "";
                if (!valid) return;
                if (this.flag === 'add') {
                    Api.system.saveLoopContents(this.type, this.dictForm, orgchildren).then((res) => {
                        this.dialogVisible = false;
                        this.showLoading();
                        let orgchildren = sessionStorage.getItem('orgchildren');
                        Api.system.getLoopContents(this.type, orgchildren).then((res) => {
                            this.currentTag.contents = res;
                        }).finally(this.closeLoading);
                    });
                } else {
                    Api.system.updateLoopContent(this.type, this.dictForm.id, this.dictForm).then((res) => {
                        this.dialogVisible = false;
                        this.showLoading();
                        let orgchildren = sessionStorage.getItem('orgchildren');
                        Api.system.getLoopContents(this.type, orgchildren).then((res) => {

                            this.currentTag.contents = res;
                        }).finally(this.closeLoading);
                    });
                }
            });
        },
        _ShowTip(msg, type = 'success') {
            this.$message({
                message: msg,
                type: type
            });
        },
        // 启用及停用
        handleLock(row) {
            if (row.enable) {
                Api.system.loopContentTrue(this.type, row.id).then((res) => {
                    this._ShowTip('操作成功')
                });
            } else {
                Api.system.loopContentFalse(this.type, row.id).then((res) => {
                    this._ShowTip('操作成功')
                });
            }
        },
        // 删除
        handleDel(row) {
            let self = this;
            self.delConfirm('轮播图', () => {
                Api.system.deleteLoopContent(this.type, row.id).then((res) => {
                    this.showLoading();
                    Api.system.getLoopContents(this.type).then((res) => {
                        this.currentTag.contents = res;
                    }).finally(this.closeLoading);
                });
            });
        },
        // 编辑
        handleEdit(row) {
            this.dictForm = JSON.parse(JSON.stringify(row));
            this.coverPic = Api.system.getFileUrl(row.coverPic);
            this.title = '编辑';
            this.flag = 'edit';
            this.dialogVisible = true;
        }
    },
    mounted() {

        this.loadData();
    }
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
@import "../../styles/mixin.scss";
.tag-wrapper {
  position: relative;
  @include clearfix;
  .main-body {
    width: 100%;
    float: left;
    .center-content {
      margin: 0 0 0 210px;
      .opts {
        margin: 10px 0;
      }
    }
  }
  .cover {
    width: 300px;
    height: 200px;
  }
  .tag_list {
    width: 200px;
    float: left;
    padding-bottom: 30px;
    margin-left: -100%;
    background-color: #eaedf1;
    .tag_title {
      margin: 0;
      line-height: 40px;
      background: darken(#eaedf1, 5%);
      padding-left: 15px;
      border-left: 5px solid;
    }
    .scroll-wrapper {
      position: relative;
      max-height: 700px;
      overflow: auto;
    }
    ul,
    ol {
      list-style: none;
      margin: 0;
      padding: 0;
    }
    .tag-item {
      display: table;
      width: 100%;
      height: 42px;
      font-size: 14px;
      line-height: 42px;
      color: #333;
      text-align: center;
      cursor: pointer;
      &.current {
        background-color: #fff;
      }
    }
  }
}
</style>
