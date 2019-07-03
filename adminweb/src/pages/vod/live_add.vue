<template>
    <div class="edit-wrapper">
        <v-pageheader :breadcrumbs="[{ to:'live',name: '直播管理' },{name:title}]"></v-pageheader>
        <div class="form-wrapper">
            <el-form ref="liveForm" :model="liveForm" :rules="rules" label-position="right" label-width="100px" class="m-form">
                <el-row :gutter="20">
                    <el-col :span="14">
                        <el-form-item label="直播标题：" prop="name">
                            <el-input v-model="liveForm.name"></el-input>
                        </el-form-item>
                        <el-form-item label="封面图片" prop="coverPic">
                          <v-cropper class="cover" btnTxt="请选择封面图片" :imgUrl='coverPic' :upload="handleUpload" @remove="removeImg"></v-cropper>
                          <el-input v-model="liveForm.coverPic" v-show="false"></el-input>
                        </el-form-item>
                        <el-form-item label="允许回放：" prop="enablePayback">
                            <el-radio-group v-model="liveForm.enablePayback">
                            <el-radio :label="true" :key="true" :value="true">是</el-radio>
                            <el-radio :label="false" :key="false" :value="false">否</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="直播时间：" required>
                            <el-form-item prop="startTime">
                              <el-date-picker v-model="liveForm.startTime" type="datetime" format="yyyy-MM-dd HH:mm" placeholder="开始时间" :editable="false"></el-date-picker>
                            </el-form-item>
                        </el-form-item>
                        <el-form-item label="直播分类：" prop="artistTypes">
                          <el-checkbox-group v-model="liveForm.artistTypes">
                            <v-option typeName="videoType" optType="check"></v-option>
                          </el-checkbox-group>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="15">
                  <v-custom-label :label="'视频标签:'" :type="'videoLabel'" @valueChange="labelChange" :initValue="labels"></v-custom-label>
                </el-row>
                <el-form-item label="视频简介：" prop="brief">
                  <el-input v-model="liveForm.brief" type="textarea" :row="3" placeholder="请输入最多100个字的视频简介"></el-input>
                </el-form-item>
                <el-form-item label="视频详情：" prop="content">
                  <v-richeditor v-model="liveForm.content" ref="richEditor"></v-richeditor>
                </el-form-item>
                <div class="u-panel" style="padding-right:0px;">
                  <h5 class="u-title">
                    <span>编辑</span>
                    <div class="u-opres">
                      <el-button type="primary" @click="addDrama" size="small" icon="plus">添加预告视频</el-button>
                    </div>
                  </h5>
                  <div class="table-container">
                    <el-table :data="liveForm.dramas" border stripe>
                      <el-table-column prop="title" label="视频标题"></el-table-column>
                      <el-table-column prop="serial" label="序号"></el-table-column>
                      <el-table-column prop="file" label="视频文件"></el-table-column>
                      <el-table-column label="操作" align="center">
                        <template scope="scope">
                          <a class="btn-act" @click="handleEdit(scope.$index, scope.row)">编辑</a>
                          <a class="btn-act" @click="handleDel(scope.$index, scope.row)">删除</a>
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                </div>
                <div class="form-opres">
                    <el-button @click="back" class="u-btn">返回</el-button>
                    <el-button @click="submitForm" type="primary" class="u-btn">确定</el-button>
                </div>
            </el-form>
        </div>
        <el-dialog :title="digitDialog.title" v-model="dialogVisible"  :close-on-click-modal='false' @close="resetForm('dramaForm')">
          <el-form ref="dramaForm" :model="dramaForm" :rules="dramaRules" label-position="right" label-width="120px">
            <el-form-item label="视频标题：" prop="title">
              <el-input v-model="dramaForm.title"></el-input>
            </el-form-item>
            <el-form-item label="视频封面：" prop="pic">
              <v-cropper class="cover" v-if="dialogVisible" :imgUrl="pic" :upload="uploadImg" @remove="removeDrama"></v-cropper>
            </el-form-item>
            <el-form-item label="序号：" prop="serial">
              <el-input v-model="dramaForm.serial" readonly></el-input>
            </el-form-item>
            <el-form-item label="视频文件：" prop="file">
              <v-uploadfileqt :upload="handleUploadFile" @remove="handleRemoveAttach" :filename="dramaForm.file" :acceptType="acceptType" ref="uploadfile" @cancelfunction="cancelfunctioncanback"></v-uploadfileqt>
              <el-input v-model="dramaForm.file" v-show="false"></el-input>
            </el-form-item>

            <div class="form-opres"  style="text-align:center">
              <!--<el-button @click="resetForm('dramaForm')" class="u-btn">返回</el-button>-->
              <el-button @click="submitDramaForm('dramaForm')" type="primary" class="u-btn">确定</el-button>
            </div>
          </el-form>

        </el-dialog>
        <el-dialog   title="上传进度" class="dialog" v-model="progressShow" :close-on-click-modal="false"   :show-close="false"  style="margin-top:10%;">
                <el-progress :text-inside="true" :stroke-width="18" :percentage="Progress"></el-progress>
              <span slot="footer" class="dialog-footer">
                    <el-button @click="cancelfunctioncanback"  >取 消上传</el-button>
                </span>
         </el-dialog>
    </div>
</template>

<script>
import Api from '@/api'
import axios from 'axios'
import vRules from '@/config/validate_rules';
const DIALOG = {
    add: { title: '新增直播', flag: 'add' },
    edit: { title: '编辑直播', flag: 'edit' }
};
const digitDIALOG = {
  add: { title: '添加', flag: 'Add' },
  edit: { title: '编辑', flag: 'Edit' }
};
export default {
    data() {
        return {
            Progress: "0",
            progressShow: false,
            source: null,
            title: DIALOG.add.title,
            flag: DIALOG.add.flag,
            dialogVisible: false,
            digitDialog: {
              title: digitDIALOG.add.title,
              flag: digitDIALOG.add.flag,
            },
            acceptType: 'video',
            id: '',
            name: '',
            coverPic: '',
            pic: '',
            options: [],
            labels:[],
            dramaForm: {pic:''},
            liveForm: {
                unitId: '',
                labels:[],
                coverPic: '',
                content: '',
                artistTypes:[],
                dramas: [],
                enablePayback:'',
                startTime:'',
            },
            rules: {
                coverPic: [vRules.required],
                name: [vRules.required,vRules.maxLen(40)],
                brief: [vRules.required],
                artistTypes: [vRules.required],
                startTime: [vRules.datarequired],
            },
            dramaRules: {
              title: [vRules.required],
              pic: [vRules.required],
              serial: [vRules.required],
              file: [vRules.required]
            }
        }
    },

    methods: {
        labelChange(val) {
          this.liveForm.labels = JSON.parse(JSON.stringify(val));
        },
        // 上传图片
        handleUpload(formData) {
            Api.system.uploadFile(formData, 'pic').then((res) => {
                this.liveForm.coverPic = res.url;
            })
        },
        // 删除图片
        removeImg() {
            this.liveForm.coverPic = '';
        },
        uploadImg(formData) {
          Api.system.uploadFile(formData, 'pic').then((res) => {
            this.dramaForm.pic = res.url;
          })
        },
        removeDrama(){
          this.dramaForm.pic = '';
        },
        // 添加
        submitForm() {
            let user = this.$store.getters.user;
            this.$refs['liveForm'].validate((valid) => {
                if (valid) {
                    let newForm = Object.assign({}, this.liveForm);
                    newForm.startTime = this.formatDate(newForm.startTime, 'yyyy-MM-dd HH:mm:ss');
                    if (this.flag === DIALOG.add.flag) {
                        newForm.unitId = user.orgUnit.id;
                        newForm.dataDeptId = this.$store.getters.user.unit.id;
                        Api.vod.addLive(newForm).then(this.callback);
                    } else if (this.flag === DIALOG.edit.flag) {
                        Api.vod.editLive(this.id, newForm).then(this.callback);
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
            Api.vod.getLive(this.id).then((res) => {
                if (res.startTime) {
                  res.startTime = this.convertToDate(res.startTime);
                }
                this.liveForm = res;
                this.labels = this.liveForm.labels;
                this.coverPic = Api.system.getFileUrl(res.coverPic);
            });
        },
      // 添加剧集
      addDrama() {
        this.digitDialog = {
          title: digitDIALOG.add.title,
          flag: digitDIALOG.add.flag
        }
        this.dramaForm = Object.assign({}, this.initForm);
        this.dramaForm.serial = this.liveForm.dramas!=null?this.liveForm.dramas.length + 1:1;
        this.Dramas = JSON.parse(JSON.stringify(this.liveForm.dramas));
        this.pic = '';
        this.dialogVisible = true;
      },
      // 编辑剧集
      handleEdit(index, row) {
        this.digitDialog = {
          title: digitDIALOG.edit.title,
          flag: digitDIALOG.edit.flag
        }
        this.dramaForm = Object.assign({}, row);
        this.Dramas = JSON.parse(JSON.stringify(this.liveForm.dramas));
        this.pic = Api.system.getFileUrl(this.Dramas[index].pic);
        this.Dramas.splice(index, 1);
        this.dialogVisible = true;
      },
      // 删除剧集
      handleDel(index, row) {
        let self = this;
        self.delConfirm('剧集', function() {
          self.liveForm.dramas.splice(index, 1);
        });
      },
      //取消上传
      cancelfunctioncanback(){
        this.source.cancel('取消上传')
        this.progressShow=false;
        this.$refs.uploadfile.handleRemove();
        this.$refs.Progress=0;
        this.handleRemoveAttach();
        this.$refs.fileList=[];
      },
      // 附件上传
      handleUploadFile(req) {
        let file = req.file;
        let fileName = file.name;
        let fileSize = (file.size / 1024 / 1024).toFixed(2) + 'M';
        var formData = new FormData();
        formData.append('file', file);
        formData.append('filename', fileName);
        this.progressShow=true;
        this.source = axios.CancelToken.source();
        return Api.system.uploadFile(formData, 'attach',this.onUploadProgress,this.source.token).then((res) => {
          this.dramaForm.file = res.url;
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
        this.dramaForm.file = '';
      },
      submitDramaForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (!valid) return;
          let newForm = JSON.parse(JSON.stringify(this.dramaForm));
          let newDramas = this.Dramas==null?[]:JSON.parse(JSON.stringify(this.Dramas));
          newDramas.push(newForm);
          this.liveForm.dramas = newDramas;
          this.dialogVisible = false;
        })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.dramaForm = {};
      }
    },
    mounted() {
        this.flag = this.$route.query.flag;
        if (this.flag === 'edit') {
            this.id = this.$route.query.id;
            this.title = DIALOG.edit.title;
            this.flag = DIALOG.edit.flag;
            this.getDetail();
        }

    }
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">

</style>

<style type="text/css" lang="scss" rel="stylesheet/scss">

</style>
